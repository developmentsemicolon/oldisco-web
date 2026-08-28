'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { ZineEdition } from '@/types';

export default function ZinesPage() {
  const [zines, setZines] = useState<ZineEdition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchZines = async () => {
      try {
        const data = await apiClient.getZines(true);
        setZines(data);
      } catch (error) {
        console.error('Erro ao buscar zines:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchZines();
  }, []);

  return (
    <div className="bg-black pt-32 pb-40 min-h-screen">
      <section className="px-6 py-20 max-w-7xl mx-auto text-center mb-16">
        <div className="space-y-6">
          <h1 className="text-6xl md:text-7xl font-metal text-white tracking-widest uppercase">
            ZINES
          </h1>
          <div className="flex items-center justify-center gap-4 text-red-600 font-mono text-[10px] font-black tracking-[0.4em] uppercase">
            <span className="h-[1px] w-12 bg-red-900/50"></span>
            EDIÇÕES IMPRESSAS DO UNDERGROUND
            <span className="h-[1px] w-12 bg-red-900/50"></span>
          </div>
          <p className="text-zinc-400 text-sm md:text-base font-mono leading-relaxed opacity-80 max-w-2xl mx-auto uppercase tracking-tighter">
            Leia as edições da zine Oldisco. Clique em uma capa para abrir.
          </p>
        </div>
      </section>

      <section className="px-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center text-zinc-500 font-mono text-sm py-20">Carregando edições...</div>
        ) : zines.length === 0 ? (
          <div className="text-center text-zinc-500 font-mono text-sm py-20">Nenhuma edição publicada ainda.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {zines.map((zine) => (
              <Link
                key={zine.id}
                href={`/zines/${zine.slug}`}
                className="group bg-zinc-950 border border-zinc-900 p-4 rounded-sm red-glow-card hover:border-red-600 transition-all flex flex-col"
              >
                <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-zinc-900">
                  {zine.coverImage ? (
                    <img
                      src={zine.coverImage}
                      alt={zine.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-80 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="text-zinc-800" size={48} />
                    </div>
                  )}
                </div>
                <span className="text-[9px] font-mono text-red-600 font-bold border border-red-900/30 px-1.5 py-0.5 uppercase self-start mb-2">
                  Edição {zine.editionNumber}
                </span>
                <h3 className="font-metal text-2xl text-white tracking-wide group-hover:text-red-500 transition-colors">
                  {zine.title}
                </h3>
                {zine.description && (
                  <p className="text-zinc-500 font-mono text-[11px] mt-2 line-clamp-2">
                    {zine.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
