import { NextResponse } from 'next/server';
import type { ScryfallSymbologyResponse } from '@/types/scryfall';
import { fetchFromScryfall, getErrorMessage } from '@/lib/scryfall/client';
import { scryfallRateLimiter } from '@/lib/scryfall/rate-limiter';
import { ALL_COLORS } from '@/lib/constants/mtg';

export const revalidate = 86400; // Cache for 24 hours (symbols don't change)

/**
 * GET /api/scryfall/symbology
 * Fetches mana symbol SVG URIs from Scryfall API
 * Returns only the basic mana symbols (W, U, B, R, G)
 */
export async function GET() {
  try {
    // Wait for rate limiter
    await scryfallRateLimiter.waitIfNeeded();

    // Fetch all symbols from Scryfall
    const data = await fetchFromScryfall<ScryfallSymbologyResponse>('/symbology');

    // Filter to only basic mana symbols
    const manaSymbols = data.data.filter((symbol) => {
      // Match symbols like {W}, {U}, {B}, {R}, {G}
      const symbolCode = symbol.symbol.replace(/[{}]/g, '');
      return ALL_COLORS.includes(symbolCode as any);
    });

    // Create a map of color code to SVG URI
    const symbolMap = manaSymbols.reduce(
      (acc, symbol) => {
        const colorCode = symbol.symbol.replace(/[{}]/g, '');
        acc[colorCode] = {
          color: colorCode,
          svgUri: symbol.svg_uri,
          symbol: symbol.symbol,
        };
        return acc;
      },
      {} as Record<string, { color: string; svgUri: string; symbol: string }>
    );

    return NextResponse.json({
      object: 'list',
      data: symbolMap,
    });
  } catch (error) {
    console.error('[Scryfall API] Error fetching symbology:', error);

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
