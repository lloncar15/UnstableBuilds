/**
 * Utilities for transforming Scryfall URLs to Tagger URLs
 */

/**
 * Transforms a Scryfall URI to a tagger URL
 * @param scryfallUri - Full Scryfall card URI (e.g., https://scryfall.com/card/rav/182/scion-of-the-wild?utm_source=api)
 * @returns Tagger URL (e.g., https://tagger.scryfall.com/card/rav/182)
 * @throws Error if URL format is invalid
 *
 * @example
 * transformToTaggerUrl('https://scryfall.com/card/rav/182/scion-of-the-wild?utm_source=api')
 * // Returns: 'https://tagger.scryfall.com/card/rav/182'
 */
export function transformToTaggerUrl(scryfallUri: string): string {
  try {
    const url = new URL(scryfallUri);

    if (!url.hostname.includes('scryfall.com')) {
      throw new Error('URL must be from scryfall.com');
    }

    // Extract: /card/SET/NUMBER/...
    const pathMatch = url.pathname.match(/^\/card\/([^/]+)\/([^/]+)/);

    if (!pathMatch) {
      throw new Error('Invalid Scryfall card URL format');
    }

    const [, setCode, collectorNumber] = pathMatch;

    return `https://tagger.scryfall.com/card/${setCode}/${collectorNumber}`;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to transform URL: ${error.message}`);
    }
    throw new Error('Failed to transform URL: Unknown error');
  }
}

/**
 * Builds a tagger URL from set code and collector number
 * @param setCode - Set code (e.g., 'rav')
 * @param collectorNumber - Collector number (e.g., '182')
 * @returns Tagger URL
 * @throws Error if parameters are invalid
 *
 * @example
 * buildTaggerUrl('rav', '182')
 * // Returns: 'https://tagger.scryfall.com/card/rav/182'
 */
export function buildTaggerUrl(
  setCode: string,
  collectorNumber: string
): string {
  if (!setCode || !collectorNumber) {
    throw new Error('Set code and collector number are required');
  }

  const normalizedSet = setCode.toLowerCase().trim();
  const normalizedNumber = collectorNumber.trim();

  return `https://tagger.scryfall.com/card/${normalizedSet}/${normalizedNumber}`;
}
