import React from "react";
import {
    FolderOpen,
    Clock,
    FileText,
    Info,
    Download,
    CheckCircle2,
    Edit3,
    Send,
    UploadCloud,
} from "lucide-react";
import type { StudioPieceItem } from "./studioTypes";
import api from "../../../api/axios";
import { useQueryClient } from "@tanstack/react-query";

interface StudioDocsTabProps {
    dossierId: number;
    allPiecesList: StudioPieceItem[];
    validatedDocs: Record<string, boolean>;
    setValidatedDocs: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
    onOpenReplacementModal: (docTypeId: number | null, docTypeName: string) => void;
    setFeedback: (feedback: { type: "success" | "error"; message: string } | null) => void;
}

export const StudioDocsTab: React.FC<StudioDocsTabProps> = ({
    dossierId,
    allPiecesList,
    validatedDocs,
    setValidatedDocs,
    onOpenReplacementModal,
    setFeedback,
}) => {
    const queryClient = useQueryClient();

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <div>
                    <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                        <FolderOpen className="w-4 h-4 text-slate-700" />
                        <span>Répertoire des Pièces Justificatives</span>
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                        Seules les 3 pièces obligatoires sont requises. Les autres documents sont complémentaires ou demandés au besoin.
                    </p>
                </div>
                <div className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                    {allPiecesList.filter(p => p.hasUploadedFile).length} / {allPiecesList.length} pièce(s) fournie(s)
                </div>
            </div>

            <div className="space-y-2.5">
                {allPiecesList.map((item) => {
                    const isValidated = validatedDocs[item.label];

                    return (
                        <div
                            key={item.label}
                            className={`p-3.5 bg-white border rounded-xl transition-all shadow-xs ${
                                item.hasUploadedFile
                                    ? "border-emerald-200 hover:border-emerald-300 bg-white"
                                    : item.pendingRequest
                                        ? "border-amber-200 bg-amber-50/20"
                                        : "border-gray-200 bg-white"
                            }`}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                {/* Titre & Badges */}
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-xs font-bold text-gray-900">
                                            {item.label}
                                        </span>

                                        {/* Badge Requis vs Facultatif */}
                                        {item.isRequired ? (
                                            <span className="text-[9px] bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                                                Requis (Obligatoire)
                                            </span>
                                        ) : (
                                            <span className="text-[9px] bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded font-medium">
                                                Complémentaire
                                            </span>
                                        )}
                                        {item.pendingRequest && (
                                            <span className="text-[9px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                                                <Clock className="w-3 h-3 text-amber-600" />
                                                Nouvelle version demandée
                                            </span>
                                        )}
                                    </div>

                                    {/* Détails du fichier importé */}
                                    {item.hasUploadedFile && (
                                        <p className="text-[11px] text-gray-500 flex items-center gap-1.5 pt-0.5">
                                            <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                            <span className="font-medium text-gray-700 truncate max-w-xs">{item.fileName}</span>
                                            {item.fileSize > 0 && (
                                                <>
                                                    <span>•</span>
                                                    <span className="font-mono">{(item.fileSize / 1024).toFixed(0)} KB</span>
                                                </>
                                            )}
                                            {item.uploadedDate && (
                                                <>
                                                    <span>•</span>
                                                    <span>{new Date(item.uploadedDate).toLocaleDateString()}</span>
                                                </>
                                            )}
                                        </p>
                                    )}

                                    {/* Motif / clarification de la demande en attente */}
                                    {item.pendingRequest && (
                                        <div className="mt-1.5 p-2 bg-amber-50/90 border border-amber-200/80 rounded-lg text-xs text-amber-950 flex items-start gap-2">
                                            <Info className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                                            <div className="text-[11px] leading-relaxed">
                                                <span className="font-bold text-amber-900">Demande en cours : </span>
                                                <span className="text-amber-950 font-medium">{item.pendingRequest.message}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 shrink-0">
                                    {item.hasUploadedFile ? (
                                        <>
                                            {/* Bouton Télécharger */}
                                            {item.fileUrl && (
                                                <a
                                                    href={item.fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold transition-colors border border-slate-200 shadow-2xs"
                                                >
                                                    <Download className="w-3.5 h-3.5" />
                                                </a>
                                            )}

                                            {/* Action 1 : Garder / Valider le fichier */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setValidatedDocs(prev => ({
                                                        ...prev,
                                                        [item.label]: !prev[item.label]
                                                    }));
                                                    setFeedback({
                                                        type: "success",
                                                        message: `Statut de la pièce "${item.label}" mis à jour : ${!isValidated ? "Validée et conforme" : "En cours d'examen"}.`
                                                    });
                                                }}
                                                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border shadow-2xs cursor-pointer ${
                                                    isValidated
                                                        ? "bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700"
                                                        : "bg-white hover:bg-emerald-50 text-emerald-700 border-emerald-300"
                                                }`}
                                                title="Confirmer la conformité et conserver cette pièce"
                                            >
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                            </button>

                                            {/* Action 2 : Changer / Redemander après clarification */}
                                            <button
                                                type="button"
                                                onClick={() => onOpenReplacementModal(item.docTypeId, item.label)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-amber-50 text-amber-700 border border-amber-300 rounded-lg text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                                                title="Demander au client de transmettre une nouvelle version de ce document"
                                            >
                                                <Edit3 className="w-3.5 h-3.5" />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            {/* Bouton pour solliciter le client */}
                                            <button
                                                type="button"
                                                onClick={() => onOpenReplacementModal(item.docTypeId, item.label)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                            >
                                                <Send className="w-3.5 h-3.5" />
                                                <span>Demander au client</span>
                                            </button>

                                            {/* Bouton Déposer (affiché UNIQUEMENT si la pièce n'est pas déjà importée) */}
                                            <label className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold cursor-pointer transition-colors">
                                                <UploadCloud className="w-3.5 h-3.5" />
                                                <span>Déposer (Admin)</span>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    onChange={async (e) => {
                                                        if (e.target.files && e.target.files[0]) {
                                                            const file = e.target.files[0];
                                                            const fd = new FormData();
                                                            fd.append("file", file);
                                                            if (item.requirementId) {
                                                                fd.append("requirement_id", String(item.requirementId));
                                                            } else if (item.docTypeId) {
                                                                fd.append("document_type_id", String(item.docTypeId));
                                                            }
                                                            try {
                                                                await api.post(`/api/documents/${dossierId}/documents`, fd, {
                                                                    headers: { "Content-Type": "multipart/form-data" },
                                                                });
                                                                setFeedback({ type: "success", message: `Fichier téléversé pour ${item.label} !` });
                                                                queryClient.invalidateQueries({ queryKey: ["adminDossier", dossierId] });
                                                            } catch (err: any) {
                                                                setFeedback({ type: "error", message: err.response?.data?.message || "Erreur upload" });
                                                            }
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
