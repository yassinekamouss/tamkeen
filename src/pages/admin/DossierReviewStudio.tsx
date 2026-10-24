import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    ArrowLeft,
    CheckCircle2,
    Send,
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
    Calculator,
    Maximize2,
    X,
    Zap,
    Edit3,
    Compass,
    Save,
    FileCheck2,
    UploadCloud,
    Trash2,
    Sparkles,
    Layers,
    PieChart,
    Coins,
    Briefcase,
} from "lucide-react";
import { adminDossierService } from "../../services/adminDossierService";
import type { CreateConsultantRequestPayload } from "../../types/adminDossier";
import { ADMIN_FRONT_PREFIX } from "../../api/axios";
import api, { ADMIN_API_PREFIX } from "../../api/axios";
import { DossierDataFormEditor } from "../../components/admin/DossierDataFormEditor";
import {
    REGIONS_ET_PROVINCES,
    SECTEURS_ACTIVITE,
    BRANCHES_ACTIVITE,
    BANQUES_PARTENAIRES,
    PROFILS_MONTEE_CHARGE,
    getProvincesForRegion,
    getProvinceDetails,
    type BrancheInfo,
    type SecteurInfo,
} from "../../components/client/stepper/tpmeReferentiels";
import { formatMAD, formatPercent } from "../../components/client/stepper/useStepperMath";

