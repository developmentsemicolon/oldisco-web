'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image?: string;
  author?: {
    id: string;
    name: string;
    email: string;
  };
}

interface RelatedPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image?: string;
  date: string;
}

export default function BlogPostClient({ slug }: { slug: string }) {
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await apiClient.getBlogPost(slug);
        
        // Mapear dados do backend para o formato do frontend
        const mappedPost: BlogPost = {
          id: data.id,
          slug: data.slug,
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          date: data.date ? new Date(data.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          image: data.image || '/images/logo.png',
          author: data.author,
        };
        
        setPost(mappedPost);

        // Buscar posts relacionados (excluindo o atual)
        const allPosts = await apiClient.getBlogPosts();
        const related = allPosts
          .filter((p: any) => p.slug !== slug)
          .slice(0, 3)
          .map((p: any) => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            excerpt: p.excerpt,
            image: p.image || '/images/logo.png',
            date: p.date ? new Date(p.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          }));
        setRelatedPosts(related);
      } catch (error: any) {
        setError(error.message || 'Artigo não encontrado');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  // Adicionar structured data (Article + Breadcrumbs)
  useEffect(() => {
    if (!post) return;

    const siteUrl = 'https://oldisco.netlify.app';
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

    const articleStructuredData = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.excerpt || post.title,
      image: post.image || `${siteUrl}/images/logo.png`,
      datePublished: post.date,
      dateModified: post.date,
      author: {
        '@type': 'Person',
        name: post.author?.name || 'Oldisco',
        ...(post.author?.email && { email: post.author.email }),
      },
      publisher: {
        '@type': 'Organization',
        name: 'Oldisco',
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/images/logo.png`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': currentUrl,
      },
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
          name: 'Grimório',
          item: `${siteUrl}/blog`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: post.title,
          item: currentUrl,
        },
      ],
    };

    // Remover scripts anteriores se existirem
    const existingArticleScript = document.getElementById('article-structured-data');
    const existingBreadcrumbScript = document.getElementById('breadcrumb-structured-data');
    if (existingArticleScript) existingArticleScript.remove();
    if (existingBreadcrumbScript) existingBreadcrumbScript.remove();

    // Adicionar Article schema
    const articleScript = document.createElement('script');
    articleScript.id = 'article-structured-data';
    articleScript.type = 'application/ld+json';
    articleScript.text = JSON.stringify(articleStructuredData);
    document.head.appendChild(articleScript);

    // Adicionar Breadcrumb schema
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.id = 'breadcrumb-structured-data';
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.text = JSON.stringify(breadcrumbStructuredData);
    document.head.appendChild(breadcrumbScript);

    return () => {
      const articleScriptToRemove = document.getElementById('article-structured-data');
      const breadcrumbScriptToRemove = document.getElementById('breadcrumb-structured-data');
      if (articleScriptToRemove) articleScriptToRemove.remove();
      if (breadcrumbScriptToRemove) breadcrumbScriptToRemove.remove();
    };
  }, [post]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white font-mono">Carregando artigo...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-mono mb-4">{error || 'Artigo não encontrado'}</p>
          <Link href="/blog" className="text-white hover:text-red-600 transition-colors flex items-center gap-2 justify-center">
            <ArrowLeft size={18} />
            Voltar para o Grimório
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black pt-32 pb-40">
      {/* Botão Voltar */}
      <div className="max-w-4xl mx-auto px-6 mb-8">
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-red-600 transition-colors font-mono text-sm"
        >
          <ArrowLeft size={18} />
          Voltar ao Grimório
        </Link>
      </div>

      {/* Hero Section com Imagem */}
      {post.image && (
        <section className="relative h-[50vh] max-w-7xl mx-auto px-6 mb-12">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black z-10" />
            <Image 
              src={post.image} 
              alt={`${post.title} - Artigo do Grimório sobre black metal | Oldisco`}
              fill
              sizes="100vw"
              className="object-cover grayscale opacity-30 contrast-150"
              priority
            />
          </div>
        </section>
      )}

      {/* Conteúdo Principal */}
      <article className="max-w-4xl mx-auto px-6">
        {/* Cabeçalho do Artigo */}
        <header className="mb-12">
          <div className="flex items-center gap-4 text-red-600 font-mono text-[10px] font-black tracking-[0.4em] uppercase mb-6">
            <span className="h-[1px] w-12 bg-red-900/50"></span>
            GRIMÓRIO
            <span className="h-[1px] w-12 bg-red-900/50"></span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-metal text-white tracking-widest uppercase mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-zinc-400 font-mono text-sm">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{formatDate(post.date)}</span>
            </div>
            {post.author && (
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{post.author.name || post.author.email}</span>
              </div>
            )}
          </div>
        </header>

        {/* Conteúdo do Artigo */}
        <div 
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* Posts Relacionados */}
      {relatedPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mt-20">
          <div className="border-l-4 border-red-600 pl-6 mb-8">
            <h2 className="text-3xl font-metal text-white tracking-widest uppercase mb-2">
              Artigos <span className="text-red-600">Relacionados</span>
            </h2>
            <p className="text-zinc-500 font-mono text-[10px] tracking-widest">Mais conteúdo do Grimório</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                <div className="group bg-zinc-950 border border-zinc-900 rounded-sm overflow-hidden hover:border-red-600 transition-all">
                  {relatedPost.image && (
                    <div className="relative aspect-video overflow-hidden bg-zinc-900">
                      <Image
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover grayscale group-hover:grayscale-0 transition-all opacity-70 group-hover:opacity-100"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-metal text-lg text-white mb-2 group-hover:text-red-500 transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-zinc-500 font-mono text-[10px] line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

