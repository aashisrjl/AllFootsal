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
