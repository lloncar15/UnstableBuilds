'use client';

import React, { useEffect, useState } from 'react';
import type { MtgColor } from '@/types/mtg';
import { ALL_COLORS, MIN_COLORS_REQUIRED, MTG_COLORS } from '@/lib/constants/mtg';

export interface ColorPickerProps {
  selectedColors: Set<MtgColor>;
  onChange: (colors: Set<MtgColor>) => void;
  disabled?: boolean;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColors,
  onChange,
  disabled = false,
}) => {
  const [manaSymbols, setManaSymbols] = useState<Record<string, string>>({});
  const [isLoadingSymbols, setIsLoadingSymbols] = useState(true);

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
      } finally {
        setIsLoadingSymbols(false);
      }
    };

    fetchSymbols();
  }, []);

  const toggleColor = (color: MtgColor) => {
    const newColors = new Set(selectedColors);

    if (newColors.has(color)) {
      // Don't allow removing if it would go below minimum
      if (newColors.size > MIN_COLORS_REQUIRED) {
        newColors.delete(color);
      }
    } else {
      newColors.add(color);
    }

    onChange(newColors);
  };

  const canDeselect = selectedColors.size > MIN_COLORS_REQUIRED;

  return (
    <div className="flex flex-col gap-4">
      <label className="text-sm font-medium text-gray-300 uppercase tracking-wide">
        Select Colors (min {MIN_COLORS_REQUIRED})
      </label>

      <div className="text-center text-sm text-gray-400">
        {selectedColors.size} {selectedColors.size === 1 ? 'color' : 'colors'} selected
      </div>

      <div className="flex gap-6 justify-center flex-wrap">
        {ALL_COLORS.map((color) => {
          const isSelected = selectedColors.has(color);
          const colorInfo = MTG_COLORS[color];
          const symbolData = manaSymbols[color];
          const isDisabledDeselect = isSelected && !canDeselect;

          return (
            <button
              key={color}
              type="button"
              onClick={() => toggleColor(color)}
              disabled={disabled || isDisabledDeselect}
              className={`
                relative group w-16 h-16 rounded-full transition-all duration-200
                focus:outline-none focus:ring-4 focus:ring-[#B8A279] focus:ring-offset-2 focus:ring-offset-[#1A1A1A]
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${isDisabledDeselect ? 'cursor-not-allowed' : ''}
              `}
              style={{
                backgroundColor: isSelected ? colorInfo.hex : '#2D2D2D',
                opacity: isSelected ? 1 : 0.85,
                boxShadow: isSelected
                  ? '0 0 0 4px #B8A279, 0 20px 25px -5px rgba(0, 0, 0, 0.8)'
                  : '0 0 0 2px #4A4A4A, 0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                transform: isSelected ? 'scale(1.1)' : 'scale(1)',
              }}
              aria-label={`${colorInfo.name} (${color})`}
              aria-pressed={isSelected}
              title={`${colorInfo.name} - ${isSelected ? 'Selected' : 'Click to select'}`}
            >
              {isLoadingSymbols ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {color}
                  </span>
                </div>
              ) : symbolData ? (
                <img
                  src={symbolData.svgUri}
                  alt={colorInfo.name}
                  className="w-full h-full p-2"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {color}
                  </span>
                </div>
              )}

              {/* Hover glow effect */}
              <div
                className={`
                  absolute inset-0 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-200 pointer-events-none
                  ${isSelected ? 'bg-white' : 'bg-[#B8A279]'}
                `}
                style={{
                  boxShadow: `0 0 20px ${isSelected ? colorInfo.hex : '#B8A279'}`,
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
