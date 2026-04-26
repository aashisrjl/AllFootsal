import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Calendar, CreditCard } from 'lucide-react';
import api from '../lib/api';

const Revenue = () => {
  const [revenueData, setRevenueData] = useState({ today: 0, week: 0, month: 0, year: 0 });
  const [revenueChanges, setRevenueChanges] = useState({ today: '+0%', week: '+0%', month: '+0%', year: '+0%' });
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [monthlyBreakdown, setMonthlyBreakdown] = useState<any[]>([]);
  const [weeklyChart, setWeeklyChart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenueMetrics = async () => {
      try {
        setLoading(true);
        const [analyticsRes, bookingsRes] = await Promise.all([
          api.get('/futsal/analytics/fetch').catch(() => null),
          api.get('/futsal-bookings').catch(() => null)
        ]);
        
        // Use total revenue safely
        const totalRev = analyticsRes?.data?.data?.totalRevenue || 0;

        if (bookingsRes?.data?.success) {
           const bookings = bookingsRes.data.data;
           
           const todayString = new Date().toISOString().split('T')[0];
           
           const dYesterday = new Date(); dYesterday.setDate(dYesterday.getDate() - 1);
           const yesterdayString = dYesterday.toISOString().split('T')[0];

           const dWeek = new Date(); dWeek.setDate(dWeek.getDate() - 7);
           const weekString = dWeek.toISOString().split('T')[0];
           const dLastWeek = new Date(); dLastWeek.setDate(dLastWeek.getDate() - 14);
           const lastWeekString = dLastWeek.toISOString().split('T')[0];
           
           const dMonth = new Date(); dMonth.setDate(dMonth.getDate() - 30);
           const monthString = dMonth.toISOString().split('T')[0];
           const dLastMonth = new Date(); dLastMonth.setDate(dLastMonth.getDate() - 60);
           const lastMonthString = dLastMonth.toISOString().split('T')[0];
           
           let todayRev = 0, yesterdayRev = 0;
           let weekRev = 0, lastWeekRev = 0;
           let monthRev = 0, lastMonthRev = 0;
           
           bookings.forEach((b: any) => {
             if (b.status === 'cancelled') return;
             const bDate = b.booking_date?.split('T')[0];
             if (!bDate) return;
             const amt = b.amount || 0;
             if (bDate === todayString) todayRev += amt;
             if (bDate === yesterdayString) yesterdayRev += amt;
             
             if (bDate >= weekString) weekRev += amt;
             else if (bDate >= lastWeekString) lastWeekRev += amt;
             
             if (bDate >= monthString) monthRev += amt;
             else if (bDate >= lastMonthString) lastMonthRev += amt;
           });

           setRevenueData({
             today: Math.floor(todayRev),
             week: Math.floor(weekRev),
             month: Math.floor(monthRev),
             year: parseInt(totalRev, 10)
           });
           
           const calcChange = (current: number, prev: number) => {
             if (prev === 0) return `+$${current}`;
             const percent = Math.round(((current - prev) / prev) * 100);
             return `${percent >= 0 ? '+' : '-'}${Math.abs(percent)}%`;
           };

           setRevenueChanges({
             today: calcChange(todayRev, yesterdayRev),
             week: calcChange(weekRev, lastWeekRev),
             month: calcChange(monthRev, lastMonthRev),
             year: '+0%' // Needs proper year calculation for full fidelity
           });

          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const tempWeekly: any = {};
          for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            tempWeekly[dateStr] = {
              day: days[d.getDay()],
              value: 0
            };
          }
          bookings.forEach((b: any) => {
             const bDate = b.booking_date?.split('T')[0];
             if (tempWeekly[bDate] && b.status !== 'cancelled') {
                tempWeekly[bDate].value += (b.amount || 0);
             }
          });
          const rawWeekly = Object.values(tempWeekly) as any[];
          const maxVal = Math.max(...rawWeekly.map((w: any) => w.value), 1); 
          setWeeklyChart(rawWeekly.map((w: any) => ({
            day: w.day,
            actualValue: w.value,
            value: Math.floor((w.value / maxVal) * 100) || 5
          })));

           // Recent Transactions
           const recent = bookings.slice(0, 5).map((b: any) => ({
             id: b.id,
             customer: b.user_name || 'Guest',
             amount: b.amount,
             time: `${b.start_time || ''}`,
             pitch: b.pitch_name,
             method: b.payment_status || 'Card'
           }));
           setRecentTransactions(recent);

           const breakdownMap: any = {};
           bookings.forEach((b: any) => {
             if (b.status === 'cancelled') return;
             if (!breakdownMap[b.pitch_name]) {
               breakdownMap[b.pitch_name] = { pitch: b.pitch_name, bookings: 0, revenue: 0, utilization: 0 };
             }
             breakdownMap[b.pitch_name].bookings += 1;
             breakdownMap[b.pitch_name].revenue += b.amount || 0;
           });
           
           const maxBookings = Math.max(...Object.values(breakdownMap).map((item: any) => item.bookings), 1);
           const breakdownArray = Object.values(breakdownMap).map((item: any) => ({
             ...item,
             utilization: Math.floor((item.bookings / maxBookings) * 100)
           }));
           setMonthlyBreakdown(breakdownArray);
        }
      } catch (error) {
        console.error('Failed to fetch revenue stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRevenueMetrics();
  }, []);

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
           <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Revenue Dashboard</h1>
           <p className="text-slate-400 mt-1 text-sm font-medium">Track your earnings and business performance.</p>
        </div>
        <div className="flex space-x-2 relative group">
          <select className="px-4 py-2.5 bg-slate-900/60 border border-slate-700 text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none hover:border-slate-600 transition-colors shadow-inner cursor-pointer w-[160px]">
            <option className="bg-slate-900">This Month</option>
            <option className="bg-slate-900">Last Month</option>
            <option className="bg-slate-900">Last 3 Months</option>
            <option className="bg-slate-900">This Year</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
             ▼
          </div>
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Today's Revenue", val: revenueData.today, inc: `${revenueChanges.today} from yesterday`, icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "This Week", val: revenueData.week, inc: `${revenueChanges.week} from last week`, icon: Calendar, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "This Month", val: revenueData.month.toLocaleString(), inc: `${revenueChanges.month} from last month`, icon: TrendingUp, color: "text-purple-400", bg: "bg-purple-500/10" },
          { label: "This Year", val: revenueData.year.toLocaleString(), inc: `${revenueChanges.year} from last year`, icon: CreditCard, color: "text-amber-400", bg: "bg-amber-500/10" }
        ].map((stat, i) => (
           <div key={i} className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl p-6 transition-all hover:-translate-y-1 hover:border-slate-700 hover:shadow-2xl relative overflow-hidden group">
            <div className={`absolute -right-6 -top-6 w-32 h-32 blur-3xl rounded-full ${stat.bg} opacity-50 group-hover:opacity-100 transition-opacity`} />
            <div className="flex items-center relative z-10">
              <div className={`p-3.5 rounded-xl ${stat.bg} border border-transparent`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-5">
                <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-0.5">{stat.label}</p>
                <p className="text-3xl font-black text-white tracking-tight">${stat.val}</p>
                <p className="text-[10px] font-bold text-emerald-400 tracking-wider mt-1 uppercase">{stat.inc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl p-6 relative overflow-hidden flex flex-col group hover:border-slate-700 transition-colors">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/20 z-0 pointer-events-none"></div>
          <div className="flex items-center justify-between mb-8 relative z-10">
            <h3 className="text-xl font-bold text-white tracking-tight">Revenue Trend</h3>
            <div className="relative">
              <select className="px-3 py-1.5 bg-slate-800/60 border border-slate-700 text-slate-300 font-bold text-xs rounded-lg focus:outline-none appearance-none hover:border-slate-600 transition-colors shadow-inner cursor-pointer w-[120px]">
                <option className="bg-slate-900">Last 7 days</option>
                <option className="bg-slate-900">Last 30 days</option>
                <option className="bg-slate-900">Last 90 days</option>
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[8px]">
                ▼
              </div>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center bg-slate-800/30 rounded-xl border border-slate-800/80 shadow-inner relative z-10 p-4">
            {/* Mocked visual for chart area */}
            <div className="w-full h-full flex flex-col justify-end gap-2 p-2">
                <div className="flex justify-between items-end h-full gap-2 lg:gap-4">
                 {weeklyChart.map((h, i) => (
                   <div key={i} className="w-full relative flex justify-center h-full items-end pb-0 group/bar">
                     <div 
                       className="w-full bg-gradient-to-t from-emerald-500/20 to-emerald-400/60 rounded-t-md hover:from-emerald-500/40 hover:to-emerald-400 transition-all duration-500 cursor-pointer border border-emerald-500/20 border-b-0 relative" 
                       style={{ height: `${h.value}%` }}
                     >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-semibold py-1.5 px-2.5 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl border border-slate-700">
                          ${h.actualValue}
                        </div>
                     </div>
                   </div>
                 ))}
               </div>
               <div className="flex justify-between items-center px-1 mt-2 border-t border-slate-700/50 pt-2 text-[10px] font-bold text-slate-500 uppercase">
                  {weeklyChart.map((h, i) => <span key={i}>{h.day}</span>)}
               </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl p-6 hover:border-slate-700 transition-colors flex flex-col">
          <h3 className="text-xl font-bold text-white tracking-tight mb-6">Recent Transactions</h3>
          <div className="space-y-3 flex-1 overflow-y-auto">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-slate-800/40 hover:bg-slate-800/80 transition-colors border border-slate-700/50 rounded-xl group/tx">
                <div>
                  <p className="text-sm font-bold text-slate-200 group-hover/tx:text-white transition-colors">{transaction.customer}</p>
                  <p className="text-[11px] font-semibold text-slate-500 tracking-wide mt-0.5">{transaction.pitch} <span className="text-slate-600 px-1">•</span> {transaction.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-base font-black text-emerald-400">${transaction.amount}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{transaction.method}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col pt-1">
        <div className="px-6 py-5 border-b border-slate-800/80">
          <h3 className="text-xl font-bold text-white tracking-tight">Monthly Pitch Performance</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800/80">
            <thead className="bg-slate-900/60 border-b border-slate-800">
              <tr>
                {["Pitch", "Total Bookings", "Generated Revenue", "Utilization Rate", "Performance Indicator"].map(th => (
                  <th key={th} className="px-6 py-4 text-left text-[11px] font-black tracking-widest text-slate-500 uppercase">
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 bg-transparent">
              {monthlyBreakdown.map((pitch, index) => (
                <tr key={index} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-white">
                    <span className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">{pitch.pitch}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-300">
                    {pitch.bookings}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-emerald-400">
                    ${pitch.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-300">
                    <span className="flex items-center gap-2">
                       {pitch.utilization}%
                       {pitch.utilization >= 80 && <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap w-48 sm:w-64">
                    <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden border border-slate-700/50 shadow-inner">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          pitch.utilization >= 80 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]' :
                          pitch.utilization >= 60 ? 'bg-gradient-to-r from-amber-500 to-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-gradient-to-r from-rose-500 to-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.5)]'
                        }`}
                        style={{ width: `${pitch.utilization}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Revenue;