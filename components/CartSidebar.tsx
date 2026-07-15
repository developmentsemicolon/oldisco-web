'use client';

import React from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';

export const CartSidebar: React.FC = () => {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeItem, total } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
      
      <div className="relative w-full max-w-md h-full bg-zinc-950 border-l border-white/10 shadow-2xl flex flex-col">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-black tracking-widest flex items-center gap-2">
            YOUR CART <span className="text-red-600">[{items.length}]</span>
          </h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 text-zinc-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 gap-4">
              <ShoppingCart size={48} className="opacity-20" />
              <p className="font-bold tracking-widest uppercase">Your pit is empty</p>
              <button onClick={() => setIsCartOpen(false)} className="text-red-500 font-bold hover:underline">START SHOPPING</button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                <div className="w-20 h-20 shrink-0 bg-zinc-900 border border-white/5 rounded overflow-hidden">
                  <img src={item.image} alt={item.album} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm truncate">{item.artist}</h4>
                  <p className="text-xs text-zinc-400 truncate mb-2">{item.album}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 bg-zinc-900 rounded border border-white/10 px-2 py-1">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="text-zinc-400 hover:text-red-500"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="text-zinc-400 hover:text-red-500"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-zinc-600 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">R$ {(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 bg-zinc-900/50 border-t border-white/5 space-y-4">
            <div className="flex justify-between items-center text-zinc-400 text-sm">
              <span>Subtotal</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-xl font-black">
              <span>TOTAL</span>
              <span className="text-red-600">R$ {total.toFixed(2)}</span>
            </div>
            <Link 
              href="/checkout" 
              onClick={() => setIsCartOpen(false)}
              className="w-full py-4 bg-red-600 text-white font-black tracking-widest flex items-center justify-center gap-3 hover:bg-red-500 transition-all rounded shadow-xl shadow-red-900/10 group"
            >
              PROCEED TO CHECKOUT <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-[10px] text-center text-zinc-500 uppercase tracking-widest font-bold">Secure checkout via WhatsApp or Card</p>
          </div>
        )}
      </div>
    </div>
  );
};
