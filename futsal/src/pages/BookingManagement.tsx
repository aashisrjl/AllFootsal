import { useState, useEffect } from 'react';
import { Calendar, Filter, CheckCircle, XCircle, Clock } from 'lucide-react';
import { cancelOwnerBooking, confirmOwnerBooking, getOwnerBookings, unconfirmOwnerBooking } from '../lib/bookingApi';
import { toast } from 'sonner';

const BookingManagement = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getOwnerBookings();
      if (res.success) {
        const mapped = res.data.map((b: any) => ({
          id: b.id,
          customerName: b.user_name || 'Guest',
          pitch: b.pitch_name,
          date: b.booking_date ? new Date(b.booking_date).toISOString().split('T')[0] : 'N/A',
          time: `${b.start_time || ''} - ${b.end_time || ''}`,
          status: b.status || 'pending',
          price: b.amount || 0,
          phone: b.phone || 'N/A'
        }));
        setBookings(mapped);
      }
    } catch (error) {
      console.error('Failed to fetch bookings', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id: number) => {
    try {
      // Optimistic
      setBookings(bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
      await cancelOwnerBooking(id);
      toast.success('Booking cancelled successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
      fetchBookings(); // revert
    }
  };

  const handleConfirmBooking = async (id: number) => {
    try {
      // Optimistic
      setBookings(bookings.map(b => b.id === id ? { ...b, status: 'confirmed' } : b));
      await confirmOwnerBooking(id);
      toast.success('Booking confirmed');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to confirm booking');
      fetchBookings(); // revert
    }
  };

  const handleUnconfirmBooking = async (id: number) => {
    try {
      // Optimistic
      setBookings(bookings.map(b => b.id === id ? { ...b, status: 'pending' } : b));
      await unconfirmOwnerBooking(id);
      toast.success('Booking marked as pending');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to unconfirm booking');
      fetchBookings(); // revert
    }
  };

  // Filter bookings by status and selectedDate (if date filtering is desired)
  const filteredBookings = bookings.filter(booking => {
    let match = true;
    if (statusFilter !== 'all') match = match && booking.status === statusFilter;
    // match = match && booking.date === selectedDate; 
    return match;
  });

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 p-2 lg:p-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Booking Management</h1>
          <p className="text-slate-400 mt-1 text-xs lg:text-sm font-medium">Manage reservations and daily schedules.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-full sm:w-auto">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 font-medium bg-slate-900/60 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none [&::-webkit-calendar-picker-indicator]:filter-[invert(1)] hover:border-slate-600 transition-colors shadow-inner text-sm"
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[
          { label: "Today's", val: bookings.length, icon: Calendar, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Confirmed", val: bookings.filter(b => b.status === 'confirmed').length, icon: CheckCircle, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Pending", val: bookings.filter(b => b.status === 'pending').length, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
          { label: "Today's Revenue", val: `Rs ${bookings.reduce((sum, b) => sum + (b.status !== 'cancelled' ? Number(b.price) : 0), 0)}`, icon: null, textIcon: "Rs", color: "text-emerald-400", bg: "bg-emerald-500/10" }
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl p-5 lg:p-6 transition-all hover:-translate-y-1 hover:border-slate-700 hover:shadow-2xl relative overflow-hidden group">
            <div className={`absolute -right-6 -top-6 w-32 h-32 blur-3xl rounded-full ${stat.bg} opacity-50 transition-opacity`} />
            <div className="flex items-center relative z-10">
              {stat.icon ? (
                <div className={`p-3 lg:p-3.5 rounded-xl ${stat.bg} border border-transparent shrink-0`}>
                  <stat.icon className={`h-5 w-5 lg:h-6 lg:w-6 ${stat.color}`} />
                </div>
              ) : (
                <div className={`h-11 w-11 lg:h-14 lg:w-14 ${stat.bg} rounded-xl flex items-center justify-center border border-transparent shrink-0`}>
                  <span className={`text-xl lg:text-2xl font-black ${stat.color}`}>{stat.textIcon}</span>
                </div>
              )}
              <div className="ml-4 lg:ml-5">
                <p className="text-[10px] lg:text-sm font-semibold text-slate-400 mb-0.5 tracking-wide">{stat.label}</p>
                <p className="text-xl lg:text-3xl font-black text-white tracking-tight">{stat.val}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table Container */}
      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col pt-1">
        <div className="p-5 lg:p-6 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg lg:text-xl font-bold text-white tracking-tight text-center sm:text-left">Booking Schedule</h3>

          <div className="flex items-center space-x-3 bg-slate-950/60 p-1 rounded-xl border border-slate-800 shadow-inner w-full sm:w-auto">
            <Filter className="h-4 w-4 text-emerald-400 ml-3 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-[11px] lg:text-sm font-bold text-slate-200 pr-5 py-1.5 border-none focus:outline-none focus:ring-0 cursor-pointer appearance-none w-full"
            >
              <option value="all" className="bg-slate-900 text-white font-medium">All Statuses</option>
              <option value="pending" className="bg-slate-900 text-white font-medium">Pending Only</option>
              <option value="confirmed" className="bg-slate-900 text-white font-medium">Confirmed Only</option>
              <option value="completed" className="bg-slate-900 text-white font-medium">Completed Only</option>
              <option value="cancelled" className="bg-slate-900 text-white font-medium">Cancelled Only</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <table className="min-w-full divide-y divide-slate-800/80">
            <thead className="bg-slate-900/60 border-b border-slate-800">
              <tr>
                {["Customer", "Pitch", "Time Slot", "Status", "Price", "Actions"].map((th) => (
                  <th key={th} className="px-4 lg:px-6 py-4 text-left text-[10px] font-black tracking-widest text-slate-500 uppercase whitespace-nowrap">
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 bg-transparent">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-800/40 transition-colors group">
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <div className="max-w-[120px] lg:max-w-none">
                      <div className="text-xs lg:text-sm font-bold text-slate-200 group-hover:text-emerald-400 transition-colors truncate">{booking.customerName}</div>
                      <div className="text-[10px] font-semibold tracking-wide text-slate-500 mt-1">{booking.phone}</div>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm font-bold text-slate-300">
                    <span className="bg-slate-800/80 px-2 py-0.5 lg:px-2.5 lg:py-1 rounded-md border border-slate-700">{booking.pitch}</span>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-[11px] lg:text-sm font-bold text-slate-400">
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-slate-500" /> {booking.time}</span>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`flex items-center gap-1 px-2 py-1 lg:px-3 lg:py-1.5 text-[9px] lg:text-[10px] uppercase tracking-wider font-extrabold rounded-lg border ${getStatusColor(booking.status)} shadow-lg`}>
                        {getStatusIcon(booking.status)}
                        {booking.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm font-black text-emerald-400">
                    Rs {booking.price}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-[10px] font-bold space-x-2">
                    {booking.status === 'pending' && (
                      <div className="flex gap-1.5">
                        <button onClick={() => handleConfirmBooking(booking.id)} className="bg-emerald-500/10 text-emerald-400 px-2.5 py-1.5 rounded-lg border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all">Confirm</button>
                        <button onClick={() => handleCancelBooking(booking.id)} className="bg-rose-500/10 text-rose-400 px-2.5 py-1.5 rounded-lg border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all">Reject</button>
                      </div>
                    )}
                    {booking.status === 'confirmed' && (
                      <div className="flex gap-1.5">
                        <button onClick={() => handleUnconfirmBooking(booking.id)} className="bg-amber-500/10 text-amber-400 px-2.5 py-1.5 rounded-lg border border-amber-500/20 hover:bg-amber-500 hover:text-white transition-all">Unconfirm</button>
                        <button onClick={() => handleCancelBooking(booking.id)} className="bg-rose-500/10 text-rose-400 px-2.5 py-1.5 rounded-lg border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all">Cancel</button>
                      </div>
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
              <Calendar className="w-10 h-10 lg:w-12 lg:h-12 text-slate-700 mb-4" />
              <p className="text-slate-400 font-bold text-base lg:text-lg">No bookings found.</p>
              <p className="text-slate-500 text-xs lg:text-sm mt-1">Try selecting a different filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingManagement;