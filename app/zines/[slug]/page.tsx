'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { ZineEdition } from '@/types';

type PageFlipInstance = {
  destroy: () => void;
  flipNext: () => void;
  flipPrev: () => void;
  getPageCount: () => number;
  loadFromImages: (images: string[]) => void;
  on: (event: string, cb: (e: { data: number }) => void) => void;
};

export default function ZineReaderPage() {
  const params = useParams<{ slug: string }>();
  const [zine, setZine] = useState<ZineEdition | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageFlipRef = useRef<PageFlipInstance | null>(null);

  useEffect(() => {
    const fetchZine = async () => {
      try {
        const data = await apiClient.getZine(params.slug);
        setZine(data);
      } catch {
        setNotFoundError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchZine();
  }, [params.slug]);

  const pages = zine?.pages || [];
  const pagesKey = pages.join('|');

  useEffect(() => {
    if (!pages.length || !containerRef.current) return;

    let cancelled = false;

    const initBook = async () => {
      try {
        const mod = await import('page-flip/dist/js/page-flip.module.js');
        const PageFlip = (mod as {
          PageFlip: new (el: HTMLElement, settings: object) => PageFlipInstance;
        }).PageFlip;

        if (cancelled || !containerRef.current) return;

        if (pageFlipRef.current) {
          try {
            pageFlipRef.current.destroy();
          } catch {
            /* ignore */
          }
          pageFlipRef.current = null;
        }

        // destroy() removes the root node — always create a fresh child
        containerRef.current.innerHTML = '';
        const bookEl = document.createElement('div');
        containerRef.current.appendChild(bookEl);

        const pageFlip = new PageFlip(bookEl, {
          width: 400,
          height: 560,
          size: 'stretch',
          minWidth: 280,
          maxWidth: 900,
          minHeight: 400,
          maxHeight: 1200,
          showCover: true,
          usePortrait: true,
          mobileScrollSupport: true,
          maxShadowOpacity: 0.5,
          drawShadow: true,
          flippingTime: 800,
          autoSize: true,
          useMouseEvents: true,
          startPage: 0,
        });

        pageFlip.loadFromImages(pages);
        pageFlip.on('flip', (e) => {
          setCurrentPage(e.data);
        });

        if (cancelled) {
          try {
            pageFlip.destroy();
          } catch {
            /* ignore */
          }
          return;
        }

        pageFlipRef.current = pageFlip;
        setPageCount(pageFlip.getPageCount());
        setCurrentPage(0);
      } catch (err) {
        console.error('Erro ao iniciar PageFlip:', err);
      }
    };

    initBook();

    return () => {
      cancelled = true;
      if (pageFlipRef.current) {
        try {
          pageFlipRef.current.destroy();
        } catch {
          /* ignore */
        }
        pageFlipRef.current = null;
      }
    };
  }, [pagesKey, pages]);

  const flipPrev = () => {
    pageFlipRef.current?.flipPrev();
  };

  const flipNext = () => {
    pageFlipRef.current?.flipNext();
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
      ) : (
        <>
          <div className="max-w-5xl mx-auto px-2 md:px-6">
            <div
              ref={containerRef}
              className="mx-auto w-full zine-pageflip"
              style={{ maxWidth: 900, minHeight: 400 }}
            />
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
              {currentPage + 1} / {pageCount || pages.length}
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
