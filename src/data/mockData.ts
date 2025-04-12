
import { Facility, Pitch, TimeSlot, Booking, User } from "@/types";

// Mock users data
export const users: User[] = [
  {
    id: "user1",
    name: "John Doe",
    email: "johndoe@example.com",
    role: "user",
  },
  {
    id: "admin1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
  },
];

// Mock facilities data
export const facilities: Facility[] = [
  {
    id: "facility1",
    name: "Goal Futsal Kathmandu",
    location: "Baluwatar, Kathmandu",
    description: "Premier futsal facility in the heart of Kathmandu with 3 international standard pitches. Enjoy modern amenities including changing rooms, showers, and a sports cafe.",
    image: "/images/facility1.jpg",
    pitches: [],
    rating: 4.8,
    reviews: 127,
  },
  {
    id: "facility2",
    name: "Velocity Futsal",
    location: "Baneshwor, Kathmandu",
    description: "Modern futsal center with high-quality turf and excellent lighting for night games. Features 2 competitive pitches and a viewing area for spectators.",
    image: "/images/facility2.jpg",
    pitches: [],
    rating: 4.6,
    reviews: 98,
  },
  {
    id: "facility3",
    name: "Everest Futsal Arena",
    location: "Lalitpur, Nepal",
    description: "Spacious futsal complex with 4 state-of-the-art pitches. Perfect for tournaments and competitive play with professional-grade facilities.",
    image: "/images/facility3.jpg",
    pitches: [],
    rating: 4.9,
    reviews: 156,
  },
  {
    id: "facility4",
    name: "Himalayan Futsal Zone",
    location: "Pokhara, Nepal",
    description: "Scenic futsal venue with a view of the mountains. Features 2 well-maintained pitches and friendly staff to assist with bookings.",
    image: "/images/facility4.jpg",
    pitches: [],
    rating: 4.7,
    reviews: 89,
  },
];

// Mock pitches data
export const pitches: Pitch[] = [
  {
    id: "pitch1",
    name: "Pitch A",
    facilityId: "facility1",
    pricePerHour: 1000,
    isEnabled: true,
    image: "/images/pitch1.jpg",
  },
  {
    id: "pitch2",
    name: "Pitch B",
    facilityId: "facility1",
    pricePerHour: 1200,
    isEnabled: true,
    image: "/images/pitch2.jpg",
  },
  {
    id: "pitch3",
    name: "Pitch C",
    facilityId: "facility1",
    pricePerHour: 1000,
    isEnabled: true,
    image: "/images/pitch3.jpg",
  },
  {
    id: "pitch4",
    name: "Pitch A",
    facilityId: "facility2",
    pricePerHour: 900,
    isEnabled: true,
    image: "/images/pitch4.jpg",
  },
  {
    id: "pitch5",
    name: "Pitch B",
    facilityId: "facility2",
    pricePerHour: 900,
    isEnabled: true,
    image: "/images/pitch5.jpg",
  },
  {
    id: "pitch6",
    name: "Pitch A",
    facilityId: "facility3",
    pricePerHour: 1100,
    isEnabled: true,
    image: "/images/pitch6.jpg",
  },
  {
    id: "pitch7",
    name: "Pitch B",
    facilityId: "facility3",
    pricePerHour: 1100,
    isEnabled: true,
    image: "/images/pitch7.jpg",
  },
  {
    id: "pitch8",
    name: "Pitch C",
    facilityId: "facility3",
    pricePerHour: 1100,
    isEnabled: true,
    image: "/images/pitch8.jpg",
  },
  {
    id: "pitch9",
    name: "Pitch D",
    facilityId: "facility3",
    pricePerHour: 1200,
    isEnabled: true,
    image: "/images/pitch9.jpg",
  },
  {
    id: "pitch10",
    name: "Pitch A",
    facilityId: "facility4",
    pricePerHour: 800,
    isEnabled: true,
    image: "/images/pitch10.jpg",
  },
  {
    id: "pitch11",
    name: "Pitch B",
    facilityId: "facility4",
    pricePerHour: 800,
    isEnabled: true,
    image: "/images/pitch11.jpg",
  },
];

// Function to generate time slots for a specific date
export const generateTimeSlots = (date: string, pitchId: string, facilityId: string): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  // Generate time slots from 6 AM to 10 PM with 1-hour intervals
  for (let hour = 6; hour < 22; hour++) {
    const startHour = hour < 10 ? `0${hour}:00` : `${hour}:00`;
    const endHour = hour + 1 < 10 ? `0${hour + 1}:00` : `${hour + 1}:00`;
    
    // Generate a random boolean with 80% chance of being available
    const isBooked = Math.random() > 0.8;
    
    slots.push({
      id: `slot-${pitchId}-${date}-${hour}`,
      pitchId,
      facilityId,
      startTime: startHour,
      endTime: endHour,
      date,
      isBooked,
      isEnabled: true,
    });
  }
  return slots;
};

// Function to generate a week's worth of time slots for all pitches
export const generateWeekTimeSlots = () => {
  const timeSlots: TimeSlot[] = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + i);
    const dateString = currentDate.toISOString().split('T')[0];
    
    pitches.forEach(pitch => {
      const pitchSlots = generateTimeSlots(dateString, pitch.id, pitch.facilityId);
      timeSlots.push(...pitchSlots);
    });
  }
  
  return timeSlots;
};

// Mock bookings data (empty array to start)
export const bookings: Booking[] = [];

// Update facilities with their respective pitches
facilities.forEach(facility => {
  facility.pitches = pitches.filter(pitch => pitch.facilityId === facility.id);
});

// Generate time slots for the week
export const timeSlots = generateWeekTimeSlots();

// Function to get available time slots for a specific pitch and date
export const getAvailableTimeSlots = (pitchId: string, date: string) => {
  return timeSlots.filter(
    slot => slot.pitchId === pitchId && 
           slot.date === date && 
           !slot.isBooked &&
           slot.isEnabled
  );
};

// Function to create a new booking
export const createBooking = (
  userId: string,
  pitchId: string,
  facilityId: string,
  timeSlotId: string,
  date: string,
  startTime: string,
  endTime: string,
  totalPrice: number
): Booking => {
  const newBooking: Booking = {
    id: `booking-${Date.now()}`,
    userId,
    pitchId,
    facilityId,
    timeSlotId,
    date,
    startTime,
    endTime,
    totalPrice,
    isPaid: false,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  
  // Mark the time slot as booked
  const timeSlotIndex = timeSlots.findIndex(slot => slot.id === timeSlotId);
  if (timeSlotIndex !== -1) {
    timeSlots[timeSlotIndex].isBooked = true;
  }
  
  // Add to bookings
  bookings.push(newBooking);
  
  return newBooking;
};

// Function to get bookings for a specific user
export const getUserBookings = (userId: string) => {
  return bookings.filter(booking => booking.userId === userId);
};

// Function to get all bookings (for admin)
export const getAllBookings = () => {
  return bookings;
};

// Function to update booking status
export const updateBookingStatus = (bookingId: string, status: 'pending' | 'confirmed' | 'cancelled' | 'completed') => {
  const bookingIndex = bookings.findIndex(booking => booking.id === bookingId);
  if (bookingIndex !== -1) {
    bookings[bookingIndex].status = status;
    return bookings[bookingIndex];
  }
  return null;
};
