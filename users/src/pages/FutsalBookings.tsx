import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import FutsalNavigation from "@/components/FutsalNavigation";
import FutsalFooter from "@/components/FutsalFooter";
import TimeSlotPicker from "@/components/TimeSlotPicker";
import BookingSummary from "@/components/BookingSummary";
import { useQuery } from "@tanstack/react-query";
import { getFutsalById, getFutsalPitches, getFutsalByName } from "@/lib/futsalApi";
import { useBooking } from "@/contexts/BookingContext";
import { Loader2, ArrowLeft, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

const FutsalBookings = () => {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const [searchParams] = useSearchParams();
  const initialPitchId = searchParams.get("pitch");
  const navigate = useNavigate();
  const paramValue = id || slug;
  const isNumeric = /^\d+$/.test(paramValue || '');
  const [resolvedId, setResolvedId] = useState<string | null>(isNumeric ? paramValue || null : null);

  const {
    selectedDate,
    selectedPitchId,
    setSelectedPitchId,
    availableTimeSlots,
    fetchAvailableTimeSlots
  } = useBooking();

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

  const { data: baseData, isLoading: baseLoading } = useQuery({ queryKey: ['futsal-base', resolvedId], queryFn: () => getFutsalById(resolvedId as string), enabled: !!resolvedId, retry: false });
  const { data: pitchesData, isLoading: pitchesLoading } = useQuery({ queryKey: ['futsal-pitches', resolvedId], queryFn: () => getFutsalPitches(resolvedId as string), enabled: !!resolvedId, retry: false });

  useEffect(() => {
    if (initialPitchId && !selectedPitchId) {
      setSelectedPitchId(initialPitchId);
    }
  }, [initialPitchId, selectedPitchId, setSelectedPitchId]);

  useEffect(() => {
    if (selectedPitchId && resolvedId) {
      fetchAvailableTimeSlots(resolvedId, selectedPitchId, selectedDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, selectedPitchId, resolvedId]);

  const futsal = baseData?.data;
  const pitchesArray = pitchesData?.data || [];
  const selectedPitch = pitchesArray.find((p: any) => String(p.id) === String(selectedPitchId));

  if (baseLoading || pitchesLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <FutsalNavigation name="Loading..." />
        <Loader2 className="h-10 w-10 animate-spin text-emerald-500 my-auto" />
        <p className="text-muted-foreground font-semibold my-auto mt-0">Loading Booking Gateway...</p>
        <FutsalFooter />
      </div>
    );
  }

  if (!futsal) {
    return (
      <div className="min-h-screen flex flex-col">
        <FutsalNavigation name="Facility Not Found" />
        <div className="flex-1 flex items-center justify-center bg-background">
          <div className="text-center bg-card p-10 rounded-3xl shadow-sm border border-border max-w-md mx-4">
            <h1 className="text-2xl font-bold mb-4 text-foreground">Facility Not Found</h1>
            <Button onClick={() => navigate("/futsals")} className="w-full h-12 rounded-xl">Back to Facilities</Button>
          </div>
        </div>
        <FutsalFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <FutsalNavigation name={futsal?.futsalName || "Futsal Booking"} />
      <main className="flex-1 container mx-auto px-4 md:px-6 py-12 max-w-7xl">
        <Button variant="ghost" className="mb-8" onClick={() => navigate(`/futsals/${id}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Facility Details
        </Button>

        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-foreground mb-2">Book Your Session</h1>
          <p className="text-muted-foreground text-lg">Select a slot to confirm your booking at {futsal.futsalName}</p>
        </div>

        {/* The booking layout */}
        <div className="bg-card p-6 md:p-12 rounded-[3rem] border border-border mt-4 shadow-xl shadow-emerald-500/5 relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 xl:grid-cols-3 gap-12">
            
            <div className="xl:col-span-2 bg-muted/50 p-6 sm:p-8 rounded-3xl border border-border shadow-sm flex flex-col">
              {!selectedPitchId ? (
                <div className="flex flex-col items-center justify-center p-10 text-center flex-1">
                  <CalendarDays className="h-16 w-16 text-muted-foreground/30 mb-4" />
                  <h3 className="text-2xl font-bold text-foreground/80 mb-2">No Pitch Selected</h3>
                  <p className="text-muted-foreground mb-6">Please select a pitch from the facility details page first.</p>
                  <Button onClick={() => navigate(`/futsals/${id}`)}>Select Pitch</Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-12 w-12 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
                      <CalendarDays className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Reserve {selectedPitch?.name || `Pitch #${selectedPitchId}`}</h2>
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
      <FutsalFooter />
    </div>
  );
};

export default FutsalBookings;
