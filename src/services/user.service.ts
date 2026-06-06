import api from "@/lib/axios";
import type { User } from "@/types";

export const userService = {
  getUsers: async (params?: { role?: string; isActive?: boolean }): Promise<User[]> => {
    const response = await api.get("/users", { params });
    return response.data.data;
  },

  getUser: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  },

  createUser: async (data: Partial<User>): Promise<User> => {
    const response = await api.post("/users", data);
    return response.data.data;
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await api.put(`/users/${id}`, data);
    return response.data.data;
  },

  deleteUser: async (id: string) => {
    await api.delete(`/users/${id}`);
  },

  getPerformance: async (id: string) => {
    const response = await api.get(`/users/${id}/performance`);
    return response.data.data;
  },
};
