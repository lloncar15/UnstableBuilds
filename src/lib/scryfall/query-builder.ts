import type { MtgColor } from '@/types/mtg';
import { DRAFT_SIGNPOST_TAG, SPM_SIGNPOST_TAG } from '@/lib/constants/mtg';

/**
 * Build a Scryfall search query for draft signpost cards
 * @param setCodes - Array of MTG set codes (e.g., ['rtr', 'grn'] for Return to Ravnica and Guilds of Ravnica)
 * @param colors - Array of MTG color codes (W, U, B, R, G)
 * @returns Formatted Scryfall search query string
 */
export function buildDraftSignpostQuery(
  setCodes: string[],
  colors: MtgColor[]
): string {
  if (!setCodes || setCodes.length === 0) {
    throw new Error('At least one set code is required');
  }

  if (!colors || colors.length === 0) {
    throw new Error('At least one color must be selected');
  }

  // Build color identity filter
  // Convert ['U', 'R'] to 'ur' (lowercase)
  const colorFilter = `id:${colors.join('').toLowerCase()}`;

  // Build set filter
  // For multiple sets, use OR syntax: (s:rtr OR s:grn)
  const setFilter = setCodes.length === 1
    ? `s:${setCodes[0].toLowerCase()}`
    : `(${setCodes.map(code => `s:${code.toLowerCase()}`).join(' OR ')})`;

  // Determine which signpost tag to use
  // SPM set uses a special tag, all others use the standard tag
  const hasSpmOnly = setCodes.length === 1 && setCodes[0].toLowerCase() === 'spm';
  const signpostTag = hasSpmOnly ? SPM_SIGNPOST_TAG : DRAFT_SIGNPOST_TAG;

  // Combine all filters with is:booster to exclude supplementary cards
  // Example: "(s:rtr OR s:grn) id:ur is:booster otag:"draft signpost""
  return `${setFilter} ${colorFilter} is:booster ${signpostTag}`;
}

/**
 * Validate if a search query is properly formatted
 * @param query - The search query to validate
 * @returns true if valid, false otherwise
 */
export function validateSearchQuery(query: string): boolean {
  if (!query || query.trim().length === 0) {
    return false;
  }

  // Check if it contains required components
  const hasSetFilter = /s:[a-z0-9]+/i.test(query);
  const hasColorFilter = /id:[wubrgc]+/i.test(query);
  const hasSignpostTag = query.includes(DRAFT_SIGNPOST_TAG);

  return hasSetFilter && hasColorFilter && hasSignpostTag;
}
