// ============================================================================
// RÉFÉRENTIELS OFFICIELS BILINGUES (FR / AR) - VOLET 2 CHARTE TPME / TAMKEEN
// ============================================================================

export type ZoneType = "Zone A" | "Zone B";

export interface ProvinceInfo {
  id: string;
  label: string;
  labelAr?: string;
  zone: ZoneType;
  rate: number; // 0.10 pour Zone A, 0.15 pour Zone B
}

export interface RegionInfo {
  id: string;
  label: string;
  labelAr?: string;
  provinces: ProvinceInfo[];
}

export interface SecteurInfo {
  code: string;
  label: string;
  labelAr?: string;
  isPrioritaire: boolean;
  rate: number; // 0.05 si prioritaire, 0 sinon
}

export interface BanqueInfo {
  code: string;
  label: string;
  labelAr?: string;
  isDefault?: boolean;
}

export interface ProfilMonteeChargeInfo {
  id: "STANDARD" | "PRUDENT" | "RAPIDE";
  label: string;
  labelAr?: string;
  description: string;
  descriptionAr?: string;
  coefficients: [number, number, number, number, number, number]; // Année 1 à 6 en %
}

export interface ProfilRHInfo {
  code: "OPERATEUR" | "TECHNICIEN" | "CADRE" | "PERSONNALISE";
  label: string;
  labelAr?: string;
  salaireBrutMensuel: number;
  description: string;
  descriptionAr?: string;
}

// Multiplicateur officiel CNSS patronale
export const CNSS_MULTIPLIER = 1.2109;

