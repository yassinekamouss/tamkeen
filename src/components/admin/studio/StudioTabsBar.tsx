import React from "react";
import { Code, Edit3, FileText, MessageSquare, Compass } from "lucide-react";
import type { StudioTabKey } from "./studioTypes";

interface StudioTabsBarProps {
    activeTab: StudioTabKey;
    setActiveTab: (tab: StudioTabKey) => void;
    dossier: any;
    uploadedPiecesCount: number;
    totalPiecesCount: number;
    hasClientPendingMessages: boolean;
}

export const StudioTabsBar: React.FC<StudioTabsBarProps> = ({
    activeTab,
    setActiveTab,
    dossier,
    uploadedPiecesCount,
    totalPiecesCount,
    hasClientPendingMessages,
}) => {
    return (
        <div className="flex border-b border-gray-200 bg-white px-2 pt-2 gap-1 shrink-0 py-2">
            <button
                onClick={() => setActiveTab("JSON")}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-t-lg text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === "JSON"
                        ? "text-slate-700 border-t border-x border-gray-200"
                        : "bg-white text-gray-500 hover:text-gray-900 hover:bg-white/50"
                }`}
            >
                <Code className="w-4 h-4" />
                <span>Données (JSON)</span>
            </button>

            <button
                onClick={() => setActiveTab("STEPPER")}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-t-lg text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === "STEPPER"
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
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-t-lg text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === "DOCS"
                        ? "text-slate-700 border-t border-x border-gray-200"
                        : "bg-white text-gray-500 hover:text-gray-900 hover:bg-white/50"
                }`}
            >
                <FileText className="w-4 h-4" />
                <span>Pièces ({uploadedPiecesCount} / {totalPiecesCount})</span>
            </button>

            <button
                onClick={() => setActiveTab("REQUESTS")}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-t-lg text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === "REQUESTS"
                        ? "text-slate-700 border-t border-x border-gray-200"
                        : "bg-white text-gray-500 hover:text-gray-900 hover:bg-white/50"
                }`}
            >
                <MessageSquare className="w-4 h-4" />
                <span>Échanges ({dossier.dossierRequests?.length || 0})</span>
                {hasClientPendingMessages && (
                    <span className="flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-orange-500 rounded-full animate-bounce">
                        !
                    </span>
                )}
            </button>

            {dossier.plan_type === "PLAN_3" && (
                <button
                    onClick={() => setActiveTab("POSTULATION")}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-t-lg text-xs font-semibold transition-colors cursor-pointer ${
                        activeTab === "POSTULATION"
                            ? "text-slate-700 border-t border-x border-gray-200"
                            : "bg-white text-gray-500 hover:text-gray-900 hover:bg-white/50"
                    }`}
                >
                    <Compass className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">Postulation Clé en Main</span>
                </button>
            )}
        </div>
    );
};
