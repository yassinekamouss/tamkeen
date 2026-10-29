import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useClientAuth } from "../../contexts/ClientAuthContext";
import { ClientHeader } from "../../components";
import { dossierService } from "../../services/dossierService";
import { useTranslation } from "react-i18next";
import PlanSelection from "./PlanSelection";
import RequestsView from "./RequestsView";
import { ClientStepper } from "../../components/client/stepper";
import { parseApiError } from "../../utils/apiError";
import {
  FileText,
  Plus,
  Download,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  RefreshCw,
  Clock,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  ArrowUpRight,
  Landmark,
  X,
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
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  const handleUpgradePlan = async (newPlan: "PLAN_2" | "PLAN_3") => {
    if (!activeDossier) return;
    setIsUpgrading(true);
    setDashboardError(null);
    try {
      await dossierService.upgradePlan(activeDossier.id, newPlan);
      setShowUpgradeModal(false);
      await checkAuth();
    } catch (err: any) {
      const parsed = parseApiError(err, "Erreur lors de la mise à niveau");
      setDashboardError(parsed.message);
    } finally {
      setIsUpgrading(false);
    }
  };


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

    const rawApiUrl = import.meta.env.VITE_BACKEND_API_URL || import.meta.env.VITE_API_URL || "";
    const baseUrl = rawApiUrl.replace(/\/api\/?$/, "");
    const cleanPath = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
    return baseUrl ? `${baseUrl}${cleanPath}` : cleanPath;
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

  // Badges administratifs épurés et lisibles (norme portail institutionnel)
  const getStatusBadge = (status?: string) => {
    const base =
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold tracking-normal";
    switch (status) {
      case "PLAN_SELECTION":
        return (
          <span className={`${base} bg-slate-100 text-slate-700 border border-slate-200`}>
            {t("clientDashboard.badges.PLAN_SELECTION", "Sélection de formule")}
          </span>
        );
      case "AWAITING_INPUTS":
        return (
          <span className={`${base} bg-amber-50 text-amber-800 border border-amber-200`}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            {t("clientDashboard.badges.AWAITING_INPUTS", "Saisie du formulaire en attente")}
          </span>
        );
      case "DELEGATED_TO_CONSULTANT":
        return (
          <span className={`${base} bg-sky-50 text-sky-800 border border-sky-200`}>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
            {t("clientDashboard.badges.DELEGATED", "Délégué au conseiller")}
          </span>
        );
      case "AI_DRAFTING":
        return (
          <span className={`${base} bg-blue-50 text-blue-800 border border-blue-200`}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            {t("clientDashboard.badges.AI_DRAFTING", "Instruction & Modélisation")}
          </span>
        );
      case "CONSULTANT_REVIEW":
        return (
          <span className={`${base} bg-indigo-50 text-indigo-800 border border-indigo-200`}>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
            {t("clientDashboard.badges.CONSULTANT_REVIEW", "Revue de conformité expert")}
          </span>
        );
      case "AWAITING_CLIENT_INFO":
        return (
          <span className={`${base} bg-rose-50 text-rose-800 border border-rose-200`}>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
            {t("clientDashboard.badges.AWAITING_CLIENT_INFO", "Pièces complémentaires requises")}
          </span>
        );
      case "DELIVERED":
        return (
          <span className={`${base} bg-emerald-50 text-emerald-800 border border-emerald-200`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            {t("clientDashboard.badges.DELIVERED", "Dossier instruit & délivré")}
          </span>
        );
      case "GENERATION_FAILED":
        return (
          <span className={`${base} bg-amber-50 text-amber-900 border border-amber-300`}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-700" />
            {t("clientDashboard.badges.GENERATION_FAILED", "Vérification manuelle")}
          </span>
        );
      default:
        return (
          <span className={`${base} bg-slate-100 text-slate-700 border border-slate-200`}>
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

        {/* Bannière d'erreur API globale */}
        {dashboardError && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
              <p className="text-sm font-medium">{dashboardError}</p>
            </div>
            <button
              type="button"
              onClick={() => setDashboardError(null)}
              className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-100 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

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
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 rtl:space-x-reverse">
                <span className={`${font.display} font-bold text-[#191C1D] text-lg`}>
                  {t("clientDashboard.dossierNum", { id: activeDossier.id, defaultValue: `Dossier #${activeDossier.id}` })}
                </span>
                <span className={`text-xs px-2.5 py-1 rounded font-semibold border ${
                  activeDossier.plan_type === "PLAN_3"
                    ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                    : activeDossier.plan_type === "PLAN_2"
                    ? "bg-[#E8F0FE] text-[#005BBF] border-[#C1C6D6]"
                    : "bg-gray-100 text-gray-700 border-gray-300"
                }`}>
                  {activeDossier.plan_type === "PLAN_1"
                    ? t("clientDashboard.plan1Label", "Plan 1 : Fast-Track")
                    : activeDossier.plan_type === "PLAN_2"
                    ? t("clientDashboard.plan2Label", "Plan 2 : Accompagnement Expert")
                    : t("clientDashboard.plan3Label", "Plan 3 : Postulation Clé en Main")}
                </span>

                {activeDossier.plan_type !== "PLAN_3" && currentStatus !== "PLAN_SELECTION" && (
                  <button
                    type="button"
                    onClick={() => setShowUpgradeModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer shadow-2xs"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t("clientDashboard.upgradeBtn", "Changer de formule")}</span>
                  </button>
                )}
              </div>
              <div>{getStatusBadge(currentStatus)}</div>
            </div>

            {currentStatus !== "PLAN_SELECTION" && (
              <div className="border-b border-[#DADCE0] bg-white px-6 py-3">
                <div className="inline-flex bg-slate-100 p-1 rounded-lg gap-1 rtl:space-x-reverse border border-slate-200">
                  <button
                    onClick={() => setActiveTab("workspace")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold transition-all duration-150 outline-none ${
                      activeTab === "workspace"
                        ? "bg-white text-slate-900 shadow-2xs border border-slate-200"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                    }`}
                  >
                    <FileText className="w-4 h-4 text-slate-600" />
                    {t("clientDashboard.tabWorkspace", "Espace d'instruction")}
                  </button>
                  <button
                    onClick={() => setActiveTab("requests")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold transition-all duration-150 outline-none ${
                      activeTab === "requests"
                        ? "bg-white text-slate-900 shadow-2xs border border-slate-200"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                    }`}
                  >
                    <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    {t("clientDashboard.tabRequests", "Bordereau & Correspondance")}
                    {pendingRequestsCount > 0 && (
                      <span className="flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold text-white bg-slate-900 rounded-full">
                        {pendingRequestsCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Suivi officiel de la procédure de conventionnement (Exclusivité Plan 3) */}
            {activeDossier.plan_type === "PLAN_3" && currentStatus !== "PLAN_SELECTION" && (
              <div className="border-b border-[#DADCE0] bg-slate-50/70 p-5 sm:p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded bg-slate-900 text-white">
                      <Landmark className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {t("postulation.title", "Procédure de Conventionnement d'Investissement")}
                      </h3>
                      <p className="text-xs text-slate-600">
                        {t("postulation.subtitle", "Mandat de postulation officielle piloté par notre cabinet auprès des instances d'investissement.")}
                      </p>
                    </div>
                  </div>
                  {activeDossier.postulation_data?.reference && (
                    <span className="px-3 py-1 rounded bg-white border border-slate-300 text-slate-800 text-xs font-mono font-semibold shadow-2xs">
                      Réf. Démarche : {activeDossier.postulation_data.reference}
                    </span>
                  )}
                </div>

                {/* Frise des 5 étapes administratives */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-1">
                  {[
                    { step: 1, label: t("postulation.step1", "1. Constitution"), sub: "Audit technique" },
                    { step: 2, label: t("postulation.step2", "2. Dépôt officiel"), sub: "Plateforme CRI / État" },
                    { step: 3, label: t("postulation.step3", "3. Recevabilité"), sub: "Conformité légale" },
                    { step: 4, label: t("postulation.step4", "4. Commission"), sub: "Examen des primes" },
                    { step: 5, label: t("postulation.step5", "5. Décaissement"), sub: "Convention signée" },
                  ].map((item) => {
                    const currentStepNum = activeDossier.postulation_step || 1;
                    const isDone = item.step < currentStepNum;
                    const isCurrent = item.step === currentStepNum;

                    return (
                      <div
                        key={item.step}
                        className={`p-3 rounded-lg border transition-all text-left ${
                          isDone
                            ? "bg-emerald-50/70 border-emerald-300 text-emerald-950"
                            : isCurrent
                            ? "bg-white border-slate-900 shadow-xs ring-1 ring-slate-900 text-slate-900"
                            : "bg-white/60 border-slate-200 text-slate-400"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${
                            isDone ? "text-emerald-700" : isCurrent ? "text-slate-900 font-extrabold" : "text-slate-400"
                          }`}>
                            Étape {item.step}
                          </span>
                          {isDone ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : isCurrent ? (
                            <span className="w-2 h-2 rounded-full bg-slate-900" />
                          ) : null}
                        </div>
                        <div className="text-xs font-bold truncate">{item.label}</div>
                        <div className="text-[10px] text-slate-500 truncate">{item.sub}</div>
                      </div>
                    );
                  })}
                </div>

                {activeDossier.postulation_data?.lastNotes && (
                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-800 flex items-start gap-2 shadow-2xs">
                    <span className="font-semibold text-slate-900 shrink-0">Note de suivi :</span>
                    <span className="text-slate-700">« {activeDossier.postulation_data.lastNotes} »</span>
                  </div>
                )}
              </div>
            )}

            {currentStatus === "PLAN_SELECTION" ? (
              <PlanSelection dossierId={activeDossier.id} onPlanSelected={checkAuth} />
            ) : activeTab === "requests" ? (
              <RequestsView dossierId={activeDossier.id} planType={activeDossier.plan_type} />
            ) : currentStatus === "DELEGATED_TO_CONSULTANT" ? (
              <div className="p-8 md:p-12 text-center space-y-6">
                <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 border border-slate-300 text-slate-700 flex items-center justify-center">
                  <UserCheck className="w-7 h-7" />
                </div>

                <div className="max-w-xl mx-auto space-y-2">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-sky-50 text-sky-800 text-xs font-semibold border border-sky-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
                    {t("clientDashboard.delegated.badge", "Dossier confié au conseiller référent")}
                  </div>
                  <h2 className={`${font.display} text-xl md:text-2xl font-bold text-slate-900`}>
                    {t("clientDashboard.delegated.title", "Instruction prise en charge par votre conseiller")}
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {t("clientDashboard.delegated.description", "Le montage administratif et la saisie de vos données financières sont délégués à votre conseiller dédié. Il procède actuellement à l'audit de vos pièces réglementaires et à la structuration du programme d'investissement conformément à la Charte TPME.")}
                  </p>
                </div>

                <div className="max-w-md mx-auto bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-700 text-left rtl:text-right space-y-1">
                  <span className="font-semibold text-slate-900 block">Registre des transmissions :</span>
                  <span>Vous pouvez transmettre des pièces justificatives complémentaires ou communiquer à tout moment avec votre conseiller via l'onglet Bordereau & Correspondance.</span>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => setActiveTab("requests")}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                  >
                    <span>{t("clientDashboard.delegated.goToChat", "Accéder au bordereau d'échanges")}</span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </button>
                  <button
                    onClick={handleRefreshStatus}
                    disabled={isRefreshing}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                    <span>{t("clientDashboard.delegated.refresh", "Actualiser le statut")}</span>
                  </button>
                </div>
              </div>
            ) : currentStatus === "AWAITING_INPUTS" ? (
              <div className="p-4 sm:p-6 lg:p-8">
                <ClientStepper
                  dossierId={activeDossier.id}
                  onSubmitted={checkAuth}
                />
              </div>
            ) : currentStatus === "AI_DRAFTING" ? (
              <div className="p-8 md:p-12 text-center space-y-6">
                <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
                  <FileText className="w-7 h-7" />
                </div>

                <div className="max-w-xl mx-auto space-y-2">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-blue-50 text-blue-800 text-xs font-semibold border border-blue-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    {t("clientDashboard.aiDrafting.badge", "Instruction réglementaire & Modélisation financière")}
                  </div>
                  <h2 className={`${font.display} text-xl md:text-2xl font-bold text-slate-900`}>
                    {t("clientDashboard.aiDrafting.title", "Instruction technique et financière de votre dossier")}
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {t("clientDashboard.aiDrafting.description", "Nos analystes procèdent au contrôle de recevabilité des pièces justificatives, à la vérification de l'assiette CAPEX éligible et à la modélisation des projections financières selon les dispositions de la Charte de l'Investissement (Loi-cadre n° 03-22).")}
                  </p>
                </div>

                {/* Étapes d'instruction du dossier */}
                <div className="max-w-lg mx-auto bg-slate-50 p-5 rounded-lg border border-slate-200 space-y-3 text-left rtl:text-right shadow-2xs">
                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-800">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span>{t("clientDashboard.aiDrafting.step1", "1. Contrôle de recevabilité des pièces réglementaires (Liasse, RC, CNSS)")}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-semibold text-blue-800">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    </div>
                    <span>{t("clientDashboard.aiDrafting.step2", "2. Modélisation financière & calcul des primes d'investissement (Charte TPME)")}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-medium text-slate-400">
                    <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center shrink-0 text-[10px] font-bold">
                      3
                    </div>
                    <span>{t("clientDashboard.aiDrafting.step3", "3. Transmission du dossier au consultant senior pour visa de certification")}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={handleRefreshStatus}
                    disabled={isRefreshing}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-blue-600" : ""}`} />
                    <span>{isRefreshing ? t("clientDashboard.aiDrafting.refreshing", "Actualisation en cours...") : t("clientDashboard.aiDrafting.refreshBtn", "Actualiser le statut")}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  {t("clientDashboard.aiDrafting.note", "Cette phase d'instruction préliminaire est en cours de traitement. Vous recevrez une notification dès sa finalisation.")}
                </p>
              </div>
            ) : currentStatus === "CONSULTANT_REVIEW" ? (
              <div className="p-8 md:p-12 text-center space-y-6">
                <div className="w-14 h-14 mx-auto rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center">
                  <ShieldCheck className="w-7 h-7" />
                </div>

                <div className="max-w-xl mx-auto space-y-2">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-indigo-50 text-indigo-800 text-xs font-semibold border border-indigo-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                    {t("clientDashboard.consultantReview.badge", "Revue de conformité expert · Formule Accompagnée")}
                  </div>
                  <h2 className={`${font.display} text-xl md:text-2xl font-bold text-slate-900`}>
                    {t("clientDashboard.consultantReview.title", "Revue de conformité et validation finale par l'expert")}
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {t("clientDashboard.consultantReview.description", "Votre dossier a été instruit avec succès. Un consultant senior audite actuellement vos pièces justificatives, affine vos équilibres financiers et valide l'éligibilité de votre investissement.")}
                  </p>
                </div>

                {/* Encadré d'expertise */}
                <div className="max-w-lg mx-auto bg-white p-5 rounded-lg border border-slate-200 text-left rtl:text-right space-y-3 shadow-2xs">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5 mb-1">
                    <ShieldCheck className="w-4 h-4 text-indigo-700" />
                    <span>{t("clientDashboard.consultantReview.commitmentsTitle", "Périmètre de l'audit de conformité :")}</span>
                  </div>
                  <div className="space-y-2 text-xs text-slate-700">
                    <div className="flex items-start gap-2">
                      <span className="text-slate-900 font-bold">•</span>
                      <span>{t("clientDashboard.consultantReview.commitment1", "Vérification de la conformité juridique et de l'assiette CAPEX éligible.")}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-slate-900 font-bold">•</span>
                      <span>{t("clientDashboard.consultantReview.commitment2", "Optimisation du plan de financement (fonds propres, ratios bancaires, concours de crédit).")}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-slate-900 font-bold">•</span>
                      <span>{t("clientDashboard.consultantReview.commitment3", "Délivrance du rapport officiel certifié prêt pour soumission administrative et bancaire.")}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => setActiveTab("requests")}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-2xs transition-colors"
                  >
                    <span>{t("clientDashboard.consultantReview.consultRequestsBtn", "Consulter le bordereau & les échanges")}</span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </button>
                  <button
                    onClick={handleRefreshStatus}
                    disabled={isRefreshing}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                    <span>{t("clientDashboard.consultantReview.refreshBtn", "Actualiser le statut")}</span>
                  </button>
                </div>
              </div>
            ) : currentStatus === "GENERATION_FAILED" ? (
              isReediting ? (
                <div className="p-4 sm:p-6 lg:p-8 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-lg">
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
                <div className="p-8 md:p-12 text-center space-y-6">
                  <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center">
                    <AlertTriangle className="w-7 h-7" />
                  </div>

                  <div className="max-w-xl mx-auto space-y-2">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-amber-50 text-amber-900 text-xs font-semibold border border-amber-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-700"></span>
                      {t("clientDashboard.generationFailed.badge", "Vérification complémentaire requise")}
                    </div>
                    <h2 className={`${font.display} text-xl md:text-2xl font-bold text-slate-900`}>
                      {t("clientDashboard.generationFailed.title", "Vérification manuelle en cours par notre équipe")}
                    </h2>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      {t("clientDashboard.generationFailed.description", "Le traitement automatique a nécessité un contrôle complémentaire. Notre équipe technique et nos analystes ont été notifiés et finalisent manuellement votre dossier d'investissement.")}
                    </p>
                  </div>

                  <div className="max-w-md mx-auto bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-700 text-left rtl:text-right space-y-1">
                    <span className="font-semibold text-slate-900 block">{t("clientDashboard.generationFailed.safeDataNoteTitle", "Données sécurisées :")}</span>
                    <span>{t("clientDashboard.generationFailed.safeDataNote", "L'intégralité de vos pièces et éléments saisis est conservée. Aucune ressaisie n'est nécessaire.")}</span>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={handleRefreshStatus}
                      disabled={isRefreshing}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-2xs transition-colors"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                      <span>{isRefreshing ? t("clientDashboard.generationFailed.checking", "Vérification en cours...") : t("clientDashboard.generationFailed.checkProgressBtn", "Vérifier l'état d'avancement")}</span>
                    </button>
                    <button
                      onClick={() => setIsReediting(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{t("clientDashboard.generationFailed.reeditBtn", "Rééditer les données")}</span>
                    </button>
                  </div>
                </div>
              )
            ) : currentStatus === "DELIVERED" ? (
              <div className="p-8 md:p-12 text-center space-y-6">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>

                <div className="max-w-md mx-auto space-y-2">
                  <h2 className={`${font.display} text-xl md:text-2xl font-bold text-slate-900`}>
                    {t("clientDashboard.delivered.title", "Dossier d'investissement finalisé et délivré")}
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm">
                    {t("clientDashboard.delivered.description", "Votre rapport d'investissement et de demande de prime est certifié conforme aux critères de la Charte de l'Investissement.")}
                  </p>
                </div>

                {deliveredDoc ? (
                  <div className="max-w-lg mx-auto bg-white p-5 rounded-lg border border-slate-300 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 text-left rtl:text-right">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-slate-100 rounded border border-slate-200 text-slate-700">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{t("clientDashboard.delivered.reportTitle", "Rapport d'Investissement Final (PDF)")}</h4>
                        <p className="text-[11px] text-slate-500">
                          {deliveredDoc.original_name || t("clientDashboard.delivered.reportDesc", "Document certifié conforme Masubvention.ma")}
                        </p>
                      </div>
                    </div>

                    <a
                      href={getDocUrl(deliveredDoc.file_path)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded hover:bg-emerald-800 transition-colors shadow-2xs whitespace-nowrap"
                    >
                      <Download className="w-3.5 h-3.5" />
                      {t("clientDashboard.delivered.downloadPdf", "Télécharger le PDF")}
                    </a>
                  </div>
                ) : (
                  <div className="max-w-lg mx-auto bg-slate-50 p-5 rounded-lg border border-slate-200 text-center space-y-3">
                    <p className="text-xs text-slate-700">
                      {t("clientDashboard.delivered.refreshNotice", "Le statut de votre dossier est validé. Si le lien de téléchargement direct ne s'affiche pas immédiatement, veuillez actualiser la page.")}
                    </p>
                    <button
                      onClick={handleRefreshStatus}
                      className="px-4 py-2 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800"
                    >
                      {t("clientDashboard.delivered.refreshBtn", "Actualiser")}
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
            className="mt-4 px-6 py-2.5 bg-[#1A73E8] text-white text-sm font-bold rounded-lg hover:bg-[#174EA6] transition-colors cursor-pointer"
          >
            {t("clientDashboard.startFirstTest", "Nouveau test d'éligibilité")}
          </button>
        </div>
      )}
        </div>

        {/* Modal de changement de formule */}
{showUpgradeModal && activeDossier && createPortal(
  <div
    className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 p-4"
    onMouseDown={(e) => {
      if (e.target === e.currentTarget && !isUpgrading) setShowUpgradeModal(false);
    }}
  >
    <div
      role="dialog"
      aria-modal="true"
      className="w-full max-w-xl overflow-hidden rounded-md border border-slate-200 bg-white shadow-2xl"
    >
      {/* En-tête */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded border border-blue-100 bg-blue-50 text-blue-700">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              {t("clientDashboard.upgradeModalTitle", "Faire évoluer votre formule d'accompagnement")}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              {t("clientDashboard.upgradeModalSubtitle", "Sélectionnez une formule supérieure pour bénéficier d'un conseiller dédié, déléguer la constitution de vos pièces ou mandater le cabinet pour la postulation officielle.")}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowUpgradeModal(false)}
          disabled={isUpgrading}
          aria-label="Fermer"
          className="rounded p-1.5 text-base leading-none text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700 disabled:opacity-50 cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* Corps */}
      <div className="space-y-4 px-6 py-5">
        {activeDossier.plan_type === "PLAN_1" && (
          <div className="rounded-md border border-slate-200 bg-white p-5 transition-colors hover:border-blue-300">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-blue-700">
              Formule 2 · Accompagnement
            </span>
            <h4 className="mt-1 text-sm font-semibold text-slate-900">Montage & Conseil Expert</h4>
            <ul className="mt-3 space-y-1.5 text-[13px] text-slate-600">
              <li className="flex items-start gap-2"><span className="text-emerald-600">✓</span>Messagerie directe avec un conseiller</li>
              <li className="flex items-start gap-2"><span className="text-emerald-600">✓</span>Délégation intégrale de la saisie</li>
              <li className="flex items-start gap-2"><span className="text-emerald-600">✓</span>Modèle CPC certifié</li>
            </ul>
            <div className="mt-4 flex justify-end border-t border-slate-100 pt-4">
              <button
                onClick={() => handleUpgradePlan("PLAN_2")}
                disabled={isUpgrading}
                className="inline-flex items-center gap-2 rounded bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              >
                {isUpgrading ? "Traitement en cours..." : t("clientDashboard.choosePlan2", "Choisir la Formule 2")}
              </button>
            </div>
          </div>
        )}

        <div className="rounded-md border border-slate-200 bg-white p-5 transition-colors hover:border-blue-300">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-blue-700">
            Formule 3 · Mandat Intégral
          </span>
          <h4 className="mt-1 text-sm font-semibold text-slate-900">Postulation Clé en Main Cabinet</h4>
          <ul className="mt-3 space-y-1.5 text-[13px] text-slate-600">
            <li className="flex items-start gap-2"><span className="text-emerald-600">✓</span>Postulation officielle auprès de la CRI</li>
            <li className="flex items-start gap-2"><span className="text-emerald-600">✓</span>Pilotage complet de l'instruction du dossier</li>
            <li className="flex items-start gap-2"><span className="text-emerald-600">✓</span>Conseiller dédié jusqu'à la décision</li>
          </ul>
          <div className="mt-4 flex justify-end border-t border-slate-100 pt-4">
            <button
              onClick={() => handleUpgradePlan("PLAN_3")}
              disabled={isUpgrading}
              className="inline-flex items-center gap-2 rounded bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {isUpgrading ? "Traitement en cours..." : t("clientDashboard.choosePlan3", "Choisir la Formule 3")}
            </button>
          </div>
        </div>
      </div>

      {/* Pied */}
      <div className="flex items-center justify-between gap-4 border-t border-slate-200 bg-slate-50 px-6 py-3">
        <p className="text-xs text-slate-500">
          Le changement de formule est confirmé par le cabinet après validation.
        </p>
        <button
          type="button"
          onClick={() => setShowUpgradeModal(false)}
          disabled={isUpgrading}
          className="shrink-0 rounded border border-slate-300 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-50 cursor-pointer"
        >
          Annuler
        </button>
      </div>
    </div>
  </div>,
  document.body
)}
      </main>
    </div>
  );
};

export default ClientDashboard;