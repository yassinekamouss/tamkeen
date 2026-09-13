import type { RuleGroupType, RuleType } from "react-querybuilder";

export interface EligibilityProfile {
  id: string;
  name: string;
  // 1. Territoire & Régions
  regionsMode: "ALL" | "SPECIFIC";
  regions: string[];
  // 2. Secteurs d'activité
  secteursMode: "ALL" | "SPECIFIC";
  secteurs: string[];
  // 3. Forme Juridique & Applicant
  applicantType: "ALL" | "morale" | "physique";
  statutsMode: "ALL" | "SPECIFIC";
  statuts: string[];
  ageMin: number | null;
  ageMax: number | null;
  hasNoAgeLimit: boolean;
  sexe: "ALL" | "homme" | "femme";
  // 4. Maturité & Âge entreprise
  creationMode: "ALL" | "NEW_UNDER_3" | "ESTABLISHED_OVER_3" | "CUSTOM";
  creationYears: string[];
  // 5. Envergure Financière & Effectifs
  caMin: number | null;
  caMax: number | null;
  hasNoCaMax: boolean;
  investissements: string[];
  employees: string[];
}

export function createDefaultProfile(name = "Profil 1"): EligibilityProfile {
  return {
    id: `profile_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name,
    regionsMode: "ALL",
    regions: [],
    secteursMode: "ALL",
    secteurs: [],
    applicantType: "ALL",
    statutsMode: "ALL",
    statuts: [],
    ageMin: null,
    ageMax: null,
    hasNoAgeLimit: true,
    sexe: "ALL",
    creationMode: "ALL",
    creationYears: [],
    caMin: null,
    caMax: null,
    hasNoCaMax: true,
    investissements: [],
    employees: [],
  };
}

export function duplicateProfile(
  profile: EligibilityProfile,
  newName: string
): EligibilityProfile {
  return {
    ...JSON.parse(JSON.stringify(profile)),
    id: `profile_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: newName,
  };
}

/**
 * Compiles a single EligibilityProfile into a list of RuleType rules (AND conjunction)
 */
export function compileProfileToRules(p: EligibilityProfile): RuleType[] {
  const rules: RuleType[] = [];

  // 1. Territoire
  if (p.regionsMode === "SPECIFIC" && p.regions.length > 0) {
    if (p.regions.length === 1) {
      rules.push({ field: "region", operator: "=", value: p.regions[0] });
    } else {
      rules.push({ field: "region", operator: "in", value: p.regions });
    }
  }

  // 2. Secteurs
  if (p.secteursMode === "SPECIFIC" && p.secteurs.length > 0) {
    if (p.secteurs.length === 1) {
      rules.push({ field: "secteur_activite", operator: "=", value: p.secteurs[0] });
    } else {
      rules.push({ field: "secteur_activite", operator: "in", value: p.secteurs });
    }
  }

  // 3. Statut & Applicant
  if (p.applicantType && p.applicantType !== "ALL") {
    rules.push({ field: "type_applicant", operator: "=", value: p.applicantType });
  }

  if (p.statutsMode === "SPECIFIC" && p.statuts.length > 0) {
    if (p.statuts.length === 1) {
      rules.push({ field: "statut_juridique", operator: "=", value: p.statuts[0] });
    } else {
      rules.push({ field: "statut_juridique", operator: "in", value: p.statuts });
    }
  }

  if (p.applicantType === "physique") {
    if (p.sexe && p.sexe !== "ALL") {
      rules.push({ field: "sexe", operator: "=", value: p.sexe });
    }
    if (!p.hasNoAgeLimit) {
      if (p.ageMin !== null && p.ageMax !== null) {
        rules.push({ field: "age", operator: "between", value: [p.ageMin, p.ageMax] });
      } else if (p.ageMin !== null) {
        rules.push({ field: "age", operator: ">=", value: p.ageMin });
      } else if (p.ageMax !== null) {
        rules.push({ field: "age", operator: "<=", value: p.ageMax });
      }
    }
  }

  // 4. Maturité & Âge entreprise
  if (p.creationMode === "NEW_UNDER_3") {
    const cur = new Date().getFullYear();
    const recent = [String(cur), String(cur - 1), String(cur - 2), String(cur - 3)];
    rules.push({ field: "annee_creation", operator: "in", value: recent });
  } else if (p.creationMode === "ESTABLISHED_OVER_3") {
    rules.push({ field: "annee_creation", operator: "in", value: ["avant-2022"] });
  } else if (p.creationMode === "CUSTOM" && p.creationYears.length > 0) {
    if (p.creationYears.length === 1) {
      rules.push({ field: "annee_creation", operator: "=", value: p.creationYears[0] });
    } else {
      rules.push({ field: "annee_creation", operator: "in", value: p.creationYears });
    }
  }

  // 5. CA
  if (p.caMin !== null && p.caMax !== null && !p.hasNoCaMax) {
    rules.push({ field: "chiffre_affaires", operator: "between", value: [p.caMin, p.caMax] });
  } else if (p.caMin !== null && (p.hasNoCaMax || p.caMax === null)) {
    rules.push({ field: "chiffre_affaires", operator: ">=", value: p.caMin });
  } else if (p.caMin === null && p.caMax !== null && !p.hasNoCaMax) {
    rules.push({ field: "chiffre_affaires", operator: "<=", value: p.caMax });
  }

  // Montant d'investissement
  if (p.investissements && p.investissements.length > 0) {
    if (p.investissements.length === 1) {
      rules.push({ field: "montant_investissement", operator: "=", value: p.investissements[0] });
    } else {
      rules.push({ field: "montant_investissement", operator: "in", value: p.investissements });
    }
  }

  // Effectifs
  if (p.employees && p.employees.length > 0) {
    if (p.employees.length === 1) {
      rules.push({ field: "numberOfEmployees", operator: "=", value: p.employees[0] });
    } else {
      rules.push({ field: "numberOfEmployees", operator: "in", value: p.employees });
    }
  }

  return rules;
}

