// src/pages/admin/Programs.tsx
import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  SECTEURS_TRAVAIL,
  REGIONS,
  STATUT_JURIDIQUE_OPTIONS,
  MONTANT_INVESTISSEMENT_OPTIONS,
  ANNEE_CREATION,
} from "../../components/eligibility/constants_for_adding_programs";

interface Program {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  criteres: {
    secteurActivite: string[];
    statutJuridique: string[];
    applicantType: string[];
    montantInvestissement: string[];
    chiffreAffaireMin?: number | null;
    chiffreAffaireMax?: number | null;
    anneeCreation: (string | number)[];
    region: string[];
  };
}

interface ProgramFormData {
  name: string;
  description: string;
  isActive: boolean;
  criteres: {
    secteurActivite: string[];
    statutJuridique: string[];
    applicantType: string[];
    montantInvestissement: string[];
    chiffreAffaireMin: number | null;
    chiffreAffaireMax: number | null;
    anneeCreation: (string | number)[];
    region: string[];
  };
}

const Programs: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState<ProgramFormData>({
    name: "",
    description: "",
    isActive: true,
    criteres: {
      secteurActivite: [],
      statutJuridique: [],
      applicantType: [],
      montantInvestissement: [],
      chiffreAffaireMin: null,
      chiffreAffaireMax: null,
      anneeCreation: [],
      region: [],
    },
  });

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get("/programs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPrograms(response.data);
    } catch {
      setError("Erreur lors du chargement des programmes.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");

      if (editingProgram) {
        await axios.put(`/programs/${editingProgram._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("/programs", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      await fetchPrograms();
      setShowModal(false);
      resetForm();
    } catch {
      setError("Erreur lors de la sauvegarde du programme.");
    }
  };

  const handleEdit = (program: Program) => {
    setEditingProgram(program);
    setFormData({
      name: program.name,
      description: program.description,
      isActive: program.isActive,
      criteres: {
        ...program.criteres,
        chiffreAffaireMin: program.criteres.chiffreAffaireMin ?? null,
        chiffreAffaireMax: program.criteres.chiffreAffaireMax ?? null,
      },
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce programme ?")) {
      try {
        const token = localStorage.getItem("adminToken");
        await axios.delete(`/programs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await fetchPrograms();
      } catch {
        setError("Erreur lors de la suppression du programme.");
      }
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.patch(
        `/programs/${id}/toggle`,
        { isActive: !isActive },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchPrograms();
    } catch {
      setError("Erreur lors de la modification du statut.");
    }
  };

  const resetForm = () => {
    setEditingProgram(null);
    setFormData({
      name: "",
      description: "",
      isActive: true,
      criteres: {
        secteurActivite: [],
        statutJuridique: [],
        applicantType: [],
        montantInvestissement: [],
        chiffreAffaireMin: null,
        chiffreAffaireMax: null,
        anneeCreation: [],
        region: [],
      },
    });
  };

  const handleMultiSelectChange = (
    field: string,
    value: string,
    checked: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      criteres: {
        ...prev.criteres,
        [field]: checked
          ? [
              ...(prev.criteres[
                field as keyof typeof prev.criteres
              ] as string[]),
              value,
            ]
          : (
              prev.criteres[field as keyof typeof prev.criteres] as string[]
            ).filter((item) => item !== value),
      },
    }));
  };

  const filteredPrograms = programs.filter(
    (program) =>
      program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
              <svg
                className="inline-block w-8 h-8 mr-3 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Gestion des Programmes
            </h1>
            <p className="text-gray-600">
              Configurez les programmes de subvention et leurs critères
              d'éligibilité
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Nouveau Programme
          </button>
        </div>
      </div>

      {/* Search and Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        {/* Search */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rechercher un programme
          </label>
          <div className="relative">
            <svg
              className="absolute left-3 top-3 w-5 h-5 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="text"
              placeholder="Nom ou description..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-gray-100 rounded-lg p-3">
              <svg
                className="w-6 h-6 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {programs.length}
              </p>
              <p className="text-gray-600 text-sm">Total programmes</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-gray-100 rounded-lg p-3">
              <svg
                className="w-6 h-6 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {programs.filter((p) => p.isActive).length}
              </p>
              <p className="text-gray-600 text-sm">Programmes actifs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <svg
              className="w-5 h-5 text-red-400 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-red-800">Erreur</h3>
              <div className="mt-1 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Programs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPrograms.map((program) => (
          <div
            key={program._id}
            className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {program.name}
                  </h3>
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      program.isActive
                        ? "bg-gray-200 bg-opacity-80 text-gray-700 border border-gray-300"
                        : "bg-gray-300 bg-opacity-80 text-gray-600 border border-gray-400"
                    }`}>
                    {program.isActive ? "Actif" : "Inactif"}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleActive(program._id, program.isActive)}
                    className={`p-2 rounded-lg transition-colors ${
                      program.isActive
                        ? "bg-gray-500 hover:bg-gray-600"
                        : "bg-gray-400 hover:bg-gray-500"
                    }`}
                    title={program.isActive ? "Désactiver" : "Activer"}>
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20">
                      {program.isActive ? (
                        <path
                          fillRule="evenodd"
                          d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                          clipRule="evenodd"
                        />
                      ) : (
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      )}
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6">
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {program.description}
              </p>

              {/* Criteria Summary */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm">
                  <svg
                    className="w-4 h-4 text-gray-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <span className="text-gray-600">
                    Type:{" "}
                    {program.criteres.applicantType.length > 0
                      ? program.criteres.applicantType.join(", ")
                      : "Tous"}
                  </span>
                </div>

                <div className="flex items-center text-sm">
                  <svg
                    className="w-4 h-4 text-gray-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-600">
                    Secteurs:{" "}
                    {program.criteres.secteurActivite.length > 0
                      ? `${program.criteres.secteurActivite.length} sélectionnés`
                      : "Tous"}
                  </span>
                </div>

                <div className="flex items-center text-sm">
                  <svg
                    className="w-4 h-4 text-gray-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                  <span className="text-gray-600">
                    Investissement:{" "}
                    {program.criteres.montantInvestissement.length > 0
                      ? `${program.criteres.montantInvestissement.length} tranches`
                      : "Tous montants"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(program)}
                  className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(program._id)}
                  className="bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium transition-colors">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414L9 11.414l3.293-3.293a1 1 0 000-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPrograms.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m6-6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Aucun programme trouvé
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Commencez par créer un nouveau programme.
          </p>
        </div>
      )}

      {/* Modal for Create/Edit Program */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">
                  {editingProgram
                    ? "Modifier le programme"
                    : "Nouveau programme"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white hover:text-gray-200">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du programme *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Statut
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.isActive.toString()}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isActive: e.target.value === "true",
                        })
                      }>
                      <option value="true">Actif</option>
                      <option value="false">Inactif</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                {/* Criteria Section */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Critères d'éligibilité
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Type d'applicant */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Type d'applicant
                      </label>
                      <div className="space-y-2">
                        {["physique", "morale"].map((type) => (
                          <label key={type} className="flex items-center">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              checked={formData.criteres.applicantType.includes(
                                type
                              )}
                              onChange={(e) =>
                                handleMultiSelectChange(
                                  "applicantType",
                                  type,
                                  e.target.checked
                                )
                              }
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {type === "physique"
                                ? "Personne physique"
                                : "Personne morale"}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Montant d'investissement */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Montant d'investissement
                      </label>
                      <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
                        {MONTANT_INVESTISSEMENT_OPTIONS.map((option) => (
                          <label
                            key={option}
                            className="flex items-center">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              checked={formData.criteres.montantInvestissement.includes(
                                option
                              )}
                              onChange={(e) =>
                                handleMultiSelectChange(
                                  "montantInvestissement",
                                  option,
                                  e.target.checked
                                )
                              }
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

               

                    {/* Secteurs d'activité */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Secteurs d'activité
                      </label>
                      <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3 space-y-2">
                        {SECTEURS_TRAVAIL.map((secteur) => (
                          <label key={secteur} className="flex items-center">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              checked={formData.criteres.secteurActivite.includes(
                                secteur
                              )}
                              onChange={(e) =>
                                handleMultiSelectChange(
                                  "secteurActivite",
                                  secteur,
                                  e.target.checked
                                )
                              }
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {secteur}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Statuts juridiques */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Statuts juridiques
                      </label>
                      <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3 space-y-2">
                        {[
                          ...STATUT_JURIDIQUE_OPTIONS
                        ].map((option) => (
                          <label
                            key={option}
                            className="flex items-center">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              checked={formData.criteres.statutJuridique.includes(
                                option
                              )}
                              onChange={(e) =>
                                handleMultiSelectChange(
                                  "statutJuridique",
                                  option,
                                  e.target.checked
                                )
                              }
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Régions */}


                         {/* Chiffre d'affaires */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Chiffre d'affaires (MAD)
                      </label>
                      <div className="">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Minimum
                          </label>
                          <input
                            type="number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={formData.criteres.chiffreAffaireMin || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                criteres: {
                                  ...formData.criteres,
                                  chiffreAffaireMin: e.target.value
                                    ? Number(e.target.value)
                                    : null,
                                },
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Maximum
                          </label>
                          <input
                            type="number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={formData.criteres.chiffreAffaireMax || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                criteres: {
                                  ...formData.criteres,
                                  chiffreAffaireMax: e.target.value
                                    ? Number(e.target.value)
                                    : null,
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Régions
                      </label>
                      <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3 space-y-2">
                        {REGIONS.map((region) => (
                          <label key={region} className="flex items-center">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              checked={formData.criteres.region.includes(
                                region
                              )}
                              onChange={(e) =>
                                handleMultiSelectChange(
                                  "region",
                                  region,
                                  e.target.checked
                                )
                              }
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {region}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                    {/* Année de création */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Année de création
                  </label>
                  <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3 space-y-2">
                    {ANNEE_CREATION.map((annee) => (
                      <label key={annee} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={formData.criteres.anneeCreation.includes(annee)}
                          onChange={(e) =>
                            handleMultiSelectChange(
                              "anneeCreation",
                              annee,
                              e.target.checked
                            )
                          }
                        />
                        <span className="ml-2 text-sm text-gray-700">{annee}</span>
                      </label>
                    ))}
                  </div>
                </div>

                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg">
                  {editingProgram ? "Mettre à jour" : "Créer le programme"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Programs;