// ----------------------------------------------------------------------------
// 1. TABLE EXHAUSTIVE DES 12 RÉGIONS ET PROVINCES (ZONAGE A / B) AVEC NOMS ARABES
// ----------------------------------------------------------------------------
export const REGIONS_ET_PROVINCES: RegionInfo[] = [
  {
    id: "Casablanca-Settat",
    label: "Casablanca-Settat",
    labelAr: "جهة الدار البيضاء - سطات",
    provinces: [
      { id: "Casablanca", label: "Casablanca", labelAr: "الدار البيضاء", zone: "Zone A", rate: 0.10 },
      { id: "Nouaceur", label: "Nouaceur", labelAr: "النواصر", zone: "Zone A", rate: 0.10 },
      { id: "Médiouna", label: "Médiouna", labelAr: "مديونة", zone: "Zone A", rate: 0.10 },
      { id: "Mohammedia", label: "Mohammedia", labelAr: "المحمدية", zone: "Zone A", rate: 0.10 },
      { id: "Berrechid", label: "Berrechid", labelAr: "برشيد", zone: "Zone B", rate: 0.15 },
      { id: "Benslimane", label: "Benslimane", labelAr: "بنسليمان", zone: "Zone B", rate: 0.15 },
      { id: "Settat", label: "Settat", labelAr: "سطات", zone: "Zone B", rate: 0.15 },
      { id: "El Jadida", label: "El Jadida", labelAr: "الجديدة", zone: "Zone B", rate: 0.15 },
      { id: "Sidi Bennour", label: "Sidi Bennour", labelAr: "سيدي بنور", zone: "Zone B", rate: 0.15 },
    ],
  },
  {
    id: "Tanger-Tétouan-Al Hoceïma",
    label: "Tanger-Tétouan-Al Hoceïma",
    labelAr: "جهة طنجة - تطوان - الحسيمة",
    provinces: [
      { id: "Tanger-Assilah", label: "Tanger-Assilah", labelAr: "طنجة - أصيلة", zone: "Zone A", rate: 0.10 },
      { id: "Fahs-Anjra", label: "Fahs-Anjra", labelAr: "الفحص - أنجرة", zone: "Zone A", rate: 0.10 },
      { id: "M'diq-Fnideq", label: "M'diq-Fnideq", labelAr: "المضيق - الفنيدق", zone: "Zone B", rate: 0.15 },
      { id: "Tétouan", label: "Tétouan", labelAr: "تطوان", zone: "Zone B", rate: 0.15 },
      { id: "Larache", label: "Larache", labelAr: "العرائش", zone: "Zone B", rate: 0.15 },
      { id: "Al Hoceïma", label: "Al Hoceïma", labelAr: "الحسيمة", zone: "Zone B", rate: 0.15 },
      { id: "Chefchaouen", label: "Chefchaouen", labelAr: "شفشاون", zone: "Zone B", rate: 0.15 },
      { id: "Ouezzane", label: "Ouezzane", labelAr: "وزان", zone: "Zone B", rate: 0.15 },
    ],
  },
  {
    id: "Rabat-Salé-Kénitra",
    label: "Rabat-Salé-Kénitra",
    labelAr: "جهة الرباط - سلا - القنيطرة",
    provinces: [
      { id: "Rabat", label: "Rabat", labelAr: "الرباط", zone: "Zone A", rate: 0.10 },
      { id: "Salé", label: "Salé", labelAr: "سلا", zone: "Zone A", rate: 0.10 },
      { id: "Skhirate-Témara", label: "Skhirate-Témara", labelAr: "الصخيرات - تمارة", zone: "Zone A", rate: 0.10 },
      { id: "Kénitra", label: "Kénitra", labelAr: "القنيطرة", zone: "Zone A", rate: 0.10 },
      { id: "Sidi Kacem", label: "Sidi Kacem", labelAr: "سيدي قاسم", zone: "Zone B", rate: 0.15 },
      { id: "Sidi Slimane", label: "Sidi Slimane", labelAr: "سيدي سليمان", zone: "Zone B", rate: 0.15 },
      { id: "Khémisset", label: "Khémisset", labelAr: "الخميسات", zone: "Zone B", rate: 0.15 },
    ],
  },
  {
    id: "Fès-Meknès",
    label: "Fès-Meknès",
    labelAr: "جهة فاس - مكناس",
    provinces: [
      { id: "Fès", label: "Fès", labelAr: "فاس", zone: "Zone A", rate: 0.10 },
      { id: "Meknès", label: "Meknès", labelAr: "مكناس", zone: "Zone A", rate: 0.10 },
      { id: "Sefrou", label: "Sefrou", labelAr: "صفرو", zone: "Zone B", rate: 0.15 },
      { id: "El Hajeb", label: "El Hajeb", labelAr: "الحاجب", zone: "Zone B", rate: 0.15 },
      { id: "Ifrane", label: "Ifrane", labelAr: "إفران", zone: "Zone B", rate: 0.15 },
      { id: "Moulay Yacoub", label: "Moulay Yacoub", labelAr: "مولاي يعقوب", zone: "Zone B", rate: 0.15 },
      { id: "Boulemane", label: "Boulemane", labelAr: "بولمان", zone: "Zone B", rate: 0.15 },
      { id: "Taza", label: "Taza", labelAr: "تازة", zone: "Zone B", rate: 0.15 },
      { id: "Taounate", label: "Taounate", labelAr: "تاونات", zone: "Zone B", rate: 0.15 },
    ],
  },
  {
    id: "Marrakech-Safi",
    label: "Marrakech-Safi",
    labelAr: "جهة مراكش - آسفي",
    provinces: [
      { id: "Marrakech", label: "Marrakech", labelAr: "مراكش", zone: "Zone A", rate: 0.10 },
      { id: "Safi", label: "Safi", labelAr: "آسفي", zone: "Zone B", rate: 0.15 },
      { id: "Essaouira", label: "Essaouira", labelAr: "الصويرة", zone: "Zone B", rate: 0.15 },
      { id: "El Kelâa des Sraghna", label: "El Kelâa des Sraghna", labelAr: "قلعة السراغنة", zone: "Zone B", rate: 0.15 },
      { id: "Chichaoua", label: "Chichaoua", labelAr: "شيشاوة", zone: "Zone B", rate: 0.15 },
      { id: "Al Haouz", label: "Al Haouz", labelAr: "الحوز", zone: "Zone B", rate: 0.15 },
      { id: "Rehamna", label: "Rehamna", labelAr: "الرحامنة", zone: "Zone B", rate: 0.15 },
      { id: "Youssoufia", label: "Youssoufia", labelAr: "اليوسفية", zone: "Zone B", rate: 0.15 },
    ],
  },
  {
    id: "Souss-Massa",
    label: "Souss-Massa",
    labelAr: "جهة سوس - ماسة",
    provinces: [
      { id: "Agadir-Ida Ou Tanane", label: "Agadir-Ida Ou Tanane", labelAr: "أكادير إداوتنان", zone: "Zone A", rate: 0.10 },
      { id: "Inezgane-Aït Melloul", label: "Inezgane-Aït Melloul", labelAr: "إنزكان آيت ملول", zone: "Zone A", rate: 0.10 },
      { id: "Chtouka-Aït Baha", label: "Chtouka-Aït Baha", labelAr: "اشتوكة آيت باها", zone: "Zone B", rate: 0.15 },
      { id: "Taroudant", label: "Taroudant", labelAr: "تارودانت", zone: "Zone B", rate: 0.15 },
      { id: "Tiznit", label: "Tiznit", labelAr: "تيزنيت", zone: "Zone B", rate: 0.15 },
      { id: "Tata", label: "Tata", labelAr: "طاطا", zone: "Zone B", rate: 0.15 },
    ],
  },
  {
    id: "L'Oriental",
    label: "L'Oriental",
    labelAr: "جهة الشرق",
    provinces: [
      { id: "Oujda-Angad", label: "Oujda-Angad", labelAr: "وجدة - أنجاد", zone: "Zone B", rate: 0.15 },
      { id: "Nador", label: "Nador", labelAr: "الناظور", zone: "Zone B", rate: 0.15 },
      { id: "Berkane", label: "Berkane", labelAr: "بركان", zone: "Zone B", rate: 0.15 },
      { id: "Taourirt", label: "Taourirt", labelAr: "تاوريرت", zone: "Zone B", rate: 0.15 },
      { id: "Jerada", label: "Jerada", labelAr: "جرادة", zone: "Zone B", rate: 0.15 },
      { id: "Guercif", label: "Guercif", labelAr: "جرسيف", zone: "Zone B", rate: 0.15 },
      { id: "Driouch", label: "Driouch", labelAr: "الدريوش", zone: "Zone B", rate: 0.15 },
      { id: "Figuig", label: "Figuig", labelAr: "فجيج", zone: "Zone B", rate: 0.15 },
    ],
  },
  {
    id: "Béni Mellal-Khénifra",
    label: "Béni Mellal-Khénifra",
    labelAr: "جهة بني ملال - خنيفرة",
    provinces: [
      { id: "Béni Mellal", label: "Béni Mellal", labelAr: "بني ملال", zone: "Zone B", rate: 0.15 },
      { id: "Azilal", label: "Azilal", labelAr: "أزيلال", zone: "Zone B", rate: 0.15 },
      { id: "Fquih Ben Salah", label: "Fquih Ben Salah", labelAr: "الفقيه بن صالح", zone: "Zone B", rate: 0.15 },
      { id: "Khénifra", label: "Khénifra", labelAr: "خنيفرة", zone: "Zone B", rate: 0.15 },
      { id: "Khouribga", label: "Khouribga", labelAr: "خريبكة", zone: "Zone B", rate: 0.15 },
    ],
  },
  {
    id: "Drâa-Tafilalet",
    label: "Drâa-Tafilalet",
    labelAr: "جهة درعة - تافيلالت",
    provinces: [
      { id: "Errachidia", label: "Errachidia", labelAr: "الرشيدية", zone: "Zone B", rate: 0.15 },
      { id: "Ouarzazate", label: "Ouarzazate", labelAr: "ورزازات", zone: "Zone B", rate: 0.15 },
      { id: "Midelt", label: "Midelt", labelAr: "ميدلت", zone: "Zone B", rate: 0.15 },
      { id: "Tinghir", label: "Tinghir", labelAr: "تنغير", zone: "Zone B", rate: 0.15 },
      { id: "Zagora", label: "Zagora", labelAr: "زاكورة", zone: "Zone B", rate: 0.15 },
    ],
  },
  {
    id: "Guelmim-Oued Noun",
    label: "Guelmim-Oued Noun",
    labelAr: "جهة كلميم - واد نون",
    provinces: [
      { id: "Guelmim", label: "Guelmim", labelAr: "كلميم", zone: "Zone B", rate: 0.15 },
      { id: "Assa-Zag", label: "Assa-Zag", labelAr: "آسا الزاك", zone: "Zone B", rate: 0.15 },
      { id: "Sidi Ifni", label: "Sidi Ifni", labelAr: "سيدي إفني", zone: "Zone B", rate: 0.15 },
      { id: "Tan-Tan", label: "Tan-Tan", labelAr: "طانطان", zone: "Zone B", rate: 0.15 },
    ],
  },
  {
    id: "Laâyoune-Sakia El Hamra",
    label: "Laâyoune-Sakia El Hamra",
    labelAr: "جهة العيون - الساقية الحمراء",
    provinces: [
      { id: "Laâyoune", label: "Laâyoune", labelAr: "العيون", zone: "Zone B", rate: 0.15 },
      { id: "Boujdour", label: "Boujdour", labelAr: "بوجدور", zone: "Zone B", rate: 0.15 },
      { id: "Es-Semara", label: "Es-Semara", labelAr: "السمارة", zone: "Zone B", rate: 0.15 },
      { id: "Tarfaya", label: "Tarfaya", labelAr: "طرفاية", zone: "Zone B", rate: 0.15 },
    ],
  },
  {
    id: "Dakhla-Oued Ed-Dahab",
    label: "Dakhla-Oued Ed-Dahab",
    labelAr: "جهة الداخلة - وادي الذهب",
    provinces: [
      { id: "Oued Ed-Dahab", label: "Oued Ed-Dahab", labelAr: "وادي الذهب", zone: "Zone B", rate: 0.15 },
      { id: "Aousserd", label: "Aousserd", labelAr: "أوسرد", zone: "Zone B", rate: 0.15 },
    ],
  },
];

