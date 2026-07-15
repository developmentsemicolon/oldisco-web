'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, User } from '@/lib/api-client';
import { BlogList } from '@/components/BlogList';
import { BlogEditForm } from '@/components/BlogEditForm';
import { BlogForm } from '@/components/BlogForm';
import Link from 'next/link';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image?: string;
  author?: {
    id: string;
    name: string;
    email: string;
  };
}

export default function BlogPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
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
        await fetchPosts();
      } catch (error) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const fetchPosts = async () => {
    try {
      const data = await apiClient.getBlogPosts();
      setPosts(data);
    } catch (error) {
      console.error('Erro ao buscar artigos:', error);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setShowAddForm(false);
  };

  const handleAddNew = () => {
    setShowAddForm(true);
    setEditingPost(null);
  };

  const handleCloseModal = () => {
    setEditingPost(null);
    setShowAddForm(false);
  };

  const handleSuccess = async () => {
    await fetchPosts();
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
          <h1 className="text-4xl font-bold mb-2">Gerenciar Conteúdo</h1>
          <p className="text-zinc-400 text-sm">Gerencie todos os artigos publicados</p>
        </div>

        <BlogList
          posts={posts}
          onRefresh={fetchPosts}
          onEdit={handleEdit}
          onAddNew={handleAddNew}
        />

        {/* Modal de Edição */}
        {editingPost && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <BlogEditForm
                post={editingPost}
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
                  <h3 className="text-xl font-bold text-white">Publicar Novo Artigo</h3>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 text-zinc-400 hover:text-white transition-colors"
                  >
                    <span className="text-2xl">×</span>
                  </button>
                </div>
                <BlogForm onSuccess={handleSuccess} hideTitle={true} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

