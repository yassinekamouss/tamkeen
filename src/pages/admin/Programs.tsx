// src/pages/admin/Programs.tsx
import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  Target,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  Calendar,
  Eye,
  BarChart3,
  Grid3X3,
  AlertCircle,
  Building,
  DollarSign,
  User,
  FileX,
  Share,
} from "lucide-react";
import PublishProgamModal from "../../components/admin/programs/PublishProgramModal";
import ProgramFormModal from "../../components/admin/programs/ProgramFormModal";
import ProgramDetailsModal from "../../components/admin/programs/ProgramDetailsModal";

interface Program {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  DateDebut: string;
  DateFin: string;
  link: string;
  hero?: {
    isHero: boolean;
    image: string;
    titleFr: string;
    titleAr: string;
    subtitleFr: string;
    subtitleAr: string;
    descriptionFr: string;
    descriptionAr: string;
  };
  criteres: {
    secteurActivite: string[];
    statutJuridique: string[];
    applicantType: string[];
    montantInvestissement: string[];
    chiffreAffaireParSecteur?: {
      secteur: string;
      min: number | null;
      max: number | null;
    }[];
    age?: {
      minAge: number | null;
      maxAge: number | null;
    };
    sexe?: string[];
    chiffreAffaire: {
      chiffreAffaireMin: number | null;
      chiffreAffaireMax: number | null;
    };
    anneeCreation: (string | number)[];
    region: string[];
  };
}

