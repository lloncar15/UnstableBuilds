import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-[#1A1A1A]">
      <div className="max-w-4xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 text-gray-100">
            MTG Deck Builder
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Challenge yourself with creative deck building tools for Magic: The Gathering
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Draft Signpost Card */}
          <Link
            href="/draft-signpost"
            className="group p-8 bg-[#2D2D2D] border-2 border-[#4A4A4A] rounded-xl hover:border-[#B8A279] transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">🎴</div>
              <div>
                <h2 className="text-2xl font-bold mb-2 text-gray-100 group-hover:text-[#B8A279] transition-colors">
                  Draft Signpost
                </h2>
                <p className="text-gray-400">
                  Find key cards that define draft archetypes in any Magic set. Select colors and discover signpost cards.
                </p>
              </div>
            </div>
          </Link>

          {/* Placeholder for future features */}
          <div className="p-8 bg-[#2D2D2D] border-2 border-dashed border-[#4A4A4A] rounded-xl opacity-50">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🔮</div>
              <div>
                <h2 className="text-2xl font-bold mb-2 text-gray-100">
                  More Tools Coming Soon
                </h2>
                <p className="text-gray-400">
                  Additional deck building challenges and tools will be added here.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500">
          <p>
            Built with{' '}
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#B8A279] hover:text-[#C9B389]"
            >
              Next.js
            </a>
            {' '}and powered by{' '}
            <a
              href="https://scryfall.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#B8A279] hover:text-[#C9B389]"
            >
              Scryfall API
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
