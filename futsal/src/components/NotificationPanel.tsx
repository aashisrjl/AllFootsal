import { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, X, CheckCheck, Trash2, BellOff } from 'lucide-react';
import {
  getFutsalNotifications,
  getFutsalUnreadCount,
  markFutsalAsRead,
  markAllFutsalAsRead,
  deleteFutsalNotification,
  type FutsalNotification,
} from '../lib/notificationApi';

const POLL_INTERVAL_MS = 30_000;

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

export default function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<FutsalNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const panelRef = useRef<HTMLDivElement>(null);

  // ── Poll unread count ───────────────────────────────────────────────────
  const fetchCount = useCallback(async () => {
    try {
      const res = await getFutsalUnreadCount();
      setUnreadCount(res.unreadCount);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    fetchCount();
    const id = setInterval(fetchCount, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetchCount]);

  // ── Fetch notifications ─────────────────────────────────────────────────
  const fetchPage = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await getFutsalNotifications(p, 15);
      setNotifications((prev) => p === 1 ? res.data : [...prev, ...res.data]);
      setHasMore(res.data.length === 15);
      setPage(p);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (open) fetchPage(1);
  }, [open, fetchPage]);

  // ── Close on outside click ──────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node))
        setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleMarkRead = async (n: FutsalNotification) => {
    if (n.is_read) return;
    try {
      await markFutsalAsRead(n.id);
      setNotifications((prev) => prev.map((x) => x.id === n.id ? { ...x, is_read: true } : x));
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch { /* ignore */ }
  };

  const handleMarkAll = async () => {
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
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="rounded-full bg-slate-800/80 p-2.5 relative border border-slate-700/50 hover:border-slate-600 hover:bg-slate-700 transition-all shadow-inner hover:shadow-lg focus:outline-none"
      >
        <Bell className="h-4 w-4 text-slate-300" />
        {unreadCount > 0 ? (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white border-2 border-[#121827] leading-none">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        ) : (
          <span className="absolute -top-1 -right-1 h-3 w-3 border-2 border-[#121827] bg-slate-600 rounded-full" />
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-[340px] sm:w-[380px] rounded-2xl shadow-2xl z-[200] overflow-hidden border border-slate-700/60"
          style={{ background: 'rgba(10,15,28,0.98)', backdropFilter: 'blur(20px)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-semibold text-white">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-xs bg-emerald-600/80 text-white rounded-full px-1.5 py-0.5 font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAll}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
                  title="Mark all as read"
                >
                  <CheckCheck className="h-3 w-3" />
                  All read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1 text-slate-500 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-[380px] overflow-y-auto">
            {notifications.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-600">
                <BellOff className="h-10 w-10 opacity-40" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              <>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleMarkRead(n)}
                    className={`group flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-slate-800/60 hover:bg-slate-800/40 ${
                      !n.is_read ? 'bg-emerald-900/20' : ''
                    }`}
                  >
                    <span className="text-xl flex-shrink-0 mt-0.5">
                      {typeIcon[n.type] ?? '📣'}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-xs font-semibold leading-tight ${!n.is_read ? 'text-white' : 'text-slate-300'}`}>
                          {n.title}
                        </p>
                        {!n.is_read && (
                          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-400 mt-1" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-snug">
                        {n.message}
                      </p>
                      <p className="text-[10px] text-slate-600 mt-1">
                        {relativeTime(n.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, n.id)}
                      className="flex-shrink-0 p-1 text-slate-700 hover:text-rose-400 rounded opacity-0 group-hover:opacity-100 transition-all"
                      title="Dismiss"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}

                {hasMore && !loading && (
                  <button
                    onClick={() => fetchPage(page + 1)}
                    className="w-full py-2 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-white/5 transition-colors"
                  >
                    Load more
                  </button>
                )}
                {/* See All Notifications */}
                <div className="p-3 border-t border-slate-800 bg-slate-900/50">
                  <button
                    onClick={() => { setOpen(false); window.location.href = "/notifications"; }}
                    className="w-full py-2 text-xs font-bold text-slate-500 hover:text-emerald-400 transition-colors"
                  >
                    See all notifications
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
