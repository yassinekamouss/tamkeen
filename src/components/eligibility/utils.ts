import type { FormData, EligibilityResult } from "./types";

/**
 * Fonction pour déterminer les années de CA à demander selon l'année de création
 */
export const getYearsForCA = (anneeCreation?: string): number[] => {
  if (!anneeCreation) return [];

  const currentYear = 2025;
  const years = [];

  // Si l'entreprise est créée avant 2022
  if (anneeCreation === "avant-2022") {
    // Demander les 3 dernières années complètes
    years.push(2024, 2023, 2022);
  } else {
    const creationYear = parseInt(anneeCreation);
    // Calculer les années disponibles depuis la création (max 3 années précédentes)
    for (
      let year = currentYear - 1;
      year >= Math.max(creationYear, currentYear - 3);
      year--
    ) {
      years.push(year);
    }
  }

  return years.sort((a, b) => b - a); // Tri décroissant (2024, 2023, 2022)
};

/**
 * Vérification d'éligibilité pour tous les programmes
 */
export const checkEligibility = (data: FormData): EligibilityResult => {
  // Critères d'éligibilité pour différents programmes

  // 1. Go Siyaha - Vérifier en premier car plus spécialisé
  const secteursTourisme = "ActiviteTouristique";
  const statusJuridiqueGoSiyaha = [
    "sarl",
    "sarlu",
    "societe-sas",
    "aucune-forme",
    "en-cours-creation",
    "personne-physique-patente",
    "societe-sa",
  ];

  // Vérifier le secteur touristique
  const isSecteurTourismeValide =
    (data.secteurTravail && secteursTourisme === data.secteurTravail) ||
    (data.secteurActivite && secteursTourisme === data.secteurActivite);

  // Vérifier le statut juridique éligible pour Go Siyaha
  const isStatutJuridiqueGoSiyahaValide =
    statusJuridiqueGoSiyaha.includes(data.statutJuridique) ||
    statusJuridiqueGoSiyaha.includes(data.statutJuridiquePhysique || "");

  // Éligibilité Go Siyaha : secteur tourisme ET statut juridique valide
  const isGoSiyahaEligible =
    isSecteurTourismeValide &&
    isStatutJuridiqueGoSiyahaValide &&
    data.montantInvestissement;

  if (isGoSiyahaEligible) {
    return { isEligible: true, program: "Go Siyaha" };
  }

  // 2. La Charte Grandes Entreprises - Vérifier avant TPME car montant plus élevé
  // Forme juridique : Personne morale de droit privé marocaine
  const formeJuridiqueValide = data.applicantType === "morale";

  // Chiffre d'affaires : Entre 1.000.000 MAD et 200.000.000 MAD HT sur une des 3 dernières années
  const years = getYearsForCA(data.anneeCreation);
  let chiffreAffaireValide = false;

  // Si l'entreprise est très récente (pas d'années de CA à vérifier), elle peut être éligible
  if (years.length === 0) {
    chiffreAffaireValide = true;
  } else {
    // Vérifier si au moins une année a un CA entre 1M et 200M MAD
    for (const year of years) {
      const caField = `chiffreAffaire${year}` as keyof FormData;
      const caValue = parseFloat((data[caField] as string) || "0");
      if (caValue >= 1000000 && caValue <= 200000000) {
        chiffreAffaireValide = true;
        break;
      }
    }
  }

  // Montant du projet d'investissement : Supérieur ou égal à 50.000.000 MAD
  const montantInvestissementGrandesEntreprises =
    data.montantInvestissement === "plus-50M";

  const isCharteGrandesEntreprisesEligible =
    formeJuridiqueValide &&
    chiffreAffaireValide &&
    montantInvestissementGrandesEntreprises;

  if (isCharteGrandesEntreprisesEligible) {
    return { isEligible: true, program: "Charte Grandes Entreprises" };
  }

  // 3. La Charte TPME - Critères plus stricts
  // Montant du projet d'investissement : Entre 1.000.000 MAD et 50.000.000 MAD
  const montantInvestissementTPME = data.montantInvestissement === "1M-50M";

  const isCharteTPMEEligible =
    formeJuridiqueValide && chiffreAffaireValide && montantInvestissementTPME;

  if (isCharteTPMEEligible) {
    return { isEligible: true, program: "La Charte TPME" };
  }

  return { isEligible: false };
};
