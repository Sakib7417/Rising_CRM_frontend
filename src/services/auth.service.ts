import api from "@/lib/axios";
import type { AuthResponse, User } from "@/types";

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", { email, password });
    return response.data.data;
  },

  register: async (data: Partial<User>): Promise<AuthResponse> => {
    const response = await api.post("/auth/register", data);
    return response.data.data;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get("/auth/me");
    return response.data.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.post("/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  resetPassword: async (token: string, newPassword: string) => {
    const response = await api.post("/auth/reset-password", { token, newPassword });
    return response.data;
  },

  logout: async (refreshToken: string) => {
    await api.post("/auth/logout", { refreshToken });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};