// Helper: Liste des provinces d'une région
export function getProvincesForRegion(regionId: string): ProvinceInfo[] {
  if (!regionId) return [];
  const reg = REGIONS_ET_PROVINCES.find(
    (r) =>
      r.id.toLowerCase() === regionId?.toLowerCase() ||
      r.label.toLowerCase() === regionId?.toLowerCase() ||
      (r.labelAr && r.labelAr.toLowerCase() === regionId?.toLowerCase())
  );
  return reg ? reg.provinces : [];
}

// Helper: Obtenir la zone et le taux d'une province
export function getProvinceDetails(regionId: string, provinceId: string): { zone: ZoneType; rate: number } {
  const provinces = getProvincesForRegion(regionId);
  const prov = provinces.find(
    (p) =>
      p.id.toLowerCase() === provinceId?.toLowerCase() ||
      p.label.toLowerCase() === provinceId?.toLowerCase() ||
      (p.labelAr && p.labelAr.toLowerCase() === provinceId?.toLowerCase())
  );
  if (prov) {
    return { zone: prov.zone, rate: prov.rate };
  }
  return { zone: "Zone B", rate: 0.15 };
}

// ----------------------------------------------------------------------------
// 2. TABLE DES 12 SECTEURS D'ACTIVITÉ (11 PRIORITAIRES À 5% + 1 À 0%)
// ----------------------------------------------------------------------------
export const SECTEURS_ACTIVITE: SecteurInfo[] = [
  {
    code: "IND-AUTO",
    label: "Industrie Automobile & Équipementiers",
    labelAr: "صناعة السيارات ومعدات المركبات",
    isPrioritaire: true,
    rate: 0.05,
  },
  {
    code: "IND-AERO",
    label: "Industrie Aéronautique & Spatial",
    labelAr: "صناعة الطيران والفضاء",
    isPrioritaire: true,
    rate: 0.05,
  },
  {
    code: "AGRO-ALIM",
    label: "Agroalimentaire & Transformation agricole",
    labelAr: "الصناعات الغذائية والتحويل الفلاحي",
    isPrioritaire: true,
    rate: 0.05,
  },
  {
    code: "IND-TEXT",
    label: "Textile & Cuir à forte valeur ajoutée",
    labelAr: "النسيج والجلد ذو القيمة المضافة العالية",
    isPrioritaire: true,
    rate: 0.05,
  },
  {
    code: "IND-CHIM",
    label: "Chimie, Parachimie & Plasturgie technique",
    labelAr: "الصناعات الكيماوية وشبه الكيماوية والبلاستيك",
    isPrioritaire: true,
    rate: 0.05,
  },
  {
    code: "PHARMA",
    label: "Industrie Pharmaceutique & Dispositifs Médicaux",
    labelAr: "صناعة الأدوية والمستلزمات الطبية",
    isPrioritaire: true,
    rate: 0.05,
  },
  {
    code: "ENERG-RENEW",
    label: "Énergies Renouvelables, Cleantech & Recyclage",
    labelAr: "الطاقات المتجددة والتكنولوجيا النظيفة والتدوير",
    isPrioritaire: true,
    rate: 0.05,
  },
  {
    code: "TECH-OFFSH",
    label: "Numérique, IT, Développement logiciel & Offshoring",
    labelAr: "التكنولوجيا، البرمجيات، والخدمات الرقمية المُرحّلة",
    isPrioritaire: true,
    rate: 0.05,
  },
  {
    code: "SERV-IND",
    label: "Services d'Ingénierie & Support technique aux usines",
    labelAr: "خدمات الهندسة والدعم التقني الموجه للصناعة",
    isPrioritaire: true,
    rate: 0.05,
  },
  {
    code: "LOGISTIQUE",
    label: "Logistique intégrée, Stockage frigorifique & Transport",
    labelAr: "اللوجستيك المندمج والتخزين والتبريد والنقل",
    isPrioritaire: true,
    rate: 0.05,
  },
  {
    code: "TOURISME",
    label: "Tourisme, Hôtellerie & Loisirs durables",
    labelAr: "السياحة والفندقة والترفيه المستدام",
    isPrioritaire: true,
    rate: 0.05,
  },
  {
    code: "AUTRE-SERV",
    label: "Autres activités de services & Commerce",
    labelAr: "أنشطة الخدمات العامة والتجارة الأخرى",
    isPrioritaire: false,
    rate: 0.0,
  },
];

