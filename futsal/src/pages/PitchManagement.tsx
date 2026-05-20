import { useState, useEffect } from 'react';
import { MapPin, Plus, Edit, ToggleLeft, ToggleRight, Wrench, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import PitchModal from '../components/PitchModal';
import ScheduleModal from '../components/ScheduleModal';
import { updatePitch } from '../lib/pitchApi';
import API from '@/lib/api';

const PitchManagement = () => {
  const { futsalProfile } = useAuth();
  const [pitches, setPitches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedPitch, setSelectedPitch] = useState<any>(null);

  const fetchPitches = async () => {
    if (!futsalProfile?.id) return;
    try {
      setLoading(true);
      const [pitchesRes, bookingsRes] = await Promise.all([
        API.get(`/futsal/${futsalProfile.id}/pitches`),
        API.get('/futsal-bookings').catch(() => null)
      ]);

      let pitchStats: any = {};
      if (bookingsRes?.data?.success) {
         const bookings = bookingsRes.data.data;
         const todayDate = new Date().toISOString().split('T')[0];
          bookings.forEach((b: any) => {
            // Note: pitch_name matches backend fallback, occasionally backend provides pitch_id or pitch_name
            const pId = b.pitch_id || b.pitch_name; 
            if (!pitchStats[pId]) {
               pitchStats[pId] = { bookingsToday: 0, revenue: 0 };
            }
            if (b.status !== 'cancelled') {
               const bDate = b.booking_date?.split('T')[0];
               if (bDate === todayDate) {
                 pitchStats[pId].bookingsToday += 1;
                 pitchStats[pId].revenue += Number(b.amount || 0);
               }
            }
          });
      }

      if (pitchesRes.data.success) {
        const mappedPitches = pitchesRes.data.data.map((p: any) => ({
          ...p,
          pricePerHour: p.price_per_hour,
          isActive: p.is_active === 1 || p.is_active === true,
          surface: p.surface_type || 'N/A',
          size: p.dimensions || 'N/A',
          bookingsToday: pitchStats[p.id]?.bookingsToday || pitchStats[p.name]?.bookingsToday || 0,
          revenue: pitchStats[p.id]?.revenue || pitchStats[p.name]?.revenue || 0,
          isUnderMaintenance: false
        }));
        setPitches(mappedPitches);
      }
    } catch (error) {
      console.error('Failed to fetch pitches', error);
      setPitches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePitch = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this pitch?")) return;

    const toastId = toast.loading("Deleting pitch...");
    try {
      const token = localStorage.getItem('token');
      const apiBaseUrl = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';
      
      const response = await fetch(`${apiBaseUrl}/futsal/pitch/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        toast.dismiss(toastId);
        toast.error('Failed to delete pitch');
        return;
      }

      toast.dismiss(toastId);
      toast.success('Pitch deleted successfully');
      fetchPitches();
    } catch (error: any) {
      toast.dismiss(toastId);
      const errorMsg = error?.message || 'Error deleting pitch';
      toast.error(errorMsg);
    }
  };

  useEffect(() => {
    fetchPitches();
  }, [futsalProfile]);

  const togglePitchStatus = async (pitch: any) => {
    const toastId = toast.loading("Updating pitch status...");
    try {
      const updatedStatus = !pitch.isActive;
      // Optimistic update
      setPitches(pitches.map(p => p.id === pitch.id ? { ...p, isActive: updatedStatus } : p));
      
      await updatePitch(pitch.id, {
        ...pitch,
        is_active: updatedStatus ? 1 : 0
      });
      toast.dismiss(toastId);
      toast.success(updatedStatus ? "Pitch activated" : "Pitch deactivated");
    } catch (error: any) {
      toast.dismiss(toastId);
      const errorMsg = error?.message || 'Failed to update pitch status';
      toast.error(errorMsg);
      // Revert if failed
      fetchPitches();
    }
  };

  const editPitch = (pitch: any) => { 
    setSelectedPitch(pitch);
    setIsPitchModalOpen(true);
  };

  const schedulePitch = (pitch: any) => {
    setSelectedPitch(pitch);
    setIsScheduleModalOpen(true);
  };

  const handleAddPitchClick = () => {
    setSelectedPitch(null);
    setIsPitchModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">Pitch Management</h1>
           <p className="text-app-muted mt-1 text-sm font-medium">Add, configure, and maintain your futsal pitches.</p>
        </div>
        <button onClick={handleAddPitchClick} className="flex items-center px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:-translate-y-0.5 active:translate-y-0">
          <Plus className="h-5 w-5 mr-1" />
          Add Pitch
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: MapPin, color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Total Pitches', val: pitches.length },
          { icon: ToggleRight, color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Active Pitches', val: pitches.filter(p => p.isActive).length },
          { icon: Wrench, color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Maintenance', val: pitches.filter(p => p.isUnderMaintenance).length },
          { icon: null, textIcon: "Rs", color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: "Today's Revenue", val: `Rs ${pitches.reduce((sum, p) => sum + p.revenue, 0)}` },
        ].map((stat, i) => (
          <div key={i} className="bg-app-surface backdrop-blur-xl border border-app-border rounded-2xl shadow-xl p-6 transition-all hover:-translate-y-1 hover:border-app-border-subtle hover:shadow-2xl">
             <div className="flex items-center">
              {stat.icon ? (
                <div className={`p-3.5 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              ) : (
                <div className={`h-14 w-14 ${stat.bg} rounded-xl flex items-center justify-center border border-transparent`}>
                  <span className={`text-lg font-black ${stat.color}`}>{stat.textIcon}</span>
                </div>
              )}
              <div className="ml-5">
                <p className="text-sm font-semibold text-app-muted mb-0.5 tracking-wide">{stat.label}</p>
                <p className="text-3xl font-black text-app-heading tracking-tight">{stat.val}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pitches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pitches.map((pitch) => (
          <div key={pitch.id} className="bg-app-surface backdrop-blur-xl border border-app-border rounded-2xl shadow-xl overflow-hidden group hover:border-app-border-subtle hover:shadow-2xl transition-all">
            <div className="p-6 pb-7 relative flex flex-col h-full">
              {pitch.isActive && <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] group-hover:bg-emerald-500/15 rounded-full transition-all duration-700 pointer-events-none" />}
              
              <div className="flex items-center justify-between mb-8 relative z-10">
                <h3 className="text-2xl font-black text-app-heading tracking-tight flex items-center">
                   {pitch.name}
                   {pitch.isActive && <span className="ml-3 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse"></span>}
                </h3>
                <div className="flex items-center space-x-2">
                  {pitch.isUnderMaintenance ? (
                    <span className="px-3 py-1.5 text-[10px] uppercase font-black tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg flex items-center">
                      <Wrench className="w-3.5 h-3.5 mr-1.5" /> Maint.
                    </span>
                  ) : (
                    <button
                      onClick={() => togglePitchStatus(pitch)}
                      className="flex items-center"
                    >
                      {pitch.isActive ? (
                        <ToggleRight className="h-10 w-10 text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)] transition-all hover:scale-105" />
                      ) : (
                        <ToggleLeft className="h-10 w-10 text-slate-600 hover:text-app-muted transition-colors" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8 relative z-10 flex-1">
                <div className="bg-app-input p-4 rounded-xl border border-app-border shadow-inner flex flex-col justify-center">
                  <span className="block text-[10px] font-black text-app-muted uppercase tracking-widest mb-1.5">Price / Hr</span>
                  <span className="text-xl font-black text-emerald-400">Rs {pitch.pricePerHour}</span>
                </div>
                <div className="bg-app-input p-4 rounded-xl border border-app-border shadow-inner flex flex-col justify-center">
                  <span className="block text-[10px] font-black text-app-muted uppercase tracking-widest mb-1.5">Daily Revenue</span>
                   <span className="text-xl font-black text-app-heading">Rs {pitch.revenue}</span>
                </div>
                
                <div className="col-span-2 flex flex-col gap-3 mt-2">
                  <div className="flex justify-between items-center py-2.5 border-b border-app-border">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Surface Type</span>
                    <span className="text-sm font-bold text-app-text">{pitch.surface}</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 border-b border-app-border">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Dimensions</span>
                     <span className="text-[11px] font-black text-app-text bg-app-surface-solid px-2.5 py-1 rounded-md border border-app-border-subtle">{pitch.size}</span>
                  </div>
                   <div className="flex justify-between items-center py-2.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Today's Bookings</span>
                     <span className="text-sm font-black text-app-heading px-2.5 py-0.5 bg-app-input rounded-md">{pitch.bookingsToday}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 relative z-10 mt-auto pt-2">
                <button
                  onClick={() => editPitch(pitch)}
                  className="flex-1 flex items-center justify-center px-2 py-3 bg-app-surface-solid hover:bg-app-border text-app-text rounded-xl text-sm font-bold transition-all border border-app-border-subtle"
                >
                  <Edit className="h-4 w-4 mr-1.5" />
                  Edit
                </button>
                <button onClick={() => schedulePitch(pitch)} className="flex-1 px-2 py-3 bg-app-surface-solid text-emerald-400 border border-emerald-500/20 rounded-xl text-sm font-bold hover:bg-emerald-500 hover:text-white transition-all">
                  Schedule
                </button>
                <button onClick={() => handleDeletePitch(pitch.id)} className="flex items-center justify-center px-4 py-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl text-sm hover:bg-rose-500 hover:text-white transition-all" title="Delete Pitch">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <PitchModal 
        isOpen={isPitchModalOpen} 
        onClose={() => setIsPitchModalOpen(false)} 
        pitch={selectedPitch} 
        onSaved={fetchPitches} 
      />
      <ScheduleModal 
        isOpen={isScheduleModalOpen} 
        onClose={() => setIsScheduleModalOpen(false)} 
        pitch={selectedPitch} 
        futsalId={futsalProfile?.id}
      />
    </div>
  );
};

export default PitchManagement;