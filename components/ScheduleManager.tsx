'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Calendar } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { Schedule, Playlist } from '@/types';
import { ScheduleForm } from './ScheduleForm';

const DAYS_OF_WEEK = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

export function ScheduleManager() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [schedulesData, playlistsData] = await Promise.all([
        apiClient.getAllSchedules(),
        apiClient.getAllPlaylists(),
      ]);
      setSchedules(schedulesData);
      setPlaylists(playlistsData);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta programação?')) {
      return;
    }

    try {
      await apiClient.deleteSchedule(id);
      await fetchData();
      if (editingSchedule?.id === id) {
        setEditingSchedule(null);
      }
    } catch (error: any) {
      alert(error.message || 'Erro ao deletar programação');
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const schedule = await apiClient.getSchedule(id);
      setEditingSchedule(schedule);
    } catch (error: any) {
      alert(error.message || 'Erro ao carregar programação');
    }
  };

  const handleToggleActive = async (schedule: Schedule) => {
    try {
      await apiClient.updateSchedule(schedule.id, {
        isActive: !schedule.isActive,
      });
      await fetchData();
    } catch (error: any) {
      alert(error.message || 'Erro ao atualizar programação');
    }
  };

  if (editingSchedule) {
    return (
      <ScheduleForm
        schedule={editingSchedule}
        playlists={playlists}
        onClose={() => {
          setEditingSchedule(null);
          fetchData();
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

  // Agrupa schedules por dia da semana
  const schedulesByDay = schedules.reduce((acc, schedule) => {
    if (!acc[schedule.dayOfWeek]) {
      acc[schedule.dayOfWeek] = [];
    }
    acc[schedule.dayOfWeek].push(schedule);
    return acc;
  }, {} as Record<number, Schedule[]>);

  // Ordena por horário de início
  Object.keys(schedulesByDay).forEach((day) => {
    schedulesByDay[Number(day)].sort((a, b) => a.startTime.localeCompare(b.startTime));
  });

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Programação Semanal</h3>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
        >
          <Plus size={18} />
          Nova Programação
        </button>
      </div>

      {showCreateForm && (
        <ScheduleForm
          playlists={playlists}
          onClose={() => {
            setShowCreateForm(false);
            fetchData();
          }}
        />
      )}

      <div className="space-y-6 max-h-96 overflow-y-auto">
        {Object.keys(schedulesByDay).length === 0 ? (
          <div className="text-zinc-400 text-center py-8">Nenhuma programação criada</div>
        ) : (
          [0, 1, 2, 3, 4, 5, 6].map((day) => {
            const daySchedules = schedulesByDay[day] || [];
            if (daySchedules.length === 0) return null;

            return (
              <div key={day} className="border-b border-zinc-800 pb-4 last:border-0">
                <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Calendar size={18} className="text-red-600" />
                  {DAYS_OF_WEEK[day]}
                </h4>
                <div className="space-y-2">
                  {daySchedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className={`bg-zinc-800 border rounded p-4 flex items-center justify-between ${
                        schedule.isActive
                          ? 'border-zinc-700 hover:border-red-600'
                          : 'border-zinc-800 opacity-60'
                      } transition-colors`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-white">
                            {schedule.startTime} - {schedule.endTime}
                          </span>
                          {!schedule.isActive && (
                            <span className="text-xs bg-zinc-700 text-zinc-400 px-2 py-1 rounded">
                              Inativo
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-zinc-400">
                          Playlist: {schedule.playlist.name}
                        </div>
                        {schedule?.playlist?.tracks?.length === 0 && (
                          <div className="text-xs text-yellow-500 mt-1">
                            ⚠️ Playlist vazia
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleToggleActive(schedule)}
                          className={`px-3 py-1 text-xs rounded transition-colors ${
                            schedule.isActive
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-300'
                          }`}
                        >
                          {schedule.isActive ? 'Ativo' : 'Inativo'}
                        </button>
                        <button
                          onClick={() => handleEdit(schedule.id)}
                          className="p-2 text-blue-400 hover:bg-blue-400/20 rounded transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(schedule.id)}
                          className="p-2 text-red-600 hover:bg-red-600/20 rounded transition-colors"
                          title="Deletar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

