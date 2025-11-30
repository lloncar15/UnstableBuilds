import { SCRYFALL_RATE_LIMIT_MS } from '@/lib/constants/mtg';

/**
 * Rate limiter for Scryfall API requests
 * Enforces a minimum delay between requests to respect API rate limits
 */
class RateLimiter {
  private lastRequestTime = 0;
  private readonly minDelay: number;

  constructor(minDelayMs: number = SCRYFALL_RATE_LIMIT_MS) {
    this.minDelay = minDelayMs;
  }

  /**
   * Wait if needed to maintain rate limit
   * Should be called before making any Scryfall API request
   */
  async waitIfNeeded(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.minDelay) {
      const waitTime = this.minDelay - timeSinceLastRequest;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    this.lastRequestTime = Date.now();
  }

  /**
   * Reset the rate limiter (useful for testing)
   */
  reset(): void {
    this.lastRequestTime = 0;
  }
}

// Singleton instance for global rate limiting
export const scryfallRateLimiter = new RateLimiter();
