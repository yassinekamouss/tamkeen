import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useClientAuth } from "../../contexts/ClientAuthContext";
import { Header, Footer } from "../../components";
import RequirementList from "../../components/client/RequirementList";
import CustomUpload from "../../components/client/CustomUpload";
import { dossierService } from "../../services/dossierService";
import type { DocumentRequirement } from "../../types/dossier";
import { useTranslation } from "react-i18next";

const ClientDashboard: React.FC = () => {
  const { user, dossiers, logout, checkAuth } = useClientAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const activeDossier = dossiers && dossiers.length > 0 ? dossiers[0] : null;

  // Récupération de la checklist via dossierService (qui extrait désormais l'array de manière robuste)
  const {
    data: requirementsData,
    isLoading: isLoadingRequirements,
    isError: isRequirementsError,
  } = useQuery({
    queryKey: ["dossierRequirements", activeDossier?.id],
    queryFn: () => dossierService.getRequirements(activeDossier!.id),
    enabled: !!activeDossier?.id,
  });

  // Type Guard et fallback sécurisé sous forme de tableau
  const requirements: DocumentRequirement[] = Array.isArray(requirementsData)
    ? requirementsData
    : [];

  // Statistiques de complétion avec filtrage stricts sur `is_required === true`
  const requiredList = requirements.filter((r) => r.is_required === true);
  const requiredUploadedCount = requiredList.filter(
    (r) => r.status === "UPLOADED"
  ).length;
  const totalRequiredCount = requiredList.length;
  const isAllRequiredUploaded =
    totalRequiredCount > 0 && requiredUploadedCount === totalRequiredCount;
  const progressPercent =
    totalRequiredCount > 0
      ? Math.round((requiredUploadedCount / totalRequiredCount) * 100)
      : 0;

  // Mutation de soumission d'inputs et bascule AI_DRAFTING
  const submitInputsMutation = useMutation({
    mutationFn: async () => {
      if (!activeDossier?.id) throw new Error("Dossier introuvable.");
      return await dossierService.submitInputs(activeDossier.id);
    },
    onSuccess: async () => {
      setSubmitError(null);
      await checkAuth();
    },
    onError: (err: any) => {
      const message =
        err.response?.data?.message ||
        err.message ||
        t(
          "clientDashboard.submitErrorDefault",
          "Erreur lors de la soumission du dossier."
        );
      setSubmitError(message);
    },
  });

  const displayName =
    user?.applicantType === "morale"
      ? user?.nomEntreprise || user?.email
      : `${user?.prenom || ""} ${user?.nom || ""}`.trim() || user?.email;

  const currentStatus = activeDossier?.status || "AWAITING_INPUTS";

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "AWAITING_INPUTS":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-2 h-2 mr-1.5 ml-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            En attente de vos pièces justificatives
          </span>
        );
      case "AI_DRAFTING":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            <span className="w-2 h-2 mr-1.5 ml-1.5 rounded-full bg-blue-500 animate-ping"></span>
            Analyse et Rédaction IA en cours
          </span>
        );
      case "CONSULTANT_REVIEW":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">
            Revue par un consultant expert
          </span>
        );
      case "AWAITING_CLIENT_INFO":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-800 border border-orange-200">
            Complément d'information demandé
          </span>
        );
      case "DELIVERED":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            ✓ Dossier finalisé & livré
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">
            Dossier initialisé
          </span>
        );
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-between bg-slate-50 font-sans"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner Welcome */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 rtl:space-x-reverse text-xs font-bold uppercase tracking-wider text-[#1E5ED8]">
              <span>Masubvention.ma V2</span>
              <span>•</span>
              <span className="text-slate-500 font-medium">
                {user?.applicantType === "morale"
                  ? "Personne Morale"
                  : "Personne Physique"}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Bienvenue <span className="text-[#1E5ED8]">{displayName}</span>
            </h1>
            <p className="text-slate-600 text-sm md:text-base">
              Suivez en temps réel l'avancement de votre dossier de subvention.
            </p>
          </div>

          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2.5 border border-slate-300 shadow-2xs text-sm font-medium rounded-xl text-slate-700 bg-white hover:bg-slate-50 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-[#1E5ED8]"
            >
              <svg
                className="w-4 h-4 mr-2 ml-2 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Se déconnecter
            </button>
          </div>
        </div>

        {/* Dossier Workspace Container */}
        {activeDossier ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header du Dossier */}
            <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <span className="font-bold text-slate-900 text-lg">
                  Dossier #{activeDossier.id}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                  {activeDossier.plan_type === "PLAN_1"
                    ? "Plan 1 : Génération IA"
                    : "Plan 2 : Accompagnement Consultant"}
                </span>
              </div>
              <div>{getStatusBadge(currentStatus)}</div>
            </div>

            {/* VUE 1 : Statut AWAITING_INPUTS (Collecte documentaire) */}
            {currentStatus === "AWAITING_INPUTS" ? (
              <div className="p-6 md:p-8 space-y-8">
                {/* Barre de progression des documents obligatoires */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {t(
                          "clientDashboard.progressTitle",
                          "Progression de la collecte documentaire"
                        )}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {t(
                          "clientDashboard.progressSubtitle",
                          "Veuillez téléverser tous les documents obligatoires avant de valider l'envoi à l'IA."
                        )}
                      </p>
                    </div>
                    <div className="text-sm font-extrabold text-[#1E5ED8]">
                      {requiredUploadedCount} / {totalRequiredCount} {t("clientDashboard.documentsUploaded", "pièces fournies")} ({progressPercent}%)
                    </div>
                  </div>

                  {/* Progressive Bar */}
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-[#1E5ED8] h-3 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Toast / Alerte Erreur de Soumission */}
                {submitError && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm font-medium flex items-start space-x-3 rtl:space-x-reverse shadow-sm">
                    <svg
                      className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <div className="flex-1">
                      <span className="font-bold block">
                        {t(
                          "clientDashboard.submitErrorTitle",
                          "Soumission incomplète"
                        )}
                      </span>
                      <span>{submitError}</span>
                    </div>
                    <button
                      onClick={() => setSubmitError(null)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Studio Documentaire : Checklist + Custom Upload */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      {t(
                        "clientDashboard.checklistTitle",
                        "Checklist des documents requis"
                      )}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {t(
                        "clientDashboard.checklistDesc",
                        "Déposez vos documents officiels directement dans les zones dédiées ci-dessous."
                      )}
                    </p>
                  </div>

                  {isLoadingRequirements ? (
                    <div className="p-12 text-center text-slate-400 space-y-3">
                      <svg
                        className="animate-spin h-8 w-8 text-[#1E5ED8] mx-auto"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <p className="text-sm font-medium">
                        Chargement de la checklist documentaire...
                      </p>
                    </div>
                  ) : isRequirementsError ? (
                    <div className="p-6 rounded-xl bg-red-50 text-red-600 text-sm text-center">
                      Erreur lors du chargement des pièces demandées.
                    </div>
                  ) : (
                    <>
                      <RequirementList
                        dossierId={activeDossier.id}
                        requirements={requirements}
                      />
                      <CustomUpload dossierId={activeDossier.id} />
                    </>
                  )}
                </div>

                {/* CTA Principal : Soumettre mon dossier à l'IA */}
                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-500">
                    {isAllRequiredUploaded ? (
                      <span className="text-emerald-700 font-semibold flex items-center">
                        <svg
                          className="w-4 h-4 mr-1 ml-1 text-emerald-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Toutes les pièces obligatoires sont transmises. Vous pouvez lancer la génération.
                      </span>
                    ) : (
                      <span>
                        Veuillez joindre toutes les pièces marquées{" "}
                        <strong className="text-rose-600">Obligatoire</strong> pour débloquer la génération IA.
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => submitInputsMutation.mutate()}
                    disabled={
                      !isAllRequiredUploaded || submitInputsMutation.isPending
                    }
                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#1E5ED8] hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center space-x-2 rtl:space-x-reverse"
                  >
                    {submitInputsMutation.isPending ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Initialisation de l'IA...</span>
                      </>
                    ) : (
                      <>
                        <span>Soumettre mon dossier à l'IA</span>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : currentStatus === "AI_DRAFTING" ? (
              /* VUE 2 : Statut AI_DRAFTING */
              <div className="p-8 md:p-12 text-center space-y-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-blue-100/80 text-[#1E5ED8] flex items-center justify-center animate-pulse shadow-inner">
                  <svg
                    className="w-10 h-10 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>

                <div className="max-w-md mx-auto space-y-2">
                  <h2 className="text-2xl font-extrabold text-slate-900">
                    Analyse et Génération du Dossier en cours
                  </h2>
                  <p className="text-slate-600 text-sm">
                    L'Agent IA de Masubvention analyse vos documents financiers et rédige la synthèse de votre dossier de subvention.
                  </p>
                </div>

                <div className="max-w-md mx-auto bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3 text-left rtl:text-right">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse text-sm font-medium text-slate-800">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span>1. Extraction et validation des documents</span>
                  </div>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse text-sm font-semibold text-[#1E5ED8]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1E5ED8] animate-ping"></span>
                    <span>2. Calcul du montant optimal de subvention</span>
                  </div>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse text-sm font-medium text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                    <span>3. Transfert de la synthèse à l'expert consultant</span>
                  </div>
                </div>

                <div className="text-xs text-slate-500 pt-4">
                  Un email vous sera adressé dès la validation de votre rapport par notre consultant expert.
                </div>
              </div>
            ) : (
              /* VUE 3 : Statut Ulcurs (CONSULTANT_REVIEW, DELIVERED, etc.) */
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Votre dossier est en cours de traitement
                </h3>
                <p className="text-slate-600 text-sm max-w-lg mx-auto">
                  Le statut de votre dossier est actuellement{" "}
                  <strong className="text-slate-900">{currentStatus}</strong>. Nos équipes spécialisées sont mobilisées sur votre demande.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center space-y-4">
            <p className="text-slate-600 font-medium">
              Aucun dossier actif n'a été trouvé.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ClientDashboard;
