import api from "@/lib/axios";
import type { Task } from "@/types";

export const taskService = {
  getTasks: async (params?: { status?: string; assignedToId?: string }): Promise<Task[]> => {
    const response = await api.get("/tasks", { params });
    return response.data.data;
  },

  createTask: async (data: Partial<Task>): Promise<Task> => {
    const response = await api.post("/tasks", data);
    return response.data.data;
  },

  updateTask: async (id: string, data: Partial<Task>): Promise<Task> => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data.data;
  },

  deleteTask: async (id: string) => {
    await api.delete(`/tasks/${id}`);
  },
};
