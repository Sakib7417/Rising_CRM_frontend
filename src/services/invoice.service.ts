import api from "@/lib/axios";
import type { Invoice, Payment } from "@/types";

export const invoiceService = {
  getInvoices: async (params?: { customerId?: string; status?: string }): Promise<Invoice[]> => {
    const response = await api.get("/invoices", { params });
    return response.data.data;
  },
  createInvoice: async (data: Partial<Invoice>): Promise<Invoice> => {
    const response = await api.post("/invoices", data);
    return response.data.data;
  },
  updateInvoice: async (id: string, data: Partial<Invoice>): Promise<Invoice> => {
    const response = await api.patch(`/invoices/${id}`, data);
    return response.data.data;
  },
  deleteInvoice: async (id: string) => {
    await api.delete(`/invoices/${id}`);
  },
  addPayment: async (invoiceId: string, data: Partial<Payment>): Promise<Payment> => {
    const response = await api.post(`/invoices/${invoiceId}/payments`, data);
    return response.data.data;
  },
};
