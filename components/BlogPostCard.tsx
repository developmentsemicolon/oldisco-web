'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar, ArrowRight } from 'lucide-react';
import { BlogPost } from '../types';
import Link from 'next/link';

interface BlogPostCardProps {
  post: BlogPost;
}

export const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <Link href={`/blog/${post.slug}`}>
      <div className="group relative bg-zinc-950 border border-zinc-900 rounded-sm red-glow-card overflow-hidden h-full flex flex-col cursor-pointer">
        {/* Imagem */}
        <div className="relative aspect-video overflow-hidden bg-zinc-900">
          <Image 
            src={post.image} 
            alt={`${post.title} - Artigo do Grimório | Oldisco`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-70 group-hover:opacity-100"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        </div>

        {/* Conteúdo */}
        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-center gap-2 text-[9px] font-mono text-zinc-500 mb-3">
            <Calendar size={12} />
            <span>{formatDate(post.date)}</span>
          </div>
          
          <h3 className="font-metal text-xl text-white tracking-wide mb-3 group-hover:text-red-500 transition-colors line-clamp-2">
            {post.title}
          </h3>
          
          <p className="text-zinc-500 font-mono text-[11px] leading-relaxed mb-4 flex-1 line-clamp-3">
            {post.excerpt}
          </p>
          
          <div className="flex items-center gap-2 text-red-600 text-[10px] font-black tracking-widest uppercase mt-auto">
            <span>LER MAIS</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
};

