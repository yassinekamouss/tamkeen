import React, { useState, useEffect, useRef } from "react";
import type { FormData, programsNamesAndLinks } from "./types";
import { useTranslation } from "react-i18next";
import { sanitizeFrenchText } from "../../utils/sanitize";
import { CheckCircle2, Mail, Sparkles, UserCheck, ArrowRight } from "lucide-react";
import AgentChat from "./agent/AgentChat";

interface EligibilityResultProps {
  isEligible: boolean;
  eligibleProgram: programsNamesAndLinks[];
  formData: FormData;
  onNewTest: () => void;
  onSimulate?: (fieldToAdjust?: string, suggestedValue?: string) => void;
  testId?: string | null;
  onEditForm?: (fieldsToClear?: string[]) => void;
  isCorrectedFlow?: boolean;
}

const EligibilityResult: React.FC<EligibilityResultProps> = ({
  isEligible,
  eligibleProgram,
  formData,
  onNewTest,
  onSimulate,
  testId,
  onEditForm,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "fr" | "ar";
  const cardRef = useRef<HTMLDivElement | null>(null);

  // État de sélection d'un plan V2
  const [planSelected, setPlanSelected] = useState<boolean>(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (cardRef.current) {
        try {
          cardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        } catch (e) {
          const top =
            cardRef.current.getBoundingClientRect().top +
            window.scrollY -
            window.innerHeight / 2 +
            cardRef.current.clientHeight / 2;
          window.scrollTo({ top, left: 0, behavior: "smooth" });
        }
      }
    });
  }, []);

  const handleSelectPlan = () => {
    setPlanSelected(true);
  };

  // --- NON ÉLIGIBLE : Agent IA de remédiation ---
  if (!isEligible) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center font-sans">
        <div ref={cardRef} className="w-full max-w-3xl mx-auto">
          <AgentChat
            formData={formData}
            testId={testId}
            onNewTest={onNewTest}
            onContactAdvisor={() => {}}
            onSimulate={onSimulate}
            onEditForm={onEditForm}
          />
        </div>
      </div>
    );
  }

  // --- ÉLIGIBLE : V2 Fork (Plan 1 vs Plan 2) ---
  return (
    <div className="min-h-screen bg-slate-50/70 py-12 sm:py-16 px-4 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <div
          ref={cardRef}
          className="bg-white border border-slate-200 shadow-xl rounded-2xl p-6 sm:p-10 space-y-8"
        >
          {/* Header Résultats Éligibilité */}
          <div className="border-b border-slate-100 pb-6 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-[#1E5ED8] border border-blue-100 rounded-full text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#1E5ED8] animate-pulse" />
              {t("eligibility.title", "Résultat du Test d'Éligibilité")}
            </div>

            <div className="flex items-center gap-4 pt-2">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl flex items-center justify-center flex-shrink-0 shadow-2xs">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {t("eligibilityResult.eligible", "Félicitations ! Vous êtes éligible")}
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  {t(
                    "eligibilityResult.message.eligible",
                    "Sur la base de vos déclarations, votre projet peut bénéficier de subventions d'investissement."
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Liste des programmes éligibles */}
          {eligibleProgram.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                {t("eligibilityResult.programsTitle", "Programmes de subvention identifiés")}
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {eligibleProgram.map((program) => {
                  const link = program.link.startsWith("http")
                    ? program.link
                    : `https://${program.link}`;
                  const rawName =
                    program.name?.[lang] || program.name?.fr || "";
                  const displayName =
                    lang === "fr" ? sanitizeFrenchText(rawName) : rawName;

                  return (
                    <div
                      key={program.id || program.link}
                      className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:bg-blue-50/40 hover:border-blue-300 transition-all duration-200 flex items-center justify-between"
                    >
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-base text-[#1E5ED8] hover:text-blue-800 transition-colors flex items-center gap-2"
                      >
                        <span>{displayName}</span>
                        <ArrowRight className="w-4 h-4 text-[#1E5ED8]" />
                      </a>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Éligible
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section V2 : Fork des 2 Plans ou Message de Succès Email */}
          <div className="pt-6 border-t border-slate-100">
            {planSelected ? (
              /* Message de Succès avec icône d'enveloppe */
              <div className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-5 animate-fadeIn shadow-sm">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Mail className="w-8 h-8" />
                </div>
                <div className="max-w-lg mx-auto space-y-2">
                  <h3 className="text-xl font-extrabold text-slate-900">
                    {t(
                      "eligibilityResult.workspaceReadyTitle",
                      "Votre Espace de Travail est Prêt !"
                    )}
                  </h3>
                  <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                    {t(
                      "eligibilityResult.workspaceReady",
                      "Félicitations, votre espace de travail est prêt ! Un email vient de vous être envoyé. Veuillez cliquer sur le lien qu'il contient pour définir votre mot de passe et accéder à votre tableau de bord."
                    )}
                  </p>
                </div>
              </div>
            ) : (
              /* Choix des 2 Plans V2 */
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {t(
                      "eligibilityResult.choosePathTitle",
                      "Choisissez votre parcours pour concrétiser votre subvention"
                    )}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {t(
                      "eligibilityResult.choosePathDesc",
                      "Sélectionnez la formule la plus adaptée à vos besoins."
                    )}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Carte 1 : Plan 1 (Fast-Track / IA) */}
                  <div className="border border-blue-200 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md hover:border-[#1E5ED8] transition-all duration-200 group">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#1E5ED8] flex items-center justify-center shadow-2xs">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-[#1E5ED8] border border-blue-200">
                          Gratuit (IA)
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <h4 className="text-lg font-extrabold text-slate-900 group-hover:text-[#1E5ED8] transition-colors">
                          {t(
                            "eligibilityResult.plan1Title",
                            "Générer mon rapport d'investissement"
                          )}
                        </h4>
                        <p className="text-slate-600 text-xs leading-relaxed">
                          {t(
                            "eligibilityResult.plan1Desc",
                            "Utilisez notre intelligence artificielle pour monter votre dossier instantanément. (Gratuit)"
                          )}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleSelectPlan}
                      className="w-full py-3.5 px-5 rounded-xl bg-[#1E5ED8] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>
                        {t(
                          "eligibilityResult.plan1Btn",
                          "Démarrer avec l'IA"
                        )}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Carte 2 : Plan 2 (Full Service / Consultant) */}
                  <div className="border border-emerald-200 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all duration-200 group">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-2xs">
                          <UserCheck className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Accompagnement Pro
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <h4 className="text-lg font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {t(
                            "eligibilityResult.plan2Title",
                            "Accompagnement Complet"
                          )}
                        </h4>
                        <p className="text-slate-600 text-xs leading-relaxed">
                          {t(
                            "eligibilityResult.plan2Desc",
                            "Un consultant expert prend en charge vos démarches, de la création du dossier jusqu'au déblocage des fonds."
                          )}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleSelectPlan}
                      className="w-full py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>
                        {t(
                          "eligibilityResult.plan2Btn",
                          "Être accompagné"
                        )}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bouton pour relancer un test */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={onNewTest}
              className="text-xs font-medium text-slate-500 hover:text-slate-800 underline transition-colors cursor-pointer"
            >
              {t("eligibilityResult.newTestButton", "Effectuer un nouveau test")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EligibilityResult;