/**
 * Compiles a list of profiles into a RuleGroupType (DNF: OR of ANDs)
 */
export function profilesToRuleGroup(profiles: EligibilityProfile[]): RuleGroupType {
  if (!profiles || profiles.length === 0) {
    return { combinator: "and", rules: [] };
  }

  if (profiles.length === 1) {
    return {
      combinator: "and",
      rules: compileProfileToRules(profiles[0]),
    };
  }

  // DNF: Root combinator is 'or', each child is an 'and' group
  return {
    combinator: "or",
    rules: profiles.map((p) => ({
      combinator: "and",
      rules: compileProfileToRules(p),
    })),
  };
}

/**
 * Decompiles a list of RuleType into an EligibilityProfile
 */
export function decompileRulesToProfile(
  rules: RuleType[],
  name = "Profil 1"
): EligibilityProfile {
  const p = createDefaultProfile(name);

  for (const r of rules) {
    if (!r || !r.field) continue;

    const op = (r.operator || "=").toLowerCase();
    const val = r.value;

    const toArr = (v: any): string[] => {
      if (Array.isArray(v)) return v.map(String);
      if (typeof v === "string") {
        return v
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      return v !== undefined && v !== null ? [String(v)] : [];
    };

    switch (r.field) {
      case "region": {
        const arr = toArr(val);
        if (arr.length > 0) {
          p.regionsMode = "SPECIFIC";
          p.regions = arr;
        }
        break;
      }
      case "secteur_activite": {
        const arr = toArr(val);
        if (arr.length > 0) {
          p.secteursMode = "SPECIFIC";
          p.secteurs = arr;
        }
        break;
      }
      case "statut_juridique": {
        const arr = toArr(val);
        if (arr.length > 0) {
          p.statutsMode = "SPECIFIC";
          p.statuts = arr;
        }
        break;
      }
      case "type_applicant": {
        if (val === "morale" || val === "physique") {
          p.applicantType = val;
        }
        break;
      }
      case "sexe": {
        if (val === "homme" || val === "femme") {
          p.sexe = val;
        }
        break;
      }
      case "age": {
        if (op === "between" && Array.isArray(val) && val.length >= 2) {
          p.ageMin = Number(val[0]) || null;
          p.ageMax = Number(val[1]) || null;
          p.hasNoAgeLimit = false;
        } else if (op === ">=" || op === ">") {
          p.ageMin = Number(val) || null;
          p.hasNoAgeLimit = true;
        } else if (op === "<=" || op === "<") {
          p.ageMax = Number(val) || null;
          p.hasNoAgeLimit = false;
        }
        break;
      }
      case "annee_creation": {
        const arr = toArr(val);
        if (arr.includes("avant-2022") && arr.length === 1) {
          p.creationMode = "ESTABLISHED_OVER_3";
        } else if (arr.length > 0) {
          p.creationMode = "CUSTOM";
          p.creationYears = arr;
        }
        break;
      }
      case "chiffre_affaires": {
        if (op === "between" && Array.isArray(val) && val.length >= 2) {
          p.caMin = Number(val[0]) || null;
          p.caMax = Number(val[1]) || null;
          p.hasNoAgeLimit = false;
          p.hasNoCaMax = false;
        } else if (op === ">=" || op === ">") {
          p.caMin = Number(val) || null;
          p.hasNoCaMax = true;
        } else if (op === "<=" || op === "<") {
          p.caMax = Number(val) || null;
          p.hasNoCaMax = false;
        }
        break;
      }
      case "montant_investissement": {
        const arr = toArr(val);
        if (arr.length > 0) {
          p.investissements = arr;
        }
        break;
      }
      case "numberOfEmployees": {
        const arr = toArr(val);
        if (arr.length > 0) {
          p.employees = arr;
        }
        break;
      }
    }
  }

  return p;
}

/**
 * Decompiles a full RuleGroupType into an array of EligibilityProfiles
 */
export function ruleGroupToProfiles(
  group: RuleGroupType | null | undefined
): EligibilityProfile[] {
  if (!group || !Array.isArray(group.rules) || group.rules.length === 0) {
    return [createDefaultProfile("Profil 1")];
  }

  const isOrGroup = (group.combinator || "").toLowerCase() === "or";
  const hasSubGroups = group.rules.some(
    (r) => "rules" in r && Array.isArray((r as RuleGroupType).rules)
  );

  if (isOrGroup && hasSubGroups) {
    return group.rules.map((child, idx) => {
      const profileName = `Profil ${idx + 1}`;
      if ("rules" in child && Array.isArray((child as RuleGroupType).rules)) {
        return decompileRulesToProfile(
          (child as RuleGroupType).rules.filter(
            (r): r is RuleType => !("rules" in r)
          ),
          profileName
        );
      } else {
        return decompileRulesToProfile([child as RuleType], profileName);
      }
    });
  }

  // Single group or flat AND list
  const leafRules = group.rules.filter(
    (r): r is RuleType => !("rules" in r)
  );
  return [decompileRulesToProfile(leafRules, "Profil 1")];
}

/**
 * Counts how many active constraints exist in a profile
 */
export function countActiveCriteria(p: EligibilityProfile): number {
  let count = 0;
  if (p.regionsMode === "SPECIFIC" && p.regions.length > 0) count++;
  if (p.secteursMode === "SPECIFIC" && p.secteurs.length > 0) count++;
  if (p.applicantType !== "ALL") count++;
  if (p.statutsMode === "SPECIFIC" && p.statuts.length > 0) count++;
  if (p.applicantType === "physique") {
    if (p.sexe !== "ALL") count++;
    if (!p.hasNoAgeLimit && (p.ageMin !== null || p.ageMax !== null)) count++;
  }
  if (p.creationMode !== "ALL") count++;
  if (p.caMin !== null || p.caMax !== null) count++;
  if (p.investissements.length > 0) count++;
  if (p.employees.length > 0) count++;
  return count;
}

/**
 * Generates quick human-readable summary tags for a profile
 */
export function generateProfileSummaryTags(p: EligibilityProfile): string[] {
  const tags: string[] = [];

  if (p.regionsMode === "ALL") {
    tags.push("Toutes Régions");
  } else if (p.regions.length === 1) {
    tags.push(`📍 ${p.regions[0]}`);
  } else {
    tags.push(`📍 ${p.regions.length} Régions`);
  }

  if (p.secteursMode === "ALL") {
    tags.push("Tous Secteurs");
  } else if (p.secteurs.length === 1) {
    tags.push(`🏭 1 Secteur`);
  } else {
    tags.push(`🏭 ${p.secteurs.length} Secteurs`);
  }

  if (p.caMin !== null && p.caMax !== null && !p.hasNoCaMax) {
    tags.push(`💰 CA: ${p.caMin.toLocaleString()} - ${p.caMax.toLocaleString()} MAD`);
  } else if (p.caMin !== null) {
    tags.push(`💰 CA ≥ ${p.caMin.toLocaleString()} MAD`);
  } else if (p.caMax !== null && !p.hasNoCaMax) {
    tags.push(`💰 CA ≤ ${p.caMax.toLocaleString()} MAD`);
  }

  if (p.applicantType === "morale") {
    tags.push("Personne Morale");
  } else if (p.applicantType === "physique") {
    tags.push("Personne Physique");
  }

  return tags;
}
