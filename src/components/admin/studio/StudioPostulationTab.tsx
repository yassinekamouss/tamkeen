import React from "react";
import { Compass, Send, Loader2 } from "lucide-react";

interface StudioPostulationTabProps {
    dossier: any;
    postulationStep: number;
    setPostulationStep: (step: number) => void;
    postulationRef: string;
    setPostulationRef: (ref: string) => void;
    postulationStatus: string;
    setPostulationStatus: (status: string) => void;
    postulationNotes: string;
    setPostulationNotes: (notes: string) => void;
    updatePostulationMutation: any;
}

export const StudioPostulationTab: React.FC<StudioPostulationTabProps> = ({
    dossier,
    postulationStep,
    setPostulationStep,
    postulationRef,
    setPostulationRef,
    postulationStatus,
    setPostulationStatus,
    postulationNotes,
    setPostulationNotes,
    updatePostulationMutation,
}) => {
    return (
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
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer"
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
    );
};
