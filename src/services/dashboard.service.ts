import api from "@/lib/axios";
import type { DashboardStats } from "@/types";

export const dashboardService = {
  getOverview: async (): Promise<DashboardStats> => {
    const response = await api.get("/dashboard/overview");
    return response.data.data;
  },

  getAnalytics: async () => {
    const response = await api.get("/dashboard/analytics");
    return response.data.data;
  },
};
