import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import FutsalNavigation from "@/components/FutsalNavigation";
import FutsalFooter from "@/components/FutsalFooter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getFutsalRatings,
    getFutsalById,
    getMyRating,
    postRating,
    updateRating,
    deleteRating,
    getFutsalByName,
} from "@/lib/futsalApi";
import {
    ArrowLeft,
    Loader2,
    Star,
    User,
    Pencil,
    Trash2,
    MessageSquarePlus,
    LogIn,
    CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import SentimentBadge from "@/components/SentimentBadge";

// ─── Star Picker ──────────────────────────────────────────────────────────────
const StarPicker = ({
    value,
    onChange,
}: {
    value: number;
    onChange: (v: number) => void;
}) => {
    const [hovered, setHovered] = useState(0);
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    className="transition-transform hover:scale-110 focus:outline-none"
                >
                    <Star
                        className={`h-8 w-8 transition-colors ${
                            star <= (hovered || value)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground/40"
                        }`}
                    />
                </button>
            ))}
        </div>
    );
};


// ─── Star Display ─────────────────────────────────────────────────────────────
const StarDisplay = ({ rating }: { rating: number }) => (
    <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
            <Star
                key={s}
                className={`h-4 w-4 ${
                    s <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground/25"
                }`}
            />
        ))}
    </div>
);

// ─── Review Form ──────────────────────────────────────────────────────────────
const ReviewForm = ({
    futsalId,
    existing,
    onCancel,
}: {
    futsalId: string;
    existing?: { rating: number; review: string } | null;
    onCancel?: () => void;
}) => {
    const [rating, setRating] = useState(existing?.rating ?? 0);
    const [review, setReview] = useState(existing?.review ?? "");
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data: { rating: number; review: string }) =>
            existing
                ? updateRating(futsalId, data)
                : postRating(futsalId, data),
        onSuccess: () => {
            toast({
                title: existing
                    ? "Review updated!"
                    : "Review submitted!",
                description: "Thank you for your feedback.",
            });
            queryClient.invalidateQueries({ queryKey: ["my-rating", futsalId] });
            queryClient.invalidateQueries({
                queryKey: ["futsal-ratings", futsalId],
            });
            if (onCancel) onCancel();
        },
        onError: (err: any) => {
            toast({
                title: "Something went wrong",
                description:
                    err?.response?.data?.message || "Please try again.",
                variant: "destructive",
            });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!rating || rating < 1 || rating > 5) {
            toast({
                title: "Please select a rating",
                description: "Choose between 1 and 5 stars.",
                variant: "destructive",
            });
            return;
        }
        mutation.mutate({ rating, review });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-card rounded-3xl border border-border shadow-md p-6 flex flex-col gap-5"
        >
            <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                    <MessageSquarePlus className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                    <h3 className="font-bold text-foreground text-lg">
                        {existing ? "Edit Your Review" : "Write a Review"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Share your experience with this facility
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-foreground/80">
                    Your Rating
                </label>
                <StarPicker value={rating} onChange={setRating} />
                {rating > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                        {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][
                            rating
                        ]}{" "}
                        — {rating} star{rating > 1 ? "s" : ""}
                    </p>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-foreground/80">
                    Your Review{" "}
                    <span className="font-normal text-muted-foreground">
                        (optional)
                    </span>
                </label>
                <Textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Tell others what you think about this futsal..."
                    rows={3}
                    className="resize-none rounded-xl border-border focus:ring-emerald-400"
                />
            </div>

            <div className="flex gap-3">
                <Button
                    type="submit"
                    disabled={mutation.isPending}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6"
                >
                    {mutation.isPending && (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    {existing ? "Save Changes" : "Submit Review"}
                </Button>
                {onCancel && (
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onCancel}
                        className="rounded-xl"
                    >
                        Cancel
                    </Button>
                )}
            </div>
        </form>
    );
};

