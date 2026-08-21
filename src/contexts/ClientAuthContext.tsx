import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { clientAuthService, type ClientProfile } from "../services/clientAuthService";

interface ClientAuthContextType {
  client: ClientProfile | null;
  loading: boolean;
  login: (token: string, clientData: ClientProfile) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const ClientAuthContext = createContext<ClientAuthContextType | undefined>(undefined);

export const ClientAuthProvider = ({ children }: { children: ReactNode }) => {
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const data = await clientAuthService.getMe();
      setClient(data.client);
    } catch (error) {
      setClient(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (_token: string, clientData: ClientProfile) => {
    setClient(clientData);
  };

  const logout = async () => {
    try {
      await clientAuthService.logout();
    } catch (e) {
      // ignore
    }
    setClient(null);
    // Usually we can redirect to home here, or handle it in the component
  };

  return (
    <ClientAuthContext.Provider value={{ client, loading, login, logout, checkAuth }}>
      {children}
    </ClientAuthContext.Provider>
  );
};

export const useClientAuth = () => {
  const context = useContext(ClientAuthContext);
  if (context === undefined) {
    throw new Error("useClientAuth must be used within a ClientAuthProvider");
  }
  return context;
};
