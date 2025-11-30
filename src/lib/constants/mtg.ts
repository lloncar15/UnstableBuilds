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
// Filtered to sets from DKA (2012-02-03) onwards, excluding non-draftable sets
// and sets that don't have draft signpost cards (like m15)
export const SETS_WITH_DRAFT_SIGNPOSTS = [
  '2x2', '2xm', 'a25', 'aer', 'afr', 'akh', 'akr',
  'bbd', 'bfz', 'blb', 'bng', 'bro',
  'clb', 'cmr', 'cn2', 'cns',
  'dft', 'dgm', 'dka', 'dmr', 'dmu', 'dom', 'dsk', 'dtk',
  'ecl', 'eld', 'ema', 'emn', 'eoe',
  'fdn', 'fin',
  'grn', 'gtc',
  'hou',
  'iko', 'ima', 'inr',
  'jou',
  'khm', 'kld', 'klr', 'ktk',
  'lci', 'ltr',
  'm19', 'm20', 'm21', 'mh1', 'mh2', 'mh3', 'mid', 'mkm', 'mm2', 'mm3', 'mma', 'mom',
  'neo',
  'ogw', 'om1', 'one', 'ori', 'otj',
  'pio',
  'rix', 'rna', 'rtr', 'rvr',
  'sir', 'sis', 'snc', 'soi', 'spm', 'stx',
  'tdm', 'thb', 'ths', 'tla', 'tmt', 'tpr', 'tsr',
  'uma',
  'vma', 'vow',
  'war', 'woe',
  'xln',
  'znr'
];

// Draft signpost tagger tag
export const DRAFT_SIGNPOST_TAG = 'otag:"draft signpost"';

// Special set with different draft signpost tag
export const SPM_SIGNPOST_TAG = 'otag:cycle-spm-draft-signpost';
