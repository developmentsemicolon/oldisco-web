'use client';

import React, { useEffect, useState } from 'react';
import { ReleaseCard } from '@/components/ReleaseCard';
import { apiClient } from '@/lib/api-client';

interface Release {
  id: string;
  slug: string;
  title: string;
  band: string;
  album: string;
  genre: string;
  releaseDate: string;
  description?: string;
  image?: string;
  status?: string;
}

export default function ReleasesListClient() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const data = await apiClient.getReleases();
        const mappedReleases: Release[] = data.map((item: any) => ({
          id: item.id,
          slug: item.slug,
          title: item.title,
          band: item.band,
          album: item.album,
          genre: item.genre,
          releaseDate: item.releaseDate ? new Date(item.releaseDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          description: item.description || undefined,
          image: item.image || '/images/logo.png',
          status: item.status || 'ANNOUNCED',
        }));
        setReleases(mappedReleases);
      } catch (error) {
        console.error('Erro ao buscar lançamentos:', error);
        setReleases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReleases();
  }, []);

  return (
    <div className="bg-black pt-32 pb-40">
      {/* Hero Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto text-center mb-16">
        <div className="space-y-6">
          <h1 className="text-6xl md:text-7xl font-metal text-white tracking-widest uppercase">
            INVOCAÇÕES FUTURAS
          </h1>
          <div className="flex items-center justify-center gap-4 text-red-600 font-mono text-[10px] font-black tracking-[0.4em] uppercase">
            <span className="h-[1px] w-12 bg-red-900/50"></span>
            ANUNCIAMENTOS E RITUAIS
            <span className="h-[1px] w-12 bg-red-900/50"></span>
          </div>
          <p className="text-zinc-400 text-sm md:text-base font-mono leading-relaxed opacity-80 max-w-2xl mx-auto uppercase tracking-tighter">
            Descubra os próximos lançamentos do underground metal, álbuns anunciados e datas de lançamento.
          </p>
        </div>
      </section>

      {/* Grid de Lançamentos */}
      <section className="px-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-20">
            <p className="text-zinc-500 font-mono text-sm">Carregando lançamentos...</p>
          </div>
        ) : releases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {releases.map(release => (
              <ReleaseCard key={release.id} release={release} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-zinc-500 font-mono text-sm">Nenhum lançamento anunciado ainda.</p>
          </div>
        )}
      </section>
    </div>
  );
}

