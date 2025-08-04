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

  const handleAddProgram = () => {
    // TODO: Ouvrir modal ou naviguer vers page d'ajout
    console.log("Ajouter un nouveau programme");
  };

  const handleEditProgram = (programId: string) => {
    // TODO: Ouvrir modal ou naviguer vers page d'édition
    console.log("Modifier le programme:", programId);
  };

  const handleToggleActive = async (programId: string, currentStatus: boolean) => {
    try {
      // TODO: Appel API pour changer le statut
      console.log("Changer statut du programme:", programId, !currentStatus);
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
    }
  };

  const handleDeleteProgram = async (programId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce programme ?")) {
      try {
        // TODO: Appel API pour supprimer
        console.log("Supprimer le programme:", programId);
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-600">Chargement...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      {/* Header avec bouton d'ajout */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Gestion des Programmes</h1>
        <button
          onClick={handleAddProgram}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 shadow-md"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Nouveau Programme</span>
        </button>
      </div>

      {/* Grille des programmes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => (
          <div
            key={program._id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 overflow-hidden"
          >
            {/* En-tête de la carte */}
            <div className="p-6 pb-4">
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-semibold text-gray-800 leading-tight">
                  {program.name}
                </h2>
                <span
                  className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${
                    program.isActive 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full mr-1.5 ${
                    program.isActive ? "bg-green-500" : "bg-red-500"
                  }`}></span>
                  {program.isActive ? "Actif" : "Inactif"}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                {program.description || "Aucune description disponible."}
              </p>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <div className="flex justify-between items-center space-x-2">
                {/* Boutons d'action principaux */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditProgram(program._id)}
                    className="flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors duration-200"
                    title="Modifier"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Modifier
                  </button>

                  <button
                    onClick={() => handleToggleActive(program._id, program.isActive)}
                    className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                      program.isActive
                        ? "text-orange-700 bg-orange-50 hover:bg-orange-100"
                        : "text-green-700 bg-green-50 hover:bg-green-100"
                    }`}
                    title={program.isActive ? "Désactiver" : "Activer"}
                  >
                    {program.isActive ? (
                      <>
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Désactiver
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-5-10V3m0 0V1m0 2h4M7 3h10" />
                        </svg>
                        Activer
                      </>
                    )}
                  </button>
                </div>

                {/* Bouton de suppression */}
                <button
                  onClick={() => handleDeleteProgram(program._id)}
                  className="flex items-center px-2 py-1.5 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors duration-200"
                  title="Supprimer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message si aucun programme */}
      {programs.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun programme disponible</h3>
          <p className="text-gray-500 mb-6">Commencez par créer votre premier programme.</p>
          <button
            onClick={handleAddProgram}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Créer un programme
          </button>
        </div>
      )}
    </div>
  );
};

export default Programs;