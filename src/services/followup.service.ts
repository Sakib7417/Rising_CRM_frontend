import api from "@/lib/axios";
import type { Followup } from "@/types";

export const followupService = {
  getFollowups: async (leadId: string): Promise<Followup[]> => {
    const response = await api.get(`/followups/lead/${leadId}`);
    return response.data.data;
  },

  createFollowup: async (data: Partial<Followup>): Promise<Followup> => {
    const response = await api.post("/followups", data);
    return response.data.data;
  },

  updateFollowup: async (id: string, data: Partial<Followup>): Promise<Followup> => {
    const response = await api.put(`/followups/${id}`, data);
    return response.data.data;
  },

  deleteFollowup: async (id: string) => {
    await api.delete(`/followups/${id}`);
  },

  getDailyFollowups: async (date?: string, userId?: string) => {
    const response = await api.get("/followups/daily", { params: { date, userId } });
    return response.data.data;
  },

  getMissedFollowups: async (userId?: string) => {
    const response = await api.get("/followups/missed", { params: { userId } });
    return response.data.data;
  },

  getUpcomingFollowups: async (withinDays?: number, userId?: string) => {
    const response = await api.get("/followups/upcoming", {
      params: { withinDays, userId },
    });
    return response.data.data;
  },
};
