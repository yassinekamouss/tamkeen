import React from "react";
import { FileText, RefreshCw, X, Loader2 } from "lucide-react";

interface StudioReportModalProps {
    isOpen: boolean;
    dossierId: number;
    reportHtml?: string | null;
    isReportLoading: boolean;
    isReportFetching: boolean;
    onRefresh: () => void;
    onClose: () => void;
}

export const StudioReportModal: React.FC<StudioReportModalProps> = ({
    isOpen,
    dossierId,
    reportHtml,
    isReportLoading,
    isReportFetching,
    onRefresh,
    onClose,
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
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
                            onClick={onRefresh}
                            disabled={isReportFetching}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-semibold shadow-xs transition-colors"
                            title="Rafraîchir"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${isReportFetching ? "animate-spin text-blue-600" : ""}`} />
                            <span>Rafraîchir</span>
                        </button>

                        <button
                            onClick={onClose}
                            className="p-1.5 hover:bg-gray-200 text-gray-500 hover:text-gray-900 rounded-lg transition-colors ml-1 cursor-pointer"
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
    );
};