// ─── My Review Card ───────────────────────────────────────────────────────────
const MyReviewCard = ({
    review,
    futsalId,
    userName,
}: {
    review: any;
    futsalId: string;
    userName: string;
}) => {
    const [editing, setEditing] = useState(false);
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: () => deleteRating(futsalId),
        onSuccess: () => {
            toast({ title: "Review deleted successfully" });
            queryClient.invalidateQueries({
                queryKey: ["my-rating", futsalId],
            });
            queryClient.invalidateQueries({
                queryKey: ["futsal-ratings", futsalId],
            });
        },
        onError: (err: any) => {
            toast({
                title: "Delete failed",
                description: err?.response?.data?.message || "Please try again.",
                variant: "destructive",
            });
        },
    });

    if (editing) {
        return (
            <ReviewForm
                futsalId={futsalId}
                existing={{ rating: review.rating, review: review.review || "" }}
                onCancel={() => setEditing(false)}
            />
        );
    }

    return (
        <div className="bg-gradient-to-br from-emerald-50 to-background dark:from-emerald-950/40 dark:to-card rounded-3xl border border-border shadow-md p-6 flex flex-col gap-4">
            {/* Badge */}
            <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                    Your Review
                </span>
            </div>

            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="h-11 w-11 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-lg">
                        {userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h4 className="font-bold text-foreground">{userName}</h4>
                        <p className="text-xs text-muted-foreground">
                            {new Date(
                                review.createdAt || Date.now()
                            ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            })}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <SentimentBadge
                        score={review.sentiment_score}
                        label={review.sentiment_label}
                    />
                    <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-500/10 px-3 py-1.5 rounded-full border border-yellow-100 dark:border-yellow-500/20">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-yellow-700 dark:text-yellow-300 text-sm">
                            {review.rating}.0
                        </span>
                    </div>
                </div>
            </div>

            <StarDisplay rating={review.rating} />

            {review.review && (
                <p className="text-foreground/80 leading-relaxed bg-background/70 p-4 rounded-2xl border border-border italic">
                    "{review.review}"
                </p>
            )}

            <div className="flex gap-2 pt-1">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditing(true)}
                    className="rounded-xl gap-1.5 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteMutation.mutate()}
                    disabled={deleteMutation.isPending}
                    className="rounded-xl gap-1.5 border-red-200 text-red-500 hover:bg-red-50"
                >
                    {deleteMutation.isPending ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                    )}
                    Delete
                </Button>
            </div>
        </div>
    );
};

