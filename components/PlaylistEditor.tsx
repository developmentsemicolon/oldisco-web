'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Trash2, GripVertical, Edit2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { Playlist, RadioTrack } from '@/types';

interface PlaylistEditorProps {
  playlist: Playlist;
  onClose: () => void;
}

export function PlaylistEditor({ playlist, onClose }: PlaylistEditorProps) {
  const [playlistData, setPlaylistData] = useState<Playlist>(playlist);
  const [allTracks, setAllTracks] = useState<RadioTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddTrack, setShowAddTrack] = useState(false);
  const [selectedTrackId, setSelectedTrackId] = useState('');
  const [showEditInfo, setShowEditInfo] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: playlist.name, description: playlist.description || '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [playlistDetails, tracks] = await Promise.all([
        apiClient.getPlaylist(playlist.id),
        apiClient.getRadioTracks(),
      ]);
      setPlaylistData(playlistDetails);
      setEditFormData({ name: playlistDetails.name, description: playlistDetails.description || '' });
      setAllTracks(tracks.filter((t: RadioTrack) => t.status === 'ACTIVE'));
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTrack = async () => {
    if (!selectedTrackId) {
      alert('Selecione uma música');
      return;
    }

    try {
      await apiClient.addTrackToPlaylist(playlist.id, selectedTrackId);
      await fetchData();
      setSelectedTrackId('');
      setShowAddTrack(false);
    } catch (error: any) {
      alert(error.message || 'Erro ao adicionar música');
    }
  };

  const handleRemoveTrack = async (trackId: string) => {
    if (!confirm('Remover esta música da playlist?')) {
      return;
    }

    try {
      await apiClient.removeTrackFromPlaylist(playlist.id, trackId);
      await fetchData();
    } catch (error: any) {
      alert(error.message || 'Erro ao remover música');
    }
  };

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData.name.trim()) {
      alert('Nome da playlist é obrigatório');
      return;
    }

    try {
      await apiClient.updatePlaylist(playlist.id, editFormData);
      await fetchData();
      setShowEditInfo(false);
    } catch (error: any) {
      alert(error.message || 'Erro ao atualizar playlist');
    }
  };

  const handleReorder = async (trackId: string, direction: 'up' | 'down') => {
    const tracks = [...playlistData.tracks];
    const index = tracks.findIndex((t) => t.track.id === trackId);

    if (index === -1) return;

    if (direction === 'up' && index > 0) {
      [tracks[index], tracks[index - 1]] = [tracks[index - 1], tracks[index]];
    } else if (direction === 'down' && index < tracks.length - 1) {
      [tracks[index], tracks[index + 1]] = [tracks[index + 1], tracks[index]];
    } else {
      return;
    }

    // Atualiza a ordem
    const reorderedTracks = tracks.map((t, i) => ({
      trackId: t.track.id,
      order: i,
    }));

    try {
      await apiClient.reorderPlaylistTracks(playlist.id, reorderedTracks);
      await fetchData();
    } catch (error: any) {
      alert(error.message || 'Erro ao reordenar músicas');
    }
  };

  const availableTracks = allTracks.filter(
    (track) => !playlistData.tracks.some((pt) => pt.track.id === track.id)
  );

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
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-1">{playlistData.name}</h3>
          {playlistData.description && (
            <p className="text-sm text-zinc-400">{playlistData.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setShowEditInfo(!showEditInfo);
              setEditFormData({ name: playlistData.name, description: playlistData.description || '' });
            }}
            className="p-2 text-blue-400 hover:bg-blue-400/20 rounded transition-colors"
            title="Editar informações"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {showEditInfo && (
        <form onSubmit={handleUpdateInfo} className="mb-4 p-4 bg-zinc-800 rounded border border-zinc-700">
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Nome *</label>
              <input
                type="text"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                className="w-full bg-zinc-700 border border-zinc-600 rounded px-3 py-2 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Descrição</label>
              <textarea
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                className="w-full bg-zinc-700 border border-zinc-600 rounded px-3 py-2 text-white"
                rows={2}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
              >
                Salvar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowEditInfo(false);
                  setEditFormData({ name: playlistData.name, description: playlistData.description || '' });
                }}
                className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="mb-4">
        <button
          onClick={() => setShowAddTrack(!showAddTrack)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
        >
          <Plus size={18} />
          Adicionar Música
        </button>
      </div>

      {showAddTrack && (
        <div className="mb-4 p-4 bg-zinc-800 rounded border border-zinc-700">
          <div className="flex gap-2">
            <select
              value={selectedTrackId}
              onChange={(e) => setSelectedTrackId(e.target.value)}
              className="flex-1 bg-zinc-700 border border-zinc-600 rounded px-3 py-2 text-white"
            >
              <option value="">Selecione uma música</option>
              {availableTracks.map((track) => (
                <option key={track.id} value={track.id}>
                  {track.artist} - {track.title}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddTrack}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
            >
              Adicionar
            </button>
            <button
              onClick={() => {
                setShowAddTrack(false);
                setSelectedTrackId('');
              }}
              className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {playlistData.tracks.length === 0 ? (
          <div className="text-zinc-400 text-center py-8">Nenhuma música na playlist</div>
        ) : (
          playlistData.tracks.map((item, index) => (
            <div
              key={item.track.id}
              className="bg-zinc-800 border border-zinc-700 rounded p-4 flex items-center gap-2 hover:border-red-600 transition-colors"
            >
              <div className="flex items-center gap-2 flex-shrink-0">
                <GripVertical size={18} className="text-zinc-500" />
                <span className="text-zinc-500 text-sm w-6">{index + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-white truncate">
                  {item.track.artist} - {item.track.title}
                </div>
                <div className="text-sm text-zinc-400">
                  {item.track.band && `${item.track.band} • `}
                  {item.track.album && `${item.track.album} • `}
                  {item.track.genre}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => handleReorder(item.track.id, 'up')}
                  disabled={index === 0}
                  className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded transition-colors disabled:opacity-30"
                  title="Mover para cima"
                >
                  ↑
                </button>
                <button
                  onClick={() => handleReorder(item.track.id, 'down')}
                  disabled={index === playlistData.tracks.length - 1}
                  className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded transition-colors disabled:opacity-30"
                  title="Mover para baixo"
                >
                  ↓
                </button>
                <button
                  onClick={() => handleRemoveTrack(item.track.id)}
                  className="p-2 text-red-600 hover:bg-red-600/20 rounded transition-colors"
                  title="Remover"
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

