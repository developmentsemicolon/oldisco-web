'use client';

import { useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface Release {
  id: string;
  slug: string;
  title: string;
  band: string;
  album: string;
  genre: string;
  releaseDate: string;
  description?: string;
  image?: string;
  status?: string;
}

interface ReleaseListProps {
  releases: Release[];
  onRefresh: () => void;
  onEdit: (release: Release) => void;
  onAddNew: () => void;
}

export function ReleaseList({ releases, onRefresh, onEdit, onAddNew }: ReleaseListProps) {
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Tem certeza que deseja excluir "${title}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    setDeletingSlug(slug);
    try {
      await apiClient.deleteRelease(slug);
      await onRefresh();
    } catch (error: any) {
      alert(error.message || 'Erro ao excluir lançamento');
    } finally {
      setDeletingSlug(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'ANNOUNCED':
        return 'Anunciado';
      case 'COMING_SOON':
        return 'Em Breve';
      case 'RELEASED':
        return 'Lançado';
      default:
        return 'N/A';
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Lançamentos ({releases.length})</h3>
        <button
          onClick={onAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded transition-colors"
        >
          <Plus size={18} />
          Novo Lançamento
        </button>
      </div>

      {releases.length === 0 ? (
        <div className="text-zinc-400 text-center py-12">
          <p className="mb-4">Nenhum lançamento cadastrado ainda.</p>
          <button
            onClick={onAddNew}
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded transition-colors"
          >
            <Plus size={18} />
            Cadastrar Primeiro Lançamento
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="text-left py-3 px-4 text-zinc-400 font-mono text-xs uppercase">Título</th>
                <th className="text-left py-3 px-4 text-zinc-400 font-mono text-xs uppercase">Banda</th>
                <th className="text-left py-3 px-4 text-zinc-400 font-mono text-xs uppercase">Álbum</th>
                <th className="text-left py-3 px-4 text-zinc-400 font-mono text-xs uppercase">Data</th>
                <th className="text-left py-3 px-4 text-zinc-400 font-mono text-xs uppercase">Status</th>
                <th className="text-left py-3 px-4 text-zinc-400 font-mono text-xs uppercase">Ações</th>
              </tr>
            </thead>
            <tbody>
              {releases.map((release) => (
                <tr
                  key={release.id}
                  className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{release.title}</div>
                    <div className="text-xs text-zinc-500 line-clamp-1 mt-1">{release.genre}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-zinc-300 font-mono text-sm">{release.band}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-zinc-300 text-sm">{release.album}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-zinc-300 text-sm">{formatDate(release.releaseDate)}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-zinc-300 text-sm">{getStatusLabel(release.status)}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(release)}
                        className="p-2 text-blue-400 hover:bg-blue-600/20 rounded transition-colors"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(release.slug, release.title)}
                        disabled={deletingSlug === release.slug}
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