// ─── Other Review Card ────────────────────────────────────────────────────────
const ReviewCard = ({ review }: { review: any }) => (
    <div className="bg-card p-6 rounded-3xl shadow-sm border border-border flex flex-col gap-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center text-muted-foreground font-bold">
                    {review.reviewerName
                        ? review.reviewerName.charAt(0).toUpperCase()
                        : "A"}
                </div>
                <div>
                    <h4 className="font-bold text-foreground">
                        {review.reviewerName || "Anonymous"}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                        {new Date(
                            review.createdAt || Date.now()
                        ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                <SentimentBadge
                    score={review.sentiment_score}
                    label={review.sentiment_label}
                />
                <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-500/10 px-3 py-1.5 rounded-full border border-yellow-100 dark:border-yellow-500/20">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-yellow-700 dark:text-yellow-300 text-sm">
                        {review.rating}.0
                    </span>
                </div>
            </div>
        </div>

        <StarDisplay rating={review.rating} />

        {review.review && (
            <p className="text-foreground/80 leading-relaxed bg-muted p-4 rounded-2xl">
                "{review.review}"
            </p>
        )}
    </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const FutsalReviews = () => {
    const { id, slug } = useParams<{ id?: string; slug?: string }>();
    const navigate = useNavigate();
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const queryClient = useQueryClient();
    const paramValue = id || slug;
    const isNumeric = /^\d+$/.test(paramValue || '');
    const [resolvedId, setResolvedId] = useState<string | null>(isNumeric ? paramValue || null : null);

    // If slug is not numeric, resolve it to ID first
    const { data: nameData } = useQuery({
        queryKey: ['futsal-resolve-name', paramValue],
        queryFn: () => getFutsalByName(paramValue as string),
        enabled: !!paramValue && !isNumeric && !resolvedId,
        retry: false,
    });

    useEffect(() => {
        if (nameData?.data?.id) {
            setResolvedId(String(nameData.data.id));
        }
    }, [nameData]);

    const { data: baseData, isLoading: baseLoading } = useQuery({
        queryKey: ["futsal-base", resolvedId],
        queryFn: () => getFutsalById(resolvedId as string),
        enabled: !!resolvedId,
        retry: false,
    });

    const { data: ratingsData, isLoading: ratingsLoading } = useQuery({
        queryKey: ["futsal-ratings", resolvedId],
        queryFn: () => getFutsalRatings(resolvedId as string),
        enabled: !!resolvedId,
        retry: false,
    });

    const {
        data: myRatingData,
        isLoading: myRatingLoading,
    } = useQuery({
        queryKey: ["my-rating", resolvedId],
        queryFn: () => getMyRating(resolvedId as string),
        enabled: !!resolvedId && isAuthenticated && !authLoading,
        retry: false,
    });

    const futsalName = baseData?.data?.futsalName || "Futsal Facility";
    const allReviews: any[] = ratingsData?.data || [];
    const myReview = myRatingData?.data ?? null;

    // Filter out the logged-in user's review from the general list
    const otherReviews = myReview
        ? allReviews.filter((r) => r.reviewerName !== (user?.name ?? ""))
        : allReviews;

    const isPageLoading = baseLoading || ratingsLoading || authLoading;

    if (isPageLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-background text-foreground">
                <FutsalNavigation name="Reviews" />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
                </div>
                <FutsalFooter />
            </div>
        );
    }

    // Average rating
    const avgRating =
        allReviews.length > 0
            ? (
                  allReviews.reduce((s, r) => s + (r.rating || 0), 0) /
                  allReviews.length
              ).toFixed(1)
            : null;

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <FutsalNavigation name={futsalName} />

            <main className="flex-1 container mx-auto px-4 md:px-6 py-12 max-w-4xl">
                {/* Back button */}
                <Button
                    variant="ghost"
                    className="mb-8 text-muted-foreground hover:text-foreground"
                    onClick={() => navigate(`/futsals/${resolvedId}`)}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Facility Details
                </Button>

                {/* Header */}
                <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-foreground mb-1">
                            Reviews
                        </h1>
                        <p className="text-muted-foreground text-base">
                            {allReviews.length > 0
                                ? `${allReviews.length} review${allReviews.length !== 1 ? "s" : ""} for ${futsalName}`
                                : `No reviews yet for ${futsalName}`}
                        </p>
                    </div>

                    {avgRating && (
                        <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-5 py-3 shadow-sm">
                            <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
                            <div>
                                <p className="text-3xl font-extrabold text-foreground leading-none">
                                    {avgRating}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Average rating
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-8">
                    {/* ── My Review Section ── */}
                    <section>
                        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                            Your Review
                        </h2>

                        {!isAuthenticated ? (
                            // Not logged in — CTA
                            <div className="bg-card rounded-3xl border border-border p-6 flex items-center gap-4 shadow-sm">
                                <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center shrink-0">
                                    <LogIn className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-foreground">
                                        Log in to leave a review
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Share your experience with this facility
                                    </p>
                                </div>
                                <Button
                                    asChild
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shrink-0"
                                >
                                    <Link to="/auth/login">Login</Link>
                                </Button>
                            </div>
                        ) : myRatingLoading ? (
                            <div className="flex items-center gap-3 text-muted-foreground p-4">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span className="text-sm">Loading your review...</span>
                            </div>
                        ) : myReview ? (
                            // Has review — show it
                            <MyReviewCard
                                review={myReview}
                                futsalId={resolvedId as string}
                                userName={user?.name || "You"}
                            />
                        ) : (
                            // Authenticated, no review — show form
                            <ReviewForm futsalId={resolvedId as string} />
                        )}
                    </section>

                    {/* ── All Other Reviews ── */}
                    <section>
                        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                            {otherReviews.length > 0
                                ? `All Reviews (${otherReviews.length})`
                                : isAuthenticated && !myReview
                                ? "No other reviews yet"
                                : "Community Reviews"}
                        </h2>

                        {otherReviews.length > 0 ? (
                            <div className="grid gap-5">
                                {otherReviews.map((review: any, idx: number) => (
                                    <ReviewCard
                                        key={review.id ?? idx}
                                        review={review}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-12 bg-card rounded-3xl border border-border text-muted-foreground">
                                <MessageSquarePlus className="h-10 w-10 mx-auto mb-3 opacity-40" />
                                <p className="text-lg font-medium">
                                    No community reviews yet
                                </p>
                                <p className="text-sm mt-1">
                                    Be the first to share your experience!
                                </p>
                            </div>
                        )}
                    </section>
                </div>
            </main>

            <FutsalFooter />
        </div>
    );
};

export default FutsalReviews;
