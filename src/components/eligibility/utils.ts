import type { FormData, EligibilityResult, AgentApiResponse } from "./types";

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

export const checkEligibility = async (data: FormData, isAuth: boolean = false): Promise<EligibilityResult> => {
  try {
    if (data.telephone) {
      if (!data.telephone.startsWith("+212")) {
        data.telephone = `+212${data.telephone}`;
      }
    }

    const endpoint = isAuth ? "/test/eligibilite/me" : "/test/eligibilite";
    const response = await api.post(endpoint, data);

    if (response.data.programs.length > 0) {
      return { isEligible: true, programs: response.data.programs, testId: response.data.testId };
    } else {
      return { isEligible: false, testId: response.data.testId };
    }
  } catch (error: any) {
    const statusCode: number | undefined = error.response?.status;
    const message =
      error.response?.data?.message || "Erreur lors de la vérification d'éligibilité";

    return { isEligible: false, errorMessage: message, statusCode };
  }
};

export const callAgent = async (params: {
  formData: FormData;
  lang?: string;
  testId?: string | null;
  sessionId?: string | null;
  userMessage?: string | null;
}): Promise<AgentApiResponse> => {
  try {
    const response = await api.post("/test/eligibilite/agent", params);
    return response.data;
  } catch (error: any) {
    console.error("Agent API Call Error:", error);
    // Return graceful frontend fallback
    return {
      success: false,
      fallbackUsed: true,
      data: {
        agentMessage:
          params.lang === "ar"
            ? "نحن هنا لمساعدتك. يبدو أن هناك صعوبة مؤقتة في التحليل التلقائي. يمكنك طلب التواصل مع مستشارنا البشري."
            : "Nous sommes là pour vous aider. Une difficulté temporaire est survenue lors de l'analyse. Vous pouvez demander un appel gratuit avec un conseiller Tamkeen.",
        analysis: {
          closestPrograms: [],
          profileStrengths: [],
          generalAdvice:
            params.lang === "ar"
              ? "تواصل مع مستشارنا لتوجيهك."
              : "Prenez contact avec notre équipe pour étudier les options sur mesure.",
        },
        suggestedActions: [
          {
            actionType: "CONTACT_ADVISOR",
            label: params.lang === "ar" ? "طلب اتصال من مستشار" : "Parler à un conseiller Tamkeen",
          },
          {
            actionType: "NEW_TEST",
            label: params.lang === "ar" ? "إعادة إجرائ الاختبار" : "Refaire une évaluation",
          },
        ],
        escalate: true,
      },
    };
  }
};