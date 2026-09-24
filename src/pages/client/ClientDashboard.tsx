import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useClientAuth } from "../../contexts/ClientAuthContext";
import { ClientHeader } from "../../components";
import { dossierService } from "../../services/dossierService";
import { useTranslation } from "react-i18next";
import PlanSelection from "./PlanSelection";
import RequestsView from "./RequestsView";
import { ClientStepper } from "../../components/client/stepper";
import {
  FileText,
  Plus,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  UserCheck,
  RefreshCw,
  Clock,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

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

  const [activeTab, setActiveTab] = useState<"workspace" | "requests">("workspace");
  const [activeDossierId, setActiveDossierId] = useState<number | null>(null);
  const [isReediting, setIsReediting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);


  useEffect(() => {
    if (dossiers && dossiers.length > 0 && !activeDossierId) {
      setActiveDossierId(dossiers[0].id);
    }
  }, [dossiers, activeDossierId]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const activeDossier = dossiers.find(d => d.id === activeDossierId) || (dossiers && dossiers.length > 0 ? dossiers[0] : null);

  const deliveredDoc =
    activeDossier?.documents?.find(
      (doc: any) => doc.doc_category === "DELIVERABLE_PDF" || doc.doc_category === "FINAL_REPORT"
    ) ||
    activeDossier?.documents?.find(
      (doc: any) => doc.filename?.startsWith("Rapport_Investissement_") || doc.file_path?.includes("reports/")
    );

  const getDocUrl = (filePath?: string) => {
    if (!filePath) return "#";
    if (filePath.startsWith("http")) return filePath;

    const normalized = filePath.replace(/\\/g, "/");
    const uploadsIndex = normalized.indexOf("uploads/");
    const relativePath = uploadsIndex !== -1 ? normalized.substring(uploadsIndex) : normalized.replace(/^\/+/, "");

    const baseUrl = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "")
      : "http://localhost:5000";

    return `${baseUrl}/${relativePath}`;
  };

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

  const displayName =
    user?.applicantType === "morale"
      ? user?.nomEntreprise || user?.email
      : `${user?.prenom || ""} ${user?.nom || ""}`.trim() || user?.email;

  const currentStatus = activeDossier?.status || "AWAITING_INPUTS";

  const handleRefreshStatus = async () => {
    setIsRefreshing(true);
    try {
      await checkAuth();
    } finally {
      setIsRefreshing(false);
    }
  };

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
            {t("clientDashboard.badges.PLAN_SELECTION", "Choix du plan")}
          </span>
        );
      case "AWAITING_INPUTS":
        return (
          <span className={`${base} bg-[#FFDBCB] text-[#783100]`}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#9E4300] animate-pulse" />
            {t("clientDashboard.badges.AWAITING_INPUTS", "En attente de vos données")}
          </span>
        );
      case "AI_DRAFTING":
        return (
          <span className={`${base} bg-[#E8F0FE] text-[#005BBF]`}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#1A73E8] animate-ping" />
            {t("clientDashboard.badges.AI_DRAFTING", "Instruction & Structuration")}
          </span>
        );
      case "CONSULTANT_REVIEW":
        return (
          <span className={`${base} bg-[#F3E8FD] text-[#6B21A8] border border-[#E9D5FF]`}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#9333EA] animate-pulse" />
            {t("clientDashboard.badges.CONSULTANT_REVIEW", "Revue consultant expert")}
          </span>
        );
      case "AWAITING_CLIENT_INFO":
        return (
          <span className={`${base} bg-[#FFDAD6] text-[#93000A]`}>
            {t("clientDashboard.badges.AWAITING_CLIENT_INFO", "Complément d'info requis")}
          </span>
        );
      case "DELIVERED":
        return (
          <span className={`${base} bg-[#E6F4EA] text-[#1E8E3E]`}>
            {t("clientDashboard.badges.DELIVERED", "Dossier livré")}
          </span>
        );
      case "GENERATION_FAILED":
        return (
          <span className={`${base} bg-[#FFDAD6] text-[#93000A]`}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#BA1A1A] animate-pulse" />
            {t("clientDashboard.badges.GENERATION_FAILED", "Génération en reprise")}
          </span>
        );
      default:
        return (
          <span className={`${base} bg-[#EDEEEF] text-[#414754]`}>
            {t("clientDashboard.badges.INITIALIZED", "Dossier initialisé")}
          </span>
        );
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between bg-[#F8F9FA] ${font.body}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <ClientHeader />

      <main className="flex-grow max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Welcome banner — flat card, hairline border, no shadow */}
        <div className="bg-white rounded border border-[#DADCE0] p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 rtl:space-x-reverse text-[11px] font-bold uppercase tracking-[0.05em] text-[#1A73E8]">
              <span>Masubvention.ma</span>
              <span className="text-[#727785]">•</span>
              <span className="text-[#5F6368] font-semibold tracking-normal normal-case">
                {user?.applicantType === "morale"
                  ? t("clientDashboard.entreprise", "Personne Morale")
                  : t("clientDashboard.personnePhysique", "Personne Physique")}
              </span>
            </div>
            <h1 className={`${font.display} text-2xl md:text-3xl font-bold text-[#191C1D] tracking-tight`}>
              {t("clientDashboard.welcome", "Bienvenue,")} <span className="text-[#1A73E8]">{displayName}</span>
            </h1>
            <p className="text-[#5F6368] text-sm md:text-[15px]">
              {t("clientDashboard.welcomeSubtitle", "Suivez en temps réel l'avancement de votre dossier de subvention.")}
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
              {t("clientHeader.logout", "Se déconnecter")}
            </button>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DADCE0] pb-4">
          <div className="flex gap-6">
            <div className="text-[15px] font-bold text-[#191C1D] flex items-center gap-2">
              <FileText size={18} className="text-[#1A73E8]" />
              {t("clientDashboard.myDossiers", "Mes Dossiers")} ({dossiers?.length || 0})
            </div>
          </div>
          
          <button
            onClick={() => navigate("/client/test")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1A73E8] text-white text-sm font-bold rounded-lg hover:bg-[#174EA6] transition-colors shadow-sm"
          >
            <Plus size={16} />
            {t("clientDashboard.newTestBtn", "Nouveau Test")}
          </button>
        </div>

        {/* Dossiers Section */}
        <div>
            {dossiers && dossiers.length > 0 ? (
              <div className="space-y-6">
                {/* Sélecteur de dossiers */}
                {dossiers.length > 1 && (
                  <div className="flex flex-wrap gap-3">
                    {dossiers.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => setActiveDossierId(d.id)}
                        className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                          activeDossierId === d.id
                            ? "bg-[#E8F0FE] border-[#1A73E8] text-[#005BBF]"
                            : "bg-white border-[#DADCE0] text-[#5F6368] hover:bg-[#F8F9FA] hover:text-[#191C1D]"
                        }`}
                      >
                        {t("clientDashboard.dossierNum", { id: d.id, defaultValue: `Dossier #${d.id}` })}
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Dossier workspace */}
                {activeDossier ? (
                  <div className="bg-white rounded border border-[#DADCE0] overflow-hidden">
                    {/* Dossier header */}
                    <div className="border-b border-[#DADCE0] bg-[#F8F9FA] px-6 py-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 rtl:space-x-reverse">
                <span className={`${font.display} font-bold text-[#191C1D] text-lg`}>
                  {t("clientDashboard.dossierNum", { id: activeDossier.id, defaultValue: `Dossier #${activeDossier.id}` })}
                </span>
                <span className="text-xs px-2.5 py-1 rounded bg-[#E8F0FE] text-[#005BBF] font-semibold border border-[#C1C6D6]">
                  {activeDossier.plan_type === "PLAN_1"
                    ? t("clientDashboard.plan1Label", "Plan 1 : Formule Directe")
                    : t("clientDashboard.plan2Label", "Plan 2 : Accompagnement Expert Dédié")}
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
                    {t("clientDashboard.tabWorkspace", "Mon espace de travail")}
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
                    {t("clientDashboard.tabRequests", "Messagerie & requêtes")}
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
              <div className="p-4 sm:p-6 lg:p-8">
                <ClientStepper
                  dossierId={activeDossier.id}
                  onSubmitted={checkAuth}
                />
              </div>
            ) : currentStatus === "AI_DRAFTING" ? (
              <div className="p-8 md:p-14 text-center space-y-8 animate-fadeIn">
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-ping"></div>
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <FileSpreadsheet className="w-10 h-10 animate-pulse" />
                  </div>
                </div>

                <div className="max-w-xl mx-auto space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-200">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                    {t("clientDashboard.aiDrafting.badge", "Traitement & Modélisation Financière")}
                  </div>
                  <h2 className={`${font.display} text-2xl md:text-3xl font-bold text-gray-900`}>
                    {t("clientDashboard.aiDrafting.title", "Instruction technique et financière de votre dossier...")}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {t("clientDashboard.aiDrafting.description", "Nos équipes et outils d'analyse instruisent vos pièces justificatives, vérifient l'assiette éligible et modélisent l'ensemble des projections financières pour la Charte TPME.")}
                  </p>
                </div>

                {/* Étapes d'instruction du dossier */}
                <div className="max-w-lg mx-auto bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4 text-left rtl:text-right shadow-xs">
                  <div className="flex items-center gap-3 text-sm font-semibold text-gray-800">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span>{t("clientDashboard.aiDrafting.step1", "1. Contrôle de conformité et audit des pièces (Liasse fiscale, RC, CNSS)")}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-blue-700">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    </div>
                    <span>{t("clientDashboard.aiDrafting.step2", "2. Modélisation financière & optimisation des primes d'investissement")}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
                    <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center shrink-0 text-xs font-bold">
                      3
                    </div>
                    <span>{t("clientDashboard.aiDrafting.step3", "3. Transmission du dossier à votre consultant senior dédié")}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={handleRefreshStatus}
                    disabled={isRefreshing}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-bold transition-all shadow-xs disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-blue-600" : ""}`} />
                    <span>{isRefreshing ? t("clientDashboard.aiDrafting.refreshing", "Actualisation...") : t("clientDashboard.aiDrafting.refreshBtn", "Actualiser le statut")}</span>
                  </button>
                </div>
                <p className="text-xs text-gray-400">
                  {t("clientDashboard.aiDrafting.note", "Cette phase d'instruction préliminaire est en cours de finalisation. Vous serez notifié dès la prise en main par votre consultant.")}
                </p>
              </div>
            ) : currentStatus === "CONSULTANT_REVIEW" ? (
              <div className="p-8 md:p-14 text-center space-y-8 animate-fadeIn">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-purple-600 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <UserCheck className="w-10 h-10" />
                </div>

                <div className="max-w-xl mx-auto space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider border border-purple-200">
                    <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
                    {t("clientDashboard.consultantReview.badge", "Accompagnement Expert · Volet 2")}
                  </div>
                  <h2 className={`${font.display} text-2xl md:text-3xl font-bold text-gray-900`}>
                    {t("clientDashboard.consultantReview.title", "Dossier pris en charge par nos experts - Volet 2")}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {t("clientDashboard.consultantReview.description", "Votre dossier a été instruit avec succès. Un consultant senior est actuellement mobilisé pour auditer vos pièces, affiner vos ratios bancaires et consolider votre argumentaire de subvention.")}
                  </p>
                </div>

                {/* Encadré d'expertise */}
                <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl border border-purple-200 text-left rtl:text-right space-y-3 shadow-sm">
                  <div className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5 mb-2">
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    <span>{t("clientDashboard.consultantReview.commitmentsTitle", "Engagements de l'audit consultant :")}</span>
                  </div>
                  <div className="space-y-2 text-xs text-gray-700 font-medium">
                    <div className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>{t("clientDashboard.consultantReview.commitment1", "Vérification de la conformité juridique et de l'assiette CAPEX éligible.")}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>{t("clientDashboard.consultantReview.commitment2", "Optimisation du montage financier (fonds propres, ratios bancaires, dette).")}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>{t("clientDashboard.consultantReview.commitment3", "Remise du rapport officiel certifié prêt pour soumission bancaire.")}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => setActiveTab("requests")}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold shadow-md transition-all active:scale-95"
                  >
                    <span>{t("clientDashboard.consultantReview.consultRequestsBtn", "Consulter la messagerie & les requêtes")}</span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </button>
                  <button
                    onClick={handleRefreshStatus}
                    disabled={isRefreshing}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-bold transition-all shadow-xs"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                    <span>{t("clientDashboard.consultantReview.refreshBtn", "Actualiser")}</span>
                  </button>
                </div>
              </div>
            ) : currentStatus === "GENERATION_FAILED" ? (
              isReediting ? (
                <div className="p-4 sm:p-6 lg:p-8 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <span className="text-xs font-bold text-amber-900">
                      {t("clientDashboard.generationFailed.reeditModeBanner", "Mode Réédition actif : Vous pouvez réajuster vos données et relancer la certification.")}
                    </span>
                    <button
                      onClick={() => setIsReediting(false)}
                      className="text-xs font-bold text-amber-800 underline hover:text-amber-950"
                    >
                      {t("clientDashboard.generationFailed.closeReedit", "Fermer le mode réédition")}
                    </button>
                  </div>
                  <ClientStepper
                    dossierId={activeDossier.id}
                    onSubmitted={async () => {
                      setIsReediting(false);
                      await checkAuth();
                    }}
                  />
                </div>
              ) : (
                <div className="p-8 md:p-14 text-center space-y-8 animate-fadeIn">
                  <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shadow-md">
                    <AlertTriangle className="w-10 h-10" />
                  </div>

                  <div className="max-w-xl mx-auto space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider border border-amber-300">
                      <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
                      {t("clientDashboard.generationFailed.badge", "Prise en charge active")}
                    </div>
                    <h2 className={`${font.display} text-2xl md:text-3xl font-bold text-gray-900`}>
                      {t("clientDashboard.generationFailed.title", "Génération en cours de reprise par notre équipe")}
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {t("clientDashboard.generationFailed.description", "La génération automatique a rencontré un aléa technique temporaire. Notre équipe technique en a été automatiquement notifiée et reprend le traitement de votre dossier pour vous délivrer votre rapport certifié.")}
                    </p>
                  </div>

                  <div className="max-w-md mx-auto bg-amber-50/70 p-4 rounded-xl border border-amber-200 text-xs text-amber-900 text-left rtl:text-right space-y-1">
                    <span className="font-bold block">{t("clientDashboard.generationFailed.safeDataNoteTitle", "Information sécurisée :")}</span>
                    <span>{t("clientDashboard.generationFailed.safeDataNote", "Toutes vos pièces justificatives et données saisies sont conservées. Aucune action n'est requise de votre part, mais vous pouvez rééditer vos chiffres si nécessaire.")}</span>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={handleRefreshStatus}
                      disabled={isRefreshing}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm transition-all"
                    >
                      <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                      <span>{isRefreshing ? t("clientDashboard.generationFailed.checking", "Vérification...") : t("clientDashboard.generationFailed.checkProgressBtn", "Vérifier l'état d'avancement")}</span>
                    </button>
                    <button
                      onClick={() => setIsReediting(true)}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-bold transition-all shadow-xs"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>{t("clientDashboard.generationFailed.reeditBtn", "Rééditer mes données")}</span>
                    </button>
                  </div>
                </div>
              )
            ) : currentStatus === "DELIVERED" ? (
              <div className="p-8 md:p-12 text-center space-y-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#E6F4EA] text-[#1E8E3E] flex items-center justify-center shadow-sm">
                  <CheckCircle2 className="w-8 h-8 text-[#1E8E3E]" />
                </div>

                <div className="max-w-md mx-auto space-y-2">
                  <h2 className={`${font.display} text-2xl font-bold text-[#191C1D]`}>
                    {t("clientDashboard.delivered.title", "Félicitations ! Votre dossier est livré 🎉")}
                  </h2>
                  <p className="text-[#5F6368] text-sm">
                    {t("clientDashboard.delivered.description", "Votre rapport d'investissement et de demande de subvention a été finalisé et certifié par notre consultant expert.")}
                  </p>
                </div>

                {deliveredDoc ? (
                  <div className="max-w-lg mx-auto bg-white p-6 rounded-lg border border-[#DADCE0] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-left rtl:text-right">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-[#E8F0FE] rounded-lg text-[#1A73E8]">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#191C1D]">{t("clientDashboard.delivered.reportTitle", "Rapport d'Investissement Final (PDF)")}</h4>
                        <p className="text-xs text-[#5F6368]">
                          {deliveredDoc.original_name || t("clientDashboard.delivered.reportDesc", "Document certifié Masubvention.ma")}
                        </p>
                      </div>
                    </div>

                    <a
                      href={getDocUrl(deliveredDoc.file_path)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1E8E3E] text-white text-sm font-bold rounded-lg hover:bg-[#197A35] transition-colors shadow-sm whitespace-nowrap"
                    >
                      <Download className="w-4 h-4" />
                      {t("clientDashboard.delivered.downloadPdf", "Télécharger PDF")}
                    </a>
                  </div>
                ) : (
                  <div className="max-w-lg mx-auto bg-emerald-50 p-6 rounded-lg border border-emerald-200 text-center space-y-3">
                    <p className="text-xs font-semibold text-emerald-800">
                      {t("clientDashboard.delivered.refreshNotice", "Le statut de votre dossier est Livré. Si le lien de téléchargement direct ne s'affiche pas immédiatement, veuillez rafraîchir la page.")}
                    </p>
                    <button
                      onClick={handleRefreshStatus}
                      className="px-4 py-2 bg-emerald-600 text-white rounded text-xs font-bold"
                    >
                      {t("clientDashboard.delivered.refreshBtn", "Rafraîchir")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#E6F4EA] text-[#1E8E3E] flex items-center justify-center">
                  <Clock className="w-7 h-7 text-[#1E8E3E]" />
                </div>
                <h3 className={`${font.display} text-xl font-bold text-[#191C1D]`}>
                  {t("clientDashboard.inProgress.title", "Votre dossier est en cours de traitement")}
                </h3>
                <p className="text-[#5F6368] text-sm max-w-lg mx-auto">
                  {t("clientDashboard.inProgress.description", { status: currentStatus, defaultValue: `Le statut de votre dossier est actuellement ${currentStatus}. Nos équipes spécialisées sont mobilisées sur votre demande.` })}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded border border-[#DADCE0] p-8 text-center space-y-4">
            <p className="text-[#5F6368] font-medium">
              {t("clientDashboard.noActiveDossier", "Aucun dossier actif n'a été sélectionné.")}
            </p>
          </div>
        )}
        </div>
      ) : (
        <div className="bg-white rounded border border-[#DADCE0] p-12 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#F3F4F5] flex items-center justify-center text-[#727785]">
            <FileText size={24} />
          </div>
          <h3 className="text-xl font-bold text-[#191C1D]">{t("clientDashboard.emptyDossiersTitle", "Aucun dossier actif")}</h3>
          <p className="text-[#5F6368] font-medium max-w-sm mx-auto">
            {t("clientDashboard.emptyDossiersDesc", "Vous n'avez pas encore créé de dossier d'accompagnement. Vous pouvez démarrer en lançant un nouveau test ou depuis votre historique.")}
          </p>
          <button
            onClick={() => navigate("/client/test")}
            className="mt-4 px-6 py-2.5 bg-[#1A73E8] text-white text-sm font-bold rounded-lg hover:bg-[#174EA6] transition-colors"
          >
            {t("clientDashboard.startFirstTest", "Nouveau test d'éligibilité")}
          </button>
        </div>
      )}
        </div>
      </main>
    </div>
  );
};

export default ClientDashboard;