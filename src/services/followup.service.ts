import api from "@/lib/axios";
import type { Followup } from "@/types";

export const followupService = {
  getFollowups: async (params?: { leadId?: string; type?: "daily" | "missed" | "upcoming" | "all" }): Promise<Followup[]> => {
    const type = params?.type || "all";
    if (params?.leadId) {
      const response = await api.get(`/followups/lead/${params.leadId}`);
      return response.data.data;
    }
    if (type === "daily") {
      const response = await api.get("/followups/daily");
      return response.data.data;
    }
    if (type === "missed") {
      const response = await api.get("/followups/missed");
      return response.data.data;
    }
    if (type === "upcoming") {
      const response = await api.get("/followups/upcoming");
      return response.data.data;
    }
    const response = await api.get("/followups");
    return response.data.data;
  },

  createFollowup: async (data: Partial<Followup>): Promise<Followup> => {
    const response = await api.post("/followups", data);
    return response.data.data;
  },

  updateFollowup: async (id: string, data: Partial<Followup>): Promise<Followup> => {
    const response = await api.patch(`/followups/${id}`, data);
    return response.data.data;
  },

  deleteFollowup: async (id: string) => {
    await api.delete(`/followups/${id}`);
  },
};
