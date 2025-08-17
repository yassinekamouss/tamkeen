import React, { useMemo, useState } from "react";
import { X, Search, CheckCircle } from "lucide-react";
import {
  SECTEURS_TRAVAIL,
  REGIONS,
  STATUT_JURIDIQUE_OPTIONS,
  MONTANT_INVESTISSEMENT_OPTIONS,
  ANNEE_CREATION,
} from "../../eligibility/constants_for_adding_programs";
import type { ProgramFormData } from "../../../types/admin/program";

type Props = {
  show: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void> | void;
  formData: ProgramFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProgramFormData>>;
  isEditing: boolean;
};

const BulkApplyCA: React.FC<{
  onApply: (min: number | null, max: number | null) => void;
}> = ({ onApply }) => {
  const [min, setMin] = useState<number | "" | null>("");
  const [max, setMax] = useState<number | "" | null>("");
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-md p-2 mb-3">
      <div className="text-xs text-gray-600 mb-2">Appliquer aux secteurs sélectionnés</div>
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="block text-[11px] text-gray-500 mb-1">Min</label>
          <input
            type="number"
            className="w-full px-2 py-1.5 border border-gray-300 rounded"
            value={min === null ? "" : min}
            onChange={(e) => setMin(e.target.value ? Number(e.target.value) : null)}
          />
        </div>
        <div className="flex-1">
          <label className="block text-[11px] text-gray-500 mb-1">Max</label>
          <input
            type="number"
            className="w-full px-2 py-1.5 border border-gray-300 rounded"
            value={max === null ? "" : max}
            onChange={(e) => setMax(e.target.value ? Number(e.target.value) : null)}
          />
        </div>
        <button
          type="button"
          onClick={() => onApply(min === "" ? null : (min as number | null), max === "" ? null : (max as number | null))}
          className="px-3 py-2 bg-slate-700 text-white rounded hover:bg-slate-800 text-sm"
        >
          Appliquer à tous
        </button>
      </div>
    </div>
  );
};

const MultiSelectGroup: React.FC<{
  label: string;
  options: { label: string; value: string | number }[];
  selected: (string | number)[];
  onChange: (next: (string | number)[]) => void;
  height?: "sm" | "md" | "lg";
}> = ({ label, options, selected, onChange, height = "md" }) => {
  const [query, setQuery] = useState("");
  const sizeClass = useMemo(() => {
    switch (height) {
      case "sm":
        return "max-h-28";
      case "lg":
        return "max-h-64";
      default:
        return "max-h-40";
    }
  }, [height]);

  const filtered = useMemo(
    () => options.filter((o) => String(o.label).toLowerCase().includes(query.toLowerCase())),
    [options, query]
  );

  const allValues = useMemo(() => options.map((o) => o.value), [options]);
  const setAll = () => onChange(allValues);
  const clearAll = () => onChange([]);

  const toggleValue = (value: string | number, checked: boolean) => {
    if (checked) onChange([...(selected as (string | number)[]), value]);
    else onChange(selected.filter((v) => v !== value));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2 gap-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="flex items-center gap-2">
          <button type="button" onClick={setAll} className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-50">
            Tout
          </button>
          <button type="button" onClick={clearAll} className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-50">
            Aucun
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filtrer..."
            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        <span className="text-xs text-gray-500 whitespace-nowrap">{selected.length}/{options.length} sélectionnés</span>
      </div>
      <div className={`${sizeClass} overflow-y-auto border border-gray-200 rounded-lg p-3 space-y-2 bg-white`}>
        {filtered.length === 0 ? (
          <p className="text-xs text-gray-500">Aucune option</p>
        ) : (
          filtered.map((opt) => (
            <label key={String(opt.value)} className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={selected.includes(opt.value)}
                onChange={(e) => toggleValue(opt.value, e.target.checked)}
              />
              <span className="ml-2 text-sm text-gray-700">{opt.label}</span>
            </label>
          ))
        )}
      </div>
    </div>
  );
};

