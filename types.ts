export type ViewMode = 'EXERCITO' | 'SIAPE' | 'ANALYZER';
export type EntityType = 'EXERCITO' | 'SIAPE';

export type SectionType = 'list' | 'table' | 'text';

export interface SectionItem {
  id: string;
  text: string;
}

export interface TableRow {
  id: string;
  cells: string[];
}

export interface BaseSection {
  id: string;
  title: string;
  type: SectionType;
  icon?: string;
}

export interface ListSection extends BaseSection {
  type: 'list';
  items: SectionItem[];
  listStyle?: 'check' | 'cross' | 'bullet';
}

export interface TableSection extends BaseSection {
  type: 'table';
  headers: string[];
  rows: TableRow[];
}

export interface TextSection extends BaseSection {
  type: 'text';
  content: string;
}

export type Section = ListSection | TableSection | TextSection;

export interface DocumentAttachment {
  id: string;
  name: string;
  date: string;
  size: string;
}

export interface EntityData {
  id: EntityType;
  name: string;
  lastUpdated: string;
  sections: Section[];
  documents: DocumentAttachment[];
}

export interface AppData {
  [key: string]: EntityData;
}

export interface DebtInfo {
  banco: string;
  valorParcela?: number;
  prazoRestante?: string;
}

export interface AnalyzerExtractedData {
  nome?: string;
  cpf?: string;
  precCatInd?: string;
  matricula?: string;
  liquido?: number;
  faixaOperacao?: string;
  dividasIdentificadas?: DebtInfo[];
}

export interface AnalyzerResult {
  legivel: boolean;
  orgao: string;
  elegivel: boolean;
  alertaBancosBloqueados: boolean;
  motivo: string;
  dadosExtraidos: AnalyzerExtractedData;
}
