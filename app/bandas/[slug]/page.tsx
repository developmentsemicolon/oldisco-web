'use client';

import React, { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { Band } from '@/types';
import Link from 'next/link';

export default function BandPage() {
  const params = useParams<{ slug: string }>();
  const [band, setBand] = useState<Band | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);

  useEffect(() => {
    const fetchBand = async () => {
      try {
        const data = await apiClient.getBand(params.slug);
        setBand(data);
      } catch (error) {
        setNotFoundError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBand();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="bg-black pt-32 pb-40 min-h-screen flex items-center justify-center">
        <div className="text-zinc-500 font-mono text-sm">Carregando...</div>
      </div>
    );
  }

  if (notFoundError || !band) {
    notFound();
  }

  return (
    <div className="bg-black pt-32 pb-40">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center px-6">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black z-10" />
          {band.logo && (
            <img
              src={band.logo}
              className="w-full h-full object-cover grayscale opacity-20 contrast-150"
              alt={band.name}
            />
          )}
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
        {band.description && (
          <div
            className="bg-zinc-950 border border-zinc-900 p-8 rounded-sm blog-content text-zinc-300 font-mono text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: band.description }}
          />
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
