import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import FutsalNavigation from "@/components/FutsalNavigation";
import Footer from "@/components/Footer";
import TimeSlotPicker from "@/components/TimeSlotPicker";
import BookingSummary from "@/components/BookingSummary";
import { useQuery } from "@tanstack/react-query";
import { getFutsalById, getFutsalPitches } from "@/lib/futsalApi";
import { useBooking } from "@/contexts/BookingContext";
import { Loader2, ArrowLeft, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

const FutsalBookings = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const initialPitchId = searchParams.get("pitch");
  const navigate = useNavigate();

  const {
    selectedDate,
    selectedPitchId,
    setSelectedPitchId,
    availableTimeSlots,
    fetchAvailableTimeSlots
  } = useBooking();

  const { data: baseData, isLoading: baseLoading } = useQuery({ queryKey: ['futsal-base', id], queryFn: () => getFutsalById(id as string), enabled: !!id });
  const { data: pitchesData, isLoading: pitchesLoading } = useQuery({ queryKey: ['futsal-pitches', id], queryFn: () => getFutsalPitches(id as string), enabled: !!id });

  useEffect(() => {
    if (initialPitchId && !selectedPitchId) {
      setSelectedPitchId(initialPitchId);
    }
  }, [initialPitchId, selectedPitchId, setSelectedPitchId]);

  useEffect(() => {
    if (selectedPitchId && id) {
      fetchAvailableTimeSlots(id, selectedPitchId, selectedDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, selectedPitchId, id]);

  const futsal = baseData?.data;
  const pitchesArray = pitchesData?.data || [];
  const selectedPitch = pitchesArray.find((p: any) => String(p.id) === String(selectedPitchId));

  if (baseLoading || pitchesLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <FutsalNavigation name="Loading..." />
        <Loader2 className="h-10 w-10 animate-spin text-emerald-500 my-auto" />
        <p className="text-slate-500 font-semibold my-auto mt-0">Loading Booking Gateway...</p>
        <Footer />
      </div>
    );
  }

  if (!futsal) {
    return (
      <div className="min-h-screen flex flex-col">
        <FutsalNavigation name="Facility Not Found" />
        <div className="flex-1 flex items-center justify-center bg-slate-50">
          <div className="text-center bg-white p-10 rounded-3xl shadow-sm border border-slate-100 max-w-md mx-4">
            <h1 className="text-2xl font-bold mb-4 text-slate-800">Facility Not Found</h1>
            <Button onClick={() => navigate("/futsals")} className="w-full h-12 rounded-xl">Back to Facilities</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <FutsalNavigation name={futsal?.futsalName || "Futsal Booking"} />
      <main className="flex-1 container mx-auto px-4 md:px-6 py-12 max-w-7xl">
        <Button variant="ghost" className="mb-8" onClick={() => navigate(`/futsals/${id}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Facility Details
        </Button>

        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Book Your Session</h1>
          <p className="text-slate-500 text-lg">Select a slot to confirm your booking at {futsal.futsalName}</p>
        </div>

        {/* The booking layout */}
        <div className="bg-white p-6 md:p-12 rounded-[3rem] border border-emerald-100 shadow-xl shadow-emerald-500/5 relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 xl:grid-cols-3 gap-12">
            
            <div className="xl:col-span-2 bg-slate-50/50 p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
              {!selectedPitchId ? (
                <div className="flex flex-col items-center justify-center p-10 text-center flex-1">
                  <CalendarDays className="h-16 w-16 text-slate-300 mb-4" />
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">No Pitch Selected</h3>
                  <p className="text-slate-500 mb-6">Please select a pitch from the facility details page first.</p>
                  <Button onClick={() => navigate(`/futsals/${id}`)}>Select Pitch</Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                      <CalendarDays className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Reserve {selectedPitch?.name || `Pitch #${selectedPitchId}`}</h2>
                  </div>
                  <TimeSlotPicker timeSlots={availableTimeSlots} />
                </>
              )}
            </div>
            
            <div className="xl:col-span-1">
              {selectedPitch && (
                <BookingSummary
                  facilityId={String(futsal.id)}
                  facilityName={futsal.futsalName || "Futsal Arena"}
                  pitchName={selectedPitch.name || `Pitch #${selectedPitch.id}`}
                  pricePerHour={Number(selectedPitch.price_per_hour || 1000)}
                />
              )}
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FutsalBookings;
