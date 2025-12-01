# Scryfall Tagger Usage Guide

This guide explains how to use the Scryfall Tagger functionality to fetch card tags.

## API Endpoint

`GET /api/scryfall/tagger`

## Usage Options

### Option 1: Using Set Code and Collector Number

```typescript
const response = await fetch(
  '/api/scryfall/tagger?set=rav&number=182'
);
const data = await response.json();
console.log(data.tags); // ['cda-toughness', 'warlord', 'cda-power']
```

### Option 2: Using Scryfall URI

```typescript
const card: ScryfallCard = {
  // ... card data from Scryfall API
  scryfall_uri: 'https://scryfall.com/card/rav/182/scion-of-the-wild?utm_source=api'
};

const response = await fetch(
  `/api/scryfall/tagger?url=${encodeURIComponent(card.scryfall_uri)}`
);
const data = await response.json();
console.log(data.tags); // ['cda-toughness', 'warlord', 'cda-power']
```

## Response Format

```typescript
interface TaggerTagsResponse {
  tags: string[];
  cardName?: string;
  setCode?: string;
  collectorNumber?: string;
}
```

## Example: Fetching Tags for a Card

```typescript
import type { ScryfallCard } from '@/types/scryfall';
import type { TaggerTagsResponse } from '@/types/tagger';

async function fetchCardTags(card: ScryfallCard): Promise<string[]> {
  try {
    const response = await fetch(
      `/api/scryfall/tagger?url=${encodeURIComponent(card.scryfall_uri)}`
    );

    if (!response.ok) {
      console.error(`Failed to fetch tags: ${response.status}`);
      return [];
    }

    const data: TaggerTagsResponse = await response.json();
    return data.tags;
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

// Usage
const card = await fetch('https://api.scryfall.com/cards/feb05072-c619-4024-8ed8-440b01f73113')
  .then(res => res.json());

const tags = await fetchCardTags(card);
console.log(tags); // ['cda-toughness', 'warlord', 'cda-power']
```

## Example: Using in a React Component

```typescript
'use client';

import { useState, useEffect } from 'react';
import type { ScryfallCard } from '@/types/scryfall';

export function CardWithTags({ card }: { card: ScryfallCard }) {
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!card) return;

    const fetchTags = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/scryfall/tagger?url=${encodeURIComponent(card.scryfall_uri)}`
        );
        if (response.ok) {
          const data = await response.json();
          setTags(data.tags || []);
        }
      } catch (error) {
        console.error('Failed to fetch tags:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, [card]);

  return (
    <div>
      <h3>{card.name}</h3>
      {loading && <p>Loading tags...</p>}
      {!loading && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="font-semibold">Tags:</span>
          {tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-900/30 border border-blue-700 rounded text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200 OK` - Success, tags returned
- `400 Bad Request` - Missing or invalid parameters
- `404 Not Found` - Card not found on Scryfall Tagger
- `500 Internal Server Error` - Server error

If a card has no tags, the API returns an empty array.

## Performance

- **Caching**: Responses are cached for 24 hours
- **Rate Limiting**: Requests are rate-limited to respect Scryfall's limits
- **First Request**: ~200-500ms (fetches from Scryfall)
- **Cached Request**: ~10-50ms

## Testing

Test the API directly:

```bash
# Using set code and collector number
curl "http://localhost:3000/api/scryfall/tagger?set=rav&number=182"

# Expected response:
# {
#   "tags": ["cda-toughness", "warlord", "cda-power"],
#   "setCode": "rav",
#   "collectorNumber": "182"
# }
```

## Files Created

1. `/src/types/tagger.ts` - TypeScript type definitions
2. `/src/lib/scryfall/tagger-url.ts` - URL transformation utilities
3. `/src/lib/scryfall/tagger-client.ts` - HTML fetching and parsing
4. `/src/app/api/scryfall/tagger/route.ts` - API route handler

## Notes

- This feature scrapes HTML from Scryfall Tagger website
- HTML structure may change without notice
- Multiple parsing strategies ensure resilience
- Consider this a temporary solution until official API available
- Tags are community-driven and may vary over time
