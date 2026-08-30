import api from "../api/axios";
import type { AuthResponse } from "../types/auth";

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", { email, password });
    return response.data;
  },

  setupPassword: async (token: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/setup-password", { token, password });
    return response.data;
  },

  getMe: async (): Promise<AuthResponse> => {
    const response = await api.get<AuthResponse>("/auth/me");
    return response.data;
  },

  /**
   * Met à jour le profil de l'utilisateur connecté.
   * L'email n'est pas inclus dans le payload — il est géré côté backend.
   */
  updateProfile: async (payload: Record<string, unknown>): Promise<{ success: boolean; client: object }> => {
    const response = await api.put<{ success: boolean; client: object }>("/client-auth/me", payload);
    return response.data;
  },

  logout: async (): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<{ success: boolean; message: string }>("/auth/logout");
    return response.data;
  },
};
