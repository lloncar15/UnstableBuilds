// Scryfall API type definitions
// API Documentation: https://scryfall.com/docs/api

export interface ScryfallSet {
  id: string;
  code: string;
  name: string;
  set_type: string;
  released_at: string;
  card_count: number;
  icon_svg_uri?: string;
  digital: boolean;
  parent_set_code?: string;
}

export interface ScryfallSetListResponse {
  object: "list";
  has_more: boolean;
  data: ScryfallSet[];
}

export interface ScryfallCard {
  id: string;
  name: string;
  mana_cost?: string;
  cmc: number;
  type_line: string;
  oracle_text?: string;
  colors?: string[];
  color_identity: string[];
  set: string;
  set_name: string;
  rarity: string;
  image_uris?: {
    small: string;
    normal: string;
    large: string;
    png: string;
    art_crop: string;
    border_crop: string;
  };
  card_faces?: Array<{
    name: string;
    mana_cost?: string;
    type_line: string;
    oracle_text?: string;
    colors?: string[];
    image_uris?: {
      small: string;
      normal: string;
      large: string;
      png: string;
      art_crop: string;
      border_crop: string;
    };
  }>;
  scryfall_uri: string;
  uri: string;
}

export interface ScryfallCardSearchResponse {
  object: "list";
  total_cards: number;
  has_more: boolean;
  data: ScryfallCard[];
}

export interface ScryfallSymbol {
  symbol: string;
  loose_variant?: string;
  english: string;
  transposable: boolean;
  represents_mana: boolean;
  mana_value?: number;
  appears_in_mana_costs: boolean;
  funny: boolean;
  colors: string[];
  gatherer_alternates?: string[];
  svg_uri: string;
}

export interface ScryfallSymbologyResponse {
  object: "list";
  has_more: boolean;
  data: ScryfallSymbol[];
}

export interface ScryfallError {
  object: "error";
  code: string;
  status: number;
  details: string;
  type?: string;
  warnings?: string[];
}
