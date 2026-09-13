import React, { useState, useEffect } from "react";
import {
  Sparkles,
  MapPin,
  Briefcase,
  Leaf,
  Users,
  TrendingUp,
  Percent,
  Code,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export interface MathConfig {
  cnss_rate: number;
  primes: {
    territoriale_zone_a: number;
    territoriale_zone_b: number;
    sectorielle: number;
    ecologique: number;
  };
  profils_croissance: {
    STANDARD: number[];
    PRUDENT: number[];
    RAPIDE: number[];
  };
}

export const DEFAULT_MATH_CONFIG: MathConfig = {
  cnss_rate: 1.2109,
  primes: {
    territoriale_zone_a: 0.1,
    territoriale_zone_b: 0.15,
    sectorielle: 0.05,
    ecologique: 0.03,
  },
  profils_croissance: {
    STANDARD: [0.2, 0.7, 0.85, 1.0, 1.0, 1.0],
    PRUDENT: [0.15, 0.5, 0.75, 0.9, 1.0, 1.0],
    RAPIDE: [0.4, 0.8, 1.0, 1.0, 1.0, 1.0],
  },
};

interface MathConfigVisualEditorProps {
  value: MathConfig | null | undefined;
  onChange: (config: MathConfig) => void;
}

export const MathConfigVisualEditor: React.FC<MathConfigVisualEditorProps> = ({
  value,
  onChange,
}) => {
  const currentConfig: MathConfig = {
    cnss_rate: value?.cnss_rate ?? DEFAULT_MATH_CONFIG.cnss_rate,
    primes: {
      territoriale_zone_a:
        value?.primes?.territoriale_zone_a ??
        DEFAULT_MATH_CONFIG.primes.territoriale_zone_a,
      territoriale_zone_b:
        value?.primes?.territoriale_zone_b ??
        DEFAULT_MATH_CONFIG.primes.territoriale_zone_b,
      sectorielle:
        value?.primes?.sectorielle ?? DEFAULT_MATH_CONFIG.primes.sectorielle,
      ecologique:
        value?.primes?.ecologique ?? DEFAULT_MATH_CONFIG.primes.ecologique,
    },
    profils_croissance: {
      STANDARD:
        Array.isArray(value?.profils_croissance?.STANDARD) &&
        value.profils_croissance.STANDARD.length === 6
          ? value.profils_croissance.STANDARD
          : DEFAULT_MATH_CONFIG.profils_croissance.STANDARD,
      PRUDENT:
        Array.isArray(value?.profils_croissance?.PRUDENT) &&
        value.profils_croissance.PRUDENT.length === 6
          ? value.profils_croissance.PRUDENT
          : DEFAULT_MATH_CONFIG.profils_croissance.PRUDENT,
      RAPIDE:
        Array.isArray(value?.profils_croissance?.RAPIDE) &&
        value.profils_croissance.RAPIDE.length === 6
          ? value.profils_croissance.RAPIDE
          : DEFAULT_MATH_CONFIG.profils_croissance.RAPIDE,
    },
  };

  const [selectedProfile, setSelectedProfile] = useState<
    "STANDARD" | "PRUDENT" | "RAPIDE"
  >("STANDARD");

  const [showAdvancedJson, setShowAdvancedJson] = useState(false);
  const [rawJsonText, setRawJsonText] = useState("");
  const [rawJsonError, setRawJsonError] = useState<string | null>(null);

  useEffect(() => {
    setRawJsonText(JSON.stringify(currentConfig, null, 2));
  }, [value]);

  const cnssPercentage = Math.round((currentConfig.cnss_rate - 1) * 10000) / 100;

  const handleCnssPercentageChange = (percentVal: number) => {
    const rate = 1 + (percentVal || 0) / 100;
    const updated: MathConfig = {
      ...currentConfig,
      cnss_rate: Math.round(rate * 10000) / 10000,
    };
    onChange(updated);
  };

  const handlePrimeChange = (key: keyof MathConfig["primes"], percentVal: number) => {
    const updated: MathConfig = {
      ...currentConfig,
      primes: {
        ...currentConfig.primes,
        [key]: Math.round((percentVal || 0) * 100) / 10000,
      },
    };
    onChange(updated);
  };

  const handleGrowthYearChange = (
    profileKey: "STANDARD" | "PRUDENT" | "RAPIDE",
    yearIndex: number,
    percentVal: number
  ) => {
    const updatedList = [...currentConfig.profils_croissance[profileKey]];
    updatedList[yearIndex] = Math.round((percentVal || 0) * 100) / 10000;
    const updated: MathConfig = {
      ...currentConfig,
      profils_croissance: {
        ...currentConfig.profils_croissance,
        [profileKey]: updatedList,
      },
    };
    onChange(updated);
  };

  const handleResetDefaults = () => {
    onChange(DEFAULT_MATH_CONFIG);
    setRawJsonText(JSON.stringify(DEFAULT_MATH_CONFIG, null, 2));
    setRawJsonError(null);
  };

  const handleRawJsonChange = (text: string) => {
    setRawJsonText(text);
    try {
      const parsed = JSON.parse(text);
      setRawJsonError(null);
      onChange(parsed);
    } catch (err: any) {
      setRawJsonError("Erreur de syntaxe JSON : " + err.message);
    }
  };

  const maxSubsidyRate =
    Math.round(
      (currentConfig.primes.territoriale_zone_b +
        currentConfig.primes.sectorielle +
        currentConfig.primes.ecologique) *
        10000
    ) / 100;

  return (
    <div className="space-y-6">
      {/* BARRE D'ENTÊTE AVEC BOUTON DE RÉINITIALISATION */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-100 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Paramètres Financiers de la Charte TPME
              </h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                Moteur Déterministe
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Ces taux et coefficients sont appliqués automatiquement lors du
              calcul des subventions et des comptes prévisionnels (CPC).
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetDefaults}
          className="inline-flex items-center px-3.5 py-2 rounded-lg bg-white border border-blue-200 text-xs font-semibold text-blue-700 hover:bg-blue-50 shadow-sm transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
          Réinitialiser aux valeurs de référence (Charte TPME)
        </button>
      </div>

      {/* SECTION 1 : GRILLE DES PRIMES D'INVESTISSEMENT */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              1. Primes à l'Investissement (Dispositif Principal)
            </h4>
            <span className="text-[11px] text-slate-500 font-normal">
              (Taux exprimés en pourcentage du CAPEX éligible)
            </span>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-lg">
            Plafond théorique maximum : {maxSubsidyRate} %
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Prime Zone A */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800">
                  Zone A (Urbaine)
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                territoriale_zone_a
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-3 leading-snug">
              Provinces développées (Casablanca, Rabat, Tanger, Marrakech...).
            </p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.5"
                min="0"
                max="100"
                value={Math.round(currentConfig.primes.territoriale_zone_a * 10000) / 100}
                onChange={(e) =>
                  handlePrimeChange(
                    "territoriale_zone_a",
                    parseFloat(e.target.value) || 0
                  )
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-900 font-mono text-right focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="text-sm font-bold text-slate-600">%</span>
            </div>
          </div>

          {/* Prime Zone B */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800">
                  Zone B (Prioritaire)
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                territoriale_zone_b
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-3 leading-snug">
              Provinces en développement territorial (Oriental, Sud, zones rurales).
            </p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.5"
                min="0"
                max="100"
                value={Math.round(currentConfig.primes.territoriale_zone_b * 10000) / 100}
                onChange={(e) =>
                  handlePrimeChange(
                    "territoriale_zone_b",
                    parseFloat(e.target.value) || 0
                  )
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-900 font-mono text-right focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="text-sm font-bold text-slate-600">%</span>
            </div>
          </div>

          {/* Prime Sectorielle */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                  <Briefcase className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800">
                  Prime Sectorielle
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                sectorielle
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-3 leading-snug">
              Secteurs prioritaires (Automobile, Aéronautique, Agro, Textile, Tech...).
            </p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.5"
                min="0"
                max="100"
                value={Math.round(currentConfig.primes.sectorielle * 10000) / 100}
                onChange={(e) =>
                  handlePrimeChange(
                    "sectorielle",
                    parseFloat(e.target.value) || 0
                  )
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-900 font-mono text-right focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="text-sm font-bold text-slate-600">%</span>
            </div>
          </div>

          {/* Bonus Écologique */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <Leaf className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800">
                  Bonus Écologique
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                ecologique
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-3 leading-snug">
              Transition verte, efficacité énergétique et économie durable.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.5"
                min="0"
                max="100"
                value={Math.round(currentConfig.primes.ecologique * 10000) / 100}
                onChange={(e) =>
                  handlePrimeChange(
                    "ecologique",
                    parseFloat(e.target.value) || 0
                  )
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-900 font-mono text-right focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="text-sm font-bold text-slate-600">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2 : CHARGES PATRONALES CNSS */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
            <Users className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            2. Charges Sociales & Patronales (CNSS & AMO)
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="md:col-span-2">
            <p className="text-xs text-slate-600 leading-relaxed">
              Ce pourcentage est automatiquement appliqué à la masse salariale
              brute déclarée pour calculer la charge de personnel réelle dans le
              Compte de Produits et Charges prévisionnel (CPC).
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Coefficient multiplicateur équivalent :{" "}
              <code className="font-mono font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                x {currentConfig.cnss_rate}
              </code>
            </p>
          </div>

          <div className="flex items-center gap-3 justify-start md:justify-end">
            <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">
              Taux patronal :
            </label>
            <div className="flex items-center gap-1.5 w-32">
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={cnssPercentage}
                onChange={(e) =>
                  handleCnssPercentageChange(parseFloat(e.target.value) || 0)
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-900 font-mono text-right focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="text-sm font-bold text-slate-600">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3 : PROFILS DE MONTÉE EN CHARGE (6 ANS) */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                3. Profils de Montée en Charge du Chiffre d'Affaires
              </h4>
              <p className="text-[11px] text-slate-500">
                Pourcentage du Chiffre d'Affaires cible annuel atteint de l'Année 1 à l'Année 6.
              </p>
            </div>
          </div>

          {/* SÉLECTEUR DE PROFIL */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            {(["STANDARD", "PRUDENT", "RAPIDE"] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedProfile(key)}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                  selectedProfile === key
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {key === "STANDARD"
                  ? "Standard"
                  : key === "PRUDENT"
                  ? "Prudent"
                  : "Rapide"}
              </button>
            ))}
          </div>
        </div>

        {/* GRILLE DES 6 ANNÉES POUR LE PROFIL SÉLECTIONNÉ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {currentConfig.profils_croissance[selectedProfile].map(
            (coeff, idx) => {
              const percent = Math.round(coeff * 10000) / 100;
              return (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col space-y-2 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700 uppercase">
                      Année {idx + 1}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      N+{idx}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="5"
                      min="0"
                      max="200"
                      value={percent}
                      onChange={(e) =>
                        handleGrowthYearChange(
                          selectedProfile,
                          idx,
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-900 font-mono text-right focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <span className="text-xs font-semibold text-slate-500">%</span>
                  </div>

                  {/* JAUGE GRAPHIQUE */}
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        percent >= 100
                          ? "bg-emerald-500"
                          : percent >= 70
                          ? "bg-blue-500"
                          : "bg-indigo-400"
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
                    />
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* SECTION ACCORDÉON : MODE AVANCÉ / CODE JSON BRUT (OPTIONNEL) */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
        <button
          type="button"
          onClick={() => setShowAdvancedJson(!showAdvancedJson)}
          className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700 transition-colors border-b border-transparent"
        >
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-slate-500" />
            <span>Mode Avancé : Afficher / Modifier le JSON brut (Optionnel pour Développeurs)</span>
          </div>
          <span className="text-[11px] text-blue-600 font-medium">
            {showAdvancedJson ? "Masquer le code JSON" : "Afficher le code JSON"}
          </span>
        </button>

        {showAdvancedJson && (
          <div className="p-4 space-y-3 bg-slate-900">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Code JSON synchronisé en temps réel avec le formulaire ci-dessus</span>
              {rawJsonError ? (
                <span className="text-red-400 flex items-center gap-1 text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5" /> {rawJsonError}
                </span>
              ) : (
                <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Syntaxe JSON valide
                </span>
              )}
            </div>

            <textarea
              rows={12}
              value={rawJsonText}
              onChange={(e) => handleRawJsonChange(e.target.value)}
              className="w-full bg-slate-950 text-emerald-400 font-mono text-xs p-3 rounded-lg border border-slate-800 focus:ring-1 focus:ring-blue-500 outline-none leading-relaxed"
              spellCheck={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MathConfigVisualEditor;
