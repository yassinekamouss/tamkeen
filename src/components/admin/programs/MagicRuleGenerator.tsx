import React, { useState } from "react";
import { Sparkles, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { adminProgramService } from "../../../services/adminProgramService";
import type { EligibilityProfile } from "./dnfCompiler";

interface Props {
  programId?: number;
  onRulesGenerated: (profiles: EligibilityProfile[], summary: string, applyMode: "APPEND" | "REPLACE") => void;
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
  const [applyMode, setApplyMode] = useState<"APPEND" | "REPLACE">("APPEND");
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
        onRulesGenerated(response.profiles, response.summary, applyMode);
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
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-xs transition-all">
      {/* En-tête */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-700 border border-gray-200">
            <Sparkles className="h-4 w-4 text-gray-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-900">
                Configuration assistée par IA
              </h3>
              <span className="rounded bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 border border-gray-200">
                Optionnel
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Saisissez les critères en texte libre pour pré-remplir automatiquement les cartes d'éligibilité.
            </p>
          </div>
        </div>
      </div>

      {/* Zone de saisie */}
      <div className="mt-4 space-y-3">
        <div className="space-y-2">
          <textarea
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Ex : Entreprises industrielles basées à Casablanca ou Tanger avec un chiffre d'affaires supérieur à 1M MAD, OU startups tech à Rabat créées il y a moins de 3 ans..."
            rows={3}
            disabled={isGenerating}
            className="w-full resize-none rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-800 placeholder-gray-400 transition-colors focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:bg-gray-50 disabled:opacity-60"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Suggestions rapides */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
              <span className="text-gray-400 font-medium text-[11px]">
                Exemples :
              </span>
              {EXAMPLE_PROMPTS.map((ex, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPrompt(ex)}
                  disabled={isGenerating}
                  className="rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors disabled:opacity-50"
                >
                  {ex.length > 40 ? `${ex.substring(0, 40)}...` : ex}
                </button>
              ))}
            </div>

            {/* Choix Mode & Bouton d'action */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="inline-flex items-center rounded-lg border border-gray-200 bg-gray-50 p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setApplyMode("APPEND")}
                  disabled={isGenerating}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    applyMode === "APPEND"
                      ? "bg-white text-gray-900 shadow-xs border border-gray-200/60 font-semibold"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  title="Conserver les profils existants et ajouter les nouveaux profils à la suite"
                >
                  Ajouter à la suite
                </button>
                <button
                  type="button"
                  onClick={() => setApplyMode("REPLACE")}
                  disabled={isGenerating}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    applyMode === "REPLACE"
                      ? "bg-white text-gray-900 shadow-xs border border-gray-200/60 font-semibold"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  title="Remplacer tous les profils existants par les nouveaux profils générés"
                >
                  Remplacer tout
                </button>
              </div>

              {/* Bouton de génération */}
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Génération en cours...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Générer les règles</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50/70 p-3 text-xs text-red-700">
            <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Message de succès */}
        {successSummary && (
          <div className="flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-800">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-semibold text-emerald-900">
                Profils d'éligibilité configurés
              </p>
              <p className="text-emerald-700">{successSummary}</p>
              <p className="text-[11px] text-emerald-600">
                Vous pouvez vérifier et ajuster chaque critère directement sur les cartes ci-dessous.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
