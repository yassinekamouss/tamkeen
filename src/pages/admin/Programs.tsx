// src/pages/admin/Programs.tsx
import React, { useEffect, useState } from "react";
import axios from "../../api/axios";

interface Program {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
}

const Programs: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get("/programs");
        setPrograms(response.data);
      } catch (err) {
        setError("Erreur lors du chargement des programmes.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  if (loading) return <p className="text-center mt-10 text-gray-600">Chargement...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Liste des Programmes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => (
          <div
            key={program._id}
            className="bg-white shadow-md rounded-xl p-5 border border-gray-200 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-blue-700">{program.name}</h2>
            <p className="text-gray-600 mt-2">{program.description}</p>
            <p className="mt-4">
              <span
                className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                  program.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {program.isActive ? "Actif" : "Inactif"}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Programs;
