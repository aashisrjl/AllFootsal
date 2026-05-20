import { useEffect, useState } from 'react';
import { X, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { createOfflineBooking } from '../lib/bookingApi';
import { getLocalDateString, isBookingDateBeforeToday, isBookingInPast } from '../lib/bookingDateUtils';
import { getFutsalPitches } from '../lib/pitchApi';
import { getFutsalTimeslots } from '../lib/timeslotApi';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  futsalId: string | number;
  onCreated: () => void;
};

const dateToDayOfWeek = (dateStr: string) => {
  const jsDay = new Date(`${dateStr}T12:00:00`).getDay();
  return jsDay === 0 ? 7 : jsDay;
};

export default function OfflineBookingModal({ isOpen, onClose, futsalId, onCreated }: Props) {
  const [pitches, setPitches] = useState<any[]>([]);
  const [timeslots, setTimeslots] = useState<any[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    phoneNumber: '',
    customerName: '',
    pitch_id: '',
    timeslot_id: '',
    booking_date: new Date().toISOString().split('T')[0],
    amount: '',
    description: '',
    status: 'confirmed' as 'pending' | 'confirmed' | 'completed',
  });

  useEffect(() => {
    if (!isOpen || !futsalId) return;
    (async () => {
      try {
        const res = await getFutsalPitches(futsalId);
        if (res.success) setPitches(res.data || []);
      } catch {
        toast.error('Failed to load pitches');
      }
    })();
  }, [isOpen, futsalId]);

  useEffect(() => {
    if (!isOpen || !form.pitch_id || !form.booking_date) {
      setTimeslots([]);
      return;
    }
    (async () => {
      try {
        setLoadingSlots(true);
        const res = await getFutsalTimeslots({
          futsalId,
          pitchId: form.pitch_id,
          dayOfWeek: dateToDayOfWeek(form.booking_date),
          date: form.booking_date,
        });
        setTimeslots(res.timeslots || []);
      } catch {
        setTimeslots([]);
      } finally {
        setLoadingSlots(false);
      }
    })();
  }, [isOpen, futsalId, form.pitch_id, form.booking_date]);

  useEffect(() => {
    if (!form.timeslot_id) return;
    const slot = timeslots.find((t) => String(t.id) === String(form.timeslot_id));
    if (slot?.price) setForm((prev) => ({ ...prev, amount: String(slot.price) }));
  }, [form.timeslot_id, timeslots]);

  const today = getLocalDateString();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.phoneNumber || !form.pitch_id || !form.timeslot_id || !form.booking_date || !form.amount) {
      toast.error('Phone, pitch, timeslot, date and amount are required');
      return;
    }
    if (isBookingDateBeforeToday(form.booking_date)) {
      toast.error('Cannot create a booking for a past date');
      return;
    }
    const amountNum = Number(form.amount);
    if (!Number.isFinite(amountNum) || amountNum < 0) {
      toast.error('Enter a valid amount');
      return;
    }
    const phoneDigits = form.phoneNumber.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      toast.error('Enter a valid 10-digit phone number');
      return;
    }
    try {
      setSubmitting(true);
      await createOfflineBooking({
        phoneNumber: form.phoneNumber,
        customerName: form.customerName || undefined,
        pitch_id: Number(form.pitch_id),
        timeslot_id: Number(form.timeslot_id),
        booking_date: form.booking_date,
        amount: Number(form.amount),
        description: form.description || undefined,
        status: form.status,
      });
      toast.success('Walk-in booking created');
      onCreated();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const availableSlots = timeslots.filter((slot) => {
    if (slot.is_actually_booked || (slot.is_available !== 1 && slot.is_available !== true)) {
      return false;
    }
    if (form.booking_date && slot.start_time) {
      if (isBookingInPast(form.booking_date, slot.start_time)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg bg-app-surface-solid border border-app-border rounded-2xl shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-app-heading">Add Phone / Walk-in Booking</h2>
            <p className="text-sm text-app-muted mt-1">For customers who book by phone or in person</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-app-surface-solid text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-app-muted uppercase">Phone *</label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="tel" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} placeholder="98XXXXXXXX" className="w-full pl-10 pr-3 py-2.5 bg-app-input border border-app-border-subtle rounded-xl text-app-text text-sm outline-none focus:ring-2 focus:ring-emerald-500/40" required />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-app-muted uppercase">Customer name</label>
              <input type="text" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} placeholder="Optional" className="w-full mt-1 px-3 py-2.5 bg-app-input border border-app-border-subtle rounded-xl text-app-text text-sm outline-none focus:ring-2 focus:ring-emerald-500/40" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-app-muted uppercase">Pitch *</label>
            <select value={form.pitch_id} onChange={(e) => setForm({ ...form, pitch_id: e.target.value, timeslot_id: '', amount: '' })} className="w-full mt-1 px-3 py-2.5 bg-app-input border border-app-border-subtle rounded-xl text-app-text text-sm outline-none" required>
              <option value="">Select pitch</option>
              {pitches.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-app-muted uppercase">Date *</label>
              <input type="date" min={today} value={form.booking_date} onChange={(e) => setForm({ ...form, booking_date: e.target.value, timeslot_id: '', amount: '' })} className="w-full mt-1 px-3 py-2.5 bg-app-input border border-app-border-subtle rounded-xl text-app-text text-sm outline-none" required />
            </div>
            <div>
              <label className="text-xs font-semibold text-app-muted uppercase">Timeslot *</label>
              <select value={form.timeslot_id} onChange={(e) => setForm({ ...form, timeslot_id: e.target.value })} className="w-full mt-1 px-3 py-2.5 bg-app-input border border-app-border-subtle rounded-xl text-app-text text-sm outline-none" required disabled={!form.pitch_id || loadingSlots}>
                <option value="">{loadingSlots ? 'Loading...' : 'Select timeslot'}</option>
                {availableSlots.map((slot) => (<option key={slot.id} value={slot.id}>{slot.start_time} - {slot.end_time}</option>))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-app-muted uppercase">Amount (Rs) *</label>
              <input type="number" min="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full mt-1 px-3 py-2.5 bg-app-input border border-app-border-subtle rounded-xl text-app-text text-sm outline-none" required />
            </div>
            <div>
              <label className="text-xs font-semibold text-app-muted uppercase">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as typeof form.status })} className="w-full mt-1 px-3 py-2.5 bg-app-input border border-app-border-subtle rounded-xl text-app-text text-sm outline-none">
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-app-muted uppercase">Description / notes</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Paid cash, booked via phone..." rows={3} className="w-full mt-1 px-3 py-2.5 bg-app-input border border-app-border-subtle rounded-xl text-app-text text-sm outline-none resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-app-border-subtle text-app-text font-semibold hover:bg-app-surface-solid">Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-400 disabled:opacity-50">{submitting ? 'Creating...' : 'Create Booking'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
