import api from "../api/axios";

export interface ClientProfile {
  id: number;
  email: string;
  nom?: string;
  prenom?: string;
  nomEntreprise?: string;
  etat: "En traitement" | "En attente" | "Terminé";
  telephones: string[];
  applicantType: "physique" | "morale";
  age?: number;
  sexe?: string;
}

export const clientAuthService = {
  setupPassword: async (token: string, password: string) => {
    const response = await api.post("/client-auth/setup-password", { token, password });
    return response.data;
  },
  login: async (email: string, password: string) => {
    const response = await api.post("/client-auth/login", { email, password });
    return response.data;
  },
  getMe: async () => {
    const response = await api.get("/client-auth/me");
    return response.data;
  },
  logout: async () => {
    const response = await api.post("/client-auth/logout");
    return response.data;
  },
};
