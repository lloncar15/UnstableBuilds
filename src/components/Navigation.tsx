'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export const Navigation: React.FC = () => {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home' },
    { href: '/draft-signpost', label: 'Draft Signpost' },
  ];

  return (
    <nav className="bg-[#2D2D2D] border-b border-[#4A4A4A]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link
            href="/"
            className="text-xl font-bold text-gray-100 hover:text-[#B8A279] transition-colors"
          >
            MTG Deck Builder
          </Link>

          {/* Navigation Links */}
          <div className="flex gap-6">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? 'bg-[#B8A279]/20 text-[#B8A279] border-b-2 border-[#B8A279]'
                        : 'text-gray-300 hover:text-[#B8A279] hover:bg-[#3D3D3D]'
                    }
                  `}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
