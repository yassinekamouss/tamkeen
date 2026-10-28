// tamkeen/src/utils/apiError.ts

import type { ApiErrorCode, ApiErrorResponse, ParsedApiError } from "../types/api";

const TRANSLATIONS: Record<
  "fr" | "ar",
  Record<ApiErrorCode | "UNKNOWN_ERROR", string>
> = {
  fr: {
    NETWORK_ERROR: "Impossible de joindre le serveur. Veuillez vérifier votre connexion Internet.",
    TIMEOUT: "Le délai d'attente de la requête a été dépassé. Veuillez réessayer.",
    VALIDATION_ERROR: "Données invalides ou incomplètes. Veuillez vérifier les champs requis.",
    UNAUTHORIZED: "Session expirée ou identifiants incorrects.",
    FORBIDDEN: "Accès refusé. Votre compte est peut-être inactif ou vous n'avez pas les autorisations nécessaires.",
    NOT_FOUND: "La ressource demandée est introuvable.",
    CONFLICT: "Cet enregistrement existe déjà dans le système.",
    PDF_EXTRACTION_ERROR: "Impossible d'extraire les données du document PDF. Veuillez vérifier la qualité du fichier.",
    LLM_SERVICE_ERROR: "Le service d'analyse IA est temporairement indisponible. Veuillez réessayer dans un instant.",
    SERVICE_UNAVAILABLE: "Service temporairement indisponible pour maintenance.",
    INTERNAL_SERVER_ERROR: "Une erreur interne inattendue est survenue.",
    ACCOUNT_DEACTIVATED: "Votre compte a été désactivé par l'administration.",
    ACCOUNT_EXISTS: "Un compte avec cette adresse email existe déjà.",
    INVALID_CREDENTIALS: "Email ou mot de passe incorrect.",
    UNKNOWN_ERROR: "Une erreur inattendue est survenue. Veuillez réessayer.",
  },
  ar: {
    NETWORK_ERROR: "تعذر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.",
    TIMEOUT: "استغرقت الاستجابة وقتاً طويلاً. يرجى المحاولة مرة أخرى.",
    VALIDATION_ERROR: "بيانات غير مكتملة أو غير صالحة. يرجى التحقق من الحقول المطلوبة.",
    UNAUTHORIZED: "جلسة العمل منتهية أو بيانات الدخول غير صحيحة.",
    FORBIDDEN: "تم تعليق حسابك أو لا تملك الصلاحيات الكافية للوصول.",
    NOT_FOUND: "العنصر المطلوب غير موجود.",
    CONFLICT: "هذا الحساب أو العنصر مسجل مسبقاً في النظام.",
    PDF_EXTRACTION_ERROR: "تعذر استخراج البيانات من ملف PDF. يرجى التأكد من جودة الملف.",
    LLM_SERVICE_ERROR: "واجهت خدمة الذكاء الاصطناعي صعوبة مؤقتة. يرجى إعادة المحاولة لاحقاً.",
    SERVICE_UNAVAILABLE: "الخدمة غير متوفرة حالياً. جاري الصيانة.",
    INTERNAL_SERVER_ERROR: "حدث خطأ غير متوقع في الخادم. يرجى المحاولة لاحقاً.",
    ACCOUNT_DEACTIVATED: "تم إلغاء تنشيط حسابك من قبل الإدارة.",
    ACCOUNT_EXISTS: "يوجد حساب مسجل بالفعل بهذا البريد الإلكتروني.",
    INVALID_CREDENTIALS: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    UNKNOWN_ERROR: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
  },
};

/**
 * Récupère la langue active depuis localStorage / document.documentElement / navigateur
 */
export const getActiveLanguage = (): "fr" | "ar" => {
  try {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("appLanguage") || localStorage.getItem("i18nextLng");
      if (stored && stored.startsWith("ar")) return "ar";
      const docLang = document.documentElement.lang;
      if (docLang && docLang.startsWith("ar")) return "ar";
    }
  } catch {
    // ignore
  }
  return "fr";
};

/**
 * Normalise et extrait les messages d'erreurs détaillés sous forme de tableau de chaînes
 */
export const extractDetailMessages = (details: any): string[] => {
  if (!details) return [];

  if (Array.isArray(details)) {
    return details
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object") {
          if (item.field && item.message) {
            return `${item.field}: ${item.message}`;
          }
          return item.message || JSON.stringify(item);
        }
        return String(item);
      })
      .filter(Boolean);
  }

  if (typeof details === "object") {
    return Object.entries(details).map(([key, val]) => {
      if (typeof val === "string") return `${key}: ${val}`;
      if (val && typeof val === "object" && (val as any).message) {
        return `${key}: ${(val as any).message}`;
      }
      return `${key}: ${JSON.stringify(val)}`;
    });
  }

  if (typeof details === "string") {
    return [details];
  }

  return [];
};

