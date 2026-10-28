import React from "react";
import { Edit3, X, Loader2, Send } from "lucide-react";
import type { ReplacementModalState } from "./studioTypes";

interface StudioReplacementModalProps {
    modalState: ReplacementModalState;
    onClarificationChange: (val: string) => void;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    isPending: boolean;
}

export const StudioReplacementModal: React.FC<StudioReplacementModalProps> = ({
    modalState,
    onClarificationChange,
    onClose,
    onSubmit,
    isPending,
}) => {
    if (!modalState.isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                            <Edit3 className="w-4 h-4" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-gray-900">Demande de Remplacement & Clarification</h4>
                            <p className="text-[11px] text-gray-500">Pièce : {modalState.docTypeName}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Consigne ou motif de rejet / clarification pour le client :
                        </label>
                        <textarea
                            rows={4}
                            required
                            value={modalState.clarification}
                            onChange={(e) => onClarificationChange(e.target.value)}
                            placeholder="Ex: Le document transmis n'est pas signé ou la date de validité est expirée. Merci de transmettre l'attestation originale au format PDF..."
                            className="w-full p-3 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-700 leading-relaxed resize-none"
                        />
                        <p className="text-[11px] text-gray-500 mt-1">
                            Cette consigne apparaîtra directement dans l'espace client sur la fiche de ce document, avec l'espace de téléversement pour renvoyer la nouvelle version.
                        </p>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isPending || !modalState.clarification.trim()}
                            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                            {isPending ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <Send className="w-3.5 h-3.5" />
                            )}
                            <span>Transmettre la demande</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
