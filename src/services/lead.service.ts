import api from "@/lib/axios";
import type { Lead, PaginatedResponse } from "@/types";

export interface LeadFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  leadStatus?: string;
  leadSource?: string;
  isActive?: boolean;
  assignedToId?: string;
  city?: string;
  fromDate?: string;
  toDate?: string;
}

export const leadService = {
  getLeads: async (filters: LeadFilters): Promise<PaginatedResponse<Lead>> => {
    const response = await api.get("/leads", { params: filters });
    return {
      data: response.data.data,
      total: response.data.meta.total,
      page: response.data.meta.page,
      pageSize: response.data.meta.pageSize,
      totalPages: response.data.meta.totalPages,
    };
  },

  getLead: async (id: string): Promise<Lead> => {
    const response = await api.get(`/leads/${id}`);
    return response.data.data;
  },

  createLead: async (data: Partial<Lead>): Promise<Lead> => {
    const response = await api.post("/leads", data);
    return response.data.data;
  },

  updateLead: async (id: string, data: Partial<Lead>): Promise<Lead> => {
    const response = await api.patch(`/leads/${id}`, data);
    return response.data.data;
  },

  deleteLead: async (id: string) => {
    await api.delete(`/leads/${id}`);
  },

  assignLead: async (id: string, assignedToId: string): Promise<Lead> => {
    const response = await api.post(`/leads/${id}/assign`, { assignedToId });
    return response.data.data;
  },

  bulkAssignLeads: async (leadIds: string[], assignedToId: string) => {
    const response = await api.post("/leads/bulk-assign", { leadIds, assignedToId });
    return response.data.data;
  },

  changeStatus: async (id: string, leadStatus: string, remarks?: string): Promise<Lead> => {
    const response = await api.post(`/leads/${id}/status`, { leadStatus, remarks });
    return response.data.data;
  },

  toggleActive: async (id: string, isActive: boolean, remarks?: string): Promise<Lead> => {
    const response = await api.post(`/leads/${id}/toggle`, { isActive, remarks });
    return response.data.data;
  },

  importIndiaMart: async (rawText: string): Promise<Lead> => {
    const response = await api.post("/leads/import-indiamart", { rawText });
    return response.data.data;
  },

  convertToCustomer: async (id: string) => {
    const response = await api.post(`/leads/${id}/convert`);
    return response.data.data;
  },

  getTimeline: async (id: string) => {
    const response = await api.get(`/leads/${id}/timeline`);
    return response.data.data;
  },

  bulkImportCSV: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/leads/bulk-import", formData);
    return response.data.data;
  },
};
