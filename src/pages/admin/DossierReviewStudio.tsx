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
    <div className="h-screen w-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* HEADER STUDIO */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(`${ADMIN_FRONT_PREFIX}/dashboard`)}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            title="Retour au Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="h-6 w-px bg-slate-800" />

          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-base font-bold text-white tracking-wide">
                Studio Dossier #{dossier.id}
              </h1>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                  dossier.status === "DELIVERED"
                    ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                    : dossier.status === "CONSULTANT_REVIEW"
                    ? "bg-amber-950 text-amber-300 border-amber-800"
                    : dossier.status === "AWAITING_CLIENT_INFO"
                    ? "bg-purple-950 text-purple-300 border-purple-800"
                    : "bg-slate-800 text-slate-300 border-slate-700"
                }`}
              >
                {dossier.status}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-medium">
                {dossier.plan_type || "FAST_TRACK"}
              </span>
            </div>
            <div className="flex items-center space-x-4 text-xs text-slate-400 mt-0.5">
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
                : "Valider et Livrer au Client"}
            </span>
          </button>
        </div>
      </header>

      {/* SPLIT-SCREEN MAIN CONTENT */}
      <div className="flex-1 flex overflow-hidden">
        {/* COLONNE GAUCHE (50% - OUTILS & EDITEUR) */}
        <div className="w-1/2 flex flex-col border-r border-slate-800 bg-slate-900">
          {/* BARRE D'ONGLETS */}
          <div className="flex border-b border-slate-800 bg-slate-950 px-2 pt-2 gap-1 shrink-0">
            <button
              onClick={() => setActiveTab("JSON")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg text-xs font-semibold transition-colors ${
                activeTab === "JSON"
                  ? "bg-slate-900 text-blue-400 border-t border-x border-slate-800"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
              }`}
            >
              <Code className="w-4 h-4" />
              <span>Données IA (JSON)</span>
            </button>

            <button
              onClick={() => setActiveTab("DOCS")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg text-xs font-semibold transition-colors ${
                activeTab === "DOCS"
                  ? "bg-slate-900 text-blue-400 border-t border-x border-slate-800"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Pièces Client ({dossier.documents?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab("REQUESTS")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg text-xs font-semibold transition-colors ${
                activeTab === "REQUESTS"
                  ? "bg-slate-900 text-purple-400 border-t border-x border-slate-800"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
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
                    <span className="text-xs font-medium text-slate-400">
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
                  className="flex-1 w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-lg p-3 font-mono text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none leading-relaxed"
                  placeholder="Collez ou modifiez la structure JSON ici..."
                  spellCheck={false}
                />
              </div>
            )}

            {/* ONGLET 2 : PIECES JUSTIFICATIVES */}
            {activeTab === "DOCS" && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Checklist & Documents Téléversés
                </h3>

                <div className="space-y-2">
                  {dossier.requirements?.map((req) => (
                    <div
                      key={req.id}
                      className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-semibold text-slate-200">
                            {req.label}
                          </span>
                          {req.is_required && (
                            <span className="text-[10px] bg-red-950 text-red-400 border border-red-900 px-1.5 py-0.2 rounded font-medium">
                              Requis
                            </span>
                          )}
                        </div>
                        {req.uploadedDocument && (
                          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
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
                            className="flex items-center space-x-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded text-xs transition-colors"
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
              <div className="space-y-5">
                {/* Formulaire de création de demande */}
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Nouvelle demande au client
                  </h4>

                  {requestError && (
                    <div className="text-xs text-red-400 bg-red-950/60 border border-red-900 p-2 rounded">
                      {requestError}
                    </div>
                  )}

                  <form onSubmit={handleCreateRequest} className="space-y-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 font-medium mb-1">
                        Type d'élément attendu
                      </label>
                      <select
                        value={requestInputType}
                        onChange={(e) => setRequestInputType(e.target.value as "FILE" | "TEXT")}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:ring-1 focus:ring-purple-500 outline-none"
                      >
                        <option value="FILE">Fichier / Justificatif (PDF, Docx...)</option>
                        <option value="TEXT">Explication texte / Information</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 font-medium mb-1">
                        Instructions précises pour le client
                      </label>
                      <textarea
                        value={requestMessage}
                        onChange={(e) => setRequestMessage(e.target.value)}
                        rows={3}
                        placeholder="Ex: Merci de fournir les états de synthèse de l'exercice 2024..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:ring-1 focus:ring-purple-500 outline-none resize-none"
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <button
                        type="submit"
                        disabled={createRequestMutation.isPending}
                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors"
                      >
                        {createRequestMutation.isPending ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Send className="w-3.5 h-3.5" />
                        )}
                        <span>Ajouter la demande</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Action de renvoi au client */}
                <div className="p-4 bg-purple-950/40 border border-purple-900/60 rounded-xl flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-purple-200">
                      Renvoyer le dossier au client
                    </h5>
                    <p className="text-[11px] text-purple-300/80 mt-0.5">
                      Bascule le dossier à AWAITING_CLIENT_INFO et notifie le client par e-mail.
                    </p>
                  </div>

                  <button
                    onClick={() => returnToClientMutation.mutate()}
                    disabled={
                      returnToClientMutation.isPending ||
                      !dossier.consultantRequests?.some((r) => r.status === "PENDING")
                    }
                    className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors flex items-center space-x-1.5"
                  >
                    {returnToClientMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>Renvoyer au Client</span>
                  </button>
                </div>

                {/* Historique des demandes */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Historique des Demandes
                  </h4>

                  {(!dossier.consultantRequests || dossier.consultantRequests.length === 0) && (
                    <p className="text-xs text-slate-500 italic p-3 text-center bg-slate-950 rounded-lg">
                      Aucune demande complémentaire créée pour ce dossier.
                    </p>
                  )}

                  {dossier.consultantRequests?.map((req) => (
                    <div
                      key={req.id}
                      className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                          [{req.input_type}]
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            req.status === "FULFILLED"
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                              : "bg-amber-950 text-amber-400 border border-amber-800"
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 font-medium">{req.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* COLONNE DROITE (50% - PREVISUALISATION TEMPS REEL IFRAME) */}
        <div className="w-1/2 flex flex-col bg-slate-950">
          {/* BARRE D'ENTETE DE PREVISUALISATION */}
          <div className="h-10 border-b border-slate-800 bg-slate-900 px-4 flex items-center justify-between shrink-0">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              Aperçu Rapport d'Investissement (Handlebars HTML)
            </span>

            <button
              onClick={() => refetchReport()}
              disabled={isReportFetching}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-colors"
              title="Rafraîchir la prévisualisation"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isReportFetching ? "animate-spin" : ""}`} />
            </button>
          </div>

          {/* CONTENEUR IFRAME PREVIEW */}
          <div className="flex-1 p-4 overflow-hidden relative">
            {isReportLoading ? (
              <div className="w-full h-full flex items-center justify-center bg-slate-900 rounded-lg">
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  <span className="text-xs">Génération de l'aperçu du rapport...</span>
                </div>
              </div>
            ) : reportHtml ? (
              <iframe
                srcDoc={reportHtml}
                title="Aperçu du Rapport d'Investissement"
                className="w-full h-full border border-slate-800 rounded-lg bg-white shadow-2xl"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-900 rounded-lg text-slate-500 text-xs">
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
