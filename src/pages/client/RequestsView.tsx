import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dossierService } from "../../services/dossierService";
import { parseApiError } from "../../utils/apiError";
import { useTranslation } from "react-i18next";
import {
  MessageSquare,
  Paperclip,
  Send,
  Lock,
  CheckCircle2,
  PlusCircle,
  Download,
  ChevronRight,
  ShieldCheck,
  FolderOpen,
  AlertTriangle,
} from "lucide-react";
import ConsultantRequestedFilesList from "../../components/client/ConsultantRequestedFilesList";

interface RequestMessage {
  id: number;
  sender_type: "CLIENT" | "CONSULTANT";
  message: string | null;
  attachment_url: string | null;
  createdAt: string;
}

interface DossierRequest {
  id: number;
  dossier_id: number;
  creator_type: "CLIENT" | "CONSULTANT";
  input_type: "FILE" | "TEXT";
  message: string;
  status: "PENDING" | "FULFILLED" | "RESOLVED";
  createdAt: string;
  messages: RequestMessage[];
  documentType?: {
    id: number;
    name: string;
  };
}

interface RequestsViewProps {
  dossierId: number;
  planType: string;
}

const font = {
  display: "font-['Plus_Jakarta_Sans',_sans-serif]",
  body: "font-['Roboto_Flex',_sans-serif]",
  mono: "font-['JetBrains_Mono',_monospace]",
};

