// Magic: The Gathering specific type definitions

export type MtgColor = 'W' | 'U' | 'B' | 'R' | 'G';

export interface MtgColorInfo {
  code: MtgColor;
  name: string;
  fullName: string;
  hex: string;
  symbol: string; // Scryfall symbol notation like {W}, {U}, etc.
}

export interface DraftSignpostQuery {
  setCode: string;
  colors: MtgColor[];
}

export interface SignpostFormState {
  selectedSet: string;
  selectedColors: Set<MtgColor>;
  card: import('./scryfall').ScryfallCard | null;
  isLoading: boolean;
  error: string | null;
}

export interface ManaSymbolData {
  color: MtgColor;
  svgUri: string;
}
