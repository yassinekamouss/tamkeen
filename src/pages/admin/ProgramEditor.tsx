import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../api/axios";
import { CheckCircle, Save, ArrowLeft, Info } from "lucide-react";
import {
  SECTEURS_TRAVAIL,
  REGIONS,
  STATUT_JURIDIQUE_OPTIONS,
  MONTANT_INVESTISSEMENT_OPTIONS,
  ANNEE_CREATION,
  BRANCHES_PAR_SECTEUR,
} from "../../components/eligibility/constants_for_adding_programs";
import {
  QueryBuilder,
  type Field,
  type RuleGroupType,
  type ValueEditorType,
  type ValueEditorProps,
} from "react-querybuilder";
import "react-querybuilder/dist/query-builder.css";
import "../../components/admin/programs/rqb-tailwind-fix.css";

// Types minimalistes pour limiter le couplage
interface Program {
  _id?: string | number;
  id?: string | number;
  name: string;
  description: string;
  isActive: boolean;
  DateDebut: string | null;
  DateFin: string | null;
  link?: string;
  hero?: unknown;
  criteres: RuleGroupType;
}

// OPÉRATEURS PERSONNALISÉS - uniquement ceux que vous voulez
const customOperators = [
  { name: "=", label: "=" },
  { name: "!=", label: "≠" },
  { name: "<", label: "<" },
  { name: ">", label: ">" },
  { name: "<=", label: "≤" },
  { name: ">=", label: "≥" },
  { name: "in", label: "dans (in)" },
  { name: "notIn", label: "pas dans (not in)" },
  { name: "between", label: "entre (between)" },
];

// Construction des champs à partir des constantes existantes
function useRqbFields() {
  type KV = { key: string; value: string };
  const secteurs = SECTEURS_TRAVAIL as unknown as KV[];
  const branchesMap = BRANCHES_PAR_SECTEUR as unknown as Record<string, KV[]>;
  const statutOpts = STATUT_JURIDIQUE_OPTIONS as unknown as KV[];
  const investOpts = MONTANT_INVESTISSEMENT_OPTIONS as unknown as KV[];

  const secteurValues: { name: string; label: string }[] = secteurs.map(
    (s) => ({ name: s.value, label: s.key })
  );
  const brancheValues: { name: string; label: string }[] = Object.values(
    branchesMap
  )
    .flat()
    .map((b) => ({ name: b.value, label: b.key }));
  const regionValues: { name: string; label: string }[] = (
    REGIONS as string[]
  ).map((r) => ({ name: r, label: r }));
  const statutValues: { name: string; label: string }[] = statutOpts.map(
    (o) => ({ name: o.value, label: o.key })
  );
  const investissementValues: { name: string; label: string }[] =
    investOpts.map((o) => ({ name: o.value, label: o.key }));
  const anneeValues: { name: string; label: string }[] = (
    ANNEE_CREATION as (string | number)[]
  ).map((a) => ({ name: String(a), label: String(a) }));

  const fields: Field[] = [
    {
      name: "type_applicant",
      label: "Type d'applicant",
      valueEditorType: "select",
      operators: customOperators,
      values: [
        { name: "physique", label: "Personne physique" },
        { name: "morale", label: "Personne morale" },
      ],
    },
    {
      name: "sexe",
      label: "Sexe",
      valueEditorType: "select",
      operators: customOperators,
      values: [
        { name: "homme", label: "Homme" },
        { name: "femme", label: "Femme" },
      ],
    },
    {
      name: "age",
      label: "Âge",
      inputType: "number",
      operators: customOperators,
    },
    {
      name: "secteur_activite",
      label: "Secteur d'activité",
      valueEditorType: "select",
      operators: customOperators,
      values: secteurValues,
    },
    {
      name: "branche",
      label: "Branche",
      valueEditorType: "select",
      operators: customOperators,
      values: brancheValues,
    },
    {
      name: "region",
      label: "Région",
      valueEditorType: "select",
      operators: customOperators,
      values: regionValues,
    },
    {
      name: "statut_juridique",
      label: "Statut juridique",
      valueEditorType: "select",
      operators: customOperators,
      values: statutValues,
    },
    {
      name: "annee_creation",
      label: "Année de création",
      valueEditorType: "select",
      operators: customOperators,
      values: anneeValues,
    },
    {
      name: "chiffre_affaires",
      label: "Chiffre d'affaires (max des 3 dernières années)",
      inputType: "number",
      operators: customOperators,
    },
    {
      name: "montant_investissement",
      label: "Montant d'investissement",
      valueEditorType: "select",
      operators: customOperators,
      values: investissementValues,
    },
  ];

  return fields;
}

