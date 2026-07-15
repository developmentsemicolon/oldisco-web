'use client';

import { useState } from 'react';
import { Upload, X, Plus } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { Genre } from '@/types';

interface ImagePreview {
  file: File;
  preview: string;
}

interface ProductFormProps {
  onSuccess?: () => void;
  hideTitle?: boolean;
}

export function ProductForm({ onSuccess, hideTitle = false }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    band: '',
    album: '',
    genre: '',
    year: new Date().getFullYear(),
    price: 0,
    stock: 0,
    description: '',
    available: true,
  });
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [tracklistSideA, setTracklistSideA] = useState<string[]>(['']);
  const [tracklistSideB, setTracklistSideB] = useState<string[]>([]);
  const [hasSideB, setHasSideB] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: ImagePreview[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        const preview = URL.createObjectURL(file);
        newImages.push({ file, preview });
      }
    }
    setImages([...images, ...newImages]);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    newImages.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages(newImages);
  };

  const addTrackSideA = () => {
    setTracklistSideA([...tracklistSideA, '']);
  };

  const removeTrackSideA = (index: number) => {
    setTracklistSideA(tracklistSideA.filter((_, i) => i !== index));
  };

  const updateTrackSideA = (index: number, value: string) => {
    const updated = [...tracklistSideA];
    updated[index] = value;
    setTracklistSideA(updated);
  };

  const addTrackSideB = () => {
    if (!hasSideB) {
      setHasSideB(true);
      setTracklistSideB(['']);
    } else {
      setTracklistSideB([...tracklistSideB, '']);
    }
  };

  const removeTrackSideB = (index: number) => {
    const updated = tracklistSideB.filter((_, i) => i !== index);
    setTracklistSideB(updated);
    if (updated.length === 0) {
      setHasSideB(false);
    }
  };

  const updateTrackSideB = (index: number, value: string) => {
    const updated = [...tracklistSideB];
    updated[index] = value;
    setTracklistSideB(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      alert('Selecione pelo menos uma imagem');
      return;
    }

    // Filtrar faixas vazias
    const sideA = tracklistSideA.filter(t => t.trim() !== '');
    const sideB = hasSideB ? tracklistSideB.filter(t => t.trim() !== '') : undefined;

    const tracklist = sideA.length > 0 ? {
      sideA,
      ...(sideB && sideB.length > 0 ? { sideB } : {})
    } : undefined;

    setLoading(true);
    try {
      await apiClient.createProduct({
        ...formData,
        images: images.map((img) => img.file),
        tracklist,
      });

      alert('Produto cadastrado com sucesso!');
      setFormData({
        band: '',
        album: '',
        genre: '',
        year: new Date().getFullYear(),
        price: 0,
        stock: 0,
        description: '',
        available: true,
      });
      images.forEach((img) => URL.revokeObjectURL(img.preview));
      setImages([]);
      setTracklistSideA(['']);
      setTracklistSideB([]);
      setHasSideB(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      alert(error.message || 'Erro ao cadastrar produto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={hideTitle ? '' : 'bg-zinc-900 border border-zinc-800 rounded-lg p-6'}>
      {!hideTitle && <h3 className="text-xl font-bold mb-6 text-white">Cadastrar Novo Produto</h3>}
      <form onSubmit={handleSubmit} className="space-y-4">
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
            <select
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600"
              required
            >
              <option value="">Selecione um gênero</option>
              <option value={Genre.BLACK_METAL}>{Genre.BLACK_METAL}</option>
              <option value={Genre.DEATH_METAL}>{Genre.DEATH_METAL}</option>
              <option value={Genre.THRASH_METAL}>{Genre.THRASH_METAL}</option>
              <option value={Genre.DOOM_METAL}>{Genre.DOOM_METAL}</option>
              <option value={Genre.GRINDCORE}>{Genre.GRINDCORE}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Ano *</label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || new Date().getFullYear() })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600"
              min="1900"
              max={new Date().getFullYear() + 1}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Preço (R$) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Quantidade em Estoque *</label>
            <input
              type="number"
              min="0"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Descrição</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600"
            rows={4}
            placeholder="Descrição do produto..."
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-2">Tracklist</label>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-zinc-500 uppercase">Lado A</label>
                <button
                  type="button"
                  onClick={addTrackSideA}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 text-white rounded transition-colors"
                >
                  <Plus size={14} />
                  Adicionar Faixa
                </button>
              </div>
              <div className="space-y-2">
                {tracklistSideA.map((track, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={track}
                      onChange={(e) => updateTrackSideA(index, e.target.value)}
                      placeholder={`Faixa ${index + 1}`}
                      className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-red-600"
                    />
                    {tracklistSideA.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTrackSideA(index)}
                        className="p-2 text-red-600 hover:bg-red-600/20 rounded transition-colors"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-zinc-500 uppercase">Lado B (Opcional)</label>
                <button
                  type="button"
                  onClick={addTrackSideB}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 text-white rounded transition-colors"
                >
                  <Plus size={14} />
                  {hasSideB ? 'Adicionar Faixa' : 'Adicionar Lado B'}
                </button>
              </div>
              {hasSideB && (
                <div className="space-y-2">
                  {tracklistSideB.map((track, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={track}
                        onChange={(e) => updateTrackSideB(index, e.target.value)}
                        placeholder={`Faixa ${index + 1}`}
                        className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-red-600"
                      />
                      <button
                        type="button"
                        onClick={() => removeTrackSideB(index)}
                        className="p-2 text-red-600 hover:bg-red-600/20 rounded transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Imagens *</label>
          <div className="space-y-4">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleImageChange}
              className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700"
            />
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded border border-zinc-700"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="available"
            checked={formData.available}
            onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
            className="w-4 h-4 text-red-600 bg-zinc-800 border-zinc-700 rounded focus:ring-red-600"
          />
          <label htmlFor="available" className="text-sm text-zinc-400">
            Produto disponível
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
        >
          <Upload size={18} />
          {loading ? 'Cadastrando...' : 'Cadastrar Produto'}
        </button>
      </form>
    </div>
  );
}

