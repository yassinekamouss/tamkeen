import type { FormData, EligibilityResult } from "./types";

import api from "../../api/axios";
/**
 * Fonction pour déterminer les années de CA à demander selon l'année de création
 */
export const getYearsForCA = (anneeCreation?: string): number[] => {
  if (!anneeCreation) return [];

  const currentYear = 2025;
  const years = [];

  // Si l'entreprise est créée avant 2022
  if (anneeCreation === "avant-2022") {
    // Demander les 3 dernières années complètes
    years.push(2024, 2023, 2022);
  } else {
    const creationYear = parseInt(anneeCreation);
    // Calculer les années disponibles depuis la création (max 3 années précédentes)
    for (
      let year = currentYear - 1;
      year >= Math.max(creationYear, currentYear - 3);
      year--
    ) {
      years.push(year);
    }
  }

  return years.sort((a, b) => b - a); // Tri décroissant (2024, 2023, 2022)
};

export const checkEligibility = async (data: FormData): Promise<EligibilityResult> => {
  try {
   
    const response = await api.post("/test/eligibilite", data);

    if(response.data.programs.length > 0){
      return { isEligible : true , programs : response.data.programs };
    } else {
      return { isEligible: false };
    }
  } catch (error) {
    console.error("Erreur lors de la vérification d'éligibilité :", error);
    return { isEligible: false };
  }
};

