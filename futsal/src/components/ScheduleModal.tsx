import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Clock } from 'lucide-react';
import api from '../lib/api';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ScheduleModal({ isOpen, onClose, pitch, futsalId }: any) {
  const [day, setDay] = useState(1);
  const [timeslots, setTimeslots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  
  const [newSlot, setNewSlot] = useState({ start_time: '08:00', end_time: '09:00', price: '', is_available: true });

  const fetchSchedule = async () => {
    if (!pitch || !futsalId) return;
    try {
      setLoading(true);
      const res = await api.get(`/futsal/${futsalId}/timeslots?pitch_id=${pitch.id}&day_of_week=${day}`);
      if (res.data.timeslots) {
        setTimeslots(res.data.timeslots);
      }
    } catch (err) {
      console.error(err);
      setTimeslots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && pitch) {
      fetchSchedule();
    }
  }, [isOpen, pitch, day]);

  const handleAddSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setAdding(true);
      const payload = {
        ...newSlot,
        pitch_id: pitch.id,
        day_of_week: day,
        price: newSlot.price || pitch.pricePerHour || pitch.price_per_hour
      };
      await api.post('/futsal/timeslots/create', payload);
      setNewSlot({ start_time: '', end_time: '', price: '', is_available: true });
      fetchSchedule();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to add timeslot');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this timeslot?')) return;
    try {
      await api.delete(`/futsal/timeslots/delete/${id}`);
      fetchSchedule();
    } catch (err) {
      console.error(err);
      alert('Failed to delete timeslot');
    }
  };

  if (!isOpen || !pitch) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/80">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center">
               <Clock className="w-5 h-5 mr-2 text-emerald-500" />
               Manage Schedule
            </h2>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">Pitch: {pitch.name}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex border-b border-slate-800 overflow-x-auto no-scrollbar">
          {DAYS.map((d, index) => (
            <button
              key={d}
              onClick={() => setDay(index + 1)}
              className={`px-4 py-3 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
                day === index + 1 ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5 bg-slate-900/40">
          <form onSubmit={handleAddSubmit} className="flex gap-3 mb-6 p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl items-end">
            <div className="flex-1">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Start Time</label>
              <input required type="time" value={newSlot.start_time} onChange={e => setNewSlot({...newSlot, start_time: e.target.value})} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg text-sm" />
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">End Time</label>
              <input required type="time" value={newSlot.end_time} onChange={e => setNewSlot({...newSlot, end_time: e.target.value})} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg text-sm" />
            </div>
            <div className="w-24">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Price ($)</label>
              <input type="number" placeholder={pitch.pricePerHour?.toString() || '0'} value={newSlot.price} onChange={e => setNewSlot({...newSlot, price: e.target.value})} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg text-sm placeholder:text-slate-600" />
            </div>
            <button disabled={adding} type="submit" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold rounded-lg transition-colors flex items-center h-[38px]">
              <Plus className="w-4 h-4 mr-1" /> Add
            </button>
          </form>

          {loading ? (
            <div className="py-8 text-center text-slate-500 font-medium">Loading slots...</div>
          ) : timeslots.length === 0 ? (
            <div className="py-8 text-center text-slate-500 font-medium border border-dashed border-slate-700 rounded-xl">No timeslots scheduled for {DAYS[day-1]}</div>
          ) : (
            <div className="space-y-2">
              {timeslots.map(slot => (
                <div key={slot.id} className="flex items-center justify-between p-3.5 bg-slate-800/80 border border-slate-700 rounded-xl hover:border-slate-600 transition-colors group">
                  <div className="flex items-center gap-4">
                    <span className="font-black text-white text-lg tracking-tight bg-slate-900 px-3 py-1 rounded-lg border border-slate-700/50 shadow-inner">
                      {slot.start_time.substring(0, 5)} <span className="text-slate-500 font-medium text-sm mx-1">to</span> {slot.end_time.substring(0, 5)}
                    </span>
                    <span className="text-sm font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      ${slot.price}
                    </span>
                    {slot.is_available === 0 && <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Booked</span>}
                  </div>
                  <button onClick={() => handleDelete(slot.id)} className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
