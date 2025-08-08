export const SECTEURS_TRAVAIL = [
  "EconomieRurale",
  "Industrie",
  "CommerceTraditionnelEcommerce",
  "RechercheInnovation",
  "LogistiqueTransport",
  "SolutionsDigitalesNTIC",
  "ArtisanatActivitesAssimilees",
  "ActivitesEconomiquesArtCulture",
  "IndustriesCreaticesCulturelles",
  "ActivitesEconomiquesSport",
  "ActiviteTouristique",
  "ServicesPersonnes",
  "ServicesEntreprises",
  "EfficaciteEnergetique",
  "PromotionImmobiliere",
  "PecheMaritime",
  "PecheForiere",
];

export const REGIONS = [
  "Rabat-Salé-Kénitra",
  "Casablanca-Settat",
  "Marrakech-Safi",
  "Fès-Meknès",
  "Tanger-Tétouan-Al Hoceïma",
  "Oriental",
  "Souss-Massa",
  "Drâa-Tafilalet",
  "Béni Mellal-Khénifra",
  "Laâyoune-Sakia El Hamra",
  "Dakhla-Oued Ed-Dahab",
  "Guelmim-Oued Noun",
];
export const Sexe = ["Homme", "Femme", "Autre"];
 

export const STATUT_JURIDIQUE_PERSONNE_MORALE_OPTIONS = [
  {
    value: "sarl",
    key: "eligibility.statutJuridiquePersonneMorale.sarl",
  },
  {
    value: "sarlu",
    key: "eligibility.statutJuridiquePersonneMorale.sarlu",
  },
  {
    value: "societe-sas",
    key: "eligibility.statutJuridiquePersonneMorale.societeSas",
  },
  {
    value: "aucune-forme-juridique",
    key: "eligibility.statutJuridiquePersonneMorale.aucuneFormeJuridique",
  },
  {
    value: "en-cours-creation",
    key: "eligibility.statutJuridiquePersonneMorale.enCoursCreation",
  },
];

export const STATUT_JURIDIQUE_PERSONNE_PHYSIQUE_OPTIONS = [
  {
    value: "personne-physique-patente",
    key: "eligibility.statutJuridiquePersonnePhysique.personnePhysiquePatente",
  },
  {
    value: "auto-entrepreneur",
    key: "eligibility.statutJuridiquePersonnePhysique.autoEntrepreneur",
  },
  {
    value: "en-cours-creation",
    key: "eligibility.statutJuridiquePersonnePhysique.enCoursCreation",
  },
  {
    value: "aucune-forme",
    key: "eligibility.statutJuridiquePersonnePhysique.aucuneForme",
  },
];

export const MONTANT_INVESTISSEMENT_OPTIONS = [
  {
    value: "moins-1M",
    key: "eligibility.montantInvestissementOptions.moins1M",
  },
  {
    value: "1M-50M",
    key: "eligibility.montantInvestissementOptions.entre1M50M",
  },
  {
    value: "plus-50M",
    key: "eligibility.montantInvestissementOptions.plus50M",
  },
  {
    value: "aucun-minimum",
    key: "eligibility.montantInvestissementOptions.aucunMinimum",
  },
];

export const ANNEE_CREATION_OPTIONS = [
  { value: "2025", label: "2025" },
  { value: "2024", label: "2024" },
  { value: "2023", label: "2023" },
  { value: "2022", label: "2022" },
  {
    value: "avant-2022",
    key: "eligibility.anneeCreationOptions.avant2022",
  },
];
