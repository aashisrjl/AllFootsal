import { API } from "./authApi";

export type UserProfileApiData = {
	id: number | string;
	username: string;
	email: string;
	phoneNumber?: string;
	profileImage?: string | null;
	role: "user" | "admin" | "footsal";
	notifications?: boolean;
	darkMode?: boolean;
	isActive?: boolean;
	isVerified?: boolean;
	createdAt?: string;
	updatedAt?: string;
};

type UserProfileResponse = {
	success: boolean;
	message: string;
	data: UserProfileApiData;
};

//get single user by id
export const getUserById = async (id: string | number): Promise<UserProfileResponse> => {
	const res = await API.get(`/users/${id}`);
	return res.data;
};

// get loggged in user profile
export const getProfile = async (): Promise<UserProfileResponse> => {
	const res = await API.get("/user/profile/");
	return res.data;
};

//update profile informastion
export const updateProfile = async (payload: {
	username?: string;
	email?: string;
	phoneNumber?: string;
}): Promise<UserProfileResponse> => {
	const res = await API.put("/user/profile/", payload);
	return res.data;
};

// update profile image for user
export const updateProfileImage = async (imageFile: File): Promise<UserProfileResponse> => {
	const formData = new FormData();
	formData.append("image", imageFile);

	const res = await API.put("/users/profile/image", formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

	return res.data;
};

// remove user profile
export const deleteProfileImage = async (): Promise<UserProfileResponse> => {
	const res = await API.delete("/users/profile/image");
	return res.data;
};

//change user password
export const changePassword = async (payload: {
	newPassword: string;
	cNewPassword: string;
}): Promise<{ success: boolean; message: string }> => {
	const res = await API.patch("/auth/change-password", payload);
	return res.data;
};

// get all bookings globally
export const getUserBookings = async (): Promise<any> => {
	const res = await API.get("/user/bookings");
	return res.data;
};

