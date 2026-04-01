import React, { useState } from 'react';
import { Calendar, Search, Filter, CheckCircle, XCircle, Clock, ChevronDown } from 'lucide-react';

const BookingManagement = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState('all');

  const bookings = [
    { id: 1, customerName: 'John Smith', pitch: 'Pitch A', date: '2024-01-20', time: '10:00 - 11:00', status: 'confirmed', price: 50, phone: '+1 (555) 123-4567' },
    { id: 2, customerName: 'Team Alpha', pitch: 'Pitch B', date: '2024-01-20', time: '14:00 - 15:00', status: 'pending', price: 45, phone: '+1 (555) 987-6543' },
    { id: 3, customerName: 'Mike Johnson', pitch: 'Pitch A', date: '2024-01-20', time: '16:00 - 17:00', status: 'completed', price: 50, phone: '+1 (555) 456-7890' },
    { id: 4, customerName: 'Sarah Wilson', pitch: 'Pitch C', date: '2024-01-20', time: '18:00 - 19:00', status: 'cancelled', price: 40, phone: '+1 (555) 321-0987' },
  ];

  const filteredBookings = statusFilter === 'all' ? bookings : bookings.filter(booking => booking.status === statusFilter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4 text-emerald-400" />;
      case 'pending': return <Clock className="h-4 w-4 text-amber-400" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-rose-400" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-blue-400" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'cancelled': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'completed': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Booking Management</h1>
           <p className="text-slate-400 mt-1 text-sm font-medium">Manage reservations and daily schedules.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2.5 font-medium bg-slate-900/60 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none [&::-webkit-calendar-picker-indicator]:filter-[invert(1)] hover:border-slate-600 transition-colors shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Today's Bookings", val: bookings.length, icon: Calendar, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Confirmed", val: bookings.filter(b => b.status === 'confirmed').length, icon: CheckCircle, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Pending", val: bookings.filter(b => b.status === 'pending').length, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
          { label: "Today's Revenue", val: `$${bookings.reduce((sum, b) => sum + (b.status !== 'cancelled' ? b.price : 0), 0)}`, icon: null, textIcon: "$", color: "text-emerald-400", bg: "bg-emerald-500/10" }
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl p-6 transition-all hover:-translate-y-1 hover:border-slate-700 hover:shadow-2xl relative overflow-hidden group">
            <div className={`absolute -right-6 -top-6 w-32 h-32 blur-3xl rounded-full ${stat.bg} opacity-50 group-hover:opacity-100 transition-opacity`} />
            <div className="flex items-center relative z-10">
              {stat.icon ? (
                <div className={`p-3.5 rounded-xl ${stat.bg} border border-transparent`}>
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

      {/* Table Container */}
      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col pt-1">
        <div className="p-6 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-xl font-bold text-white tracking-tight">Today's Schedule</h3>
          
          <div className="flex items-center space-x-3 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800 shadow-inner">
            <Filter className="h-4 w-4 text-emerald-400 ml-3 shrink-0" />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-sm font-bold text-slate-200 pr-5 py-1 border-none focus:outline-none focus:ring-0 cursor-pointer appearance-none w-full"
            >
              <option value="all" className="bg-slate-900 text-white font-medium">All Statuses</option>
              <option value="pending" className="bg-slate-900 text-white font-medium">Pending Only</option>
              <option value="confirmed" className="bg-slate-900 text-white font-medium">Confirmed Only</option>
              <option value="completed" className="bg-slate-900 text-white font-medium">Completed Only</option>
              <option value="cancelled" className="bg-slate-900 text-white font-medium">Cancelled Only</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800/80">
            <thead className="bg-slate-900/60 border-b border-slate-800">
              <tr>
                {["Customer Info", "Pitch", "Time Slot", "Status", "Price", "Actions"].map((th) => (
                   <th key={th} className="px-6 py-4 text-left text-[11px] font-black tracking-widest text-slate-500 uppercase">
                     {th}
                   </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 bg-transparent">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-800/40 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">{booking.customerName}</div>
                      <div className="text-[11px] font-semibold tracking-wide text-slate-500 mt-1">{booking.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-300">
                    <span className="bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">{booking.pitch}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-400">
                    <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-slate-500"/> {booking.time}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-wider font-extrabold rounded-lg border ${getStatusColor(booking.status)} shadow-lg`}>
                        {getStatusIcon(booking.status)}
                        {booking.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-emerald-400">
                    ${booking.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-bold space-x-3">
                    {booking.status === 'pending' && (
                      <div className="flex gap-2">
                        <button className="bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all">Confirm</button>
                        <button className="bg-rose-500/10 text-rose-400 px-3 py-1.5 rounded-lg border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all">Reject</button>
                      </div>
                    )}
                    {booking.status === 'confirmed' && (
                      <button className="bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-lg border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all">Mark Complete</button>
                    )}
                    {booking.status !== 'pending' && booking.status !== 'confirmed' && (
                      <button className="text-slate-400 hover:text-white underline decoration-slate-600 underline-offset-4 transition-colors">Details</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredBookings.length === 0 && (
             <div className="p-12 text-center flex flex-col items-center justify-center border-t border-slate-800/80">
               <Calendar className="w-12 h-12 text-slate-700 mb-4" />
               <p className="text-slate-400 font-bold text-lg">No bookings found for this filter.</p>
               <p className="text-slate-500 text-sm mt-1">Try selecting a different status or date.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingManagement;