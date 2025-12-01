import { NextRequest, NextResponse } from 'next/server';
import { getErrorMessage } from '@/lib/scryfall/client';
import { scryfallRateLimiter } from '@/lib/scryfall/rate-limiter';
import {
  transformToTaggerUrl,
  buildTaggerUrl,
} from '@/lib/scryfall/tagger-url';
import { fetchCardTags } from '@/lib/scryfall/tagger-client';
import type { TaggerTagsResponse, TaggerError } from '@/types/tagger';

export const runtime = 'nodejs'; // Required for cheerio
export const revalidate = 86400; // Cache for 24 hours

/**
 * GET /api/scryfall/tagger?url={scryfallUri}
 * OR
 * GET /api/scryfall/tagger?set={setCode}&number={collectorNumber}
 *
 * Fetches card tags from Scryfall Tagger website
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const scryfallUri = searchParams.get('url');
    const setCode = searchParams.get('set');
    const collectorNumber = searchParams.get('number');

    // Validate input
    if (!scryfallUri && (!setCode || !collectorNumber)) {
      return NextResponse.json<TaggerError>(
        {
          error: 'Bad Request',
          details:
            'Either "url" parameter or both "set" and "number" parameters are required',
        },
        { status: 400 }
      );
    }

    // Build tagger URL
    let taggerUrl: string;
    try {
      if (scryfallUri) {
        taggerUrl = transformToTaggerUrl(scryfallUri);
      } else {
        taggerUrl = buildTaggerUrl(setCode!, collectorNumber!);
      }
    } catch (error) {
      return NextResponse.json<TaggerError>(
        {
          error: 'Invalid Input',
          details: getErrorMessage(error),
        },
        { status: 400 }
      );
    }

    // Apply rate limiting
    await scryfallRateLimiter.waitIfNeeded();

    // Fetch and parse tags
    const result = await fetchCardTags(taggerUrl);

    return NextResponse.json<TaggerTagsResponse>(result);
  } catch (error) {
    console.error('[Tagger API] Error fetching card tags:', error);

    const errorMessage = getErrorMessage(error);

    // Handle 404
    if (errorMessage.includes('404') || errorMessage.includes('not found')) {
      return NextResponse.json<TaggerError>(
        {
          error: 'Not Found',
          details: 'Card not found on Scryfall Tagger',
        },
        { status: 404 }
      );
    }

    // Generic error
    return NextResponse.json<TaggerError>(
      {
        error: 'Internal Server Error',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
