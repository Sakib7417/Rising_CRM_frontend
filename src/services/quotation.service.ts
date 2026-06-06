import api from "@/lib/axios";
import type { Quotation } from "@/types";

export const quotationService = {
  getQuotations: async (): Promise<Quotation[]> => {
    const response = await api.get("/quotations");
    return response.data.data;
  },

  createQuotation: async (data: Partial<Quotation>): Promise<Quotation> => {
    const response = await api.post("/quotations", data);
    return response.data.data;
  },

  generatePdf: async (id: string): Promise<Quotation> => {
    const response = await api.post(`/quotations/${id}/pdf`);
    return response.data.data;
  },

  downloadPdf: async (id: string) => {
    const response = await api.get(`/quotations/${id}/download`, {
      responseType: "blob",
    });
    return response.data;
  },

  sendQuotation: async (id: string) => {
    const response = await api.post(`/quotations/${id}/send`);
    return response.data.data;
  },
};
