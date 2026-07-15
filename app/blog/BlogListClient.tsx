'use client';

import React, { useEffect, useState } from 'react';
import { BlogPostCard } from '@/components/BlogPostCard';
import { apiClient } from '@/lib/api-client';
import { BlogPost } from '@/types';

export default function BlogListClient() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await apiClient.getBlogPosts();
        // Mapear dados do backend para o formato do frontend
        const mappedPosts: BlogPost[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          excerpt: item.excerpt,
          content: item.content,
          date: item.date ? new Date(item.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          image: item.image || '/images/logo.png',
          slug: item.slug,
        }));
        setPosts(mappedPosts);
      } catch (error) {
        console.error('Erro ao buscar artigos:', error);
        // Em caso de erro, manter array vazio
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="bg-black pt-32 pb-40">
      {/* Hero Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto text-center mb-16">
        <div className="space-y-6">
          <h1 className="text-6xl md:text-7xl font-metal text-white tracking-widest uppercase">
            GRIMÓRIO
          </h1>
          <div className="flex items-center justify-center gap-4 text-red-600 font-mono text-[10px] font-black tracking-[0.4em] uppercase">
            <span className="h-[1px] w-12 bg-red-900/50"></span>
            CONHECIMENTO E RITUAL
            <span className="h-[1px] w-12 bg-red-900/50"></span>
          </div>
          <p className="text-zinc-400 text-sm md:text-base font-mono leading-relaxed opacity-80 max-w-2xl mx-auto uppercase tracking-tighter">
            Artigos, resenhas e reflexões sobre o underground metal e a cena extrema.
          </p>
        </div>
      </section>

      {/* Grid de Posts */}
      <section className="px-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-20">
            <p className="text-zinc-500 font-mono text-sm">Carregando artigos...</p>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-zinc-500 font-mono text-sm">Nenhum artigo publicado ainda.</p>
          </div>
        )}
      </section>
    </div>
  );
}

