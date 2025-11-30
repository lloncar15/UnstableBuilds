import { NextResponse } from 'next/server';
import type { ScryfallSetListResponse } from '@/types/scryfall';
import { fetchFromScryfall, getErrorMessage } from '@/lib/scryfall/client';
import { scryfallRateLimiter } from '@/lib/scryfall/rate-limiter';
import { SETS_WITH_DRAFT_SIGNPOSTS } from '@/lib/constants/mtg';

export const revalidate = 86400; // Cache for 24 hours (sets don't change often)

/**
 * GET /api/scryfall/sets
 * Fetches MTG sets that contain draft signpost cards, excluding future releases and digital sets
 */
export async function GET() {
  try {
    // Wait for rate limiter
    await scryfallRateLimiter.waitIfNeeded();

    // Fetch all sets from Scryfall
    const data = await fetchFromScryfall<ScryfallSetListResponse>('/sets');

    const now = new Date();

    // Filter to sets with draft signposts, released sets only, and non-digital
    const filteredSets = data.data.filter((set) => {
      const isInList = SETS_WITH_DRAFT_SIGNPOSTS.includes(set.code);
      const isReleased = new Date(set.released_at) <= now;
      const isNotDigital = !set.digital;

      return isInList && isReleased && isNotDigital;
    });

    // Sort by release date (newest first)
    const sortedSets = filteredSets.sort((a, b) => {
      return new Date(b.released_at).getTime() - new Date(a.released_at).getTime();
    });

    return NextResponse.json({
      object: 'list',
      has_more: false,
      data: sortedSets,
    });
  } catch (error) {
    console.error('[Scryfall API] Error fetching sets:', error);

    return NextResponse.json(
      {
        object: 'error',
        status: 500,
        code: 'internal_error',
        details: getErrorMessage(error),
      },
      { status: 500 }
    );
  }
}
