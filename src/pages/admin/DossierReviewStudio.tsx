import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  CheckCircle2,
  Send,
  Save,
  FileText,
  Code,
  MessageSquare,
  Download,
  AlertCircle,
  Loader2,
  Building2,
  User as UserIcon,
  RefreshCw,
  Plus,
  Paperclip,
} from "lucide-react";
import { adminDossierService } from "../../services/adminDossierService";
import { ADMIN_FRONT_PREFIX } from "../../api/axios";

export const DossierReviewStudio: React.FC = () => {
  const { dossierId: paramDossierId } = useParams<{ dossierId: string }>();
  const dossierId = parseInt(paramDossierId || "0", 10);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Onglet actif du panneau de gauche: 'JSON' | 'DOCS' | 'REQUESTS'
  const [activeTab, setActiveTab] = useState<"JSON" | "DOCS" | "REQUESTS">("JSON");

  // Éditeur JSON
  const [jsonText, setJsonText] = useState<string>("");
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Formulaire de nouvelle demande (Plan 2)
  const [requestMessage, setRequestMessage] = useState<string>("");
  const [requestInputType, setRequestInputType] = useState<"FILE" | "TEXT">("FILE");
  const [requestError, setRequestError] = useState<string | null>(null);

  // Messagerie & Thread (Plan 2)
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [replyFile, setReplyFile] = useState<File | null>(null);

  // Notifications / Feedback
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);


  // 1. Fetcher les détails du dossier (Vue 360°)
  const {
    data: dossier,
    isLoading: isDossierLoading,
    isError: isDossierError,
    error: dossierFetchError,
  } = useQuery({
    queryKey: ["adminDossier", dossierId],
    queryFn: () => adminDossierService.getDossierDetails(dossierId),
    enabled: dossierId > 0,
  });

  // 2. Fetcher le rendu HTML du rapport
  const {
    data: reportHtml,
    isLoading: isReportLoading,
    isFetching: isReportFetching,
    refetch: refetchReport,
  } = useQuery({
    queryKey: ["adminDossierReport", dossierId],
    queryFn: () => adminDossierService.getReportHtml(dossierId),
    enabled: dossierId > 0,
  });

  // Synchroniser l'éditeur JSON lorsque les données du dossier sont récupérées
  useEffect(() => {
    if (dossier?.dossierData?.extracted_json) {
      setJsonText(JSON.stringify(dossier.dossierData.extracted_json, null, 2));
      setJsonError(null);
    }
  }, [dossier?.dossierData?.extracted_json]);

  // Mutation : Sauvegarde du JSON
  const updateDataMutation = useMutation({
    mutationFn: (parsedJson: Record<string, any>) =>
      adminDossierService.updateDossierData(dossierId, parsedJson),
    onSuccess: () => {
      setFeedback({ type: "success", message: "Données JSON enregistrées avec succès !" });
      queryClient.invalidateQueries({ queryKey: ["adminDossierReport", dossierId] });
      queryClient.invalidateQueries({ queryKey: ["adminDossier", dossierId] });
    },
    onError: (err: any) => {
      setFeedback({
        type: "error",
        message: err.response?.data?.message || "Échec de l'enregistrement du JSON.",
      });
    },
  });

  // Mutation : Créer une demande complémentaire
  const createRequestMutation = useMutation({
    mutationFn: (payload: { message: string; input_type: "FILE" | "TEXT" }) =>
      adminDossierService.createConsultantRequest(dossierId, payload),
    onSuccess: () => {
      setRequestMessage("");
      setRequestError(null);
      setFeedback({ type: "success", message: "Nouvelle demande ajoutée au dossier." });
      queryClient.invalidateQueries({ queryKey: ["adminDossier", dossierId] });
    },
    onError: (err: any) => {
      setRequestError(err.response?.data?.message || "Erreur lors de la création de la demande.");
    },
  });

  // Mutation : Répondre à une demande
  const replyMutation = useMutation({
    mutationFn: ({ requestId, message, file }: { requestId: number; message: string; file: File | null }) =>
      adminDossierService.replyToRequest(dossierId, requestId, message, file),
    onSuccess: () => {
      setReplyMessage("");
      setReplyFile(null);
      queryClient.invalidateQueries({ queryKey: ["adminDossier", dossierId] });
    },
    onError: (err: any) => {
      setFeedback({ type: "error", message: err.response?.data?.message || "Erreur d'envoi du message." });
    },
  });

  // Mutation : Clôturer une requête
  const resolveMutation = useMutation({
    mutationFn: (requestId: number) => adminDossierService.resolveRequest(dossierId, requestId),
    onSuccess: () => {
      setFeedback({ type: "success", message: "Requête marquée comme résolue." });
      queryClient.invalidateQueries({ queryKey: ["adminDossier", dossierId] });
    },
    onError: (err: any) => {
      setFeedback({ type: "error", message: err.response?.data?.message || "Erreur lors de la clôture." });
    },
  });

  // Mutation : Renvoyer au client (AWAITING_CLIENT_INFO)
  const returnToClientMutation = useMutation({
    mutationFn: () => adminDossierService.returnToClient(dossierId),
    onSuccess: () => {
      setFeedback({
        type: "success",
        message: "Le dossier a été renvoyé au client avec succès. Notification envoyée.",
      });
      queryClient.invalidateQueries({ queryKey: ["adminDossier", dossierId] });
    },
    onError: (err: any) => {
      setFeedback({
        type: "error",
        message: err.response?.data?.message || "Échec du renvoi au client.",
      });
    },
  });

  // Mutation : Valider et livrer le dossier (DELIVERED)
  const validateMutation = useMutation({
    mutationFn: () => adminDossierService.validateDossier(dossierId),
    onSuccess: () => {
      setFeedback({
        type: "success",
        message: "Dossier validé et livré au client avec succès !",
      });
      queryClient.invalidateQueries({ queryKey: ["adminDossier", dossierId] });
    },
    onError: (err: any) => {
      setFeedback({
        type: "error",
        message: err.response?.data?.message || "Échec de la validation du dossier.",
      });
    },
  });

  // Mutation : Générer PDF
  const generatePdfMutation = useMutation({
    mutationFn: () => adminDossierService.generatePdf(dossierId),
    onSuccess: () => {
      setFeedback({
        type: "success",
        message: "Rapport PDF généré avec succès ! Le dossier est maintenant Livré.",
      });
      queryClient.invalidateQueries({ queryKey: ["adminDossier", dossierId] });
    },
    onError: (err: any) => {
      setFeedback({
        type: "error",
        message: err.response?.data?.message || "Erreur lors de la génération du PDF.",
      });
    },
  });

  // Directive 1 : Validation de syntaxe JSON avant soumission
  const handleSaveJson = () => {
    setJsonError(null);
    setFeedback(null);

    try {
      const parsed = JSON.parse(jsonText);
      updateDataMutation.mutate(parsed);
    } catch (e: any) {
      setJsonError(`Erreur de syntaxe JSON : ${e.message}`);
    }
  };

  // Traiter la création de demande
  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestMessage.trim()) {
      setRequestError("Veuillez saisir une description pour la demande.");
      return;
    }
    createRequestMutation.mutate({
      message: requestMessage.trim(),
      input_type: requestInputType,
    });
  };

  const handleReplySubmit = (e: React.FormEvent, reqId: number) => {
    e.preventDefault();
    if (!replyMessage.trim() && !replyFile) return;
    replyMutation.mutate({ requestId: reqId, message: replyMessage, file: replyFile });
  };

  if (isDossierLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
          <p className="text-sm font-medium text-gray-300">Chargement du Studio Consultant...</p>
        </div>
      </div>
    );
  }

  if (isDossierError || !dossier) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-900 text-white p-6">
        <div className="bg-gray-800 border border-red-500/30 rounded-xl p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Erreur de chargement</h2>
          <p className="text-sm text-gray-400 mb-6">
            {(dossierFetchError as any)?.response?.data?.message || "Dossier introuvable ou accès refusé."}
          </p>
          <button
            onClick={() => navigate(`${ADMIN_FRONT_PREFIX}/dashboard`)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
          >
            Retour au Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] w-full flex flex-col bg-gray-50 text-gray-900 overflow-hidden font-sans">
      {/* HEADER STUDIO */}
      <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0 z-10 shadow-sm">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(`${ADMIN_FRONT_PREFIX}/dossiers`)}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors"
            title="Retour à la liste"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="h-6 w-px bg-gray-300" />

          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-base font-bold text-gray-900 tracking-wide">
                Studio Dossier #{dossier.id}
              </h1>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                  dossier.status === "DELIVERED"
                    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                    : dossier.status === "CONSULTANT_REVIEW"
                    ? "bg-amber-100 text-amber-700 border-amber-200"
                    : dossier.status === "AWAITING_CLIENT_INFO"
                    ? "bg-purple-100 text-purple-700 border-purple-200"
                    : "bg-gray-100 text-gray-700 border-gray-300"
                }`}
              >
                {dossier.status}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-200 font-medium">
                {dossier.plan_type || "FAST_TRACK"}
              </span>
            </div>
            <div className="flex items-center space-x-4 text-xs text-gray-500 mt-0.5">
              <span className="flex items-center gap-1">
                <UserIcon className="w-3.5 h-3.5" />
                {dossier.client?.prenom} {dossier.client?.nom}
              </span>
              {dossier.client?.company_name && (
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  {dossier.client.company_name}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Principale Header */}
        <div className="flex items-center space-x-3">
          {feedback && (
            <div
              className={`text-xs px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 ${
                feedback.type === "success"
                  ? "bg-emerald-900/80 text-emerald-200 border border-emerald-700"
                  : "bg-red-900/80 text-red-200 border border-red-700"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400" />
              )}
              {feedback.message}
            </div>
          )}

          <button
            onClick={() => generatePdfMutation.mutate()}
            disabled={generatePdfMutation.isPending || dossier.status === "DELIVERED"}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg font-semibold text-sm transition-all shadow-md"
          >
            {generatePdfMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            <span>Générer le PDF Final</span>
          </button>
          
          <button
            onClick={() => validateMutation.mutate()}
            disabled={validateMutation.isPending || dossier.status === "DELIVERED"}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg font-semibold text-sm transition-all shadow-md hover:shadow-emerald-900/40"
          >
            {validateMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            <span>
              {dossier.status === "DELIVERED"
                ? "Dossier déjà Livré"
                : "Valider"}
            </span>
          </button>
        </div>
      </header>

      {/* SPLIT-SCREEN MAIN CONTENT */}
      <div className="flex-1 flex overflow-hidden">
        {/* COLONNE GAUCHE (50% - OUTILS & EDITEUR) */}
        <div className="w-1/2 flex flex-col border-r border-gray-200 bg-white">
          {/* BARRE D'ONGLETS */}
          <div className="flex border-b border-gray-200 bg-gray-50 px-2 pt-2 gap-1 shrink-0">
            <button
              onClick={() => setActiveTab("JSON")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg text-xs font-semibold transition-colors ${
                activeTab === "JSON"
                  ? "bg-white text-indigo-600 border-t border-x border-gray-200"
                  : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
              }`}
            >
              <Code className="w-4 h-4" />
              <span>Données IA (JSON)</span>
            </button>

            <button
              onClick={() => setActiveTab("DOCS")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg text-xs font-semibold transition-colors ${
                activeTab === "DOCS"
                  ? "bg-white text-indigo-600 border-t border-x border-gray-200"
                  : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Pièces Client ({dossier.documents?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab("REQUESTS")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg text-xs font-semibold transition-colors ${
                activeTab === "REQUESTS"
                  ? "bg-white text-indigo-600 border-t border-x border-gray-200"
                  : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Boucle Itérative ({dossier.consultantRequests?.length || 0})</span>
            </button>
          </div>

          {/* CONTENU ONGLET ACTIF */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* ONGLET 1 : EDITEUR JSON */}
            {activeTab === "JSON" && (
              <div className="h-full flex flex-col space-y-3">
                <div className="flex items-center justify-between shrink-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-gray-500">
                      Édition directe de la structure extraite
                    </span>
                    {dossier.dossierData?.is_validated_by_consultant && (
                      <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded">
                        Validé par Consultant
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handleSaveJson}
                    disabled={updateDataMutation.isPending}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-md font-semibold text-xs transition-colors shadow-sm"
                  >
                    {updateDataMutation.isPending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    <span>Enregistrer & Ré-hydrater</span>
                  </button>
                </div>

                {jsonError && (
                  <div className="p-3 bg-red-950/80 border border-red-800 rounded-lg text-red-200 text-xs font-mono shrink-0">
                    <div className="flex items-center space-x-2 font-bold mb-1">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <span>Erreur de Syntaxe JSON</span>
                    </div>
                    {jsonError}
                  </div>
                )}

                <textarea
                  value={jsonText}
                  onChange={(e) => {
                    setJsonText(e.target.value);
                    if (jsonError) setJsonError(null);
                  }}
                  className="flex-1 w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-lg p-3 font-mono text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none leading-relaxed"
                  placeholder="Collez ou modifiez la structure JSON ici..."
                  spellCheck={false}
                />
              </div>
            )}

            {/* ONGLET 2 : PIECES JUSTIFICATIVES */}
            {activeTab === "DOCS" && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Checklist & Documents Téléversés
                </h3>

                <div className="space-y-2">
                  {dossier.requirements?.map((req) => (
                    <div
                      key={req.id}
                      className="p-3 bg-white border border-gray-200 shadow-sm rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-semibold text-gray-900">
                            {req.label}
                          </span>
                          {req.is_required && (
                            <span className="text-[10px] bg-red-950 text-red-400 border border-red-900 px-1.5 py-0.2 rounded font-medium">
                              Requis
                            </span>
                          )}
                        </div>
                        {req.uploadedDocument && (
                          <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                            <span>{req.uploadedDocument.original_name}</span>
                            <span>•</span>
                            <span>{(req.uploadedDocument.file_size / 1024).toFixed(0)} KB</span>
                          </p>
                        )}
                      </div>

                      <div>
                        {req.uploadedDocument ? (
                          <a
                            href={`${import.meta.env.VITE_BACKEND_API_URL || ""}/${req.uploadedDocument.file_path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded text-xs transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Télécharger</span>
                          </a>
                        ) : (
                          <span className="text-xs text-amber-400 font-medium">En attente</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ONGLET 3 : BOUCLE ITERATIVE */}
            {activeTab === "REQUESTS" && (
              <div className="h-full flex space-x-4">
                {/* LISTE DES REQUÊTES (SIDEBAR) */}
                <div className="w-1/3 flex flex-col border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                  <div className="p-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center shrink-0">
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Demandes</h4>
                    <button
                      onClick={() => setSelectedRequestId(null)}
                      className="p-1 bg-indigo-100 text-indigo-600 hover:bg-indigo-200 rounded transition-colors"
                      title="Nouvelle demande"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {dossier.consultantRequests?.length === 0 && (
                      <p className="text-[10px] text-gray-500 text-center mt-4">Aucune demande.</p>
                    )}
                    {dossier.consultantRequests?.map((req) => (
                      <button
                        key={req.id}
                        onClick={() => setSelectedRequestId(req.id)}
                        className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors border ${
                          selectedRequestId === req.id
                            ? "bg-indigo-50 border-indigo-200 text-indigo-900"
                            : "bg-transparent border-transparent text-gray-500 hover:bg-gray-900"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-semibold truncate max-w-[70%]">
                            {req.input_type === "FILE" ? "📄 Document" : "💬 Message"}
                          </span>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                              req.status === "PENDING"
                                ? "bg-amber-950 text-amber-400"
                                : req.status === "RESOLVED"
                                ? "bg-emerald-950 text-emerald-400"
                                : "bg-purple-950 text-indigo-600"
                            }`}
                          >
                            {req.status === "PENDING" ? "EN ATTENTE" : req.status === "RESOLVED" ? "RÉSOLU" : "RÉPONDU"}
                          </span>
                        </div>
                        <p className="text-[10px] truncate opacity-70">
                          {req.message}
                        </p>
                      </button>
                    ))}
                  </div>

                  {/* Bouton Renvoyer au client en bas de la sidebar */}
                  <div className="p-3 border-t border-gray-200 bg-gray-50 shrink-0">
                    <button
                      onClick={() => returnToClientMutation.mutate()}
                      disabled={
                        returnToClientMutation.isPending ||
                        !dossier.consultantRequests?.some((r) => r.status === "PENDING")
                      }
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center space-x-1.5"
                    >
                      {returnToClientMutation.isPending ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      <span>Renvoyer au Client</span>
                    </button>
                  </div>
                </div>

                {/* ZONE PRINCIPALE (NOUVELLE DEMANDE ou THREAD) */}
                <div className="w-2/3 flex flex-col border border-gray-200 rounded-xl bg-gray-50 overflow-hidden relative">
                  {selectedRequestId === null ? (
                    // FORMULAIRE NOUVELLE DEMANDE
                    <div className="flex-1 flex flex-col p-4">
                      <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Plus className="w-4 h-4 text-purple-400" />
                        Ouvrir une nouvelle requête
                      </h4>
                      {requestError && (
                        <div className="text-xs text-red-400 bg-red-950/60 border border-red-900 p-2 rounded mb-3">
                          {requestError}
                        </div>
                      )}
                      <form onSubmit={handleCreateRequest} className="space-y-4">
                        <div>
                          <label className="block text-[11px] text-gray-500 font-medium mb-1">
                            Type d'élément attendu
                          </label>
                          <select
                            value={requestInputType}
                            onChange={(e) => setRequestInputType(e.target.value as "FILE" | "TEXT")}
                            className="w-full bg-gray-900 border border-gray-200 rounded-lg p-2 text-xs text-gray-900 focus:ring-1 focus:ring-indigo-500 outline-none"
                          >
                            <option value="FILE">Fichier / Justificatif (PDF, Docx...)</option>
                            <option value="TEXT">Explication texte / Information</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] text-gray-500 font-medium mb-1">
                            Message initial (Description de la demande)
                          </label>
                          <textarea
                            value={requestMessage}
                            onChange={(e) => setRequestMessage(e.target.value)}
                            rows={4}
                            placeholder="Ex: Bonjour, merci de nous fournir le document manquant..."
                            className="w-full bg-gray-900 border border-gray-200 rounded-lg p-3 text-xs text-gray-900 focus:ring-1 focus:ring-indigo-500 outline-none resize-none"
                          />
                        </div>
                        <div className="flex justify-end pt-2">
                          <button
                            type="submit"
                            disabled={createRequestMutation.isPending}
                            className="flex items-center space-x-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors shadow-md"
                          >
                            {createRequestMutation.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Send className="w-4 h-4" />
                            )}
                            <span>Créer la requête</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    // AFFICHAGE DU THREAD (MESSAGES)
                    (() => {
                      const req = dossier.consultantRequests?.find((r) => r.id === selectedRequestId);
                      if (!req) return null;
                      return (
                        <div className="flex-1 flex flex-col h-full">
                          {/* En-tête du Thread */}
                          <div className="p-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center shrink-0">
                            <div>
                              <div className="text-xs font-bold text-gray-900 flex items-center gap-2">
                                <span>{req.input_type === "FILE" ? "Demande de Fichier" : "Demande d'Information"}</span>
                                <span className="text-[10px] text-gray-500 font-mono">#{req.id}</span>
                              </div>
                              <div className="text-[10px] text-gray-500 mt-0.5 truncate max-w-sm">
                                Objet : {req.message}
                              </div>
                            </div>
                            {req.status !== "RESOLVED" && (
                              <button
                                onClick={() => resolveMutation.mutate(req.id)}
                                disabled={resolveMutation.isPending}
                                className="px-2.5 py-1 bg-emerald-950/50 hover:bg-emerald-900 border border-emerald-800 text-emerald-400 text-[10px] font-bold rounded transition-colors flex items-center gap-1"
                              >
                                {resolveMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                                Clôturer
                              </button>
                            )}
                          </div>

                          {/* Liste des messages */}
                          <div className="flex-1 p-3 overflow-y-auto bg-gray-50 space-y-3">
                            {req.messages?.map((msg) => {
                              const isMe = msg.sender_type === "CONSULTANT";
                              return (
                                <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                                  <span className="text-[9px] text-gray-500 mb-0.5 px-1">
                                    {isMe ? "Moi (Expert)" : "Client"} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                  <div
                                    className={`max-w-[85%] rounded-xl p-2.5 text-xs ${
                                      isMe
                                        ? "bg-purple-600 text-white rounded-tr-sm"
                                        : "bg-gray-800 text-gray-900 rounded-tl-sm border border-gray-700"
                                    }`}
                                  >
                                    {msg.message && <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>}
                                    {msg.attachment_url && (
                                      <a
                                        href={`${import.meta.env.VITE_BACKEND_API_URL || ""}/${msg.attachment_url}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex items-center gap-1.5 mt-2 p-1.5 rounded text-[10px] font-medium transition-colors ${
                                          isMe ? "bg-purple-500/50 hover:bg-purple-500" : "bg-gray-700 hover:bg-gray-600"
                                        }`}
                                      >
                                        <FileText className="w-3.5 h-3.5" />
                                        <span>Pièce jointe</span>
                                        <Download className="w-3 h-3 ml-auto" />
                                      </a>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Zone de réponse */}
                          {req.status !== "RESOLVED" && (
                            <form
                              onSubmit={(e) => handleReplySubmit(e, req.id)}
                              className="p-2 border-t border-gray-200 bg-gray-50 shrink-0 flex items-end gap-2"
                            >
                              <div className="flex-1 bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition-all">
                                <textarea
                                  value={replyMessage}
                                  onChange={(e) => setReplyMessage(e.target.value)}
                                  placeholder="Répondre..."
                                  rows={1}
                                  className="w-full bg-transparent p-2.5 text-xs text-gray-900 outline-none resize-none max-h-24"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                      e.preventDefault();
                                      handleReplySubmit(e, req.id);
                                    }
                                  }}
                                />
                                {replyFile && (
                                  <div className="px-2.5 py-1.5 bg-gray-800 border-t border-gray-700 flex justify-between items-center text-[10px]">
                                    <span className="text-gray-300 truncate max-w-[80%]">{replyFile.name}</span>
                                    <button type="button" onClick={() => setReplyFile(null)} className="text-red-400 hover:text-red-300">
                                      ✕
                                    </button>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-1 shrink-0 pb-1">
                                <label className="p-1.5 text-gray-500 hover:text-purple-400 hover:bg-gray-800 rounded cursor-pointer transition-colors">
                                  <Paperclip className="w-4 h-4" />
                                  <input
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => e.target.files && setReplyFile(e.target.files[0])}
                                  />
                                </label>
                                <button
                                  type="submit"
                                  disabled={replyMutation.isPending || (!replyMessage.trim() && !replyFile)}
                                  className="p-1.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded transition-colors"
                                >
                                  {replyMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                </button>
                              </div>
                            </form>
                          )}
                        </div>
                      );
                    })()
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* COLONNE DROITE (50% - PREVISUALISATION TEMPS REEL IFRAME) */}
        <div className="w-1/2 flex flex-col bg-gray-50">
          {/* BARRE D'ENTETE DE PREVISUALISATION */}
          <div className="h-10 border-b border-gray-200 bg-white px-4 flex items-center justify-between shrink-0">
            <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              Aperçu Rapport d'Investissement (Handlebars HTML)
            </span>

            <button
              onClick={() => refetchReport()}
              disabled={isReportFetching}
              className="p-1.5 hover:bg-gray-800 text-gray-500 hover:text-white rounded transition-colors"
              title="Rafraîchir la prévisualisation"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isReportFetching ? "animate-spin" : ""}`} />
            </button>
          </div>

          {/* CONTENEUR IFRAME PREVIEW */}
          <div className="flex-1 p-4 overflow-hidden relative">
            {isReportLoading ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg">
                <div className="flex flex-col items-center gap-2 text-gray-500">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  <span className="text-xs">Génération de l'aperçu du rapport...</span>
                </div>
              </div>
            ) : reportHtml ? (
              <iframe
                srcDoc={reportHtml}
                title="Aperçu du Rapport d'Investissement"
                className="w-full h-full border border-gray-200 rounded-lg bg-white shadow-2xl"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg text-gray-500 text-xs">
                Aucun aperçu disponible. Veuillez enregistrer le JSON pour générer le rapport.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DossierReviewStudio;
