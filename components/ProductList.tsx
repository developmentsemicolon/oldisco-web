'use client';

import { useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface Product {
  id: string;
  band: string;
  album: string;
  genre: string;
  year: number;
  price: number;
  stock: number;
  available: boolean;
  images: string[];
  description?: string;
}

interface ProductListProps {
  products: Product[];
  onRefresh: () => void;
  onEdit: (product: Product) => void;
  onAddNew: () => void;
}

export function ProductList({ products, onRefresh, onEdit, onAddNew }: ProductListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, band: string, album: string) => {
    if (!confirm(`Tem certeza que deseja excluir "${band} - ${album}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    setDeletingId(id);
    try {
      await apiClient.deleteProduct(id);
      await onRefresh();
    } catch (error: any) {
      alert(error.message || 'Erro ao excluir produto');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Produtos Cadastrados ({products.length})</h3>
        <button
          onClick={onAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded transition-colors"
        >
          <Plus size={18} />
          Novo Produto
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-zinc-400 text-center py-12">
          <p className="mb-4">Nenhum produto cadastrado ainda.</p>
          <button
            onClick={onAddNew}
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded transition-colors"
          >
            <Plus size={18} />
            Cadastrar Primeiro Produto
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="text-left py-3 px-4 text-zinc-400 font-mono text-xs uppercase">Imagem</th>
                <th className="text-left py-3 px-4 text-zinc-400 font-mono text-xs uppercase">Banda</th>
                <th className="text-left py-3 px-4 text-zinc-400 font-mono text-xs uppercase">Álbum</th>
                <th className="text-left py-3 px-4 text-zinc-400 font-mono text-xs uppercase">Gênero</th>
                <th className="text-left py-3 px-4 text-zinc-400 font-mono text-xs uppercase">Preço</th>
                <th className="text-left py-3 px-4 text-zinc-400 font-mono text-xs uppercase">Estoque</th>
                <th className="text-left py-3 px-4 text-zinc-400 font-mono text-xs uppercase">Status</th>
                <th className="text-left py-3 px-4 text-zinc-400 font-mono text-xs uppercase">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.album}
                        className="w-16 h-16 object-cover rounded border border-zinc-700"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-zinc-800 rounded border border-zinc-700 flex items-center justify-center">
                        <span className="text-zinc-600 text-xs">Sem imagem</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{product.band}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-zinc-300">{product.album}</div>
                    <div className="text-xs text-zinc-500">{product.year}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs font-mono text-red-600 border border-red-900/30 px-2 py-1 rounded">
                      {product.genre}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-mono text-white">R$ {product.price.toFixed(2)}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className={`font-mono ${product.stock > 0 ? 'text-white' : 'text-red-600'}`}>
                      {product.stock}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {product.available ? (
                      <span className="text-xs bg-green-600/20 text-green-400 border border-green-600/30 px-2 py-1 rounded">
                        Disponível
                      </span>
                    ) : (
                      <span className="text-xs bg-red-600/20 text-red-400 border border-red-600/30 px-2 py-1 rounded">
                        Indisponível
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(product)}
                        className="p-2 text-blue-400 hover:bg-blue-600/20 rounded transition-colors"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.band, product.album)}
                        disabled={deletingId === product.id}
                        className="p-2 text-red-600 hover:bg-red-600/20 rounded transition-colors disabled:opacity-50"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

