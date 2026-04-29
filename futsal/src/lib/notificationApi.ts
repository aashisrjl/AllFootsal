import API from "./api";

export interface FutsalNotification {
  id: number;
  futsal_id: number;
  type:
    | "booking_created"
    | "booking_confirmed"
    | "booking_rejected"
    | "booking_cancelled"
    | "payment_completed"
    | "review_posted"
    | "subscription_expiring"
    | "verification_required"
    | "general_notification";
  title: string;
  message: string;
  related_id?: number | null;
  related_type?: "booking" | "payment" | "review" | "subscription" | null;
  is_read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FutsalNotificationsResponse {
  success: boolean;
  message: string;
  data: FutsalNotification[];
  total: number;
  page: number;
  limit: number;
}

export const getFutsalNotifications = async (
  page = 1,
  limit = 20,
  unreadOnly = false
): Promise<FutsalNotificationsResponse> => {
  const res = await API.get("/futsal/notifications", {
    params: { page, limit, unreadOnly },
  });
  return res.data;
};

export const getFutsalUnreadCount = async (): Promise<{ success: boolean; unreadCount: number }> => {
  const res = await API.get("/futsal/notifications/unread-count");
  return res.data;
};

export const markFutsalAsRead = async (id: number): Promise<{ success: boolean }> => {
  const res = await API.patch(`/futsal/notifications/${id}/read`);
  return res.data;
};

export const markAllFutsalAsRead = async (): Promise<{ success: boolean }> => {
  const res = await API.patch("/futsal/notifications/read-all");
  return res.data;
};

export const deleteFutsalNotification = async (id: number): Promise<{ success: boolean }> => {
  const res = await API.delete(`/futsal/notifications/${id}`);
  return res.data;
};
