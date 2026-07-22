'use client';

import React from 'react';
import { Music } from 'lucide-react';
import { Band } from '../types';
import Link from 'next/link';

interface BandCardProps {
  band: Band;
}

function stripHtml(html?: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export const BandCard: React.FC<BandCardProps> = ({ band }) => {
  return (
    <div className="group relative bg-zinc-950 border border-zinc-900 p-4 rounded-sm red-glow-card flex flex-col h-full">
      {/* Logo da Banda */}
      <div className="relative aspect-[4/3] overflow-hidden mb-4 bg-zinc-900">
        {band.logo ? (
          <img
            src={band.logo}
            alt={band.name}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-70 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Music className="text-zinc-800" size={48} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[9px] font-mono text-red-600 font-bold border border-red-900/30 px-1.5 py-0.5 uppercase">
            {band.genre}
          </span>
        </div>

        <h4 className="font-metal text-2xl text-white tracking-wide mb-2 group-hover:text-red-500 transition-colors">
          {band.name}
        </h4>

        <p className="text-zinc-500 font-mono text-[11px] mb-5 line-clamp-3 flex-1">
          {stripHtml(band.description)}
        </p>

        <div className="mt-auto">
          <Link
            href={`/bandas/${band.slug}`}
            className="w-full py-3 text-[10px] font-black tracking-[0.2em] flex items-center justify-center gap-2 transition-all rounded-sm bg-red-700 text-white hover:bg-red-600 active:scale-95"
          >
            <Music size={14} /> VER BANDA
          </Link>
        </div>
      </div>
    </div>
  );
};
