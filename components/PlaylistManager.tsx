'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Music } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { Playlist } from '@/types';
import { PlaylistEditor } from './PlaylistEditor';

export function PlaylistManager() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const data = await apiClient.getAllPlaylists();
      setPlaylists(data);
    } catch (error) {
      console.error('Erro ao buscar playlists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Nome da playlist é obrigatório');
      return;
    }

    try {
      await apiClient.createPlaylist(formData);
      await fetchPlaylists();
      setFormData({ name: '', description: '' });
      setShowCreateForm(false);
    } catch (error: any) {
      alert(error.message || 'Erro ao criar playlist');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta playlist?')) {
      return;
    }

    try {
      await apiClient.deletePlaylist(id);
      await fetchPlaylists();
      if (editingPlaylist?.id === id) {
        setEditingPlaylist(null);
      }
    } catch (error: any) {
      alert(error.message || 'Erro ao deletar playlist');
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const playlist = await apiClient.getPlaylist(id);
      setEditingPlaylist(playlist);
    } catch (error: any) {
      alert(error.message || 'Erro ao carregar playlist');
    }
  };

  if (editingPlaylist) {
    return (
      <PlaylistEditor
        playlist={editingPlaylist}
        onClose={() => {
          setEditingPlaylist(null);
          fetchPlaylists();
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <div className="text-zinc-400">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Playlists</h3>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
        >
          <Plus size={18} />
          Nova Playlist
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreate} className="mb-6 p-4 bg-zinc-800 rounded border border-zinc-700">
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Nome *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-zinc-700 border border-zinc-600 rounded px-3 py-2 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-zinc-700 border border-zinc-600 rounded px-3 py-2 text-white"
                rows={2}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
              >
                Criar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setFormData({ name: '', description: '' });
                }}
                className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {playlists.length === 0 ? (
          <div className="text-zinc-400 text-center py-8">Nenhuma playlist criada</div>
        ) : (
          playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="bg-zinc-800 border border-zinc-700 rounded p-4 flex items-center justify-between hover:border-red-600 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Music size={18} className="text-red-600" />
                  <div className="font-bold text-white truncate">{playlist.name}</div>
                </div>
                {playlist.description && (
                  <div className="text-sm text-zinc-400 mb-2">{playlist.description}</div>
                )}
                <div className="text-xs text-zinc-500">
                  {playlist.tracks.length} {playlist.tracks.length === 1 ? 'música' : 'músicas'}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => handleEdit(playlist.id)}
                  className="p-2 text-blue-400 hover:bg-blue-400/20 rounded transition-colors"
                  title="Editar"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(playlist.id)}
                  className="p-2 text-red-600 hover:bg-red-600/20 rounded transition-colors"
                  title="Deletar"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

