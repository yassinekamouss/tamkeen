import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios, { ADMIN_FRONT_PREFIX } from "../../api/axios";
import { CheckCircle, Save, ArrowLeft, Info, X, Check } from "lucide-react";
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
  type ValueEditorProps,
  type ValueEditorType,
  type Translations,
} from "react-querybuilder";
import "react-querybuilder/dist/query-builder.css";
import "../../components/admin/programs/rqb-tailwind-fix.css";

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

// Traductions françaises pour QueryBuilder
const frenchTranslations: Partial<Translations> = {
  addRule: {
    label: "+ Ajouter une règle",
    title: "Ajouter une règle",
  },
  addGroup: {
    label: "+ Ajouter un groupe",
    title: "Ajouter un groupe",
  },
  removeRule: {
    label: "✕",
    title: "Supprimer la règle",
  },
  removeGroup: {
    label: "✕",
    title: "Supprimer le groupe",
  },
  combinators: {
    title: "Combinateur",
  },
  fields: {
    title: "Champ",
    placeholderName: "~ Choisir un champ ~",
    placeholderLabel: "~ Choisir un champ ~",
    placeholderGroupLabel: "~ Choisir un groupe ~",
  },
  operators: {
    title: "Opérateur",
    placeholderName: "~ Choisir un opérateur ~",
    placeholderLabel: "~ Choisir un opérateur ~",
    placeholderGroupLabel: "~ Choisir un groupe ~",
  },
  value: {
    title: "Valeur",
  },
  cloneRule: {
    label: "⧉",
    title: "Dupliquer la règle",
  },
  cloneRuleGroup: {
    label: "⧉",
    title: "Dupliquer le groupe",
  },
  dragHandle: {
    label: "⁞⁞",
    title: "Déplacer",
  },
  lockRule: {
    label: "🔓",
    title: "Verrouiller la règle",
  },
  lockGroup: {
    label: "🔓",
    title: "Verrouiller le groupe",
  },
  lockRuleDisabled: {
    label: "🔒",
    title: "Déverrouiller la règle",
  },
  lockGroupDisabled: {
    label: "🔒",
    title: "Déverrouiller le groupe",
  },
  notToggle: {
    label: "Non",
    title: "Inverser ce groupe",
  },
};

const customOperators = [
  { name: "=", label: "égal à" },
  { name: "!=", label: "différent de" },
  { name: "<", label: "inférieur à" },
  { name: ">", label: "supérieur à" },
  { name: "<=", label: "inférieur ou égal à" },
  { name: ">=", label: "supérieur ou égal à" },
  { name: "in", label: "dans la liste" },
  { name: "notIn", label: "pas dans la liste" },
  { name: "between", label: "entre" },
];