export const DossierReviewStudio: React.FC = () => {
    const { dossierId: paramDossierId } = useParams<{ dossierId: string }>();
    const dossierId = parseInt(paramDossierId || "0", 10);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Onglet actif du panneau de gauche: 'JSON' | 'DOCS' | 'REQUESTS' | 'STEPPER' | 'POSTULATION'
    const [activeTab, setActiveTab] = useState<"JSON" | "DOCS" | "REQUESTS" | "STEPPER" | "POSTULATION">("JSON");
    const [activeSubTab, setActiveSubTab] = useState<"conversation" | "documents">("conversation");

    // Stepper inputs pour le consultant (Plan 2 & 3 / Délégation)
    const [stepperFormData, setStepperFormData] = useState<Record<string, any>>({});

    // Fichiers téléversés directement par le consultant (Étape 5)
    const [fileFiscaleUpload, setFileFiscaleUpload] = useState<File | null>(null);
    const [fileRCUpload, setFileRCUpload] = useState<File | null>(null);
    const [fileCNSSUpload, setFileCNSSUpload] = useState<File | null>(null);

    // Fichiers référencés parmi ceux fournis par le client
    const [fileFiscaleRef, setFileFiscaleRef] = useState<any | null>(null);
    const [fileRCRef, setFileRCRef] = useState<any | null>(null);
    const [fileCNSSRef, setFileCNSSRef] = useState<any | null>(null);

    // Postulation Plan 3
    const [postulationStep, setPostulationStep] = useState<number>(1);
    const [postulationNotes, setPostulationNotes] = useState<string>("");
    const [postulationRef, setPostulationRef] = useState<string>("");
    const [postulationStatus, setPostulationStatus] = useState<string>("IN_PROGRESS");

    // Éditeur JSON / Formulaire Structuré
    const [jsonObject, setJsonObject] = useState<Record<string, any>>({});
    const [jsonError, setJsonError] = useState<string | null>(null);

    // Formulaire de nouvelle demande (Plan 2)
    const [requestMessage, setRequestMessage] = useState<string>("");
    const [requestDocumentTypeId, setRequestDocumentTypeId] = useState<number | null>(null);
    const [requestInputType, setRequestInputType] = useState<"FILE" | "TEXT">("FILE");
    const [requestImportance, setRequestImportance] = useState<"OBLIGATOIRE" | "FACULTATIF">("OBLIGATOIRE");
    const [requestError, setRequestError] = useState<string | null>(null);

    // Messagerie & Thread (Plan 2)
    const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
    const [replyMessage, setReplyMessage] = useState("");
    const [replyFile, setReplyFile] = useState<File | null>(null);

    // Notifications / Feedback (Toast flottant)
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // Modal plein écran pour l'aperçu du rapport
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Auto-dismiss pour la notification flottante après 5 secondes
    useEffect(() => {
        if (!feedback) return;
        const timer = setTimeout(() => {
            setFeedback(null);
        }, 5000);
        return () => clearTimeout(timer);
    }, [feedback]);

    // Fermeture du modal avec la touche Échap
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isModalOpen) {
                setIsModalOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isModalOpen]);

    // Fetch Document Types
    const { data: documentTypes = [] } = useQuery({
        queryKey: ["documentTypes"],
        queryFn: async () => {
            const res = await api.get(`${ADMIN_API_PREFIX}/document-types`);
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

    // 2. Fetcher le rendu HTML du rapport (actif seulement si des données extraites existent)
    const {
        data: reportHtml,
        isLoading: isReportLoading,
        isFetching: isReportFetching,
        refetch: refetchReport,
    } = useQuery({
        queryKey: ["adminDossierReport", dossierId],
        queryFn: () => adminDossierService.getReportHtml(dossierId),
        enabled: dossierId > 0 && !!dossier?.dossierData?.extracted_json,
        retry: false,
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
            setJsonObject(dossier.dossierData.extracted_json);
            setJsonError(null);
        }
        if (dossier?.stepperInputs) {
            setStepperFormData(dossier.stepperInputs);
        }
        if (dossier?.postulation_step) {
            setPostulationStep(dossier.postulation_step);
        }
        if (dossier?.postulation_data?.reference) {
            setPostulationRef(dossier.postulation_data.reference);
        }
    }, [dossier]);

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

    // Mutation : Expédition rapide 1-clic pour Plan 1
    const fastTrackMutation = useMutation({
        mutationFn: () => adminDossierService.fastTrackDeliver(dossierId),
        onSuccess: () => {
            setFeedback({
                type: "success",
                message: "Livraison Fast-Track 1-Clic effectuée avec succès ! Le rapport PDF est disponible pour le client.",
            });
            queryClient.invalidateQueries({ queryKey: ["adminDossier", dossierId] });
            queryClient.invalidateQueries({ queryKey: ["adminDossierReport", dossierId] });
        },
        onError: (err: any) => {
            setFeedback({
                type: "error",
                message: err.response?.data?.message || "Échec de l'expédition rapide Fast-Track.",
            });
        },
    });

    // Liste consolidée de tous les documents disponibles dans le dossier
    const availableClientFiles = useMemo(() => {
        if (!dossier) return [];
        const filesMap = new Map<string, { id: string; name: string; source: string; filename: string; documentId?: number; url: string; size?: number; date?: string; type: "document" | "attachment" }>();

        // 1. Requirements avec document uploadé
        dossier.requirements?.forEach((req: any) => {
            if (req.uploadedDocument?.filename) {
                const doc = req.uploadedDocument;
                filesMap.set(doc.filename, {
                    id: `doc-${doc.id}`,
                    name: doc.original_name || doc.filename,
                    source: `Checklist : ${req.label}`,
                    filename: doc.filename,
                    documentId: doc.id,
                    url: `${import.meta.env.VITE_BACKEND_API_URL || ""}/${doc.file_path}`,
                    size: Number(doc.file_size) || undefined,
                    date: doc.createdAt,
                    type: "document",
                });
            }
        });

        // 2. Documents directs
        dossier.documents?.forEach((doc: any) => {
            if (doc.filename && !filesMap.has(doc.filename)) {
                filesMap.set(doc.filename, {
                    id: `doc-${doc.id}`,
                    name: doc.original_name || doc.filename,
                    source: "Documents dossier",
                    filename: doc.filename,
                    documentId: doc.id,
                    url: `${import.meta.env.VITE_BACKEND_API_URL || ""}/${doc.file_path}`,
                    size: Number(doc.file_size) || undefined,
                    date: doc.createdAt,
                    type: "document",
                });
            }
        });

        // 3. Pièces jointes des réponses aux demandes (chat / requests)
        dossier.dossierRequests?.forEach((req: any) => {
            req.messages?.forEach((msg: any) => {
                if (msg.attachment_url && !filesMap.has(msg.attachment_url)) {
                    filesMap.set(msg.attachment_url, {
                        id: `att-${msg.id}`,
                        name: msg.attachment_url,
                        source: `Demande #${req.id} : ${req.documentType?.name || req.message}`,
                        filename: msg.attachment_url,
                        url: `${import.meta.env.VITE_PREFIX_URL || "http://localhost:5000/uploads"}/dossiers/${dossierId}/${msg.attachment_url}`,
                        date: msg.createdAt,
                        type: "attachment",
                    });
                }
            });
        });

        return Array.from(filesMap.values());
    }, [dossier, dossierId]);

    const existingFiscaleDoc = useMemo(() => {
        return dossier?.requirements?.find((r: any) => {
            const l = (r.label || "").toLowerCase();
            return l.includes("fiscale") || l.includes("impôt") || l.includes("dgi");
        })?.uploadedDocument;
    }, [dossier]);

    const existingRCDoc = useMemo(() => {
        return dossier?.requirements?.find((r: any) => {
            const l = (r.label || "").toLowerCase();
            return l.includes("commerce") || l.includes("rc");
        })?.uploadedDocument;
    }, [dossier]);

    const existingCNSSDoc = useMemo(() => {
        return dossier?.requirements?.find((r: any) => {
            const l = (r.label || "").toLowerCase();
            return l.includes("cnss");
        })?.uploadedDocument;
    }, [dossier]);

    // Mutation : Consultant met à jour les données du formulaire Stepper & Pièces (Plan 2 & 3 / Délégation)
    const consultantSaveStepperMutation = useMutation({
        mutationFn: (payload: any) =>
            adminDossierService.consultantSaveStepper(dossierId, payload),
        onSuccess: (data: any) => {
            setFeedback({
                type: "success",
                message: data?.filesAttached?.fiscale || data?.filesAttached?.rc || data?.filesAttached?.cnss
                    ? "Paramètres du Stepper et pièces enregistrés. Déclenchement de l'analyse MLOps réussi !"
                    : "Informations du projet (Stepper) enregistrées avec succès !",
            });
            setFileFiscaleUpload(null);
            setFileRCUpload(null);
            setFileCNSSUpload(null);
            queryClient.invalidateQueries({ queryKey: ["adminDossier", dossierId] });
            queryClient.invalidateQueries({ queryKey: ["adminDossierReport", dossierId] });
        },
        onError: (err: any) => {
            setFeedback({
                type: "error",
                message: err.response?.data?.message || "Erreur lors de la sauvegarde du formulaire Stepper.",
            });
        },
    });

    const handleSaveStepper = (autoAdvance: boolean, triggerMlops: boolean = false) => {
        const referencedFiles: Record<string, any> = {};
        if (fileFiscaleRef) referencedFiles.file_fiscale = fileFiscaleRef;
        if (fileRCRef) referencedFiles.file_rc = fileRCRef;
        if (fileCNSSRef) referencedFiles.file_cnss = fileCNSSRef;

        consultantSaveStepperMutation.mutate({
            stepperData: stepperFormData,
            autoAdvance,
            triggerMlops: triggerMlops || autoAdvance,
            referencedFiles,
            files: {
                file_fiscale: fileFiscaleUpload,
                file_rc: fileRCUpload,
                file_cnss: fileCNSSUpload,
            },
        });
    };

    // Mutation : Mise à jour de la timeline de postulation (Plan 3)
    const updatePostulationMutation = useMutation({
        mutationFn: (payload: { step: number; notes?: string; reference?: string; status?: string }) =>
            adminDossierService.updatePostulationTimeline(dossierId, payload),
        onSuccess: () => {
            setFeedback({
                type: "success",
                message: "Jalon de postulation mis à jour ! Le client a été notifié.",
            });
            queryClient.invalidateQueries({ queryKey: ["adminDossier", dossierId] });
        },
        onError: (err: any) => {
            setFeedback({
                type: "error",
                message: err.response?.data?.message || "Erreur lors de la mise à jour de la timeline.",
            });
        },
    });

    // Mutation : Créer une demande complémentaire
    const createRequestMutation = useMutation({
        mutationFn: (payload: CreateConsultantRequestPayload) =>
            adminDossierService.createConsultantRequest(dossierId, payload),
        onSuccess: () => {
            setRequestMessage("");
            setRequestDocumentTypeId(null);
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
                message: "Dossier validé et rapport PDF généré & livré au client avec succès !",
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


    // Mutation : Recalculer les projections financières à la volée
    const recalculateMutation = useMutation({
        mutationFn: (overrides?: Record<string, any>) =>
            adminDossierService.recalculateFinancials(dossierId, overrides),
        onSuccess: (data: any) => {
            const updatedJson = data?.extracted_json || data?.data?.extracted_json;
            if (updatedJson) {
                setJsonObject(updatedJson);
            }
            setFeedback({
                type: "success",
                message: "Projections financières recalculées avec succès !",
            });
            queryClient.invalidateQueries({ queryKey: ["adminDossierReport", dossierId] });
            queryClient.invalidateQueries({ queryKey: ["adminDossier", dossierId] });
        },
        onError: (err: any) => {
            setFeedback({
                type: "error",
                message: err.response?.data?.message || "Erreur lors du recalcul des projections financières.",
            });
        },
    });

    // Mutation : Relancer la génération PDF
    const retryPdfMutation = useMutation({
        mutationFn: () => adminDossierService.retryPdf(dossierId),
        onSuccess: () => {
            setFeedback({
                type: "success",
                message: "Génération PDF relancée avec succès !",
            });
            queryClient.invalidateQueries({ queryKey: ["adminDossier", dossierId] });
            queryClient.invalidateQueries({ queryKey: ["adminDossierReport", dossierId] });
        },
        onError: (err: any) => {
            setFeedback({
                type: "error",
                message: err.response?.data?.message || "Erreur lors de la relance de la génération PDF.",
            });
        },
    });

    const handleSaveJson = () => {
        setJsonError(null);
        setFeedback(null);
        updateDataMutation.mutate(jsonObject);
    };

    // Traiter la création de demande
    const handleCreateRequest = (e: React.FormEvent) => {
        e.preventDefault();
        if (!requestMessage.trim()) {
            setRequestError("Veuillez sélectionner un type de document ou saisir un message.");
            return;
        }
        createRequestMutation.mutate({
            message: requestMessage.trim(),
            input_type: requestInputType,
            importance: requestInputType === "FILE" ? requestImportance : undefined,
            document_type_id: requestInputType === "FILE" ? (requestDocumentTypeId || undefined) : undefined,
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
                                                    : dossier.status === "GENERATION_FAILED"
                                                        ? "bg-red-50 text-red-700 border-red-200"
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
                                        {(dossier.client?.prenom || dossier.client?.nom)
                                            ? `${dossier.client?.prenom || ""} ${dossier.client?.nom || ""}`.trim()
                                            : (dossier.client?.email || "Client")}
                                    </span>
                                </span>

                                {(dossier.client?.nomEntreprise || dossier.client?.company_name) && (
                                    <>
                                        <span className="h-3 w-px bg-gray-200" />

                                        <span className="inline-flex items-center gap-1.5">
                                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                            <span>{dossier.client?.nomEntreprise || dossier.client?.company_name}</span>
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
                        {/* Recalculer les projections financières */}
                        <button
                            onClick={() => recalculateMutation.mutate({})}
                            disabled={recalculateMutation.isPending}
                            className="
                inline-flex
                items-center
                justify-center
                gap-2
                h-10
                px-4
                rounded-lg
                border border-blue-200
                bg-blue-50
                text-sm
                font-semibold
                text-blue-700
                shadow-sm
                transition-all duration-200
                hover:bg-blue-100
                hover:border-blue-300
                hover:text-blue-800
                disabled:opacity-50
                disabled:cursor-not-allowed
                whitespace-nowrap
              "
                            title="Recalculer les projections financières"
                        >
                            {recalculateMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                            ) : (
                                <Calculator className="w-4 h-4 text-blue-600" />
                            )}

                            <span>Recalculer les projections financières</span>
                        </button>

                        {/* Bouton Unifié: Expédition Rapide 1-Clic pour Plan 1 OU Valider & Livrer */}
                        {dossier.plan_type === "PLAN_1" ? (
                            <button
                                onClick={() => fastTrackMutation.mutate()}
                                disabled={fastTrackMutation.isPending}
                                className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-lg text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                title="Expédier le rapport automatiquement sans révision manuelle (Plan 1 Fast-Track)"
                            >
                                {fastTrackMutation.isPending ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Zap className="w-4 h-4 text-amber-200 fill-amber-200" />
                                )}
                                <span>
                                    {dossier.status === "DELIVERED"
                                        ? "Régénérer Livrable (Fast-Track)"
                                        : "Expédier au client (1-Clic Fast-Track)"}
                                </span>
                            </button>
                        ) : (
                            <button
                                onClick={() => validateMutation.mutate()}
                                disabled={validateMutation.isPending}
                                className={`
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    h-10
                    px-5
                    rounded-lg
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition-all duration-200
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    whitespace-nowrap
                    ${dossier.status === "DELIVERED"
                                        ? "bg-slate-700 hover:bg-slate-800"
                                        : "bg-emerald-600 hover:bg-emerald-700 hover:shadow-md"
                                    }
                  `}
                            >
                                {validateMutation.isPending ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <CheckCircle2 className="w-4 h-4" />
                                )}

                                <span>
                                    {dossier.status === "DELIVERED"
                                        ? "Régénérer & Mettre à jour le livrable"
                                        : "Valider & Livrer au client"}
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* ALERTE ERREUR DE GÉNÉRATION PDF */}
            {dossier?.status === "GENERATION_FAILED" && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-500 rounded-xl p-4 shadow-sm flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                        <div>
                            <h3 className="text-sm font-bold text-red-800">
                                Échec de la génération du rapport PDF
                            </h3>
                            <p className="text-xs text-red-600">
                                La génération précédente du rapport PDF a rencontré une anomalie. Vous pouvez relancer le traitement.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => retryPdfMutation.mutate()}
                        disabled={retryPdfMutation.isPending}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors shrink-0 ml-4"
                    >
                        {retryPdfMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <RefreshCw className="w-4 h-4" />
                        )}
                        <span>Relancer la génération PDF</span>
                    </button>
                </div>
            )}

            {/* SPLIT-SCREEN MAIN CONTENT */}
            <div className="flex-1 flex overflow-hidden rounded-xl">
                {/* COLONNE GAUCHE (50% - OUTILS & EDITEUR) */}
                <div className="w-1/2 flex flex-col border-r border-gray-200 bg-white">
                    {/* BARRE D'ONGLETS */}
                    <div className="flex border-b border-gray-200 bg-white px-2 pt-2 gap-1 shrink-0 py-2">
                        <button
                            onClick={() => setActiveTab("JSON")}
                            className={`flex items-center space-x-2 px-3.5 py-2 rounded-t-lg text-xs font-semibold transition-colors ${activeTab === "JSON"
                                ? "text-slate-700 border-t border-x border-gray-200"
                                : "bg-white text-gray-500 hover:text-gray-900 hover:bg-white/50"
                                }`}
                        >
                            <Code className="w-4 h-4" />
                            <span>Données (JSON)</span>
                        </button>

                        <button
                            onClick={() => setActiveTab("STEPPER")}
                            className={`flex items-center space-x-2 px-3.5 py-2 rounded-t-lg text-xs font-semibold transition-colors ${activeTab === "STEPPER"
                                ? "text-slate-700 border-t border-x border-gray-200"
                                : "bg-white text-gray-500 hover:text-gray-900 hover:bg-white/50"
                                }`}
                        >
                            <Edit3 className="w-4 h-4" />
                            <span>Formulaire Stepper</span>
                            {dossier.is_delegated && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-100 text-indigo-700 font-bold ml-1">
                                    Délégué
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => setActiveTab("DOCS")}
                            className={`flex items-center space-x-2 px-3.5 py-2 rounded-t-lg text-xs font-semibold transition-colors ${activeTab === "DOCS"
                                ? "text-slate-700 border-t border-x border-gray-200"
                                : "bg-white text-gray-500 hover:text-gray-900 hover:bg-white/50"
                                }`}
                        >
                            <FileText className="w-4 h-4" />
                            <span>Pièces ({dossier.documents?.length || 0})</span>
                        </button>

                        <button
                            onClick={() => setActiveTab("REQUESTS")}
                            className={`flex items-center space-x-2 px-3.5 py-2 rounded-t-lg text-xs font-semibold transition-colors ${activeTab === "REQUESTS"
                                ? "text-slate-700 border-t border-x border-gray-200"
                                : "bg-white text-gray-500 hover:text-gray-900 hover:bg-white/50"
                                }`}
                        >
                            <MessageSquare className="w-4 h-4" />
                            <span>Échanges ({dossier.dossierRequests?.length || 0})</span>
                            {dossier.dossierRequests?.some((r: any) => r.status === "PENDING" && r.messages?.[r.messages.length - 1]?.sender_type === "CLIENT") && (
                                <span className="flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-orange-500 rounded-full animate-bounce">
                                    !
                                </span>
                            )}
                        </button>

                        {dossier.plan_type === "PLAN_3" && (
                            <button
                                onClick={() => setActiveTab("POSTULATION")}
                                className={`flex items-center space-x-2 px-3.5 py-2 rounded-t-lg text-xs font-semibold transition-colors ${activeTab === "POSTULATION"
                                    ? "text-slate-700 border-t border-x border-gray-200"
                                    : "bg-white text-gray-500 hover:text-gray-900 hover:bg-white/50"
                                    }`}
                            >
                                <Compass className="w-4 h-4 text-emerald-600" />
                                <span className="text-emerald-700">Postulation Clé en Main</span>
                            </button>
                        )}
                    </div>

                    {/* CONTENU ONGLET ACTIF */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {/* ONGLET 1 : ÉDITEUR VISUEL DE DONNÉES & CODE */}
                        {activeTab === "JSON" && (
                            <div className="h-full flex flex-col">
                                <DossierDataFormEditor
                                    value={jsonObject}
                                    onChange={(updated) => {
                                        setJsonObject(updated);
                                        if (jsonError) setJsonError(null);
                                    }}
                                    onSave={handleSaveJson}
                                    isSaving={updateDataMutation.isPending}
                                    error={jsonError}
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
                                    {dossier.requirements
                                        ?.filter((req) => {
                                            const l = (req.label || "").toLowerCase();
                                            return !(
                                                l.includes("modèle j") ||
                                                l.includes("modele j") ||
                                                l.includes("synthèse") ||
                                                l.includes("synthese") ||
                                                l.includes("devis d'investissement") ||
                                                l.includes("devis dinvestissement") ||
                                                l.includes("rgularit")
                                            );
                                        })
                                        ?.map((req) => (
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
                                                        {Boolean(req.uploadedDocument.file_size) && (
                                                            <>
                                                                <span>•</span>
                                                                <span>{(Number(req.uploadedDocument.file_size) / 1024).toFixed(0)} KB</span>
                                                            </>
                                                        )}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2">
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
                                                    <label className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded text-xs font-semibold cursor-pointer transition-colors">
                                                        <UploadCloud className="w-3.5 h-3.5" />
                                                        <span>Déposer</span>
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            onChange={async (e) => {
                                                                if (e.target.files && e.target.files[0]) {
                                                                    const file = e.target.files[0];
                                                                    const fd = new FormData();
                                                                    fd.append("file", file);
                                                                    fd.append("requirement_id", String(req.id));
                                                                    try {
                                                                        await api.post(`/api/documents/${dossierId}/documents`, fd, {
                                                                            headers: { "Content-Type": "multipart/form-data" },
                                                                        });
                                                                        setFeedback({ type: "success", message: `Fichier téléversé pour ${req.label} !` });
                                                                        queryClient.invalidateQueries({ queryKey: ["adminDossier", dossierId] });
                                                                    } catch (err: any) {
                                                                        setFeedback({ type: "error", message: err.response?.data?.message || "Erreur upload" });
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                    </label>
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
                                                            <h4 className="text-xs font-bold text-gray-900">{req.documentType?.name || req.message}</h4>
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
                                                                        value={requestDocumentTypeId || ""}
                                                                        onChange={(e) => {
                                                                            const val = e.target.value ? Number(e.target.value) : null;
                                                                            setRequestDocumentTypeId(val);
                                                                            const selected = documentTypes.find((t: any) => t.id === val);
                                                                            setRequestMessage(selected ? selected.name : "");
                                                                        }}
                                                                        className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 focus:ring-1 focus:ring-slate-600 outline-none mb-3"
                                                                    >
                                                                        <option value="">Sélectionnez un document...</option>
                                                                        {documentTypes.filter((type: any) => type.is_active !== false).map((type: any) => (
                                                                            <option key={type.id} value={type.id}>{type.name}</option>
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

                        {/* ONGLET 4 : FORMULAIRE STEPPER COMPLET (Délégation & Complétion par le consultant) */}
                        {activeTab === "STEPPER" && (() => {
                            // Calculs dynamiques temps réel pour l'expert
                            const capexEtudes = Number(stepperFormData.capex_etudes) || 0;
                            const capexFoncier = stepperFormData.regime_foncier === "LOCATION" ? 0 : (Number(stepperFormData.capex_foncier) || 0);
                            const capexImmeuble = Number(stepperFormData.capex_immeuble) || 0;
                            const capexAmenagement = Number(stepperFormData.capex_amenagement) || 0;
                            const capexMateriel = Number(stepperFormData.capex_materiel) || 0;
                            const capexDivers = Number(stepperFormData.capex_divers) || 0;
                            const totalCapex = capexEtudes + capexFoncier + capexImmeuble + capexAmenagement + capexMateriel + capexDivers;

                            const selectedProv = getProvinceDetails(stepperFormData.region_id, stepperFormData.province_id);
                            const tauxTerritoriale = selectedProv?.rate || 0;
                            const tauxPrioritaire = stepperFormData.is_activite_prioritaire ? 0.10 : 0;
                            const emplois = Math.max(0, Number(stepperFormData.emplois_directs) || 0);
                            const ratioEmploiCapex = totalCapex > 0 ? (emplois / totalCapex) * 1000000 : 0;
                            let tauxEmploi = 0;
                            if (ratioEmploiCapex >= 2 && ratioEmploiCapex <= 5) tauxEmploi = 0.05;
                            else if (ratioEmploiCapex > 5 && ratioEmploiCapex <= 10) tauxEmploi = 0.07;
                            else if (ratioEmploiCapex > 10) tauxEmploi = 0.10;
                            const tauxGlobal = Math.min(0.30, tauxTerritoriale + tauxPrioritaire + tauxEmploi);
                            const montantSubventionEstime = totalCapex * tauxGlobal;

                            const filteredBranches = BRANCHES_ACTIVITE.filter(
                                (b: BrancheInfo) => !stepperFormData.secteur_activite || b.sectorCode === stepperFormData.secteur_activite
                            );

                            return (
                                <div className="space-y-6 pb-6">
                                    {dossier.is_delegated && (
                                        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center gap-3 text-indigo-900 shadow-xs">
                                            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700 shrink-0">
                                                <Edit3 className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold uppercase tracking-wider">Montage Délégué au Consultant (Plan 2)</h4>
                                                <p className="text-xs text-indigo-700 mt-0.5">
                                                    Le client a confié la saisie des caractéristiques du projet à l'expert. Complétez les paramètres et associez les 3 pièces maîtresses (reçues du client ou uploadées) pour déclencher l'extraction MLOps et hydrater le dossier d'investissement.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Barre de KPI & Actions */}
                                    <div className="bg-slate-900 text-white rounded-xl p-4 shadow-sm space-y-4">
                                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                            <div>
                                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Simulation en direct</span>
                                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                                    <span>Synthèse d'Éligibilité TPME</span>
                                                    {stepperFormData.is_activite_prioritaire && (
                                                        <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-bold">
                                                            +10% Prioritaire
                                                        </span>
                                                    )}
                                                </h3>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleSaveStepper(false, false)}
                                                    disabled={consultantSaveStepperMutation.isPending}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors border border-slate-700"
                                                >
                                                    {consultantSaveStepperMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                                    <span>Enregistrer brouillon</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleSaveStepper(true, true)}
                                                    disabled={consultantSaveStepperMutation.isPending}
                                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                                                >
                                                    {consultantSaveStepperMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-200" />}
                                                    <span>Valider & Déclencher IA (MLOps)</span>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-4 gap-3 text-center">
                                            <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700/60">
                                                <span className="text-[10px] text-slate-400 block font-medium">CAPEX Total</span>
                                                <span className="text-sm font-bold text-white">{formatMAD(totalCapex)}</span>
                                            </div>
                                            <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700/60">
                                                <span className="text-[10px] text-slate-400 block font-medium">Zonage Territoire</span>
                                                <span className="text-xs font-bold text-cyan-300">{selectedProv?.zone || "Hors Zone"} ({formatPercent(tauxTerritoriale)})</span>
                                            </div>
                                            <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700/60">
                                                <span className="text-[10px] text-slate-400 block font-medium">Prime Cumulée</span>
                                                <span className="text-sm font-bold text-emerald-400">{formatPercent(tauxGlobal)}</span>
                                            </div>
                                            <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700/60">
                                                <span className="text-[10px] text-slate-400 block font-medium">Subvention Estimée</span>
                                                <span className="text-sm font-bold text-amber-300">{formatMAD(montantSubventionEstime)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 1. LOCALISATION & FONCIER */}
                                    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-xs">
                                        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
                                            <Building2 className="w-4 h-4 text-slate-600" />
                                            <span>1. Localisation & Foncier (Territoire)</span>
                                        </h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-medium text-gray-700 mb-1">Région</label>
                                                <select
                                                    value={stepperFormData.region_id || ""}
                                                    onChange={(e) => {
                                                        const newRegion = e.target.value;
                                                        const provs = getProvincesForRegion(newRegion);
                                                        setStepperFormData({
                                                            ...stepperFormData,
                                                            region_id: newRegion,
                                                            province_id: provs[0]?.id || "",
                                                        });
                                                    }}
                                                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                                                >
                                                    <option value="">Sélectionnez une région...</option>
                                                    {REGIONS_ET_PROVINCES.map((reg) => (
                                                        <option key={reg.id} value={reg.id}>{reg.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-medium text-gray-700 mb-1">Province / Préfecture</label>
                                                <select
                                                    value={stepperFormData.province_id || ""}
                                                    onChange={(e) => setStepperFormData({ ...stepperFormData, province_id: e.target.value })}
                                                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                                                >
                                                    <option value="">Sélectionnez une province...</option>
                                                    {getProvincesForRegion(stepperFormData.region_id).map((prov) => (
                                                        <option key={prov.id} value={prov.id}>
                                                            {prov.label} — {prov.zone} ({formatPercent(prov.rate)})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-[11px] font-medium text-gray-700 mb-1">Adresse complète d'implantation</label>
                                                <input
                                                    type="text"
                                                    value={stepperFormData.adresse_projet || ""}
                                                    onChange={(e) => setStepperFormData({ ...stepperFormData, adresse_projet: e.target.value })}
                                                    placeholder="Ex: Parc Industriel CFCIM, Lot 42, Bouskoura"
                                                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-medium text-gray-700 mb-1">Coordonnées GPS (Optionnel)</label>
                                                <input
                                                    type="text"
                                                    value={stepperFormData.gps_coordinates || ""}
                                                    onChange={(e) => setStepperFormData({ ...stepperFormData, gps_coordinates: e.target.value })}
                                                    placeholder="Ex: 33.4485, -7.6321"
                                                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-medium text-gray-700 mb-1">Régime foncier</label>
                                                <select
                                                    value={stepperFormData.regime_foncier || "LOCATION"}
                                                    onChange={(e) => setStepperFormData({ ...stepperFormData, regime_foncier: e.target.value })}
                                                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                                                >
                                                    <option value="LOCATION">Bail commercial / Location</option>
                                                    <option value="ACQUISITION">Acquisition / Propriété foncière</option>
                                                </select>
                                            </div>
                                            {stepperFormData.regime_foncier === "ACQUISITION" && (
                                                <div className="col-span-2">
                                                    <label className="block text-[11px] font-medium text-gray-700 mb-1">Titre Foncier / Référence de Propriété</label>
                                                    <input
                                                        type="text"
                                                        value={stepperFormData.titre_foncier || ""}
                                                        onChange={(e) => setStepperFormData({ ...stepperFormData, titre_foncier: e.target.value })}
                                                        placeholder="Ex: TF 12345/C"
                                                        className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* 2. AMBITION & CARACTÉRISTIQUES */}
                                    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-xs">
                                        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
                                            <Briefcase className="w-4 h-4 text-slate-600" />
                                            <span>2. Ambition, Secteur & Primes Charte</span>
                                        </h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-medium text-gray-700 mb-1">Nature du projet</label>
                                                <select
                                                    value={stepperFormData.nature_projet || "CREATION"}
                                                    onChange={(e) => setStepperFormData({ ...stepperFormData, nature_projet: e.target.value })}
                                                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                                                >
                                                    <option value="CREATION">Création d'entreprise (Greenfield)</option>
                                                    <option value="EXTENSION">Extension & Développement (Brownfield)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-medium text-gray-700 mb-1">Emplois directs stables prévus</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={stepperFormData.emplois_directs ?? 3}
                                                    onChange={(e) => setStepperFormData({ ...stepperFormData, emplois_directs: parseInt(e.target.value, 10) || 0 })}
                                                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-medium text-gray-700 mb-1">Secteur d'activité officiel</label>
                                                <select
                                                    value={stepperFormData.secteur_activite || ""}
                                                    onChange={(e) => {
                                                        const newSec = e.target.value;
                                                        const secBranches = BRANCHES_ACTIVITE.filter((b: BrancheInfo) => b.sectorCode === newSec);
                                                        setStepperFormData({
                                                            ...stepperFormData,
                                                            secteur_activite: newSec,
                                                            branche_activite: secBranches[0]?.label || "",
                                                            is_activite_prioritaire: secBranches[0]?.isPrioritaire || false,
                                                        });
                                                    }}
                                                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                                                >
                                                    <option value="">Sélectionnez un secteur...</option>
                                                    {SECTEURS_ACTIVITE.map((sec: SecteurInfo) => (
                                                        <option key={sec.code} value={sec.code}>{sec.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-medium text-gray-700 mb-1">Filière / Branche précise</label>
                                                <select
                                                    value={stepperFormData.branche_activite || ""}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        const matchedBranch = BRANCHES_ACTIVITE.find((b: BrancheInfo) => b.label === val);
                                                        setStepperFormData({
                                                            ...stepperFormData,
                                                            branche_activite: val,
                                                            is_activite_prioritaire: matchedBranch?.isPrioritaire || stepperFormData.is_activite_prioritaire,
                                                        });
                                                    }}
                                                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                                                >
                                                    <option value="">Sélectionnez une filière...</option>
                                                    {filteredBranches.map((br: BrancheInfo) => (
                                                        <option key={br.id} value={br.label}>
                                                            {br.label} {br.isPrioritaire ? "★ (Prioritaire)" : ""}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Toggle Activité Prioritaire (Prime sectorielle +10%) */}
                                            <div className="col-span-2 p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-center justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <Sparkles className="w-4 h-4 text-amber-600" />
                                                        <span className="text-xs font-bold text-amber-950">Bonus Prime Sectorielle (+10%)</span>
                                                    </div>
                                                    <p className="text-[11px] text-amber-800 mt-0.5">
                                                        Cochez si l'activité relève des secteurs prioritaires définis par le décret de la Charte de l'Investissement (Métiers mondiaux, transition écologique, souveraineté).
                                                    </p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                                    <input
                                                        type="checkbox"
                                                        checked={Boolean(stepperFormData.is_activite_prioritaire)}
                                                        onChange={(e) => setStepperFormData({ ...stepperFormData, is_activite_prioritaire: e.target.checked })}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                                                </label>
                                            </div>

                                            <div className="col-span-2">
                                                <label className="block text-[11px] font-medium text-gray-700 mb-1">Banque Partenaire / Chef de file</label>
                                                <select
                                                    value={stepperFormData.banque_partenaire || "AWB"}
                                                    onChange={(e) => setStepperFormData({ ...stepperFormData, banque_partenaire: e.target.value })}
                                                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                                                >
                                                    {BANQUES_PARTENAIRES.map((bank) => (
                                                        <option key={bank.code} value={bank.code}>{bank.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 3. PROGRAMME D'INVESTISSEMENT CAPEX */}
                                    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-xs">
                                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                                                <Coins className="w-4 h-4 text-slate-600" />
                                                <span>3. Programme d'Investissement CAPEX (MAD HT)</span>
                                            </h4>
                                            <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                                                Total : {formatMAD(totalCapex)}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-medium text-gray-700 mb-1">Matériel & Outillage de Production</label>
                                                <input
                                                    type="number"
                                                    value={stepperFormData.capex_materiel ?? 0}
                                                    onChange={(e) => setStepperFormData({ ...stepperFormData, capex_materiel: parseFloat(e.target.value) || 0 })}
                                                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-medium text-gray-700 mb-1">Aménagements & Travaux</label>
                                                <input
                                                    type="number"
                                                    value={stepperFormData.capex_amenagement ?? 0}
                                                    onChange={(e) => setStepperFormData({ ...stepperFormData, capex_amenagement: parseFloat(e.target.value) || 0 })}
                                                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-medium text-gray-700 mb-1">Constructions / Bâtiments Industriels</label>
                                                <input
                                                    type="number"
                                                    value={stepperFormData.capex_immeuble ?? 0}
                                                    onChange={(e) => setStepperFormData({ ...stepperFormData, capex_immeuble: parseFloat(e.target.value) || 0 })}
                                                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-medium text-gray-700 mb-1">Foncier / Terrain (si acquisition)</label>
                                                <input
                                                    type="number"
                                                    disabled={stepperFormData.regime_foncier === "LOCATION"}
                                                    value={stepperFormData.regime_foncier === "LOCATION" ? 0 : (stepperFormData.capex_foncier ?? 0)}
                                                    onChange={(e) => setStepperFormData({ ...stepperFormData, capex_foncier: parseFloat(e.target.value) || 0 })}
                                                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600 disabled:bg-gray-100 disabled:text-gray-400"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-medium text-gray-700 mb-1">Études, R&D & Conseils</label>
                                                <input
                                                    type="number"
                                                    value={stepperFormData.capex_etudes ?? 0}
                                                    onChange={(e) => setStepperFormData({ ...stepperFormData, capex_etudes: parseFloat(e.target.value) || 0 })}
                                                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-medium text-gray-700 mb-1">Frais préliminaires & Divers</label>
                                                <input
                                                    type="number"
                                                    value={stepperFormData.capex_divers ?? 0}
                                                    onChange={(e) => setStepperFormData({ ...stepperFormData, capex_divers: parseFloat(e.target.value) || 0 })}
                                                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* 4. FINANCEMENT & EXPLOITATION */}
                                    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-xs">
                                        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
                                            <PieChart className="w-4 h-4 text-slate-600" />
                                            <span>4. Structure de Financement & Exploitation</span>
                                        </h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-medium text-gray-700 mb-1">Mode de Financement</label>
                                                <select
                                                    value={stepperFormData.mode_financement || "100_FONDS_PROPRES"}
                                                    onChange={(e) => {
                                                        const mode = e.target.value;
                                                        setStepperFormData({
                                                            ...stepperFormData,
                                                            mode_financement: mode,
                                                            part_fonds_propres: mode === "100_FONDS_PROPRES" ? 100 : (stepperFormData.part_fonds_propres || 30),
                                                            montant_dette: mode === "100_FONDS_PROPRES" ? 0 : (totalCapex * 0.7),
                                                        });
                                                    }}
                                                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                                                >
                                                    <option value="100_FONDS_PROPRES">100% Fonds Propres (Autofinancement)</option>
                                                    <option value="MIXTE">Mixte (Fonds Propres + Crédit d'Investissement)</option>
                                                </select>
                                            </div>

                                            {stepperFormData.mode_financement === "MIXTE" ? (
                                                <>
                                                    <div>
                                                        <label className="block text-[11px] font-medium text-gray-700 mb-1">Part Fonds Propres (%)</label>
                                                        <input
                                                            type="number"
                                                            min="10"
                                                            max="90"
                                                            value={stepperFormData.part_fonds_propres ?? 30}
                                                            onChange={(e) => {
                                                                const fp = parseFloat(e.target.value) || 0;
                                                                setStepperFormData({
                                                                    ...stepperFormData,
                                                                    part_fonds_propres: fp,
                                                                    montant_dette: (totalCapex * (100 - fp)) / 100,
                                                                });
                                                            }}
                                                            className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[11px] font-medium text-gray-700 mb-1">Taux d'intérêt de la dette (%)</label>
                                                        <input
                                                            type="number"
                                                            step="0.1"
                                                            value={stepperFormData.dette_taux ?? 6.5}
                                                            onChange={(e) => setStepperFormData({ ...stepperFormData, dette_taux: parseFloat(e.target.value) || 0 })}
                                                            className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[11px] font-medium text-gray-700 mb-1">Durée du crédit (Années)</label>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            max="15"
                                                            value={stepperFormData.dette_duree ?? 7}
                                                            onChange={(e) => setStepperFormData({ ...stepperFormData, dette_duree: parseInt(e.target.value, 10) || 7 })}
                                                            className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                                                        />
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex items-center text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3">
                                                    Aucun endettement bancaire prévu pour ce projet.
                                                </div>
                                            )}

                                            <div>
                                                <label className="block text-[11px] font-medium text-gray-700 mb-1">Année de démarrage d'exploitation</label>
                                                <input
                                                    type="number"
                                                    value={stepperFormData.annee_demarrage ?? new Date().getFullYear()}
                                                    onChange={(e) => setStepperFormData({ ...stepperFormData, annee_demarrage: parseInt(e.target.value, 10) || new Date().getFullYear() })}
                                                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-medium text-gray-700 mb-1">CA Cible Croisière (MAD/an)</label>
                                                <input
                                                    type="number"
                                                    value={stepperFormData.ca_cible_croisiere ?? 0}
                                                    onChange={(e) => setStepperFormData({ ...stepperFormData, ca_cible_croisiere: parseFloat(e.target.value) || 0 })}
                                                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-medium text-gray-700 mb-1">Profil de Montée en Charge</label>
                                                <select
                                                    value={stepperFormData.profil_montee_charge || "STANDARD"}
                                                    onChange={(e) => setStepperFormData({ ...stepperFormData, profil_montee_charge: e.target.value })}
                                                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                                                >
                                                    {PROFILS_MONTEE_CHARGE.map((p) => (
                                                        <option key={p.id} value={p.id}>{p.label} ({p.description})</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-medium text-gray-700 mb-1">Ratio COGS / Achats consommés (%)</label>
                                                <input
                                                    type="number"
                                                    value={stepperFormData.ratio_cogs ?? 25}
                                                    onChange={(e) => setStepperFormData({ ...stepperFormData, ratio_cogs: parseFloat(e.target.value) || 0 })}
                                                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-medium text-gray-700 mb-1">Salaire moyen brut (MAD/mois)</label>
                                                <input
                                                    type="number"
                                                    value={stepperFormData.salaire_moyen_brut ?? 4500}
                                                    onChange={(e) => setStepperFormData({ ...stepperFormData, salaire_moyen_brut: parseFloat(e.target.value) || 0 })}
                                                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-medium text-gray-700 mb-1">Part Exportée du CA (%)</label>
                                                <input
                                                    type="number"
                                                    value={stepperFormData.part_export ?? 0}
                                                    onChange={(e) => setStepperFormData({ ...stepperFormData, part_export: parseFloat(e.target.value) || 0 })}
                                                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* 5. RÉFÉRENCEMENT & TÉLÉVERSEMENT DES PIÈCES OFFICIELLES (MLOps) */}
                                    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4 shadow-xs">
                                        <div className="border-b border-gray-100 pb-2">
                                            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                                                <Layers className="w-4 h-4 text-indigo-600" />
                                                <span>5. Pièces Justificatives Officielles & Transmission MLOps</span>
                                            </h4>
                                            <p className="text-[11px] text-gray-500 mt-0.5">
                                                Pour chaque pièce obligatoire, sélectionnez un document déjà transmis par le client dans les échanges, ou téléversez directement le PDF si vous l'avez reçu par ailleurs.
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            {/* Slot 1 : Attestation Fiscale */}
                                            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                                                        <span className="text-xs font-bold text-gray-900">
                                                            Attestation de Régularité Fiscale (DGI)
                                                        </span>
                                                    </div>
                                                    {fileFiscaleUpload ? (
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                                                            <FileCheck2 className="w-3 h-3" /> Nouveau fichier prêt
                                                        </span>
                                                    ) : fileFiscaleRef ? (
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                                                            <CheckCircle2 className="w-3 h-3" /> Fichier client référencé
                                                        </span>
                                                    ) : existingFiscaleDoc ? (
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-100 text-green-800 border border-green-200 flex items-center gap-1">
                                                            <CheckCircle2 className="w-3 h-3" /> Déjà présent sur le dossier
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                                                            En attente de rattachement
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Détails du document actuellement actif */}
                                                {(fileFiscaleUpload || fileFiscaleRef || existingFiscaleDoc) && (
                                                    <div className="p-2 bg-white rounded-lg border border-slate-200 text-xs flex items-center justify-between">
                                                        <div className="truncate flex items-center gap-1.5 text-gray-800">
                                                            <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                                            <span className="font-semibold truncate">
                                                                {fileFiscaleUpload?.name || fileFiscaleRef?.name || existingFiscaleDoc?.original_name || existingFiscaleDoc?.filename}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 shrink-0">
                                                            {(fileFiscaleRef?.url || existingFiscaleDoc?.file_path) && (
                                                                <a
                                                                    href={fileFiscaleRef?.url || `${import.meta.env.VITE_BACKEND_API_URL || ""}/${existingFiscaleDoc?.file_path || ""}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-[11px] text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
                                                                >
                                                                    <Download className="w-3 h-3" /> Aperçu
                                                                </a>
                                                            )}
                                                            {(fileFiscaleUpload || fileFiscaleRef) && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setFileFiscaleUpload(null);
                                                                        setFileFiscaleRef(null);
                                                                    }}
                                                                    className="text-red-500 hover:text-red-700 text-xs p-1"
                                                                    title="Détacher"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-2 gap-2 pt-1">
                                                    <div>
                                                        <label className="block text-[10px] font-medium text-gray-500 mb-1">
                                                            Option A : Sélectionner parmi les fichiers reçus du client
                                                        </label>
                                                        <select
                                                            value={fileFiscaleRef?.filename || ""}
                                                            onChange={(e) => {
                                                                const chosen = availableClientFiles.find((f) => f.filename === e.target.value);
                                                                setFileFiscaleRef(chosen || null);
                                                                if (chosen) setFileFiscaleUpload(null);
                                                            }}
                                                            className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-800 outline-none focus:ring-1 focus:ring-indigo-600"
                                                        >
                                                            <option value="">-- Choisir un document client ({availableClientFiles.length} dispo) --</option>
                                                            {availableClientFiles.map((file) => (
                                                                <option key={file.id} value={file.filename}>
                                                                    {file.name} ({file.source})
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-medium text-gray-500 mb-1">
                                                            Option B : Ou téléverser directement le PDF
                                                        </label>
                                                        <label className="flex items-center justify-center gap-1.5 p-2 bg-white hover:bg-slate-50 border border-dashed border-gray-300 hover:border-indigo-400 rounded-lg text-xs text-gray-600 hover:text-indigo-700 cursor-pointer transition-colors">
                                                            <UploadCloud className="w-3.5 h-3.5" />
                                                            <span>{fileFiscaleUpload ? fileFiscaleUpload.name : "Téléverser nouveau PDF"}</span>
                                                            <input
                                                                type="file"
                                                                accept="application/pdf"
                                                                className="hidden"
                                                                onChange={(e) => {
                                                                    if (e.target.files && e.target.files[0]) {
                                                                        setFileFiscaleUpload(e.target.files[0]);
                                                                        setFileFiscaleRef(null);
                                                                    }
                                                                }}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Slot 2 : Registre de Commerce (Modèle 7) */}
                                            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                                                        <span className="text-xs font-bold text-gray-900">
                                                            Registre de Commerce (Modèle 7 / RC)
                                                        </span>
                                                    </div>
                                                    {fileRCUpload ? (
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                                                            <FileCheck2 className="w-3 h-3" /> Nouveau fichier prêt
                                                        </span>
                                                    ) : fileRCRef ? (
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                                                            <CheckCircle2 className="w-3 h-3" /> Fichier client référencé
                                                        </span>
                                                    ) : existingRCDoc ? (
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-100 text-green-800 border border-green-200 flex items-center gap-1">
                                                            <CheckCircle2 className="w-3 h-3" /> Déjà présent sur le dossier
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                                                            En attente de rattachement
                                                        </span>
                                                    )}
                                                </div>

                                                {(fileRCUpload || fileRCRef || existingRCDoc) && (
                                                    <div className="p-2 bg-white rounded-lg border border-slate-200 text-xs flex items-center justify-between">
                                                        <div className="truncate flex items-center gap-1.5 text-gray-800">
                                                            <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                                            <span className="font-semibold truncate">
                                                                {fileRCUpload?.name || fileRCRef?.name || existingRCDoc?.original_name || existingRCDoc?.filename}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 shrink-0">
                                                            {(fileRCRef?.url || existingRCDoc?.file_path) && (
                                                                <a
                                                                    href={fileRCRef?.url || `${import.meta.env.VITE_BACKEND_API_URL || ""}/${existingRCDoc?.file_path || ""}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-[11px] text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
                                                                >
                                                                    <Download className="w-3 h-3" /> Aperçu
                                                                </a>
                                                            )}
                                                            {(fileRCUpload || fileRCRef) && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setFileRCUpload(null);
                                                                        setFileRCRef(null);
                                                                    }}
                                                                    className="text-red-500 hover:text-red-700 text-xs p-1"
                                                                    title="Détacher"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-2 gap-2 pt-1">
                                                    <div>
                                                        <label className="block text-[10px] font-medium text-gray-500 mb-1">
                                                            Option A : Sélectionner parmi les fichiers reçus du client
                                                        </label>
                                                        <select
                                                            value={fileRCRef?.filename || ""}
                                                            onChange={(e) => {
                                                                const chosen = availableClientFiles.find((f) => f.filename === e.target.value);
                                                                setFileRCRef(chosen || null);
                                                                if (chosen) setFileRCUpload(null);
                                                            }}
                                                            className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-800 outline-none focus:ring-1 focus:ring-indigo-600"
                                                        >
                                                            <option value="">-- Choisir un document client ({availableClientFiles.length} dispo) --</option>
                                                            {availableClientFiles.map((file) => (
                                                                <option key={file.id} value={file.filename}>
                                                                    {file.name} ({file.source})
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-medium text-gray-500 mb-1">
                                                            Option B : Ou téléverser directement le PDF
                                                        </label>
                                                        <label className="flex items-center justify-center gap-1.5 p-2 bg-white hover:bg-slate-50 border border-dashed border-gray-300 hover:border-indigo-400 rounded-lg text-xs text-gray-600 hover:text-indigo-700 cursor-pointer transition-colors">
                                                            <UploadCloud className="w-3.5 h-3.5" />
                                                            <span>{fileRCUpload ? fileRCUpload.name : "Téléverser nouveau PDF"}</span>
                                                            <input
                                                                type="file"
                                                                accept="application/pdf"
                                                                className="hidden"
                                                                onChange={(e) => {
                                                                    if (e.target.files && e.target.files[0]) {
                                                                        setFileRCUpload(e.target.files[0]);
                                                                        setFileRCRef(null);
                                                                    }
                                                                }}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Slot 3 : Attestation CNSS */}
                                            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                                                        <span className="text-xs font-bold text-gray-900">
                                                            Attestation d'Affiliation CNSS
                                                        </span>
                                                    </div>
                                                    {fileCNSSUpload ? (
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                                                            <FileCheck2 className="w-3 h-3" /> Nouveau fichier prêt
                                                        </span>
                                                    ) : fileCNSSRef ? (
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                                                            <CheckCircle2 className="w-3 h-3" /> Fichier client référencé
                                                        </span>
                                                    ) : existingCNSSDoc ? (
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-100 text-green-800 border border-green-200 flex items-center gap-1">
                                                            <CheckCircle2 className="w-3 h-3" /> Déjà présent sur le dossier
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                                                            En attente de rattachement
                                                        </span>
                                                    )}
                                                </div>

                                                {(fileCNSSUpload || fileCNSSRef || existingCNSSDoc) && (
                                                    <div className="p-2 bg-white rounded-lg border border-slate-200 text-xs flex items-center justify-between">
                                                        <div className="truncate flex items-center gap-1.5 text-gray-800">
                                                            <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                                            <span className="font-semibold truncate">
                                                                {fileCNSSUpload?.name || fileCNSSRef?.name || existingCNSSDoc?.original_name || existingCNSSDoc?.filename}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 shrink-0">
                                                            {(fileCNSSRef?.url || existingCNSSDoc?.file_path) && (
                                                                <a
                                                                    href={fileCNSSRef?.url || `${import.meta.env.VITE_BACKEND_API_URL || ""}/${existingCNSSDoc?.file_path || ""}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-[11px] text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
                                                                >
                                                                    <Download className="w-3 h-3" /> Aperçu
                                                                </a>
                                                            )}
                                                            {(fileCNSSUpload || fileCNSSRef) && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setFileCNSSUpload(null);
                                                                        setFileCNSSRef(null);
                                                                    }}
                                                                    className="text-red-500 hover:text-red-700 text-xs p-1"
                                                                    title="Détacher"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-2 gap-2 pt-1">
                                                    <div>
                                                        <label className="block text-[10px] font-medium text-gray-500 mb-1">
                                                            Option A : Sélectionner parmi les fichiers reçus du client
                                                        </label>
                                                        <select
                                                            value={fileCNSSRef?.filename || ""}
                                                            onChange={(e) => {
                                                                const chosen = availableClientFiles.find((f) => f.filename === e.target.value);
                                                                setFileCNSSRef(chosen || null);
                                                                if (chosen) setFileCNSSUpload(null);
                                                            }}
                                                            className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-800 outline-none focus:ring-1 focus:ring-indigo-600"
                                                        >
                                                            <option value="">-- Choisir un document client ({availableClientFiles.length} dispo) --</option>
                                                            {availableClientFiles.map((file) => (
                                                                <option key={file.id} value={file.filename}>
                                                                    {file.name} ({file.source})
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-medium text-gray-500 mb-1">
                                                            Option B : Ou téléverser directement le PDF
                                                        </label>
                                                        <label className="flex items-center justify-center gap-1.5 p-2 bg-white hover:bg-slate-50 border border-dashed border-gray-300 hover:border-indigo-400 rounded-lg text-xs text-gray-600 hover:text-indigo-700 cursor-pointer transition-colors">
                                                            <UploadCloud className="w-3.5 h-3.5" />
                                                            <span>{fileCNSSUpload ? fileCNSSUpload.name : "Téléverser nouveau PDF"}</span>
                                                            <input
                                                                type="file"
                                                                accept="application/pdf"
                                                                className="hidden"
                                                                onChange={(e) => {
                                                                    if (e.target.files && e.target.files[0]) {
                                                                        setFileCNSSUpload(e.target.files[0]);
                                                                        setFileCNSSRef(null);
                                                                    }
                                                                }}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* ONGLET 5 : POSTULATION CLÉ EN MAIN (Plan 3) */}
                        {activeTab === "POSTULATION" && (
                            <div className="space-y-6 pb-6">
                                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-950 shadow-xs">
                                    <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700 shrink-0">
                                        <Compass className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider">Pilotage de la Postulation Administrative (Plan 3)</h4>
                                        <p className="text-xs text-emerald-800 mt-0.5">
                                            Le cabinet Tamkeen gère l'ensemble du dépôt et des démarches administratives. Mettez à jour le jalon pour notifier instantanément le client.
                                        </p>
                                    </div>
                                </div>

                                {/* Formulaire de mise à jour du Jalon */}
                                <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                                    <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                                        Faire avancer la postulation
                                    </h3>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Jalon actuel
                                            </label>
                                            <select
                                                value={postulationStep}
                                                onChange={(e) => setPostulationStep(parseInt(e.target.value, 10))}
                                                className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-emerald-600"
                                            >
                                                <option value={1}>Étape 1 : Dépôt initial du dossier de subvention</option>
                                                <option value={2}>Étape 2 : Passage en Commission Régionale d'Investissement</option>
                                                <option value={3}>Étape 3 : Instruction & Audit technique / financier</option>
                                                <option value={4}>Étape 4 : Accord officiel & Signature de la convention</option>
                                                <option value={5}>Étape 5 : Déblocage effectif des fonds de subvention</option>
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    N° Référence / Bordereau administratif
                                                </label>
                                                <input
                                                    type="text"
                                                    value={postulationRef}
                                                    onChange={(e) => setPostulationRef(e.target.value)}
                                                    placeholder="Ex: CRI-CAS-2026-9812"
                                                    className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-emerald-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    Statut du jalon
                                                </label>
                                                <select
                                                    value={postulationStatus}
                                                    onChange={(e) => setPostulationStatus(e.target.value)}
                                                    className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-emerald-600"
                                                >
                                                    <option value="IN_PROGRESS">En cours d'instruction</option>
                                                    <option value="VALIDATED">Jalon validé avec succès</option>
                                                    <option value="ACTION_REQUIRED">Complément requis par l'organisme</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Note explicative ou compte-rendu pour le client
                                            </label>
                                            <textarea
                                                value={postulationNotes}
                                                onChange={(e) => setPostulationNotes(e.target.value)}
                                                rows={3}
                                                placeholder="Ex: Le dossier a été présenté en commission ce matin avec un avis favorable unanime..."
                                                className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-emerald-600 resize-none"
                                            />
                                        </div>

                                        <div className="flex justify-end pt-2">
                                            <button
                                                type="button"
                                                onClick={() => updatePostulationMutation.mutate({
                                                    step: postulationStep,
                                                    reference: postulationRef,
                                                    notes: postulationNotes,
                                                    status: postulationStatus,
                                                })}
                                                disabled={updatePostulationMutation.isPending}
                                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
                                            >
                                                {updatePostulationMutation.isPending ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Send className="w-4 h-4" />
                                                )}
                                                <span>Mettre à jour le jalon & Notifier le client</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Historique des jalons */}
                                {dossier.postulation_data?.history && dossier.postulation_data.history.length > 0 && (
                                    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
                                        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                                            Historique des avancées administratives
                                        </h4>
                                        <div className="space-y-2">
                                            {dossier.postulation_data.history.map((entry: any, index: number) => (
                                                <div key={index} className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs">
                                                    <div className="flex items-center justify-between font-semibold text-gray-900 mb-1">
                                                        <span>Jalon {entry.step}</span>
                                                        <span className="text-[10px] text-gray-500 font-normal">
                                                            {new Date(entry.updated_at).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    {entry.notes && <p className="text-gray-700">{entry.notes}</p>}
                                                    {entry.reference && <p className="text-[11px] text-gray-500 mt-1 font-mono">Réf: {entry.reference}</p>}
                                                </div>
                                            ))}
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

                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => refetchReport()}
                                disabled={isReportFetching}
                                className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-gray-900 rounded transition-colors"
                                title="Rafraîchir la prévisualisation"
                            >
                                <RefreshCw className={`w-3.5 h-3.5 ${isReportFetching ? "animate-spin" : ""}`} />
                            </button>

                            <button
                                onClick={() => setIsModalOpen(true)}
                                disabled={!reportHtml}
                                className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-gray-900 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                title="Agrandir le rapport (Plein écran)"
                            >
                                <Maximize2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
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

            {/* MODAL PROFESSIONNEL ET MINIMAL POUR APERÇU DU RAPPORT EN GRAND */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setIsModalOpen(false);
                    }}
                >
                    <div className="relative w-full max-w-6xl h-[92vh] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
                        {/* Header Modal */}
                        <div className="h-14 border-b border-gray-200 bg-slate-50 px-5 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
                                    <FileText className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 leading-none">
                                        Rapport d'Investissement - Dossier #{dossierId}
                                    </h3>
                                    <span className="text-[11px] text-gray-500 mt-1 inline-block">
                                        Prévisualisation haute fidélité (Aperçu du livrable final)
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => refetchReport()}
                                    disabled={isReportFetching}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-semibold shadow-xs transition-colors"
                                    title="Rafraîchir"
                                >
                                    <RefreshCw className={`w-3.5 h-3.5 ${isReportFetching ? "animate-spin text-blue-600" : ""}`} />
                                    <span>Rafraîchir</span>
                                </button>

                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-1.5 hover:bg-gray-200 text-gray-500 hover:text-gray-900 rounded-lg transition-colors ml-1"
                                    title="Fermer (Échap)"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Corps Modal */}
                        <div className="flex-1 w-full h-full bg-slate-100 p-2 sm:p-4 overflow-hidden">
                            {isReportLoading ? (
                                <div className="w-full h-full flex items-center justify-center bg-white border border-gray-200 rounded-lg">
                                    <div className="flex flex-col items-center gap-2 text-gray-500">
                                        <Loader2 className="w-8 h-8 animate-spin text-slate-600" />
                                        <span className="text-xs">Chargement du rapport...</span>
                                    </div>
                                </div>
                            ) : reportHtml ? (
                                <iframe
                                    srcDoc={reportHtml}
                                    title="Rapport d'Investissement Plein Écran"
                                    className="w-full h-full border border-gray-200 rounded-lg bg-white shadow-sm"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-white border border-gray-200 rounded-lg text-gray-400 text-xs">
                                    Aucun contenu disponible.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* NOTIFICATION FLOTTANTE (TOAST) : Discrète, moderne et n'impacte pas le layout */}
            {feedback && (
                <div
                    className={`
            fixed bottom-6 right-6 z-50
            flex items-center gap-3
            px-4 py-3
            rounded-xl
            border
            shadow-xl
            text-xs sm:text-sm
            font-medium
            transition-all duration-300
            ${feedback.type === "success"
                            ? "bg-slate-900 text-emerald-300 border-slate-700 shadow-slate-900/30"
                            : "bg-red-900 text-white border-red-700 shadow-red-900/30"
                        }
          `}
                >
                    {feedback.type === "success" ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    ) : (
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    )}

                    <span className="max-w-md">{feedback.message}</span>

                    <button
                        onClick={() => setFeedback(null)}
                        className="p-1 hover:bg-white/10 rounded text-slate-300 hover:text-white transition-colors ml-2"
                        title="Fermer"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default DossierReviewStudio;