const defaultRules: RuleGroupType = {
  combinator: "and",
  rules: [],
};

const ProgramEditor: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const programId = params.id;

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!programId);
  const [error, setError] = useState<string | null>(null);
  const [program, setProgram] = useState<Program>({
    name: "",
    description: "",
    isActive: true,
    DateDebut: "",
    DateFin: "",
    link: "",
    criteres: defaultRules,
  });

  const fields = useRqbFields();

  useEffect(() => {
    let mounted = true;
    
    async function fetchOne() {
      if (!programId) {
        console.log("📝 Mode création - pas de chargement");
        setLoading(false);
        return;
      }
      
      console.log("📥 Chargement du programme:", programId);
      setLoading(true);
      setError(null);
      
      try {
        const res = await axios.get(`/programs/${programId}`);
        const p = res.data?.program ?? res.data;
        
        console.log("📦 Données reçues:", JSON.stringify(p, null, 2));
        console.log("📋 Critères bruts:", p.criteres);
        
        if (!mounted) {
          console.log("⚠️ Component unmounted, aborting");
          return;
        }
        
        // Normaliser les critères avec une copie profonde
        let normalizedCriteres;
        if (typeof p.criteres === 'string') {
          try {
            normalizedCriteres = JSON.parse(p.criteres);
          } catch {
            normalizedCriteres = { ...defaultRules };
          }
        } else if (p.criteres && typeof p.criteres === 'object' && Array.isArray(p.criteres.rules)) {
          normalizedCriteres = JSON.parse(JSON.stringify(p.criteres));
        } else {
          normalizedCriteres = { ...defaultRules };
        }
        
        console.log("✨ Critères normalisés:", JSON.stringify(normalizedCriteres, null, 2));
        
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
          _id: p._id ?? p.id,
          id: p.id ?? p._id,
        };
        
        console.log("🎯 État final du programme:", JSON.stringify(newProgram, null, 2));
        
        setTimeout(() => {
          if (mounted) {
            setProgram(newProgram);
            console.log("✅ Programme mis à jour dans le state");
          }
        }, 0);
        
      } catch (err) {
        console.error("❌ Erreur lors du chargement:", err);
        if (mounted) {
          setError("Erreur lors du chargement du programme");
        }
      } finally {
        setTimeout(() => {
          if (mounted) {
            setLoading(false);
            console.log("✅ Loading terminé");
          }
        }, 100);
      }
    }
    
    fetchOne();
    
    return () => {
      console.log("🧹 Cleanup - unmounting");
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
      };

      console.log("💾 Sauvegarde du payload:", payload);

      if (programId) {
        await axios.put(`/programs/${programId}`, payload);
      } else {
        await axios.post(`/programs`, payload);
      }

      navigate("/admin/programs");
    } catch (err) {
      console.error("❌ Erreur lors de la sauvegarde:", err);
      setError("Erreur lors de l'enregistrement du programme");
    } finally {
      setSaving(false);
    }
  };

  const pageTitle = programId ? "Modifier le programme" : "Nouveau programme";

  // Custom Value Editor pour tous les cas
  const CustomValueEditor = (props: ValueEditorProps) => {
    console.log("🎨 CustomValueEditor props:", {
      type: props.type,
      operator: props.operator,
      fieldData: props.fieldData,
      value: props.value
    });
    
    // Cas 1: Multiselect pour opérateurs "in", "notIn"
    if (props.operator === "in" || props.operator === "notIn") {
      console.log("🎯 Multiselect détecté pour opérateur:", props.operator);
      
      const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(
          (option) => option.value
        );
        console.log("✅ Multiselect change:", selectedOptions);
        props.handleOnChange(selectedOptions);
      };

      const currentValue = Array.isArray(props.value) ? props.value : [];

      return (
        <div className="flex flex-col gap-1">
          <select
            multiple
            className="w-full px-2 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{ minHeight: "120px" }}
            value={currentValue}
            onChange={handleChange}>
            {props.values?.map((v) => (
              <option key={v.name} value={v.name}>
                {v.label}
              </option>
            ))}
          </select>
          <span className="text-xs text-gray-500">
            Maintenez Ctrl (Cmd sur Mac) pour sélectionner plusieurs options
          </span>
        </div>
      );
    }

    // Cas 2: Select simple pour champs avec values (opérateurs = ou !=)
    if (props.values && props.values.length > 0 && props.operator !== "in" && props.operator !== "notIn") {
      return (
        <select
          className="w-full px-2 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={props.value as string}
          onChange={(e) => props.handleOnChange(e.target.value)}>
          <option value="">-- Sélectionner --</option>
          {props.values.map((v) => (
            <option key={v.name} value={v.name}>
              {v.label}
            </option>
          ))}
        </select>
      );
    }

    // Cas 3: Input number
    if (props.inputType === "number") {
      return (
        <input
          type="number"
          className="w-full px-2 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={props.value as string}
          onChange={(e) => props.handleOnChange(e.target.value)}
        />
      );
    }

    // Cas 4: Input text par défaut
    return (
      <input
        type="text"
        className="w-full px-2 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        value={props.value as string}
        onChange={(e) => props.handleOnChange(e.target.value)}
      />
    );
  };

  // Fonction pour déterminer le type d'éditeur basé sur l'opérateur
  const getValueEditorType = useCallback(
    (field: string, operator: string): ValueEditorType => {
      console.log(`🔧 getValueEditorType: field=${field}, operator=${operator}`);
      
      // Pour les opérateurs "in" et "notIn", on force le type multiselect
      if (operator === "in" || operator === "notIn") {
        const fieldData = fields.find(f => f.name === field);
        if (fieldData?.values && fieldData.values.length > 0) {
          console.log("✅ Retour multiselect pour", field);
          return "multiselect";
        }
      }
      
      // Pour les autres opérateurs, utiliser le type du field
      const fieldData = fields.find(f => f.name === field);
      if (fieldData?.valueEditorType) {
        console.log("📝 Type du field:", fieldData.valueEditorType);
        return fieldData.valueEditorType as ValueEditorType;
      }
      
      console.log("📝 Type par défaut: text");
      return "text";
    },
    [fields]
  );

  console.log("🎬 Render - program.criteres:", program.criteres);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-3 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700">
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour
          </button>
          <h1 className="text-2xl font-bold text-gray-800">{pageTitle}</h1>
        </div>
        <button
          type="submit"
          form="program-editor-form"
          disabled={saving}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-800 text-white disabled:opacity-60">
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
          className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3">
              {error}
            </div>
          )}

          {/* Informations de base */}
          <section className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2 text-blue-600" /> Informations de
              base
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du programme *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Programme de soutien aux startups"
                  value={program.name}
                  onChange={(e) =>
                    setProgram((p) => ({ ...p, name: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site web
                </label>
                <input
                  type="url"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://..."
                  value={program.link || ""}
                  onChange={(e) =>
                    setProgram((p) => ({ ...p, link: e.target.value }))
                  }
                />
              </div>
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
                  }>
                  <option value="true">Actif</option>
                  <option value="false">Inactif</option>
                </select>
              </div>
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
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={program.description}
                  onChange={(e) =>
                    setProgram((p) => ({ ...p, description: e.target.value }))
                  }
                />
              </div>
            </div>
          </section>

          {/* Critères d'éligibilité */}
          <section className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-blue-600" /> Critères
              d'éligibilité (logique)
            </h2>

            <div className="rqb-container not-prose">
              <QueryBuilder
                key={`qb-${programId || 'new'}-${JSON.stringify(program.criteres)}`}
                fields={fields}
                query={program.criteres}
                onQueryChange={(q: RuleGroupType) => {
                  console.log("🔄 Query changed:", JSON.stringify(q, null, 2));
                  setProgram((p) => ({ ...p, criteres: q }));
                }}
                getValueEditorType={getValueEditorType}
                controlElements={{
                  valueEditor: CustomValueEditor,
                }}
              />
            </div>

            {/* Aperçu JSON */}
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                Aperçu JSON des critères
              </summary>
              <pre className="mt-2 text-xs bg-gray-50 p-3 rounded border overflow-auto">
                {JSON.stringify(program.criteres, null, 2)}
              </pre>
            </details>
          </section>
        </form>
      )}
    </div>
  );
};

export default ProgramEditor;