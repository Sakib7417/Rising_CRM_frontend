import api from "@/lib/axios";
import type { Notification } from "@/types";

export const notificationService = {
  getNotifications: async (unreadOnly?: boolean): Promise<Notification[]> => {
    const response = await api.get("/notifications", { params: { unreadOnly } });
    return response.data.data;
  },

  markAsRead: async (id: string) => {
    await api.post(`/notifications/${id}/read`);
  },
};
