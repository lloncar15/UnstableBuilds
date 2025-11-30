import { NextRequest, NextResponse } from 'next/server';
import type { ScryfallCardSearchResponse } from '@/types/scryfall';
import { fetchFromScryfall, getErrorMessage } from '@/lib/scryfall/client';
import { scryfallRateLimiter } from '@/lib/scryfall/rate-limiter';

/**
 * GET /api/scryfall/cards/search?q={query}
 * Proxies card search requests to Scryfall API
 * Returns a random card from the search results
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        {
          object: 'error',
          status: 400,
          code: 'bad_request',
          details: 'Query parameter "q" is required',
        },
        { status: 400 }
      );
    }

    // Wait for rate limiter
    await scryfallRateLimiter.waitIfNeeded();

    // Fetch search results from Scryfall
    const endpoint = `/cards/search?q=${encodeURIComponent(query)}`;
    const data = await fetchFromScryfall<ScryfallCardSearchResponse>(endpoint);

    // If no cards found, return empty result
    if (data.total_cards === 0) {
      return NextResponse.json({
        object: 'list',
        total_cards: 0,
        has_more: false,
        data: [],
      });
    }

    // Return a random card from the results
    const randomIndex = Math.floor(Math.random() * data.data.length);
    const randomCard = data.data[randomIndex];

    return NextResponse.json({
      object: 'list',
      total_cards: data.total_cards,
      has_more: data.has_more,
      data: [randomCard], // Return single random card in array
    });
  } catch (error) {
    console.error('[Scryfall API] Error searching cards:', error);

    // Check if it's a 404 (no results) - this is not necessarily an error
    const errorMessage = getErrorMessage(error);
    if (errorMessage.includes('404') || errorMessage.includes('not found')) {
      return NextResponse.json({
        object: 'list',
        total_cards: 0,
        has_more: false,
        data: [],
      });
    }

    return NextResponse.json(
      {
        object: 'error',
        status: 500,
        code: 'internal_error',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
