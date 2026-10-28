// tamkeen/src/types/api.ts

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "PDF_EXTRACTION_ERROR"
  | "LLM_SERVICE_ERROR"
  | "SERVICE_UNAVAILABLE"
  | "INTERNAL_SERVER_ERROR"
  | "ACCOUNT_DEACTIVATED"
  | "ACCOUNT_EXISTS"
  | "INVALID_CREDENTIALS"
  | "NETWORK_ERROR"
  | "TIMEOUT"
  | "UNKNOWN_ERROR";

export interface ApiSuccessResponse<T = any> {
  success: true;
  message?: string;
  data: T;
  [key: string]: any;
}

export interface ApiValidationErrorDetail {
  field?: string;
  message: string;
  [key: string]: any;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  code?: ApiErrorCode | string;
  details?: ApiValidationErrorDetail[] | Record<string, any> | string | null;
  [key: string]: any;
}

export interface ParsedApiError {
  /** Message d'erreur prêt à l'affichage (respecte la langue FR/AR si applicable) */
  message: string;
  /** Code technique standardisé */
  code: ApiErrorCode | string;
  /** Code de statut HTTP (ex: 400, 401, 403, 500) ou 0 si erreur réseau/client */
  status: number;
  /** Détails éventuels (erreurs de champs, infos de débogage) */
  details?: ApiValidationErrorDetail[] | Record<string, any> | string | null;
  /** Liste aplatie de messages de détails utiles pour l'affichage (ex: liste à puces) */
  detailMessages: string[];
  /** Vrai si problème de connectivité réseau / serveur injoignable */
  isNetworkError: boolean;
  /** Vrai si session expirée ou identifiants incorrects (401) */
  isAuthError: boolean;
  /** Vrai si accès interdit ou compte suspendu (403) */
  isForbidden: boolean;
  /** Vrai si erreur de validation de formulaire / champs obligatoires (400) */
  isValidationError: boolean;
  /** Vrai si le service LLM/IA a échoué (502) */
  isLlmError: boolean;
}
