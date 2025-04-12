
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Booking, TimeSlot } from "@/types";
import { 
  getAvailableTimeSlots, 
  createBooking as createBookingAPI,
  getUserBookings as getUserBookingsAPI,
  getAllBookings as getAllBookingsAPI
} from "@/data/mockData";

interface BookingContextType {
  selectedDate: string;
  selectedPitchId: string | null;
  selectedTimeSlotId: string | null;
  availableTimeSlots: TimeSlot[];
  userBookings: Booking[];
  setSelectedDate: (date: string) => void;
  setSelectedPitchId: (pitchId: string | null) => void;
  selectTimeSlot: (timeSlotId: string | null) => void;
  fetchAvailableTimeSlots: (pitchId: string, date: string) => void;
  createBooking: (
    userId: string,
    facilityId: string,
    pricePerHour: number
  ) => Promise<Booking | null>;
  fetchUserBookings: (userId: string) => void;
  getAllBookings: () => Booking[];
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const today = new Date().toISOString().split("T")[0];
  
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [selectedPitchId, setSelectedPitchId] = useState<string | null>(null);
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<string | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);

  const fetchAvailableTimeSlots = (pitchId: string, date: string) => {
    const timeSlots = getAvailableTimeSlots(pitchId, date);
    setAvailableTimeSlots(timeSlots);
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
    fetchAvailableTimeSlots(selectedPitchId, selectedDate);
    
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
