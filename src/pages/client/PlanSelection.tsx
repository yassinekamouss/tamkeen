import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { dossierService } from "../../services/dossierService";

interface PlanSelectionProps {
  dossierId: number;
  onPlanSelected: () => void;
}

const font = {
  display: "font-['Plus_Jakarta_Sans',_sans-serif]",
  body: "font-['Roboto_Flex',_sans-serif]",
  mono: "font-['JetBrains_Mono',_monospace]",
};

const PlanSelection: React.FC<PlanSelectionProps> = ({ dossierId, onPlanSelected }) => {
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
    <div className={`p-6 md:p-10 max-w-5xl mx-auto space-y-8 ${font.body}`}>
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0FE] text-[#005BBF] text-[11px] font-bold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1A73E8]" />
          Formules d'accompagnement porteur
        </div>
        <h2 className={`${font.display} text-2xl md:text-3xl font-bold text-[#191C1D] tracking-tight`}>
          Choisissez votre formule de suivi
        </h2>
        <p className="text-[#5F6368] text-sm md:text-base leading-relaxed">
          Sélectionnez l'offre adaptée aux besoins de votre projet pour lancer immédiatement la rédaction et l'analyse de votre dossier.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded bg-[#FFDAD6] border-l-4 border-[#BA1A1A] text-[#93000A] text-sm font-medium text-center max-w-2xl mx-auto">
          {error}
        </div>
      )}

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-6 items-stretch pt-2">
        {/* Plan 1 Card */}
        <div className="bg-[#EDEEEF]/50 p-2 sm:p-2.5 rounded-2xl border border-[#DADCE0] flex flex-col">
          <div className="bg-white rounded-xl border border-[#DADCE0] p-6 sm:p-8 flex-grow flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#5F6368]">
                  Plan 1 · Fast-Track
                </span>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-[#F3F4F5] text-[#414754] border border-[#DADCE0]">
                  Autonomie IA
                </span>
              </div>

              <div>
                <h3 className={`${font.display} text-xl font-bold text-[#191C1D]`}>
                  Le Livrable Structuré
                </h3>
                <p className="text-[#5F6368] text-xs sm:text-sm mt-1 leading-relaxed min-h-[40px]">
                  Génération instantanée de votre rapport d'investissement et dossier d'éligibilité par notre IA.
                </p>
              </div>

              <div className="pt-2 pb-1 border-y border-[#F3F4F5] flex items-baseline gap-2">
                <span className={`${font.mono} text-3xl sm:text-4xl font-bold text-[#191C1D]`}>
                  1 990
                </span>
                <span className="text-[#5F6368] font-bold text-sm">DH TTC</span>
              </div>

              <ul className="space-y-3 pt-2 text-xs sm:text-sm">
                <li className="flex items-start gap-2.5 text-[#191C1D]">
                  <svg className="w-4 h-4 text-[#1A73E8] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Analyse automatique de l'ensemble de vos pièces justificatives</span>
                </li>
                <li className="flex items-start gap-2.5 text-[#191C1D]">
                  <svg className="w-4 h-4 text-[#1A73E8] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Calcul et simulation du montant optimal de subvention</span>
                </li>
                <li className="flex items-start gap-2.5 text-[#191C1D]">
                  <svg className="w-4 h-4 text-[#1A73E8] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Génération de la synthèse au format bancaire / institutionnel</span>
                </li>
                <li className="flex items-start gap-2.5 text-[#727785] opacity-60">
                  <svg className="w-4 h-4 text-[#727785] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Revue personnalisée par un consultant expert dédié</span>
                </li>
                <li className="flex items-start gap-2.5 text-[#727785] opacity-60">
                  <svg className="w-4 h-4 text-[#727785] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Messagerie directe &amp; accompagnement aux démarches</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => selectPlanMutation.mutate("PLAN_1")}
              disabled={selectPlanMutation.isPending}
              className="w-full py-3 px-4 rounded border border-[#DADCE0] bg-white text-[#191C1D] font-bold text-sm hover:bg-[#F3F4F5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1A73E8] disabled:opacity-50"
            >
              {selectPlanMutation.isPending ? "Validation..." : "Choisir le Plan 1 (Autonomie)"}
            </button>
          </div>
        </div>

        {/* Plan 2 Card */}
        <div className="bg-[#EDEEEF]/50 p-2 sm:p-2.5 rounded-2xl border-2 border-[#1A73E8] flex flex-col relative">
          <div className="bg-white rounded-xl border border-[#C1C6D6] p-6 sm:p-8 flex-grow flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#1A73E8]">
                  Plan 2 · Expert Premium
                </span>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#E8F0FE] text-[#005BBF] border border-[#C1C6D6]">
                  ★ Recommandé
                </span>
              </div>

              <div>
                <h3 className={`${font.display} text-xl font-bold text-[#1A73E8]`}>
                  Accompagnement Complet
                </h3>
                <p className="text-[#5F6368] text-xs sm:text-sm mt-1 leading-relaxed min-h-[40px]">
                  Un consultant senior relit, affine votre dossier et vous assiste jusqu'à l'octroi de la subvention.
                </p>
              </div>

              <div className="pt-2 pb-1 border-y border-[#F3F4F5] flex items-baseline gap-2">
                <span className={`${font.mono} text-3xl sm:text-4xl font-bold text-[#191C1D]`}>
                  4 990
                </span>
                <span className="text-[#5F6368] font-bold text-sm">DH TTC</span>
              </div>

              <ul className="space-y-3 pt-2 text-xs sm:text-sm">
                <li className="flex items-start gap-2.5 text-[#191C1D]">
                  <svg className="w-4 h-4 text-[#1A73E8] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-semibold text-[#191C1D]">Inclus l'ensemble des fonctionnalités du Plan 1</span>
                </li>
                <li className="flex items-start gap-2.5 text-[#191C1D]">
                  <svg className="w-4 h-4 text-[#1A73E8] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Revue approfondie et correction manuelle par un consultant expert</span>
                </li>
                <li className="flex items-start gap-2.5 text-[#191C1D]">
                  <svg className="w-4 h-4 text-[#1A73E8] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Messagerie dédiée &amp; fil de discussion direct avec votre expert</span>
                </li>
                <li className="flex items-start gap-2.5 text-[#191C1D]">
                  <svg className="w-4 h-4 text-[#1A73E8] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Assistance aux échanges avec les organismes financeurs</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => selectPlanMutation.mutate("PLAN_2")}
              disabled={selectPlanMutation.isPending}
              className="w-full py-3 px-4 rounded bg-[#1A73E8] hover:bg-[#174EA6] text-white font-bold text-sm shadow-[0_4px_14px_rgba(26,115,232,0.12)] transition-all focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:ring-offset-2 disabled:opacity-50"
            >
              {selectPlanMutation.isPending ? "Validation..." : "Choisir le Plan 2 (Accompagnement Expert)"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanSelection;
