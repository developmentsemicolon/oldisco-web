'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { ZineEdition } from '@/types';

export default function ZineReaderPage() {
  const params = useParams<{ slug: string }>();
  const [zine, setZine] = useState<ZineEdition | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);

  useEffect(() => {
    const fetchZine = async () => {
      try {
        const data = await apiClient.getZine(params.slug);
        setZine(data);
      } catch (error) {
        setNotFoundError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchZine();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="bg-black pt-32 pb-40 min-h-screen flex items-center justify-center">
        <div className="text-zinc-500 font-mono text-sm">Carregando edição...</div>
      </div>
    );
  }

  if (notFoundError || !zine) {
    return (
      <div className="bg-black pt-32 pb-40 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-600 font-mono">Edição não encontrada</p>
          <Link href="/zines" className="text-zinc-400 hover:text-red-600 font-mono text-sm">
            ← Voltar para Zines
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black pt-28 pb-40 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 mb-8">
        <Link
          href="/zines"
          className="inline-flex items-center gap-2 text-red-600 hover:text-red-500 transition-colors font-mono text-sm mb-6"
        >
          <ArrowLeft size={16} />
          Voltar para Zines
        </Link>
        <div className="text-center space-y-2 mb-12">
          <span className="text-[10px] font-mono text-red-600 font-black tracking-[0.3em] uppercase">
            Edição {zine.editionNumber}
          </span>
          <h1 className="text-3xl md:text-5xl font-metal text-white tracking-widest uppercase">
            {zine.title}
          </h1>
          {zine.description && (
            <p className="text-zinc-400 font-mono text-sm max-w-2xl mx-auto mt-4">
              {zine.description}
            </p>
          )}
        </div>

        {zine.coverImage && (
          <div className="mb-12 flex justify-center">
            <img
              src={zine.coverImage}
              alt={zine.title}
              className="max-h-[420px] w-auto object-contain border border-zinc-800"
            />
          </div>
        )}

        {!zine.content ? (
          <div className="text-center text-zinc-500 font-mono text-sm py-20">
            Esta edição ainda não tem conteúdo.
          </div>
        ) : (
          <article
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: zine.content }}
          />
        )}
      </div>
    </div>
  );
}
