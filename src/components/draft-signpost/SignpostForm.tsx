'use client';

import React, { useState, useEffect } from 'react';
import type { MtgColor } from '@/types/mtg';
import type { ScryfallCard } from '@/types/scryfall';
import { ALL_COLORS, MIN_COLORS_REQUIRED } from '@/lib/constants/mtg';
import { buildDraftSignpostQuery } from '@/lib/scryfall/query-builder';
import { SetSelector } from './SetSelector';
import { ColorPicker } from './ColorPicker';
import { CardDisplay } from './CardDisplay';
import { Button } from '@/components/ui/Button';

export const SignpostForm: React.FC = () => {
  // Initialize with all colors selected
  const [selectedSets, setSelectedSets] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<Set<MtgColor>>(
    new Set(ALL_COLORS)
  );
  const [card, setCard] = useState<ScryfallCard | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manaSymbols, setManaSymbols] = useState<Record<string, string>>({});

  // Fetch mana symbols on component mount
  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const response = await fetch('/api/scryfall/symbology');
        if (!response.ok) {
          throw new Error('Failed to fetch symbols');
        }
        const data = await response.json();
        setManaSymbols(data.data);
      } catch (err) {
        console.error('Error fetching mana symbols:', err);
      }
    };

    fetchSymbols();
  }, []);

  const canSubmit =
    selectedSets.length > 0 && selectedColors.size >= MIN_COLORS_REQUIRED && !isLoading;

  const handleGenerate = async () => {
    if (!canSubmit) return;

    setIsLoading(true);
    setError(null);

    try {
      // Build the search query
      const colors = Array.from(selectedColors);
      const query = buildDraftSignpostQuery(selectedSets, colors);

      // Call the search API
      const response = await fetch(
        `/api/scryfall/cards/search?q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.total_cards === 0) {
        setError(
          'No draft signpost cards found for the selected sets and color combination. Try selecting different sets or colors!'
        );
        setCard(null);
        return;
      }

      // The API returns a single random card in the data array
      const randomCard = data.data[0];
      setCard(randomCard);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch card';
      setError(errorMessage);
      setCard(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Set Selection */}
      <SetSelector
        selectedSets={selectedSets}
        onChange={setSelectedSets}
        disabled={isLoading}
      />

      {/* Color Selection */}
      <ColorPicker
        selectedColors={selectedColors}
        onChange={setSelectedColors}
        disabled={isLoading}
      />

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleGenerate}
          disabled={!canSubmit}
          isLoading={isLoading}
          size="lg"
          variant="primary"
        >
          {isLoading ? 'Searching...' : 'Generate Draft Signpost'}
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 flex items-start gap-3">
          <svg
            className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="flex-1">
            <p className="text-red-400">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-300 transition-colors"
            aria-label="Dismiss error"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Card Display */}
      <CardDisplay card={card} isLoading={isLoading} manaSymbols={manaSymbols} />
    </div>
  );
};
