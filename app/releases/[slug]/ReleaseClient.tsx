'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, Calendar } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
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

export default function ReleaseClient({ slug }: { slug: string }) {
  const [release, setRelease] = useState<Release | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelease = async () => {
      try {
        const data = await apiClient.getRelease(slug);
        setRelease({
          id: data.id,
          slug: data.slug,
          title: data.title,
          band: data.band,
          album: data.album,
          genre: data.genre,
          releaseDate: data.releaseDate ? new Date(data.releaseDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          description: data.description || undefined,
          image: data.image || '/images/logo.png',
          status: data.status || 'ANNOUNCED',
        });
      } catch (err: any) {
        setError(err.message || 'Lançamento não encontrado');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchRelease();
    }
  }, [slug]);

  // Adicionar structured data (MusicAlbum + Breadcrumbs)
  useEffect(() => {
    if (!release) return;

    const siteUrl = 'https://oldisco.netlify.app';
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

    const musicAlbumStructuredData = {
      '@context': 'https://schema.org',
      '@type': 'MusicAlbum',
      name: release.album,
      byArtist: {
        '@type': 'MusicGroup',
        name: release.band,
      },
      genre: release.genre,
      image: release.image || `${siteUrl}/images/logo.png`,
      datePublished: release.releaseDate,
      description: release.description || `${release.band} - ${release.album} (${release.genre})`,
      ...(release.status === 'RELEASED' && {
        offers: {
          '@type': 'Offer',
          availability: 'https://schema.org/InStock',
          url: `${siteUrl}/catalog`,
        },
      }),
    };

    const breadcrumbStructuredData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: siteUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Próximas Invocações',
          item: `${siteUrl}/releases`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: release.title,
          item: currentUrl,
        },
      ],
    };

    // Remover scripts anteriores se existirem
    const existingAlbumScript = document.getElementById('music-album-structured-data');
    const existingBreadcrumbScript = document.getElementById('breadcrumb-structured-data');
    if (existingAlbumScript) existingAlbumScript.remove();
    if (existingBreadcrumbScript) existingBreadcrumbScript.remove();

    // Adicionar MusicAlbum schema
    const albumScript = document.createElement('script');
    albumScript.id = 'music-album-structured-data';
    albumScript.type = 'application/ld+json';
    albumScript.text = JSON.stringify(musicAlbumStructuredData);
    document.head.appendChild(albumScript);

    // Adicionar Breadcrumb schema
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.id = 'breadcrumb-structured-data';
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.text = JSON.stringify(breadcrumbStructuredData);
    document.head.appendChild(breadcrumbScript);

    return () => {
      const albumScriptToRemove = document.getElementById('music-album-structured-data');
      const breadcrumbScriptToRemove = document.getElementById('breadcrumb-structured-data');
      if (albumScriptToRemove) albumScriptToRemove.remove();
      if (breadcrumbScriptToRemove) breadcrumbScriptToRemove.remove();
    };
  }, [release]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'ANNOUNCED':
        return <span className="text-sm px-3 py-1 bg-zinc-800 text-zinc-400 border border-zinc-700 rounded font-mono uppercase">Anunciado</span>;
      case 'COMING_SOON':
        return <span className="text-sm px-3 py-1 bg-red-950 text-red-400 border border-red-900 rounded font-mono uppercase">Em Breve</span>;
      case 'RELEASED':
        return <span className="text-sm px-3 py-1 bg-green-950 text-green-400 border border-green-900 rounded font-mono uppercase">Lançado</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-32 pb-40">
        <div className="text-white font-mono">Carregando lançamento...</div>
      </div>
    );
  }

  if (error || !release) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-32 pb-40">
        <div className="text-center">
          <p className="text-red-600 font-mono mb-4">{error || 'Lançamento não encontrado'}</p>
          <Link href="/releases" className="text-white hover:text-red-600 transition-colors flex items-center gap-2 justify-center">
            <ArrowLeft size={18} />
            Voltar para Lançamentos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black pt-32 pb-40 min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex flex-col items-center justify-center px-6 text-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black z-10" />
          <Image
            src={release.image}
            alt={`${release.band} - ${release.album} - Lançamento de ${release.genre} | Oldisco`}
            fill
            sizes="100vw"
            className="object-cover grayscale opacity-20 contrast-150"
            priority
          />
        </div>

        <div className="relative z-10 w-full max-w-4xl space-y-6">
          <Link
            href="/releases"
            className="inline-flex items-center gap-2 text-red-600 hover:text-red-500 transition-colors font-mono text-sm mb-4"
          >
            <ArrowLeft size={18} />
            Voltar aos Lançamentos
          </Link>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            {getStatusBadge(release.status)}
          </div>

          <h1 className="text-5xl md:text-7xl font-metal text-white tracking-widest uppercase leading-tight">
            {release.title}
          </h1>
          
          <div className="space-y-2">
            <p className="text-red-600 font-mono text-lg font-bold uppercase tracking-wider">
              {release.band}
            </p>
            <p className="text-zinc-400 font-mono text-base uppercase tracking-tight">
              {release.album}
            </p>
            <p className="text-zinc-600 font-mono text-sm uppercase">
              {release.genre}
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 text-red-600 font-mono text-[10px] font-black tracking-[0.4em] uppercase">
            <span className="h-[1px] w-12 bg-red-900/50"></span>
            <Calendar size={12} className="inline-block mr-2" />
            {formatDate(release.releaseDate)}
            <span className="h-[1px] w-12 bg-red-900/50"></span>
          </div>
        </div>
      </section>

      {/* Descrição */}
      {release.description && (
        <section className="px-6 max-w-4xl mx-auto mt-16">
          <div
            className="blog-content text-zinc-300 font-mono text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: release.description }}
          />
        </section>
      )}
    </div>
  );
}

