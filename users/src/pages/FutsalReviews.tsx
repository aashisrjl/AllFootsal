import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { getFutsalRatings } from "@/lib/futsalApi";
import { ArrowLeft, Loader2, Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const FutsalReviews = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: ratingsData, isLoading } = useQuery({
        queryKey: ['futsal-ratings', id],
        queryFn: () => getFutsalRatings(id as string),
        enabled: !!id
    });

    const reviews = ratingsData?.data || [];

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
                <Header />
                <Loader2 className="h-10 w-10 animate-spin text-emerald-500 my-auto" />
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />
            <main className="flex-1 container mx-auto px-4 md:px-6 py-12 max-w-4xl">
                <Button variant="ghost" className="mb-8" onClick={() => navigate(`/futsals/${id}`)}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Facility Details
                </Button>

                <div className="mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-2">All Reviews</h1>
                    <p className="text-slate-500 text-lg">See what others are saying about this futsal facility.</p>
                </div>

                <div className="grid gap-6">
                    {reviews.length > 0 ? reviews.map((review: any) => (
                        <div key={review.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800">{review.reviewerName || 'Anonymous User'}</h4>
                                        <p className="text-sm text-slate-500">{new Date(review.createdAt || Date.now()).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1 bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-100 text-yellow-600 font-bold items-center">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span>{review.rating}.0</span>
                                </div>
                            </div>
                            <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl">
                                "{review.review}"
                            </p>
                        </div>
                    )) : (
                        <div className="text-center p-12 bg-white rounded-3xl border border-slate-100">
                            <p className="text-slate-500 text-lg">There are no reviews yet for this facility. Be the first to leave one!</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default FutsalReviews;
