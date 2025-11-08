
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Navigation";
import Footer from "@/components/Footer";
import PitchCard from "@/components/PitchCard";
import TimeSlotPicker from "@/components/TimeSlotPicker";
import BookingSummary from "@/components/BookingSummary";
import { facilities, getAvailableTimeSlots } from "@/data/mockData";
import { useBooking } from "@/contexts/BookingContext";
import { MapPin, Star, Clock, ArrowLeft } from "lucide-react";
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

  // Find the facility data
  const facility = facilities.find((f) => f.id === id);

  // Find selected pitch
  const selectedPitch = facility?.pitches.find((p) => p.id === selectedPitchId);

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

  if (!facility) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Facility Not Found</h1>
            <Button onClick={() => navigate("/facilities")}>
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
          className="bg-cover bg-center h-64 relative" 
          style={{ backgroundImage: `url(${facility.image})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
            <div className="container mx-auto px-4 md:px-6 py-8">
              <Button 
                variant="outline" 
                size="sm" 
                className="mb-4 text-white border-white hover:bg-white hover:text-black"
                onClick={() => navigate("/facilities")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Facilities
              </Button>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {facility.name}
              </h1>
              <div className="flex flex-wrap gap-4 text-white">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{facility.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{facility.rating} ({facility.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Open 6:00 AM - 10:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto py-8 px-4 md:px-6">
          {/* Facility Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">About This Facility</h2>
            <p className="text-gray-700">{facility.description}</p>
          </div>
          
          {/* Pitches Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Available Pitches</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {facility.pitches.map((pitch) => (
                <PitchCard
                  key={pitch.id}
                  pitch={pitch}
                  onSelectPitch={handleSelectPitch}
                />
              ))}
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
                    facilityId={facility.id}
                    facilityName={facility.name}
                    pitchName={selectedPitch.name}
                    pricePerHour={selectedPitch.pricePerHour}
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
