'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, User } from '@/lib/api-client';
import { Package, Calendar, ArrowLeft } from 'lucide-react';
import { MOCK_ORDERS } from '@/constants';
import Link from 'next/link';

export default function DespojosPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await apiClient.getMe();
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'pending': 'PENDENTE',
      'completed': 'COMPLETO',
      'shipped': 'ENVIADO',
      'delivered': 'ENTREGUE'
    };
    return labels[status] || status.toUpperCase();
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'text-yellow-600 border-yellow-900/30 bg-yellow-900/10',
      'completed': 'text-green-600 border-green-900/30 bg-green-900/10',
      'shipped': 'text-blue-600 border-blue-900/30 bg-blue-900/10',
      'delivered': 'text-red-600 border-red-900/30 bg-red-900/10'
    };
    return colors[status] || 'text-zinc-600 border-zinc-900/30 bg-zinc-900/10';
  };

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-40">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          
          
          <div className="flex items-center gap-4 mb-4 border-l-4 border-red-600 pl-6">
            <Package className="text-red-600" size={40} />
            <div>
              <h1 className="text-5xl md:text-6xl font-metal text-white tracking-widest uppercase">
                DESPOJOS DE GUERRA
              </h1>
              <p className="text-zinc-500 font-mono text-[10px] tracking-widest mt-2">
                Sua coleção de CDs conquistados
              </p>
            </div>
          </div>
        </div>

        {/* Lista de Pedidos */}
        {MOCK_ORDERS.length === 0 ? (
          <div className="bg-zinc-950 border border-zinc-900 p-12 rounded-sm text-center">
            <Package className="text-zinc-700 mx-auto mb-4" size={64} />
            <p className="text-zinc-500 font-mono text-lg mb-4">Nenhum despojo de guerra ainda</p>
            <Link 
              href="/bandas"
              className="inline-block text-red-600 font-black tracking-widest text-sm hover:text-red-500 transition-colors uppercase"
            >
              EXPLORAR BANDAS →
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {MOCK_ORDERS.map((order) => (
              <div 
                key={order.id}
                className="bg-zinc-950 border border-zinc-900 p-6 rounded-sm hover:border-red-600/50 transition-colors"
              >
                {/* Header do Pedido */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-900">
                  <div className="flex items-center gap-4">
                    <Calendar className="text-red-600" size={20} />
                    <div>
                      <p className="text-white font-mono text-sm font-bold">
                        {formatDate(order.date)}
                      </p>
                      <p className="text-zinc-500 font-mono text-[10px]">
                        Pedido #{order.id.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-[9px] font-mono font-bold border px-3 py-1 uppercase rounded-sm ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                    <span className="text-xl font-metal text-red-600">
                      R$ {order.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Lista de Produtos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {order.items.map((item) => (
                    <div 
                      key={item.id}
                      className="flex items-center gap-3 bg-black border border-zinc-900 p-3 rounded-sm hover:border-zinc-800 transition-colors"
                    >
                      <img 
                        src={item.image} 
                        alt={item.album}
                        className="w-16 h-16 object-cover grayscale border border-zinc-800"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-metal text-sm truncate">{item.artist}</p>
                        <p className="text-zinc-500 font-mono text-[10px] truncate">{item.album}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-zinc-600 font-mono text-[9px]">
                            {item.quantity}x
                          </span>
                          <span className="text-red-600 font-mono text-[10px] font-bold">
                            R$ {(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