function useRqbFields() {
  type KV = { key: string; value: string };
  const secteurs = SECTEURS_TRAVAIL as unknown as KV[];
  const branchesMap = BRANCHES_PAR_SECTEUR as unknown as Record<string, KV[]>;
  const statutOpts = STATUT_JURIDIQUE_OPTIONS as unknown as KV[];
  const investOpts = MONTANT_INVESTISSEMENT_OPTIONS as unknown as KV[];

  const secteurValues = secteurs.map((s) => ({ name: s.value, label: s.key }));
  const brancheValues = Object.values(branchesMap)
    .flat()
    .map((b) => ({ name: b.value, label: b.key }));
  const regionValues = (REGIONS as string[]).map((r) => ({
    name: r,
    label: r,
  }));
  const statutValues = statutOpts.map((o) => ({ name: o.value, label: o.key }));
  const investissementValues = investOpts.map((o) => ({
    name: o.value,
    label: o.key,
  }));
  const anneeValues = (ANNEE_CREATION as (string | number)[]).map((a) => ({
    name: String(a),
    label: String(a),
  }));

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

// Composant Select simple avec recherche
const SearchableSelect: React.FC<{
  value: string;
  options: { name: string; label: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
}> = ({ value, options, onChange, placeholder = "-- Sélectionner --" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedOption = options.find((opt) => opt.name === value);

  // Filtrer les options selon la recherche
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (optionName: string) => {
    onChange(optionName);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative w-full">
      {/* Bouton principal */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left transition-all">
        <span className={selectedOption ? "text-gray-900" : "text-gray-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
      </button>

      {/* Menu déroulant */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => {
              setIsOpen(false);
              setSearchTerm("");
            }}
          />
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
            {/* Barre de recherche */}
            <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Liste des options */}
            <div className="max-h-64 overflow-y-auto">
              {/* Option vide pour désélectionner */}
              {value && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect("");
                  }}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-50 text-gray-500 border-b border-gray-100 italic">
                  {placeholder}
                </div>
              )}

              {filteredOptions.length === 0 ? (
                <div className="px-3 py-4 text-sm text-gray-500 text-center">
                  Aucun résultat trouvé
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = value === option.name;
                  return (
                    <div
                      key={option.name}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(option.name);
                      }}
                      className={`flex items-center justify-between px-3 py-2 cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-blue-50 hover:bg-blue-100"
                          : "hover:bg-gray-50"
                      }`}>
                      <span
                        className={`text-sm ${
                          isSelected
                            ? "font-medium text-blue-900"
                            : "text-gray-700"
                        }`}>
                        {option.label}
                      </span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Composant MultiSelect amélioré avec recherche et sélection tout
const ImprovedMultiSelect: React.FC<{
  value: string[];
  options: { name: string; label: string }[];
  onChange: (value: string[]) => void;
}> = ({ value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const currentValue = Array.isArray(value) ? value : [];

  const toggleOption = (optionName: string) => {
    if (currentValue.includes(optionName)) {
      onChange(currentValue.filter((v) => v !== optionName));
    } else {
      onChange([...currentValue, optionName]);
    }
  };

  const removeOption = (optionName: string) => {
    onChange(currentValue.filter((v) => v !== optionName));
  };

  const selectAll = () => {
    const allFilteredValues = filteredOptions.map((opt) => opt.name);
    // Combine les valeurs actuelles avec les nouvelles (sans doublons)
    const newValues = [...new Set([...currentValue, ...allFilteredValues])];
    onChange(newValues);
  };

  const deselectAll = () => {
    const filteredValues = filteredOptions.map((opt) => opt.name);
    onChange(currentValue.filter((v) => !filteredValues.includes(v)));
  };

  const selectedLabels = currentValue
    .map((v) => options.find((o) => o.name === v)?.label)
    .filter(Boolean);

  // Filtrer les options selon la recherche
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full">
      {/* Bouton principal */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left transition-all">
        <div className="flex flex-wrap gap-1.5 min-h-[24px]">
          {currentValue.length === 0 ? (
            <span className="text-gray-400 text-sm">
              Sélectionner des valeurs...
            </span>
          ) : (
            selectedLabels.map((label, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-sm rounded-md">
                {label}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeOption(currentValue[idx]);
                  }}
                  className="hover:bg-blue-200 rounded-full p-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          )}
        </div>
      </button>

      {/* Menu déroulant */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
            {/* Barre de recherche */}
            <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Boutons Tout sélectionner / Tout désélectionner */}
            <div className="flex gap-2 p-2 border-b border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  selectAll();
                }}
                className="flex-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors">
                Tout sélectionner
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  deselectAll();
                }}
                className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                Tout désélectionner
              </button>
            </div>

            {/* Liste des options */}
            <div className="max-h-64 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-4 text-sm text-gray-500 text-center">
                  Aucun résultat trouvé
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = currentValue.includes(option.name);
                  return (
                    <div
                      key={option.name}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleOption(option.name);
                      }}
                      className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-blue-50 hover:bg-blue-100"
                          : "hover:bg-gray-50"
                      }`}>
                      <div
                        className={`w-5 h-5 border-2 rounded flex items-center justify-center flex-shrink-0 ${
                          isSelected
                            ? "bg-blue-600 border-blue-600"
                            : "border-gray-300"
                        }`}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span
                        className={`text-sm ${
                          isSelected
                            ? "font-medium text-blue-900"
                            : "text-gray-700"
                        }`}>
                        {option.label}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bouton Terminer */}
            <div className="p-2 border-t border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors">
                Terminer ({currentValue.length} sélectionné
                {currentValue.length > 1 ? "s" : ""})
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
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
    DateDebut: new Date().toISOString().split("T")[0], // Default to today's date
    DateFin: "",
    link: "",
    criteres: defaultRules,
  });

  const fields = useRqbFields();

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

        let normalizedCriteres;
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

  const CustomValueEditor = (props: ValueEditorProps) => {
    if (props.operator === "between") {
      // La valeur est souvent un tableau [min, max] ou une chaîne "min,max"
      const values = Array.isArray(props.value)
        ? props.value
        : `${props.value ?? ""}`.split(",");

      const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValues = [e.target.value, values[1] ?? ""];
        props.handleOnChange(newValues);
      };

      const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValues = [values[0] ?? "", e.target.value];
        props.handleOnChange(newValues);
      };

      return (
        <div className="flex items-center gap-2">
          <input
            type={props.inputType || "text"}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={values[0] ?? ""}
            onChange={handleMinChange}
            placeholder="Min"
          />
          <span className="text-gray-500">et</span>
          <input
            type={props.inputType || "text"}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={values[1] ?? ""}
            onChange={handleMaxChange}
            placeholder="Max"
          />
        </div>
      );
    }

    if (props.operator === "in" || props.operator === "notIn") {
      const currentValue = Array.isArray(props.value) ? props.value : [];
      return (
        <ImprovedMultiSelect
          value={currentValue}
          options={props.values || []}
          onChange={props.handleOnChange}
        />
      );
    }

    if (
      props.values &&
      props.values.length > 0 &&
      props.operator !== "in" &&
      props.operator !== "notIn"
    ) {
      return (
        <SearchableSelect
          value={props.value as string}
          options={props.values}
          onChange={props.handleOnChange}
          placeholder="-- Sélectionner --"
        />
      );
    }

    if (props.inputType === "number") {
      return (
        <input
          type="number"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={props.value as string}
          onChange={(e) => props.handleOnChange(e.target.value)}
        />
      );
    }

    return (
      <input
        type="text"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        value={props.value as string}
        onChange={(e) => props.handleOnChange(e.target.value)}
      />
    );
  };

  const getValueEditorType = useCallback(
    (field: string, operator: string): ValueEditorType => {
      if (operator === "in" || operator === "notIn") {
        const fieldData = fields.find((f) => f.name === field);
        if (fieldData?.values && fieldData.values.length > 0) {
          return "multiselect";
        }
      }

      const fieldData = fields.find((f) => f.name === field);
      if (fieldData?.valueEditorType) {
        return fieldData.valueEditorType as ValueEditorType;
      }

      return "text";
    },
    [fields]
  );

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

          <section className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-blue-600" /> Critères
              d'éligibilité
            </h2>

            <div className="rqb-container">
              <QueryBuilder
                key={`qb-${programId || "new"}-${JSON.stringify(
                  program.criteres
                )}`}
                fields={fields}
                query={program.criteres}
                onQueryChange={(q: RuleGroupType) => {
                  setProgram((p) => ({ ...p, criteres: q }));
                }}
                getValueEditorType={getValueEditorType}
                controlElements={{
                  valueEditor: CustomValueEditor,
                }}
                translations={frenchTranslations}
                combinators={[
                  { name: "and", label: "ET" },
                  { name: "or", label: "OU" },
                ]}
              />
            </div>
          </section>
        </form>
      )}
    </div>
  );
};

export default ProgramEditor;
