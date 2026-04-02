import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FutsalNavigation from "@/components/FutsalNavigation";
import FutsalFooter from "@/components/FutsalFooter";
import { useQuery } from "@tanstack/react-query";
import { getFutsalMedia, getEventMedia, getFutsalById } from "@/lib/futsalApi";
import { Loader2, ArrowLeft, Maximize2, X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

const FutsalGallery = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [activeFilter, setActiveFilter] = useState<string>("All");
    const [selectedImage, setSelectedImage] = useState<{url: string, category: string} | null>(null);

    // Fetch details for header
    const { data: baseData, isLoading: baseLoading } = useQuery({ queryKey: ['futsal-base', id], queryFn: () => getFutsalById(id as string), enabled: !!id, retry: false });
    const futsalName = baseData?.data?.futsalName || "Futsal Facility";

    // Fetch media categories
    const { data: homeMediaData, isLoading: homeLoading } = useQuery({ 
        queryKey: ['futsal-media-home', id], 
        queryFn: () => getFutsalMedia(id as string, 'home'), 
        enabled: !!id,
        retry: false
    });
    
    const { data: facilityMediaData, isLoading: facilityLoading } = useQuery({ 
        queryKey: ['futsal-media-facility', id], 
        queryFn: () => getFutsalMedia(id as string, 'facility'), 
        enabled: !!id,
        retry: false
    });

    const { data: eventMediaData, isLoading: eventLoading } = useQuery({ 
        queryKey: ['futsal-media-event', id], 
        queryFn: () => getEventMedia(id as string), 
        enabled: !!id,
        retry: false
    });
    
    const isLoading = baseLoading || homeLoading || facilityLoading || eventLoading;

    // Process maps
    const formatMedia = (mediaArray: any[], categoryName: string) => {
        if (!mediaArray || !Array.isArray(mediaArray)) return [];
        return mediaArray.map(m => ({
            id: m.id || Math.random().toString(),
            url: m.url || m.media_url,
            category: categoryName
        })).filter(m => !!m.url);
    };

    const homeImages = formatMedia(homeMediaData?.data, "Home");
    const facilityImages = formatMedia(facilityMediaData?.data, "Facilities");
    const eventImages = formatMedia(eventMediaData?.data, "Events"); // The API for getEventMedia might return the array directly or in `.data`, so we do `.data` and let formatMedia safely fallback if needed. Actually it returns `res.data`. If API returns `{ success, data: [] }`, `?.data` works. If it returns just `[]`, formatMedia will see undefined and we should also pass `eventMediaData` itself if it's an array. Let's handle both.
    
    const safeEventImages = formatMedia(Array.isArray(eventMediaData) ? eventMediaData : eventMediaData?.data, "Events");

    const allImages = [...homeImages, ...facilityImages, ...safeEventImages];

    const filters = ["All", "Home", "Facilities", "Events"];
    const filteredImages = activeFilter === "All" ? allImages : allImages.filter(img => img.category === activeFilter);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
                <FutsalNavigation name="Loading Gallery..." />
                <Loader2 className="h-10 w-10 animate-spin text-emerald-500 my-auto" />
                <FutsalFooter />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
            <FutsalNavigation name={futsalName} />
            
            <main className="flex-1 container mx-auto px-4 md:px-6 py-10 max-w-7xl">
                <Button variant="ghost" className="mb-6 hover:bg-emerald-50 text-emerald-700" onClick={() => navigate(`/futsals/${id}`)}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Facility
                </Button>

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-3 tracking-tight">Full Gallery</h1>
                        <p className="text-slate-500 text-lg">Browse systematically curated photos from {futsalName}.</p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
                        <div className="px-3 text-slate-400 hidden sm:block"><Filter className="h-4 w-4" /></div>
                        {filters.map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-5 py-2.5 outline-none rounded-xl text-sm font-bold transition-all duration-300 ${
                                    activeFilter === filter 
                                    ? "bg-emerald-500 text-white shadow-md transform scale-105" 
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                }`}
                            >
                                {filter} {filter !== "All" && <span className="opacity-70 ml-1 text-xs">({formatMedia(
                                    filter === "Home" ? homeMediaData?.data : 
                                    filter === "Facilities" ? facilityMediaData?.data : 
                                    Array.isArray(eventMediaData) ? eventMediaData : eventMediaData?.data
                                , filter).length})</span>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Masonry Layout */}
                {filteredImages.length > 0 ? (
                    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
                        {filteredImages.map((img, index) => (
                            <div 
                                key={`${img.id}-${index}`} 
                                className="break-inside-avoid relative group rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 bg-slate-200 cursor-pointer"
                                onClick={() => setSelectedImage(img)}
                            >
                                <img 
                                    src={img.url} 
                                    alt={`Gallery photo ${index}`} 
                                    className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    <div className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full w-max mb-3">
                                        {img.category}
                                    </div>
                                    <div className="flex items-center gap-2 text-white font-medium">
                                        <Maximize2 className="h-4 w-4" /> Tap to enlarge
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-20 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                        <div className="h-20 w-20 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                            <Filter className="h-8 w-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">No photos found</h3>
                        <p className="text-slate-500 max-w-sm">No images are currently available in the "{activeFilter}" category. Try selecting another filter.</p>
                        <Button 
                            variant="outline" 
                            className="mt-6 border-slate-200"
                            onClick={() => setActiveFilter("All")}
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}
            </main>

            <FutsalFooter />

            {/* Lightbox / Selected Image Modal */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300"
                    onClick={() => setSelectedImage(null)}
                >
                    <button 
                        className="absolute top-6 right-6 md:top-10 md:right-10 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors backdrop-blur-md"
                        onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
                    >
                        <X className="h-6 w-6" />
                    </button>
                    
                    <div className="relative max-w-6xl w-full max-h-screen flex flex-col justify-center items-center" onClick={e => e.stopPropagation()}>
                        <img 
                            src={selectedImage.url} 
                            alt="Full screen preview" 
                            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
                        />
                        <div className="mt-6 flex flex-col items-center text-center">
                            <span className="bg-emerald-500 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-3 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                                {selectedImage.category} Collection
                            </span>
                            <p className="text-slate-300 text-sm max-w-md">Use the X button or tap outside the image to close this preview.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FutsalGallery;
