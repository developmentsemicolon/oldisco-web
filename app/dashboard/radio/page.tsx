'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, User } from '@/lib/api-client';
import { RadioControls } from '@/components/RadioControls';
import { RadioStats } from '@/components/RadioStats';
import { RadioUploadForm } from '@/components/RadioUploadForm';
import { RadioTrackList } from '@/components/RadioTrackList';
import { PlaylistManager } from '@/components/PlaylistManager';
import { ScheduleManager } from '@/components/ScheduleManager';
import Link from 'next/link';

export default function RadioDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState<'tracks' | 'playlists' | 'schedules'>('tracks');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await apiClient.getMe();
        if (userData.role !== 'ADMIN') {
          router.push('/dashboard');
          return;
        }
        setUser(userData);
      } catch (error) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 pb-32">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 mt-16">
          <Link href="/dashboard" className="text-red-600 hover:text-red-500 mb-4 inline-block">
            ← Voltar ao Dashboard
          </Link>
          <h1 className="text-4xl font-bold">Gerenciamento da Rádio</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <RadioControls />
          <RadioStats />
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-zinc-800">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('tracks')}
              className={`px-4 py-2 font-semibold transition-colors ${
                activeTab === 'tracks'
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Músicas
            </button>
            <button
              onClick={() => setActiveTab('playlists')}
              className={`px-4 py-2 font-semibold transition-colors ${
                activeTab === 'playlists'
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Playlists
            </button>
            <button
              onClick={() => setActiveTab('schedules')}
              className={`px-4 py-2 font-semibold transition-colors ${
                activeTab === 'schedules'
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Programação
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'tracks' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RadioUploadForm onUpload={handleRefresh} />
            <RadioTrackList key={refreshKey} onUpdate={handleRefresh} />
          </div>
        )}

        {activeTab === 'playlists' && (
          <div className="grid grid-cols-1 gap-6">
            <PlaylistManager />
          </div>
        )}

        {activeTab === 'schedules' && (
          <div className="grid grid-cols-1 gap-6">
            <ScheduleManager />
          </div>
        )}
      </div>
    </div>
  );
}

