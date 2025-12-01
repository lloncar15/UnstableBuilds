/**
 * Client for fetching and parsing Scryfall Tagger data
 */

import * as cheerio from 'cheerio';
import { SCRYFALL_USER_AGENT } from '@/lib/constants/mtg';
import type { TaggerTagsResponse } from '@/types/tagger';

/**
 * Fetches HTML from tagger URL
 * @param taggerUrl - Tagger URL to fetch
 * @returns HTML content as string
 * @throws Error if fetch fails or response is not HTML
 */
async function fetchTaggerHtml(taggerUrl: string): Promise<string> {
  const response = await fetch(taggerUrl, {
    headers: {
      'User-Agent': SCRYFALL_USER_AGENT,
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch tagger page: HTTP ${response.status}`);
  }

  const contentType = response.headers.get('content-type');
  if (!contentType?.includes('text/html')) {
    throw new Error(`Unexpected content type: ${contentType}`);
  }

  return response.text();
}

/**
 * Extracts card tags from tagger HTML
 * Uses multiple strategies to handle different HTML structures
 * @param html - HTML content from tagger page
 * @returns Array of tag strings
 */
export function extractTagsFromHtml(html: string): string[] {
  const $ = cheerio.load(html);

  // Strategy 1: Meta description (as mentioned by user)
  const metaDescription = $('meta[name="description"]').attr('content');
  if (metaDescription && metaDescription.includes('Card Tags:')) {
    // Find the "Card Tags:" section
    const cardTagsIndex = metaDescription.indexOf('Card Tags:');
    if (cardTagsIndex !== -1) {
      // Extract everything after "Card Tags:"
      const afterCardTags = metaDescription.substring(cardTagsIndex + 'Card Tags:'.length);
      // Split by bullet points and newlines, then clean up
      const tags = afterCardTags
        .split(/[•\n]/)
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
        .filter((tag) => tag !== 'and' && !tag.match(/^\d+\s+more$/))
        .filter((tag) => tag !== '"' && tag !== '/');
      if (tags.length > 0) return tags;
    }
  }

  // Strategy 2: OpenGraph description
  const ogDescription = $('meta[property="og:description"]').attr('content');
  if (ogDescription && ogDescription.includes('Card Tags:')) {
    const cardTagsIndex = ogDescription.indexOf('Card Tags:');
    if (cardTagsIndex !== -1) {
      const afterCardTags = ogDescription.substring(cardTagsIndex + 'Card Tags:'.length);
      const tags = afterCardTags
        .split(/[•\n]/)
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
        .filter((tag) => tag !== 'and' && !tag.match(/^\d+\s+more$/))
        .filter((tag) => tag !== '"' && tag !== '/');
      if (tags.length > 0) return tags;
    }
  }

  // Strategy 3: Embedded JSON data (check script tags)
  const scriptTags = $('script[type="application/json"]');
  for (const element of scriptTags.toArray()) {
    try {
      const jsonText = $(element).html();
      if (jsonText) {
        const data = JSON.parse(jsonText);
        if (data.card?.tags) return data.card.tags;
        if (data.tags) return data.tags;
        if (data.oracleTags) return data.oracleTags;
      }
    } catch {
      // Skip invalid JSON
    }
  }

  // Strategy 4: Look for tag elements in the page
  const tagElements = $('[data-tag], .tag, .card-tag');
  if (tagElements.length > 0) {
    const tags: string[] = [];
    tagElements.each((_, element) => {
      const tag = $(element).text().trim() || $(element).attr('data-tag');
      if (tag) tags.push(tag);
    });
    if (tags.length > 0) return tags;
  }

  // No tags found
  return [];
}

/**
 * Fetches and parses card tags from tagger URL
 * @param taggerUrl - Tagger URL to fetch and parse
 * @returns Object containing tags and metadata
 * @throws Error if fetch or parse fails
 *
 * @example
 * const result = await fetchCardTags('https://tagger.scryfall.com/card/rav/182')
 * // Returns: { tags: ['cda-toughness', 'warlord', 'cda-power'], setCode: 'rav', collectorNumber: '182' }
 */
export async function fetchCardTags(
  taggerUrl: string
): Promise<TaggerTagsResponse> {
  try {
    const html = await fetchTaggerHtml(taggerUrl);
    const tags = extractTagsFromHtml(html);

    // Parse URL for metadata
    const urlMatch = taggerUrl.match(/\/card\/([^/]+)\/([^/]+)/);

    return {
      tags,
      setCode: urlMatch?.[1],
      collectorNumber: urlMatch?.[2],
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch card tags: ${error.message}`);
    }
    throw new Error('Failed to fetch card tags: Unknown error');
  }
}
