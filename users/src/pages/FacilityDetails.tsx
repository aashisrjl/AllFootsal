
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Navigation";
import Footer from "@/components/Footer";
import PitchCard from "@/components/PitchCard";
import TimeSlotPicker from "@/components/TimeSlotPicker";
import BookingSummary from "@/components/BookingSummary";
import { useQuery } from "@tanstack/react-query";
import { getFutsalById, getFutsalInfo, getFutsalLocation, getFutsalMedia, getFutsalPitches } from "@/lib/futsalApi";
import { getAvailableTimeSlots } from "@/data/mockData";
import { useBooking } from "@/contexts/BookingContext";
import { MapPin, Star, Clock, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const FacilityDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    selectedDate,
    selectedPitchId,
    setSelectedPitchId,
    availableTimeSlots,
    fetchAvailableTimeSlots
  } = useBooking();

  const { data: baseData, isLoading: baseLoading } = useQuery({ queryKey: ['futsal-base', id], queryFn: () => getFutsalById(id as string), enabled: !!id });
  const { data: infoData, isLoading: infoLoading } = useQuery({ queryKey: ['futsal-info', id], queryFn: () => getFutsalInfo(id as string), enabled: !!id });
  const { data: locData, isLoading: locLoading } = useQuery({ queryKey: ['futsal-loc', id], queryFn: () => getFutsalLocation(id as string), enabled: !!id });
  const { data: mediaData, isLoading: mediaLoading } = useQuery({ queryKey: ['futsal-media', id], queryFn: () => getFutsalMedia(id as string, 'home'), enabled: !!id });
  const { data: pitchesData, isLoading: pitchesLoading } = useQuery({ queryKey: ['futsal-pitches', id], queryFn: () => getFutsalPitches(id as string), enabled: !!id });

  const isPageLoading = baseLoading || infoLoading || locLoading || mediaLoading || pitchesLoading;

  const futsal = baseData?.data;
  const info = infoData?.data?.[0];
  const loc = locData?.data?.[0];
  const mediaObj = mediaData?.data?.[0];

  const parsedFacilities = info?.facilities ? safelyParse(info.facilities) : ["Drinking water", "Bathroom"];
  const parsedHours = info?.operating_hours ? safelyParse(info.operating_hours) : ["6:00 AM - 10:00 PM"];

  // Merge live API tenant details into the mapping schema
  const dynamicFacility = futsal ? {
    id: futsal.id,
    name: futsal.futsalName || "Unknown Futsal Tenant",
    location: loc ? `${loc.address || ''}, ${loc.city || ''}` : "Unknown Location",
    description: info?.additional_info || "Premium Futsal arena matching strictly maintained grounds standards.",
    image: mediaObj?.media_url || "https://images.unsplash.com/photo-1574629810360-7efbb1925846?q=80&w=1200",
    pitches: pitchesData?.data || [],
    rating: 5.0,
    reviews: 0,
    operating_hours: parsedHours,
    amenities: parsedFacilities
  } : null;

  // Find selected pitch
  const selectedPitch = dynamicFacility?.pitches.find((p: any) => String(p.id) === selectedPitchId);

  // Handle pitch selection
  const handleSelectPitch = (pitchId: string) => {
    setSelectedPitchId(pitchId);
    fetchAvailableTimeSlots(pitchId, selectedDate);
  };

  // Fetch available time slots when date changes
  useEffect(() => {
    if (selectedPitchId) {
      fetchAvailableTimeSlots(selectedPitchId, selectedDate);
    }
  }, [selectedDate, selectedPitchId, fetchAvailableTimeSlots]);

  if (isPageLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Header />
        <Loader2 className="h-10 w-10 animate-spin text-emerald-500 my-auto" />
        <p className="my-auto text-slate-500 font-semibold mt-0">Loading Futsal Booking Environment...</p>
        <Footer />
      </div>
    );
  }

  if (!dynamicFacility) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Facility Not Found</h1>
            <Button onClick={() => navigate("/futsals")}>
              Back to Facilities
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Facility Header */}
        <div
          className="bg-cover bg-center h-[35vh] relative"
          style={{ backgroundImage: `url(${dynamicFacility.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/60 to-black/30 flex items-end">
            <div className="container mx-auto px-4 md:px-6 py-8">
              <Button
                variant="outline"
                size="sm"
                className="mb-4 text-white border-white/50 bg-black/30 backdrop-blur hover:bg-white hover:text-black"
                onClick={() => navigate("/futsals")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Futsals
              </Button>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3">
                {dynamicFacility.name}
              </h1>
              <div className="flex flex-wrap gap-5 text-slate-200 font-medium">
                <div className="flex items-center gap-1.5 border border-white/20 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm">{dynamicFacility.location}</span>
                </div>
                <div className="flex items-center gap-1.5 border border-white/20 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{dynamicFacility.rating} ({dynamicFacility.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 border border-white/20 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <Clock className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm">Operating: {dynamicFacility.operating_hours[0] || "6:00 AM - 10:00 PM"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto py-10 px-4 md:px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-8">
            {/* Main Facility Description & Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-3 text-slate-900">About This Facility</h2>
                <p className="text-slate-600 leading-relaxed text-lg">{dynamicFacility.description}</p>
              </div>

              {dynamicFacility.amenities.length > 0 && (
                <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
                  <h3 className="font-bold text-lg mb-4 text-slate-800">Provided Amenities</h3>
                  <div className="flex flex-wrap gap-3">
                    {dynamicFacility.amenities.map((amenity: string, idx: number) => (
                      <span key={idx} className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl text-emerald-700 font-medium shadow-sm border border-emerald-200/60">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Pitches Section */}
            <div className="mb-10 lg:col-span-3">
              <h2 className="text-2xl font-bold mb-6 text-slate-900">Available Pitches</h2>
              {dynamicFacility.pitches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dynamicFacility.pitches.map((pitch: any) => (
                    <PitchCard
                      key={pitch.id}
                      pitch={pitch}
                      onSelectPitch={handleSelectPitch}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-slate-500 font-medium">No pitches have been mapped to this Futsal yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Booking Section */}
          {selectedPitchId && selectedPitch && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Book Your Session</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <TimeSlotPicker timeSlots={availableTimeSlots} />
                </div>
                <div>
                  <BookingSummary
                    facilityId={dynamicFacility.id}
                    facilityName={dynamicFacility.name}
                    pitchName={selectedPitch.name || `Pitch #${selectedPitch.id}`}
                    pricePerHour={selectedPitch.pricePerHour || 1000}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FacilityDetails;
