export const SECTEURS_TRAVAIL = [
  "EconomieRurale",             
  "ExploitationForestiere",
  "PecheMaritime",
  "PecheCotiere",

  // ---- Secteurs issus de l’Excel ----
  "IndustriesExtractives",
  "IndustriesTransformation",
  "EnergieElectriciteGaz",
  "EauAssainissementDechets",
  "TransportLogistique",
  "HebergementRestauration",
  "Artisanat",                 
  "MediasCommunication",
  "ActivitesScientifiquesTechniques",
  "Education",
  "SanteActionSociale",
  "ArtsDivertissementSpectacles",
  "AutresServices",

  // ---- Secteurs venant du JSON d’origine ----
  "CommerceTraditionnelEcommerce",
  "RechercheInnovation",
  "SolutionsDigitalesNTIC",
  "ActivitesArtCulture",
  "IndustriesCreativesCulturelles",
  "ActivitesSport",
  "ActiviteTouristique",
  "ServicesPersonnes",
  "ServicesEntreprises",
  "EfficaciteEnergetique",
  "PromotionImmobiliere",

  // ---- Secteurs manquants ----
  "AquacultureMarine",
  "AquacultureEauDouce",
  "ValorisationProduitsAquatiques",
  "ExtractionMinerais",
  "SoutienExtractives",
  "ValorisationMineraux",
  "IndustrieAlimentaire",
  "IndustrieBoissons",
  "IndustrieTabac",
  "IndustrieTextile",
  "IndustrieHabillement",
  "IndustrieCuirChaussure",
  "MenuiserieBois",
  "PapierCarton",
  "ImpressionReproduction",
  "IndustrieChimique",
  "IndustriePharmaceutique",
  "DispositifsMedicaux",
  "CaoutchoucPlastique",
  "ProduitsNonMetalliques",
  "ProduitsMetalliques",
  "EquipementsElectroniques",
  "MaterielsElectriques",
  "MachinesNonClassés",
  "IndustrieAutomobile",
  "AutresTransports",
  "FabricationMeubles",
  "AutresIndustriesTransformation",
  "ReparationMachines",
  "EnergiesRenouvelables",
  "ServicesTechniquesIndustrie",
  "SoutienIndustriel",
  "ElectriciteRenouvelable",
  "DechetsDangereux",
  "DechetsNonDangereux",
  "Depollution",
  "StockageTransport",
  "ServicesPostaux",
  "HebergementTouristique",
  "RestaurantsTouristiques",
  "ProductionAudiovisuelle",
  "Diffusion",
  "Telecom",
  "Informatique",
  "ServicesInfo",
  "ControleTechnique",
  "FormationPro",
  "Sante",
  "CreationArtistique",
  "ActivitesRecreatives",
  "ReparationServices"
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
export const sexe = ["homme", "femme"];
 

export const STATUT_JURIDIQUE_PERSONNE_MORALE_OPTIONS = [
  {
    value: "sarl",
    key: "eligibility.statutJuridiquePersonneMorale.sarl",
  },
  {
    value: "sarlau",
    key: "eligibility.statutJuridiquePersonneMorale.sarlau",
  },
  {
    value: "societe-sas",
    key: "eligibility.statutJuridiquePersonneMorale.societeSas",
  },
  {
    value: "societe-anonyme",
    key: "eligibility.statutJuridiquePersonneMorale.societeAnonyme",
  },
  {
    value: "coopérative",
    key: "eligibility.statutJuridiquePersonneMorale.coopérative"
  },
    {
    value: "CPU",
    key: "eligibility.statutJuridiquePersonneMorale.cpu"
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
    value: "aucune-forme-juridique",
    key: "eligibility.statutJuridiquePersonnePhysique.aucuneForme",
  },
];

export const MONTANT_INVESTISSEMENT_OPTIONS = [
  {
    value: "moins-1M",
    key: "eligibility.montantInvestissementOptions.moins1M",
  },
  {
  value: "1M-10M",
  key: "eligibility.montantInvestissementOptions.entre1M-10M",
  },
  {
  value: "10M-20M",
  key: "eligibility.montantInvestissementOptions.entre10M-20M",
  },
    {
  value: "20M-30M",
  key: "eligibility.montantInvestissementOptions.entre20M-30M",
  },
  {
    value: "30M-50M",
    key: "eligibility.montantInvestissementOptions.entre30M-50M",
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


export const NUMBER_OF_EMPLOYEES = [
  { 
    value: "entre 1 et 3 employés" , 
    key : "eligibility.numberOfEmployeesOptions.1-3"
  },
   { 
    value: "entre 4 et 5 employés" , 
    key : "eligibility.numberOfEmployeesOptions.4-5"
  },
   { 
    value: "entre 5 et 10 employés" , 
    key : "eligibility.numberOfEmployeesOptions.5-10"
  },
   { 
    value: "plus de 10 employés" , 
    key : "eligibility.numberOfEmployeesOptions.plus-10"
  },

]


