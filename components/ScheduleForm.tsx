'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { Schedule, Playlist } from '@/types';

const DAYS_OF_WEEK = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Segunda-feira' },
  { value: 2, label: 'Terça-feira' },
  { value: 3, label: 'Quarta-feira' },
  { value: 4, label: 'Quinta-feira' },
  { value: 5, label: 'Sexta-feira' },
  { value: 6, label: 'Sábado' },
];

interface ScheduleFormProps {
  schedule?: Schedule;
  playlists: Playlist[];
  onClose: () => void;
}

export function ScheduleForm({ schedule, playlists, onClose }: ScheduleFormProps) {
  const [formData, setFormData] = useState({
    dayOfWeek: schedule?.dayOfWeek ?? 1,
    startTime: schedule?.startTime ?? '08:00',
    endTime: schedule?.endTime ?? '12:00',
    playlistId: schedule?.playlistId ?? '',
    isActive: schedule?.isActive ?? true,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.playlistId) {
      alert('Selecione uma playlist');
      return;
    }

    if (formData.startTime >= formData.endTime) {
      alert('Horário de término deve ser após o horário de início');
      return;
    }

    setLoading(true);
    try {
      if (schedule) {
        await apiClient.updateSchedule(schedule.id, formData);
      } else {
        await apiClient.createSchedule(formData);
      }
      onClose();
    } catch (error: any) {
      alert(error.message || 'Erro ao salvar programação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">
          {schedule ? 'Editar Programação' : 'Nova Programação'}
        </h3>
        <button
          onClick={onClose}
          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Dia da Semana *</label>
          <select
            value={formData.dayOfWeek}
            onChange={(e) => setFormData({ ...formData, dayOfWeek: Number(e.target.value) })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
            required
          >
            {DAYS_OF_WEEK.map((day) => (
              <option key={day.value} value={day.value}>
                {day.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Horário de Início *</label>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Horário de Término *</label>
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Playlist *</label>
          <select
            value={formData.playlistId}
            onChange={(e) => setFormData({ ...formData, playlistId: e.target.value })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
            required
          >
            <option value="">Selecione uma playlist</option>
            {playlists.map((playlist) => (
              <option key={playlist.id} value={playlist.id}>
                {playlist.name} ({playlist.tracks.length}{' '}
                {playlist.tracks.length === 1 ? 'música' : 'músicas'})
              </option>
            ))}
          </select>
          {formData.playlistId &&
            playlists.find((p) => p.id === formData.playlistId)?.tracks.length === 0 && (
              <div className="text-xs text-yellow-500 mt-1">
                ⚠️ Esta playlist está vazia
              </div>
            )}
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 bg-zinc-800 border-zinc-700 rounded text-red-600 focus:ring-red-600"
            />
            <span className="text-sm text-zinc-400">Ativo</span>
          </label>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
          >
            {loading ? 'Salvando...' : schedule ? 'Atualizar' : 'Criar'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

