// src/pages/admin/Dashboard.tsx
import React, { useEffect, useState } from "react";
import axios from "../../api/axios";


interface Program {
  _id: string;
  name: string;
  isActive: boolean;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

const Dashboard: React.FC = () => {
  const [programCount, setProgramCount] = useState(0);
  const [activePrograms, setActivePrograms] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [programsRes, usersRes] = await Promise.all([
          axios.get("/programs"),
          axios.get("/users"),
        ]);

        const programs: Program[] = programsRes.data;
        const users: User[] = usersRes.data;

        setProgramCount(programs.length);
        setActivePrograms(programs.filter((p) => p.isActive).length);
        setUserCount(users.length);
      } catch (err) {
        setError("Erreur lors du chargement des statistiques.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p className="text-center mt-10 text-gray-600">Chargement...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Tableau de Bord
      </h1>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition text-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Total Programmes
          </h2>
          <p className="text-4xl font-bold text-blue-600">{programCount}</p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition text-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Programmes Actifs
          </h2>
          <p className="text-4xl font-bold text-green-600">{activePrograms}</p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition text-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Utilisateurs
          </h2>
          <p className="text-4xl font-bold text-purple-600">{userCount}</p>
        </div>
      </div>


    </div>
  );
};

export default Dashboard;
