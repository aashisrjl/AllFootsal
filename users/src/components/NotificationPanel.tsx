import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, X, CheckCheck, Trash2, BellOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  type Notification,
} from "@/lib/notificationApi";

const POLL_INTERVAL_MS = 30_000;

const typeIcon: Record<string, string> = {
  booking_created: "📅",
  booking_confirmed: "✅",
  booking_rejected: "❌",
  booking_cancelled: "🚫",
  payment_completed: "💳",
  review_posted: "⭐",
  forum_reply: "💬",
  subscription_expiring: "⏰",
  verification_required: "🔔",
  general_notification: "📣",
};

const relativeTime = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
};

const destinationFor = (n: Notification): string | null => {
  if ((n.related_type === "booking" || n.type.startsWith("booking")) && n.related_id)
    return `/bookings/${n.related_id}`;
  if ((n.related_type === "forum" || n.type === "forum_reply") && n.related_id)
    return `/forum/${n.related_id}`;
  return null;
};

export default function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const panelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // ── Poll unread count ──────────────────────────────────────────────────
  const fetchCount = useCallback(async () => {
    try {
      const res = await getUnreadCount();
      setUnreadCount(res.unreadCount);
    } catch {
      // ignore silently
    }
  }, []);

  useEffect(() => {
    fetchCount();
    const id = setInterval(fetchCount, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetchCount]);

  // ── Fetch notifications ────────────────────────────────────────────────
  const fetchPage = useCallback(
    async (p: number) => {
      setLoading(true);
      try {
        const res = await getUserNotifications(p, 15);
        setNotifications((prev) =>
          p === 1 ? res.data : [...prev, ...res.data]
        );
        setHasMore(res.data.length === 15);
        setPage(p);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (open) fetchPage(1);
  }, [open, fetchPage]);

  // ── Close on outside click ─────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // ── Handlers ──────────────────────────────────────────────────────────
  const handleOpen = () => setOpen((v) => !v);

  const handleMarkRead = async (n: Notification) => {
    if (n.is_read) {
      const dest = destinationFor(n);
      if (dest) { setOpen(false); navigate(dest); }
      return;
    }
    try {
      await markAsRead(n.id);
      setNotifications((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
      const dest = destinationFor(n);
      if (dest) { setOpen(false); navigate(dest); }
    } catch { /* ignore */ }
  };

  const handleMarkAll = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((x) => ({ ...x, is_read: true })));
      setUnreadCount(0);
    } catch { /* ignore */ }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      await deleteNotification(id);
      const deleted = notifications.find((n) => n.id === id);
      setNotifications((prev) => prev.filter((x) => x.id !== id));
      if (deleted && !deleted.is_read) setUnreadCount((c) => Math.max(0, c - 1));
    } catch { /* ignore */ }
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={handleOpen}
        aria-label="Notifications"
        className="relative p-2 rounded-full transition-colors hover:bg-white/20 focus:outline-none"
      >
        <Bell className="h-5 w-5 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white leading-none ring-1 ring-white/30">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-[340px] sm:w-[380px] rounded-2xl shadow-2xl z-[200] overflow-hidden border border-white/20"
          style={{
            background: "rgba(15, 23, 42, 0.97)",
            backdropFilter: "blur(16px)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-green-400" />
              <span className="text-sm font-semibold text-white">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="text-xs bg-green-600 text-white rounded-full px-1.5 py-0.5 font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAll}
                  className="text-[11px] text-green-400 hover:text-green-300 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
                  title="Mark all as read"
                >
                  <CheckCheck className="h-3 w-3" />
                  All read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-[380px] overflow-y-auto">
            {notifications.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-500">
                <BellOff className="h-10 w-10 opacity-40" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              <>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleMarkRead(n)}
                    className={`group flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-white/5 hover:bg-white/5 ${
                      !n.is_read ? "bg-green-900/20" : ""
                    }`}
                  >
                    <span className="text-xl flex-shrink-0 mt-0.5">
                      {typeIcon[n.type] ?? "📣"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`text-xs font-semibold leading-tight ${
                            !n.is_read ? "text-white" : "text-slate-300"
                          }`}
                        >
                          {n.title}
                        </p>
                        {!n.is_read && (
                          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-green-400 mt-1" />
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
                      className="flex-shrink-0 p-1 text-slate-600 hover:text-red-400 rounded opacity-0 group-hover:opacity-100 transition-all"
                      title="Dismiss"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}

                {/* Load More */}
                {hasMore && !loading && (
                  <button
                    onClick={() => fetchPage(page + 1)}
                    className="w-full py-2 text-xs text-green-400 hover:text-green-300 hover:bg-white/5 transition-colors"
                  >
                    Load more
                  </button>
                )}
                {loading && (
                  <div className="flex justify-center py-4">
                    <span className="h-4 w-4 rounded-full border-2 border-green-400 border-t-transparent animate-spin" />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
