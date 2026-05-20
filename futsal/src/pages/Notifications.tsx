import { useState, useEffect, useCallback } from 'react';
import { Bell, CheckCheck, Trash2, BellOff, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getFutsalNotifications,
  getFutsalUnreadCount,
  markFutsalAsRead,
  markAllFutsalAsRead,
  deleteFutsalNotification,
  type FutsalNotification,
} from '../lib/notificationApi';

const typeIcon: Record<string, string> = {
  booking_created: '📅',
  booking_confirmed: '✅',
  booking_rejected: '❌',
  booking_cancelled: '🚫',
  payment_completed: '💳',
  review_posted: '⭐',
  subscription_expiring: '⏰',
  verification_required: '🔔',
  general_notification: '📣',
};

const relativeTime = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<FutsalNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  // Removed unused navigate reference

  const fetchNotifications = useCallback(async (p: number, reset = false) => {
    setLoading(true);
    try {
      const res = await getFutsalNotifications(p, 20, filter === 'unread');
      setNotifications((prev) => (reset ? res.data : [...prev, ...res.data]));
      setHasMore(res.data.length === 20);
      setPage(p);
      
      const countRes = await getFutsalUnreadCount();
      setUnreadCount(countRes.unreadCount);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchNotifications(1, true);
  }, [fetchNotifications]);

  const handleMarkRead = async (n: FutsalNotification) => {
    if (n.is_read) return;
    try {
      await markFutsalAsRead(n.id);
      setNotifications((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch { /* ignore */ }
  };

  const handleMarkAll = async () => {
    if (!window.confirm("Mark all as read?")) return;
    try {
      await markAllFutsalAsRead();
      setNotifications((prev) => prev.map((x) => ({ ...x, is_read: true })));
      setUnreadCount(0);
    } catch { /* ignore */ }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      await deleteFutsalNotification(id);
      const deleted = notifications.find((n) => n.id === id);
      setNotifications((prev) => prev.filter((x) => x.id !== id));
      if (deleted && !deleted.is_read) setUnreadCount((c) => Math.max(0, c - 1));
    } catch { /* ignore */ }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
           <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
             <Bell className="h-6 w-6 text-emerald-400" />
           </div>
           <div>
             <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">Notifications</h1>
             <p className="text-app-muted text-sm mt-1">Stay updated with your futsal activity.</p>
           </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-app-surface-solid p-1 rounded-xl border border-app-border shadow-inner">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${filter === 'all' ? 'bg-emerald-500 text-white shadow-lg' : 'text-app-muted hover:text-white'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('unread')}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${filter === 'unread' ? 'bg-emerald-500 text-white shadow-lg' : 'text-app-muted hover:text-white'}`}
            >
              Unread
            </button>
          </div>
          
          <button 
            onClick={handleMarkAll}
            disabled={unreadCount === 0}
            className="p-2.5 rounded-xl bg-app-surface-solid border border-app-border text-emerald-400 hover:bg-emerald-500/10 transition-all disabled:opacity-50"
            title="Mark all as read"
          >
            <CheckCheck className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-app-surface backdrop-blur-xl border border-app-border rounded-3xl overflow-hidden shadow-2xl min-h-[60vh]">
        {notifications.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 bg-app-surface-solid rounded-full flex items-center justify-center mb-6">
              <BellOff className="h-10 w-10 text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-app-heading mb-2">No notifications yet</h3>
            <p className="text-app-muted max-w-xs mx-auto">We'll alert you here when there are new bookings or updates.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/50">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleMarkRead(n)}
                className={`group relative flex items-start gap-4 px-6 py-6 cursor-pointer transition-all hover:bg-white/[0.02] ${
                  !n.is_read ? "bg-emerald-500/[0.03]" : ""
                }`}
              >
                {!n.is_read && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
                )}

                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-app-border-subtle flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                    {typeIcon[n.type] ?? '📣'}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <h4 className={`text-base font-bold truncate ${!n.is_read ? 'text-white' : 'text-slate-300'}`}>
                      {n.title}
                    </h4>
                    <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-app-muted whitespace-nowrap">
                      <Clock className="w-3 h-3" />
                      {relativeTime(n.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-app-muted line-clamp-2 leading-relaxed group-hover:text-app-text transition-colors">
                    {n.message}
                  </p>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-app-surface-solid border border-app-border text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {n.type.replace('_', ' ')}
                    </span>
                    {n.related_type && (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                        {n.related_type}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleDelete(e, n.id)}
                    className="p-2 text-slate-600 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}

            {hasMore && (
              <div className="p-8 text-center bg-slate-900/20">
                <button
                  disabled={loading}
                  onClick={() => fetchNotifications(page + 1)}
                  className="px-8 py-3 rounded-2xl bg-emerald-500 text-white font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Load Older Notifications"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
