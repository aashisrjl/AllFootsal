import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  CreditCard,
  CheckCircle,
  XCircle,
  Globe,
  PhoneCall,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getOwnerBookingById,
  confirmOwnerBooking,
  cancelOwnerBooking,
  unconfirmOwnerBooking,
  rejectOwnerBooking,
} from '../lib/bookingApi';
import { isBookingInPast, normalizeBookingDate } from '../lib/bookingDateUtils';

const DAY_NAMES: Record<number, string> = {
  0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat', 7: 'Sun',
};

const statusStyles: Record<string, string> = {
  confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  cancelled: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  rejected: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <p className="text-[10px] uppercase tracking-wider font-bold text-app-muted">{label}</p>
    <p className="text-sm font-semibold text-app-text mt-0.5">{value ?? '—'}</p>
  </div>
);

const BookingDetail = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadDetail = async () => {
    if (!bookingId) return;
    try {
      setLoading(true);
      const res = await getOwnerBookingById(bookingId);
      if (res.success) setDetail(res.data);
      else toast.error(res.message || 'Booking not found');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load booking');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [bookingId]);

  const runAction = async (fn: () => Promise<unknown>, successMsg: string) => {
    try {
      setActionLoading(true);
      await fn();
      toast.success(successMsg);
      await loadDetail();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="p-6 text-center">
        <p className="text-app-muted font-semibold">Booking not found</p>
        <button
          type="button"
          onClick={() => navigate('/bookings')}
          className="mt-4 text-emerald-400 hover:underline text-sm font-bold"
        >
          Back to bookings
        </button>
      </div>
    );
  }

  const { booking, customer, pitch, timeslot, payment, source } = detail;
  const bookingDateStr = normalizeBookingDate(booking.booking_date);
  const isPast = isBookingInPast(bookingDateStr, timeslot?.end_time);
  const bookingDate = booking.booking_date
    ? new Date(booking.booking_date).toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 p-2 lg:p-0 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/bookings')}
            className="p-2.5 rounded-xl bg-app-surface-solid border border-app-border text-app-muted hover:text-app-heading transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-app-heading">Booking #{booking.id}</h1>
            <p className="text-app-muted text-sm mt-0.5">{bookingDate}</p>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-extrabold uppercase tracking-wider ${
            statusStyles[booking.status] || statusStyles.pending
          }`}
        >
          {booking.status}
        </span>
      </div>

      {/* Source badge */}
      <div
        className={`flex items-center gap-3 p-4 rounded-2xl border ${
          source.isOfflineBooking
            ? 'bg-violet-500/10 border-violet-500/20'
            : 'bg-sky-500/10 border-sky-500/20'
        }`}
      >
        {source.isOfflineBooking ? (
          <PhoneCall className="w-6 h-6 text-violet-400 shrink-0" />
        ) : (
          <Globe className="w-6 h-6 text-sky-400 shrink-0" />
        )}
        <div>
          <p className="text-sm font-bold text-app-heading">{source.label}</p>
          <p className="text-xs text-app-muted mt-0.5">
            {source.isOfflineBooking
              ? 'Created manually by admin (phone call, walk-in, etc.)'
              : 'Booked through the website or app'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer */}
        <section className="bg-app-surface border border-app-border rounded-2xl p-5 lg:p-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-app-muted mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-400" /> Customer
          </h2>
          <div className="space-y-3">
            <InfoRow label="Name" value={customer.name} />
            <InfoRow
              label="Phone"
              value={
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-app-muted" />
                  {customer.phone || 'N/A'}
                </span>
              }
            />
            <InfoRow
              label="Email"
              value={
                source.isOfflineBooking || !customer.email ? (
                  <span className="text-app-muted italic">Walk-in — not linked to app account</span>
                ) : (
                  <span className="flex items-center gap-1.5 break-all">
                    <Mail className="w-3.5 h-3.5 text-app-muted shrink-0" />
                    {customer.email}
                  </span>
                )
              }
            />
          </div>
        </section>

        {/* Pitch & timeslot */}
        <section className="bg-app-surface border border-app-border rounded-2xl p-5 lg:p-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-app-muted mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" /> Pitch &amp; Slot
          </h2>
          <div className="space-y-3">
            <InfoRow label="Pitch" value={pitch.name} />
            <InfoRow label="Type" value={`${pitch.pitch_type} · ${pitch.surface_type || 'Standard'}`} />
            <InfoRow label="Dimensions" value={pitch.dimensions || '—'} />
            <InfoRow
              label="Time"
              value={
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-app-muted" />
                  {timeslot.start_time?.slice(0, 5)} – {timeslot.end_time?.slice(0, 5)}
                  {timeslot.day_of_week != null && (
                    <span className="text-app-muted text-xs">
                      ({DAY_NAMES[Number(timeslot.day_of_week)] ?? `Day ${timeslot.day_of_week}`})
                    </span>
                  )}
                </span>
              }
            />
            <InfoRow label="Rate / hr" value={`Rs ${pitch.price_per_hour}`} />
          </div>
        </section>

        {/* Booking info */}
        <section className="bg-app-surface border border-app-border rounded-2xl p-5 lg:p-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-app-muted mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" /> Booking
          </h2>
          <div className="space-y-3">
            <InfoRow label="Booking ID" value={`#${booking.id}`} />
            <InfoRow label="Date" value={bookingDate} />
            <InfoRow label="Amount" value={<span className="text-emerald-400 font-black">Rs {booking.amount}</span>} />
            <InfoRow label="Created" value={booking.created_at ? new Date(booking.created_at).toLocaleString() : '—'} />
            {booking.notes && (
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-app-muted">Notes</p>
                <p className="text-sm text-app-text mt-1 p-3 bg-app-surface-solid rounded-xl border border-app-border whitespace-pre-wrap">
                  {booking.notes}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Payment */}
        <section className="bg-app-surface border border-app-border rounded-2xl p-5 lg:p-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-app-muted mb-4 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-400" /> Payment
          </h2>
          {payment ? (
            <div className="space-y-3">
              <InfoRow label="Status" value={payment.status} />
              <InfoRow label="Gateway" value={payment.gateway} />
              <InfoRow label="Amount" value={`Rs ${payment.amount}`} />
              {payment.provider_order_id && (
                <InfoRow label="Order ID" value={payment.provider_order_id} />
              )}
              {payment.provider_txn_id && (
                <InfoRow label="Transaction ID" value={payment.provider_txn_id} />
              )}
              <InfoRow
                label="Paid at"
                value={
                  payment.verified_at
                    ? new Date(payment.verified_at).toLocaleString()
                    : 'Not verified yet'
                }
              />
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-app-muted text-sm font-semibold">No payment record</p>
              <p className="text-app-muted text-xs mt-1">
                {source.isOfflineBooking
                  ? 'Common for cash / phone bookings'
                  : 'Payment may still be pending'}
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Actions */}
      {isPast ? (
        <p className="text-sm text-app-muted border border-app-border rounded-xl px-4 py-3 bg-app-surface">
          This booking&apos;s date or timeslot has passed. Confirm, reject, cancel, and unconfirm are not available.
        </p>
      ) : (
      <div className="flex flex-wrap gap-3 pt-2">
        {booking.status === 'pending' && (
          <>
            <button
              type="button"
              disabled={actionLoading}
              onClick={() => runAction(() => confirmOwnerBooking(booking.id), 'Booking confirmed')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-400 disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" /> Confirm
            </button>
            <button
              type="button"
              disabled={actionLoading}
              onClick={() => {
                const reason = window.prompt('Rejection reason (optional):') ?? '';
                runAction(() => rejectOwnerBooking(booking.id, reason), 'Booking rejected');
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold text-sm hover:bg-rose-500 hover:text-white disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" /> Reject
            </button>
          </>
        )}
        {booking.status === 'confirmed' && (
          <>
            <button
              type="button"
              disabled={actionLoading}
              onClick={() => runAction(() => unconfirmOwnerBooking(booking.id), 'Marked as pending')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold text-sm"
            >
              Mark pending
            </button>
            <button
              type="button"
              disabled={actionLoading}
              onClick={() => runAction(() => cancelOwnerBooking(booking.id), 'Booking cancelled')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold text-sm"
            >
              Cancel booking
            </button>
          </>
        )}
      </div>
      )}
    </div>
  );
};

export default BookingDetail;
