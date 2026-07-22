'use client';

import { useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface Band {
  id: string;
  name: string;
  slug: string;
  genre: string;
  description?: string;
  logo?: string;
}

interface BandAdminListProps {
  bands: Band[];
  onRefresh: () => void;
  onEdit: (band: Band) => void;
  onAddNew: () => void;
}

export function BandAdminList({ bands, onRefresh, onEdit, onAddNew }: BandAdminListProps) {
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  const handleDelete = async (slug: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir "${name}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    setDeletingSlug(slug);
    try {
      await apiClient.deleteBand(slug);
      await onRefresh();
    } catch (error: any) {
      alert(error.message || 'Erro ao excluir banda');
    } finally {
      setDeletingSlug(null);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Bandas ({bands.length})</h3>
        <button
          onClick={onAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded transition-colors"
        >
          <Plus size={18} />
          Nova Banda
        </button>
      </div>

      {bands.length === 0 ? (
        <div className="text-zinc-400 text-center py-12">
          <p className="mb-4">Nenhuma banda cadastrada ainda.</p>
          <button
            onClick={onAddNew}
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded transition-colors"
          >
            <Plus size={18} />
            Cadastrar Primeira Banda
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="text-left py-3 px-4 text-zinc-400 font-mono text-xs uppercase">Logo</th>
                <th className="text-left py-3 px-4 text-zinc-400 font-mono text-xs uppercase">Nome</th>
                <th className="text-left py-3 px-4 text-zinc-400 font-mono text-xs uppercase">Gênero</th>
                <th className="text-left py-3 px-4 text-zinc-400 font-mono text-xs uppercase">Ações</th>
              </tr>
            </thead>
            <tbody>
              {bands.map((band) => (
                <tr
                  key={band.id}
                  className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    {band.logo ? (
                      <img
                        src={band.logo}
                        alt={band.name}
                        className="w-12 h-12 object-cover rounded border border-zinc-700"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded border border-zinc-700 bg-zinc-800" />
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{band.name}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-zinc-300 font-mono text-sm">{band.genre}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(band)}
                        className="p-2 text-blue-400 hover:bg-blue-600/20 rounded transition-colors"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(band.slug, band.name)}
                        disabled={deletingSlug === band.slug}
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
