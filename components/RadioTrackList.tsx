'use client';

import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface Track {
  id: string;
  title: string;
  artist: string;
  band?: string;
  album?: string;
  genre?: string;
  status: string;
  playCount: number;
  priority: number;
}

export function RadioTrackList({ onUpdate }: { onUpdate?: () => void }) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    try {
      const data = await apiClient.getRadioTracks();
      setTracks(data);
    } catch (error) {
      console.error('Erro ao buscar músicas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta música?')) {
      return;
    }

    try {
      await apiClient.deleteTrack(id);
      await fetchTracks();
      if (onUpdate) {
        onUpdate();
      }
    } catch (error: any) {
      alert(error.message || 'Erro ao deletar música');
    }
  };

  if (loading) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <div className="text-zinc-400">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">Playlist ({tracks.length})</h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {tracks.length === 0 ? (
          <div className="text-zinc-400 text-center py-8">Nenhuma música na playlist</div>
        ) : (
          tracks.map((track) => (
            <div
              key={track.id}
              className="bg-zinc-800 border border-zinc-700 rounded p-4 flex items-center justify-between hover:border-red-600 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="font-bold text-white truncate">
                  {track.artist} - {track.title}
                </div>
                <div className="text-sm text-zinc-400">
                  {track.band && `${track.band} • `}
                  {track.album && `${track.album} • `}
                  {track.genre}
                </div>
                <div className="text-xs text-zinc-500 mt-1">
                  Plays: {track.playCount} • Prioridade: {track.priority} • Status: {track.status}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => handleDelete(track.id)}
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

