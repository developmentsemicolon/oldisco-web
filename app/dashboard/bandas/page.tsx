'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, User } from '@/lib/api-client';
import { BandAdminList } from '@/components/BandAdminList';
import { BandEditForm } from '@/components/BandEditForm';
import { BandForm } from '@/components/BandForm';
import Link from 'next/link';

interface Band {
  id: string;
  name: string;
  slug: string;
  genre: string;
  description?: string;
  logo?: string;
}

export default function BandasDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [bands, setBands] = useState<Band[]>([]);
  const [editingBand, setEditingBand] = useState<Band | null>(null);
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
        await fetchBands();
      } catch (error) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const fetchBands = async () => {
    try {
      const data = await apiClient.getBands();
      setBands(data);
    } catch (error) {
      console.error('Erro ao buscar bandas:', error);
    }
  };

  const handleEdit = (band: Band) => {
    setEditingBand(band);
    setShowAddForm(false);
  };

  const handleAddNew = () => {
    setShowAddForm(true);
    setEditingBand(null);
  };

  const handleCloseModal = () => {
    setEditingBand(null);
    setShowAddForm(false);
  };

  const handleSuccess = async () => {
    await fetchBands();
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
          <h1 className="text-4xl font-bold mb-2">Gerenciar Bandas</h1>
          <p className="text-zinc-400 text-sm">Gerencie todas as bandas do catálogo</p>
        </div>

        <BandAdminList
          bands={bands}
          onRefresh={fetchBands}
          onEdit={handleEdit}
          onAddNew={handleAddNew}
        />

        {/* Modal de Edição */}
        {editingBand && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <BandEditForm
                band={editingBand}
                onSuccess={handleSuccess}
                onCancel={handleCloseModal}
              />
            </div>
          </div>
        )}

        {/* Modal de Cadastro */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Cadastrar Nova Banda</h3>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 text-zinc-400 hover:text-white transition-colors"
                  >
                    <span className="text-2xl">×</span>
                  </button>
                </div>
                <BandForm onSuccess={handleSuccess} hideTitle={true} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
