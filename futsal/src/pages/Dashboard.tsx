import { useEffect, useState } from 'react';
import { Calendar, DollarSign, Users, TrendingUp, MoreVertical, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getOwnerAnalytics } from '../lib/analyticsApi';
import { getOwnerBookings } from '../lib/bookingApi';
import { getLocalDateString, normalizeBookingDate } from '../lib/bookingDateUtils';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const CHART_BAR_MAX_PX = 180;

const buildEmptyWeek = () => {
  const temp: { dateKey: string; day: string; actualValue: number; barHeightPx: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateKey = getLocalDateString(d);
    temp.push({ dateKey, day: DAY_LABELS[d.getDay()], actualValue: 0, barHeightPx: 6 });
  }
  return temp;
};

const isCountableRevenue = (status: string) =>
  status !== 'cancelled' && status !== 'rejected';
import { useNavigate } from 'react-router-dom';
const Dashboard = () => {
  const { futsalProfile } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [todayBookings, setTodayBookings] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState(buildEmptyWeek);
  const [computedStats, setComputedStats] = useState({ bookingChange: '+0%', revenueChange: '+0%', totalRevenue: 0 });
  const navigate = useNavigate();
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [analyticsRes, bookingsRes] = await Promise.all([
          getOwnerAnalytics().catch(() => null),
          getOwnerBookings().catch(() => null)
        ]);
        
        if (analyticsRes?.success) {
          setAnalytics(analyticsRes.data);
        }

        if (bookingsRes?.success) {
          const bookings = bookingsRes.data;
          const todayDate = getLocalDateString(new Date());

          const todays = bookings
            .filter((b: any) => normalizeBookingDate(b.booking_date) === todayDate)
            .map((b: any) => {
              const name = b.user_name || b.offline_username || 'Guest';
              return {
                time: `${b.start_time?.substring(0, 5) || ''} - ${b.end_time?.substring(0, 5) || ''}`,
                pitch: b.pitch_name || 'Pitch',
                player: name,
                status: b.status,
                avatar: name.substring(0, 2).toUpperCase(),
              };
            });
          setTodayBookings(todays);

          const tempWeekly: Record<string, { day: string; value: number }> = {};
          for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateKey = getLocalDateString(d);
            tempWeekly[dateKey] = { day: DAY_LABELS[d.getDay()], value: 0 };
          }

          bookings.forEach((b: any) => {
            const bDate = normalizeBookingDate(b.booking_date);
            if (bDate && tempWeekly[bDate] && isCountableRevenue(b.status)) {
              tempWeekly[bDate].value += Number(b.amount || 0);
            }
          });

          const rawWeekly = Object.entries(tempWeekly).map(([dateKey, w]) => ({
            dateKey,
            day: w.day,
            actualValue: Math.round(w.value),
          }));
          const maxVal = Math.max(...rawWeekly.map((w) => w.actualValue), 0);

          setWeeklyData(
            rawWeekly.map((w) => ({
              ...w,
              barHeightPx:
                maxVal > 0
                  ? w.actualValue > 0
                    ? Math.max(16, Math.round((w.actualValue / maxVal) * CHART_BAR_MAX_PX))
                    : 8
                  : 8,
            }))
          );

          let thisWeekBookings = 0;
          let lastWeekBookings = 0;
          let thisWeekRevenue = 0;
          let lastWeekRevenue = 0;
          let totalComputedRevenue = 0;
          
          const now = new Date();
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          
          bookings.forEach((b: any) => {
            const bDateStr = normalizeBookingDate(b.booking_date);
            if (!bDateStr) return;
            const amt = Number(b.amount || 0);
            if (isCountableRevenue(b.status)) totalComputedRevenue += amt;

            const bDate = new Date(`${bDateStr}T12:00:00`);
            const diffTime = today.getTime() - bDate.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays >= 0 && diffDays < 7) {
              thisWeekBookings++;
              if (isCountableRevenue(b.status)) thisWeekRevenue += amt;
            } else if (diffDays >= 7 && diffDays < 14) {
              lastWeekBookings++;
              if (isCountableRevenue(b.status)) lastWeekRevenue += amt;
            }
          });
          
          const bookingChange = lastWeekBookings === 0 ? `+${thisWeekBookings}` : `${thisWeekBookings >= lastWeekBookings ? '+' : '-'}${Math.abs(Math.round(((thisWeekBookings - lastWeekBookings) / lastWeekBookings) * 100))}%`;
          const revenueChange = lastWeekRevenue === 0 ? `+Rs ${thisWeekRevenue}` : `${thisWeekRevenue >= lastWeekRevenue ? '+' : '-'}${Math.abs(Math.round(((thisWeekRevenue - lastWeekRevenue) / lastWeekRevenue) * 100))}%`;
          
          setComputedStats({ bookingChange, revenueChange, totalRevenue: totalComputedRevenue });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);
  const stats = [
    { name: 'Total Bookings', value: analytics?.totalBookings || '0', icon: Calendar, change: computedStats.bookingChange, changeType: 'increase', color: 'text-emerald-400', bgPrimary: 'bg-emerald-500/10', borderPrimary: 'border-emerald-500/20' },
    { name: 'Total Revenue', value: `Rs ${analytics?.totalRevenue || computedStats.totalRevenue || 0}`, icon: DollarSign, change: computedStats.revenueChange, changeType: 'increase', color: 'text-blue-400', bgPrimary: 'bg-blue-500/10', borderPrimary: 'border-blue-500/20' },
    { name: 'Visits', value: analytics?.totalVisitors || '0', icon: Users, change: '+5%', changeType: 'increase', color: 'text-purple-400', bgPrimary: 'bg-purple-500/10', borderPrimary: 'border-purple-500/20' },
    { name: 'Avg Rating', value: parseFloat(analytics?.averageRating || '0').toFixed(1), icon: TrendingUp, change: `+0%`, changeType: 'increase', color: 'text-rose-400', bgPrimary: 'bg-rose-500/10', borderPrimary: 'border-rose-500/20' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-2rem)] text-app-text p-4 md:p-8 rounded-3xl shadow-2xl animate-in fade-in duration-700">
      {/* Header */}
      <div className="mb-6 lg:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-sm lg:text-base text-app-muted mt-1">Welcome back, {futsalProfile?.ownerName || 'Owner'}. Here's what's happening at your facility.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (!futsalProfile?.id) return;
            const base = (import.meta.env.VITE_SITE_URL || 'http://localhost:3001').replace(/\/$/, '');
            window.open(`${base}/futsals/${futsalProfile.id}`, '_blank', 'noopener,noreferrer');
          }}
          disabled={!futsalProfile?.id}
          className="w-full md:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 active:translate-y-0 text-sm disabled:opacity-50 disabled:pointer-events-none"
        >
          Visit Site
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.name} 
              className="relative overflow-hidden bg-app-surface backdrop-blur-xl border border-app-border rounded-2xl p-5 lg:p-6 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 animate-in slide-in-from-bottom-4 hover:border-app-border-subtle/80 hover:shadow-xl"
              style={{ animationFillMode: 'both', animationDelay: `${idx * 100}ms` }}
            >
              <div className={`absolute -right-6 -top-6 w-32 h-32 blur-3xl rounded-full ${stat.bgPrimary} opacity-50`} />
              
              <div className="flex items-center justify-between relative z-10">
                <div className="flex-1">
                  <p className="text-xs lg:text-sm font-medium text-app-muted mb-1">
                    {stat.name}
                  </p>
                  <h3 className="text-2xl lg:text-3xl font-bold text-app-heading tracking-tight">
                    {stat.value}
                  </h3>
                </div>
                <div className={`flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-xl border ${stat.bgPrimary} ${stat.borderPrimary}`}>
                  <Icon className={`h-5 w-5 lg:h-6 lg:w-6 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs relative z-10">
                <span className="flex items-center text-emerald-400 font-semibold bg-emerald-400/10 px-2 py-0.5 rounded-full">
                  <TrendingUp className="w-3 h-3 mr-1" /> {stat.change}
                </span>
                <span className="text-app-muted ml-2">from last week</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Weekly Revenue Chart */}
        <div className="lg:col-span-2 bg-app-surface backdrop-blur-xl border border-app-border rounded-2xl p-5 lg:p-6 animate-in slide-in-from-bottom-4 fill-mode-both" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <div>
              <h3 className="text-lg lg:text-xl font-semibold text-app-heading">Weekly Revenue</h3>
              <p className="text-xs lg:text-sm text-app-muted mt-1">Income generated over the last 7 days</p>
            </div>
            <button className="p-2 text-app-muted hover:text-white transition-colors rounded-lg hover:bg-app-surface-solid border border-transparent hover:border-app-border-subtle">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          
          <div className="overflow-x-auto pb-2 scrollbar-hide">
            <div className="min-w-[420px] lg:min-w-0 mt-4">
              <div className="flex items-end justify-between gap-2 sm:gap-3 h-[220px] px-1">
              {weeklyData.map((item) => (
                <div key={item.dateKey} className="flex flex-col items-center flex-1 min-w-0 h-full group">
                  <p className="text-[10px] font-semibold text-emerald-400/90 mb-2 tabular-nums">
                    Rs {item.actualValue}
                  </p>
                  <div className="flex-1 w-full flex items-end justify-center min-h-[140px]">
                    <div
                      className="w-full max-w-11 sm:max-w-12 bg-gradient-to-t from-emerald-600/40 to-emerald-400 rounded-t-md transition-all duration-500 group-hover:from-emerald-500/60 group-hover:to-emerald-300 border border-emerald-500/30 border-b-0 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                      style={{ height: `${item.barHeightPx}px` }}
                      title={`Rs ${item.actualValue}`}
                    />
                  </div>
                  <span className="text-[10px] lg:text-sm font-medium text-app-muted group-hover:text-app-text transition-colors mt-2">
                    {item.day}
                  </span>
                </div>
              ))}
              </div>
              {weeklyData.every((d) => d.actualValue === 0) && (
                <p className="text-center text-xs text-app-muted mt-3">
                  No confirmed revenue in the last 7 days.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Today's Bookings */}
        <div className="bg-app-surface backdrop-blur-xl border border-app-border rounded-2xl flex flex-col animate-in slide-in-from-bottom-4 fill-mode-both" style={{ animationDelay: '400ms' }}>
          <div className="p-5 lg:p-6 border-b border-app-border flex justify-between items-center">
            <h3 className="text-lg lg:text-xl font-semibold text-app-heading">Today's Bookings</h3>
            <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-blue-500/20">
              {todayBookings.length} Total
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 lg:p-4 space-y-3 max-h-[340px]">
            {todayBookings.map((booking, index) => (
              <div 
                key={index} 
                className="group flex gap-3 lg:gap-4 p-3 lg:p-4 rounded-xl hover:bg-app-surface-solid transition-all cursor-pointer border border-transparent hover:border-app-border-subtle/50 hover:shadow-lg"
              >
                <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-xs text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20 group-hover:border-emerald-500/40 transition-colors shadow-inner shrink-0">
                  {booking.avatar}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <p className="text-sm font-semibold text-app-text group-hover:text-emerald-400 transition-colors truncate">{booking.player}</p>
                    <span className={`flex items-center text-[8px] lg:text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                      booking.status === 'confirmed' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center text-[10px] text-app-muted gap-x-3 gap-y-1">
                    <span className="flex items-center gap-1 group-hover:text-app-text transition-colors whitespace-nowrap">
                      <Clock className="w-3 h-3" />
                      {booking.time}
                    </span>
                    <span className="font-medium text-app-text truncate">{booking.pitch}</span>
                  </div>
                </div>
              </div>
            ))}
            {todayBookings.length === 0 && (
              <div className="text-center py-10">
                <Calendar className="w-10 h-10 text-slate-700 mx-auto mb-3 opacity-50" />
                <p className="text-app-muted text-sm font-medium">No bookings for today yet.</p>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-app-border">
            <button onClick={() => navigate(`/bookings`)} className="w-full py-2.5 rounded-xl text-xs lg:text-sm font-semibold text-app-muted bg-app-surface-solid hover:text-app-heading hover:bg-app-input border border-app-border-subtle hover:border-app-border transition-all">
              View Complete Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;