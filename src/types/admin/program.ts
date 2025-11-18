type Rule = {
  id?: string;
  field: string;
  operator: string;
  value: unknown;
  valueSource?: string;
};

export type RuleGroup = {
  id?: string;
  combinator?: string; // 'and' | 'or'
  rules: Rule[];
};

export interface Program {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  DateDebut: string;
  DateFin: string;
  link: string;
  hero?: {
    isHero: boolean;
    image: string;
    titleFr: string;
    titleAr: string;
    subtitleFr: string;
    subtitleAr: string;
    descriptionFr: string;
    descriptionAr: string;
  };
  criteres: RuleGroup;
}

export interface ProgramFormData {
  name: string;
  description: string;
  isActive: boolean;
  DateDebut: string;
  DateFin: string;
  link?: string;
  criteres: RuleGroup;
}
