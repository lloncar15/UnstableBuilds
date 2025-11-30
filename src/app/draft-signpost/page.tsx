import type { Metadata } from 'next';
import { SignpostForm } from '@/components/draft-signpost/SignpostForm';

export const metadata: Metadata = {
  title: 'Draft Signpost | MTG Deck Builder',
  description:
    'Find draft archetype signpost cards from any Magic: The Gathering set. Select colors and discover key cards that define your draft strategy.',
};

export default function DraftSignpostPage() {
  return (
    <main className="min-h-screen bg-[#1A1A1A] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-100 mb-4">
            Draft Signpost
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Discover the key cards that define draft archetypes in any Magic set.
            Select a set and your colors to find signpost cards that signal what's open at the table.
          </p>
        </header>

        {/* Main Form */}
        <SignpostForm />

        {/* Footer Info */}
        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>
            Data provided by{' '}
            <a
              href="https://scryfall.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#B8A279] hover:text-[#C9B389] transition-colors"
            >
              Scryfall
            </a>
          </p>
          <p className="mt-2">
            Magic: The Gathering is © Wizards of the Coast
          </p>
        </footer>
      </div>
    </main>
  );
}
