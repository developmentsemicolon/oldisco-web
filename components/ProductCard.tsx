'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, ListMusic } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetails }) => {
  const isOutOfStock = product.stock <= 0;

  const handleCardClick = (e: React.MouseEvent) => {
    // Não navegar se clicar no botão
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
  };

  return (
    <Link href={`/products/${product.id}`} onClick={handleCardClick}>
      <div className="group relative bg-zinc-950 border border-zinc-900 p-3 rounded-sm red-glow-card flex flex-col h-full cursor-pointer hover:border-red-600 transition-all">
        {/* Imagem com Overlay de Tracklist */}
        <div className="relative aspect-square overflow-hidden mb-4 bg-zinc-900">
          <Image 
            src={product.image} 
            alt={`${product.artist} - ${product.album} - CD de ${product.genre} | Oldisco`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-70 group-hover:opacity-100"
            loading="lazy"
          />
          
          {/* Tracklist Overlay (Simulado para Demo) */}
          <div className="absolute inset-0 bg-black/90 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center overflow-hidden">
             <p className="text-red-600 font-black text-[9px] tracking-widest mb-3 border-b border-red-900/30 pb-1 flex items-center gap-2">
               <ListMusic size={12} /> TRACKLIST
             </p>
             <ul className="text-[9px] font-mono text-zinc-400 space-y-1">
               {product.tracklist?.map((t, idx) => (
                 <li key={idx} className="truncate">{idx + 1}. {t.toUpperCase()}</li>
               ))}
             </ul>
          </div>

          {isOutOfStock && (
            <div className="absolute top-2 right-2 z-20">
              <span className="bg-white text-black px-2 py-1 text-[9px] font-black tracking-tighter skew-x-[-15deg]">ESGOTADO</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[9px] font-mono text-red-600 font-bold border border-red-900/30 px-1.5 py-0.5 uppercase">{product.genre}</span>
            <span className="text-xs font-mono font-bold text-white">R$ {product.price.toFixed(2)}</span>
          </div>
          
          <h4 className="font-metal text-xl text-white tracking-wide truncate group-hover:text-red-500 transition-colors">{product.artist}</h4>
          <p className="text-zinc-500 font-mono text-[11px] mb-5 truncate italic">{product.album}</p>
          
          <div className="mt-auto space-y-2">
             <button 
               disabled={isOutOfStock}
               onClick={handleAddToCartClick}
               className={`w-full py-3 text-[10px] font-black tracking-[0.2em] flex items-center justify-center gap-2 transition-all rounded-sm shadow-inner ${
                 isOutOfStock 
                 ? 'bg-zinc-900 text-zinc-700 cursor-not-allowed' 
                 : 'bg-red-700 text-white hover:bg-red-600 active:scale-95'
               }`}
             >
               <ShoppingCart size={14} /> ADICIONAR AO CARRINHO
             </button>
          </div>
        </div>
      </div>
    </Link>
  );
};
