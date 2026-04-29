import { API } from "./authApi";

export interface Notification {
  id: number;
  user_id: number;
  type:
    | "booking_created"
    | "booking_confirmed"
    | "booking_rejected"
    | "booking_cancelled"
    | "payment_completed"
    | "review_posted"
    | "forum_reply"
    | "subscription_expiring"
    | "verification_required"
    | "general_notification";
  title: string;
  message: string;
  related_id?: number | null;
  related_type?: "booking" | "payment" | "review" | "forum" | "subscription" | "user" | null;
  is_read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  success: boolean;
  message: string;
  data: Notification[];
  total: number;
  page: number;
  limit: number;
}

export const getUserNotifications = async (
  page = 1,
  limit = 20,
  unreadOnly = false
): Promise<NotificationsResponse> => {
  const res = await API.get("/user/notifications", {
    params: { page, limit, unreadOnly },
  });
  return res.data;
};

export const getUnreadCount = async (): Promise<{ success: boolean; unreadCount: number }> => {
  const res = await API.get("/user/notifications/unread-count");
  return res.data;
};

export const markAsRead = async (id: number): Promise<{ success: boolean }> => {
  const res = await API.patch(`/user/notifications/${id}/read`);
  return res.data;
};

export const markAllAsRead = async (): Promise<{ success: boolean }> => {
  const res = await API.patch("/user/notifications/read-all");
  return res.data;
};

export const deleteNotification = async (id: number): Promise<{ success: boolean }> => {
  const res = await API.delete(`/user/notifications/${id}`);
  return res.data;
};
