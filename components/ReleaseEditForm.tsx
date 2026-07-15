'use client';

import { useState, useRef } from 'react';
import { Save, X, Upload } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { RichTextEditor } from './RichTextEditor';

interface Release {
  id: string;
  slug: string;
  title: string;
  band: string;
  album: string;
  genre: string;
  releaseDate: string;
  description?: string;
  image?: string;
  status?: string;
}

interface ReleaseEditFormProps {
  release: Release;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ReleaseEditForm({ release, onSuccess, onCancel }: ReleaseEditFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    slug: release.slug,
    title: release.title,
    band: release.band,
    album: release.album,
    genre: release.genre,
    releaseDate: release.releaseDate ? new Date(release.releaseDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    description: release.description || '',
    image: release.image || '',
    status: release.status || 'ANNOUNCED',
  });

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
      await apiClient.updateRelease(release.slug, {
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

      alert('Lançamento atualizado com sucesso!');
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      alert(error.message || 'Erro ao atualizar lançamento');
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Editar Lançamento</h3>
        <button
          onClick={onCancel}
          className="p-2 text-zinc-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Título *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600"
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
            required
          />
          <p className="text-xs text-zinc-500 mt-1">Usado na URL do lançamento</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Banda *</label>
            <input
              type="text"
              value={formData.band}
              onChange={(e) => setFormData({ ...formData, band: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600"
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
                  id="release-edit-image-upload"
                  disabled={uploadingImage}
                />
                <label
                  htmlFor="release-edit-image-upload"
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
            type="button"
            onClick={onCancel}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
          >
            <Save size={18} />
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}

