import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { getUserBookings } from "@/lib/userApi";
import { useBooking } from "@/contexts/BookingContext";
import toast from 'react-hot-toast';
import {
    CalendarDays, Clock, MapPin, ExternalLink, X, Loader2,
    CheckCircle2, AlertCircle, TimerIcon, Ban, Receipt, ChevronRight,
    PlusCircle, Layers
} from "lucide-react";

// ─── Status Config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, {
    label: string; dot: string; badge: string; border: string; icon: React.ElementType;
}> = {
    confirmed: {
        label: "Confirmed",
        dot: "bg-emerald-500",
        badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
        border: "border-l-emerald-500",
        icon: CheckCircle2,
    },
    approved: {
        label: "Approved",
        dot: "bg-emerald-500",
        badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
        border: "border-l-emerald-500",
        icon: CheckCircle2,
    },
    pending: {
        label: "Pending",
        dot: "bg-amber-400",
        badge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
        border: "border-l-amber-400",
        icon: TimerIcon,
    },
    completed: {
        label: "Completed",
        dot: "bg-sky-400",
        badge: "bg-sky-500/15 text-sky-400 border-sky-500/30",
        border: "border-l-sky-400",
        icon: Receipt,
    },
    cancelled: {
        label: "Cancelled",
        dot: "bg-rose-500",
        badge: "bg-rose-500/15 text-rose-400 border-rose-500/30",
        border: "border-l-rose-500",
        icon: Ban,
    },
};

const getStatusCfg = (status: string) =>
    STATUS_CONFIG[status] ?? STATUS_CONFIG["pending"];

// ─── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, count, color }: { label: string; count: number; color: string }) => (
    <div className="bg-card/60 border border-border rounded-2xl p-4 flex flex-col gap-1 min-w-[100px]">
        <p className={`text-2xl font-extrabold ${color}`}>{count}</p>
        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{label}</p>
    </div>
);

