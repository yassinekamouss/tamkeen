import React from "react";
import { FileText, RefreshCw, Maximize2, Loader2 } from "lucide-react";

interface StudioReportPreviewProps {
    reportHtml?: string | null;
    isReportLoading: boolean;
    isReportFetching: boolean;
    onRefresh: () => void;
    onMaximize: () => void;
}

export const StudioReportPreview: React.FC<StudioReportPreviewProps> = ({
    reportHtml,
    isReportLoading,
    isReportFetching,
    onRefresh,
    onMaximize,
}) => {
    return (
        <div className="w-1/2 flex flex-col bg-white">
            {/* BARRE D'ENTETE DE PREVISUALISATION */}
            <div className="h-10 border-b border-gray-200 bg-white px-4 flex items-center justify-between shrink-0 py-6">
                <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    Aperçu Rapport d'Investissement (Handlebars HTML)
                </span>

                <div className="flex items-center gap-1">
                    <button
                        onClick={onRefresh}
                        disabled={isReportFetching}
                        className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-gray-900 rounded transition-colors"
                        title="Rafraîchir la prévisualisation"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${isReportFetching ? "animate-spin" : ""}`} />
                    </button>

                    <button
                        onClick={onMaximize}
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
    );
};