export function getSectorDetails(sectorCode: string): SecteurInfo {
  const found = SECTEURS_ACTIVITE.find((s) => s.code === sectorCode);
  if (found) return found;
  return {
    code: "AUTRE-SERV",
    label: "Autres activités de services & Commerce",
    labelAr: "أنشطة الخدمات العامة والتجارة الأخرى",
    isPrioritaire: false,
    rate: 0.0,
  };
}

// ----------------------------------------------------------------------------
// 3. TABLE DES BANQUES PARTENAIRES
// ----------------------------------------------------------------------------
export const BANQUES_PARTENAIRES: BanqueInfo[] = [
  { code: "AWB", label: "Attijariwafa bank", labelAr: "التجاري وفا بنك", isDefault: false },
  { code: "BCP", label: "Banque Populaire (BCP)", labelAr: "البنك الشعبي (BCP)", isDefault: false },
  { code: "BOA", label: "Bank of Africa (BMCE Group)", labelAr: "بنك أفريقيا (مجموعة البنك المغربي للتجارة الخارجية)", isDefault: false },
  { code: "CDM", label: "Crédit du Maroc", labelAr: "مصرف المغرب", isDefault: true },
  { code: "SGMB", label: "Société Générale Maroc", labelAr: "الشركة العامة بالمغرب", isDefault: false },
  { code: "CIH", label: "CIH Bank", labelAr: "بنك القرض العقاري والسياحي (CIH)", isDefault: false },
  { code: "BMCI", label: "BMCI (Groupe BNP Paribas)", labelAr: "البنك المغربي للتجارة والصناعة (BMCI)", isDefault: false },
  { code: "CAM", label: "Crédit Agricole du Maroc", labelAr: "القرض الفلاحي للمغرب", isDefault: false },
  { code: "CFG", label: "CFG Bank", labelAr: "بنك سي إف جي (CFG)", isDefault: false },
  { code: "AL-BARID", label: "Al Barid Bank", labelAr: "البريد بنك", isDefault: false },
  { code: "AUTRE", label: "Autre établissement / Financement propre exclusif", labelAr: "مؤسسة أخرى / تمويل ذاتي حصري", isDefault: false },
];

