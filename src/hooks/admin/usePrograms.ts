import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "../../api/axios";

export type RuleLite = {
  id?: string;
  field: string;
  operator: string;
  value: unknown;
  valueSource?: string;
};

export type RuleGroupLite = {
  id?: string;
  rules: RuleLite[];
  combinator?: string;
};

export interface BilingualText {
  fr: string;
  ar: string;
}

export interface Program {
  _id: string;
  name: BilingualText;
  description: BilingualText;
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
  criteres: RuleGroupLite;
}

export const usePrograms = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [remainingDays, setRemainingDays] = useState<number | null>(null);
  const [filterDate, setFilterDate] = useState<string>("");

  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishingProgram, setPublishingProgram] = useState<Program | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const adminProfile = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("adminProfile") || "null");
    } catch {
      return null;
    }
  }, []);

  const isAdministrator = adminProfile?.role === "Administrateur";

  const fetchPrograms = useCallback(async () => {
    try {
      const response = await axios.get("/programs");
      setPrograms(response.data);
      setError(null);
    } catch {
      setError("Erreur lors du chargement des programmes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce programme ?")) {
      try {
        await axios.delete(`/programs/${id}`);
        await fetchPrograms();
      } catch {
        setError("Erreur lors de la suppression du programme.");
      }
    }
  }, [fetchPrograms]);

  const toggleActive = useCallback(async (id: string, isActive: boolean) => {
    try {
      await axios.patch(`/programs/${id}/toggle`, { isActive: !isActive });
      await fetchPrograms();
    } catch {
      setError("Erreur lors de la modification du statut.");
    }
  }, [fetchPrograms]);

  const handlePublish = useCallback((program: Program) => {
    setPublishingProgram(program);
    setShowPublishModal(true);
  }, []);

  const handlePublishSubmit = useCallback(async (heroData: FormData) => {
    if (!publishingProgram) return;

    try {
      await axios.put(`/programs/${publishingProgram._id}/hero`, heroData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await fetchPrograms();
      setShowPublishModal(false);
      setPublishingProgram(null);
    } catch {
      setError("Erreur lors de la publication du programme.");
    }
  }, [publishingProgram, fetchPrograms]);

  const handleViewDetails = useCallback((program: Program) => {
    setSelectedProgram(program);
    setShowDetailsModal(true);
  }, []);

  const filteredPrograms = useMemo(() => {
    return programs.filter((program) => {
      const matchesSearch =
        program.name.fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.description.fr.toLowerCase().includes(searchTerm.toLowerCase());

      const hasDate = Boolean(filterDate);
      const hasMaxDays = remainingDays !== null;

      const startDate = program.DateDebut ? new Date(program.DateDebut) : null;
      const endDate = program.DateFin ? new Date(program.DateFin) : null;
      
      const toStartOfDay = (d: Date) =>
        new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const dayMs = 1000 * 60 * 60 * 24;
      const today = toStartOfDay(new Date());

      let matchesFilters = true;

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
          const rangeEnd = selected < today ? today : selected;
          const overlap =
            programEnd >= today &&
            (programStart ? programStart <= rangeEnd : true);
          if (!overlap) matchesFilters = false;
        }
      }

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
  }, [programs, searchTerm, remainingDays, filterDate]);

  return {
    programs,
    filteredPrograms,
    loading,
    error,
    searchTerm,
    remainingDays,
    filterDate,
    showPublishModal,
    publishingProgram,
    showDetailsModal,
    selectedProgram,
    isAdministrator,
    setSearchTerm,
    setRemainingDays,
    setFilterDate,
    setShowPublishModal,
    setPublishingProgram,
    setShowDetailsModal,
    setSelectedProgram,
    handleDelete,
    toggleActive,
    handlePublish,
    handlePublishSubmit,
    handleViewDetails,
  };
};

export default usePrograms;
