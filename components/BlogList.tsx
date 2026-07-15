'use client';

import { useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image?: string;
  author?: {
    id: string;
    name: string;
    email: string;
  };
}

interface BlogListProps {
  posts: BlogPost[];
  onRefresh: () => void;
  onEdit: (post: BlogPost) => void;
  onAddNew: () => void;
}

export function BlogList({ posts, onRefresh, onEdit, onAddNew }: BlogListProps) {
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Tem certeza que deseja excluir "${title}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    setDeletingSlug(slug);
    try {
      await apiClient.deleteBlogPost(slug);
      await onRefresh();
    } catch (error: any) {
      alert(error.message || 'Erro ao excluir artigo');
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

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Artigos Publicados ({posts.length})</h3>
        <button
          onClick={onAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded transition-colors"
        >
          <Plus size={18} />
          Novo Artigo
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="text-zinc-400 text-center py-12">
          <p className="mb-4">Nenhum artigo publicado ainda.</p>
          <button
            onClick={onAddNew}
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded transition-colors"
          >
            <Plus size={18} />
            Publicar Primeiro Artigo
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="text-left py-3 px-4 text-zinc-400 font-mono text-xs uppercase">Título</th>
                <th className="text-left py-3 px-4 text-zinc-400 font-mono text-xs uppercase">Slug</th>
                <th className="text-left py-3 px-4 text-zinc-400 font-mono text-xs uppercase">Data</th>
                <th className="text-left py-3 px-4 text-zinc-400 font-mono text-xs uppercase">Autor</th>
                <th className="text-left py-3 px-4 text-zinc-400 font-mono text-xs uppercase">Ações</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{post.title}</div>
                    <div className="text-xs text-zinc-500 line-clamp-1 mt-1">{post.excerpt}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-zinc-300 font-mono text-sm">{post.slug}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-zinc-300 text-sm">{formatDate(post.date)}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-zinc-300 text-sm">
                      {post.author?.name || post.author?.email || 'N/A'}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(post)}
                        className="p-2 text-blue-400 hover:bg-blue-600/20 rounded transition-colors"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(post.slug, post.title)}
                        disabled={deletingSlug === post.slug}
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

