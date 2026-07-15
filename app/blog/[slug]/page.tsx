import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogPostClient from './BlogPostClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function getBlogPost(slug: string) {
  try {
    const res = await fetch(`${API_URL}/blog/${slug}`, {
      next: { revalidate: 60 }, // Revalidar a cada 60 segundos
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('Erro ao buscar blog post:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const post = await getBlogPost((await params).slug);

  if (!post) {
    return {
      title: 'Artigo não encontrado | Oldisco',
      description: 'O artigo solicitado não foi encontrado.',
    };
  }

  const title = `${post.title} | Oldisco - Grimório`;
  const description = post.excerpt
    ? post.excerpt.substring(0, 160).replace(/\s+\S*$/, '') + '...'
    : `Artigo do Grimório da Oldisco sobre ${post.title}`;
  const image = post.image || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/images/logo.png`;
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
          alt: post.title,
        },
      ],
      type: 'article',
      url: `${siteUrl}/blog/${post.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <BlogPostClient slug={(await params).slug} />;
}

