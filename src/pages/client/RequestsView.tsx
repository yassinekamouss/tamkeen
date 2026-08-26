import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dossierService } from "../../services/dossierService";
import { useTranslation } from "react-i18next";
import {
  FileText,
  MessageSquare,
  Paperclip,
  Send,
  Lock,
  CheckCircle2,
  PlusCircle,
  FileCheck,
  Download,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

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
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [replyFile, setReplyFile] = useState<File | null>(null);

  // Plan 1 Lock Screen
  if (planType !== "PLAN_2") {
    return (
      <div className={`p-6 md:p-10 text-center space-y-6 ${font.body}`} dir={isRTL ? "rtl" : "ltr"}>
        <div className="max-w-xl mx-auto bg-[#F8F9FA] p-1.5 rounded-lg border border-[#DADCE0]">
          <div className="bg-white rounded border border-[#DADCE0] p-8 space-y-6 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#E8F0FE] text-[#1A73E8] flex items-center justify-center border border-[#C1C6D6]">
              <Lock className="w-6 h-6 text-[#1A73E8]" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0FE] text-[#005BBF] text-[11px] font-bold uppercase tracking-wider border border-[#C1C6D6]">
                Exclusivité Plan 2 (Accompagnement Expert)
              </span>
              <h2 className={`${font.display} text-xl md:text-2xl font-bold text-[#191C1D]`}>
                Portail des Échanges Administratifs
              </h2>
              <p className="text-[#5F6368] text-xs md:text-sm max-w-md mx-auto leading-relaxed">
                Le registre de correspondance directe et le suivi d'instructions personnalisées avec un consultant expert sont réservés aux dossiers souscrits au Plan 2.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={async () => {
                  await dossierService.selectPlan(dossierId, "PLAN_2");
                  queryClient.invalidateQueries({ queryKey: ["clientDossiers"] });
                  window.location.reload();
                }}
                className="px-6 py-3 bg-[#1A73E8] hover:bg-[#174EA6] text-white text-xs font-bold rounded shadow-[0_4px_14px_rgba(26,115,232,0.12)] transition-all flex items-center justify-center gap-2 mx-auto"
              >
                <span>Activer l'Accompagnement Consultant (Plan 2)</span>
                <ChevronRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

  if (isLoading) {
    return (
      <div className={`p-12 text-center text-[#727785] space-y-3 ${font.body}`}>
        <div className="w-8 h-8 border-3 border-[#1A73E8] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-medium">Accès au registre officiel des échanges...</p>
      </div>
    );
  }

  const selectedRequest = requests.find((r) => r.id === selectedRequestId);

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
    <div className={`flex flex-col md:flex-row h-[660px] bg-[#F8F9FA] border-t border-[#DADCE0] ${font.body}`} dir={isRTL ? "rtl" : "ltr"}>
      
      {/* LEFT SIDEBAR: REGISTRE DES TRANSMISSIONS */}
      <div className="w-full md:w-80 border-r rtl:border-r-0 rtl:border-l border-[#DADCE0] flex flex-col bg-white">
        
        {/* Header Registre */}
        <div className="p-4 border-b border-[#DADCE0] bg-[#F8F9FA] flex items-center justify-between">
          <div>
            <h3 className={`${font.display} font-bold text-[#191C1D] text-xs uppercase tracking-wider flex items-center gap-2`}>
              <FileCheck className="w-4 h-4 text-[#1A73E8]" />
              Bordereau d'échanges
            </h3>
            <p className="text-[11px] text-[#5F6368] mt-0.5">
              Dossier Officiel #{dossierId}
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedRequestId(null);
              setIsCreatingNew(true);
            }}
            className="p-1.5 bg-[#E8F0FE] hover:bg-[#D2E3FC] text-[#1A73E8] rounded border border-[#C1C6D6] transition-colors flex items-center gap-1 text-[11px] font-semibold"
            title="Nouvelle sollicitation"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Nouvelle</span>
          </button>
        </div>

        {/* List of Requests */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5 bg-white">
          {requests.length === 0 ? (
            <div className="p-6 text-center text-[#727785] text-xs leading-relaxed space-y-2">
              <ShieldCheck className="w-8 h-8 text-[#C1C6D6] mx-auto" />
              <p className="font-semibold text-[#191C1D]">Aucune transmission en cours</p>
              <p className="text-[11px]">Utilisez le bouton "Nouvelle" pour adresser une demande officielle à votre consultant référent.</p>
            </div>
          ) : (
            requests.map((req) => {
              const isSelected = selectedRequestId === req.id && !isCreatingNew;
              return (
                <button
                  key={req.id}
                  onClick={() => {
                    setSelectedRequestId(req.id);
                    setIsCreatingNew(false);
                  }}
                  className={`w-full text-left rtl:text-right p-3 rounded border transition-all duration-150 ${
                    isSelected
                      ? "bg-[#E8F0FE] border-[#1A73E8] shadow-xs"
                      : "bg-[#F8F9FA] border-[#DADCE0] hover:bg-[#F3F4F5] hover:border-[#C1C6D6]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 gap-2">
                    <span className="text-[11px] font-bold text-[#191C1D] flex items-center gap-1.5">
                      {req.input_type === "FILE" ? (
                        <Paperclip className="w-3 h-3 text-[#1A73E8]" />
                      ) : (
                        <MessageSquare className="w-3 h-3 text-[#5F6368]" />
                      )}
                      <span>Ref #{req.id}</span>
                    </span>
                    <span className={`${font.mono} text-[10px] text-[#727785]`}>
                      {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-[#414754] font-medium truncate mb-2">
                    {req.message}
                  </p>

                  <div className="flex items-center justify-between gap-2 border-t border-[#DADCE0]/50 pt-1.5">
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                        req.status === "PENDING"
                          ? "bg-[#FFDBCB] text-[#783100]"
                          : req.status === "RESOLVED"
                          ? "bg-[#E6F4EA] text-[#1E8E3E]"
                          : "bg-[#E8F0FE] text-[#005BBF]"
                      }`}
                    >
                      {req.status === "PENDING"
                        ? "En cours d'instruction"
                        : req.status === "RESOLVED"
                        ? "Transmis & Traité"
                        : "Réponse enregistrée"}
                    </span>

                    <span className="text-[10px] text-[#5F6368] font-medium">
                      {req.creator_type === "CONSULTANT" ? "Consultant" : "Client"}
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
            Transmission sécurisée
          </span>
          <span className={`${font.mono} font-semibold`}>
            {requests.length} enregistrement(s)
          </span>
        </div>
      </div>

      {/* RIGHT MAIN PANEL: FICHE D'INSTRUCTION ET JOURNAL D'ÉCHANGE */}
      <div className="w-full md:flex-1 flex flex-col bg-[#F8F9FA] overflow-hidden">
        
        {isCreatingNew ? (
          /* FORMULAIRE NOUVELLE TRANSMISSION */
          <div className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto">
            <div className="bg-white p-6 rounded border border-[#DADCE0] space-y-4">
              <div className="border-b border-[#DADCE0] pb-4 flex items-center justify-between">
                <div>
                  <h4 className={`${font.display} text-base font-bold text-[#191C1D] flex items-center gap-2`}>
                    <PlusCircle className="w-4 h-4 text-[#1A73E8]" />
                    Transmettre une sollicitation au Consultant Référent
                  </h4>
                  <p className="text-xs text-[#5F6368] mt-1">
                    Formulez une question technique, administrative ou financière concernant l'élaboration de votre dossier.
                  </p>
                </div>
                <button
                  onClick={() => setIsCreatingNew(false)}
                  className="text-xs text-[#5F6368] hover:text-[#191C1D] underline"
                >
                  Annuler
                </button>
              </div>

              <form onSubmit={handleCreateRequest} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#191C1D] mb-1.5">
                    Objet & Explication détaillée de votre demande
                  </label>
                  <textarea
                    className="w-full p-3.5 bg-white border border-[#DADCE0] rounded text-xs text-[#191C1D] placeholder-[#727785] focus:outline-none focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] leading-relaxed resize-none"
                    rows={6}
                    placeholder="Précisez l'élément ou le document sur lequel vous désirez l'avis de l'expert..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingNew(false)}
                    className="px-4 py-2 bg-white border border-[#DADCE0] hover:bg-[#F3F4F5] text-[#414754] text-xs font-medium rounded transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || createRequestMutation.isPending}
                    className="px-6 py-2 bg-[#1A73E8] hover:bg-[#174EA6] text-white text-xs font-bold rounded transition-colors disabled:opacity-40 flex items-center gap-2 shadow-xs"
                  >
                    {createRequestMutation.isPending ? (
                      <span>Transmission...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Consigner et Transmettre</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : selectedRequest ? (
          /* CONSULTATION DU PROCÈS-VERBAL / JOURNAL D'ÉCHANGE */
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            
            {/* Header de la fiche */}
            <div className="p-4 md:p-5 border-b border-[#DADCE0] bg-white flex flex-wrap items-center justify-between gap-4 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2 rtl:space-x-reverse">
                  <span className={`${font.mono} text-xs font-bold text-[#1A73E8] uppercase tracking-wider`}>
                    Fiche d'Échange #00{selectedRequest.id}
                  </span>
                  <span className="text-[#C1C6D6]">•</span>
                  <span className="text-xs text-[#5F6368]">
                    Créé le {new Date(selectedRequest.createdAt).toLocaleString()}
                  </span>
                </div>
                <h4 className={`${font.display} font-bold text-[#191C1D] text-sm md:text-base`}>
                  {selectedRequest.message}
                </h4>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider border ${
                    selectedRequest.status === "PENDING"
                      ? "bg-[#FFDBCB] text-[#783100] border-[#FFB59D]"
                      : selectedRequest.status === "RESOLVED"
                      ? "bg-[#E6F4EA] text-[#1E8E3E] border-[#A8DAB5]"
                      : "bg-[#E8F0FE] text-[#005BBF] border-[#C1C6D6]"
                  }`}
                >
                  {selectedRequest.status === "PENDING"
                    ? "En traitement"
                    : selectedRequest.status === "RESOLVED"
                    ? "Statut : Clôturé"
                    : "En attente de retour"}
                </span>
              </div>
            </div>

            {/* Journal des transmissions (Chronologique) */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-[#F8F9FA]">
              
              {/* Message Initial de la requête */}
              <div className="bg-white rounded border border-[#DADCE0] p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[#DADCE0]/60 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-[#E8F0FE] text-[#1A73E8] flex items-center justify-center text-xs font-bold">
                      {selectedRequest.creator_type === "CONSULTANT" ? "E" : "C"}
                    </div>
                    <span className="text-xs font-bold text-[#191C1D]">
                      {selectedRequest.creator_type === "CONSULTANT"
                        ? "Demande officielle de l'Expert Consultant"
                        : "Demande formulée par vous-même"}
                    </span>
                  </div>
                  <span className={`${font.mono} text-[11px] text-[#727785]`}>
                    {new Date(selectedRequest.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="text-xs md:text-sm text-[#191C1D] leading-relaxed whitespace-pre-wrap">
                  {selectedRequest.message}
                </div>

                {selectedRequest.input_type === "FILE" && (
                  <div className="p-2.5 bg-[#EDEEEF]/50 rounded border border-[#DADCE0] flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#414754] flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#1A73E8]" />
                      Pièce attendue : Justificatif ou document numérisé
                    </span>
                    <span className="text-[10px] bg-[#E8F0FE] text-[#005BBF] px-2 py-0.5 rounded font-bold uppercase">
                      Requis
                    </span>
                  </div>
                )}
              </div>

              {/* Thread de messages sous forme de Procès-Verbal */}
              {selectedRequest.messages.map((msg, index) => {
                const isClient = msg.sender_type === "CLIENT";
                return (
                  <div
                    key={msg.id}
                    className={`bg-white rounded border ${
                      isClient ? "border-[#C1C6D6]" : "border-[#1A73E8]/30 shadow-2xs"
                    } p-4 space-y-3`}
                  >
                    <div className="flex items-center justify-between border-b border-[#DADCE0]/60 pb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            isClient
                              ? "bg-[#EDEEEF] text-[#414754]"
                              : "bg-[#E8F0FE] text-[#005BBF]"
                          }`}
                        >
                          {isClient ? "Société Client" : "Expert Consultant Masubvention"}
                        </span>
                        <span className="text-[#727785]">•</span>
                        <span className={`${font.mono} text-[11px] text-[#727785]`}>
                          Transmission #{index + 1}
                        </span>
                      </div>

                      <span className={`${font.mono} text-[11px] text-[#727785]`}>
                        {new Date(msg.createdAt).toLocaleString([], {
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
                          href={msg.attachment_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 p-2.5 bg-[#F8F9FA] hover:bg-[#F3F4F5] border border-[#DADCE0] rounded text-xs font-semibold text-[#1A73E8] transition-colors"
                        >
                          <Paperclip className="w-4 h-4 text-[#1A73E8]" />
                          <span>Consulter la pièce transmise ({msg.attachment_url.split("/").pop()})</span>
                          <Download className="w-3.5 h-3.5 text-[#5F6368] ml-2 rtl:mr-2 rtl:ml-0" />
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Zone d'envoi et dépôt institutionnel */}
            {selectedRequest.status !== "RESOLVED" ? (
              <div className="p-4 bg-white border-t border-[#DADCE0] shrink-0">
                <form onSubmit={handleReply} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#191C1D] uppercase tracking-wider flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5 text-[#1A73E8]" />
                      Formuler une réponse ou joindre une pièce
                    </label>
                  </div>

                  <textarea
                    className="w-full p-3 bg-white border border-[#DADCE0] rounded text-xs sm:text-sm text-[#191C1D] placeholder-[#727785] focus:outline-none focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] resize-none leading-relaxed"
                    rows={2}
                    placeholder="Saisissez votre note explicative ou votre réponse officielle..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                  />

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                    {selectedRequest.input_type === "FILE" || selectedRequest.creator_type === "CONSULTANT" ? (
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-[#414754] whitespace-nowrap">
                          Joindre un fichier :
                        </label>
                        <input
                          type="file"
                          onChange={(e) => setReplyFile(e.target.files?.[0] || null)}
                          className="text-xs text-[#5F6368] file:mr-3 file:py-1 file:px-3 file:rounded file:border file:border-[#DADCE0] file:text-xs file:font-semibold file:bg-[#F8F9FA] file:text-[#191C1D] hover:file:bg-[#EDEEEF] cursor-pointer"
                        />
                      </div>
                    ) : (
                      <div />
                    )}

                    <button
                      type="submit"
                      disabled={replyMutation.isPending || (!replyMessage.trim() && !replyFile)}
                      className="px-6 py-2.5 bg-[#1A73E8] hover:bg-[#174EA6] text-white text-xs font-bold rounded transition-colors disabled:opacity-40 flex items-center justify-center gap-2 shadow-xs"
                    >
                      {replyMutation.isPending ? (
                        <span>Transmission...</span>
                      ) : (
                        <>
                          <span>Transmettre au dossier</span>
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
                Cette fiche d'échange a été clôturée et validée par le consultant expert.
              </div>
            )}
          </div>
        ) : (
          /* SÉLECTION VIDE */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#727785] space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#EDEEEF] flex items-center justify-center text-[#5F6368]">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className={`${font.display} text-base font-bold text-[#191C1D]`}>
              Registre Officiel des Transmissions
            </h4>
            <p className="text-xs max-w-sm text-[#5F6368]">
              Sélectionnez une fiche d'échange dans le bordereau à gauche pour consulter les instructions ou ouvrir un nouveau point d'échange.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestsView;
