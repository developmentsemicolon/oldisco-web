'use client';

import React from 'react';
import { Radio, ShoppingBag, Send, Users } from 'lucide-react';
import { Logo } from '@/components/Logo';
import Link from 'next/link';

export default function AboutClient() {
  return (
    <div className="bg-black pt-32 pb-40">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center px-6">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black z-10" />
          <img 
            src="https://images.unsplash.com/photo-1653319440475-49014169d76c?q=80&w=1920&auto=format&fit=crop" 
            className="w-full h-full object-cover grayscale opacity-10 contrast-150"
            alt="Recording Studio"
          />
        </div>

        <div className="relative z-10 w-full flex flex-col items-center text-center space-y-8">
          <div className="mb-8">
            <Logo size="lg" />
          </div>
          
          <div className="flex items-center justify-center gap-4 text-red-600 font-mono text-[10px] font-black tracking-[0.4em] uppercase">
            <span className="h-[1px] w-12 bg-red-900/50"></span>
            EST. MMXXIV • UNDERGROUND SELO
            <span className="h-[1px] w-12 bg-red-900/50"></span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-metal text-white tracking-widest uppercase">
            SOBRE NÓS
          </h1>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <section className="px-6 max-w-4xl mx-auto mt-20 space-y-20">
        {/* Quem Somos */}
        <div className="space-y-6">
          <h2 className="text-4xl font-metal text-white tracking-widest uppercase border-l-4 border-red-600 pl-6">
            Quem Somos
          </h2>
          <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-sm">
            <p className="text-zinc-300 font-mono text-sm leading-relaxed mb-4">
              Oldisco é um selo especializado em CDs de black metal, 
              dedicado a preservar e promover a cultura do underground. Nascemos da paixão pela 
              música extrema e pela mídia física, acreditando que o som em mídia física carrega uma 
              energia única que não pode ser replicada digitalmente.
            </p>
            <p className="text-zinc-300 font-mono text-sm leading-relaxed">
              Nossa missão é conectar bandas independentes com devotos do black metal, criando 
              uma ponte entre artistas e fãs através de demos e lançamentos cuidadosamente selecionados. 
              Cada release em nosso catálogo representa uma peça única da cena underground.
            </p>
          </div>
        </div>

        {/* Nossa Missão */}
        <div className="space-y-6">
          <h2 className="text-4xl font-metal text-white tracking-widest uppercase border-l-4 border-red-600 pl-6">
            Nossa Missão
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-sm">
              <ShoppingBag className="text-red-600 mb-4" size={32} />
              <h3 className="font-metal text-xl text-white mb-3 tracking-wider">SELO</h3>
              <p className="text-zinc-400 font-mono text-[11px] leading-relaxed">
                Curadoria especializada de demos e lançamentos obscuros do underground mundial.
              </p>
            </div>
            <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-sm">
              <Radio className="text-red-600 mb-4" size={32} />
              <h3 className="font-metal text-xl text-white mb-3 tracking-wider">RÁDIO</h3>
              <p className="text-zinc-400 font-mono text-[11px] leading-relaxed">
                Transmissão 24/7 de black metal sem censura, sem anúncios, apenas brutalidade pura.
              </p>
            </div>
            <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-sm">
              <Send className="text-red-600 mb-4" size={32} />
              <h3 className="font-metal text-xl text-white mb-3 tracking-wider">PRODUZIR MATERIAL</h3>
              <p className="text-zinc-400 font-mono text-[11px] leading-relaxed">
                Bandas do underground podem enviar material para lançar CDs pelo selo.
              </p>
            </div>
          </div>
        </div>

        {/* Valores */}
        <div className="space-y-6">
          <h2 className="text-4xl font-metal text-white tracking-widest uppercase border-l-4 border-red-600 pl-6">
            Valores
          </h2>
          <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-sm">
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <span className="text-red-600 font-black text-xl">•</span>
                <p className="text-zinc-300 font-mono text-sm leading-relaxed">
                  <strong className="text-white">Autenticidade:</strong> Priorizamos releases genuínos 
                  do underground, sem compromissos comerciais.
                </p>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-red-600 font-black text-xl">•</span>
                <p className="text-zinc-300 font-mono text-sm leading-relaxed">
                  <strong className="text-white">Preservação:</strong> Mantemos viva a cultura da 
                  mídia física e do som em mídia física.
                </p>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-red-600 font-black text-xl">•</span>
                <p className="text-zinc-300 font-mono text-sm leading-relaxed">
                  <strong className="text-white">Comunidade:</strong> Construímos uma rede de devotos 
                  e artistas unidos pela paixão pelo black metal.
                </p>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-red-600 font-black text-xl">•</span>
                <p className="text-zinc-300 font-mono text-sm leading-relaxed">
                  <strong className="text-white">Qualidade:</strong> Cada disco em nosso catálogo passa 
                  por uma seleção rigorosa de qualidade sonora e artística.
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Contato */}
        <div className="space-y-6">
          <h2 className="text-4xl font-metal text-white tracking-widest uppercase border-l-4 border-red-600 pl-6">
            Contato
          </h2>
          <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-sm">
            <p className="text-zinc-300 font-mono text-sm leading-relaxed mb-6">
              Para bandas interessadas em lançar seus releases pelo selo, dúvidas sobre pedidos ou 
              qualquer outra questão, entre em contato conosco:
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Users className="text-red-600" size={20} />
                <span className="text-zinc-400 font-mono text-sm">Facebook: <a href="https://www.facebook.com/profile.php?id=61587720096599" className="hover:text-red-600 transition-colors">Oldisco</a></span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="text-red-600" size={20} />
                <span className="text-zinc-400 font-mono text-sm">Email: <a href="mailto:admin@oldisco.com" className="hover:text-red-600 transition-colors">contact@oldisco.com</a></span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="text-red-600" size={20} />
                <span className="text-zinc-400 font-mono text-sm">WhatsApp: <a href="https://wa.me/5531985555017" className="hover:text-red-600 transition-colors">(31) 985555017</a></span>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-zinc-900">
              <p className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase italic">
                "Onde o físico se recusa a morrer."
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col md:flex-row gap-4 justify-center pt-8 flex-wrap">
          <Link 
            href="/bandas"
            className="px-10 py-4 bg-red-600 text-white font-black tracking-[0.3em] text-[11px] flex items-center justify-center gap-3 hover:bg-red-500 transition-all uppercase shadow-2xl shadow-red-900/20"
          >
            <ShoppingBag size={16} /> EXPLORAR BANDAS
          </Link>
          <Link 
            href="/produzir-material"
            className="px-10 py-4 border border-zinc-800 text-zinc-500 font-black tracking-[0.3em] text-[11px] flex items-center justify-center gap-3 hover:border-red-600 hover:text-red-600 transition-all uppercase"
          >
            <Send size={16} /> PRODUZIR MATERIAL
          </Link>
        </div>
      </section>
    </div>
  );
}

