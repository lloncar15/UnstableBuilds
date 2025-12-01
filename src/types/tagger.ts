// Scryfall Tagger type definitions

export interface TaggerTagsResponse {
  tags: string[];
  cardName?: string;
  setCode?: string;
  collectorNumber?: string;
}

export interface TaggerError {
  error: string;
  details?: string;
}
