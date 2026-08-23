import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { authService } from "../services/authService";
import type { User, Dossier, TestElegibiliteData, AuthResponse } from "../types/auth";

interface ClientAuthContextType {
  user: User | null;
  client: User | null; // Alias pour rétrocompatibilité
  dossiers: Dossier[];
  tests: TestElegibiliteData[];
  loading: boolean;
  login: (authData: AuthResponse) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const ClientAuthContext = createContext<ClientAuthContextType | undefined>(
  undefined
);

export const ClientAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [tests, setTests] = useState<TestElegibiliteData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const data = await authService.getMe();
      const currentUser = data.user || data.client || null;
      setUser(currentUser);
      setDossiers(data.dossiers || []);
      setTests(data.tests || []);
    } catch (error) {
      setUser(null);
      setDossiers([]);
      setTests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();

    // Directive 1 : Écouteur pour la réinitialisation sur erreur 401 déclenchée par l'intercepteur Axios
    const handleUnauthorized = () => {
      setUser(null);
      setDossiers([]);
      setTests([]);
      setLoading(false);
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  const login = (authData: AuthResponse) => {
    const currentUser = authData.user || authData.client || null;
    setUser(currentUser);
    setDossiers(authData.dossiers || []);
    setTests(authData.tests || []);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      // Ignorer les erreurs de réseau lors du logout
    } finally {
      setUser(null);
      setDossiers([]);
      setTests([]);
    }
  };

  return (
    <ClientAuthContext.Provider
      value={{
        user,
        client: user,
        dossiers,
        tests,
        loading,
        login,
        logout,
        checkAuth,
      }}
    >
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
