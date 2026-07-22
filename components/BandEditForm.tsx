'use client';

import { useState, useRef } from 'react';
import { Save, X, Upload } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { RichTextEditor } from './RichTextEditor';
import { Genre } from '@/types';

interface Band {
  id: string;
  name: string;
  slug: string;
  genre: string;
  description?: string;
  logo?: string;
}

interface BandEditFormProps {
  band: Band;
  onSuccess: () => void;
  onCancel: () => void;
}

export function BandEditForm({ band, onSuccess, onCancel }: BandEditFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: band.name,
    genre: band.genre,
    description: band.description || '',
    logo: band.logo || '',
  });

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setUploadingLogo(true);
    try {
      const result = await apiClient.uploadBandImage(file);
      setFormData((prev) => ({ ...prev, logo: result.url }));
      alert('Logo enviada com sucesso!');
    } catch (error: any) {
      alert(error.message || 'Erro ao enviar logo');
    } finally {
      setUploadingLogo(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('O nome da banda é obrigatório');
      return;
    }

    if (!formData.genre.trim()) {
      alert('O gênero é obrigatório');
      return;
    }

    setLoading(true);
    try {
      await apiClient.updateBand(band.slug, {
        name: formData.name.trim(),
        genre: formData.genre.trim(),
        description: formData.description || undefined,
        logo: formData.logo.trim() || undefined,
      });

      alert('Banda atualizada com sucesso!');
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      alert(error.message || 'Erro ao atualizar banda');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Editar Banda</h3>
        <button
          onClick={onCancel}
          className="p-2 text-zinc-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Nome da Banda *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Gênero *</label>
          <select
            value={formData.genre}
            onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600"
            required
          >
            <option value="">Selecione um gênero</option>
            <option value={Genre.BLACK_METAL}>{Genre.BLACK_METAL}</option>
            <option value={Genre.THRASH_METAL}>{Genre.THRASH_METAL}</option>
            <option value={Genre.DOOM_METAL}>{Genre.DOOM_METAL}</option>
            <option value={Genre.DEATH_METAL}>{Genre.DEATH_METAL}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Descrição</label>
          <RichTextEditor
            value={formData.description}
            onChange={(value) => setFormData({ ...formData, description: value })}
            placeholder="Descrição da banda..."
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Logo</label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleLogoUpload}
                className="hidden"
                id="band-edit-logo-upload"
                disabled={uploadingLogo}
              />
              <label
                htmlFor="band-edit-logo-upload"
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white cursor-pointer hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${uploadingLogo ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Upload size={16} />
                {uploadingLogo ? 'Enviando...' : 'Enviar Logo'}
              </label>
              {formData.logo && (
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, logo: '' }))}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                  title="Remover logo"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <input
              type="url"
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600 text-sm"
              placeholder="Ou cole a URL da logo aqui"
            />
            {formData.logo && (
              <div className="mt-2">
                <img
                  src={formData.logo}
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
