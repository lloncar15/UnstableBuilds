'use client';

import React, { useEffect, useState } from 'react';
import type { ScryfallSet } from '@/types/scryfall';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export interface SetSelectorProps {
  selectedSets: string[];
  onChange: (setCodes: string[]) => void;
  disabled?: boolean;
}

export const SetSelector: React.FC<SetSelectorProps> = ({
  selectedSets,
  onChange,
  disabled = false,
}) => {
  const [sets, setSets] = useState<ScryfallSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSets = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/scryfall/sets');
        if (!response.ok) {
          throw new Error('Failed to fetch sets');
        }
        const data = await response.json();
        setSets(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load sets');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSets();
  }, []);

  const filteredSets = sets.filter((set) =>
    set.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSet = (setCode: string) => {
    if (selectedSets.includes(setCode)) {
      onChange(selectedSets.filter((s) => s !== setCode));
    } else {
      onChange([...selectedSets, setCode]);
    }
  };

  const selectAll = () => {
    onChange(filteredSets.map((set) => set.code));
  };

  const clearAll = () => {
    onChange([]);
    setSearchTerm('');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-300 uppercase tracking-wide">
          Select Sets
        </label>
        <div className="p-4 bg-[#2D2D2D] rounded-lg border border-[#4A4A4A]">
          <LoadingSpinner size="sm" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-300 uppercase tracking-wide">
          Select Sets
        </label>
        <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-300 uppercase tracking-wide">
          Select Sets ({selectedSets.length} selected)
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={selectAll}
            disabled={disabled}
            className="text-xs text-[#B8A279] hover:text-[#C9B389] transition-colors disabled:opacity-50"
          >
            Select All
          </button>
          <button
            type="button"
            onClick={clearAll}
            disabled={disabled}
            className="text-xs text-gray-400 hover:text-gray-300 transition-colors disabled:opacity-50"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search sets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={disabled}
          className="w-full px-4 py-2 bg-[#2D2D2D] border border-[#4A4A4A] rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#B8A279] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <div className="max-h-64 overflow-y-auto bg-[#2D2D2D] border border-[#4A4A4A] rounded-lg">
        {filteredSets.map((set) => (
          <label
            key={set.code}
            className={`
              flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors
              hover:bg-[#3D3D3D]
              ${selectedSets.includes(set.code) ? 'bg-[#B8A279]/10' : ''}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input
              type="checkbox"
              checked={selectedSets.includes(set.code)}
              onChange={() => toggleSet(set.code)}
              disabled={disabled}
              className="w-4 h-4 rounded border-[#4A4A4A] bg-[#1A1A1A] text-[#B8A279] focus:ring-2 focus:ring-[#B8A279] focus:ring-offset-0"
            />
            {/* Set Icon */}
            {set.icon_svg_uri && (
              <img
                src={set.icon_svg_uri}
                alt={`${set.name} icon`}
                className="w-5 h-5 flex-shrink-0"
              />
            )}
            <span className="text-sm text-gray-200 font-mono flex-1">
              {set.name} ({set.code.toUpperCase()})
            </span>
          </label>
        ))}
      </div>

      <p className="text-xs text-gray-500">
        {filteredSets.length} sets available
      </p>
    </div>
  );
};
