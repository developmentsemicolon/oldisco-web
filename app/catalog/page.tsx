'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { Product, Genre } from '@/types';

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiClient.getProducts();
        const mappedProducts: Product[] = data.map((item: any) => ({
          id: item.id,
          artist: item.band,
          album: item.album,
          genre: item.genre as Genre,
          price: item.price,
          image: item.images && item.images.length > 0 ? item.images[0] : '/images/logo.png',
          stock: item.stock || 0,
          description: item.description || '',
          tracklist: item.tracklist
            ? (item.tracklist.sideA || []).concat(item.tracklist.sideB || [])
            : [],
          catalogNumber: item.catalogNumber || '',
        }));
        setProducts(mappedProducts);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-black pt-32 pb-40 min-h-screen">
      {/* Hero Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto text-center mb-16">
        <div className="space-y-6">
          <h1 className="text-6xl md:text-7xl font-metal text-white tracking-widest uppercase">
            CATÁLOGO
          </h1>
          <div className="flex items-center justify-center gap-4 text-red-600 font-mono text-[10px] font-black tracking-[0.4em] uppercase">
            <span className="h-[1px] w-12 bg-red-900/50"></span>
            ARSENAL DO UNDERGROUND
            <span className="h-[1px] w-12 bg-red-900/50"></span>
          </div>
          <p className="text-zinc-400 text-sm md:text-base font-mono leading-relaxed opacity-80 max-w-2xl mx-auto uppercase tracking-tighter">
            Todos os lançamentos disponíveis, com valor, estoque e número de catálogo.
          </p>
        </div>
      </section>

      {/* Tabela de Produtos */}
      <section className="px-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center text-zinc-500 font-mono text-sm py-20">Carregando catálogo...</div>
        ) : products.length === 0 ? (
          <div className="text-center text-zinc-500 font-mono text-sm py-20">Nenhum produto cadastrado ainda.</div>
        ) : (
          <div className="bg-zinc-950 border border-zinc-900 rounded-sm overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-4 px-4 text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Banda</th>
                  <th className="text-left py-4 px-4 text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Álbum</th>
                  <th className="text-left py-4 px-4 text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Gênero</th>
                  <th className="text-left py-4 px-4 text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Valor</th>
                  <th className="text-left py-4 px-4 text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Estoque</th>
                  <th className="text-left py-4 px-4 text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Catálogo</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const isOutOfStock = product.stock <= 0;
                  return (
                    <tr
                      key={product.id}
                      className="border-b border-zinc-900 hover:bg-zinc-900/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <Link
                          href={`/products/${product.id}`}
                          className="font-metal text-white hover:text-red-500 transition-colors tracking-wide"
                        >
                          {product.artist}
                        </Link>
                      </td>
                      <td className="py-4 px-4">
                        <Link href={`/products/${product.id}`} className="text-zinc-400 font-mono text-sm italic hover:text-zinc-300 transition-colors">
                          {product.album}
                        </Link>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-[9px] font-mono text-red-600 font-bold border border-red-900/30 px-1.5 py-0.5 uppercase">
                          {product.genre}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-mono text-white text-sm">R$ {product.price.toFixed(2)}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`font-mono text-sm ${isOutOfStock ? 'text-red-600' : 'text-white'}`}>
                          {isOutOfStock ? 'ESGOTADO' : product.stock}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-mono text-zinc-400 text-sm">
                          {product.catalogNumber || '—'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
