import api from "@/lib/axios";
import type { Customer } from "@/types";

export const customerService = {
  getCustomers: async (): Promise<Customer[]> => {
    const response = await api.get("/customers");
    return response.data.data;
  },

  getCustomer: async (id: string): Promise<Customer> => {
    const response = await api.get(`/customers/${id}`);
    return response.data.data;
  },

  createCustomer: async (data: Partial<Customer>): Promise<Customer> => {
    const response = await api.post("/customers", data);
    return response.data.data;
  },

  addNote: async (id: string, note: string): Promise<Customer> => {
    const response = await api.post(`/customers/${id}/note`, { note });
    return response.data.data;
  },
};
