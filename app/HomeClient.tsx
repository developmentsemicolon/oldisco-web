'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/lib/cart-context';

import { ArrowRight, Radio, ShoppingBag } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { Logo } from '@/components/Logo';
import { apiClient } from '@/lib/api-client';
import { Product, Genre } from '@/types';

import Image from 'next/image';
import Link from 'next/link';

export default function HomeClient() {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiClient.getProducts();
        // Mapear dados do backend para o formato do frontend
        const mappedProducts: Product[] = data.map((item: any) => ({
          id: item.id,
          artist: item.band, // backend usa 'band', frontend usa 'artist'
          album: item.album,
          genre: item.genre as Genre,
          price: item.price,
          image: item.images && item.images.length > 0 ? item.images[0] : '/images/logo.png',
          stock: item.stock || 0,
          description: item.description || '',
          tracklist: item.tracklist 
            ? (item.tracklist.sideA || []).concat(item.tracklist.sideB || [])
            : [],
        }));
        setProducts(mappedProducts);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        // Em caso de erro, manter array vazio
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-black">
      {/* Hero Section - Minimalista & Profissional */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black z-10" />
          <Image 
            src="https://images.unsplash.com/photo-1573566472937-1fa7a6230e93?q=80&w=1920&auto=format&fit=crop" 
            alt="Oldisco Selo de Black metal"
            fill
            sizes="100vw"
            className="object-cover grayscale opacity-20 contrast-150"
            priority
          />
        </div>

        <div className="relative z-10 w-full flex flex-col items-center text-center">
          <div className="mb-12 animate-in zoom-in duration-1000">
            <Logo size="hero" />
          </div>

          <div className="max-w-2xl space-y-8">
            <div className="flex items-center justify-center gap-4 text-red-600 font-mono text-[10px] font-black tracking-[0.4em] uppercase">
              <span className="h-[1px] w-12 bg-red-900/50"></span>
              EST. MMXXIV • UNDERGROUND SELO
              <span className="h-[1px] w-12 bg-red-900/50"></span>
            </div>
            
            <p className="text-zinc-400 text-sm md:text-lg font-mono leading-relaxed opacity-80 max-w-xl mx-auto uppercase tracking-tighter">
              A pureza do som extremo em suporte físico. Curadoria especializada de demos e lançamentos obscuros.
            </p>

            <div className="flex flex-wrap justify-center gap-4 md:gap-8 pt-6">
              <Link href="/produzir-material" className="shred-btn px-10 py-5 bg-red-600 text-white font-black tracking-[0.3em] text-[11px] flex items-center gap-3 hover:scale-105 active:scale-95 shadow-2xl shadow-red-900/20 uppercase">
                PRODUZIR MATERIAL <ShoppingBag size={16} />
              </Link>
              <button className="px-10 py-5 bg-zinc-950 border border-zinc-800 text-zinc-500 font-black tracking-[0.3em] text-[11px] flex items-center gap-3 hover:border-red-600 hover:text-white transition-all uppercase">
                <Radio size={16} /> RÁDIO AO VIVO
              </button>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30">
           <div className="w-[1px] h-20 bg-gradient-to-b from-red-600 to-transparent animate-pulse"></div>
        </div>
      </section>

      {/* Featured Grid */}
      <section className="px-6 py-32 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4 border-l-4 border-red-600 pl-6">
          <div>
            <h2 className="text-4xl font-metal text-white tracking-widest uppercase">
              Arsenal <span className="text-red-600">Recente</span>
            </h2>
            <p className="text-zinc-500 font-mono text-[10px] tracking-widest mt-1">Sinfonias de destruição recém-chegadas</p>
          </div>
          <Link href="/catalog" className="text-[10px] font-black tracking-[0.4em] text-zinc-500 hover:text-red-600 transition-colors uppercase flex items-center gap-2">
            Ver Arsenal Completo <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-zinc-500 font-mono text-sm">Carregando arsenal...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={addItem}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-zinc-500 font-mono text-sm">Nenhum produto disponível no momento.</p>
          </div>
        )}
      </section>

      {/* Radio Teaser - Professional Layout */}
      <section className="py-24 bg-zinc-950/50 border-y border-white/5 overflow-hidden">
         <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 space-y-8">
               <div className="inline-block p-4 bg-red-600/10 border border-red-600/30 rounded-sm">
                  <Radio size={32} className="text-red-600 animate-pulse" />
               </div>
               <h2 className="text-5xl font-metal text-white leading-tight">SINTONIZE O <br/><span className="text-red-600">CAOS CONSTANTE</span></h2>
               <p className="text-zinc-400 font-mono text-sm leading-relaxed">
                 Nossa rádio opera 24/7 transmitindo o que há de mais pútrido e veloz no underground mundial. Sem anúncios, sem censura, apenas brutalidade pura.
               </p>
               <button className="px-8 py-4 border-2 border-red-600 text-red-600 font-black tracking-widest text-xs hover:bg-red-600 hover:text-white transition-all uppercase">
                 Iniciar Transmissão
               </button>
            </div>
            <div className="lg:w-1/2 relative">
               <div className="absolute inset-0 bg-red-600/20 blur-[100px] rounded-full animate-pulse" />
               <div className="relative bg-black border border-zinc-800 p-8 rounded-sm shadow-2xl">
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-3 h-3 bg-red-600 rounded-full animate-ping"></div>
                     <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">Live Now: RÁDIO MALDITA</span>
                  </div>
                  <div className="space-y-4">
                     {[1,2,3].map(i => (
                       <div key={i} className={`h-1 rounded-full bg-zinc-900 overflow-hidden`}>
                          <div className={`h-full bg-red-600 transition-all duration-1000`} style={{width: `${Math.random()*100}%`}}></div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Footer / CTA */}
      <footer className="px-6 py-32 text-center border-t border-zinc-900">
         <div className="max-w-xl mx-auto space-y-12">
            <Logo size="md" className="opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700" />
            <div className="h-[1px] w-20 bg-red-600 mx-auto opacity-30"></div>
            <p className="text-zinc-600 font-mono text-[11px] tracking-widest uppercase italic">
              "Onde o físico se recusa a morrer."
            </p>
            <div className="flex justify-center gap-12 text-[10px] font-black tracking-[0.4em] text-zinc-500 uppercase">
               <a href="https://www.instagram.com/oldisco_records/" className="hover:text-red-600 transition-colors">Instagram</a>
               <a href="https://www.youtube.com/@oldiscorecords" className="hover:text-red-600 transition-colors">Youtube</a>
               <a href="https://www.facebook.com/profile.php?id=61587720096599" className="hover:text-red-600 transition-colors">Facebook</a>
            </div>
         </div>
      </footer>
    </div>
  );
}

