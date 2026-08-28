'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, User } from '@/lib/api-client';
import { ZineAdminList } from '@/components/ZineAdminList';
import { ZineEditForm } from '@/components/ZineEditForm';
import { ZineForm } from '@/components/ZineForm';
import { ZineEdition } from '@/types';
import Link from 'next/link';

export default function ZinesDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [zines, setZines] = useState<ZineEdition[]>([]);
  const [editingZine, setEditingZine] = useState<ZineEdition | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await apiClient.getMe();
        if (userData.role !== 'ADMIN') {
          router.push('/dashboard');
          return;
        }
        setUser(userData);
        await fetchZines();
      } catch (error) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const fetchZines = async () => {
    try {
      const data = await apiClient.getZines(false);
      setZines(data);
    } catch (error) {
      console.error('Erro ao buscar zines:', error);
    }
  };

  const handleEdit = (zine: ZineEdition) => {
    setEditingZine(zine);
    setShowAddForm(false);
  };

  const handleAddNew = () => {
    setShowAddForm(true);
    setEditingZine(null);
  };

  const handleCloseModal = () => {
    setEditingZine(null);
    setShowAddForm(false);
  };

  const handleSuccess = async () => {
    await fetchZines();
    handleCloseModal();
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
          <h1 className="text-4xl font-bold mb-2">Gerenciar Zines</h1>
          <p className="text-zinc-400 text-sm">Gerencie as edições da zine</p>
        </div>

        <ZineAdminList
          zines={zines}
          onRefresh={fetchZines}
          onEdit={handleEdit}
          onAddNew={handleAddNew}
        />

        {editingZine && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <ZineEditForm
                zine={editingZine}
                onSuccess={handleSuccess}
                onCancel={handleCloseModal}
              />
            </div>
          </div>
        )}

        {showAddForm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Cadastrar Nova Edição</h3>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 text-zinc-400 hover:text-white transition-colors"
                  >
                    <span className="text-2xl">×</span>
                  </button>
                </div>
                <ZineForm onSuccess={handleSuccess} hideTitle={true} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