const RequestsView: React.FC<RequestsViewProps> = ({ dossierId, planType }) => {
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [replyFile, setReplyFile] = useState<File | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<"conversation" | "documents">("documents");
  const [upgradeError, setUpgradeError] = useState<string | null>(null);
  const [isUpgradingPlan, setIsUpgradingPlan] = useState(false);



  // Fetch Requests
  const { data: requests = [], isLoading } = useQuery<DossierRequest[]>({
    queryKey: ["clientRequests", dossierId],
    queryFn: async () => {
      const res = await dossierService.getRequests(dossierId);
      return res.data;
    },
    enabled: !!dossierId,
  });

  const createRequestMutation = useMutation({
    mutationFn: async (message: string) => {
      return dossierService.createClientRequest(dossierId, message);
    },
    onSuccess: () => {
      setNewMessage("");
      setIsCreatingNew(false);
      queryClient.invalidateQueries({ queryKey: ["clientRequests", dossierId] });
    },
  });

  const replyMutation = useMutation({
    mutationFn: async ({ requestId, message, file }: { requestId: number; message: string; file: File | null }) => {
      return dossierService.replyToRequest(dossierId, requestId, message, file);
    },
    onSuccess: () => {
      setReplyMessage("");
      setReplyFile(null);
      queryClient.invalidateQueries({ queryKey: ["clientRequests", dossierId] });
    },
  });

  // Plan 1 Lock Screen (Seuls Plan 2 et Plan 3 ont accès au registre d'échanges)
  if (planType === "PLAN_1") {
    return (
      <div className={`p-6 md:p-10 text-center space-y-6 ${font.body}`} dir={isRTL ? "rtl" : "ltr"}>
        <div className="max-w-xl mx-auto bg-slate-50 p-1.5 rounded-lg border border-slate-200">
          <div className="bg-white rounded border border-slate-300 p-8 space-y-6 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200">
              <Lock className="w-6 h-6 text-slate-700" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200">
                {t("requests.lockBadge", "Exclusivité Formules Accompagnées (Formules 2 & 3)")}
              </span>
              <h2 className={`${font.display} text-xl md:text-2xl font-bold text-slate-900`}>
                {t("requests.lockTitle", "Bordereau & Correspondance Dédiée")}
              </h2>
              <p className="text-slate-600 text-xs md:text-sm max-w-md mx-auto leading-relaxed">
                {t("requests.lockDesc", "Le registre des transmissions directes et l'accompagnement personnalisé par un conseiller sont réservés aux dossiers souscrits à la Formule 2 (Accompagnement) ou Formule 3 (Mandat Clé en Main).")}
              </p>
            </div>

            {upgradeError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs font-medium flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{upgradeError}</span>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                disabled={isUpgradingPlan}
                onClick={async () => {
                  setIsUpgradingPlan(true);
                  setUpgradeError(null);
                  try {
                    await dossierService.upgradePlan(dossierId, "PLAN_2");
                    queryClient.invalidateQueries({ queryKey: ["clientDossiers"] });
                    window.location.reload();
                  } catch (e: any) {
                    const parsed = parseApiError(e, "Erreur lors de l'upgrade");
                    setUpgradeError(parsed.message);
                  } finally {
                    setIsUpgradingPlan(false);
                  }
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold rounded shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t("requests.activatePlan2", "Choisir la Formule 2 (Accompagnement)")}</span>
                <ChevronRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
              </button>

              <button
                disabled={isUpgradingPlan}
                onClick={async () => {
                  setIsUpgradingPlan(true);
                  setUpgradeError(null);
                  try {
                    await dossierService.upgradePlan(dossierId, "PLAN_3");
                    queryClient.invalidateQueries({ queryKey: ["clientDossiers"] });
                    window.location.reload();
                  } catch (e: any) {
                    const parsed = parseApiError(e, "Erreur lors de l'upgrade");
                    setUpgradeError(parsed.message);
                  } finally {
                    setIsUpgradingPlan(false);
                  }
                }}
                className="w-full sm:w-auto px-5 py-2.5 border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 text-slate-800 text-xs font-semibold rounded shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t("requests.activatePlan3", "Choisir la Formule 3 (Mandat Clé en Main)")}</span>
                <ChevronRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`p-12 text-center text-[#727785] space-y-3 ${font.body}`} dir={isRTL ? "rtl" : "ltr"}>
        <div className="w-8 h-8 border-3 border-[#1A73E8] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-medium">{t("requests.loadingRegister", "Accès au registre officiel des échanges...")}</p>
      </div>
    );
  }

  const pendingFilesCount = requests.filter(r => r.input_type === "FILE" && r.status === "PENDING").length;
  const pendingMessagesCount = requests.filter(r => (r.input_type === "TEXT" || r.creator_type === "CLIENT") && r.status === "PENDING").length;
  const conversationRequests = requests.filter(r => r.input_type === "TEXT" || r.creator_type === "CLIENT");

  const selectedRequest = conversationRequests.find((r) => r.id === selectedRequestId);

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      createRequestMutation.mutate(newMessage);
    }
  };

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRequestId && (replyMessage.trim() || replyFile)) {
      replyMutation.mutate({ requestId: selectedRequestId, message: replyMessage, file: replyFile });
    }
  };

  return (
    <div className={`flex flex-col h-[700px] bg-[#F8F9FA] border-t border-[#DADCE0] ${font.body}`} dir={isRTL ? "rtl" : "ltr"}>

      {/* SUB-NAVBAR */}
      <div className="flex items-center gap-2 px-6 py-3 border-b border-[#DADCE0] bg-white shrink-0">
        <button
          onClick={() => setActiveSubTab("documents")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded transition-colors cursor-pointer ${activeSubTab === "documents"
            ? "bg-slate-900 text-white"
            : "text-slate-600 hover:bg-slate-100"
            }`}
        >
          <FolderOpen className="w-4 h-4" />
          {t("requests.tabDocuments", "Pièces Justificatives Demandées")}
          {pendingFilesCount > 0 && (
            <span className={`flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold rounded-full ${activeSubTab === "documents" ? "bg-white text-slate-900" : "bg-red-600 text-white"}`}>
              {pendingFilesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab("conversation")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded transition-colors cursor-pointer ${activeSubTab === "conversation"
            ? "bg-slate-900 text-white"
            : "text-slate-600 hover:bg-slate-100"
            }`}
        >
          <MessageSquare className="w-4 h-4" />
          {t("requests.tabConversation", "Messagerie & Échanges")}
          {pendingMessagesCount > 0 && (
            <span className={`flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold rounded-full ${activeSubTab === "conversation" ? "bg-white text-slate-900" : "bg-blue-600 text-white"}`}>
              {pendingMessagesCount}
            </span>
          )}
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {activeSubTab === "documents" ? (
          <ConsultantRequestedFilesList dossierId={dossierId} requests={requests.filter(r => r.input_type === "FILE")} />
        ) : (
          <>
            {/* LEFT SIDEBAR: FILS DE DISCUSSION */}
            <div className="w-full md:w-80 border-r rtl:border-r-0 rtl:border-l border-[#DADCE0] flex flex-col bg-white shrink-0">

              {/* Header Registre */}
              <div className="p-4 border-b border-[#DADCE0] bg-[#F8F9FA] flex items-center justify-between">
                <div>
                  <h3 className={`${font.display} font-bold text-[#191C1D] text-xs uppercase tracking-wider flex items-center gap-2`}>
                    <MessageSquare className="w-4 h-4 text-[#1A73E8]" />
                    {t("requests.conversationTitle", "Fils de discussion")}
                  </h3>
                  <p className="text-[11px] text-[#5F6368] mt-0.5">
                    {t("requests.officialDossier", { id: dossierId, defaultValue: `Dossier Officiel #${dossierId}` })}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedRequestId(null);
                    setIsCreatingNew(true);
                  }}
                  className="p-1.5 bg-[#E8F0FE] hover:bg-[#D2E3FC] text-[#1A73E8] rounded border border-[#C1C6D6] transition-colors flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                  title={t("requests.newRequestBtn", "Nouvelle")}
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>{t("requests.newRequestBtn", "Nouvelle")}</span>
                </button>
              </div>

              {/* List of Requests */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1.5 bg-white">
                {conversationRequests.length === 0 ? (
                  <div className="p-6 text-center text-[#727785] text-xs leading-relaxed space-y-2">
                    <MessageSquare className="w-8 h-8 text-[#C1C6D6] mx-auto" />
                    <p className="font-semibold text-[#191C1D]">{t("requests.noTransmissions", "Aucun échange écrit")}</p>
                    <p className="text-[11px]">{t("requests.noTransmissionsDesc", "Utilisez le bouton 'Nouvelle' pour adresser une question à votre consultant référent.")}</p>
                  </div>
                ) : (
                  conversationRequests.map((req) => {
                    const isSelected = selectedRequestId === req.id && !isCreatingNew;
                    return (
                      <button
                        key={req.id}
                        onClick={() => {
                          setSelectedRequestId(req.id);
                          setIsCreatingNew(false);
                        }}
                        className={`w-full text-left rtl:text-right p-3 rounded border transition-all duration-150 cursor-pointer ${isSelected
                          ? "bg-[#E8F0FE] border-[#1A73E8] shadow-xs"
                          : "bg-[#F8F9FA] border-[#DADCE0] hover:bg-[#F3F4F5] hover:border-[#C1C6D6]"
                          }`}
                      >
                        <div className="flex items-center justify-between mb-1.5 gap-2">
                          <span className="text-[11px] font-bold text-[#191C1D] flex items-center gap-1.5">
                            <MessageSquare className="w-3 h-3 text-[#5F6368]" />
                            <span>Ref #{req.id}</span>
                          </span>
                          <span className={`${font.mono} text-[10px] text-[#727785]`}>
                            {new Date(req.createdAt).toLocaleDateString(isRTL ? "ar-MA" : "fr-FR")}
                          </span>
                        </div>

                        <p className="text-xs text-[#414754] font-medium truncate mb-2">
                          {req.message}
                        </p>

                        <div className="flex items-center justify-between gap-2 border-t border-[#DADCE0]/50 pt-1.5">
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${req.status === "PENDING"
                              ? "bg-[#FFDBCB] text-[#783100]"
                              : req.status === "RESOLVED"
                                ? "bg-[#E6F4EA] text-[#1E8E3E]"
                                : "bg-[#E8F0FE] text-[#005BBF]"
                              }`}
                          >
                            {req.status === "PENDING"
                              ? t("requests.pending", "En attente")
                              : req.status === "RESOLVED"
                                ? t("requests.resolved", "Clôturé")
                                : t("requests.provided", "Répondu")}
                          </span>

                          <span className="text-[10px] text-[#5F6368] font-medium">
                            {req.creator_type === "CONSULTANT" ? t("requests.consultant", "Consultant") : t("requests.you", "Vous")}
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Sidebar Footer */}
              <div className="p-3 border-t border-[#DADCE0] bg-[#F8F9FA] text-[10px] text-[#727785] flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1E8E3E]" />
                  {t("requests.secureTransmission", "Canal confidentiel")}
                </span>
                <span className={`${font.mono} font-semibold`}>
                  {conversationRequests.length} échange(s)
                </span>
              </div>
            </div>

            {/* RIGHT MAIN PANEL: FICHE D'ÉCHANGE */}
            <div className="w-full md:flex-1 flex flex-col bg-[#F8F9FA] overflow-hidden">

              {isCreatingNew ? (
                /* FORMULAIRE NOUVEL ÉCHANGE */
                <div className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto">
                  <div className="bg-white p-6 rounded border border-[#DADCE0] space-y-4">
                    <div className="border-b border-[#DADCE0] pb-4 flex items-center justify-between">
                      <div>
                        <h4 className={`${font.display} text-base font-bold text-[#191C1D] flex items-center gap-2`}>
                          <PlusCircle className="w-4 h-4 text-[#1A73E8]" />
                          {t("requests.newTransmissionTitle", "Poser une question au Consultant Référent")}
                        </h4>
                        <p className="text-xs text-[#5F6368] mt-1">
                          {t("requests.newTransmissionDesc", "Formulez une question technique, administrative ou financière concernant l'élaboration de votre dossier.")}
                        </p>
                      </div>
                      <button
                        onClick={() => setIsCreatingNew(false)}
                        className="text-xs text-[#5F6368] hover:text-[#191C1D] underline cursor-pointer"
                      >
                        {t("requests.cancel", "Annuler")}
                      </button>
                    </div>

                    <form onSubmit={handleCreateRequest} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#191C1D] mb-1.5">
                          {t("requests.subjectLabel", "Objet & Explication détaillée de votre question")}
                        </label>
                        <textarea
                          className="w-full p-3.5 bg-white border border-[#DADCE0] rounded text-xs text-[#191C1D] placeholder-[#727785] focus:outline-none focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] leading-relaxed resize-none"
                          rows={6}
                          placeholder={t("requests.placeholder", "Précisez votre demande ou question à l'attention du consultant...")}
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsCreatingNew(false)}
                          className="px-4 py-2 bg-white border border-[#DADCE0] hover:bg-[#F3F4F5] text-[#414754] text-xs font-medium rounded transition-colors cursor-pointer"
                        >
                          {t("requests.cancel", "Annuler")}
                        </button>
                        <button
                          type="submit"
                          disabled={!newMessage.trim() || createRequestMutation.isPending}
                          className="px-6 py-2 bg-[#1A73E8] hover:bg-[#174EA6] text-white text-xs font-bold rounded transition-colors disabled:opacity-40 flex items-center gap-2 shadow-xs cursor-pointer"
                        >
                          {createRequestMutation.isPending ? (
                            <span>{t("requests.sending", "Envoi...")}</span>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              <span>{t("requests.submitBtn", "Envoyer le message")}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : selectedRequest ? (
                /* CONSULTATION DU FIL D'ÉCHANGE */
                <div className="flex-1 flex flex-col h-full overflow-hidden">

                  {/* Header de la discussion */}
                  <div className="p-4 md:p-5 border-b border-[#DADCE0] bg-white flex flex-wrap items-center justify-between gap-4 shrink-0">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 rtl:space-x-reverse">
                        <span className={`${font.mono} text-xs font-bold text-[#1A73E8] uppercase tracking-wider`}>
                          {t("requests.recordNum", { id: selectedRequest.id, defaultValue: `Discussion #${selectedRequest.id}` })}
                        </span>
                        <span className="text-[#C1C6D6]">•</span>
                        <span className="text-xs text-[#5F6368]">
                          {t("requests.createdOn", { date: new Date(selectedRequest.createdAt).toLocaleString(isRTL ? "ar-MA" : "fr-FR"), defaultValue: `Créé le ${new Date(selectedRequest.createdAt).toLocaleString()}` })}
                        </span>
                      </div>
                      <h4 className={`${font.display} font-bold text-[#191C1D] text-sm md:text-base`}>
                        {selectedRequest.message}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider border ${selectedRequest.status === "PENDING"
                          ? "bg-[#FFDBCB] text-[#783100] border-[#FFB59D]"
                          : selectedRequest.status === "RESOLVED"
                            ? "bg-[#E6F4EA] text-[#1E8E3E] border-[#A8DAB5]"
                            : "bg-[#E8F0FE] text-[#005BBF] border-[#C1C6D6]"
                          }`}
                      >
                        {selectedRequest.status === "PENDING"
                          ? t("requests.pending", "En cours")
                          : selectedRequest.status === "RESOLVED"
                            ? t("requests.resolved", "Clôturé")
                            : t("requests.provided", "Répondu")}
                      </span>
                    </div>
                  </div>

                  {/* Fil des messages (Chronologique) */}
                  <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-[#F8F9FA]">
                    {/* Message Initial */}
                    <div className="bg-white rounded border border-[#DADCE0] p-4 space-y-3">
                      <div className="flex items-center justify-between border-b border-[#DADCE0]/60 pb-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-[#E8F0FE] text-[#1A73E8] flex items-center justify-center text-xs font-bold">
                            {selectedRequest.creator_type === "CONSULTANT" ? "E" : "C"}
                          </div>
                          <span className="text-xs font-bold text-[#191C1D]">
                            {selectedRequest.creator_type === "CONSULTANT"
                              ? t("requests.consultant", "Message de l'Expert Consultant")
                              : t("requests.you", "Votre message initial")}
                          </span>
                        </div>
                        <span className={`${font.mono} text-[11px] text-[#727785]`}>
                          {new Date(selectedRequest.createdAt).toLocaleTimeString(isRTL ? "ar-MA" : "fr-FR", { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="text-xs md:text-sm text-[#191C1D] leading-relaxed whitespace-pre-wrap">
                        {selectedRequest.message}
                      </div>
                    </div>

                    {/* Thread de réponses */}
                    {selectedRequest.messages?.map((msg, index) => {
                      const isClient = msg.sender_type === "CLIENT";
                      return (
                        <div
                          key={msg.id}
                          className={`bg-white rounded border ${isClient ? "border-[#C1C6D6]" : "border-[#1A73E8]/30 shadow-2xs"
                            } p-4 space-y-3`}
                        >
                          <div className="flex items-center justify-between border-b border-[#DADCE0]/60 pb-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${isClient
                                  ? "bg-[#EDEEEF] text-[#414754]"
                                  : "bg-[#E8F0FE] text-[#005BBF]"
                                  }`}
                              >
                                {isClient ? t("requests.you", "Vous") : t("requests.consultant", "Expert Consultant")}
                              </span>
                              <span className="text-[#727785]">•</span>
                              <span className={`${font.mono} text-[11px] text-[#727785]`}>
                                #{index + 1}
                              </span>
                            </div>

                            <span className={`${font.mono} text-[11px] text-[#727785]`}>
                              {new Date(msg.createdAt).toLocaleString(isRTL ? "ar-MA" : "fr-FR", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>

                          {msg.message && (
                            <p className="text-xs md:text-sm text-[#191C1D] leading-relaxed whitespace-pre-wrap">
                              {msg.message}
                            </p>
                          )}

                          {msg.attachment_url && (
                            <div className="pt-2">
                              <a
                                href={`${import.meta.env.VITE_PREFIX_URL || "/uploads"}/dossiers/${dossierId}/${msg.attachment_url}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 p-2.5 bg-[#F8F9FA] hover:bg-[#F3F4F5] border border-[#DADCE0] rounded text-xs font-semibold text-[#1A73E8] transition-colors"
                              >
                                <Paperclip className="w-4 h-4 text-[#1A73E8]" />
                                <span>{t("requests.viewAttachment", { file: msg.attachment_url.split("/").pop(), defaultValue: `Consulter la pièce transmise (${msg.attachment_url.split("/").pop()})` })}</span>
                                <Download className="w-3.5 h-3.5 text-[#5F6368] ml-2 rtl:mr-2 rtl:ml-0" />
                              </a>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Formulaire de réponse textuelle */}
                  {selectedRequest.status !== "RESOLVED" ? (
                    <div className="p-4 bg-white border-t border-[#DADCE0] shrink-0">
                      <form onSubmit={handleReply} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-[#191C1D] uppercase tracking-wider flex items-center gap-1.5">
                            <Send className="w-3.5 h-3.5 text-[#1A73E8]" />
                            {t("requests.replyLabel", "Formuler une réponse")}
                          </label>
                        </div>

                        <textarea
                          className="w-full p-3 bg-white border border-[#DADCE0] rounded text-xs sm:text-sm text-[#191C1D] placeholder-[#727785] focus:outline-none focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] resize-none leading-relaxed"
                          rows={3}
                          placeholder={t("requests.replyPlaceholder", "Saisissez votre réponse ou précision...")}
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                        />

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                          <div className="flex items-center gap-2">
                            <label className="text-xs font-semibold text-[#414754] whitespace-nowrap">
                              {t("requests.attachFileOptional", "Joindre une pièce justificative (optionnel) :")}
                            </label>
                            <input
                              type="file"
                              onChange={(e) => setReplyFile(e.target.files?.[0] || null)}
                              className="text-xs text-[#5F6368] file:mr-3 file:py-1 file:px-3 file:rounded file:border file:border-[#DADCE0] file:text-xs file:font-semibold file:bg-[#F8F9FA] file:text-[#191C1D] hover:file:bg-[#EDEEEF] cursor-pointer"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={replyMutation.isPending || (!replyMessage.trim() && !replyFile)}
                            className="px-6 py-2.5 bg-[#1A73E8] hover:bg-[#174EA6] text-white text-xs font-bold rounded transition-colors disabled:opacity-40 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                          >
                            {replyMutation.isPending ? (
                              <span>{t("requests.sending", "Envoi...")}</span>
                            ) : (
                              <>
                                <span>{t("requests.send", "Envoyer la réponse")}</span>
                                <Send className="w-3.5 h-3.5" />
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="p-4 bg-[#E6F4EA] border-t border-[#DADCE0] text-center text-xs font-bold text-[#1E8E3E] flex items-center justify-center gap-2 shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-[#1E8E3E]" />
                      {t("requests.closedNotice", "Cet échange a été clôturé.")}
                    </div>
                  )}
                </div>
              ) : (
                /* AUCUN ÉCHANGE SÉLECTIONNÉ */
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#727785] space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#EDEEEF] flex items-center justify-center text-[#5F6368]">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h4 className={`${font.display} text-base font-bold text-[#191C1D]`}>
                    {t("requests.selectConversation", "Sélectionnez un échange")}
                  </h4>
                  <p className="text-xs max-w-sm text-[#5F6368]">
                    {t("requests.selectConversationDesc", "Choisissez un fil de discussion dans la liste de gauche ou cliquez sur 'Nouvelle' pour initier un échange avec votre consultant référent.")}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RequestsView;
