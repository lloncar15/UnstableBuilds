import {
  SCRYFALL_API_BASE_URL,
  SCRYFALL_USER_AGENT,
} from '@/lib/constants/mtg';
import type { ScryfallError } from '@/types/scryfall';

/**
 * Base fetch function for Scryfall API
 * Includes proper headers and error handling
 */
export async function fetchFromScryfall<T>(
  endpoint: string,
  init?: RequestInit
): Promise<T> {
  const url = `${SCRYFALL_API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...init,
    headers: {
      'User-Agent': SCRYFALL_USER_AGENT,
      Accept: 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    // Try to parse error response
    let errorData: ScryfallError | null = null;
    try {
      errorData = (await response.json()) as ScryfallError;
    } catch {
      // If parsing fails, use generic error
    }

    const errorMessage = errorData?.details || `HTTP ${response.status}: ${response.statusText}`;

    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}

/**
 * Check if an error is a Scryfall API error
 */
export function isScryfallError(error: unknown): error is ScryfallError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'object' in error &&
    error.object === 'error'
  );
}

/**
 * Get a user-friendly error message from any error
 */
export function getErrorMessage(error: unknown): string {
  if (isScryfallError(error)) {
    return error.details;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unknown error occurred';
}
