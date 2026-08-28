'use client';

import { useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { ZineEdition } from '@/types';

interface ZineAdminListProps {
  zines: ZineEdition[];
  onRefresh: () => void;
  onEdit: (zine: ZineEdition) => void;
  onAddNew: () => void;
}

export function ZineAdminList({ zines, onRefresh, onEdit, onAddNew }: ZineAdminListProps) {
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Tem certeza que deseja excluir "${title}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    setDeletingSlug(slug);
    try {
      await apiClient.deleteZine(slug);
      await onRefresh();
    } catch (error: any) {
      alert(error.message || 'Erro ao excluir edição');
    } finally {
      setDeletingSlug(null);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Edições ({zines.length})</h3>
        <button
          onClick={onAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded transition-colors"
        >
          <Plus size={18} />
          Nova Edição
        </button>
      </div>

      {zines.length === 0 ? (
        <div className="text-zinc-400 text-center py-12">
          <p className="mb-4">Nenhuma edição cadastrada ainda.</p>
          <button
            onClick={onAddNew}
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded transition-colors"
          >
            <Plus size={18} />
            Cadastrar Primeira Edição
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="text-left py-3 px-4 text-zinc-400 font-mono text-xs uppercase">Capa</th>
                <th className="text-left py-3 px-4 text-zinc-400 font-mono text-xs uppercase">Edição</th>
                <th className="text-left py-3 px-4 text-zinc-400 font-mono text-xs uppercase">Título</th>
                <th className="text-left py-3 px-4 text-zinc-400 font-mono text-xs uppercase">Páginas</th>
                <th className="text-left py-3 px-4 text-zinc-400 font-mono text-xs uppercase">Status</th>
                <th className="text-left py-3 px-4 text-zinc-400 font-mono text-xs uppercase">Ações</th>
              </tr>
            </thead>
            <tbody>
              {zines.map((zine) => (
                <tr key={zine.id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                  <td className="py-3 px-4">
                    {zine.coverImage ? (
                      <img src={zine.coverImage} alt={zine.title} className="w-12 h-16 object-cover rounded border border-zinc-700" />
                    ) : (
                      <div className="w-12 h-16 rounded border border-zinc-700 bg-zinc-800" />
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-mono text-red-600 text-sm">#{zine.editionNumber}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{zine.title}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-zinc-300 font-mono text-sm">{zine.pages?.length || 0}</div>
                  </td>
                  <td className="py-3 px-4">
                    {zine.published ? (
                      <span className="text-xs bg-green-600/20 text-green-400 border border-green-600/30 px-2 py-1 rounded">
                        Publicado
                      </span>
                    ) : (
                      <span className="text-xs bg-zinc-700/40 text-zinc-400 border border-zinc-600/30 px-2 py-1 rounded">
                        Rascunho
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(zine)}
                        className="p-2 text-blue-400 hover:bg-blue-600/20 rounded transition-colors"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(zine.slug, zine.title)}
                        disabled={deletingSlug === zine.slug}
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
