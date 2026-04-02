import { API } from "./authApi";

export type FutsalProfileApiData = {
    id: number | string;
    futsalCode: number | string;
    futsalName: string;
    email: string;
    phoneNumber?: string;
    role: "futsal";
    ownerName: string;
    ownerEmail?: string | null;
    profileImage?: string | null;
    isActive?: boolean;
    isVerified?: boolean;
    createdAt?: string;
    updatedAt?: string;
};

type FutsalProfileResponse = {
    success: boolean;
    message: string;
    data: FutsalProfileApiData;
};

// get logged in futsal profile via ftoken cookie
export const getFutsalProfile = async (): Promise<FutsalProfileResponse> => {
    const res = await API.get("/futsals-profile");
    return res.data;
};

// get single futsal by id
export const getFutsalById = async (id: number | string): Promise<FutsalProfileResponse> => {
    const res = await API.get(`/futsal/${id}`);
    return res.data;
};

// get all futsals
export const getAllFutsals = async () => {
    const res = await API.get("/admin/futsals");
    return res.data;
};

// get futsal extra info (amenities, etc)
export const getFutsalInfo = async (id: number | string) => {
    const res = await API.get(`/futsal/${id}/info/`);
    return res.data;
};

// get futsal location info 
export const getFutsalLocation = async (id: number | string) => {
    const res = await API.get(`/futsal/${id}/location/`);
    return res.data;
};

// get futsal media
export const getFutsalMedia = async (id: number | string, category: string = 'home') => {
    const res = await API.get(`/futsal/${id}/media?category=${category}`);
    return res.data;
};

// get futsal pitches 
export const getFutsalPitches = async (id: number | string) => {
    const res = await API.get(`/futsal/${id}/pitches/`);
    return res.data;
};

// get futsal timeslots
export const getFutsalTimeSlots = async (futsalId: number | string, pitchId: number | string, dayOfWeek: number) => {
    const res = await API.get(`/futsal/${futsalId}/timeslots?pitch_id=${pitchId}&day_of_week=${dayOfWeek}`);
    return res.data;
};

// get futsal ratings
export const getFutsalRatings = async (id: number | string) => {
    const res = await API.get(`/futsal/${id}/ratings`);
    return res.data;
};

// send contact message to futsal
export const sendContactMessage = async (futsalId: number | string, message: string) => {
    const res = await API.post(`/futsal/${futsalId}/contact`, { message });
    return res.data;
};

//track the visited user
export const trackVisitors = async (futsalId: number | string) => {
    const res = await API.post(`/futsal/${futsalId}/visitors/track`);
    return res.data;
}

// get pitches media
export const getPitchesMedia = async (futsalId: number | string, pitchId: number | string) => {
    const res = await API.get(`/futsal/${futsalId}/media/pitche/${pitchId}`);
    return res.data;
}

// get event media "/futsal/:futsalId/media/event",
export const getEventMedia = async (futsalId: number | string) => {
    const res = await API.get(`/futsal/${futsalId}/media/event`);
    return res.data;
}

// bookings 
export const getUserBookingsForFutsal = async (futsalId: number | string) => {
    const res = await API.get(`/futsal/${futsalId}/bookings`);
    return res.data;
};

export const createBooking = async (futsalId: number | string, data: any) => {
    const res = await API.post(`/futsal/${futsalId}/bookings`, data);
    return res.data;
};

export const cancelBooking = async (futsalId: number | string, bookingId: number | string) => {
    const res = await API.patch(`/futsal/${futsalId}/bookings/${bookingId}/cancel`);
    return res.data;
};

// payments
export const getUserPayments = async (futsalId: number | string) => {
    const res = await API.get(`/futsal/${futsalId}/payments/me`);
    return res.data;
};

export const createPayment = async (futsalId: number | string, data: any) => {
    const res = await API.post(`/futsal/${futsalId}/payments/create`, data);
    return res.data;
};

export const verifyPayment = async (futsalId: number | string, paymentId: number | string, data: any) => {
    const res = await API.post(`/futsal/${futsalId}/payments/${paymentId}/verify`, data);
    return res.data;
};

export const getPaymentByBookingId = async (futsalId: number | string, bookingId: number | string) => {
    const res = await API.get(`/futsal/${futsalId}/bookings/${bookingId}/payment`);
    return res.data;
};

// ratings (user specific)
export const getMyRating = async (futsalId: number | string) => {
    const res = await API.get(`/futsal/${futsalId}/ratings/me`);
    return res.data;
};

export const postRating = async (futsalId: number | string, data: any) => {
    const res = await API.post(`/futsal/${futsalId}/ratings/me`, data);
    return res.data;
};

export const updateRating = async (futsalId: number | string, data: any) => {
    const res = await API.put(`/futsal/${futsalId}/ratings/me`, data);
    return res.data;
};

export const deleteRating = async (futsalId: number | string) => {
    const res = await API.delete(`/futsal/${futsalId}/ratings/me`);
    return res.data;
};
