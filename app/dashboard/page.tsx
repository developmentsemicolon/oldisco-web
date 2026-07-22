'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, User } from '@/lib/api-client';
import { ShoppingBag, Book, Radio, Settings, Package, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await apiClient.getMe();
        if (userData.role !== 'ADMIN') {
          router.push('/');
          return;
        }
        setUser(userData);
      } catch (error) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-black pt-32 pb-40 min-h-screen">
      {/* Hero Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto text-center mb-16">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-metal text-white tracking-widest uppercase">
            DASHBOARD
          </h1>
          <div className="flex items-center justify-center gap-4 text-red-600 font-mono text-[10px] font-black tracking-[0.4em] uppercase">
            <span className="h-[1px] w-12 bg-red-900/50"></span>
            BEM-VINDO, {(user.name && user.name.trim() !== '') ? user.name.replace(new RegExp('undefined', 'ig'), '').toUpperCase() : user.email.split('@')[0].toUpperCase()}
            <span className="h-[1px] w-12 bg-red-900/50"></span>
          </div>
        </div>
      </section>

      {/* Cards de Navegação */}
      <section className="px-6 max-w-6xl mx-auto mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link 
            href="/dashboard/products"
            className="bg-zinc-950 border border-zinc-900 p-6 rounded-sm red-glow-card hover:border-red-600 transition-all group"
          >
            <Package className="text-red-600 mb-4 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="font-metal text-xl text-white mb-2 tracking-wider">ARSENAL</h3>
            <p className="text-zinc-400 font-mono text-[11px]">Gerenciar produtos</p>
          </Link>

          <Link 
            href="/dashboard/bandas"
            className="bg-zinc-950 border border-zinc-900 p-6 rounded-sm red-glow-card hover:border-red-600 transition-all group"
          >
            <ShoppingBag className="text-red-600 mb-4 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="font-metal text-xl text-white mb-2 tracking-wider">BANDAS</h3>
            <p className="text-zinc-400 font-mono text-[11px]">Gerenciar bandas</p>
          </Link>

          <Link 
            href="/dashboard/blog"
            className="bg-zinc-950 border border-zinc-900 p-6 rounded-sm red-glow-card hover:border-red-600 transition-all group"
          >
            <Book className="text-red-600 mb-4 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="font-metal text-xl text-white mb-2 tracking-wider">CONTEÚDO</h3>
            <p className="text-zinc-400 font-mono text-[11px]">Gerenciar artigos</p>
          </Link>

          <Link 
            href="/dashboard/releases"
            className="bg-zinc-950 border border-zinc-900 p-6 rounded-sm red-glow-card hover:border-red-600 transition-all group"
          >
            <Calendar className="text-red-600 mb-4 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="font-metal text-xl text-white mb-2 tracking-wider">PRÓXIMOS LANÇAMENTOS</h3>
            <p className="text-zinc-400 font-mono text-[11px]">Gerenciar anúncios</p>
          </Link>

          <Link 
            href="/dashboard/radio"
            className="bg-zinc-950 border border-zinc-900 p-6 rounded-sm red-glow-card hover:border-red-600 transition-all group"
          >
            <Radio className="text-red-600 mb-4 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="font-metal text-xl text-white mb-2 tracking-wider">RÁDIO</h3>
            <p className="text-zinc-400 font-mono text-[11px]">Sintonizar</p>
          </Link>
        </div>
      </section>

      {/* Seção Despojos de Guerra */}
      <section className="px-6 max-w-6xl mx-auto">
        <Link href="/dashboard/despojos">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-l-4 border-red-600 pl-6 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="flex items-center gap-4">
              <Package className="text-red-600" size={40} />
              <div>
                <h2 className="text-4xl md:text-5xl font-metal text-white tracking-widest uppercase">
                  DESPOJOS DE GUERRA
                </h2>
                <p className="text-zinc-500 font-mono text-[10px] tracking-widest mt-1">
                  Sua coleção de CDs conquistados
                </p>
              </div>
            </div>
          </div>
        </Link>
      </section>
    </div>
  );
}
