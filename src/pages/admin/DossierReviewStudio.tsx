import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, AlertCircle, CheckCircle2, X } from "lucide-react";
import { adminDossierService } from "../../services/adminDossierService";
import type { CreateConsultantRequestPayload } from "../../types/adminDossier";
import { ADMIN_FRONT_PREFIX } from "../../api/axios";
import api, { ADMIN_API_PREFIX } from "../../api/axios";
import { DossierDataFormEditor } from "../../components/admin/DossierDataFormEditor";
import { StudioHeader } from "../../components/admin/studio/StudioHeader";
import { StudioTabsBar } from "../../components/admin/studio/StudioTabsBar";
import { StudioDocsTab } from "../../components/admin/studio/StudioDocsTab";
import { StudioRequestsTab } from "../../components/admin/studio/StudioRequestsTab";
import { StudioStepperTab } from "../../components/admin/studio/StudioStepperTab";
import { StudioPostulationTab } from "../../components/admin/studio/StudioPostulationTab";
import { StudioReportPreview } from "../../components/admin/studio/StudioReportPreview";
import { StudioReportModal } from "../../components/admin/studio/StudioReportModal";
import { StudioReplacementModal } from "../../components/admin/studio/StudioReplacementModal";
import type { StudioTabKey, ReplacementModalState, StudioPieceItem } from "../../components/admin/studio/studioTypes";
import { isCoreRequiredDoc } from "../../components/admin/studio/studioUtils";