interface ProgramFormData {
  name: string;
  description: string;
  isActive: boolean;
  DateDebut: string;
  DateFin: string;
  link?: string;
  criteres: {
    secteurActivite: string[];
    statutJuridique: string[];
    applicantType: string[];
    montantInvestissement: string[];
    chiffreAffaireParSecteur: {
      secteur: string;
      min: number | null;
      max: number | null;
    }[];
    age: {
      minAge: number | null;
      maxAge: number | null;
    };
    sexe: string[];
    chiffreAffaire: {
      chiffreAffaireMin: number | null;
      chiffreAffaireMax: number | null;
    };
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
  const adminProfile = JSON.parse(localStorage.getItem("adminProfile") || "null");
  const isAdministrator = adminProfile?.role === "Administrateur";


  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishingProgram, setPublishingProgram] = useState<Program | null>(
    null
  );


  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);


  const [formData, setFormData] = useState<ProgramFormData>({
    name: "",
    description: "",
    isActive: true,
    DateDebut: "",
    DateFin: "",
    link: "",
    criteres: {
      secteurActivite: [],
      statutJuridique: [],
      applicantType: [],
      montantInvestissement: [],
      chiffreAffaireParSecteur: [],
      age: {
        minAge: null,
        maxAge: null,
      },
      sexe: [],
      chiffreAffaire: {
        chiffreAffaireMin: null,
        chiffreAffaireMax: null,
      },
      anneeCreation: [],
      region: [],
    },
  });

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await axios.get("/programs");
      setPrograms(response.data);
    } catch {
      setError("Erreur lors du chargement des programmes.");
    } finally {
      setLoading(false);
    }
  };

  //Ajouter programme
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Conversion en Date si valeur présente, sinon null
      const payload = {
        ...formData,
        DateDebut: formData.DateDebut ? new Date(formData.DateDebut) : null,
        DateFin: formData.DateFin ? new Date(formData.DateFin) : null,
      };

      if (editingProgram) {
        await axios.put(`/programs/${editingProgram._id}`, payload);
      } else {
        await axios.post("/programs", payload);
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
      DateDebut: program.DateDebut ? program.DateDebut.toString() : "",
      DateFin: program.DateFin ? program.DateFin.toString() : "",
      link: program.link,
      criteres: {
        ...program.criteres,
        chiffreAffaireParSecteur:
          program.criteres?.chiffreAffaireParSecteur ?? [],
        age: {
          minAge: program.criteres.age?.minAge ?? null,
          maxAge: program.criteres.age?.maxAge ?? null,
        },
        sexe: program.criteres.sexe ?? [],
        chiffreAffaire: {
          chiffreAffaireMin:
            program.criteres.chiffreAffaire.chiffreAffaireMin ?? null,
          chiffreAffaireMax:
            program.criteres.chiffreAffaire.chiffreAffaireMax ?? null,
        },
      },
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce programme ?")) {
      try {
        await axios.delete(`/programs/${id}`);
        await fetchPrograms();
      } catch {
        setError("Erreur lors de la suppression du programme.");
      }
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      await axios.patch(`/programs/${id}/toggle`, { isActive: !isActive });
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
      DateDebut: "",
      DateFin: "",
      link: "",
      criteres: {
        secteurActivite: [],
        statutJuridique: [],
        applicantType: [],
        chiffreAffaireParSecteur: [],
        age: {
          minAge: null,
          maxAge: null,
        },
        sexe: [],
        montantInvestissement: [],
        chiffreAffaire: {
          chiffreAffaireMin: null,
          chiffreAffaireMax: null,
        },
        anneeCreation: [],
        region: [],
      },
    });
  };

  const handlePublish = (program: Program) => {
    setPublishingProgram(program);
    setShowPublishModal(true);
  };

  type HeroData = {
    isHero: boolean;
    image: string;
    titleFr: string;
    titleAr: string;
    subtitleFr: string;
    subtitleAr: string;
    descriptionFr: string;
    descriptionAr: string;
  };

  const handlePublishSubmit = async (heroData: HeroData) => {
    if (!publishingProgram) return;

    try {
     await axios.put(
        `/programs/${publishingProgram._id}/hero`,
        heroData, // ici heroData devient FormData
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );


      await fetchPrograms();
      setShowPublishModal(false);
      setPublishingProgram(null);
    } catch {
      setError("Erreur lors de la publication du programme.");
    }
  };

  const handleViewDetails = (program: Program) => {
  setSelectedProgram(program);
  setShowDetailsModal(true);
    };

  const [remainingDays, setRemainingDays] = useState<number | null>(null);
  const [filterDate, setFilterDate] = useState<string>("");

  const filteredPrograms = programs.filter((program) => {
    // Filtre recherche
    const matchesSearch =
      program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.description.toLowerCase().includes(searchTerm.toLowerCase());

    const hasDate = Boolean(filterDate);
    const hasMaxDays = remainingDays !== null;

    const startDate = program.DateDebut ? new Date(program.DateDebut) : null;
    const endDate = program.DateFin ? new Date(program.DateFin) : null;
    const toStartOfDay = (d: Date) =>
      new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const dayMs = 1000 * 60 * 60 * 24;
    const today = toStartOfDay(new Date());

    let matchesFilters = true;
    // 1) Filtre par plage [aujourd'hui, date sélectionnée]
    if (hasDate) {
      if (!endDate || Number.isNaN(endDate.getTime())) {
        matchesFilters = false;
      } else {
        const programStart =
          startDate && !Number.isNaN(startDate.getTime())
            ? toStartOfDay(startDate)
            : null;
        const programEnd = toStartOfDay(endDate);
        const selected = toStartOfDay(new Date(filterDate));
        const rangeEnd = selected < today ? today : selected; // si date passée, on considère aujourd'hui
        const overlap =
          programEnd >= today &&
          (programStart ? programStart <= rangeEnd : true);
        if (!overlap) matchesFilters = false;
      }
    }

    // 2) Filtre par nombre de jours restants (depuis aujourd'hui)
    if (matchesFilters && hasMaxDays) {
      if (!endDate || Number.isNaN(endDate.getTime())) {
        matchesFilters = false;
      } else {
        const diffDays = Math.ceil(
          (toStartOfDay(endDate).getTime() - today.getTime()) / dayMs
        );
        if (!(diffDays >= 0 && diffDays <= (remainingDays as number))) {
          matchesFilters = false;
        }
      }
    }

    return matchesSearch && matchesFilters;
  });
  const filteredCount = filteredPrograms.length;

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
              <Target className="w-8 h-8 mr-3 text-gray-600" />
              Gestion des Programmes
            </h1>
            <p className="text-gray-600">
              Configurez les programmes de subvention et leurs critères
              d'éligibilité
            </p>
          </div>
          {isAdministrator && (
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Nouveau Programme
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Search */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Search className="w-4 h-4 mr-2 text-gray-500" />
              Rechercher un programme
            </label>
            <button
              onClick={() => setSearchTerm("")}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm transition-colors"
              title="Réinitialiser la recherche">
              Effacer
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Nom ou description..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {searchTerm && (
            <p className="text-xs text-gray-500 mt-1">
              Appuyez sur "Effacer" pour réinitialiser la recherche
            </p>
          )}
        </div>

        {/* Filter by Duration */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
              Filtrer par durée maximale (jours restants)
            </label>
            <button
              onClick={() => {
                setRemainingDays(null);
                setFilterDate("");
              }}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm transition-colors"
              title="Réinitialiser le filtre">
              Effacer
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 select-none">
                  ≤
                </span>
                <input
                  type="number"
                  placeholder="Nombre de jours"
                  min={1}
                  className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={remainingDays ?? ""}
                  onChange={(e) =>
                    setRemainingDays(
                      e.target.value ? parseInt(e.target.value) : null
                    )
                  }
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Nombre maximum de jours restants
              </p>
            </div>
            <div>
              <input
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Date de référence (aujourd'hui si vide)
              </p>
            </div>
          </div>
          {(remainingDays !== null || filterDate) && (
            <p className="text-sm text-gray-600 mt-3">
              {filterDate && remainingDays !== null ? (
                <>
                  Actifs entre aujourd'hui et le{" "}
                  <span className="font-semibold">
                    {new Date(filterDate).toLocaleDateString()}
                  </span>{" "}
                  et avec ≤{" "}
                  <span className="font-semibold">{remainingDays}</span> jours
                  restants
                </>
              ) : filterDate ? (
                <>
                  Actifs entre aujourd'hui et le{" "}
                  <span className="font-semibold">
                    {new Date(filterDate).toLocaleDateString()}
                  </span>
                </>
              ) : (
                <>
                  Avec ≤ <span className="font-semibold">{remainingDays}</span>{" "}
                  jours restants (depuis aujourd'hui)
                </>
              )}
            </p>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Total programmes */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex items-center">
          <div className="bg-gray-100 rounded-lg p-3">
            <BarChart3 className="w-6 h-6 text-gray-600" />
          </div>
          <div className="ml-4">
            <p className="text-2xl font-bold text-gray-900">
              {programs.length}
            </p>
            <p className="text-gray-600 text-sm">Total programmes</p>
          </div>
        </div>

        {/* Actifs */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex items-center">
          <div className="bg-gray-100 rounded-lg p-3">
            <CheckCircle className="w-6 h-6 text-gray-600" />
          </div>
          <div className="ml-4">
            <p className="text-2xl font-bold text-gray-900">
              {programs.filter((p) => p.isActive).length}
            </p>
            <p className="text-gray-600 text-sm">Programmes actifs</p>
          </div>
        </div>

        {/* Filtrés */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex items-center">
          <div className="bg-gray-100 rounded-lg p-3">
            <Grid3X3 className="w-6 h-6 text-gray-600" />
          </div>
          <div className="ml-4">
            <p className="text-2xl font-bold text-gray-900">{filteredCount}</p>
            <p className="text-gray-600 text-sm">Programmes filtrés</p>
          </div>
        </div>
      </div>
      <br />

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Erreur</h3>
              <div className="mt-1 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Programs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {filteredPrograms.map((program) => (
          <div
            key={program._id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-gray-300">
            {/* Card Header */}
         <div className="bg-gradient-to-r from-slate-600 to-slate-700 px-6 py-4 rounded-xl shadow-md">
  <div className="flex justify-between items-center">
    {/* Titre + Badges */}
    <div>
      <h3 className="text-xl font-bold text-white mb-1">{program.name}</h3>
      {/* Badges en dessous du titre */}
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
            program.isActive
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-red-100 text-red-700 border border-red-200"
          }`}>
          {program.isActive ? "Actif" : "Inactif"}
        </span>
        {program.hero?.isHero && (
          <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">
            Publié
          </span>
        )}
      </div>
    </div>
    
    {/* Toggle Simple - Seulement pour Administrateur */}
    {isAdministrator && (
    
         <div className="relative group">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={program.isActive}
            onChange={() => toggleActive(program._id, program.isActive)}
          />
          <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
        </label>
        
        {/* Tooltip simple au hover */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
            {program.isActive ? 'Désactiver' : 'Activer'}
          </div>
        </div>
      </div>
    )}
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
                  <User className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-gray-600">
                    Type:{" "}
                    {program.criteres.applicantType.length > 0
                      ? program.criteres.applicantType.join(", ")
                      : "Tous"}
                  </span>
                </div>

                <div className="flex items-center text-sm">
                  <Building className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-gray-600">
                    Secteurs:{" "}
                    {program.criteres?.secteurActivite?.length > 0
                      ? `${program.criteres.secteurActivite.length} sélectionnés`
                      : "Tous"}
                  </span>
                </div>

                <div className="flex items-center text-sm">
                  <DollarSign className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-gray-600">
                    Investissement:{" "}
                    {program.criteres.montantInvestissement.length > 0
                      ? `${program.criteres.montantInvestissement.length} tranches`
                      : "Tous montants"}
                  </span>
                </div>

                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-gray-600">
                    Début:{" "}
                    {program.DateDebut
                      ? new Date(program.DateDebut).toLocaleDateString('fr-FR')
                      : "N/A"}
                  </span>
                </div>

                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-gray-600">
                    Fin:{" "}
                    {program.DateFin
                      ? new Date(program.DateFin).toLocaleDateString('fr-FR')
                      : "N/A"}
                  </span>
                </div>
              </div>

              {/* ✅ Actions - Seulement pour les Administrateurs */}
              {isAdministrator && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(program)}
                    className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center">
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier
                  </button>
                  <button
                    onClick={() => handlePublish(program)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center ${
                      program.hero?.isHero
                        ? "bg-yellow-50 hover:bg-yellow-100 text-yellow-700"
                        : "bg-blue-50 hover:bg-blue-100 text-blue-700"
                    }`}
                    title={
                      program.hero?.isHero
                        ? "Modifier la publication"
                        : "Publier le programme"
                    }>
                    <Share className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(program._id)}
                    className="bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              {!isAdministrator && (
          <div className="flex space-x-2">
            <button
              onClick={() => handleViewDetails(program)}
              className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center">
              <Eye className="w-4 h-4 mr-2" />
              Voir détails
            </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredPrograms.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <FileX className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun programme trouvé
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || remainingDays !== null || filterDate
              ? "Aucun programme ne correspond à vos critères de recherche."
              : "Commencez par créer votre premier programme."}
          </p>
          {!searchTerm && remainingDays === null && !filterDate && (
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Créer un programme
            </button>
          )}
        </div>
      )}

      {/* Modal for Create/Edit Program - extracted */}
      <ProgramFormModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        isEditing={!!editingProgram}
      />

      {/* Modal de publication */}
      {showPublishModal && (
        <PublishProgamModal
          show={showPublishModal}
          onClose={() => {
            setShowPublishModal(false);
            setPublishingProgram(null);
          }}
          program={publishingProgram}
          onSubmit={handlePublishSubmit}
        />
      )}

      <ProgramDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedProgram(null);
        }}
        program={selectedProgram}
      />
    </div>
  );
};

export default Programs;