/**
 * Parseur universel pour convertir toute exception (Axios, Network, JS Error)
 * en un format ParsedApiError standardisé et robuste pour l'UI.
 */
export const parseApiError = (
  error: unknown,
  fallbackMessage?: string,
  preferredLang?: "fr" | "ar"
): ParsedApiError => {
  const lang = preferredLang || getActiveLanguage();
  const err = error as any;

  // 1. Détection de timeout
  const isTimeout =
    err?.code === "ECONNABORTED" ||
    (typeof err?.message === "string" && err.message.toLowerCase().includes("timeout"));

  if (isTimeout) {
    const code: ApiErrorCode = "TIMEOUT";
    return {
      message: TRANSLATIONS[lang][code] || fallbackMessage || "Délai dépassé",
      code,
      status: 408,
      details: null,
      detailMessages: [],
      isNetworkError: true,
      isAuthError: false,
      isForbidden: false,
      isValidationError: false,
      isLlmError: false,
    };
  }

  // 2. Détection de panne réseau pure (pas de réponse reçue)
  const isNetwork =
    err?.code === "ERR_NETWORK" ||
    err?.message === "Network Error" ||
    (err?.isAxiosError && !err.response);

  if (isNetwork) {
    const code: ApiErrorCode = "NETWORK_ERROR";
    return {
      message: TRANSLATIONS[lang][code] || fallbackMessage || "Erreur de connexion",
      code,
      status: 0,
      details: null,
      detailMessages: [],
      isNetworkError: true,
      isAuthError: false,
      isForbidden: false,
      isValidationError: false,
      isLlmError: false,
    };
  }

  // 3. Réponse reçue depuis le serveur
  const responseData: ApiErrorResponse | undefined = err?.response?.data;
  const status: number = Number(err?.response?.status) || 0;

  // Résolution du code d'erreur
  let code: ApiErrorCode | string = responseData?.code || "";
  if (!code) {
    if (status === 400) code = "VALIDATION_ERROR";
    else if (status === 401) code = "UNAUTHORIZED";
    else if (status === 403) code = "FORBIDDEN";
    else if (status === 404) code = "NOT_FOUND";
    else if (status === 409) code = "CONFLICT";
    else if (status === 422) code = "PDF_EXTRACTION_ERROR";
    else if (status === 502) code = "LLM_SERVICE_ERROR";
    else if (status === 503) code = "SERVICE_UNAVAILABLE";
    else if (status >= 500) code = "INTERNAL_SERVER_ERROR";
    else code = "UNKNOWN_ERROR";
  }

  // Résolution du message :
  // Si langue arabe demandée et qu'une traduction spécifique existe pour ce code, on la privilégie.
  // Sinon, on prend le message explicite fourni par le backend s'il existe.
  let message: string = "";
  const localizedMsg = (TRANSLATIONS[lang] as any)?.[code];

  if (lang === "ar" && localizedMsg && (!responseData?.message || code === "INTERNAL_SERVER_ERROR")) {
    message = localizedMsg;
  } else if (responseData?.message && typeof responseData.message === "string") {
    message = responseData.message;
  } else if (localizedMsg) {
    message = localizedMsg;
  } else if (typeof err?.message === "string" && !err.isAxiosError) {
    message = err.message;
  } else {
    message = fallbackMessage || TRANSLATIONS[lang].UNKNOWN_ERROR;
  }

  const details = responseData?.details || null;
  const detailMessages = extractDetailMessages(details);

  return {
    message,
    code,
    status,
    details,
    detailMessages,
    isNetworkError: false,
    isAuthError: status === 401 || code === "UNAUTHORIZED" || code === "INVALID_CREDENTIALS",
    isForbidden: status === 403 || code === "FORBIDDEN" || code === "ACCOUNT_DEACTIVATED",
    isValidationError: status === 400 || code === "VALIDATION_ERROR",
    isLlmError: status === 502 || code === "LLM_SERVICE_ERROR",
  };
};

/**
 * Helper rapide pour extraire une chaîne de message d'erreur présentable
 */
export const getErrorMessage = (error: unknown, fallback?: string): string => {
  return parseApiError(error, fallback).message;
};
