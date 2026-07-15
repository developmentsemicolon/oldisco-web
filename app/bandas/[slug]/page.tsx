'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import { ExternalLink, ArrowLeft, Music } from 'lucide-react';
import { MOCK_BANDS } from '@/constants';
import { MOCK_PRODUCTS } from '@/constants';
import { ProductCard } from '@/components/ProductCard';
import { useCart } from '@/lib/cart-context';
import Link from 'next/link';

interface BandPageProps {
  params: {
    slug: string;
  };
}

export default function BandPage({ params }: BandPageProps) {
  const { addItem } = useCart();
  const band = MOCK_BANDS.find(b => b.slug === params.slug);

  if (!band) {
    notFound();
  }

  const bandProducts = MOCK_PRODUCTS.filter(p => band.discography.includes(p.id));

  return (
    <div className="bg-black pt-32 pb-40">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center px-6">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black z-10" />
          <img 
            src={band.image} 
            className="w-full h-full object-cover grayscale opacity-20 contrast-150"
            alt={band.name}
          />
        </div>

        <div className="relative z-10 w-full max-w-4xl text-center space-y-8">
          <div className="mb-8">
            <span className="text-[10px] font-mono text-red-600 font-black tracking-[0.4em] uppercase border border-red-900/30 px-3 py-1 inline-block">
              {band.genre}
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-metal text-white tracking-widest uppercase">
            {band.name}
          </h1>
          
          <div className="flex items-center justify-center gap-4 text-red-600 font-mono text-[10px] font-black tracking-[0.4em] uppercase">
            <span className="h-[1px] w-12 bg-red-900/50"></span>
            BIOGRAFIA
            <span className="h-[1px] w-12 bg-red-900/50"></span>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <section className="px-6 max-w-4xl mx-auto mt-16 space-y-16">
        {/* Biografia */}
        <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-sm">
          <p className="text-zinc-300 font-mono text-sm leading-relaxed">
            {band.bio}
          </p>
        </div>

        {/* Link para Site */}
        <div className="flex justify-center">
          <a 
            href={band.website}
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-4 bg-red-600 text-white font-black tracking-[0.3em] text-[11px] flex items-center gap-3 hover:bg-red-500 transition-all uppercase shadow-2xl shadow-red-900/20"
          >
            <ExternalLink size={16} /> VISITAR SITE OFICIAL
          </a>
        </div>

        {/* Discografia */}
        {bandProducts.length > 0 && (
          <div className="mt-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 border-l-4 border-red-600 pl-6">
              <div>
                <h2 className="text-4xl font-metal text-white tracking-widest uppercase flex items-center gap-3">
                  <Music className="text-red-600" size={32} />
                  Discografia
                </h2>
                <p className="text-zinc-500 font-mono text-[10px] tracking-widest mt-1">
                  Releases disponíveis no selo
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {bandProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={addItem}
                  onViewDetails={() => {}}
                />
              ))}
            </div>
          </div>
        )}

        {/* Botão Voltar */}
        <div className="flex justify-center pt-8">
          <Link 
            href="/bandas"
            className="px-8 py-3 border border-zinc-800 text-zinc-500 font-black tracking-widest text-[10px] flex items-center gap-2 hover:border-red-600 hover:text-red-600 transition-all uppercase"
          >
            <ArrowLeft size={14} /> VOLTAR PARA BANDAS
          </Link>
        </div>
      </section>
    </div>
  );
}

