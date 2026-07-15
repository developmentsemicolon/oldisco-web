import { Metadata } from 'next';
import ProductClient from './ProductClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function getProduct(id: string) {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      next: { revalidate: 60 }, // Revalidar a cada 60 segundos
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const product = await getProduct((await params).id);

  if (!product) {
    return {
      title: 'Produto não encontrado | Oldisco',
      description: 'O produto solicitado não foi encontrado.',
    };
  }

  const title = `${product.band} - ${product.album} | Oldisco - Selo`;
  const description = product.description
    ? product.description.substring(0, 160).replace(/\s+\S*$/, '') + '...'
    : `${product.band} - ${product.album} (${product.genre}). CD disponível na Oldisco por R$ ${product.price.toFixed(2)}.`;
  const image = (product.images && product.images.length > 0)
    ? product.images[0]
    : `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/images/logo.png`;
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
          alt: `${product.band} - ${product.album}`,
        },
      ],
      type: 'website',
      url: `${siteUrl}/products/${product.id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <ProductClient id={(await params).id} />;
}

