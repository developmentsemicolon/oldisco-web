'use client';

import { useState, useRef } from 'react';
import { Save, Upload, X } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { RichTextEditor } from './RichTextEditor';

interface ReleaseFormProps {
  onSuccess?: () => void;
  hideTitle?: boolean;
}

export function ReleaseForm({ onSuccess, hideTitle = false }: ReleaseFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    band: '',
    album: '',
    genre: '',
    releaseDate: new Date().toISOString().split('T')[0],
    description: '',
    image: '',
    status: 'ANNOUNCED',
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

    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      alert('Por favor, selecione uma imagem válida (JPEG, PNG ou WebP)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 10MB');
      return;
    }

    setUploadingImage(true);
    try {
      const result = await apiClient.uploadReleaseImage(file);
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

    if (!formData.band.trim()) {
      alert('A banda é obrigatória');
      return;
    }

    if (!formData.album.trim()) {
      alert('O álbum é obrigatório');
      return;
    }

    if (!formData.genre.trim()) {
      alert('O gênero é obrigatório');
      return;
    }

    if (!formData.releaseDate) {
      alert('A data de lançamento é obrigatória');
      return;
    }

    setLoading(true);
    try {
      await apiClient.createRelease({
        slug: formData.slug.trim(),
        title: formData.title.trim(),
        band: formData.band.trim(),
        album: formData.album.trim(),
        genre: formData.genre.trim(),
        releaseDate: formData.releaseDate,
        description: formData.description || undefined,
        image: formData.image.trim() || undefined,
        status: formData.status,
      });

      alert('Lançamento cadastrado com sucesso!');
      setFormData({
        slug: '',
        title: '',
        band: '',
        album: '',
        genre: '',
        releaseDate: new Date().toISOString().split('T')[0],
        description: '',
        image: '',
        status: 'ANNOUNCED',
      });
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      alert(error.message || 'Erro ao cadastrar lançamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={hideTitle ? '' : 'bg-zinc-900 border border-zinc-800 rounded-lg p-6'}>
      {!hideTitle && <h3 className="text-xl font-bold mb-6 text-white">Cadastrar Novo Lançamento</h3>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Título *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600"
            placeholder="Título do lançamento"
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
            placeholder="url-amigavel-do-lancamento"
            required
          />
          <p className="text-xs text-zinc-500 mt-1">Usado na URL do lançamento (gerado automaticamente a partir do título)</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Banda *</label>
            <input
              type="text"
              value={formData.band}
              onChange={(e) => setFormData({ ...formData, band: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600"
              placeholder="Nome da banda"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Álbum *</label>
            <input
              type="text"
              value={formData.album}
              onChange={(e) => setFormData({ ...formData, album: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600"
              placeholder="Nome do álbum"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Gênero *</label>
            <input
              type="text"
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600"
              placeholder="Black Metal, Death Metal, etc."
              required
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Data de Lançamento *</label>
            <input
              type="date"
              value={formData.releaseDate}
              onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Descrição</label>
          <RichTextEditor
            value={formData.description}
            onChange={(value) => setFormData({ ...formData, description: value })}
            placeholder="Descrição do lançamento..."
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
                  id="release-image-upload"
                  disabled={uploadingImage}
                />
                <label
                  htmlFor="release-image-upload"
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
            <label className="block text-sm text-zinc-400 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600"
            >
              <option value="ANNOUNCED">Anunciado</option>
              <option value="COMING_SOON">Em Breve</option>
              <option value="RELEASED">Lançado</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
          >
            <Save size={18} />
            {loading ? 'Cadastrando...' : 'Cadastrar Lançamento'}
          </button>
        </div>
      </form>
    </div>
  );
}

