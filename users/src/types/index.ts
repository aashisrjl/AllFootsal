export interface Facility {
  id: string;
  name: string;
  location: string;
  description: string;
  image: string;
  pitches: Pitch[];
  rating: number;
  reviews: number;
  isUnderMaintenance?: boolean;
  maintenanceReason?: string;
}

export interface Pitch {
  id: string;
  name: string;
  facilityId: string;
  pricePerHour: number;
  isEnabled: boolean;
  image: string;
  isUnderMaintenance?: boolean;
  maintenanceReason?: string;
}

export interface TimeSlot {
  id: string;
  pitchId: string;
  facilityId: string;
  startTime: string;
  endTime: string;
  date: string;
  isBooked: boolean;
  isEnabled: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  pitchId: string;
  facilityId: string;
  timeSlotId: string;
  date: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  isPaid: boolean;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "footsal";
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
