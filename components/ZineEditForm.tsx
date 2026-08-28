'use client';

import { useState, useRef } from 'react';
import { Save, Upload, X } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { ZineEdition } from '@/types';
import { RichTextEditor } from '@/components/RichTextEditor';

interface ZineEditFormProps {
  zine: ZineEdition;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ZineEditForm({ zine, onSuccess, onCancel }: ZineEditFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: zine.title,
    editionNumber: zine.editionNumber,
    description: zine.description || '',
    coverImage: zine.coverImage || '',
    content: zine.content || '',
    published: zine.published,
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

  const uploadEditorImage = async (file: File) => {
    if (!validateImage(file)) {
      throw new Error('Imagem inválida');
    }
    const result = await apiClient.uploadZineImage(file);
    return result.url;
  };

  const isContentEmpty = (html: string) => {
    const text = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    return text.length === 0 && !html.includes('<img');
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
    if (isContentEmpty(formData.content)) {
      alert('O conteúdo é obrigatório');
      return;
    }

    setLoading(true);
    try {
      await apiClient.updateZine(zine.slug, {
        title: formData.title.trim(),
        editionNumber: formData.editionNumber,
        description: formData.description || undefined,
        coverImage: formData.coverImage.trim() || undefined,
        content: formData.content,
        published: formData.published,
      });

      alert('Edição atualizada com sucesso!');
      onSuccess();
    } catch (error: any) {
      alert(error.message || 'Erro ao atualizar edição');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Editar Edição</h3>
        <button onClick={onCancel} className="p-2 text-zinc-400 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                id="zine-edit-cover-upload"
                disabled={uploadingCover}
              />
              <label
                htmlFor="zine-edit-cover-upload"
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
              <img src={formData.coverImage} alt="Capa" className="w-32 h-44 object-cover rounded border border-zinc-700" />
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Conteúdo *</label>
          <RichTextEditor
            value={formData.content}
            onChange={(value) => setFormData({ ...formData, content: value })}
            placeholder="Escreva a edição e anexe imagens pelo botão de imagem..."
            uploadImage={uploadEditorImage}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="zine-edit-published"
            checked={formData.published}
            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
            className="w-4 h-4 text-red-600 bg-zinc-800 border-zinc-700 rounded focus:ring-red-600"
          />
          <label htmlFor="zine-edit-published" className="text-sm text-zinc-400">
            Publicado
          </label>
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
