import React, { createContext, useContext, useState, ReactNode } from "react";
import { Booking, TimeSlot } from "@/types";
import { 
  createBooking as createBookingAPI,
  getUserBookings as getUserBookingsAPI,
  getAllBookings as getAllBookingsAPI,
  updateBookingStatus as updateBookingStatusAPI,
} from "@/data/mockData";
import { toast } from "@/components/ui/use-toast";
import { getFutsalTimeSlots } from "@/lib/futsalApi";

interface BookingContextType {
  selectedDate: string;
  selectedPitchId: string | null;
  selectedTimeSlotId: string | null;
  availableTimeSlots: TimeSlot[];
  userBookings: Booking[];
  setSelectedDate: (date: string) => void;
  setSelectedPitchId: (pitchId: string | null) => void;
  selectTimeSlot: (timeSlotId: string | null) => void;
  fetchAvailableTimeSlots: (facilityId: string, pitchId: string, date: string) => Promise<void>;
  createBooking: (
    userId: string,
    facilityId: string,
    pricePerHour: number
  ) => Promise<Booking | null>;
  fetchUserBookings: (userId: string) => void;
  getAllBookings: () => Booking[];
  cancelBooking: (bookingId: string, userId: string) => Promise<boolean>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const today = new Date().toISOString().split("T")[0];
  
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [selectedPitchId, setSelectedPitchId] = useState<string | null>(null);
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<string | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);

  const fetchAvailableTimeSlots = async (facilityId: string, pitchId: string, date: string) => {
    try {
      const d = new Date(date);
      const dayOfWeek = d.getDay() + 1; // Maps JS getDay (0=Sun, 6=Sat) to MySQL DAYOFWEEK (1=Sun, 7=Sat)
      
      const res = await getFutsalTimeSlots(facilityId, pitchId, dayOfWeek);
      const slotsArray = res.timeslots || [];
      
      const formattedSlots: TimeSlot[] = slotsArray.map((t: any) => ({
        id: String(t.id),
        pitchId: String(t.pitch_id),
        facilityId: facilityId,
        startTime: t.start_time.substring(0, 5), // "07:00:00" -> "07:00"
        endTime: t.end_time.substring(0, 5),
        date: date,
        isBooked: t.is_available === 0,
        isEnabled: true
      }));

      // Sort chronological
      formattedSlots.sort((a, b) => a.startTime.localeCompare(b.startTime));
      
      setAvailableTimeSlots(formattedSlots);
    } catch (err: any) {
      setAvailableTimeSlots([]);
      console.error(err);
      toast({
        title: "Schedule Unavailable",
        description: "Could not retrieve available time slots for this date.",
        variant: "destructive"
      });
    }
  };

  const selectTimeSlot = (timeSlotId: string | null) => {
    setSelectedTimeSlotId(timeSlotId);
  };

  const createBooking = async (
    userId: string,
    facilityId: string,
    pricePerHour: number
  ): Promise<Booking | null> => {
    if (!selectedPitchId || !selectedTimeSlotId) {
      return null;
    }

    const selectedSlot = availableTimeSlots.find(
      (slot) => slot.id === selectedTimeSlotId
    );

    if (!selectedSlot) {
      return null;
    }

    // Create new booking
    const newBooking = createBookingAPI(
      userId,
      selectedPitchId,
      facilityId,
      selectedTimeSlotId,
      selectedDate,
      selectedSlot.startTime,
      selectedSlot.endTime,
      pricePerHour
    );

    // Refresh available time slots
    if (selectedPitchId) {
       fetchAvailableTimeSlots(facilityId, selectedPitchId, selectedDate);
    }
    
    // Reset selection
    setSelectedTimeSlotId(null);
    
    // Update user bookings
    fetchUserBookings(userId);

    return newBooking;
  };

  const fetchUserBookings = (userId: string) => {
    const bookings = getUserBookingsAPI(userId);
    setUserBookings(bookings);
  };

  const getAllBookings = () => {
    return getAllBookingsAPI();
  };

  const cancelBooking = async (bookingId: string, userId: string): Promise<boolean> => {
    try {
      const booking = updateBookingStatusAPI(bookingId, 'cancelled');
      
      if (booking) {
        // Refresh user bookings
        fetchUserBookings(userId);
        
        toast({
          title: "Booking Cancelled",
          description: "Your booking has been successfully cancelled.",
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      toast({
        title: "Cancellation Failed",
        description: "There was an error cancelling your booking. Please try again.",
        variant: "destructive",
      });
      
      return false;
    }
  };

  return (
    <BookingContext.Provider
      value={{
        selectedDate,
        selectedPitchId,
        selectedTimeSlotId,
        availableTimeSlots,
        userBookings,
        setSelectedDate,
        setSelectedPitchId,
        selectTimeSlot,
        fetchAvailableTimeSlots,
        createBooking,
        fetchUserBookings,
        getAllBookings,
        cancelBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
