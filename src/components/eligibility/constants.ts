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
  "PromotionImmobiliere"
];


export const BRANCHES_PAR_SECTEUR = {
  EconomieRurale: [
    { key: "Aquaculture en eau marine et zones côtières", value: "AquacultureMarine" },
    { key: "Aquaculture en eau douce", value: "AquacultureEauDouce" },
    { key: "Transformation et valorisation des produits aquatiques", value: "ValorisationProduitsAquatiques" }
  ],

  ExploitationForestiere: [

  ],

  PecheMaritime: [
 
  ],

  PecheCotiere: [
  ],

  IndustriesExtractives: [
    { key: "Extraction de minerais", value: "ExtractionMinerais" },
    { key: "Services de soutien aux activités extractives", value: "SoutienExtractives" },
    { key: "Valorisation et transformation des produits minéraux", value: "ValorisationMineraux" }
  ],

  IndustriesTransformation: [
    { key: "Industries alimentaires", value: "IndustrieAlimentaire" },
    { key: "Industrie des boissons", value: "IndustrieBoissons" },
    { key: "Industrie des produits du tabac", value: "IndustrieTabac" },
    { key: "Industrie textile", value: "IndustrieTextile" },
    { key: "Industrie de l’habillement", value: "IndustrieHabillement" },
    { key: "Industrie du cuir et de la chaussure", value: "IndustrieCuirChaussure" },
    { key: "Menuiserie et fabrication de produits en bois, liège, osier ou rotin", value: "MenuiserieBois" },
    { key: "Fabrication de papier et de carton", value: "PapierCarton" },
    { key: "Impression et reproduction d’enregistrements", value: "ImpressionReproduction" },
    { key: "Industrie chimique", value: "IndustrieChimique" },
    { key: "Industrie pharmaceutique", value: "IndustriePharmaceutique" },
    { key: "Industrie des dispositifs médicaux et équipements biomédicaux", value: "DispositifsMedicaux" },
    { key: "Fabrication de produits en caoutchouc et en plastique", value: "CaoutchoucPlastique" },
    { key: "Fabrication d’autres produits non métalliques", value: "ProduitsNonMetalliques" },
    { key: "Fabrication de produits métalliques à l’exception des machines et équipements", value: "ProduitsMetalliques" },
    { key: "Fabrication d’équipements informatiques et de produits électroniques et optiques", value: "EquipementsElectroniques" },
    { key: "Fabrication de matériels et appareils électriques", value: "MaterielsElectriques" },
    { key: "Fabrication de machines et équipements non classés ailleurs", value: "MachinesAutres" },
    { key: "Industrie automobile", value: "IndustrieAutomobile" },
    { key: "Fabrication d’autres moyens de transport", value: "AutresTransports" },
    { key: "Fabrication de meubles", value: "FabricationMeubles" },
    { key: "Autres industries de transformation", value: "AutresIndustriesTransformation" },
    { key: "Réparation et installation de machines et équipements", value: "ReparationMachines" },
    { key: "Industrie des énergies renouvelables", value: "EnergiesRenouvelables" },
    { key: "Ingénierie et services techniques liés à l’industrie", value: "ServicesTechniquesIndustrie" },
    { key: "Services de soutien aux activités industrielles", value: "SoutienIndustriel" }
  ],

  EnergieElectriciteGaz: [
    { key: "Production d’électricité à partir de sources renouvelables", value: "ElectriciteRenouvelable" }
  ],

  EauAssainissementDechets: [
    { key: "Collecte, traitement et élimination des déchets dangereux", value: "DechetsDangereux" },
    { key: "Recyclage, transformation et valorisation des déchets non dangereux", value: "DechetsNonDangereux" },
    { key: "Dépollution et autres services de gestion des déchets non domestiques", value: "Depollution" }
  ],

  TransportLogistique: [
    { key: "Stockage et services annexes au transport", value: "StockageTransport" },
    { key: "Activités des services postaux", value: "ServicesPostaux" }
  ],

  HebergementRestauration: [
    { key: "Établissements d’hébergement touristique classés, à l’exception des résidences immobilières rattachées à un établissement d’hébergement touristique et des résidences immobilières pour le développement touristique", value: "HebergementTouristique" },
    { key: "Restaurants touristiques", value: "RestaurantsTouristiques" }
  ],

  Artisanat: [
    { key: "Artisanat de production artistique et utilitaire", value: "Artisanat" }
  ],

  SolutionsDigitalesNTIC: [

  ],

  MediasCommunication: [
    { key: "Production audiovisuelle et musicale", value: "ProductionAudiovisuelle" },
    { key: "Activités de programmation et diffusion", value: "Diffusion" },
    { key: "Installation d’infrastructures de télécommunications", value: "Telecom" },
    { key: "Logiciels, conseil en informatique et autres activités informatiques", value: "Informatique" },
    { key: "Services d’information (externalisation, centres d’appels…)", value: "ServicesInfo" }
  ],

  ActivitesScientifiquesTechniques: [
    { key: "Activités de contrôle et d’analyse technique", value: "ControleTechnique" }
  ],

  Education: [
    { key: "Formation professionnelle", value: "FormationPro" }
  ],

  SanteActionSociale: [
    { key: "Activités de soins de santé humaine", value: "Sante" }
  ],

  ArtsDivertissementSpectacles: [
    { key: "Activités de création artistique et de spectacle", value: "CreationArtistique" },
    { key: "Activités récréatives", value: "ActivitesRecreatives" }
  ],

  ActivitesArtCulture: [],
  IndustriesCreativesCulturelles: [],
  ActivitesSport: [],
  ActiviteTouristique: [],
  ServicesPersonnes: [],
  ServicesEntreprises: [],
  AutresServices: [
    { key: "Réparation d’ordinateurs, équipements et articles domestiques", value: "ReparationServices" }
  ],
  EfficaciteEnergetique: [],
  PromotionImmobiliere: []
};



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


