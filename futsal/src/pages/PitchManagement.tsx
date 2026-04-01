import React from 'react';
import { MapPin, Plus, Edit, ToggleLeft, ToggleRight, Wrench } from 'lucide-react';

const PitchManagement = () => {
  const pitches = [
    { id: 1, name: 'Pitch A', pricePerHour: 50, isActive: true, surface: 'Artificial Grass', size: '40m x 20m', bookingsToday: 6, revenue: 300, isUnderMaintenance: false },
    { id: 2, name: 'Pitch B', pricePerHour: 45, isActive: true, surface: 'Artificial Grass', size: '35m x 20m', bookingsToday: 4, revenue: 180, isUnderMaintenance: false },
    { id: 3, name: 'Pitch C', pricePerHour: 40, isActive: false, surface: 'Concrete', size: '30m x 18m', bookingsToday: 0, revenue: 0, isUnderMaintenance: true },
  ];

  const togglePitchStatus = (id: number) => { console.log(`Toggle pitch ${id} status`); };
  const editPitch = (id: number) => { console.log(`Edit pitch ${id}`); };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Pitch Management</h1>
           <p className="text-slate-400 mt-1 text-sm font-medium">Add, configure, and maintain your futsal pitches.</p>
        </div>
        <button className="flex items-center px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:-translate-y-0.5 active:translate-y-0">
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
          { icon: null, textIcon: "$", color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: "Today's Revenue", val: `$${pitches.reduce((sum, p) => sum + p.revenue, 0)}` },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl p-6 transition-all hover:-translate-y-1 hover:border-slate-700 hover:shadow-2xl">
             <div className="flex items-center">
              {stat.icon ? (
                <div className={`p-3.5 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              ) : (
                <div className={`h-14 w-14 ${stat.bg} rounded-xl flex items-center justify-center border border-transparent`}>
                  <span className={`text-2xl font-black ${stat.color}`}>{stat.textIcon}</span>
                </div>
              )}
              <div className="ml-5">
                <p className="text-sm font-semibold text-slate-400 mb-0.5 tracking-wide">{stat.label}</p>
                <p className="text-3xl font-black text-white tracking-tight">{stat.val}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pitches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pitches.map((pitch) => (
          <div key={pitch.id} className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl overflow-hidden group hover:border-slate-700 hover:shadow-2xl transition-all">
            <div className="p-6 pb-7 relative flex flex-col h-full">
              {pitch.isActive && <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] group-hover:bg-emerald-500/15 rounded-full transition-all duration-700 pointer-events-none" />}
              
              <div className="flex items-center justify-between mb-8 relative z-10">
                <h3 className="text-2xl font-black text-white tracking-tight flex items-center">
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
                      onClick={() => togglePitchStatus(pitch.id)}
                      className="flex items-center"
                    >
                      {pitch.isActive ? (
                        <ToggleRight className="h-10 w-10 text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)] transition-all hover:scale-105" />
                      ) : (
                        <ToggleLeft className="h-10 w-10 text-slate-600 hover:text-slate-500 transition-colors" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8 relative z-10 flex-1">
                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/50 shadow-inner flex flex-col justify-center">
                  <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Price / Hr</span>
                  <span className="text-xl font-black text-emerald-400">${pitch.pricePerHour}</span>
                </div>
                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/50 shadow-inner flex flex-col justify-center">
                  <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Daily Revenue</span>
                   <span className="text-xl font-black text-white">${pitch.revenue}</span>
                </div>
                
                <div className="col-span-2 flex flex-col gap-3 mt-2">
                  <div className="flex justify-between items-center py-2.5 border-b border-slate-800/80">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Surface Type</span>
                    <span className="text-sm font-bold text-slate-200">{pitch.surface}</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 border-b border-slate-800/80">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Dimensions</span>
                    <span className="text-[11px] font-black text-slate-300 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">{pitch.size}</span>
                  </div>
                   <div className="flex justify-between items-center py-2.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Today's Bookings</span>
                    <span className="text-sm font-black text-white px-2.5 py-0.5 bg-slate-800 rounded-md">{pitch.bookingsToday}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 relative z-10 mt-auto pt-2">
                <button
                  onClick={() => editPitch(pitch.id)}
                  className="flex-[1] flex items-center justify-center px-4 py-3 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-bold transition-all border border-slate-700 hover:text-white"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </button>
                <button className="flex-[1.5] px-4 py-3 bg-slate-800/40 text-emerald-400 border border-emerald-500/20 rounded-xl text-sm font-bold hover:bg-emerald-500 hover:text-white transition-all">
                  Schedule
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PitchManagement;