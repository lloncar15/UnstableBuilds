import type { MtgColor, MtgColorInfo } from '@/types/mtg';

// MTG Color Information
export const MTG_COLORS: Record<MtgColor, MtgColorInfo> = {
  W: {
    code: 'W',
    name: 'White',
    fullName: 'Plains',
    hex: '#F0E6D2',
    symbol: '{W}',
  },
  U: {
    code: 'U',
    name: 'Blue',
    fullName: 'Island',
    hex: '#0E68AB',
    symbol: '{U}',
  },
  B: {
    code: 'B',
    name: 'Black',
    fullName: 'Swamp',
    hex: '#150B00',
    symbol: '{B}',
  },
  R: {
    code: 'R',
    name: 'Red',
    fullName: 'Mountain',
    hex: '#D3202A',
    symbol: '{R}',
  },
  G: {
    code: 'G',
    name: 'Green',
    fullName: 'Forest',
    hex: '#00733E',
    symbol: '{G}',
  },
};

// All colors in WUBRG order
export const ALL_COLORS: MtgColor[] = ['W', 'U', 'B', 'R', 'G'];

// Minimum colors required for draft signpost
export const MIN_COLORS_REQUIRED = 2;

// Scryfall API configuration
export const SCRYFALL_API_BASE_URL = 'https://api.scryfall.com';
export const SCRYFALL_RATE_LIMIT_MS = 100; // 100ms between requests
export const SCRYFALL_USER_AGENT = 'MTG-DraftSignpost/1.0';

// Sets that are draftable (core, masters, expansion, draft_innovation)
// Sorted by release date (newest first)
// Note: Unreleased sets will be filtered out by the API based on release_at date
export const SETS_WITH_DRAFT_SIGNPOSTS = [
  'tmt', 'ecl', 'tla', 'spm', 'om1', 'eoe', 'fin', 'tdm', 'dft', 'inr', 'pio',
  'fdn', 'dsk', 'blb', 'mh3', 'otj', 'mkm', 'rvr', 'lci', 'woe', 'ltr', 'mom',
  'sis', 'sir', 'one', 'dmr', 'bro', 'dmu', '2x2', 'clb', 'snc', 'neo', 'vow',
  'mid', 'afr', 'mh2', 'stx', 'tsr', 'khm', 'cmr', 'klr', 'znr', 'akr', '2xm',
  'm21', 'iko', 'thb', 'eld', 'm20', 'mh1', 'war', 'rna', 'uma', 'grn', 'm19',
  'bbd', 'dom', 'a25', 'rix', 'ima', 'xln', 'hou', 'akh', 'mm3', 'aer', 'kld',
  'cn2', 'emn', 'ema', 'soi', 'ogw', 'bfz', 'ori', 'mm2', 'tpr', 'dtk', 'ktk',
  'vma', 'cns', 'jou', 'bng', 'ths', 'mma', 'dgm', 'gtc', 'rtr', 'dka'
];

// Draft signpost tagger tag
export const DRAFT_SIGNPOST_TAG = 'otag:"draft signpost"';

// Special set with different draft signpost tag
export const SPM_SIGNPOST_TAG = 'otag:cycle-spm-draft-signpost';
