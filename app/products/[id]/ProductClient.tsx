'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, ShoppingCart, ListMusic } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useCart } from '@/lib/cart-context';
import Link from 'next/link';
import { Product, Genre } from '@/types';

export default function ProductClient({ id }: { id: string }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [productData, setProductData] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await apiClient.getProduct(id);
        
        // Guardar dados completos do backend
        setProductData(data);
        
        // Mapear dados do backend para o formato do frontend
        const mappedProduct: Product = {
          id: data.id,
          artist: data.band,
          album: data.album,
          genre: data.genre as Genre,
          price: data.price,
          image: data.images && data.images.length > 0 ? data.images[0] : '/images/logo.png',
          stock: data.stock || 0,
          description: data.description || '',
          tracklist: data.tracklist 
            ? (data.tracklist.sideA || []).concat(data.tracklist.sideB || [])
            : [],
        };
        
        setProduct(mappedProduct);

        // Buscar produtos relacionados (mesmo gênero ou artista, excluindo o atual)
        const allProducts = await apiClient.getProducts();
        const related = allProducts
          .filter((p: any) => p.id !== id && (p.genre === data.genre || p.band === data.band))
          .slice(0, 4)
          .map((p: any) => ({
            id: p.id,
            artist: p.band,
            album: p.album,
            genre: p.genre as Genre,
            price: p.price,
            image: p.images && p.images.length > 0 ? p.images[0] : '/images/logo.png',
            stock: p.stock || 0,
            description: p.description || '',
            tracklist: p.tracklist 
              ? (p.tracklist.sideA || []).concat(p.tracklist.sideB || [])
              : [],
          }));
        setRelatedProducts(related);
      } catch (error: any) {
        setError(error.message || 'Produto não encontrado');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Adicionar structured data (JSON-LD) para SEO
  useEffect(() => {
    if (!product || !productData) return;

    const siteUrl = 'https://oldisco.netlify.app';
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

    const productStructuredData = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: `${product.artist} - ${product.album}`,
      description: product.description || `${product.artist} - ${product.album} (${product.genre}). CD de metal extremo disponível na Oldisco.`,
      image: productData.images && productData.images.length > 0 ? productData.images : [product.image],
      brand: {
        '@type': 'Brand',
        name: 'Oldisco',
      },
      category: product.genre,
      sku: product.id,
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'BRL',
        availability: product.stock > 0 
          ? 'https://schema.org/InStock' 
          : 'https://schema.org/OutOfStock',
        url: currentUrl,
        seller: {
          '@type': 'Organization',
          name: 'Oldisco',
        },
      },
      ...(productData.year && { 
        releaseDate: `${productData.year}-01-01`,
        additionalProperty: [
          {
            '@type': 'PropertyValue',
            name: 'Ano de Lançamento',
            value: productData.year,
          },
        ],
      }),
      ...(product.tracklist && product.tracklist.length > 0 && {
        additionalProperty: [
          {
            '@type': 'PropertyValue',
            name: 'Tracklist',
            value: product.tracklist.join(', '),
          },
        ],
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
          name: 'Produtos',
          item: `${siteUrl}/catalog`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: `${product.artist} - ${product.album}`,
          item: currentUrl,
        },
      ],
    };

    // Remover scripts anteriores se existirem
    const existingProductScript = document.getElementById('product-structured-data');
    const existingBreadcrumbScript = document.getElementById('breadcrumb-structured-data');
    if (existingProductScript) existingProductScript.remove();
    if (existingBreadcrumbScript) existingBreadcrumbScript.remove();

    // Adicionar Product schema
    const productScript = document.createElement('script');
    productScript.id = 'product-structured-data';
    productScript.type = 'application/ld+json';
    productScript.text = JSON.stringify(productStructuredData);
    document.head.appendChild(productScript);

    // Adicionar Breadcrumb schema
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.id = 'breadcrumb-structured-data';
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.text = JSON.stringify(breadcrumbStructuredData);
    document.head.appendChild(breadcrumbScript);

    return () => {
      const productScriptToRemove = document.getElementById('product-structured-data');
      const breadcrumbScriptToRemove = document.getElementById('breadcrumb-structured-data');
      if (productScriptToRemove) productScriptToRemove.remove();
      if (breadcrumbScriptToRemove) breadcrumbScriptToRemove.remove();
    };
  }, [product, productData]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white font-mono">Carregando...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-mono mb-4">{error || 'Produto não encontrado'}</p>
          <Link href="/" className="text-white hover:text-red-600 transition-colors">
            ← Voltar para a página inicial
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const tracklistSideA = productData?.tracklist?.sideA || [];
  const tracklistSideB = productData?.tracklist?.sideB || [];
  const allImages = productData?.images || [product.image];
  const year = productData?.year;

  return (
    <div className="bg-black pt-32 pb-40 min-h-screen">
      {/* Botão Voltar */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-red-600 hover:text-red-500 transition-colors font-mono text-sm"
        >
          <ArrowLeft size={18} />
          Voltar
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galeria de Imagens */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-zinc-900 border border-zinc-800 rounded-sm overflow-hidden">
              <Image
                src={allImages[selectedImageIndex] || product.image}
                alt={`${product.artist} - ${product.album} - CD de ${product.genre} | Oldisco`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {allImages.map((img: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square bg-zinc-900 border rounded-sm overflow-hidden transition-all ${
                      selectedImageIndex === index
                        ? 'border-red-600 ring-2 ring-red-600'
                        : 'border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.artist} - ${product.album} - Vista ${index + 1}`}
                      fill
                      sizes="(max-width: 1024px) 25vw, 12.5vw"
                      className="object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informações do Produto */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-mono text-red-600 font-bold border border-red-900/30 px-2 py-1 uppercase">
                  {product.genre}
                </span>
                {isOutOfStock && (
                  <span className="bg-white text-black px-3 py-1 text-[10px] font-black tracking-tighter skew-x-[-15deg]">
                    ESGOTADO
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-metal text-white tracking-widest uppercase mb-2">
                {product.artist}
              </h1>
              <h2 className="text-2xl md:text-3xl font-mono text-zinc-400 italic mb-4">
                {product.album}
              </h2>
              
              <div className="flex items-center gap-4 text-zinc-500 font-mono text-sm mb-6">
                {year && <span>Ano: {year}</span>}
                {year && <span>•</span>}
                <span>Estoque: {product.stock}</span>
              </div>

              <div className="mb-6">
                <p className="text-3xl font-mono font-bold text-white mb-2">
                  R$ {product.price.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Descrição */}
            {product.description && (
              <div className="border-t border-zinc-800 pt-6">
                <h3 className="text-sm font-mono text-zinc-400 uppercase mb-3 tracking-wider">
                  Descrição
                </h3>
                <p className="text-zinc-300 font-mono text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Tracklist */}
            {(tracklistSideA.length > 0 || tracklistSideB.length > 0) && (
              <div className="border-t border-zinc-800 pt-6">
                <h3 className="text-sm font-mono text-zinc-400 uppercase mb-4 tracking-wider flex items-center gap-2">
                  <ListMusic size={16} />
                  Tracklist
                </h3>
                <div className="space-y-4">
                  {tracklistSideA.length > 0 && (
                    <div>
                      <p className="text-xs font-mono text-red-600 mb-2 uppercase">Lado A</p>
                      <ul className="space-y-1">
                        {tracklistSideA.map((track: string, idx: number) => (
                          <li key={idx} className="text-sm font-mono text-zinc-400">
                            {idx + 1}. {track}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {tracklistSideB.length > 0 && (
                    <div>
                      <p className="text-xs font-mono text-red-600 mb-2 uppercase">Lado B</p>
                      <ul className="space-y-1">
                        {tracklistSideB.map((track: string, idx: number) => (
                          <li key={idx} className="text-sm font-mono text-zinc-400">
                            {idx + 1}. {track}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Botão Adicionar ao Carrinho */}
            <div className="pt-6 border-t border-zinc-800">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full py-4 text-sm font-black tracking-[0.2em] flex items-center justify-center gap-3 transition-all rounded-sm ${
                  isOutOfStock
                    ? 'bg-zinc-900 text-zinc-700 cursor-not-allowed'
                    : 'bg-red-700 text-white hover:bg-red-600 active:scale-95'
                }`}
              >
                <ShoppingCart size={18} />
                {isOutOfStock ? 'ESGOTADO' : 'ADICIONAR AO CARRINHO'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Produtos Relacionados */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mt-20">
          <div className="border-l-4 border-red-600 pl-6 mb-8">
            <h2 className="text-3xl font-metal text-white tracking-widest uppercase mb-2">
              Produtos <span className="text-red-600">Relacionados</span>
            </h2>
            <p className="text-zinc-500 font-mono text-[10px] tracking-widest">Mais itens do arsenal</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link key={relatedProduct.id} href={`/products/${relatedProduct.id}`}>
                <div className="group bg-zinc-950 border border-zinc-900 rounded-sm overflow-hidden hover:border-red-600 transition-all">
                  <div className="relative aspect-square overflow-hidden bg-zinc-900">
                    <Image
                      src={relatedProduct.image}
                      alt={`${relatedProduct.artist} - ${relatedProduct.album} - CD de ${relatedProduct.genre}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover grayscale group-hover:grayscale-0 transition-all opacity-70 group-hover:opacity-100"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[9px] font-mono text-red-600 font-bold border border-red-900/30 px-1.5 py-0.5 uppercase">
                        {relatedProduct.genre}
                      </span>
                      <span className="text-xs font-mono font-bold text-white">
                        R$ {relatedProduct.price.toFixed(2)}
                      </span>
                    </div>
                    <h3 className="font-metal text-lg text-white mb-1 group-hover:text-red-500 transition-colors truncate">
                      {relatedProduct.artist}
                    </h3>
                    <p className="text-zinc-500 font-mono text-[10px] truncate italic">
                      {relatedProduct.album}
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

