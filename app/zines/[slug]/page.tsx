'use client';

import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { ZineEdition } from '@/types';

const HTMLFlipBook = dynamic(() => import('react-pageflip'), { ssr: false });

const Page = forwardRef<HTMLDivElement, { src: string; number: number }>(
  ({ src, number }, ref) => (
    <div ref={ref} className="bg-zinc-950 overflow-hidden">
      <img
        src={src}
        alt={`Página ${number}`}
        className="w-full h-full object-contain pointer-events-none select-none"
        draggable={false}
      />
    </div>
  ),
);
Page.displayName = 'ZinePage';

export default function ZineReaderPage() {
  const params = useParams<{ slug: string }>();
  const [zine, setZine] = useState<ZineEdition | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [mounted, setMounted] = useState(false);
  const flipBookRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const flipPrev = () => {
    flipBookRef.current?.pageFlip()?.flipPrev();
  };

  const flipNext = () => {
    flipBookRef.current?.pageFlip()?.flipNext();
  };

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

  const pages = zine.pages || [];
  const totalPages = pages.length;

  return (
    <div className="bg-black pt-28 pb-40 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <Link
          href="/zines"
          className="inline-flex items-center gap-2 text-red-600 hover:text-red-500 transition-colors font-mono text-sm mb-6"
        >
          <ArrowLeft size={16} />
          Voltar para Zines
        </Link>
        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono text-red-600 font-black tracking-[0.3em] uppercase">
            Edição {zine.editionNumber}
          </span>
          <h1 className="text-3xl md:text-5xl font-metal text-white tracking-widest uppercase">
            {zine.title}
          </h1>
        </div>
      </div>

      {pages.length === 0 ? (
        <div className="text-center text-zinc-500 font-mono text-sm py-20">
          Esta edição não tem páginas.
        </div>
      ) : !mounted ? (
        <div className="text-center text-zinc-500 font-mono text-sm py-20">Preparando leitor...</div>
      ) : (
        <>
          <div className="max-w-5xl mx-auto px-2 md:px-6">
            {/* @ts-expect-error react-pageflip children typing */}
            <HTMLFlipBook
              width={400}
              height={560}
              size="stretch"
              minWidth={280}
              maxWidth={900}
              minHeight={400}
              maxHeight={1200}
              showCover={true}
              usePortrait={true}
              mobileScrollSupport={true}
              maxShadowOpacity={0.5}
              drawShadow={true}
              flippingTime={800}
              className="mx-auto shadow-2xl"
              startPage={0}
              autoSize={true}
              clickEventForward={true}
              useMouseEvents={true}
              swipeDistance={30}
              showPageCorners={true}
              disableFlipByClick={false}
              ref={flipBookRef}
              onFlip={(e: any) => setCurrentPage(e.data)}
            >
              {pages.map((url, i) => (
                <Page key={`${url}-${i}`} src={url} number={i + 1} />
              ))}
            </HTMLFlipBook>
          </div>

          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              type="button"
              onClick={flipPrev}
              className="flex items-center gap-2 px-4 py-2 border border-zinc-800 text-zinc-400 hover:border-red-600 hover:text-red-600 transition-colors font-mono text-xs uppercase tracking-widest"
            >
              <ChevronLeft size={16} /> Anterior
            </button>
            <span className="font-mono text-zinc-500 text-sm">
              {currentPage + 1} / {totalPages}
            </span>
            <button
              type="button"
              onClick={flipNext}
              className="flex items-center gap-2 px-4 py-2 border border-zinc-800 text-zinc-400 hover:border-red-600 hover:text-red-600 transition-colors font-mono text-xs uppercase tracking-widest"
            >
              Próxima <ChevronRight size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
