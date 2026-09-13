import React, { useState } from "react";
import { Sparkles, Loader2, CheckCircle2, AlertCircle, Lightbulb } from "lucide-react";
import { adminProgramService } from "../../../services/adminProgramService";
import type { EligibilityProfile } from "./dnfCompiler";

interface Props {
  programId?: number;
  onRulesGenerated: (profiles: EligibilityProfile[], summary: string) => void;
  isGenerating: boolean;
  setIsGenerating: (loading: boolean) => void;
}

const EXAMPLE_PROMPTS = [
  "PME Industrielle à Casablanca ou Tanger avec un CA supérieur à 1M MAD",
  "Startups technologiques à Rabat créées il y a moins de 3 ans, OU PME avec CA > 500k MAD",
  "Entreprises touristiques et hôtellerie à Marrakech ou Agadir, en personne morale",
  "Jeunes entrepreneurs de moins de 35 ans en personne physique dans l'artisanat ou l'agriculture",
];

export const MagicRuleGenerator: React.FC<Props> = ({
  programId,
  onRulesGenerated,
  isGenerating,
  setIsGenerating,
}) => {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successSummary, setSuccessSummary] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setError(null);
    setSuccessSummary(null);

    try {
      const response = await adminProgramService.generateMagicRules(
        prompt.trim(),
        programId
      );

      if (response && response.success && Array.isArray(response.profiles) && response.profiles.length > 0) {
        setSuccessSummary(response.summary);
        onRulesGenerated(response.profiles, response.summary);
      } else {
        setError("L'IA n'a pas pu extraire de profils valides à partir de cette description. Veuillez préciser vos critères.");
      }
    } catch (err: any) {
      console.error("[MagicRuleGenerator] Error:", err);
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Impossible de joindre le service de génération IA. Vérifiez que le microservice Python est actif.";
      setError(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mb-8 overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 via-purple-50/40 to-blue-50/60 p-5 shadow-sm transition-all">
      {/* En-tête */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-indigo-100/60">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-sm shadow-indigo-200">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-gray-800">
                Assistant IA — Magic Input
              </h3>
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                IA Générative
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Exprimez vos critères en langage naturel, l'IA remplit et coche automatiquement les 5 cartes visuelles (Logique DNF).
            </p>
          </div>
        </div>
      </div>

      {/* Zone de saisie */}
      <div className="mt-4 space-y-3">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Ex : Ce programme s'adresse aux entreprises industrielles basées à Casablanca ou Tanger avec un chiffre d'affaires supérieur à 1M MAD, OU aux startups tech à Rabat créées il y a moins de 3 ans..."
            rows={3}
            disabled={isGenerating}
            className="w-full resize-none rounded-xl border border-gray-200 bg-white/90 p-3.5 text-sm text-gray-800 placeholder-gray-400 shadow-inner transition-all focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:opacity-60"
          />

          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            {/* Suggestions rapides */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1 font-medium text-gray-400">
                <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                Exemples rapides :
              </span>
              {EXAMPLE_PROMPTS.map((ex, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPrompt(ex)}
                  disabled={isGenerating}
                  className="rounded-lg bg-white/80 border border-indigo-100 px-2.5 py-1 text-xs text-indigo-900 transition-all hover:bg-indigo-100/60 hover:text-indigo-800 hover:border-indigo-300 disabled:opacity-50"
                >
                  {ex.length > 38 ? `${ex.substring(0, 38)}...` : ex}
                </button>
              ))}
            </div>

            {/* Bouton de génération */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-200 transition-all hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:shadow-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Interprétation et génération IA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Générer les règles avec l'IA</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Message de succès */}
        {successSummary && (
          <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 text-xs text-emerald-800 shadow-sm animate-in fade-in duration-300">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-semibold text-emerald-900">
                ✨ Règles générées et appliquées aux cartes visuelles avec succès !
              </p>
              <p className="text-emerald-700">{successSummary}</p>
              <p className="text-[11px] text-emerald-600 italic">
                Vous pouvez maintenant vérifier ou affiner chaque critère directement sur les cartes ci-dessous avant de sauvegarder.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
