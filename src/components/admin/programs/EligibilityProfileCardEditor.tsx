import React, { useState } from "react";
import {
  MapPin,
  Factory,
  Building2,
  Calendar,
  DollarSign,
  Search,
  Check,
} from "lucide-react";
import type { EligibilityProfile } from "./dnfCompiler";
import {
  SECTEURS_TRAVAIL,
  REGIONS,
  STATUT_JURIDIQUE_OPTIONS,
  MONTANT_INVESTISSEMENT_OPTIONS,
  ANNEE_CREATION,
  NUMBER_OF_EMPLOYEES,
} from "../../eligibility/constants_for_adding_programs";

interface Props {
  profile: EligibilityProfile;
  onChange: (updated: EligibilityProfile) => void;
}

export const EligibilityProfileCardEditor: React.FC<Props> = ({
  profile,
  onChange,
}) => {
  const [secteurSearch, setSecteurSearch] = useState("");

  const update = (partial: Partial<EligibilityProfile>) => {
    onChange({ ...profile, ...partial });
  };

  const toggleRegion = (region: string) => {
    const next = profile.regions.includes(region)
      ? profile.regions.filter((r) => r !== region)
      : [...profile.regions, region];
    update({ regions: next, regionsMode: "SPECIFIC" });
  };

  const toggleSecteur = (value: string) => {
    const next = profile.secteurs.includes(value)
      ? profile.secteurs.filter((s) => s !== value)
      : [...profile.secteurs, value];
    update({ secteurs: next, secteursMode: "SPECIFIC" });
  };

  const toggleStatut = (value: string) => {
    const next = profile.statuts.includes(value)
      ? profile.statuts.filter((s) => s !== value)
      : [...profile.statuts, value];
    update({ statuts: next, statutsMode: "SPECIFIC" });
  };

  const toggleInvestissement = (value: string) => {
    const next = profile.investissements.includes(value)
      ? profile.investissements.filter((i) => i !== value)
      : [...profile.investissements, value];
    update({ investissements: next });
  };

  const toggleEmployee = (value: string) => {
    const next = profile.employees.includes(value)
      ? profile.employees.filter((e) => e !== value)
      : [...profile.employees, value];
    update({ employees: next });
  };

  const filteredSecteurs = SECTEURS_TRAVAIL.filter((s) =>
    s.key.toLowerCase().includes(secteurSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* ── CARTE 1 : TERRITOIRE & RÉGIONS ─────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm transition-all hover:border-blue-300">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-800">
                1. Territoire &amp; Régions
              </h3>
              <p className="text-xs text-gray-500">
                Définit les régions géographiques éligibles pour ce profil.
              </p>
            </div>
          </div>

          <div className="flex items-center bg-gray-100 p-1 rounded-lg text-xs font-medium">
            <button
              type="button"
              onClick={() => update({ regionsMode: "ALL", regions: [] })}
              className={`px-3 py-1.5 rounded-md transition-all ${
                profile.regionsMode === "ALL"
                  ? "bg-white text-blue-700 shadow-sm font-semibold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Toutes les régions (Maroc entier)
            </button>
            <button
              type="button"
              onClick={() => update({ regionsMode: "SPECIFIC" })}
              className={`px-3 py-1.5 rounded-md transition-all ${
                profile.regionsMode === "SPECIFIC"
                  ? "bg-white text-blue-700 shadow-sm font-semibold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Régions spécifiques ({profile.regions.length})
            </button>
          </div>
        </div>

        {profile.regionsMode === "SPECIFIC" ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-600">
                Sélectionnez les régions ciblées :
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => update({ regions: [...REGIONS] })}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Tout sélectionner
                </button>
                <span className="text-gray-300">|</span>
                <button
                  type="button"
                  onClick={() => update({ regions: [] })}
                  className="text-xs text-gray-500 hover:underline"
                >
                  Tout désélectionner
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {REGIONS.map((r) => {
                const selected = profile.regions.includes(r);
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => toggleRegion(r)}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-xs text-left transition-all ${
                      selected
                        ? "bg-blue-50/70 border-blue-400 text-blue-800 font-medium"
                        : "bg-gray-50/50 border-gray-200 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="truncate mr-1">{r}</span>
                    {selected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-blue-50/40 border border-blue-100 rounded-lg p-3 text-xs text-blue-700 flex items-center gap-2">
            <Check className="w-4 h-4 text-blue-600" />
            <span>Aucune restriction géographique : toutes les 12 régions du Maroc sont éligibles.</span>
          </div>
        )}
      </div>

      {/* ── CARTE 2 : SECTEURS D'ACTIVITÉ ──────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm transition-all hover:border-emerald-300">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <Factory className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-800">
                2. Secteurs d'Activité
              </h3>
              <p className="text-xs text-gray-500">
                Ciblez les filières et branches d'activité admises.
              </p>
            </div>
          </div>

          <div className="flex items-center bg-gray-100 p-1 rounded-lg text-xs font-medium">
            <button
              type="button"
              onClick={() => update({ secteursMode: "ALL", secteurs: [] })}
              className={`px-3 py-1.5 rounded-md transition-all ${
                profile.secteursMode === "ALL"
                  ? "bg-white text-emerald-700 shadow-sm font-semibold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Tous les secteurs (Sans exclusion)
            </button>
            <button
              type="button"
              onClick={() => update({ secteursMode: "SPECIFIC" })}
              className={`px-3 py-1.5 rounded-md transition-all ${
                profile.secteursMode === "SPECIFIC"
                  ? "bg-white text-emerald-700 shadow-sm font-semibold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Secteurs spécifiques ({profile.secteurs.length})
            </button>
          </div>
        </div>

        {profile.secteursMode === "SPECIFIC" ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Rechercher un secteur (ex: Industrie, Energie, Digital...)"
                  value={secteurSearch}
                  onChange={(e) => setSecteurSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => update({ secteurs: [] })}
                className="text-xs text-gray-500 hover:underline whitespace-nowrap"
              >
                Tout désélectionner
              </button>
            </div>

            <div className="max-h-56 overflow-y-auto pr-1 border border-gray-100 rounded-lg p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5">
              {filteredSecteurs.map((s) => {
                const selected = profile.secteurs.includes(s.value);
                return (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => toggleSecteur(s.value)}
                    className={`flex items-center justify-between p-2 rounded-lg border text-xs text-left transition-all ${
                      selected
                        ? "bg-emerald-50 border-emerald-400 text-emerald-800 font-medium"
                        : "bg-gray-50/50 border-gray-200 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="truncate mr-1" title={s.key}>
                      {s.key}
                    </span>
                    {selected && (
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50/40 border border-emerald-100 rounded-lg p-3 text-xs text-emerald-700 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Tous les secteurs d'activité sont éligibles pour ce profil.</span>
          </div>
        )}
      </div>

      {/* ── CARTE 3 : FORME JURIDIQUE & STATUT ──────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm transition-all hover:border-purple-300">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-800">
                3. Forme Juridique &amp; Applicant
              </h3>
              <p className="text-xs text-gray-500">
                Personnes morales, personnes physiques, coopératives ou statuts spécifiques.
              </p>
            </div>
          </div>

          <div className="flex items-center bg-gray-100 p-1 rounded-lg text-xs font-medium">
            <button
              type="button"
              onClick={() => update({ applicantType: "ALL" })}
              className={`px-3 py-1.5 rounded-md transition-all ${
                profile.applicantType === "ALL"
                  ? "bg-white text-purple-700 shadow-sm font-semibold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Tous
            </button>
            <button
              type="button"
              onClick={() => update({ applicantType: "morale" })}
              className={`px-3 py-1.5 rounded-md transition-all ${
                profile.applicantType === "morale"
                  ? "bg-white text-purple-700 shadow-sm font-semibold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Personne Morale (Sociétés)
            </button>
            <button
              type="button"
              onClick={() => update({ applicantType: "physique" })}
              className={`px-3 py-1.5 rounded-md transition-all ${
                profile.applicantType === "physique"
                  ? "bg-white text-purple-700 shadow-sm font-semibold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Personne Physique
            </button>
          </div>
        </div>

        {/* Statuts juridiques */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600">
              Formes juridiques acceptées :
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => update({ statutsMode: "ALL", statuts: [] })}
                className={`text-xs px-2 py-0.5 rounded ${
                  profile.statutsMode === "ALL"
                    ? "bg-purple-100 text-purple-700 font-semibold"
                    : "text-gray-500 hover:underline"
                }`}
              >
                Toutes les formes
              </button>
              <span className="text-gray-300">|</span>
              <button
                type="button"
                onClick={() => update({ statutsMode: "SPECIFIC" })}
                className={`text-xs px-2 py-0.5 rounded ${
                  profile.statutsMode === "SPECIFIC"
                    ? "bg-purple-100 text-purple-700 font-semibold"
                    : "text-gray-500 hover:underline"
                }`}
              >
                Formes ciblées ({profile.statuts.length})
              </button>
            </div>
          </div>

          {profile.statutsMode === "SPECIFIC" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {STATUT_JURIDIQUE_OPTIONS.map((st) => {
                const selected = profile.statuts.includes(st.value);
                return (
                  <button
                    key={st.value}
                    type="button"
                    onClick={() => toggleStatut(st.value)}
                    className={`p-2 rounded-lg border text-xs text-left transition-all flex items-center justify-between ${
                      selected
                        ? "bg-purple-50 border-purple-400 text-purple-800 font-medium"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="truncate">{st.key}</span>
                    {selected && (
                      <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 ml-1" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="bg-purple-50/40 border border-purple-100 rounded-lg p-2.5 text-xs text-purple-700 flex items-center gap-2">
              <Check className="w-4 h-4 text-purple-600" />
              <span>Toutes les formes juridiques (SARL, SA, SAS, Coopératives, Patente, etc.) sont admises.</span>
            </div>
          )}

          {/* Conditionnel si Personne Physique : Age & Sexe */}
          {profile.applicantType === "physique" && (
            <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-purple-50/20 p-3 rounded-lg">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Sexe requis
                </label>
                <select
                  value={profile.sexe}
                  onChange={(e) => update({ sexe: e.target.value as any })}
                  className="w-full text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-purple-500"
                >
                  <option value="ALL">Tous (Hommes &amp; Femmes)</option>
                  <option value="femme">Femmes uniquement (Entrepreneuriat féminin)</option>
                  <option value="homme">Hommes uniquement</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-gray-700">
                    Tranche d'âge
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.hasNoAgeLimit}
                      onChange={(e) => update({ hasNoAgeLimit: e.target.checked })}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span>Sans limite d'âge</span>
                  </label>
                </div>
                {!profile.hasNoAgeLimit && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min (ex: 18)"
                      value={profile.ageMin ?? ""}
                      onChange={(e) =>
                        update({ ageMin: e.target.value ? Number(e.target.value) : null })
                      }
                      className="w-full text-xs border border-gray-300 rounded-lg px-2.5 py-1.5"
                    />
                    <span className="text-xs text-gray-400">à</span>
                    <input
                      type="number"
                      placeholder="Max (ex: 35)"
                      value={profile.ageMax ?? ""}
                      onChange={(e) =>
                        update({ ageMax: e.target.value ? Number(e.target.value) : null })
                      }
                      className="w-full text-xs border border-gray-300 rounded-lg px-2.5 py-1.5"
                    />
                    <span className="text-xs text-gray-500">ans</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── CARTE 4 : MATURITÉ & ÂGE DE L'ENTREPRISE ───────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm transition-all hover:border-amber-300">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-800">
                4. Maturité &amp; Âge de l'Entreprise
              </h3>
              <p className="text-xs text-gray-500">
                Ciblez les nouvelles créations (startups) ou les entreprises établies.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          {[
            {
              mode: "ALL",
              title: "Toutes les entreprises",
              desc: "Aucune condition sur l'ancienneté",
            },
            {
              mode: "NEW_UNDER_3",
              title: "Moins de 3 ans (Création)",
              desc: "Startups et entreprises récentes",
            },
            {
              mode: "ESTABLISHED_OVER_3",
              title: "Plus de 3 ans (Établie)",
              desc: "Entreprises avec bilans historiques",
            },
            {
              mode: "CUSTOM",
              title: "Années spécifiques",
              desc: "Sélectionner des années précises",
            },
          ].map((item) => {
            const active = profile.creationMode === item.mode;
            return (
              <button
                key={item.mode}
                type="button"
                onClick={() => update({ creationMode: item.mode as any })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  active
                    ? "bg-amber-50/60 border-amber-400 text-amber-900 shadow-sm ring-1 ring-amber-300"
                    : "bg-gray-50/50 border-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs">{item.title}</span>
                  {active && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </div>
                <p className="text-[11px] text-gray-500">{item.desc}</p>
              </button>
            );
          })}
        </div>

        {profile.creationMode === "CUSTOM" && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-600 block mb-2 font-medium">
              Choisissez les années de création admises :
            </span>
            <div className="flex flex-wrap gap-2">
              {ANNEE_CREATION.map((yr) => {
                const selected = profile.creationYears.includes(yr);
                return (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => {
                      const next = selected
                        ? profile.creationYears.filter((y) => y !== yr)
                        : [...profile.creationYears, yr];
                      update({ creationYears: next });
                    }}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      selected
                        ? "bg-amber-100 border-amber-400 text-amber-800"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {yr}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── CARTE 5 : ENVERGURE FINANCIÈRE & EFFECTIFS ──────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm transition-all hover:border-indigo-300 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-800">
                5. Envergure Financière &amp; Effectifs
              </h3>
              <p className="text-xs text-gray-500">
                Plafonds de Chiffre d'Affaires, taille d'investissement et effectifs salariés.
              </p>
            </div>
          </div>
        </div>

        {/* Chiffre d'Affaires */}
        <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Chiffre d'Affaires Annuel (MAD)
            </span>
            <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.hasNoCaMax}
                onChange={(e) => update({ hasNoCaMax: e.target.checked })}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-medium">Pas de plafond maximum (CA illimité)</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Chiffre d'Affaires Minimum (MAD)
              </label>
              <input
                type="number"
                placeholder="Ex: 0 ou 500000"
                value={profile.caMin ?? ""}
                onChange={(e) =>
                  update({ caMin: e.target.value ? Number(e.target.value) : null })
                }
                className="w-full text-xs font-mono border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Chiffre d'Affaires Maximum (MAD)
              </label>
              <input
                type="number"
                disabled={profile.hasNoCaMax}
                placeholder={profile.hasNoCaMax ? "Sans limite supérieure" : "Ex: 10000000"}
                value={profile.hasNoCaMax ? "" : (profile.caMax ?? "")}
                onChange={(e) =>
                  update({ caMax: e.target.value ? Number(e.target.value) : null })
                }
                className={`w-full text-xs font-mono border rounded-lg px-3 py-2 ${
                  profile.hasNoCaMax
                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    : "bg-white border-gray-300 focus:ring-2 focus:ring-indigo-500"
                }`}
              />
            </div>
          </div>

          {/* Presets rapides de CA */}
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <span className="text-[11px] text-gray-400">Raccourcis :</span>
            <button
              type="button"
              onClick={() => update({ caMin: null, caMax: 1000000, hasNoCaMax: false })}
              className="text-[11px] px-2 py-0.5 rounded border border-gray-200 bg-white hover:bg-gray-100 text-gray-700"
            >
              Moins de 1M
            </button>
            <button
              type="button"
              onClick={() => update({ caMin: 1000000, caMax: 10000000, hasNoCaMax: false })}
              className="text-[11px] px-2 py-0.5 rounded border border-gray-200 bg-white hover:bg-gray-100 text-gray-700"
            >
              1M à 10M (TPME)
            </button>
            <button
              type="button"
              onClick={() => update({ caMin: 10000000, caMax: 50000000, hasNoCaMax: false })}
              className="text-[11px] px-2 py-0.5 rounded border border-gray-200 bg-white hover:bg-gray-100 text-gray-700"
            >
              10M à 50M (PME)
            </button>
            <button
              type="button"
              onClick={() => update({ caMin: 50000000, caMax: null, hasNoCaMax: true })}
              className="text-[11px] px-2 py-0.5 rounded border border-gray-200 bg-white hover:bg-gray-100 text-gray-700"
            >
              &gt; 50M (Grande entreprise)
            </button>
            <button
              type="button"
              onClick={() => update({ caMin: null, caMax: null, hasNoCaMax: true })}
              className="text-[11px] px-2 py-0.5 rounded border border-gray-200 bg-white hover:bg-gray-100 text-gray-500"
            >
              Réinitialiser
            </button>
          </div>
        </div>

        {/* Montant d'Investissement & Effectifs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Investissement */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-700">
                Montants d'Investissement acceptés :
              </span>
              <button
                type="button"
                onClick={() => update({ investissements: [] })}
                className="text-[11px] text-gray-400 hover:underline"
              >
                Tous (Sans filtre)
              </button>
            </div>
            <div className="space-y-1.5">
              {MONTANT_INVESTISSEMENT_OPTIONS.map((opt) => {
                const selected = profile.investissements.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleInvestissement(opt.value)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg border text-xs text-left transition-all ${
                      selected
                        ? "bg-indigo-50 border-indigo-400 text-indigo-800 font-medium"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span>{opt.key}</span>
                    {selected && (
                      <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 ml-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Effectifs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-700">
                Effectifs salariés ciblés :
              </span>
              <button
                type="button"
                onClick={() => update({ employees: [] })}
                className="text-[11px] text-gray-400 hover:underline"
              >
                Tous (Sans filtre)
              </button>
            </div>
            <div className="space-y-1.5">
              {NUMBER_OF_EMPLOYEES.map((emp) => {
                const selected = profile.employees.includes(emp);
                return (
                  <button
                    key={emp}
                    type="button"
                    onClick={() => toggleEmployee(emp)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg border text-xs text-left transition-all ${
                      selected
                        ? "bg-indigo-50 border-indigo-400 text-indigo-800 font-medium"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span>{emp}</span>
                    {selected && (
                      <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 ml-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
