'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export function RadioUploadForm({ onUpload }: { onUpload?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    band: '',
    album: '',
    genre: '',
  });
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('Selecione um arquivo de áudio');
      return;
    }

    setLoading(true);
    try {
      await apiClient.uploadTrack(file, formData);
      alert('Música enviada com sucesso!');
      setFormData({
        title: '',
        artist: '',
        band: '',
        album: '',
        genre: '',
      });
      setFile(null);
      if (onUpload) {
        onUpload();
      }
    } catch (error: any) {
      alert(error.message || 'Erro ao enviar música');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">Enviar Música</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Arquivo de Áudio *</label>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Título *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Artista *</label>
          <input
            type="text"
            value={formData.artist}
            onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Banda</label>
          <input
            type="text"
            value={formData.band}
            onChange={(e) => setFormData({ ...formData, band: e.target.value })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Álbum</label>
          <input
            type="text"
            value={formData.album}
            onChange={(e) => setFormData({ ...formData, album: e.target.value })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Gênero</label>
          <input
            type="text"
            value={formData.genre}
            onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
        >
          <Upload size={18} />
          {loading ? 'Enviando...' : 'Enviar Música'}
        </button>
      </form>
    </div>
  );
}

