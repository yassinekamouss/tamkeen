// src/pages/admin/Programs.tsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "../../api/axios";
import {
  SECTEURS_TRAVAIL,
  REGIONS,
  STATUT_JURIDIQUE_OPTIONS,
  MONTANT_INVESTISSEMENT_OPTIONS,
  ANNEE_CREATION,
} from "../../components/eligibility/constants_for_adding_programs";
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
  EyeOff,
  AlertCircle,
  Building,
  DollarSign,
  User,
  X,
  FileX,
  Share,
} from "lucide-react";
import PublishProgamModal from "../../components/admin/programs/PublishProgramModal";

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
  // Small inline widget to apply a min/max to all selected sectors
  const BulkApplyCA: React.FC<{
    onApply: (min: number | null, max: number | null) => void;
  }> = ({ onApply }) => {
    const [min, setMin] = useState<number | "" | null>("");
    const [max, setMax] = useState<number | "" | null>("");
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-md p-2 mb-3">
        <div className="text-xs text-gray-600 mb-2">
          Appliquer aux secteurs sélectionnés
        </div>
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="block text-[11px] text-gray-500 mb-1">Min</label>
            <input
              type="number"
              className="w-full px-2 py-1.5 border border-gray-300 rounded"
              value={min === null ? "" : min}
              onChange={(e) =>
                setMin(e.target.value ? Number(e.target.value) : null)
              }
            />
          </div>
          <div className="flex-1">
            <label className="block text-[11px] text-gray-500 mb-1">Max</label>
            <input
              type="number"
              className="w-full px-2 py-1.5 border border-gray-300 rounded"
              value={max === null ? "" : max}
              onChange={(e) =>
                setMax(e.target.value ? Number(e.target.value) : null)
              }
            />
          </div>
          <button
            type="button"
            onClick={() =>
              onApply(
                min === "" ? null : (min as number | null),
                max === "" ? null : (max as number | null)
              )
            }
            className="px-3 py-2 bg-slate-700 text-white rounded hover:bg-slate-800 text-sm">
            Appliquer à tous
          </button>
        </div>
      </div>
    );
  };
  // Reusable checklist with bulk actions for criteria selection
  const MultiSelectGroup: React.FC<{
    label: string;
    options: { label: string; value: string | number }[];
    selected: (string | number)[];
    onChange: (next: (string | number)[]) => void;
    height?: "sm" | "md" | "lg";
  }> = ({ label, options, selected, onChange, height = "md" }) => {
    const [query, setQuery] = useState("");
    const sizeClass = useMemo(() => {
      switch (height) {
        case "sm":
          return "max-h-28";
        case "lg":
          return "max-h-64";
        default:
          return "max-h-40";
      }
    }, [height]);

    const filtered = useMemo(
      () =>
        options.filter((o) =>
          String(o.label).toLowerCase().includes(query.toLowerCase())
        ),
      [options, query]
    );

    const allValues = useMemo(() => options.map((o) => o.value), [options]);
    const setAll = () => onChange(allValues);
    const clearAll = () => onChange([]);

    const toggleValue = (value: string | number, checked: boolean) => {
      if (checked) onChange([...(selected as (string | number)[]), value]);
      else onChange(selected.filter((v) => v !== value));
    };

    return (
      <div>
        <div className="flex items-center justify-between mb-2 gap-2">
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={setAll}
              className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-50">
              Tout
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-50">
              Aucun
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filtrer..."
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <span className="text-xs text-gray-500 whitespace-nowrap">
            {selected.length}/{options.length} sélectionnés
          </span>
        </div>
        <div
          className={`${sizeClass} overflow-y-auto border border-gray-200 rounded-lg p-3 space-y-2 bg-white`}>
          {filtered.length === 0 ? (
            <p className="text-xs text-gray-500">Aucune option</p>
          ) : (
            filtered.map((opt) => (
              <label key={String(opt.value)} className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={selected.includes(opt.value)}
                  onChange={(e) => toggleValue(opt.value, e.target.checked)}
                />
                <span className="ml-2 text-sm text-gray-700">{opt.label}</span>
              </label>
            ))
          )}
        </div>
      </div>
    );
  };

  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishingProgram, setPublishingProgram] = useState<Program | null>(
    null
  );

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

  //Ajouter programme
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");

      // Conversion en Date si valeur présente, sinon null
      const payload = {
        ...formData,
        DateDebut: formData.DateDebut ? new Date(formData.DateDebut) : null,
        DateFin: formData.DateFin ? new Date(formData.DateFin) : null,
      };

      if (editingProgram) {
        await axios.put(`/programs/${editingProgram._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("/programs", payload, {
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
      DateDebut: program.DateDebut ? program.DateDebut.toString() : "",
      DateFin: program.DateFin ? program.DateFin.toString() : "",
      link: program.link,
      criteres: {
        ...program.criteres,
        chiffreAffaireParSecteur:
          (program.criteres as any).chiffreAffaireParSecteur || [],
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
      const token = localStorage.getItem("adminToken");
      await axios.put(`/programs/${publishingProgram._id}/hero`, heroData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchPrograms();
      setShowPublishModal(false);
      setPublishingProgram(null);
    } catch {
      setError("Erreur lors de la publication du programme.");
    }
  };

  // handleMultiSelectChange replaced by MultiSelectGroup onChange handlers

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
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Nouveau Programme
          </button>
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
            <div className="bg-gradient-to-r from-slate-600 to-slate-700 px-6 py-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {program.name}
                  </h3>
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
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleActive(program._id, program.isActive)}
                    className={`p-2 rounded-lg transition-colors ${
                      program.isActive
                        ? "bg-slate-500 hover:bg-slate-600"
                        : "bg-slate-400 hover:bg-slate-500"
                    }`}
                    title={program.isActive ? "Désactiver" : "Activer"}>
                    {program.isActive ? (
                      <EyeOff className="w-4 h-4 text-white" />
                    ) : (
                      <Eye className="w-4 h-4 text-white" />
                    )}
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
                      ? new Date(program.DateDebut).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>

                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-gray-600">
                    Fin:{" "}
                    {program.DateFin
                      ? new Date(program.DateFin).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>

              {/* Actions */}
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

      {/* Modal for Create/Edit Program */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 w-full max-w-5xl lg:max-w-6xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-slate-700 px-6 py-4 rounded-t-2xl sticky top-0 z-20 shadow-sm border-b border-slate-600/50">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">
                  {editingProgram
                    ? "Modifier le programme"
                    : "Nouveau programme"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  aria-label="Fermer la fenêtre"
                  className="text-white transition-colors p-2 rounded-md bg-slate-600/60 focus:outline-none focus:ring-2 focus:ring-white/60">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h4 className="text-sm font-medium text-gray-800 mb-4">
                    Informations de base
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom du programme *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Programme de soutien aux startups"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>

                    {/* Site web */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site web
                      </label>
                      <input
                        type="url"
                        placeholder="https://www.exemple.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.link}
                        onChange={(e) =>
                          setFormData({ ...formData, link: e.target.value })
                        }
                      />
                    </div>

                    {/* Statut */}
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

                    {/* Dates côte à côte */}
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date de début
                        </label>
                        <input
                          type="date"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={
                            formData.DateDebut
                              ? formData.DateDebut.split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              DateDebut: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date fin
                        </label>
                        <input
                          type="date"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={
                            formData.DateFin
                              ? formData.DateFin.split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              DateFin: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Décrivez les objectifs et les avantages de ce programme de subvention..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                {/* Criteria Section */}
                <div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-blue-600" />
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
                                  setFormData((prev) => ({
                                    ...prev,
                                    criteres: {
                                      ...prev.criteres,
                                      applicantType: e.target.checked
                                        ? [...prev.criteres.applicantType, type]
                                        : prev.criteres.applicantType.filter(
                                            (t) => t !== type
                                          ),
                                    },
                                  }))
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

                      {/*sexe */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Sexe
                        </label>
                        <div className="space-y-2">
                          {["homme", "femme"].map((gender) => (
                            <label key={gender} className="flex items-center">
                              <input
                                type="checkbox"
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                checked={formData.criteres.sexe.includes(
                                  gender
                                )}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    criteres: {
                                      ...prev.criteres,
                                      sexe: e.target.checked
                                        ? [...prev.criteres.sexe, gender]
                                        : prev.criteres.sexe.filter(
                                            (g) => g !== gender
                                          ),
                                    },
                                  }))
                                }
                              />
                              <span className="ml-2 text-sm text-gray-700">
                                {gender === "homme" ? "Homme" : "Femme"}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                      {/* Age */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Âge
                        </label>
                        <div className="flex space-x-4">
                          <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1">
                              Âge minimum
                            </label>
                            <input
                              type="number"
                              min={18}
                              max={100}
                              placeholder="18"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={formData.criteres.age.minAge || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  criteres: {
                                    ...formData.criteres,
                                    age: {
                                      ...formData.criteres.age,
                                      minAge: e.target.value
                                        ? Number(e.target.value)
                                        : null,
                                      maxAge:
                                        formData.criteres.age?.maxAge ?? null,
                                    },
                                  },
                                })
                              }
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1">
                              Âge maximum
                            </label>
                            <input
                              type="number"
                              min={18}
                              max={100}
                              placeholder="65"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={formData.criteres.age.maxAge || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  criteres: {
                                    ...formData.criteres,
                                    age: {
                                      ...formData.criteres.age,
                                      maxAge: e.target.value
                                        ? Number(e.target.value)
                                        : null,
                                      minAge:
                                        formData.criteres.age?.minAge ?? null,
                                    },
                                  },
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>

                      {/* Chiffre d'affaires */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Chiffre d'affaires global (optionnel)
                        </label>
                        <p className="text-xs text-gray-500 mb-2">
                          Ignoré si des valeurs par secteur sont définies.
                        </p>
                        <div className="flex space-x-4 mb-4">
                          <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1">
                              Minimum
                            </label>
                            <input
                              type="number"
                              placeholder="100000"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={
                                formData.criteres.chiffreAffaire
                                  .chiffreAffaireMin || ""
                              }
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  criteres: {
                                    ...prev.criteres,
                                    chiffreAffaire: {
                                      ...prev.criteres.chiffreAffaire,
                                      chiffreAffaireMin: e.target.value
                                        ? Number(e.target.value)
                                        : null,
                                    },
                                  },
                                }))
                              }
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1">
                              Maximum
                            </label>
                            <input
                              type="number"
                              placeholder="5000000"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={
                                formData.criteres.chiffreAffaire
                                  .chiffreAffaireMax || ""
                              }
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  criteres: {
                                    ...prev.criteres,
                                    chiffreAffaire: {
                                      ...prev.criteres.chiffreAffaire,
                                      chiffreAffaireMax: e.target.value
                                        ? Number(e.target.value)
                                        : null,
                                    },
                                  },
                                }))
                              }
                            />
                          </div>
                        </div>

                        {/* Per-sector revenue */}
                        <div className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">
                              Chiffre d'affaires par secteur
                            </span>
                          </div>
                          {/* Bulk apply */}
                          <BulkApplyCA
                            onApply={(min, max) => {
                              setFormData((prev) => {
                                const selected = prev.criteres.secteurActivite;
                                const map = new Map(
                                  prev.criteres.chiffreAffaireParSecteur.map(
                                    (e) => [e.secteur, e]
                                  )
                                );
                                selected.forEach((s) => {
                                  const existing = map.get(s);
                                  if (existing) {
                                    existing.min = min;
                                    existing.max = max;
                                  } else {
                                    map.set(s, { secteur: s, min, max });
                                  }
                                });
                                const nextArr = Array.from(map.values()).filter(
                                  (e) => selected.includes(e.secteur)
                                );
                                return {
                                  ...prev,
                                  criteres: {
                                    ...prev.criteres,
                                    chiffreAffaireParSecteur: nextArr,
                                  },
                                };
                              });
                            }}
                          />

                          {/* Rows per selected sector */}
                          {formData.criteres.secteurActivite.length === 0 ? (
                            <p className="text-xs text-gray-500">
                              Sélectionnez d'abord des secteurs d'activité.
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {formData.criteres.secteurActivite.map(
                                (secteur) => {
                                  const entry = (
                                    formData.criteres
                                      .chiffreAffaireParSecteur || []
                                  ).find((e) => e.secteur === secteur) || {
                                    secteur,
                                    min: null,
                                    max: null,
                                  };
                                  return (
                                    <div
                                      key={secteur}
                                      className="grid grid-cols-12 gap-2 items-end">
                                      <div className="col-span-4">
                                        <label className="block text-xs text-gray-500 mb-1">
                                          Secteur
                                        </label>
                                        <input
                                          disabled
                                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded"
                                          value={secteur}
                                        />
                                      </div>
                                      <div className="col-span-4">
                                        <label className="block text-xs text-gray-500 mb-1">
                                          Min
                                        </label>
                                        <input
                                          type="number"
                                          className="w-full px-3 py-2 border border-gray-300 rounded"
                                          value={entry.min ?? ""}
                                          onChange={(e) => {
                                            const val = e.target.value
                                              ? Number(e.target.value)
                                              : null;
                                            setFormData((prev) => {
                                              const arr = [
                                                ...(prev.criteres
                                                  .chiffreAffaireParSecteur ||
                                                  []),
                                              ];
                                              const idx = arr.findIndex(
                                                (a) => a.secteur === secteur
                                              );
                                              if (idx >= 0)
                                                arr[idx] = {
                                                  ...arr[idx],
                                                  min: val,
                                                };
                                              else
                                                arr.push({
                                                  secteur,
                                                  min: val,
                                                  max: entry.max ?? null,
                                                });
                                              // keep only selected sectors
                                              const next = arr.filter((a) =>
                                                prev.criteres.secteurActivite.includes(
                                                  a.secteur
                                                )
                                              );
                                              return {
                                                ...prev,
                                                criteres: {
                                                  ...prev.criteres,
                                                  chiffreAffaireParSecteur:
                                                    next,
                                                },
                                              };
                                            });
                                          }}
                                        />
                                      </div>
                                      <div className="col-span-4">
                                        <label className="block text-xs text-gray-500 mb-1">
                                          Max
                                        </label>
                                        <input
                                          type="number"
                                          className="w-full px-3 py-2 border border-gray-300 rounded"
                                          value={entry.max ?? ""}
                                          onChange={(e) => {
                                            const val = e.target.value
                                              ? Number(e.target.value)
                                              : null;
                                            setFormData((prev) => {
                                              const arr = [
                                                ...(prev.criteres
                                                  .chiffreAffaireParSecteur ||
                                                  []),
                                              ];
                                              const idx = arr.findIndex(
                                                (a) => a.secteur === secteur
                                              );
                                              if (idx >= 0)
                                                arr[idx] = {
                                                  ...arr[idx],
                                                  max: val,
                                                };
                                              else
                                                arr.push({
                                                  secteur,
                                                  min: entry.min ?? null,
                                                  max: val,
                                                });
                                              const next = arr.filter((a) =>
                                                prev.criteres.secteurActivite.includes(
                                                  a.secteur
                                                )
                                              );
                                              return {
                                                ...prev,
                                                criteres: {
                                                  ...prev.criteres,
                                                  chiffreAffaireParSecteur:
                                                    next,
                                                },
                                              };
                                            });
                                          }}
                                        />
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Secteurs d'activité */}
                      <div className="col-span-2">
                        <MultiSelectGroup
                          label="Secteurs d'activité"
                          height="lg"
                          options={SECTEURS_TRAVAIL.map((s) => ({
                            label: s.key,
                            value: s.value,
                          }))}
                          selected={formData.criteres.secteurActivite}
                          onChange={(next) =>
                            setFormData((prev) => {
                              const selected = next as string[];
                              const map = new Map(
                                (
                                  prev.criteres.chiffreAffaireParSecteur || []
                                ).map((e) => [e.secteur, e])
                              );
                              // ensure entries for selected, keep existing values
                              selected.forEach((s) => {
                                if (!map.has(s))
                                  map.set(s, {
                                    secteur: s,
                                    min: null,
                                    max: null,
                                  });
                              });
                              // remove entries not selected
                              const nextArr = Array.from(map.values()).filter(
                                (e) => selected.includes(e.secteur)
                              );
                              return {
                                ...prev,
                                criteres: {
                                  ...prev.criteres,
                                  secteurActivite: selected,
                                  chiffreAffaireParSecteur: nextArr,
                                },
                              };
                            })
                          }
                        />
                      </div>

                      {/* Statuts juridiques */}
                      <div>
                        <MultiSelectGroup
                          label="Statuts juridiques"
                          options={STATUT_JURIDIQUE_OPTIONS.map((o) => ({
                            label: o.key,
                            value: o.value,
                          }))}
                          selected={formData.criteres.statutJuridique}
                          onChange={(next) =>
                            setFormData((prev) => ({
                              ...prev,
                              criteres: {
                                ...prev.criteres,
                                statutJuridique: next as string[],
                              },
                            }))
                          }
                        />
                      </div>

                      {/* Montant d'investissement */}
                      <div>
                        <MultiSelectGroup
                          label="Montant d'investissement"
                          options={MONTANT_INVESTISSEMENT_OPTIONS.map((o) => ({
                            label: o.key,
                            value: o.value,
                          }))}
                          selected={formData.criteres.montantInvestissement}
                          onChange={(next) =>
                            setFormData((prev) => ({
                              ...prev,
                              criteres: {
                                ...prev.criteres,
                                montantInvestissement: next as string[],
                              },
                            }))
                          }
                        />
                      </div>

                      {/* Régions */}
                      <div>
                        <MultiSelectGroup
                          label="Régions"
                          options={REGIONS.map((r) => ({ label: r, value: r }))}
                          selected={formData.criteres.region}
                          onChange={(next) =>
                            setFormData((prev) => ({
                              ...prev,
                              criteres: {
                                ...prev.criteres,
                                region: next as string[],
                              },
                            }))
                          }
                        />
                      </div>
                      {/* Année de création */}
                      <div>
                        <MultiSelectGroup
                          label="Année de création"
                          options={ANNEE_CREATION.map((a) => ({
                            label: String(a),
                            value: a,
                          }))}
                          selected={formData.criteres.anneeCreation}
                          onChange={(next) =>
                            setFormData((prev) => ({
                              ...prev,
                              criteres: {
                                ...prev.criteres,
                                anneeCreation: next,
                              },
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3 mt-8">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-800 text-white rounded-lg font-medium transition-all duration-200 shadow-lg">
                  {editingProgram ? "Mettre à jour" : "Créer le programme"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
    </div>
  );
};

export default Programs;
