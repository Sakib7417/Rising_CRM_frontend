import api from "@/lib/axios";
import type { ActivityLog } from "@/types";

export const activityService = {
  getActivities: async (params?: {
    userId?: string;
    entityType?: string;
    from?: string;
    to?: string;
  }): Promise<ActivityLog[]> => {
    const response = await api.get("/activities", { params });
    return response.data.data;
  },
};
