import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios, { ADMIN_FRONT_PREFIX } from "../../api/axios";
import { CheckCircle, Save, ArrowLeft, Info, Calculator } from "lucide-react";
import type { RuleGroupType } from "react-querybuilder";

import {
  type Program,
  defaultRules,
} from "../../components/admin/programs/QueryBuilderHelpers";
import MathConfigVisualEditor, {
  DEFAULT_MATH_CONFIG,
} from "../../components/admin/programs/MathConfigVisualEditor";
import { EligibilityProfileManager } from "../../components/admin/programs/EligibilityProfileManager";

const ProgramEditor: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const programId = params.id;

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!programId);
  const [error, setError] = useState<string | null>(null);
  const [program, setProgram] = useState<Program>({
    name: { fr: "", ar: "" },
    description: { fr: "", ar: "" },
    isActive: true,
    DateDebut: new Date().toISOString().split("T")[0], // Default to today's date
    DateFin: "",
    link: "",
    criteres: defaultRules,
    has_volets: false,
    math_config: null,
  });

  useEffect(() => {
    let mounted = true;

    async function fetchOne() {
      if (!programId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(`/programs/${programId}`);
        const p = res.data?.program ?? res.data;

        if (!mounted) return;

        let normalizedCriteres: RuleGroupType;
        if (typeof p.criteres === "string") {
          try {
            normalizedCriteres = JSON.parse(p.criteres);
          } catch {
            normalizedCriteres = { ...defaultRules };
          }
        } else if (
          p.criteres &&
          typeof p.criteres === "object" &&
          Array.isArray(p.criteres.rules)
        ) {
          normalizedCriteres = JSON.parse(JSON.stringify(p.criteres));
        } else {
          normalizedCriteres = { ...defaultRules };
        }

        let loadedMathConfig = p.math_config ?? null;
        if (typeof loadedMathConfig === "string") {
          try {
            loadedMathConfig = JSON.parse(loadedMathConfig);
          } catch {
            // keep as is or null
          }
        }

        const dateDebut = p.DateDebut ? String(p.DateDebut).split("T")[0] : "";
        const dateFin = p.DateFin ? String(p.DateFin).split("T")[0] : "";

        const newProgram: Program = {
          name: p.name ?? "",
          description: p.description ?? "",
          isActive: Boolean(p.isActive),
          DateDebut: dateDebut,
          DateFin: dateFin,
          link: p.link ?? "",
          criteres: normalizedCriteres,
          has_volets: Boolean(p.has_volets),
          math_config: loadedMathConfig,
          _id: p._id ?? p.id,
          id: p.id ?? p._id,
        };

        setTimeout(() => {
          if (mounted) {
            setProgram(newProgram);
          }
        }, 0);
      } catch {
        if (mounted) {
          setError("Erreur lors du chargement du programme");
        }
      } finally {
        setTimeout(() => {
          if (mounted) {
            setLoading(false);
          }
        }, 100);
      }
    }

    fetchOne();

    return () => {
      mounted = false;
    };
  }, [programId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = {
        name: program.name,
        description: program.description,
        isActive: program.isActive,
        DateDebut: program.DateDebut
          ? new Date(program.DateDebut).toISOString()
          : null,
        DateFin: program.DateFin
          ? new Date(program.DateFin).toISOString()
          : null,
        link: program.link || "",
        criteres: program.criteres,
        has_volets: Boolean(program.has_volets),
        math_config: program.has_volets
          ? program.math_config || DEFAULT_MATH_CONFIG
          : null,
      };

      if (programId) {
        await axios.put(`/programs/${programId}`, payload);
      } else {
        await axios.post(`/programs`, payload);
      }

      navigate(`${ADMIN_FRONT_PREFIX}/programs`);
    } catch {
      setError("Erreur lors de l'enregistrement du programme");
    } finally {
      setSaving(false);
    }
  };

  const pageTitle = programId ? "Modifier le programme" : "Nouveau programme";

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-3 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-sans"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour
          </button>
          <h1 className="text-2xl font-bold text-gray-800">{pageTitle}</h1>
        </div>
        <button
          type="submit"
          form="program-editor-form"
          disabled={saving}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-800 text-white disabled:opacity-60 font-sans"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>

      {loading ? (
        <div className="h-64 grid place-items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      ) : (
        <form
          id="program-editor-form"
          onSubmit={handleSave}
          className="space-y-6"
        >
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3">
              {error}
            </div>
          )}

          <section className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2 text-blue-600" /> Informations de base
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nom FR */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du programme (FR) *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Programme de soutien aux startups"
                  value={program.name.fr}
                  onChange={(e) =>
                    setProgram((p) => ({
                      ...p,
                      name: { ...p.name, fr: e.target.value },
                    }))
                  }
                />
              </div>

              {/* Nom AR */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du programme (AR)
                </label>
                <input
                  type="text"
                  required={false}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                  placeholder="مثال: برنامج دعم المقاولات الناشئة"
                  value={program.name.ar}
                  onChange={(e) =>
                    setProgram((p) => ({
                      ...p,
                      name: { ...p.name, ar: e.target.value },
                    }))
                  }
                />
              </div>

              {/* Lien */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lien officiel
                </label>
                <input
                  type="url"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com"
                  value={program.link}
                  onChange={(e) =>
                    setProgram((p) => ({ ...p, link: e.target.value }))
                  }
                />
              </div>

              {/* Statut */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={String(program.isActive)}
                  onChange={(e) =>
                    setProgram((p) => ({
                      ...p,
                      isActive: e.target.value === "true",
                    }))
                  }
                >
                  <option value="true">Actif</option>
                  <option value="false">Inactif</option>
                </select>
              </div>

              {/* Dates */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de début
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={program.DateDebut || ""}
                    onChange={(e) =>
                      setProgram((p) => ({ ...p, DateDebut: e.target.value }))
                    }
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de fin
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={program.DateFin || ""}
                    onChange={(e) =>
                      setProgram((p) => ({ ...p, DateFin: e.target.value }))
                    }
                  />
                </div>
              </div>

              {/* Description FR */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (FR)
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={program.description.fr}
                  onChange={(e) =>
                    setProgram((p) => ({
                      ...p,
                      description: { ...p.description, fr: e.target.value },
                    }))
                  }
                />
              </div>

              {/* Description AR */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (AR) *
                </label>
                <textarea
                  required={false}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                  value={program.description.ar}
                  onChange={(e) =>
                    setProgram((p) => ({
                      ...p,
                      description: { ...p.description, ar: e.target.value },
                    }))
                  }
                  placeholder="مثال: وصف البرنامج باللغة العربية"
                />
              </div>
            </div>
          </section>

          {/* SECTION VOLETS 1 & 2 (CHARTE DE L'INVESTISSEMENT) */}
          <section className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Configuration des Volets 1 &amp; 2 (Charte de l'Investissement)
                  </h2>
                  <p className="text-xs text-gray-500">
                    Active les calculs financiers déterministes et les simulations de subventions selon la Charte de l'Investissement.
                  </p>
                </div>
              </div>

              {/* Switch interactif */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(program.has_volets)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setProgram((p) => ({
                      ...p,
                      has_volets: checked,
                      math_config: checked
                        ? p.math_config || DEFAULT_MATH_CONFIG
                        : p.math_config,
                    }));
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-semibold text-gray-700 select-none">
                  Activer les Volets 1 &amp; 2 pour ce programme
                </span>
              </label>
            </div>

            {program.has_volets && (
              <div className="pt-2">
                <MathConfigVisualEditor
                  value={program.math_config}
                  onChange={(updated) => {
                    setProgram((p) => ({ ...p, math_config: updated }));
                  }}
                />
              </div>
            )}
          </section>

          {/* SECTION CRITÈRES D'ÉLIGIBILITÉ (PROFILS MULTIPLES - DNF) */}
          <section className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-blue-600" /> Critères d'éligibilité
            </h2>

            <EligibilityProfileManager
              value={program.criteres}
              onChange={(updatedCriteres: RuleGroupType) => {
                setProgram((p) => ({ ...p, criteres: updatedCriteres }));
              }}
              programId={programId ? Number(programId) : undefined}
            />
          </section>
        </form>
      )}
    </div>
  );
};

export default ProgramEditor;
