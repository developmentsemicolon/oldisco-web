'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export function RadioStats() {
  const [stats, setStats] = useState({
    totalTracks: 0,
    activeTracks: 0,
    archivedTracks: 0,
    totalPlays: 0,
    currentListeners: 0,
  });

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const data = await apiClient.getRadioStats();
      setStats(data);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">Estatísticas</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-2xl font-bold text-red-600">{stats.totalTracks}</div>
          <div className="text-sm text-zinc-400">Total de Músicas</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-red-600">{stats.activeTracks}</div>
          <div className="text-sm text-zinc-400">Músicas Ativas</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-red-600">{stats.totalPlays}</div>
          <div className="text-sm text-zinc-400">Total de Plays</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-red-600">{stats.currentListeners}</div>
          <div className="text-sm text-zinc-400">Ouvintes Agora</div>
        </div>
      </div>
    </div>
  );
}

