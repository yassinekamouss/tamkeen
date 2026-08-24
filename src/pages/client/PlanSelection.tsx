import React, { useState } from "react";
// useTranslation import removed
import { useMutation } from "@tanstack/react-query";
import { dossierService } from "../../services/dossierService";

interface PlanSelectionProps {
  dossierId: number;
  onPlanSelected: () => void;
}

const PlanSelection: React.FC<PlanSelectionProps> = ({ dossierId, onPlanSelected }) => {
  // useTranslation removed because t is not used
  const [error, setError] = useState<string | null>(null);

  const selectPlanMutation = useMutation({
    mutationFn: async (planType: "PLAN_1" | "PLAN_2") => {
      return await dossierService.selectPlan(dossierId, planType);
    },
    onSuccess: () => {
      onPlanSelected();
    },
    onError: (err: any) => {
      setError(
        err.response?.data?.message || err.message || "Une erreur est survenue lors de la sélection du plan."
      );
    },
  });

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          Choisissez votre formule d'accompagnement
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Sélectionnez le plan qui correspond le mieux à vos besoins pour finaliser votre dossier de subvention.
        </p>
      </div>

      {error && (
        <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm font-medium text-center">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Plan 1 Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300">
          <div className="p-8 md:p-10 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Le Livrable (Fast-Track)</h3>
            <p className="text-slate-500 mb-6 min-h-[48px]">
              Génération rapide de votre rapport d'investissement structuré grâce à l'IA.
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900">1 990</span>
              <span className="text-slate-500 font-medium">DH</span>
            </div>
          </div>
          <div className="p-8 md:p-10 flex-grow flex flex-col">
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-emerald-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-slate-700">Analyse de vos documents par l'IA</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-emerald-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-slate-700">Calcul du montant optimal de subvention</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-emerald-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-slate-700">Génération du rapport de projet structuré</span>
              </li>
              <li className="flex items-start opacity-50">
                <svg className="w-5 h-5 text-slate-300 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                <span className="text-slate-500">Revue manuelle par un expert métier</span>
              </li>
              <li className="flex items-start opacity-50">
                <svg className="w-5 h-5 text-slate-300 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                <span className="text-slate-500">Prise en charge des démarches externes</span>
              </li>
            </ul>
            <button
              onClick={() => selectPlanMutation.mutate("PLAN_1")}
              disabled={selectPlanMutation.isPending}
              className="w-full py-4 rounded-xl border-2 border-[#1E5ED8] text-[#1E5ED8] font-bold text-lg hover:bg-blue-50 transition-colors focus:ring-4 focus:ring-blue-100 disabled:opacity-50"
            >
              Sélectionner le Plan 1
            </button>
          </div>
        </div>

        {/* Plan 2 Card */}
        <div className="bg-white rounded-3xl shadow-xl border-2 border-[#1E5ED8] overflow-hidden flex flex-col relative transform md:-translate-y-4">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-[#1E5ED8]"></div>
          <div className="absolute top-4 right-4 bg-blue-100 text-[#1E5ED8] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            Recommandé
          </div>
          <div className="p-8 md:p-10 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-2xl font-bold text-[#1E5ED8] mb-2">Accompagnement Complet</h3>
            <p className="text-slate-500 mb-6 min-h-[48px]">
              Notre équipe d'experts prend en charge votre dossier de A à Z.
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900">4 990</span>
              <span className="text-slate-500 font-medium">DH</span>
            </div>
          </div>
          <div className="p-8 md:p-10 flex-grow flex flex-col">
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-[#1E5ED8] mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-slate-700 font-medium">Tout le contenu du Plan 1</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-[#1E5ED8] mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-slate-700">Revue détaillée par un consultant expert</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-[#1E5ED8] mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-slate-700">Messagerie et assistance prioritaire</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-[#1E5ED8] mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-slate-700">Démarches auprès des banques & état</span>
              </li>
            </ul>
            <button
              onClick={() => selectPlanMutation.mutate("PLAN_2")}
              disabled={selectPlanMutation.isPending}
              className="w-full py-4 rounded-xl bg-[#1E5ED8] text-white font-bold text-lg hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all focus:ring-4 focus:ring-blue-200 disabled:opacity-50"
            >
              Sélectionner le Plan 2
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanSelection;
