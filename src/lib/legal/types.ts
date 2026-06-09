export interface LegalSubsection {
  title: string;
  paragraphs?: string[];
  list?: string[];
}

export interface LegalSection {
  title: string;
  paragraphs?: string[];
  list?: string[];
  subsections?: LegalSubsection[];
}

export interface LegalDocument {
  title: string;
  description: string;
  effectiveDate: string;
  sections: LegalSection[];
}
