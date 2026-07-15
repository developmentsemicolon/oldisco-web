import { Metadata } from 'next';
import ReleaseClient from './ReleaseClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function getRelease(slug: string) {
  try {
    const res = await fetch(`${API_URL}/releases/${slug}`, {
      next: { revalidate: 60 }, // Revalidar a cada 60 segundos
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('Erro ao buscar release:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const release = await getRelease((await params).slug);

  if (!release) {
    return {
      title: 'Lançamento não encontrado | Oldisco',
      description: 'O lançamento solicitado não foi encontrado.',
    };
  }

  const title = `${release.band} - ${release.album} | Oldisco - Lançamentos`;
  const description = release.description
    ? release.description.substring(0, 160).replace(/\s+\S*$/, '') + '...'
    : `${release.band} - ${release.album} (${release.genre}). Lançamento disponível na Oldisco.`;
  const image = release.image || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/images/logo.png`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${release.band} - ${release.album}`,
        },
      ],
      type: 'music.album',
      url: `${siteUrl}/releases/${release.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function ReleasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <ReleaseClient slug={(await params).slug} />;
}

