import React from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Building2,
    Calculator,
    Zap,
    CheckCircle2,
    Loader2,
    AlertCircle,
    RefreshCw,
} from "lucide-react";
import { ADMIN_FRONT_PREFIX } from "../../../api/axios";

interface StudioHeaderProps {
    dossier: any;
    isAdmin: boolean;
    consultants: any[];
    assignMutation: any;
    recalculateMutation: any;
    fastTrackMutation: any;
    validateMutation: any;
    retryPdfMutation: any;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
    dossier,
    isAdmin,
    consultants,
    assignMutation,
    recalculateMutation,
    fastTrackMutation,
    validateMutation,
    retryPdfMutation,
}) => {
    const navigate = useNavigate();

    return (
        <>
            <header className="bg-white border border-gray-200 rounded-xl shadow-sm mb-4 px-6 py-4 shrink-0 z-10">
                <div className="flex items-center justify-between gap-6">
                    {/* LEFT SECTION */}
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
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-600 whitespace-nowrap">
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
                                        className="h-7 min-w-[240px] px-2.5 rounded-md border border-gray-300 bg-white text-xs font-medium text-slate-700 shadow-sm outline-none transition-all hover:border-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-100 disabled:bg-gray-50 disabled:cursor-not-allowed"
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

                    {/* RIGHT SECTION */}
                    <div className="flex items-center gap-3 shrink-0">
                        {/* Recalculer les projections financières */}
                        <button
                            onClick={() => recalculateMutation.mutate({})}
                            disabled={recalculateMutation.isPending}
                            className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-blue-200 bg-blue-50 text-sm font-semibold text-blue-700 shadow-sm transition-all duration-200 hover:bg-blue-100 hover:border-blue-300 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
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
                                    inline-flex items-center justify-center gap-2 h-10 px-5 rounded-lg text-sm font-semibold text-white shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap
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
        </>
    );
};
