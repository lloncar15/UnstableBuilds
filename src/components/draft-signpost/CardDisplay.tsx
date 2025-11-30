'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import type { ScryfallCard } from '@/types/scryfall';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export interface CardDisplayProps {
  card: ScryfallCard | null;
  isLoading?: boolean;
  manaSymbols?: Record<string, string>;
}

// Card dimensions (Scryfall standard is 488x680)
// We'll scale it down to 70% for better page fit
const CARD_WIDTH = 342;  // 488 * 0.7
const CARD_HEIGHT = 476; // 680 * 0.7

export const CardDisplay: React.FC<CardDisplayProps> = ({
  card,
  isLoading = false,
  manaSymbols = {},
}) => {
  const [imageLoading, setImageLoading] = useState(true);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center">
        <div
          className="flex flex-col items-center justify-center gap-4 bg-[#2D2D2D] rounded-2xl border-2 border-dashed border-[#4A4A4A]"
          style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
        >
          <LoadingSpinner size="lg" />
          <p className="text-gray-400 animate-pulse text-sm">
            Searching for signpost cards...
          </p>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="flex flex-col items-center">
        <div
          className="flex flex-col items-center justify-center gap-4 p-8 bg-[#2D2D2D] rounded-2xl border-2 border-dashed border-[#4A4A4A]"
          style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
        >
          <div className="text-6xl opacity-20">🎴</div>
          <p className="text-gray-400 text-center text-sm px-4">
            Select sets and colors, then click Generate to find a draft signpost card
          </p>
        </div>
      </div>
    );
  }

  // Get the image URI (handle double-faced cards)
  const imageUri = card.image_uris?.large || card.card_faces?.[0]?.image_uris?.large;

  if (!imageUri) {
    return (
      <div className="flex flex-col items-center">
        <div
          className="flex flex-col items-center justify-center gap-4 p-8 bg-[#2D2D2D] rounded-2xl border border-red-700"
          style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
        >
          <p className="text-red-400">No image available for this card</p>
          <p className="text-gray-400 text-sm">{card.name}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Card Image */}
      <div className="relative group">
        <div
          className="
            relative rounded-2xl overflow-hidden
            shadow-2xl
            transition-all duration-300
            hover:scale-105 hover:shadow-[0_0_50px_rgba(184,162,121,0.5)]
            border-4 border-transparent
            hover:border-[#B8A279]
          "
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
          }}
        >
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#2D2D2D]">
              <LoadingSpinner size="md" />
            </div>
          )}
          <Image
            src={imageUri}
            alt={card.name}
            width={CARD_WIDTH}
            height={CARD_HEIGHT}
            className={`
              transition-opacity duration-300
              ${imageLoading ? 'opacity-0' : 'opacity-100'}
            `}
            onLoad={() => setImageLoading(false)}
            priority
          />
        </div>
      </div>

      {/* Card Details */}
      <div className="flex flex-col items-center gap-2 w-full max-w-md">
        <h3 className="text-2xl font-bold text-gray-100">{card.name}</h3>
        <p className="text-sm text-gray-400 font-mono">
          {card.set_name} ({card.set.toUpperCase()})
        </p>
        {card.colors && card.colors.length > 0 && (
          <div className="flex gap-1 items-center">
            {card.colors.map((color) => {
              const symbolData = manaSymbols[color];
              return symbolData ? (
                <img
                  key={color}
                  src={symbolData.svgUri}
                  alt={`${color} mana`}
                  className="w-5 h-5"
                />
              ) : (
                <span key={color} className="text-xs text-gray-300 font-mono">{color}</span>
              );
            })}
          </div>
        )}

        {/* Link to Scryfall */}
        <a
          href={card.scryfall_uri}
          target="_blank"
          rel="noopener noreferrer"
          className="
            mt-2 text-sm text-[#B8A279] hover:text-[#C9B389]
            transition-colors duration-200
            flex items-center gap-1
          "
        >
          View on Scryfall
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    </div>
  );
};
