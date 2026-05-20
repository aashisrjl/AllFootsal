import { useState, useEffect, useCallback } from "react";
import { Bell, CheckCheck, Trash2, BellOff, ArrowLeft, Filter, Search, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  type Notification,
} from "@/lib/notificationApi";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

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

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const navigate = useNavigate();

  const fetchNotifications = useCallback(async (p: number, reset = false) => {
    setLoading(true);
    try {
      const res = await getUserNotifications(p, 20, filter === "unread");
      setNotifications((prev) => (reset ? res.data : [...prev, ...res.data]));
      setHasMore(res.data.length === 20);
      setPage(p);
      
      const countRes = await getUnreadCount();
      setUnreadCount(countRes.unreadCount);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchNotifications(1, true);
  }, [fetchNotifications]);

  const handleMarkRead = async (n: Notification) => {
    if (n.is_read) {
      const dest = destinationFor(n);
      if (dest) navigate(dest);
      return;
    }
    try {
      await markAsRead(n.id);
      setNotifications((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
      const dest = destinationFor(n);
      if (dest) navigate(dest);
    } catch { /* ignore */ }
  };

  const handleMarkAll = async () => {
    if (!window.confirm("Mark all as read?")) return;
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
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 rounded-full bg-muted border border-border text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
                <p className="text-muted-foreground text-sm mt-1">You have {unreadCount} unread messages.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
               <div className="flex items-center bg-muted p-1 rounded-xl border border-border">
                  <button 
                    onClick={() => setFilter("all")}
                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${filter === 'all' ? 'bg-emerald-600 text-white shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    All
                  </button>
                  <button 
                    onClick={() => setFilter("unread")}
                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${filter === 'unread' ? 'bg-emerald-600 text-white shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    Unread
                  </button>
               </div>
               {unreadCount > 0 && (
                 <button 
                  onClick={handleMarkAll}
                  className="p-2.5 rounded-xl bg-muted border border-border text-emerald-600 hover:bg-emerald-500/10 transition-all shadow-inner"
                  title="Mark all as read"
                 >
                   <CheckCheck className="h-5 w-5" />
                 </button>
               )}
            </div>
          </div>

          {/* List */}
          <div className="bg-card backdrop-blur-xl rounded-3xl border border-border shadow-lg overflow-hidden min-h-[60vh]">
            {notifications.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                  <BellOff className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Clear as a whistle!</h3>
                <p className="text-muted-foreground max-w-xs mx-auto">No notifications found. We'll let you know when something happens.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleMarkRead(n)}
                    className={`group relative flex items-start gap-4 px-6 py-6 cursor-pointer transition-all hover:bg-muted/50 ${
                      !n.is_read ? "bg-emerald-500/5 dark:bg-emerald-500/10" : ""
                    }`}
                  >
                    {/* Indicator */}
                    {!n.is_read && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-600" />
                    )}

                    <div className="flex-shrink-0 mt-1">
                      <div className="w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform">
                        {typeIcon[n.type] ?? "📣"}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <h4 className={`text-sm font-bold truncate ${!n.is_read ? 'text-foreground' : 'text-foreground/80'}`}>
                          {n.title}
                        </h4>
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                          {relativeTime(n.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed group-hover:text-foreground/70 transition-colors">
                        {n.message}
                      </p>
                      <div className="mt-3 flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                         <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-muted border border-border">
                           {n.type.replace('_', ' ')}
                         </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDelete(e, n.id)}
                      className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-600/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                {/* Loader / More */}
                {hasMore && (
                  <div className="p-6 text-center">
                    <button
                      disabled={loading}
                      onClick={() => fetchNotifications(page + 1)}
                      className="px-6 py-2 rounded-xl bg-muted border border-border text-foreground font-bold hover:bg-muted/80 transition-all disabled:opacity-50"
                    >
                      {loading ? "Loading..." : "Load More Notifications"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
