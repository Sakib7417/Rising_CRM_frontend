import api from "@/lib/axios";

export const reportService = {
  exportExcel: async (type: "leads" | "followups" | "employees" | "sales" | "revenue") => {
    const response = await api.get(`/reports/${type}/excel`, {
      responseType: "blob",
    });
    return response.data;
  },

  exportPdf: async (type: "leads" | "followups" | "employees" | "sales" | "revenue") => {
    const response = await api.get(`/reports/${type}/pdf`, {
      responseType: "blob",
    });
    return response.data;
  },
};
