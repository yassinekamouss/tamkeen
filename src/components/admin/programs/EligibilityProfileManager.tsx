import React, { useState, useEffect, useRef } from "react";
import type { RuleGroupType } from "react-querybuilder";
import {
  Layers,
  Plus,
  Copy,
  Trash2,
  Edit2,
  Check,
} from "lucide-react";
import {
  type EligibilityProfile,
  createDefaultProfile,
  duplicateProfile,
  profilesToRuleGroup,
  ruleGroupToProfiles,
  countActiveCriteria,
  generateProfileSummaryTags,
} from "./dnfCompiler";
import { EligibilityProfileCardEditor } from "./EligibilityProfileCardEditor";
import { MagicRuleGenerator } from "./MagicRuleGenerator";

interface Props {
  value: RuleGroupType;
  onChange: (updated: RuleGroupType) => void;
  programId?: number;
}

const CardsSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse mt-4">
      <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-700">
        <div className="flex items-center gap-2.5">
          <div className="w-4 h-4 rounded-full border-2 border-gray-600 border-t-transparent animate-spin"></div>
          <span className="font-medium">
            Configuration automatique des profils d'éligibilité en cours...
          </span>
        </div>
        <span className="text-[11px] text-gray-500 font-medium">Traitement</span>
      </div>

      {[
        "1. Territoire & Régions",
        "2. Secteurs d'activité",
        "3. Forme Juridique & Demandeur",
        "4. Maturité & Âge de l'entreprise",
        "5. Envergure Financière & Effectifs",
      ].map((title, idx) => (
        <div
          key={idx}
          className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-xs relative overflow-hidden"
        >
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-200"></div>
              <div>
                <div className="text-xs font-semibold text-slate-400 mb-1">{title}</div>
                <div className="h-3 w-48 bg-slate-100 rounded"></div>
              </div>
            </div>
            <div className="h-7 w-28 bg-slate-100 rounded-lg"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mt-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((k) => (
              <div key={k} className="h-10 bg-slate-100/70 rounded-lg border border-slate-200/40"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export const EligibilityProfileManager: React.FC<Props> = ({
  value,
  onChange,
  programId,
}) => {
  const [profiles, setProfiles] = useState<EligibilityProfile[]>(() =>
    ruleGroupToProfiles(value)
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const [activeProfileId, setActiveProfileId] = useState<string>(() => {
    const initial = ruleGroupToProfiles(value);
    return initial[0]?.id || "default";
  });

  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [editingNameValue, setEditingNameValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync internal profiles when value changes externally (e.g. on initial fetch)
  const isInternalChange = useRef(false);
  useEffect(() => {
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    const decompiled = ruleGroupToProfiles(value);
    setProfiles(decompiled);
    if (!decompiled.some((p) => p.id === activeProfileId)) {
      setActiveProfileId(decompiled[0]?.id || "default");
    }
  }, [value]);

  useEffect(() => {
    if (editingNameId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingNameId]);

  const emitChange = (newProfiles: EligibilityProfile[]) => {
    isInternalChange.current = true;
    setProfiles(newProfiles);
    const compiled = profilesToRuleGroup(newProfiles);
    onChange(compiled);
  };

  const activeProfile =
    profiles.find((p) => p.id === activeProfileId) || profiles[0];

  const handleAddProfile = () => {
    const newProfile = createDefaultProfile(`Profil ${profiles.length + 1}`);
    const next = [...profiles, newProfile];
    setActiveProfileId(newProfile.id);
    emitChange(next);
  };

  const handleDuplicateProfile = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const source = profiles.find((p) => p.id === id);
    if (!source) return;
    const cloned = duplicateProfile(source, `${source.name} (Copie)`);
    const next = [...profiles, cloned];
    setActiveProfileId(cloned.id);
    emitChange(next);
  };

  const handleDeleteProfile = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (profiles.length <= 1) return;
    const next = profiles.filter((p) => p.id !== id);
    if (activeProfileId === id) {
      setActiveProfileId(next[0].id);
    }
    emitChange(next);
  };

  const startRenaming = (profile: EligibilityProfile, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingNameId(profile.id);
    setEditingNameValue(profile.name);
  };

  const saveRenaming = () => {
    if (!editingNameId) return;
    const trimmed = editingNameValue.trim() || "Profil sans titre";
    const next = profiles.map((p) =>
      p.id === editingNameId ? { ...p, name: trimmed } : p
    );
    setEditingNameId(null);
    emitChange(next);
  };

  const handleProfileChange = (updated: EligibilityProfile) => {
    const next = profiles.map((p) => (p.id === updated.id ? updated : p));
    emitChange(next);
  };

  const handleRulesGenerated = (
    newProfiles: EligibilityProfile[],
    _summary: string,
    applyMode: "APPEND" | "REPLACE" = "APPEND"
  ) => {
    const startIndex = applyMode === "APPEND" ? profiles.length : 0;

    const hydratedProfiles: EligibilityProfile[] = newProfiles.map((p, idx) => {
      const defaultP = createDefaultProfile(p.name || `Profil ${startIndex + idx + 1}`);
      return {
        ...defaultP,
        ...p,
        id: p.id || `profile_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
        name: p.name || `Profil ${startIndex + idx + 1}`,
      };
    });

    if (hydratedProfiles.length > 0) {
      let finalProfiles: EligibilityProfile[];
      if (applyMode === "APPEND") {
        finalProfiles = [...profiles, ...hydratedProfiles];
      } else {
        finalProfiles = hydratedProfiles;
      }
      setActiveProfileId(hydratedProfiles[0].id);
      emitChange(finalProfiles);
    }
  };

  return (
    <div className="space-y-4">
      {/* ── ASSISTANT IA : MAGIC INPUT ───────────────────────────────── */}
      <MagicRuleGenerator
        programId={programId}
        onRulesGenerated={handleRulesGenerated}
        isGenerating={isGenerating}
        setIsGenerating={setIsGenerating}
      />

      {/* ── BANDEAU D'EXPLICATION DNF ──────────────────────────────────── */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-800 text-white rounded-lg mt-0.5">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-semibold text-gray-900">
                  Profils d'éligibilité multiples (Logique OU)
                </h3>
                <span className="px-2 py-0.5 text-[11px] font-medium bg-gray-200 text-gray-700 rounded-md">
                  {profiles.length} profil{profiles.length > 1 ? "s" : ""}{" "}
                  configuré{profiles.length > 1 ? "s" : ""}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Le candidat est éligible au programme s'il correspond au{" "}
                <strong className="text-gray-900">Profil 1</strong>{" "}
                {profiles.length > 1 && (
                  <>
                    <span className="font-semibold text-gray-700">OU</span> au{" "}
                    <strong className="text-gray-900">
                      {profiles[1]?.name || "Profil 2"}
                    </strong>
                    {profiles.length > 2 && " OU à l'un des autres profils"}
                  </>
                )}
                . À l'intérieur de chaque profil, les 5 critères visuels
                s'appliquent ensemble (
                <span className="font-medium text-emerald-700">ET</span>{" "}
                implicite).
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddProfile}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all shrink-0 hover:shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Profil</span>
          </button>
        </div>
      </div>

      {/* ── NAVIGATION PAR ONGLETS (TABS) ──────────────────────────────── */}
      <div className="border-b border-gray-200">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-px">
          {profiles.map((profile) => {
            const isActive = profile.id === activeProfile?.id;
            const activeCriteriaCount = countActiveCriteria(profile);
            const isEditing = editingNameId === profile.id;

            return (
              <div
                key={profile.id}
                onClick={() => setActiveProfileId(profile.id)}
                className={`group relative flex items-center gap-2 px-4 py-2.5 text-xs font-medium rounded-t-xl border-t-2 transition-all cursor-pointer select-none whitespace-nowrap ${
                  isActive
                    ? "bg-white border-blue-600 text-blue-900 font-semibold shadow-sm border-x border-gray-200"
                    : "bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {/* Libellé ou Input inline */}
                {isEditing ? (
                  <div
                    className="flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={editingNameValue}
                      onChange={(e) => setEditingNameValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveRenaming();
                        if (e.key === "Escape") setEditingNameId(null);
                      }}
                      onBlur={saveRenaming}
                      className="px-2 py-0.5 text-xs border border-blue-400 rounded focus:ring-1 focus:ring-blue-500 font-semibold text-gray-800"
                    />
                    <button
                      type="button"
                      onClick={saveRenaming}
                      className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div
                    className="flex items-center gap-1.5"
                    onDoubleClick={(e) => startRenaming(profile, e)}
                  >
                    <span>{profile.name}</span>
                    <button
                      type="button"
                      onClick={(e) => startRenaming(profile, e)}
                      title="Renommer ce profil"
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-600 transition-opacity p-0.5"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* Badge nombre de critères actifs */}
                <span
                  title={`${activeCriteriaCount} critère(s) actif(s)`}
                  className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                    activeCriteriaCount > 0
                      ? isActive
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-200 text-gray-700"
                      : "bg-gray-100 text-gray-400 font-normal"
                  }`}
                >
                  {activeCriteriaCount}
                </span>

                {/* Actions sur l'onglet */}
                <div className="flex items-center gap-0.5 ml-1">
                  <button
                    type="button"
                    onClick={(e) => handleDuplicateProfile(profile.id, e)}
                    title="Dupliquer ce profil"
                    className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {profiles.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => handleDeleteProfile(profile.id, e)}
                      title="Supprimer ce profil"
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={handleAddProfile}
            title="Ajouter un profil alternatif"
            className="flex items-center gap-1 px-3 py-2 text-xs text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-t-lg transition-colors ml-1 font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter profil</span>
          </button>
        </div>
      </div>

      {/* ── RÉCAPITULATIF SYNTHÉTIQUE DU PROFIL ACTIF ───────────────────── */}
      {activeProfile && (
        <div className="flex items-center justify-between bg-gray-50/80 border border-gray-200 rounded-lg px-4 py-2 text-xs flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-700">
              Critères actifs pour « {activeProfile.name} » :
            </span>
            {generateProfileSummaryTags(activeProfile).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-white border border-gray-200 text-gray-700 rounded-md font-medium text-[11px] shadow-2xs"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="text-[11px] text-gray-500 italic">
            Astuce : Double-cliquez sur le titre de l'onglet pour renommer le profil.
          </div>
        </div>
      )}

      {/* ── ÉDITEUR DES 5 CARTES VISUELLES POUR CE PROFIL OU SKELETON ─── */}
      {isGenerating ? (
        <CardsSkeleton />
      ) : (
        activeProfile && (
          <div className="mt-4">
            <EligibilityProfileCardEditor
              profile={activeProfile}
              onChange={handleProfileChange}
            />
          </div>
        )
      )}
    </div>
  );
};
