import { API } from "@/lib/authApi";

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

export const getUserById = async (id: string | number): Promise<UserProfileResponse> => {
	const res = await API.get(`/users/${id}`);
	return res.data;
};

export const getProfile = async (): Promise<UserProfileResponse> => {
	const res = await API.get("/user/profile/");
	return res.data;
};

export const updateProfile = async (payload: {
	username?: string;
	email?: string;
	phoneNumber?: string;
}): Promise<UserProfileResponse> => {
	const res = await API.put("/user/profile/", payload);
	return res.data;
};

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

export const deleteProfileImage = async (): Promise<UserProfileResponse> => {
	const res = await API.delete("/users/profile/image");
	return res.data;
};

export const changePassword = async (payload: {
	newPassword: string;
	cNewPassword: string;
}): Promise<{ success: boolean; message: string }> => {
	const res = await API.patch("/auth/change-password", payload);
	return res.data;
};

