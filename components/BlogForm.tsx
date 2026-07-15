'use client';

import { useState, useRef } from 'react';
import { Save, Upload, X } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { RichTextEditor } from './RichTextEditor';

interface BlogFormProps {
  onSuccess?: () => void;
  hideTitle?: boolean;
}

export function BlogForm({ onSuccess, hideTitle = false }: BlogFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    excerpt: '',
    content: '',
    image: '',
    date: new Date().toISOString().split('T')[0],
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    // Auto-gerar slug se estiver vazio ou se o slug atual for baseado no título anterior
    const shouldUpdateSlug = !formData.slug || formData.slug === generateSlug(formData.title);
    setFormData((prev) => ({
      ...prev,
      title,
      slug: shouldUpdateSlug ? generateSlug(title) : prev.slug,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      alert('Por favor, selecione uma imagem válida (JPEG, PNG ou WebP)');
      return;
    }

    // Validar tamanho (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 10MB');
      return;
    }

    setUploadingImage(true);
    try {
      const result = await apiClient.uploadBlogImage(file);
      setFormData((prev) => ({ ...prev, image: result.url }));
      alert('Imagem enviada com sucesso!');
    } catch (error: any) {
      alert(error.message || 'Erro ao enviar imagem');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.slug.trim()) {
      alert('O slug é obrigatório');
      return;
    }

    if (!formData.title.trim()) {
      alert('O título é obrigatório');
      return;
    }

    if (!formData.excerpt.trim()) {
      alert('O resumo é obrigatório');
      return;
    }

    // Remover tags HTML vazias e verificar se há conteúdo real
    const contentWithoutTags = formData.content.replace(/<[^>]*>/g, '').trim();
    if (!contentWithoutTags) {
      alert('O conteúdo é obrigatório');
      return;
    }

    setLoading(true);
    try {
      await apiClient.createBlogPost({
        slug: formData.slug.trim(),
        title: formData.title.trim(),
        excerpt: formData.excerpt.trim(),
        content: formData.content, // HTML não deve ter trim para preservar formatação
        image: formData.image.trim() || undefined,
        date: formData.date || undefined,
      });

      alert('Artigo publicado com sucesso!');
      setFormData({
        slug: '',
        title: '',
        excerpt: '',
        content: '',
        image: '',
        date: new Date().toISOString().split('T')[0],
      });
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      alert(error.message || 'Erro ao publicar artigo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={hideTitle ? '' : 'bg-zinc-900 border border-zinc-800 rounded-lg p-6'}>
      {!hideTitle && <h3 className="text-xl font-bold mb-6 text-white">Publicar Novo Artigo</h3>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Título *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600"
            placeholder="Título do artigo"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Slug *</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600 font-mono text-sm"
            placeholder="url-amigavel-do-artigo"
            required
          />
          <p className="text-xs text-zinc-500 mt-1">Usado na URL do artigo (gerado automaticamente a partir do título)</p>
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Resumo (Excerpt) *</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600"
            rows={3}
            placeholder="Breve descrição do artigo que aparecerá na listagem..."
            required
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Conteúdo *</label>
          <RichTextEditor
            value={formData.content}
            onChange={(value) => setFormData({ ...formData, content: value })}
            placeholder="Conteúdo completo do artigo..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Imagem</label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="blog-image-upload"
                  disabled={uploadingImage}
                />
                <label
                  htmlFor="blog-image-upload"
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white cursor-pointer hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Upload size={16} />
                  {uploadingImage ? 'Enviando...' : 'Enviar Imagem'}
                </label>
                {formData.image && (
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, image: '' }))}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                    title="Remover imagem"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600 text-sm"
                placeholder="Ou cole a URL da imagem aqui"
              />
              {formData.image && (
                <div className="mt-2">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded border border-zinc-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Data de Publicação</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
          >
            <Save size={18} />
            {loading ? 'Publicando...' : 'Publicar Artigo'}
          </button>
        </div>
      </form>
    </div>
  );
}