// ─── Booking Row Card ─────────────────────────────────────────────────────────
const BookingRow = ({ booking, onCancel }: { booking: any; onCancel: (id: string) => void }) => {
    const navigate = useNavigate();
    const cfg = getStatusCfg(booking.status);
    const StatusIcon = cfg.icon;

    const facilityName = booking.futsal_name || booking.futsalName || "Facility";
    const pitchName = booking.pitch_name || booking.pitchName || "Pitch";
    const bookingDate = booking.booking_date || booking.date || "";
    const startTime = booking.start_time || booking.startTime || "";
    const endTime = booking.end_time || booking.endTime || "";
    const amount = booking.amount || booking.totalPrice || "—";

    const canCancel =
        (booking.status === "confirmed" || booking.status === "pending") &&
        bookingDate && (new Date(`${bookingDate}T${startTime || "00:00"}`).getTime() - new Date().getTime() >= 24 * 60 * 60 * 1000);

    const formattedDate = bookingDate
        ? new Date(bookingDate).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
          })
        : "—";

    return (
        <div
            className={`group relative bg-card/60 border border-border border-l-4 ${cfg.border} rounded-2xl p-5 hover:bg-card/80 transition-all duration-200`}
        >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Status icon circle */}
                <div className={`hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-full border ${cfg.badge}`}>
                    <StatusIcon className="h-5 w-5" />
                </div>

                {/* Main info */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-foreground font-bold text-base leading-tight">
                            {pitchName}
                        </h3>
                        <span className="text-muted-foreground text-sm">at</span>
                        <span className="text-emerald-500 font-semibold text-sm">{facilityName}</span>
                        <span className={`ml-auto sm:hidden inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.65rem] font-bold uppercase tracking-wider border ${cfg.badge}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-2">
                        <span className="flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5 text-muted-foreground/70" />
                            {formattedDate}
                        </span>
                        {startTime && (
                            <span className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-muted-foreground/70" />
                                {startTime} – {endTime}
                            </span>
                        )}
                        <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground/70" />
                            {facilityName}
                        </span>
                    </div>
                </div>

                {/* Right side */}
                <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2 shrink-0">
                    {/* Status badge — desktop */}
                    <span className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-wider border ${cfg.badge}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                    </span>

                    <p className="text-emerald-400 font-bold text-sm">
                        Rs. {amount}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate(`/bookings/${booking.id}`)}
                            className="inline-flex items-center gap-1.5 bg-muted hover:bg-emerald-500/10 hover:text-emerald-500 text-foreground/80 border border-border hover:border-emerald-500/40 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                        >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Details
                        </button>
                        {canCancel && (
                            <button
                                onClick={() => onCancel(booking.id)}
                                className="inline-flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                            >
                                <X className="h-3.5 w-3.5" />
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Section ──────────────────────────────────────────────────────────────────
const BookingSection = ({
    title,
    icon: Icon,
    accent,
    bookings,
    onCancel,
    emptyText,
}: {
    title: string;
    icon: React.ElementType;
    accent: string;
    bookings: any[];
    onCancel: (id: string) => void;
    emptyText: string;
}) => {
    const [collapsed, setCollapsed] = useState(true);

    return (
        <div className="space-y-3">
            <button
                onClick={() => setCollapsed((c) => !c)}
                className="w-full flex items-center gap-3 text-left group"
            >
                <span className={`flex items-center justify-center h-8 w-8 rounded-xl ${accent}`}>
                    <Icon className="h-4 w-4" />
                </span>
                <span className="font-bold text-foreground text-base">
                    {title}
                </span>
                <span className="ml-1 text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {bookings.length}
                </span>
                <ChevronRight
                    className={`h-4 w-4 text-muted-foreground ml-auto transition-transform duration-200 ${collapsed ? "" : "rotate-90"}`}
                />
            </button>

            {!collapsed && (
                <div className="space-y-3 pl-0">
                    {bookings.length > 0 ? (
                        bookings.map((b) => (
                            <BookingRow key={b.id} booking={b} onCancel={onCancel} />
                        ))
                    ) : (
                        <div className="bg-muted/30 border border-border border-dashed rounded-2xl p-6 text-center text-muted-foreground text-sm">
                            {emptyText}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const UserBookings = () => {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();
    const { cancelBooking } = useBooking();
    const [bookings, setBookings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Wait until auth is resolved before deciding to redirect
        if (authLoading) return;

        if (!isAuthenticated) {
            navigate("/auth/login", { replace: true });
            return;
        }

        const fetch = async () => {
            try {
                const res = await getUserBookings();
                setBookings(res?.data || []);
            } catch (err: any) {
                toast.error(err?.response?.data?.message || "Failed to load bookings");
            } finally {
                setIsLoading(false);
            }
        };
        fetch();
    }, [isAuthenticated, authLoading, navigate]);

    const handleCancel = async (bookingId: string) => {
        const booking = bookings.find((b) => b.id === bookingId);
        if (!booking) return;

        if (!window.confirm("Are you sure you want to cancel this booking?")) return;

        const toastId = toast.loading("Cancelling booking...");
        try {
            // cancelBooking from BookingContext — uses futsalId + bookingId
            await cancelBooking(bookingId, booking.futsal_id || booking.futsalId || "");
            setBookings((prev) =>
                prev.map((b) => (b.id === bookingId ? { ...b, status: "cancelled" } : b))
            );
            toast.dismiss(toastId);
            toast.success("Booking cancelled successfully");
        } catch (error: any) {
            toast.dismiss(toastId);
            const errorMsg = error?.response?.data?.message || "Failed to cancel booking";
            toast.error(errorMsg);
        }
    };

    const now = new Date();
    const isPast = (b: any) => {
        const bDate = b.booking_date || b.date;
        const bTime = b.end_time || b.endTime || b.start_time || b.startTime || "23:59";
        if (!bDate) return false;
        return new Date(`${bDate}T${bTime}`) < now;
    };

    const confirmed = bookings.filter((b) => (b.status === "confirmed" || b.status === "approved") && !isPast(b));
    const pending = bookings.filter((b) => (b.status === "pending" || !b.status) && !isPast(b));
    const completed = bookings.filter((b) => b.status === "completed" || ((b.status === "confirmed" || b.status === "approved") && isPast(b)));
    const cancelled = bookings.filter((b) => b.status === "cancelled" || ((b.status === "pending" || !b.status) && isPast(b)));

    // Show spinner while auth is resolving
    if (authLoading || (isAuthenticated && isLoading)) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-16 pt-28 max-w-5xl">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-500 mb-1">
                            Dashboard
                        </p>
                        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                            My Bookings
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Track and manage all your futsal sessions in one place.
                        </p>
                    </div>
                    <Link
                        to="/futsals"
                        className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-emerald-950 font-bold px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-emerald-500/20 text-sm shrink-0"
                    >
                        <PlusCircle className="h-4 w-4" />
                        Book New Session
                    </Link>
                </div>

                {/* Stats strip */}
                {bookings.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-10">
                        <StatCard label="Total" count={bookings.length} color="text-foreground" />
                        <StatCard label="Confirmed" count={confirmed.length} color="text-emerald-500" />
                        <StatCard label="Pending" count={pending.length} color="text-amber-500" />
                        <StatCard label="Completed" count={completed.length} color="text-sky-500" />
                        <StatCard label="Cancelled" count={cancelled.length} color="text-rose-500" />
                    </div>
                )}

                {/* No bookings empty state */}
                {bookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-5 border border-border border-dashed rounded-3xl bg-muted/30">
                        <div className="h-16 w-16 bg-muted rounded-2xl flex items-center justify-center">
                            <Layers className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-foreground/80">No Bookings Yet</h2>
                            <p className="text-muted-foreground text-sm mt-1 max-w-xs">
                                You haven't made any futsal bookings yet. Browse facilities and book your first session!
                            </p>
                        </div>
                        <Link
                            to="/futsals"
                            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-emerald-950 font-bold px-6 py-2.5 rounded-xl transition-colors shadow-lg shadow-emerald-500/20 text-sm"
                        >
                            <PlusCircle className="h-4 w-4" />
                            Browse Futsals
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-10">
                        <BookingSection
                            title="Confirmed & Active"
                            icon={CheckCircle2}
                            accent="bg-emerald-500/15 text-emerald-400"
                            bookings={confirmed}
                            onCancel={handleCancel}
                            emptyText="No confirmed bookings."
                        />
                        <BookingSection
                            title="Pending Approval"
                            icon={TimerIcon}
                            accent="bg-amber-500/15 text-amber-400"
                            bookings={pending}
                            onCancel={handleCancel}
                            emptyText="No pending bookings."
                        />
                        <BookingSection
                            title="Completed Sessions"
                            icon={Receipt}
                            accent="bg-sky-500/15 text-sky-400"
                            bookings={completed}
                            onCancel={handleCancel}
                            emptyText="No completed sessions yet."
                        />
                        <BookingSection
                            title="Cancelled"
                            icon={Ban}
                            accent="bg-rose-500/15 text-rose-400"
                            bookings={cancelled}
                            onCancel={handleCancel}
                            emptyText="No cancelled bookings."
                        />
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default UserBookings;
