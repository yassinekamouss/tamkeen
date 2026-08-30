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
    RefreshCw,
    Plus,
    Paperclip,
    FolderOpen,
} from "lucide-react";
import { adminDossierService } from "../../services/adminDossierService";
import { ADMIN_FRONT_PREFIX } from "../../api/axios";
import api, { ADMIN_API_PREFIX } from "../../api/axios";

export const DossierReviewStudio: React.FC = () => {
    const { dossierId: paramDossierId } = useParams<{ dossierId: string }>();
    const dossierId = parseInt(paramDossierId || "0", 10);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Onglet actif du panneau de gauche: 'JSON' | 'DOCS' | 'REQUESTS'
    const [activeTab, setActiveTab] = useState<"JSON" | "DOCS" | "REQUESTS">("JSON");
    const [activeSubTab, setActiveSubTab] = useState<"conversation" | "documents">("conversation");

    // Éditeur JSON
    const [jsonText, setJsonText] = useState<string>("");
    const [jsonError, setJsonError] = useState<string | null>(null);

    // Formulaire de nouvelle demande (Plan 2)
    const [requestMessage, setRequestMessage] = useState<string>("");
    const [requestInputType, setRequestInputType] = useState<"FILE" | "TEXT">("FILE");
    const [requestImportance, setRequestImportance] = useState<"OBLIGATOIRE" | "FACULTATIF">("OBLIGATOIRE");
    const [requestError, setRequestError] = useState<string | null>(null);

    // Messagerie & Thread (Plan 2)
    const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
    const [replyMessage, setReplyMessage] = useState("");
    const [replyFile, setReplyFile] = useState<File | null>(null);

    // Notifications / Feedback
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // Fetch Document Types
    const { data: documentTypes = [] } = useQuery({
        queryKey: ["documentTypes"],
        queryFn: async () => {
            const res = await api.get(`${ADMIN_API_PREFIX}/../document-types/active`);
            return res.data?.data || [];
        },
    });

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

    const adminProfile = JSON.parse(localStorage.getItem("adminProfile") || "{}");
    const isAdmin = adminProfile?.role === "Administrateur";

    // Fetch consultants list if Admin (table admins, role = "Consultant")
    const { data: consultantsList } = useQuery({
        queryKey: ["consultantsList"],
        queryFn: () => adminDossierService.getConsultants(),
        enabled: isAdmin,
    });

    const consultants =
        consultantsList?.filter((c: any) => c.role === "Consultant") || [];

    const assignMutation = useMutation({
        mutationFn: (consultantId: number | null) => adminDossierService.assignConsultant(dossierId, consultantId),
        onSuccess: () => {
            setFeedback({ type: "success", message: "Consultant assigné avec succès !" });
            queryClient.invalidateQueries({ queryKey: ["adminDossier", dossierId] });
        },
        onError: (err: any) => {
            setFeedback({ type: "error", message: err.response?.data?.message || "Erreur d'assignation." });
        },
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
        mutationFn: (payload: { message: string; input_type: "FILE" | "TEXT"; importance?: string }) =>
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
            importance: requestInputType === "FILE" ? requestImportance : undefined,
        });
    };

    const handleReplySubmit = (e: React.FormEvent, reqId: number) => {
        e.preventDefault();
        if (!replyMessage.trim() && !replyFile) return;
        replyMutation.mutate({ requestId: reqId, message: replyMessage, file: replyFile });
    };

    if (isDossierLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-white text-gray-900">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 animate-spin text-slate-700" />
                    <p className="text-sm font-medium text-gray-500">Chargement du Studio Consultant...</p>
                </div>
            </div>
        );
    }

    if (isDossierError || !dossier) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-white text-gray-900 p-6">
                <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-8 max-w-md text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2 text-gray-900">Erreur de chargement</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        {(dossierFetchError as any)?.response?.data?.message || "Dossier introuvable ou accès refusé."}
                    </p>
                    <button
                        onClick={() => navigate(`${ADMIN_FRONT_PREFIX}/dashboard`)}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg font-medium text-sm transition-colors"
                    >
                        Retour au Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex flex-col bg-gray-50 text-gray-900 overflow-hidden font-sans p-6">
            {/* HEADER STUDIO */}
            <header className="bg-white border border-gray-200 rounded-xl shadow-sm mb-4 px-6 py-4 shrink-0 z-10">
                <div className="flex items-center justify-between gap-6">

                    {/* =========================================================
              LEFT SECTION
          ========================================================= */}
                    <div className="flex items-center min-w-0 flex-1">

                        {/* Back button */}

                        <button
                            onClick={() => navigate(`${ADMIN_FRONT_PREFIX}/dossiers`)}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors shrink-0"
                            title="Retour à la liste"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>

                        {/* Vertical separator */}
                        <div className="mx-4 h-10 w-px bg-gray-200 shrink-0" />

                        {/* Dossier information */}
                        <div className="min-w-0 flex-1">

                            {/* Title + status + plan */}
                            <div className="flex items-center gap-2.5 flex-wrap">

                                <h1 className="text-[15px] font-bold text-slate-900 whitespace-nowrap">
                                    Studio Dossier #{dossier.id}
                                </h1>

                                {/* Status */}
                                <span
                                    className={`
                    inline-flex items-center
                    px-2.5 py-1
                    rounded-full
                    border
                    text-[11px]
                    font-semibold
                    tracking-wide
                    whitespace-nowrap
                    ${dossier.status === "DELIVERED"
                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                            : dossier.status === "CONSULTANT_REVIEW"
                                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                                : dossier.status === "AWAITING_CLIENT_INFO"
                                                    ? "bg-slate-100 text-slate-700 border-slate-300"
                                                    : "bg-gray-50 text-gray-600 border-gray-200"
                                        }
                  `}
                                >
                                    {dossier.status}
                                </span>

                                {/* Plan */}
                                <span
                                    className="
                    inline-flex items-center
                    px-2.5 py-1
                    rounded-md
                    bg-slate-50
                    border border-slate-200
                    text-[11px]
                    font-semibold
                    text-slate-600
                    whitespace-nowrap
                  "
                                >
                                    {dossier.plan_type || "FAST_TRACK"}
                                </span>
                            </div>

                            {/* Client information */}
                            <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-500">

                                <span className="inline-flex items-center gap-1.5">
                                    <span className="font-medium text-slate-600">
                                        {dossier.client?.prenom} {dossier.client?.nom}
                                    </span>
                                </span>

                                {dossier.client?.company_name && (
                                    <>
                                        <span className="h-3 w-px bg-gray-200" />

                                        <span className="inline-flex items-center gap-1.5">
                                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                            <span>{dossier.client.company_name}</span>
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Consultant assignment */}
                            {isAdmin && (
                                <div className="flex items-center gap-2 mt-2.5">

                                    <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">
                                        Assigné à
                                    </span>

                                    <select
                                        value={dossier.consultant_id || ""}
                                        onChange={(e) =>
                                            assignMutation.mutate(
                                                e.target.value
                                                    ? parseInt(e.target.value, 10)
                                                    : null
                                            )
                                        }
                                        disabled={assignMutation.isPending}
                                        className="
                      h-7
                      min-w-[240px]
                      px-2.5
                      rounded-md
                      border border-gray-300
                      bg-white
                      text-xs
                      font-medium
                      text-slate-700
                      shadow-sm
                      outline-none
                      transition-all
                      hover:border-slate-400
                      focus:border-slate-500
                      focus:ring-2
                      focus:ring-slate-100
                      disabled:bg-gray-50
                      disabled:cursor-not-allowed
                    "
                                    >
                                        <option value="">-- Aucun consultant --</option>

                                        {consultants.map((c: any) => (
                                            <option key={c._id} value={c._id}>
                                                {c.username} ({c.email})
                                            </option>
                                        ))}
                                    </select>

                                    {assignMutation.isPending && (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-500" />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* =========================================================
              RIGHT SECTION
          ========================================================= */}
                    <div className="flex items-center gap-3 shrink-0">

                        {/* Feedback */}
                        {feedback && (
                            <div
                                className={`
                  hidden xl:flex
                  items-center
                  gap-2
                  px-3
                  py-2
                  rounded-lg
                  border
                  text-xs
                  font-medium
                  whitespace-nowrap
                  ${feedback.type === "success"
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        : "bg-red-50 text-red-700 border-red-200"
                                    }
                `}
                            >
                                {feedback.type === "success" ? (
                                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                                ) : (
                                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                                )}

                                <span>{feedback.message}</span>
                            </div>
                        )}

                        {/* Action separator */}
                        <div className="hidden lg:block h-10 w-px bg-gray-200 mx-1" />

                        {/* Generate PDF */}
                        <button
                            onClick={() => generatePdfMutation.mutate()}
                            disabled={
                                generatePdfMutation.isPending ||
                                dossier.status === "DELIVERED"
                            }
                            className="
                inline-flex
                items-center
                justify-center
                gap-2
                h-10
                px-4
                rounded-lg
                border border-gray-300
                bg-white
                text-sm
                font-semibold
                text-slate-700
                shadow-sm
                transition-all duration-200
                hover:bg-slate-50
                hover:border-slate-400
                hover:text-slate-900
                disabled:opacity-50
                disabled:cursor-not-allowed
                whitespace-nowrap
              "
                        >
                            {generatePdfMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <FileText className="w-4 h-4" />
                            )}

                            <span>Générer le PDF Final</span>
                        </button>

                        {/* Validate */}
                        <button
                            onClick={() => validateMutation.mutate()}
                            disabled={
                                validateMutation.isPending ||
                                dossier.status === "DELIVERED"
                            }
                            className="
                inline-flex
                items-center
                justify-center
                gap-2
                h-10
                px-5
                rounded-lg
                bg-slate-700
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition-all duration-200
                hover:bg-slate-800
                hover:shadow-md
                disabled:opacity-50
                disabled:cursor-not-allowed
                whitespace-nowrap
              "
                        >
                            {validateMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <CheckCircle2 className="w-4 h-4" />
                            )}

                            <span>
                                {dossier.status === "DELIVERED"
                                    ? "Dossier déjà livré"
                                    : "Valider"}
                            </span>
                        </button>
                    </div>
                </div>

                {/* =========================================================
            RESPONSIVE FEEDBACK
        ========================================================= */}
                {feedback && (
                    <div className="xl:hidden mt-3 pt-3 border-t border-gray-100">
                        <div
                            className={`
                flex items-center gap-2
                px-3 py-2
                rounded-lg
                border
                text-xs
                font-medium
                ${feedback.type === "success"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-red-50 text-red-700 border-red-200"
                                }
              `}
                        >
                            {feedback.type === "success" ? (
                                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                            ) : (
                                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                            )}

                            <span>{feedback.message}</span>
                        </div>
                    </div>
                )}
            </header>

            {/* SPLIT-SCREEN MAIN CONTENT */}
            <div className="flex-1 flex overflow-hidden rounded-xl">
                {/* COLONNE GAUCHE (50% - OUTILS & EDITEUR) */}
                <div className="w-1/2 flex flex-col border-r border-gray-200 bg-white">
                    {/* BARRE D'ONGLETS */}
                    <div className="flex border-b border-gray-200 bg-white px-2 pt-2 gap-1 shrink-0 py-2">
                        <button
                            onClick={() => setActiveTab("JSON")}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg text-xs font-semibold transition-colors ${activeTab === "JSON"
                                ? "text-slate-700 border-t border-x border-gray-200"
                                : "bg-white text-gray-500 hover:text-gray-900 hover:bg-white/50"
                                }`}
                        >
                            <Code className="w-4 h-4" />
                            <span>Données IA (JSON)</span>
                        </button>

                        <button
                            onClick={() => setActiveTab("DOCS")}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg text-xs font-semibold transition-colors ${activeTab === "DOCS"
                                ? "text-slate-700 border-t border-x border-gray-200"
                                : "bg-white text-gray-500 hover:text-gray-900 hover:bg-white/50"
                                }`}
                        >
                            <FileText className="w-4 h-4" />
                            <span>Pièces Client ({dossier.documents?.length || 0})</span>
                        </button>

                        <button
                            onClick={() => setActiveTab("REQUESTS")}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg text-xs font-semibold transition-colors ${activeTab === "REQUESTS"
                                ? "text-slate-700 border-t border-x border-gray-200"
                                : "bg-white text-gray-500 hover:text-gray-900 hover:bg-white/50"
                                }`}
                        >
                            <MessageSquare className="w-4 h-4" />
                            <span>Boucle Itérative ({dossier.dossierRequests?.length || 0})</span>
                            {dossier.dossierRequests?.some((r: any) => r.status === "PENDING" && r.messages?.[r.messages.length - 1]?.sender_type === "CLIENT") && (
                                <span className="flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-orange-500 rounded-full animate-bounce">
                                    !
                                </span>
                            )}
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
                                            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-medium">
                                                Validé par Consultant
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        onClick={handleSaveJson}
                                        disabled={updateDataMutation.isPending}
                                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-800 disabled:opacity-50 text-white rounded-md font-semibold text-xs transition-colors shadow-sm"
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
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-mono shrink-0">
                                        <div className="flex items-center space-x-2 font-bold mb-1">
                                            <AlertCircle className="w-4 h-4 text-red-500" />
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
                                    className="flex-1 w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-lg p-3 font-mono text-xs focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none resize-none leading-relaxed"
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
                                                        <span className="text-[10px] bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.2 rounded font-medium">
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
                                                        className="flex items-center space-x-1 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded text-xs transition-colors"
                                                    >
                                                        <Download className="w-3.5 h-3.5" />
                                                        <span>Télécharger</span>
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-amber-600 font-medium">En attente</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ONGLET 3 : BOUCLE ITERATIVE */}
                        {activeTab === "REQUESTS" && (
                            <div className="h-full flex flex-col">
                                {/* SUB-NAVBAR FOR REQUESTS */}
                                <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
                                    <button
                                        onClick={() => setActiveSubTab("conversation")}
                                        className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors ${activeSubTab === "conversation"
                                            ? "bg-slate-700 text-white"
                                            : "bg-white text-gray-500 hover:bg-gray-50"
                                            }`}
                                    >
                                        Conversation Libre
                                    </button>
                                    <button
                                        onClick={() => setActiveSubTab("documents")}
                                        className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-colors ${activeSubTab === "documents"
                                            ? "bg-slate-700 text-white"
                                            : "bg-white text-gray-500 hover:bg-gray-50"
                                            }`}
                                    >
                                        <FolderOpen className="w-3.5 h-3.5" />
                                        Fichiers Demandés
                                    </button>
                                </div>

                                {activeSubTab === "documents" ? (
                                    <div className="flex-1 overflow-y-auto bg-gray-50 rounded-xl border border-gray-200 p-4">
                                        <div className="space-y-4">
                                            {dossier.dossierRequests?.filter((r: any) => r.input_type === "FILE").length === 0 ? (
                                                <div className="text-center p-8 text-gray-500 text-xs">Aucun fichier demandé.</div>
                                            ) : (
                                                dossier.dossierRequests?.filter((r: any) => r.input_type === "FILE").map((req: any) => (
                                                    <div key={req.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex justify-between items-center">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                {req.importance === "OBLIGATOIRE" ? (
                                                                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-red-50 text-red-700 border border-red-200">
                                                                        Obligatoire
                                                                    </span>
                                                                ) : (
                                                                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-gray-100 text-gray-600 border border-gray-200">
                                                                        Facultatif
                                                                    </span>
                                                                )}
                                                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${req.status === "PENDING" ? "bg-orange-50 text-orange-700 border-orange-200" : "bg-green-50 text-green-700 border-green-200"}`}>
                                                                    {req.status === "PENDING" ? "En attente" : "Fourni"}
                                                                </span>
                                                            </div>
                                                            <h4 className="text-xs font-bold text-gray-900">{req.message}</h4>
                                                            <p className="text-[10px] text-gray-500 mt-1">Demandé le {new Date(req.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                        <div>
                                                            {req.messages?.slice().reverse().find((m: any) => m.attachment_url) && (
                                                                <a
                                                                    href={`${import.meta.env.VITE_PREFIX_URL || "http://localhost:5000/uploads"}/dossiers/${dossierId}/${req.messages?.slice().reverse().find((m: any) => m.attachment_url)?.attachment_url}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded text-xs font-semibold transition-colors border border-slate-200"
                                                                >
                                                                    <Download className="w-3.5 h-3.5" />
                                                                    Télécharger
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex space-x-4">
                                        {/* LISTE DES REQUÊTES (SIDEBAR) */}
                                        <div className="w-1/3 flex flex-col border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                                            <div className="p-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center shrink-0">
                                                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Demandes</h4>
                                                <button
                                                    onClick={() => setSelectedRequestId(null)}
                                                    className="p-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded transition-colors"
                                                    title="Nouvelle demande"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                                                {dossier.dossierRequests?.length === 0 && (
                                                    <p className="text-[10px] text-gray-500 text-center mt-4">Aucune demande.</p>
                                                )}
                                                {dossier.dossierRequests?.map((req: any) => (
                                                    <button
                                                        key={req.id}
                                                        onClick={() => setSelectedRequestId(req.id)}
                                                        className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors border ${selectedRequestId === req.id
                                                            ? "bg-slate-50 border-slate-200 text-slate-800"
                                                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-100"
                                                            }`}
                                                    >
                                                        <div className="flex justify-between items-start mb-1">
                                                            <span className="font-semibold truncate max-w-[70%] flex items-center gap-1.5">
                                                                {req.input_type === "FILE" ? (
                                                                    <FileText className="w-3 h-3 shrink-0 text-gray-400" />
                                                                ) : (
                                                                    <MessageSquare className="w-3 h-3 shrink-0 text-gray-400" />
                                                                )}
                                                                {req.input_type === "FILE" ? "Document" : "Message"}
                                                            </span>
                                                            <span
                                                                className={`text-[9px] px-1.5 py-0.5 rounded font-medium border ${req.status === "PENDING"
                                                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                                                    : req.status === "RESOLVED"
                                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                                        : "bg-slate-100 text-slate-700 border-slate-200"
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
                                                        !dossier.dossierRequests?.some((r: any) => r.status === "PENDING")
                                                    }
                                                    className="w-full py-2 bg-slate-700 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center space-x-1.5"
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
                                                        <Plus className="w-4 h-4 text-slate-500" />
                                                        Ouvrir une nouvelle requête
                                                    </h4>
                                                    {requestError && (
                                                        <div className="text-xs text-red-700 bg-red-50 border border-red-200 p-2 rounded mb-3">
                                                            {requestError}
                                                        </div>
                                                    )}
                                                    <form onSubmit={handleCreateRequest} className="space-y-4">
                                                        <div>
                                                            <label className="block text-[11px] text-gray-600 font-medium mb-1">
                                                                Type d'élément attendu
                                                            </label>
                                                            <select
                                                                value={requestInputType}
                                                                onChange={(e) => {
                                                                    setRequestInputType(e.target.value as "FILE" | "TEXT");
                                                                    setRequestMessage("");
                                                                }}
                                                                className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 focus:ring-1 focus:ring-slate-600 outline-none mb-3"
                                                            >
                                                                <option value="FILE">Fichier / Justificatif (PDF, Docx...)</option>
                                                                <option value="TEXT">Explication texte / Information</option>
                                                            </select>

                                                            {requestInputType === "FILE" && (
                                                                <>
                                                                    <label className="block text-[11px] text-gray-600 font-medium mb-1">
                                                                        Document demandé
                                                                    </label>
                                                                    <select
                                                                        value={requestMessage}
                                                                        onChange={(e) => setRequestMessage(e.target.value)}
                                                                        className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 focus:ring-1 focus:ring-slate-600 outline-none mb-3"
                                                                    >
                                                                        <option value="">Sélectionnez un document...</option>
                                                                        {documentTypes.map((type: any) => (
                                                                            <option key={type.id} value={type.name}>{type.name}</option>
                                                                        ))}
                                                                    </select>

                                                                    <label className="block text-[11px] text-gray-600 font-medium mb-1">
                                                                        Importance du fichier
                                                                    </label>
                                                                    <select
                                                                        value={requestImportance}
                                                                        onChange={(e) => setRequestImportance(e.target.value as "OBLIGATOIRE" | "FACULTATIF")}
                                                                        className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 focus:ring-1 focus:ring-slate-600 outline-none"
                                                                    >
                                                                        <option value="OBLIGATOIRE">Obligatoire</option>
                                                                        <option value="FACULTATIF">Facultatif</option>
                                                                    </select>
                                                                </>
                                                            )}
                                                        </div>
                                                        {requestInputType === "TEXT" && (
                                                            <div>
                                                                <label className="block text-[11px] text-gray-600 font-medium mb-1">
                                                                    Message initial (Description de la demande)
                                                                </label>
                                                                <textarea
                                                                    value={requestMessage}
                                                                    onChange={(e) => setRequestMessage(e.target.value)}
                                                                    rows={4}
                                                                    placeholder="Ex: Bonjour, merci de nous fournir l'information manquante..."
                                                                    className="w-full bg-white border border-gray-300 rounded-lg p-3 text-xs text-gray-900 focus:ring-1 focus:ring-slate-600 outline-none resize-none"
                                                                />
                                                            </div>
                                                        )}
                                                        <div className="flex justify-end pt-2">
                                                            <button
                                                                type="submit"
                                                                disabled={createRequestMutation.isPending}
                                                                className="flex items-center space-x-1.5 px-4 py-2 bg-slate-700 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
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
                                                    const req = dossier.dossierRequests?.find((r: any) => r.id === selectedRequestId);
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
                                                                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-[10px] font-bold rounded transition-colors flex items-center gap-1"
                                                                    >
                                                                        {resolveMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                                                                        Clôturer
                                                                    </button>
                                                                )}
                                                            </div>

                                                            {req.input_type === "FILE" ? (
                                                                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-500 space-y-4">
                                                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                                                                        <FolderOpen className="w-6 h-6" />
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="text-sm font-bold text-gray-900 mb-1">Demande de Document</h3>
                                                                        <p className="text-xs text-gray-600 max-w-sm">
                                                                            Cette requête concerne la transmission d'un fichier ("{req.message}"). Veuillez vous rendre dans l'onglet "Fichiers Demandés" pour consulter ce document.
                                                                        </p>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => setActiveSubTab("documents")}
                                                                        className="mt-2 px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                                                                    >
                                                                        Aller aux Fichiers Demandés
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    {/* Liste des messages */}
                                                                    <div className="flex-1 p-3 overflow-y-auto bg-gray-50 space-y-3">
                                                                        {req.messages?.map((msg: any) => {
                                                                            const isMe = msg.sender_type === "CONSULTANT";
                                                                            return (
                                                                                <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                                                                                    <span className="text-[9px] text-gray-500 mb-0.5 px-1">
                                                                                        {isMe ? "Moi (Expert)" : "Client"} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                                    </span>
                                                                                    <div
                                                                                        className={`max-w-[85%] rounded-xl p-2.5 text-xs ${isMe
                                                                                            ? "bg-slate-700 text-white rounded-tr-sm"
                                                                                            : "bg-white text-gray-900 rounded-tl-sm border border-gray-200 shadow-sm"
                                                                                            }`}
                                                                                    >
                                                                                        {msg.message && <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>}
                                                                                        {msg.attachment_url && (
                                                                                            <a
                                                                                                href={`${import.meta.env.VITE_PREFIX_URL || "http://localhost:5000/uploads"}/dossiers/${dossierId}/${msg.attachment_url}`}
                                                                                                target="_blank"
                                                                                                rel="noopener noreferrer"
                                                                                                className={`flex items-center gap-1.5 mt-2 p-1.5 rounded text-[10px] font-medium transition-colors ${isMe ? "bg-slate-600 hover:bg-slate-500" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
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
                                                                    <form
                                                                        onSubmit={(e) => handleReplySubmit(e, req.id)}
                                                                        className="p-2 border-t border-gray-200 bg-gray-50 shrink-0 flex items-end gap-2"
                                                                    >
                                                                        <div className="flex-1 bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden focus-within:border-slate-600 focus-within:ring-1 focus-within:ring-slate-600 transition-all">
                                                                            <textarea
                                                                                value={replyMessage}
                                                                                onChange={(e) => setReplyMessage(e.target.value)}
                                                                                placeholder={req.status === "RESOLVED" ? "Répondre (Rouvrira la requête)..." : "Répondre..."}
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
                                                                                <div className="px-2.5 py-1.5 bg-gray-100 border-t border-gray-200 flex justify-between items-center text-[10px]">
                                                                                    <span className="text-gray-700 truncate max-w-[80%]">{replyFile.name}</span>
                                                                                    <button type="button" onClick={() => setReplyFile(null)} className="text-red-500 hover:text-red-600">
                                                                                        ✕
                                                                                    </button>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex items-center gap-1 shrink-0 pb-1">
                                                                            <label className="p-1.5 text-gray-500 hover:text-slate-700 hover:bg-gray-100 rounded cursor-pointer transition-colors">
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
                                                                                className="p-1.5 bg-slate-700 hover:bg-slate-800 disabled:opacity-50 text-white rounded transition-colors"
                                                                            >
                                                                                {replyMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                                                            </button>
                                                                        </div>
                                                                    </form>
                                                                </>
                                                            )}
                                                        </div>
                                                    );
                                                })()
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* COLONNE DROITE (50% - PREVISUALISATION TEMPS REEL IFRAME) */}
                <div className="w-1/2 flex flex-col bg-white">
                    {/* BARRE D'ENTETE DE PREVISUALISATION */}
                    <div className="h-10 border-b border-gray-200 bg-white px-4 flex items-center justify-between shrink-0 py-6">
                        <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-slate-400" />
                            Aperçu Rapport d'Investissement (Handlebars HTML)
                        </span>

                        <button
                            onClick={() => refetchReport()}
                            disabled={isReportFetching}
                            className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-gray-900 rounded transition-colors"
                            title="Rafraîchir la prévisualisation"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${isReportFetching ? "animate-spin" : ""}`} />
                        </button>
                    </div>

                    {/* CONTENEUR IFRAME PREVIEW */}
                    <div className="flex-1 p-4 overflow-hidden relative">
                        {isReportLoading ? (
                            <div className="w-full h-full flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg">
                                <div className="flex flex-col items-center gap-2 text-gray-500">
                                    <Loader2 className="w-8 h-8 animate-spin text-slate-600" />
                                    <span className="text-xs">Génération de l'aperçu du rapport...</span>
                                </div>
                            </div>
                        ) : reportHtml ? (
                            <iframe
                                srcDoc={reportHtml}
                                title="Aperçu du Rapport d'Investissement"
                                className="w-full h-full border border-gray-200 rounded-lg bg-white shadow-sm"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg text-gray-400 text-xs">
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