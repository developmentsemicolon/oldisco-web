'use client';

import { useState, useRef } from 'react';
import { Save, Upload, X } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { RichTextEditor } from './RichTextEditor';
import { Genre } from '@/types';

interface BandFormProps {
  onSuccess?: () => void;
  hideTitle?: boolean;
}

export function BandForm({ onSuccess, hideTitle = false }: BandFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    genre: '',
    description: '',
    logo: '',
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
      await apiClient.createBand({
        name: formData.name.trim(),
        genre: formData.genre.trim(),
        description: formData.description || undefined,
        logo: formData.logo.trim() || undefined,
      });

      alert('Banda cadastrada com sucesso!');
      setFormData({
        name: '',
        genre: '',
        description: '',
        logo: '',
      });
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      alert(error.message || 'Erro ao cadastrar banda');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={hideTitle ? '' : 'bg-zinc-900 border border-zinc-800 rounded-lg p-6'}>
      {!hideTitle && <h3 className="text-xl font-bold mb-6 text-white">Cadastrar Nova Banda</h3>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Nome da Banda *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600"
            placeholder="Nome da banda"
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
                id="band-logo-upload"
                disabled={uploadingLogo}
              />
              <label
                htmlFor="band-logo-upload"
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
            type="submit"
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
          >
            <Save size={18} />
            {loading ? 'Cadastrando...' : 'Cadastrar Banda'}
          </button>
        </div>
      </form>
    </div>
  );
}