// ----------------------------------------------------------------------------
// 4. PROFILS DE MONTÉE EN CHARGE (FINANCE)
// ----------------------------------------------------------------------------
export const PROFILS_MONTEE_CHARGE: ProfilMonteeChargeInfo[] = [
  {
    id: "STANDARD",
    label: "Standard (Recommandé par défaut)",
    labelAr: "نمو متوازن قياسي (موصى به)",
    description: "Croissance progressive et équilibrée du chiffre d'affaires",
    descriptionAr: "تطور تدريجي ومتوازن لرقم المعاملات",
    coefficients: [20, 70, 85, 100, 100, 100],
  },
  {
    id: "PRUDENT",
    label: "Prudent (Démarrage progressif)",
    labelAr: "نمو حذر (انطلاق متأنٍ)",
    description: "Hypothèse conservatrice avec rampe de lancement allongée",
    descriptionAr: "فرضية حذرة مع وتيرة إقلاع متأنية وتدريجية",
    coefficients: [15, 50, 75, 90, 100, 100],
  },
  {
    id: "RAPIDE",
    label: "Accéléré (Marché captif / Contrats signés)",
    labelAr: "نمو سريع ومكثف (عقود مؤكدة)",
    description: "Montée en puissance rapide dès la 1ère année d'exploitation",
    descriptionAr: "إقلاع قوي ومكثف منذ السنة الأولى من الاستغلال",
    coefficients: [40, 80, 100, 100, 100, 100],
  },
];

