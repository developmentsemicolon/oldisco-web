'use client';

import { useState, useRef } from 'react';
import { Save, Upload, X, ChevronUp, ChevronDown } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface ZineFormProps {
  onSuccess?: () => void;
  hideTitle?: boolean;
}

export function ZineForm({ onSuccess, hideTitle = false }: ZineFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingPages, setUploadingPages] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const pagesInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: '',
    editionNumber: 1,
    description: '',
    coverImage: '',
    pages: [] as string[],
    published: true,
  });

  const validateImage = (file: File) => {
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      alert('Por favor, selecione uma imagem válida (JPEG, PNG ou WebP)');
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 10MB');
      return false;
    }
    return true;
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !validateImage(file)) return;

    setUploadingCover(true);
    try {
      const result = await apiClient.uploadZineImage(file);
      setFormData((prev) => ({ ...prev, coverImage: result.url }));
    } catch (error: any) {
      alert(error.message || 'Erro ao enviar capa');
    } finally {
      setUploadingCover(false);
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  };

  const handlePagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingPages(true);
    try {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!validateImage(file)) continue;
        const result = await apiClient.uploadZineImage(file);
        urls.push(result.url);
      }
      if (urls.length > 0) {
        setFormData((prev) => ({ ...prev, pages: [...prev.pages, ...urls] }));
      }
    } catch (error: any) {
      alert(error.message || 'Erro ao enviar páginas');
    } finally {
      setUploadingPages(false);
      if (pagesInputRef.current) pagesInputRef.current.value = '';
    }
  };

  const movePage = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= formData.pages.length) return;
    const pages = [...formData.pages];
    [pages[index], pages[newIndex]] = [pages[newIndex], pages[index]];
    setFormData((prev) => ({ ...prev, pages }));
  };

  const removePage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      pages: prev.pages.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('O título é obrigatório');
      return;
    }
    if (!formData.editionNumber || formData.editionNumber < 1) {
      alert('O número da edição é obrigatório');
      return;
    }
    if (formData.pages.length === 0) {
      alert('Adicione pelo menos uma página');
      return;
    }

    setLoading(true);
    try {
      await apiClient.createZine({
        title: formData.title.trim(),
        editionNumber: formData.editionNumber,
        description: formData.description || undefined,
        coverImage: formData.coverImage.trim() || undefined,
        pages: formData.pages,
        published: formData.published,
      });

      alert('Edição cadastrada com sucesso!');
      setFormData({
        title: '',
        editionNumber: 1,
        description: '',
        coverImage: '',
        pages: [],
        published: true,
      });
      onSuccess?.();
    } catch (error: any) {
      alert(error.message || 'Erro ao cadastrar edição');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={hideTitle ? '' : 'bg-zinc-900 border border-zinc-800 rounded-lg p-6'}>
      {!hideTitle && <h3 className="text-xl font-bold mb-6 text-white">Cadastrar Nova Edição</h3>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Título *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600"
              placeholder="Ex: Oldisco Zine"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Número da Edição *</label>
            <input
              type="number"
              min={1}
              value={formData.editionNumber}
              onChange={(e) => setFormData({ ...formData, editionNumber: parseInt(e.target.value) || 1 })}
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
            rows={3}
            placeholder="Descrição da edição..."
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Capa</label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                ref={coverInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleCoverUpload}
                className="hidden"
                id="zine-cover-upload"
                disabled={uploadingCover}
              />
              <label
                htmlFor="zine-cover-upload"
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white cursor-pointer hover:bg-zinc-700 transition-colors ${uploadingCover ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Upload size={16} />
                {uploadingCover ? 'Enviando...' : 'Enviar Capa'}
              </label>
              {formData.coverImage && (
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, coverImage: '' }))}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            {formData.coverImage && (
              <img
                src={formData.coverImage}
                alt="Capa"
                className="w-32 h-44 object-cover rounded border border-zinc-700"
              />
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Páginas * (ordem = leitura)</label>
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                ref={pagesInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handlePagesUpload}
                className="hidden"
                id="zine-pages-upload"
                disabled={uploadingPages}
              />
              <label
                htmlFor="zine-pages-upload"
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white cursor-pointer hover:bg-zinc-700 transition-colors ${uploadingPages ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Upload size={16} />
                {uploadingPages ? 'Enviando...' : 'Adicionar Páginas'}
              </label>
            </div>

            {formData.pages.length > 0 && (
              <div className="space-y-2">
                {formData.pages.map((url, index) => (
                  <div key={`${url}-${index}`} className="flex items-center gap-3 bg-zinc-800 border border-zinc-700 rounded p-2">
                    <img src={url} alt={`Página ${index + 1}`} className="w-12 h-16 object-cover rounded" />
                    <span className="flex-1 text-sm text-zinc-300 font-mono">Página {index + 1}</span>
                    <button type="button" onClick={() => movePage(index, -1)} disabled={index === 0} className="p-1 text-zinc-400 hover:text-white disabled:opacity-30">
                      <ChevronUp size={16} />
                    </button>
                    <button type="button" onClick={() => movePage(index, 1)} disabled={index === formData.pages.length - 1} className="p-1 text-zinc-400 hover:text-white disabled:opacity-30">
                      <ChevronDown size={16} />
                    </button>
                    <button type="button" onClick={() => removePage(index)} className="p-1 text-red-600 hover:bg-red-600/20 rounded">
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
            id="zine-published"
            checked={formData.published}
            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
            className="w-4 h-4 text-red-600 bg-zinc-800 border-zinc-700 rounded focus:ring-red-600"
          />
          <label htmlFor="zine-published" className="text-sm text-zinc-400">
            Publicado
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
        >
          <Save size={18} />
          {loading ? 'Cadastrando...' : 'Cadastrar Edição'}
        </button>
      </form>
    </div>
  );
}
