import api from "@/lib/axios";
import type { Deal } from "@/types";

export const dealService = {
  getDeals: async (params?: { stage?: string; assignedToId?: string }): Promise<Deal[]> => {
    const response = await api.get("/deals", { params });
    return response.data.data;
  },

  createDeal: async (data: Partial<Deal>): Promise<Deal> => {
    const response = await api.post("/deals", data);
    return response.data.data;
  },

  updateDeal: async (id: string, data: Partial<Deal>): Promise<Deal> => {
    const response = await api.put(`/deals/${id}`, data);
    return response.data.data;
  },

  getPipeline: async () => {
    const response = await api.get("/deals/pipeline");
    return response.data.data;
  },

  getAnalytics: async () => {
    const response = await api.get("/deals/analytics");
    return response.data.data;
  },
};