export const DossierReviewStudio: React.FC = () => {
    const { dossierId: paramDossierId } = useParams<{ dossierId: string }>();
    const dossierId = parseInt(paramDossierId || "0", 10);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Onglet actif du panneau de gauche: 'JSON' | 'DOCS' | 'REQUESTS' | 'STEPPER' | 'POSTULATION'
    const [activeTab, setActiveTab] = useState<StudioTabKey>("JSON");

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

    // Formulaire de message direct / échange (Plan 2)
    const [requestMessage, setRequestMessage] = useState<string>("");
    const [requestError, setRequestError] = useState<string | null>(null);

    // Messagerie & Thread (Plan 2)
    const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
    const [replyMessage, setReplyMessage] = useState("");
    const [replyFile, setReplyFile] = useState<File | null>(null);

    // Notifications / Feedback (Toast flottant)
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // Modal plein écran pour l'aperçu du rapport
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Modal de clarification / demande de remplacement d'une pièce
    const [replacementModal, setReplacementModal] = useState<ReplacementModalState>({
        isOpen: false,
        docTypeId: null,
        docTypeName: "",
        clarification: "",
    });

    const [validatedDocs, setValidatedDocs] = useState<Record<string, boolean>>({});

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
    const allPiecesList = useMemo((): StudioPieceItem[] => {
        if (!dossier) return [];

        const activeDocTypes = documentTypes.filter((t: any) => t.is_active !== false);

        // Map existing requirements by normalized label
        const requirementsMap = new Map<string, any>();
        dossier.requirements?.forEach((req: any) => {
            if (req.label) {
                requirementsMap.set(req.label.trim().toLowerCase(), req);
            }
        });

        // Map file requests by document_type_id and label
        const requestsByDocType = new Map<number, any>();
        const requestsByLabel = new Map<string, any>();
        dossier.dossierRequests?.filter((r: any) => r.input_type === "FILE").forEach((req: any) => {
            if (req.document_type_id) {
                requestsByDocType.set(req.document_type_id, req);
            }
            if (req.message) {
                requestsByLabel.set(req.message.trim().toLowerCase(), req);
            }
        });

        const processedLabels = new Set<string>();
        const result: StudioPieceItem[] = [];

        // 1. Types de documents prédéfinis du système
        activeDocTypes.forEach((docType: any) => {
            const normLabel = docType.name.trim().toLowerCase();
            processedLabels.add(normLabel);

            const req = requirementsMap.get(normLabel);
            const fileReq = requestsByDocType.get(docType.id) || requestsByLabel.get(normLabel);

            const reqDoc = req?.uploadedDocument;
            const requestAttachment = fileReq?.messages?.slice().reverse().find((m: any) => m.attachment_url);

            const hasUploadedFile = Boolean(reqDoc || requestAttachment || (req?.status === "UPLOADED"));

            let fileUrl = "";
            let fileName = "";
            let fileSize = 0;
            let uploadedDate = "";

            if (reqDoc) {
                fileUrl = `${import.meta.env.VITE_BACKEND_API_URL || ""}/${reqDoc.file_path}`;
                fileName = reqDoc.original_name || reqDoc.filename;
                fileSize = Number(reqDoc.file_size) || 0;
                uploadedDate = reqDoc.createdAt;
            } else if (requestAttachment) {
                fileUrl = `${import.meta.env.VITE_PREFIX_URL || "/uploads"}/dossiers/${dossierId}/${requestAttachment.attachment_url}`;
                fileName = requestAttachment.attachment_url;
                uploadedDate = requestAttachment.createdAt;
            }

            const isRequired = isCoreRequiredDoc(docType.name);

            result.push({
                docTypeId: docType.id,
                label: docType.name,
                isRequired,
                hasUploadedFile,
                fileUrl,
                fileName,
                fileSize,
                uploadedDate,
                requirementId: req?.id,
                pendingRequest: fileReq?.status === "PENDING" ? fileReq : null,
                isRequested: Boolean(fileReq),
            });
        });

        // 2. Requirements du dossier qui ne seraient pas dans documentTypes
        dossier.requirements?.forEach((req: any) => {
            const normLabel = (req.label || "").trim().toLowerCase();
            if (!processedLabels.has(normLabel)) {
                processedLabels.add(normLabel);
                const reqDoc = req.uploadedDocument;
                const hasUploadedFile = Boolean(reqDoc || req.status === "UPLOADED");
                const isRequired = isCoreRequiredDoc(req.label) || req.is_required;

                result.push({
                    docTypeId: null,
                    label: req.label,
                    isRequired,
                    hasUploadedFile,
                    fileUrl: reqDoc ? `${import.meta.env.VITE_BACKEND_API_URL || ""}/${reqDoc.file_path}` : "",
                    fileName: reqDoc?.original_name || reqDoc?.filename || "",
                    fileSize: Number(reqDoc?.file_size) || 0,
                    uploadedDate: reqDoc?.createdAt || "",
                    requirementId: req.id,
                    pendingRequest: null,
                    isRequested: false,
                });
            }
        });

        // Tri : les 3 pièces requises obligatoires en tête, puis ordre alphabétique
        return result.sort((a, b) => {
            if (a.isRequired && !b.isRequired) return -1;
            if (!a.isRequired && b.isRequired) return 1;
            return a.label.localeCompare(b.label);
        });
    }, [dossier, documentTypes, dossierId]);

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

    // Mutation : Créer une demande complémentaire ou un message
    const createRequestMutation = useMutation({
        mutationFn: (payload: CreateConsultantRequestPayload) =>
            adminDossierService.createConsultantRequest(dossierId, payload),
        onSuccess: () => {
            setRequestMessage("");
            setRequestError(null);
            setFeedback({ type: "success", message: "Demande transmise avec succès." });
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

    // Traiter la création d'un message direct
    const handleCreateRequest = (e: React.FormEvent) => {
        e.preventDefault();
        if (!requestMessage.trim()) {
            setRequestError("Veuillez saisir votre message ou question pour le client.");
            return;
        }
        createRequestMutation.mutate({
            message: requestMessage.trim(),
            input_type: "TEXT",
            importance: "FACULTATIF",
        });
    };

    const handleReplySubmit = (e: React.FormEvent, reqId: number) => {
        e.preventDefault();
        if (!replyMessage.trim() && !replyFile) return;
        replyMutation.mutate({ requestId: reqId, message: replyMessage, file: replyFile });
    };

    const handleOpenReplacementModal = (docTypeId: number | null, docTypeName: string) => {
        setReplacementModal({
            isOpen: true,
            docTypeId,
            docTypeName,
            clarification: "",
        });
    };

    const handleReplacementSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!replacementModal.docTypeName) return;

        createRequestMutation.mutate({
            document_type_id: replacementModal.docTypeId || undefined,
            message: replacementModal.clarification.trim() || `Merci de transmettre une nouvelle version conforme de : ${replacementModal.docTypeName}`,
            clarification: replacementModal.clarification.trim(),
            input_type: "FILE",
            importance: isCoreRequiredDoc(replacementModal.docTypeName) ? "OBLIGATOIRE" : "FACULTATIF",
        });

        setFeedback({
            type: "success",
            message: `Demande de clarification transmise au client pour "${replacementModal.docTypeName}".`,
        });

        setReplacementModal({
            isOpen: false,
            docTypeId: null,
            docTypeName: "",
            clarification: "",
        });
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
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg font-medium text-sm transition-colors cursor-pointer"
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
            <StudioHeader
                dossier={dossier}
                isAdmin={isAdmin}
                consultants={consultants}
                assignMutation={assignMutation}
                recalculateMutation={recalculateMutation}
                fastTrackMutation={fastTrackMutation}
                validateMutation={validateMutation}
                retryPdfMutation={retryPdfMutation}
            />

            {/* SPLIT-SCREEN MAIN CONTENT */}
            <div className="flex-1 flex overflow-hidden rounded-xl">
                {/* COLONNE GAUCHE (50% - OUTILS & EDITEUR) */}
                <div className="w-1/2 flex flex-col border-r border-gray-200 bg-white">
                    {/* BARRE D'ONGLETS */}
                    <StudioTabsBar
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        dossier={dossier}
                        uploadedPiecesCount={allPiecesList.filter(p => p.hasUploadedFile).length}
                        totalPiecesCount={allPiecesList.length}
                        hasClientPendingMessages={dossier.dossierRequests?.some(
                            (r: any) => r.status === "PENDING" && r.messages?.[r.messages.length - 1]?.sender_type === "CLIENT"
                        )}
                    />

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
                            <StudioDocsTab
                                dossierId={dossierId}
                                allPiecesList={allPiecesList}
                                validatedDocs={validatedDocs}
                                setValidatedDocs={setValidatedDocs}
                                onOpenReplacementModal={handleOpenReplacementModal}
                                setFeedback={setFeedback}
                            />
                        )}

                        {/* ONGLET 3 : ÉCHANGES DIRECTS */}
                        {activeTab === "REQUESTS" && (
                            <StudioRequestsTab
                                dossier={dossier}
                                dossierId={dossierId}
                                selectedRequestId={selectedRequestId}
                                setSelectedRequestId={setSelectedRequestId}
                                requestMessage={requestMessage}
                                setRequestMessage={setRequestMessage}
                                requestError={requestError}
                                handleCreateRequest={handleCreateRequest}
                                createRequestPending={createRequestMutation.isPending}
                                resolveMutation={resolveMutation}
                                replyMutation={replyMutation}
                                returnToClientMutation={returnToClientMutation}
                                replyMessage={replyMessage}
                                setReplyMessage={setReplyMessage}
                                replyFile={replyFile}
                                setReplyFile={setReplyFile}
                                handleReplySubmit={handleReplySubmit}
                                onGoToDocs={() => setActiveTab("DOCS")}
                            />
                        )}

                        {/* ONGLET 4 : FORMULAIRE STEPPER DU CONSULTANT */}
                        {activeTab === "STEPPER" && (
                            <StudioStepperTab
                                dossier={dossier}
                                dossierId={dossierId}
                                stepperFormData={stepperFormData}
                                setStepperFormData={setStepperFormData}
                                handleSaveStepper={handleSaveStepper}
                                isSaving={consultantSaveStepperMutation.isPending}
                                fileFiscaleUpload={fileFiscaleUpload}
                                setFileFiscaleUpload={setFileFiscaleUpload}
                                fileRCUpload={fileRCUpload}
                                setFileRCUpload={setFileRCUpload}
                                fileCNSSUpload={fileCNSSUpload}
                                setFileCNSSUpload={setFileCNSSUpload}
                                fileFiscaleRef={fileFiscaleRef}
                                setFileFiscaleRef={setFileFiscaleRef}
                                fileRCRef={fileRCRef}
                                setFileRCRef={setFileRCRef}
                                fileCNSSRef={fileCNSSRef}
                                setFileCNSSRef={setFileCNSSRef}
                            />
                        )}

                        {/* ONGLET 5 : POSTULATION CLÉ EN MAIN */}
                        {activeTab === "POSTULATION" && (
                            <StudioPostulationTab
                                dossier={dossier}
                                postulationStep={postulationStep}
                                setPostulationStep={setPostulationStep}
                                postulationRef={postulationRef}
                                setPostulationRef={setPostulationRef}
                                postulationStatus={postulationStatus}
                                setPostulationStatus={setPostulationStatus}
                                postulationNotes={postulationNotes}
                                setPostulationNotes={setPostulationNotes}
                                updatePostulationMutation={updatePostulationMutation}
                            />
                        )}
                    </div>
                </div>

                {/* COLONNE DROITE (50% - PREVISUALISATION TEMPS REEL IFRAME) */}
                <StudioReportPreview
                    reportHtml={reportHtml}
                    isReportLoading={isReportLoading}
                    isReportFetching={isReportFetching}
                    onRefresh={() => refetchReport()}
                    onMaximize={() => setIsModalOpen(true)}
                />
            </div>

            {/* MODAL PROFESSIONNEL ET MINIMAL POUR APERÇU DU RAPPORT EN GRAND */}
            <StudioReportModal
                isOpen={isModalOpen}
                dossierId={dossierId}
                reportHtml={reportHtml}
                isReportLoading={isReportLoading}
                isReportFetching={isReportFetching}
                onRefresh={() => refetchReport()}
                onClose={() => setIsModalOpen(false)}
            />

            {/* MODAL DE CLARIFICATION / DEMANDE DE REMPLACEMENT */}
            <StudioReplacementModal
                modalState={replacementModal}
                onClarificationChange={(val) => setReplacementModal(prev => ({ ...prev, clarification: val }))}
                onClose={() => setReplacementModal({ isOpen: false, docTypeId: null, docTypeName: "", clarification: "" })}
                onSubmit={handleReplacementSubmit}
                isPending={createRequestMutation.isPending}
            />

            {/* NOTIFICATION FLOTTANTE (TOAST) */}
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
                        className="p-1 hover:bg-white/10 rounded text-slate-300 hover:text-white transition-colors ml-2 cursor-pointer"
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