import type { Field, RuleGroupType, Translations } from "react-querybuilder";
import {
  SECTEURS_TRAVAIL,
  REGIONS,
  STATUT_JURIDIQUE_OPTIONS,
  MONTANT_INVESTISSEMENT_OPTIONS,
  ANNEE_CREATION,
  NUMBER_OF_EMPLOYEES,
} from "../../eligibility/constants_for_adding_programs";

export interface BilingualText {
  fr: string;
  ar: string;
}

export interface Program {
  _id?: string | number;
  id?: string | number;
  name: BilingualText;
  description: BilingualText;
  isActive: boolean;
  DateDebut: string | null;
  DateFin: string | null;
  link?: string;
  hero?: unknown;
  criteres: RuleGroupType;
}

export const frenchTranslations: Partial<Translations> = {
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

export const customOperators = [
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

export function useRqbFields() {
  type KV = { key: string; value: string };
  const secteurs = SECTEURS_TRAVAIL as unknown as KV[];
  const statutOpts = STATUT_JURIDIQUE_OPTIONS as unknown as KV[];
  const investOpts = MONTANT_INVESTISSEMENT_OPTIONS as unknown as KV[];
  const numberOfEmployeesValues = NUMBER_OF_EMPLOYEES.map((e) => ({
    name: e,
    label: e,
  }));

  const secteurValues = secteurs.map((s) => ({ name: s.value, label: s.key }));
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
    {
      name: "numberOfEmployees",
      label: "Nombre d'employés",
      valueEditorType: "select",
      operators: customOperators,
      values: numberOfEmployeesValues,
    },
  ];

  return fields;
}

export const defaultRules: RuleGroupType = {
  combinator: "and",
  rules: [],
};
