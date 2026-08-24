import { useState, useEffect, useCallback, useMemo } from "react";
import axios, { ADMIN_API_PREFIX } from "../../api/axios";
import { getAdminSocket } from "../../api/socket";

export interface User {
  _id: string;
  applicantType: "physique" | "morale";
  nom?: string;
  prenom?: string;
  nomEntreprise?: string;
  email: string;
  telephone?: string;
  telephones?: string[];
  dossierId?: string;
  dossier_id?: string;
  createdAt?: string;
}

export interface Admin {
  _id: string;
  username: string;
}

interface UserUpdatedPayload {
  _id: string;
}

export const useUsers = () => {
  const adminProfile = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("adminProfile") || "{}");
    } catch {
      return {};
    }
  }, []);

  const [users, setUsers] = useState<User[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "physique" | "morale">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  const fetchAdmins = useCallback(async () => {
    try {
      const response = await axios.get(`${ADMIN_API_PREFIX}`);
      setAdmins(response.data);
    } catch {
      setError("Erreur lors du chargement des administrateurs.");
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      if (adminProfile.role === "Consultant") {
        const response = await axios.get(`/users/consultant/${adminProfile._id}`);
        setUsers(response.data);
      } else {
        const response = await axios.get("/users");
        setUsers(response.data);
      }
      setError(null);
    } catch {
      setError("Erreur lors du chargement des candidats.");
    } finally {
      setLoading(false);
    }
  }, [adminProfile._id, adminProfile.role]);

  // Handle updates or creation of candidate
  const updateUser = useCallback(async (updatedUser: User) => {
    try {
      const response = await axios.put(`users/${updatedUser._id}`, updatedUser);
      setUsers((prev) =>
        prev.map((u) => (u._id === updatedUser._id ? response.data : u))
      );
      // Re-fetch to sync if needed
      await fetchUsers();
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
      throw err;
    }
  }, [fetchUsers]);



  useEffect(() => {
    fetchAdmins();
    fetchUsers();
  }, [fetchAdmins, fetchUsers]);

  // WebSocket support
  useEffect(() => {
    const socket = getAdminSocket();

    const onUserUpdated = (payload: UserUpdatedPayload) => {
      setUsers((prev) =>
        prev.map((u) =>
          u._id === payload._id
            ? {
                ...u,
              }
            : u
        )
      );
    };

    socket.on("user:updated", onUserUpdated);

    return () => {
      socket.off("user:updated", onUserUpdated);
    };
  }, []);

  // Filter logic
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.nom && user.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.prenom && user.prenom.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.nomEntreprise &&
          user.nomEntreprise.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType =
        filterType === "all" || user.applicantType === filterType;

      return matchesSearch && matchesType;
    });
  }, [users, searchTerm, filterType]);

  // Pagination logic
  const totalPages = useMemo(() => {
    return Math.ceil(filteredUsers.length / usersPerPage);
  }, [filteredUsers.length, usersPerPage]);

  const currentUsers = useMemo(() => {
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    return filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  }, [filteredUsers, currentPage, usersPerPage]);

  // Handle search and reset page
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((value: "all" | "physique" | "morale") => {
    setFilterType(value);
    setCurrentPage(1);
  }, []);

  return {
    adminProfile,
    users,
    admins,
    loading,
    error,
    searchTerm,
    filterType,
    currentPage,
    totalPages,
    currentUsers,
    filteredUsers,
    usersPerPage,
    updateUser,
    setSearchTerm: handleSearchChange,
    setFilterType: handleFilterChange,
    setCurrentPage,
  };
};
