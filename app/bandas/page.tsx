'use client';

import React from 'react';
import { MOCK_BANDS } from '@/constants';
import { BandCard } from '@/components/BandCard';

export default function BandasPage() {
  return (
    <div className="bg-black pt-32 pb-40">
      {/* Hero Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto text-center mb-16">
        <div className="space-y-6">
          <h1 className="text-6xl md:text-7xl font-metal text-white tracking-widest uppercase">
            BANDAS
          </h1>
          <div className="flex items-center justify-center gap-4 text-red-600 font-mono text-[10px] font-black tracking-[0.4em] uppercase">
            <span className="h-[1px] w-12 bg-red-900/50"></span>
            ARSENAL DO UNDERGROUND
            <span className="h-[1px] w-12 bg-red-900/50"></span>
          </div>
          <p className="text-zinc-400 text-sm md:text-base font-mono leading-relaxed opacity-80 max-w-2xl mx-auto uppercase tracking-tighter">
            Explore as bandas que fazem parte do nosso catálogo. Cada uma representa uma faceta única do black metal.
          </p>
        </div>
      </section>

      {/* Grid de Bandas */}
      <section className="px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_BANDS.map(band => (
            <BandCard key={band.id} band={band} />
          ))}
        </div>
      </section>
    </div>
  );
}

