import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useClientAuth } from "../../contexts/ClientAuthContext";
import { Header } from "../../components";
import RequirementList from "../../components/client/RequirementList";
import CustomUpload from "../../components/client/CustomUpload";
import { dossierService } from "../../services/dossierService";
import type { DocumentRequirement } from "../../types/dossier";
import { useTranslation } from "react-i18next";
import PlanSelection from "./PlanSelection";
import RequestsView from "./RequestsView";

const font = {
  display: "font-['Plus_Jakarta_Sans',_sans-serif]",
  body: "font-['Roboto_Flex',_sans-serif]",
  mono: "font-['JetBrains_Mono',_monospace]",
};

const ClientDashboard: React.FC = () => {
  const { user, dossiers, logout, checkAuth } = useClientAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"workspace" | "requests">("workspace");

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const activeDossier = dossiers && dossiers.length > 0 ? dossiers[0] : null;

  const {
    data: requirementsData,
    isLoading: isLoadingRequirements,
    isError: isRequirementsError,
  } = useQuery({
    queryKey: ["dossierRequirements", activeDossier?.id],
    queryFn: () => dossierService.getRequirements(activeDossier!.id),
    enabled: !!activeDossier?.id,
  });

  const requirements: DocumentRequirement[] = Array.isArray(requirementsData)
    ? requirementsData
    : [];

  const { data: requests = [] } = useQuery({
    queryKey: ["clientRequests", activeDossier?.id],
    queryFn: async () => {
      if (!activeDossier?.id) return [];
      const res = await dossierService.getRequests(activeDossier.id);
      return res.data;
    },
    enabled: !!activeDossier?.id,
  });

  const pendingRequestsCount = requests.filter((r: any) => r.status === "PENDING" && r.creator_type === "CONSULTANT").length;

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

  // Chips keep the pill radius (the one documented exception to the 4px system)
  // and are built from the design system's tonal pairs: tertiary (amber/orange),
  // primary (blue), secondary (neutral), error (red), and a Google-style green
  // for the terminal "delivered" state.
  const getStatusBadge = (status?: string) => {
    const base =
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide";
    switch (status) {
      case "PLAN_SELECTION":
        return (
          <span className={`${base} bg-[#DDE0E3] text-[#414754]`}>
            Choix du plan
          </span>
        );
      case "AWAITING_INPUTS":
        return (
          <span className={`${base} bg-[#FFDBCB] text-[#783100]`}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#9E4300] animate-pulse" />
            En attente de vos pièces
          </span>
        );
      case "AI_DRAFTING":
        return (
          <span className={`${base} bg-[#E8F0FE] text-[#005BBF]`}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#1A73E8] animate-ping" />
            Analyse &amp; rédaction IA
          </span>
        );
      case "CONSULTANT_REVIEW":
        return (
          <span className={`${base} bg-[#DDE0E3] text-[#414754]`}>
            Revue consultant expert
          </span>
        );
      case "AWAITING_CLIENT_INFO":
        return (
          <span className={`${base} bg-[#FFDAD6] text-[#93000A]`}>
            Complément d'info requis
          </span>
        );
      case "DELIVERED":
        return (
          <span className={`${base} bg-[#E6F4EA] text-[#1E8E3E]`}>
            Dossier livré
          </span>
        );
      default:
        return (
          <span className={`${base} bg-[#EDEEEF] text-[#414754]`}>
            Dossier initialisé
          </span>
        );
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between bg-[#F8F9FA] ${font.body}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Header />

      <main className="flex-grow max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Welcome banner — flat card, hairline border, no shadow */}
        <div className="bg-white rounded border border-[#DADCE0] p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 rtl:space-x-reverse text-[11px] font-bold uppercase tracking-[0.05em] text-[#1A73E8]">
              <span>Masubvention.ma V2</span>
              <span className="text-[#727785]">•</span>
              <span className="text-[#5F6368] font-semibold tracking-normal normal-case">
                {user?.applicantType === "morale"
                  ? "Personne Morale"
                  : "Personne Physique"}
              </span>
            </div>
            <h1 className={`${font.display} text-2xl md:text-3xl font-bold text-[#191C1D] tracking-tight`}>
              Bienvenue <span className="text-[#1A73E8]">{displayName}</span>
            </h1>
            <p className="text-[#5F6368] text-sm md:text-[15px]">
              Suivez en temps réel l'avancement de votre dossier de subvention.
            </p>
          </div>

          <div className="flex items-center gap-4 rtl:space-x-reverse">
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2.5 border border-[#DADCE0] text-sm font-medium rounded text-[#414754] bg-white hover:bg-[#F3F4F5] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A73E8]"
            >
              <svg
                className="w-4 h-4 mr-2 ml-2 text-[#727785]"
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

        {/* Dossier workspace */}
        {activeDossier ? (
          <div className="bg-white rounded border border-[#DADCE0] overflow-hidden">
            {/* Dossier header */}
            <div className="border-b border-[#DADCE0] bg-[#F8F9FA] px-6 py-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 rtl:space-x-reverse">
                <span className={`${font.display} font-bold text-[#191C1D] text-lg`}>
                  Dossier #{activeDossier.id}
                </span>
                <span className="text-xs px-2.5 py-1 rounded bg-[#E8F0FE] text-[#005BBF] font-semibold border border-[#C1C6D6]">
                  {activeDossier.plan_type === "PLAN_1"
                    ? "Plan 1 : Génération IA"
                    : "Plan 2 : Accompagnement Consultant"}
                </span>
              </div>
              <div>{getStatusBadge(currentStatus)}</div>
            </div>

            {currentStatus !== "PLAN_SELECTION" && (
              <div className="border-b border-[#DADCE0] bg-white px-6 py-4">
                <div className="inline-flex bg-[#F1F3F4] p-1 rounded-lg gap-1 rtl:space-x-reverse border border-[#E1E3E4]">
                  <button
                    onClick={() => setActiveTab("workspace")}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#1A73E8] focus-visible:ring-offset-2 ${
                      activeTab === "workspace"
                        ? "bg-white text-[#1A73E8] shadow-sm ring-1 ring-black/5"
                        : "text-[#5F6368] hover:text-[#191C1D] hover:bg-[#E8EAED]"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Mon espace de travail
                  </button>
                  <button
                    onClick={() => setActiveTab("requests")}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#1A73E8] focus-visible:ring-offset-2 ${
                      activeTab === "requests"
                        ? "bg-white text-[#1A73E8] shadow-sm ring-1 ring-black/5"
                        : "text-[#5F6368] hover:text-[#191C1D] hover:bg-[#E8EAED]"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Messagerie & requêtes
                    {pendingRequestsCount > 0 && (
                      <span className="flex items-center justify-center w-5 h-5 ml-1 text-[10px] font-bold text-white bg-orange-500 rounded-full animate-bounce">
                        {pendingRequestsCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )}

            {currentStatus === "PLAN_SELECTION" ? (
              <PlanSelection dossierId={activeDossier.id} onPlanSelected={checkAuth} />
            ) : activeTab === "requests" ? (
              <RequestsView dossierId={activeDossier.id} planType={activeDossier.plan_type} />
            ) : currentStatus === "AWAITING_INPUTS" ? (
              <div className="p-6 md:p-8 space-y-8">
                {/* Progress — subtle inset container, hairline border */}
                <div className="bg-[#F8F9FA] rounded p-6 border border-[#DADCE0] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className={`${font.display} text-[15px] font-semibold text-[#191C1D]`}>
                        {t(
                          "clientDashboard.progressTitle",
                          "Progression de la collecte documentaire"
                        )}
                      </h3>
                      <p className="text-xs text-[#5F6368] mt-0.5">
                        {t(
                          "clientDashboard.progressSubtitle",
                          "Téléversez tous les documents obligatoires avant de valider l'envoi à l'IA."
                        )}
                      </p>
                    </div>
                    <div className={`text-sm font-bold text-[#1A73E8] ${font.mono}`}>
                      {requiredUploadedCount} / {totalRequiredCount} {t("clientDashboard.documentsUploaded", "pièces fournies")} · {progressPercent}%
                    </div>
                  </div>

                  <div className="w-full bg-[#E1E3E4] rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#1A73E8] h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Error callout — tinted box, 4px left accent, per spec */}
                {submitError && (
                  <div className="p-4 rounded bg-[#FFDAD6] border-l-4 border-[#BA1A1A] text-[#93000A] text-sm font-medium flex items-start gap-3 rtl:space-x-reverse">
                    <svg
                      className="w-5 h-5 text-[#BA1A1A] mt-0.5 flex-shrink-0"
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
                      className="text-[#BA1A1A]/60 hover:text-[#BA1A1A] transition-colors"
                      aria-label="Fermer"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Document studio */}
                <div className="space-y-6">
                  <div>
                    <h3 className={`${font.display} text-lg font-semibold text-[#191C1D] mb-1`}>
                      {t(
                        "clientDashboard.checklistTitle",
                        "Checklist des documents requis"
                      )}
                    </h3>
                    <p className="text-xs text-[#5F6368]">
                      {t(
                        "clientDashboard.checklistDesc",
                        "Déposez vos documents officiels directement dans les zones dédiées ci-dessous."
                      )}
                    </p>
                  </div>

                  {isLoadingRequirements ? (
                    <div className="p-12 text-center text-[#727785] space-y-3">
                      <svg
                        className="animate-spin h-7 w-7 text-[#1A73E8] mx-auto"
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
                    <div className="p-6 rounded bg-[#FFDAD6] border-l-4 border-[#BA1A1A] text-[#93000A] text-sm text-center">
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

                {/* Primary CTA — solid blue, 4px radius, diffused ambient shadow only here */}
                <div className="pt-6 border-t border-[#DADCE0] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-[#5F6368]">
                    {isAllRequiredUploaded ? (
                      <span className="text-[#1E8E3E] font-semibold flex items-center">
                        <svg
                          className="w-4 h-4 mr-1 ml-1 text-[#1E8E3E]"
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
                        Joignez toutes les pièces marquées{" "}
                        <strong className="text-[#BA1A1A]">Obligatoire</strong> pour débloquer la génération IA.
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => submitInputsMutation.mutate()}
                    disabled={
                      !isAllRequiredUploaded || submitInputsMutation.isPending
                    }
                    className="w-full sm:w-auto px-8 py-3.5 rounded bg-[#1A73E8] hover:bg-[#174EA6] text-white font-bold text-sm shadow-[0_4px_14px_rgba(26,115,232,0.12)] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 rtl:space-x-reverse"
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
              <div className="p-8 md:p-12 text-center space-y-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#E8F0FE] text-[#1A73E8] flex items-center justify-center">
                  <svg
                    className="w-8 h-8 animate-spin"
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
                  <h2 className={`${font.display} text-2xl font-bold text-[#191C1D]`}>
                    Analyse et génération du dossier en cours
                  </h2>
                  <p className="text-[#5F6368] text-sm">
                    L'agent IA de Masubvention analyse vos documents financiers et rédige la synthèse de votre dossier de subvention.
                  </p>
                </div>

                <div className="max-w-md mx-auto bg-[#F8F9FA] p-6 rounded border border-[#DADCE0] space-y-3 text-left rtl:text-right">
                  <div className="flex items-center gap-3 rtl:space-x-reverse text-sm font-medium text-[#191C1D]">
                    <span className="w-2 h-2 rounded-full bg-[#1E8E3E]"></span>
                    <span>1. Extraction et validation des documents</span>
                  </div>
                  <div className="flex items-center gap-3 rtl:space-x-reverse text-sm font-semibold text-[#1A73E8]">
                    <span className="w-2 h-2 rounded-full bg-[#1A73E8] animate-ping"></span>
                    <span>2. Calcul du montant optimal de subvention</span>
                  </div>
                  <div className="flex items-center gap-3 rtl:space-x-reverse text-sm font-medium text-[#727785]">
                    <span className="w-2 h-2 rounded-full bg-[#C1C6D6]"></span>
                    <span>3. Transfert de la synthèse à l'expert consultant</span>
                  </div>
                </div>

                <div className="text-xs text-[#5F6368] pt-2">
                  Un email vous sera adressé dès la validation de votre rapport par notre consultant expert.
                </div>
              </div>
            ) : (
              <div className="p-8 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#E6F4EA] text-[#1E8E3E] flex items-center justify-center">
                  <svg
                    className="w-7 h-7"
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
                <h3 className={`${font.display} text-xl font-bold text-[#191C1D]`}>
                  Votre dossier est en cours de traitement
                </h3>
                <p className="text-[#5F6368] text-sm max-w-lg mx-auto">
                  Le statut de votre dossier est actuellement{" "}
                  <strong className="text-[#191C1D]">{currentStatus}</strong>. Nos équipes spécialisées sont mobilisées sur votre demande.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded border border-[#DADCE0] p-8 text-center space-y-4">
            <p className="text-[#5F6368] font-medium">
              Aucun dossier actif n'a été trouvé.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ClientDashboard;