'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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

interface ReleaseCardProps {
  release: Release;
}

export const ReleaseCard: React.FC<ReleaseCardProps> = ({ release }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const stripHtml = (html: string) => {
    if (!html) return '';
    // Remove tags HTML usando regex
    return html
      .replace(/<[^>]*>/g, '') // Remove todas as tags HTML
      .replace(/&nbsp;/g, ' ') // Substitui &nbsp; por espaço
      .replace(/&amp;/g, '&') // Decodifica &amp;
      .replace(/&lt;/g, '<') // Decodifica &lt;
      .replace(/&gt;/g, '>') // Decodifica &gt;
      .replace(/&quot;/g, '"') // Decodifica &quot;
      .replace(/&#39;/g, "'") // Decodifica &#39;
      .trim();
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'ANNOUNCED':
        return <span className="text-xs px-2 py-1 bg-zinc-800 text-zinc-400 border border-zinc-700 rounded font-mono uppercase">Anunciado</span>;
      case 'COMING_SOON':
        return <span className="text-xs px-2 py-1 bg-red-950 text-red-400 border border-red-900 rounded font-mono uppercase">Em Breve</span>;
      case 'RELEASED':
        return <span className="text-xs px-2 py-1 bg-green-950 text-green-400 border border-green-900 rounded font-mono uppercase">Lançado</span>;
      default:
        return null;
    }
  };

  return (
    <Link href={`/releases/${release.slug}`}>
      <div className="group relative bg-zinc-950 border border-zinc-900 rounded-sm red-glow-card overflow-hidden h-full flex flex-col cursor-pointer">
        {/* Imagem */}
        <div className="relative aspect-video overflow-hidden bg-zinc-900">
          <Image 
            src={release.image || '/images/logo.png'} 
            alt={`${release.band} - ${release.album} - Lançamento de ${release.genre} | Oldisco`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-70 group-hover:opacity-100"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          <div className="absolute top-4 right-4">
            {getStatusBadge(release.status)}
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-center gap-2 text-[9px] font-mono text-zinc-500 mb-3">
            <Calendar size={12} />
            <span>{formatDate(release.releaseDate)}</span>
          </div>
          
          <h3 className="font-metal text-xl text-white tracking-wide mb-2 group-hover:text-red-500 transition-colors line-clamp-2">
            {release.title}
          </h3>

          <div className="mb-2">
            <p className="text-red-600 font-mono text-xs font-bold uppercase tracking-wider mb-1">
              {release.band}
            </p>
            <p className="text-zinc-400 font-mono text-xs uppercase tracking-tight">
              {release.album}
            </p>
            <p className="text-zinc-600 font-mono text-[10px] uppercase mt-1">
              {release.genre}
            </p>
          </div>
          
          {release.description && (
            <p className="text-zinc-500 font-mono text-[11px] leading-relaxed mb-4 flex-1 line-clamp-2">
              {stripHtml(release.description)}
            </p>
          )}
          
          <div className="flex items-center gap-2 text-red-600 text-[10px] font-black tracking-widest uppercase mt-auto">
            <span>VER DETALHES</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
};

