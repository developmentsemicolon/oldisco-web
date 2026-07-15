'use client';

import { useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export function RadioControls() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const status = await apiClient.getRadioStatus();
      setIsPlaying(status.isPlaying);
      if (status.currentTrack) {
        setCurrentTrack(`${status.currentTrack.artist} - ${status.currentTrack.title}`);
      }
    } catch (error) {
      console.error('Erro ao buscar status:', error);
    }
  };

  const handleToggle = async () => {
    setLoading(true);
    try {
      if (isPlaying) {
        await apiClient.pauseRadio();
      } else {
        await apiClient.startRadio();
      }
      await fetchStatus();
    } catch (error) {
      console.error('Erro ao controlar rádio:', error);
      alert('Erro ao controlar a rádio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">Controles</h3>
      <div className="flex items-center gap-4">
        <button
          onClick={handleToggle}
          disabled={loading}
          className="w-12 h-12 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center disabled:opacity-50 transition-colors"
        >
          {isPlaying ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white ml-0.5" />}
        </button>
        <div>
          <div className="text-sm text-zinc-400">Status: {isPlaying ? 'Tocando' : 'Pausado'}</div>
          {currentTrack && (
            <div className="text-sm text-white mt-1">{currentTrack}</div>
          )}
        </div>
      </div>
    </div>
  );
}