// ----------------------------------------------------------------------------
// 5. PROFILS RH DE SALAIRES & CHARGES CNSS
// ----------------------------------------------------------------------------
export const PROFILS_RH: ProfilRHInfo[] = [
  {
    code: "OPERATEUR",
    label: "Base Opérateur / SMIG / Ouvrier",
    labelAr: "عامل مهني / مشغل / الحد الأدنى للأجور",
    salaireBrutMensuel: 4500,
    description: "Base SMIC / Salarié d'exécution (4 500 MAD / mois)",
    descriptionAr: "أجر عمال التنفيذ (4500 درهم شهرياً)",
  },
  {
    code: "TECHNICIEN",
    label: "Technicien spécialisé / Agent de maîtrise",
    labelAr: "تقني متخصص / رئيس ورشة",
    salaireBrutMensuel: 7000,
    description: "Technicien / Agent de maîtrise (7 000 MAD / mois)",
    descriptionAr: "تقني مؤهل ومؤطر (7000 درهم شهرياً)",
  },
  {
    code: "CADRE",
    label: "Ingénieur / Cadre technique / Expert",
    labelAr: "مهندس / إطار تقني / خبير",
    salaireBrutMensuel: 12000,
    description: "Ingénieur / Cadre qualifié (12 000 MAD / mois)",
    descriptionAr: "أطر عليا ومهندسون (12000 درهم شهرياً)",
  },
  {
    code: "PERSONNALISE",
    label: "Saisie manuelle du salaire brut",
    labelAr: "تحديد حر لمتوسط الراتب",
    salaireBrutMensuel: 0,
    description: "Montant personnalisé saisi librement",
    descriptionAr: "مبلغ مخصص يتم إدخاله بحرية",
  },
];

// Helper functions for dynamic UI localization
export function getRegionLabel(reg: RegionInfo, lang: string): string {
  return lang === "ar" && reg.labelAr ? reg.labelAr : reg.label;
}

export function getProvinceLabel(prov: ProvinceInfo, lang: string): string {
  return lang === "ar" && prov.labelAr ? prov.labelAr : prov.label;
}

export function getSectorLabel(sec: SecteurInfo, lang: string): string {
  return lang === "ar" && sec.labelAr ? sec.labelAr : sec.label;
}

export function getBankLabel(bank: BanqueInfo, lang: string): string {
  return lang === "ar" && bank.labelAr ? bank.labelAr : bank.label;
}

export function getProfilRampLabel(profil: ProfilMonteeChargeInfo, lang: string): string {
  return lang === "ar" && profil.labelAr ? profil.labelAr : profil.label;
}

export function getProfilRampDesc(profil: ProfilMonteeChargeInfo, lang: string): string {
  return lang === "ar" && profil.descriptionAr ? profil.descriptionAr : profil.description;
}

export function getProfilRHLabel(prh: ProfilRHInfo, lang: string): string {
  return lang === "ar" && prh.labelAr ? prh.labelAr : prh.label;
}