const ProgramFormModal: React.FC<Props> = ({ show, onClose, onSubmit, formData, setFormData, isEditing }) => {
  const secteurLabelByValue = useMemo(
    () => new Map<string, string>(SECTEURS_TRAVAIL.map((s) => [s.value, s.key])),
    []
  );

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 w-full max-w-5xl lg:max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-700 px-6 py-4 rounded-t-2xl sticky top-0 z-20 shadow-sm border-b border-slate-600/50">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">{isEditing ? "Modifier le programme" : "Nouveau programme"}</h2>
            <button onClick={onClose} aria-label="Fermer la fenêtre" className="text-white transition-colors p-2 rounded-md bg-slate-600/60 focus:outline-none focus:ring-2 focus:ring-white/60">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h4 className="text-sm font-medium text-gray-800 mb-4">Informations de base</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom du programme *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Programme de soutien aux startups"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site web</label>
                  <input
                    type="url"
                    placeholder="https://www.exemple.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.isActive.toString()}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "true" })}
                  >
                    <option value="true">Actif</option>
                    <option value="false">Inactif</option>
                  </select>
                </div>

                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date de début</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.DateDebut ? formData.DateDebut.split("T")[0] : ""}
                      onChange={(e) => setFormData({ ...formData, DateDebut: e.target.value })}
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date fin</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.DateFin ? formData.DateFin.split("T")[0] : ""}
                      onChange={(e) => setFormData({ ...formData, DateFin: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                required
                rows={3}
                placeholder="Décrivez les objectifs et les avantages de ce programme de subvention..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Criteria */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-blue-600" />
                Critères d'éligibilité
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Type d'applicant */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Type d'applicant</label>
                  <div className="space-y-2">
                    {["physique", "morale"].map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={formData.criteres.applicantType.includes(type)}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              criteres: {
                                ...prev.criteres,
                                applicantType: e.target.checked
                                  ? [...prev.criteres.applicantType, type]
                                  : prev.criteres.applicantType.filter((t) => t !== type),
                              },
                            }))
                          }
                        />
                        <span className="ml-2 text-sm text-gray-700">{type === "physique" ? "Personne physique" : "Personne morale"}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sexe */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Sexe</label>
                  <div className="space-y-2">
                    {["homme", "femme"].map((gender) => (
                      <label key={gender} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={formData.criteres.sexe.includes(gender)}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              criteres: {
                                ...prev.criteres,
                                sexe: e.target.checked
                                  ? [...prev.criteres.sexe, gender]
                                  : prev.criteres.sexe.filter((g) => g !== gender),
                              },
                            }))
                          }
                        />
                        <span className="ml-2 text-sm text-gray-700">{gender === "homme" ? "Homme" : "Femme"}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Age */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Âge</label>
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">Âge minimum</label>
                      <input
                        type="number"
                        min={18}
                        max={100}
                        placeholder="18"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.criteres.age.minAge || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            criteres: {
                              ...formData.criteres,
                              age: {
                                ...formData.criteres.age,
                                minAge: e.target.value ? Number(e.target.value) : null,
                                maxAge: formData.criteres.age?.maxAge ?? null,
                              },
                            },
                          })
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">Âge maximum</label>
                      <input
                        type="number"
                        min={18}
                        max={100}
                        placeholder="65"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.criteres.age.maxAge || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            criteres: {
                              ...formData.criteres,
                              age: {
                                ...formData.criteres.age,
                                maxAge: e.target.value ? Number(e.target.value) : null,
                                minAge: formData.criteres.age?.minAge ?? null,
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Chiffre d'affaires global */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chiffre d'affaires global (optionnel)</label>
                  <p className="text-xs text-gray-500 mb-2">Ignoré si des valeurs par secteur sont définies.</p>
                  <div className="flex space-x-4 mb-4">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">Minimum</label>
                      <input
                        type="number"
                        placeholder="100000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.criteres.chiffreAffaire.chiffreAffaireMin || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            criteres: {
                              ...prev.criteres,
                              chiffreAffaire: {
                                ...prev.criteres.chiffreAffaire,
                                chiffreAffaireMin: e.target.value ? Number(e.target.value) : null,
                              },
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">Maximum</label>
                      <input
                        type="number"
                        placeholder="5000000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.criteres.chiffreAffaire.chiffreAffaireMax || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            criteres: {
                              ...prev.criteres,
                              chiffreAffaire: {
                                ...prev.criteres.chiffreAffaire,
                                chiffreAffaireMax: e.target.value ? Number(e.target.value) : null,
                              },
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* CA par secteur */}
                <div className="col-span-2 border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Chiffre d'affaires par secteur</span>
                  </div>
                  <BulkApplyCA
                    onApply={(min, max) => {
                      setFormData((prev) => {
                        const selected = prev.criteres.secteurActivite;
                        const map = new Map(prev.criteres.chiffreAffaireParSecteur.map((e) => [e.secteur, e]));
                        selected.forEach((s) => {
                          const existing = map.get(s);
                          if (existing) {
                            existing.min = min;
                            existing.max = max;
                          } else {
                            map.set(s, { secteur: s, min, max });
                          }
                        });
                        const nextArr = Array.from(map.values()).filter((e) => selected.includes(e.secteur));
                        return {
                          ...prev,
                          criteres: { ...prev.criteres, chiffreAffaireParSecteur: nextArr },
                        };
                      });
                    }}
                  />
                  {formData.criteres.secteurActivite.length === 0 ? (
                    <p className="text-xs text-gray-500">Sélectionnez d'abord des secteurs d'activité.</p>
                  ) : (
                    <div className="space-y-2">
                      {formData.criteres.secteurActivite.map((secteur) => {
                        const entry = (formData.criteres.chiffreAffaireParSecteur || []).find((e) => e.secteur === secteur) || {
                          secteur,
                          min: null,
                          max: null,
                        };
                        return (
                          <div key={secteur} className="grid grid-cols-12 gap-2 items-end">
                            <div className="col-span-6">
                              <label className="block text-xs text-gray-500 mb-1">Secteur</label>
                              <input
                                disabled
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded"
                                value={secteurLabelByValue.get(secteur) ?? secteur}
                              />
                            </div>
                            <div className="col-span-3">
                              <label className="block text-xs text-gray-500 mb-1">Min</label>
                              <input
                                type="number"
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                value={entry.min ?? ""}
                                onChange={(e) => {
                                  const val = e.target.value ? Number(e.target.value) : null;
                                  setFormData((prev) => {
                                    const arr = [...(prev.criteres.chiffreAffaireParSecteur || [])];
                                    const idx = arr.findIndex((a) => a.secteur === secteur);
                                    if (idx >= 0) arr[idx] = { ...arr[idx], min: val };
                                    else arr.push({ secteur, min: val, max: entry.max ?? null });
                                    const next = arr.filter((a) => prev.criteres.secteurActivite.includes(a.secteur));
                                    return { ...prev, criteres: { ...prev.criteres, chiffreAffaireParSecteur: next } };
                                  });
                                }}
                              />
                            </div>
                            <div className="col-span-3">
                              <label className="block text-xs text-gray-500 mb-1">Max</label>
                              <input
                                type="number"
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                value={entry.max ?? ""}
                                onChange={(e) => {
                                  const val = e.target.value ? Number(e.target.value) : null;
                                  setFormData((prev) => {
                                    const arr = [...(prev.criteres.chiffreAffaireParSecteur || [])];
                                    const idx = arr.findIndex((a) => a.secteur === secteur);
                                    if (idx >= 0) arr[idx] = { ...arr[idx], max: val };
                                    else arr.push({ secteur, min: entry.min ?? null, max: val });
                                    const next = arr.filter((a) => prev.criteres.secteurActivite.includes(a.secteur));
                                    return { ...prev, criteres: { ...prev.criteres, chiffreAffaireParSecteur: next } };
                                  });
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Secteurs d'activité */}
                <div className="col-span-2">
                  <MultiSelectGroup
                    label="Secteurs d'activité"
                    height="lg"
                    options={SECTEURS_TRAVAIL.map((s) => ({ label: s.key, value: s.value }))}
                    selected={formData.criteres.secteurActivite}
                    onChange={(next) =>
                      setFormData((prev) => {
                        const selected = next as string[];
                        const map = new Map((prev.criteres.chiffreAffaireParSecteur || []).map((e) => [e.secteur, e]));
                        selected.forEach((s) => {
                          if (!map.has(s)) map.set(s, { secteur: s, min: null, max: null });
                        });
                        const nextArr = Array.from(map.values()).filter((e) => selected.includes(e.secteur));
                        return { ...prev, criteres: { ...prev.criteres, secteurActivite: selected, chiffreAffaireParSecteur: nextArr } };
                      })
                    }
                  />
                </div>

                {/* Statuts juridiques */}
                <div>
                  <MultiSelectGroup
                    label="Statuts juridiques"
                    options={STATUT_JURIDIQUE_OPTIONS.map((o) => ({ label: o.key, value: o.value }))}
                    selected={formData.criteres.statutJuridique}
                    onChange={(next) =>
                      setFormData((prev) => ({
                        ...prev,
                        criteres: { ...prev.criteres, statutJuridique: next as string[] },
                      }))
                    }
                  />
                </div>

                {/* Montant d'investissement */}
                <div>
                  <MultiSelectGroup
                    label="Montant d'investissement"
                    options={MONTANT_INVESTISSEMENT_OPTIONS.map((o) => ({ label: o.key, value: o.value }))}
                    selected={formData.criteres.montantInvestissement}
                    onChange={(next) =>
                      setFormData((prev) => ({
                        ...prev,
                        criteres: { ...prev.criteres, montantInvestissement: next as string[] },
                      }))
                    }
                  />
                </div>

                {/* Régions */}
                <div>
                  <MultiSelectGroup
                    label="Régions"
                    options={REGIONS.map((r) => ({ label: r, value: r }))}
                    selected={formData.criteres.region}
                    onChange={(next) =>
                      setFormData((prev) => ({ ...prev, criteres: { ...prev.criteres, region: next as string[] } }))
                    }
                  />
                </div>

                {/* Année de création */}
                <div>
                  <MultiSelectGroup
                    label="Année de création"
                    options={ANNEE_CREATION.map((a) => ({ label: String(a), value: a }))}
                    selected={formData.criteres.anneeCreation}
                    onChange={(next) => setFormData((prev) => ({ ...prev, criteres: { ...prev.criteres, anneeCreation: next } }))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 mt-8">
            <button type="button" onClick={onClose} className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
              Annuler
            </button>
            <button type="submit" className="px-6 py-3 bg-slate-700 hover:bg-slate-800 text-white rounded-lg font-medium transition-all duration-200 shadow-lg">
              {isEditing ? "Mettre à jour" : "Créer le programme"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProgramFormModal;
