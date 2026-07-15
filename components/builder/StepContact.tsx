'use client';

import { useState } from 'react';
import { Instagram, MessageCircle, Music2, User, Youtube, X } from 'lucide-react';
import type { BuilderProject } from '@/lib/packaging/types';
import { validateContact, validatePanels, hasBlockingErrors } from '@/lib/packaging/validation';
import { openWhatsApp } from '@/lib/packaging/whatsapp';
import { exportProjectZip, downloadBlob, editorToExportTransform, getEditorStageSize } from '@/lib/packaging/export';
import { getActivePanels, slugify } from '@/lib/packaging/utils';

interface StepContactProps {
  project: BuilderProject;
  onChange: (patch: Partial<BuilderProject>) => void;
  onBack: () => void;
  onExported: () => void;
}

export function StepContact({ project, onChange, onBack, onExported }: StepContactProps) {
  const [showModal, setShowModal] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const inputClass = (field: string) =>
    `w-full bg-black border p-4 font-mono text-sm outline-none transition-all placeholder:text-zinc-700 ${
      fieldErrors[field]
        ? 'border-red-600 focus:border-red-500'
        : 'border-zinc-800 focus:border-red-600'
    }`;

  const runExportIfNeeded = async (): Promise<boolean> => {
    if (project.exported) return true;
    setExporting(true);
    try {
      const exportProject: BuilderProject = { ...project, panels: { ...project.panels } };
      const activePanels = getActivePanels(project.templateId, project.addons);
      for (const panel of activePanels) {
        const state = project.panels[panel.id];
        if (!state) continue;
        const { width, height } = getEditorStageSize(panel);
        exportProject.panels[panel.id] = editorToExportTransform(panel, state, width, height);
      }
      const zip = await exportProjectZip(exportProject);
      downloadBlob(zip, `OLDISCO_${slugify(project.bandName)}_${slugify(project.albumTitle)}_${project.id}.zip`);
      onExported();
      return true;
    } catch {
      alert('Erro ao exportar ZIP. Tente novamente.');
      return false;
    } finally {
      setExporting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const contactIssues = validateContact(project);
    const panelIssues = validatePanels(project);
    const errors: Record<string, string> = {};
    for (const issue of contactIssues) {
      if (issue.message.includes('estilo')) errors.genre = issue.message;
      if (issue.message.includes('YouTube')) errors.youtubeUrl = issue.message;
      if (issue.message.includes('Instagram')) errors.instagram = issue.message;
      if (issue.message.includes('nome')) errors.contactName = issue.message;
      if (issue.message.includes('WhatsApp')) errors.contactPhone = issue.message;
    }
    setFieldErrors(errors);
    if (hasBlockingErrors([...contactIssues, ...panelIssues])) return;
    const exported = await runExportIfNeeded();
    if (exported) setShowModal(true);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-metal text-white tracking-widest uppercase border-l-4 border-red-600 pl-6 mb-2">
          Contato e Envio
        </h2>
        <p className="text-zinc-500 font-mono text-[11px] pl-7">
          Último passo: dados de submissão e envio via WhatsApp com o ZIP anexo.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-zinc-950 border border-zinc-900 p-8 md:p-10 rounded-sm space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 tracking-widest uppercase">Estilo / Gênero *</label>
            <input value={project.genre} onChange={(e) => onChange({ genre: e.target.value })} placeholder="BLACK METAL..." className={inputClass('genre')} />
            {fieldErrors.genre && <p className="text-red-600 font-mono text-[10px]">{fieldErrors.genre}</p>}
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black text-zinc-500 tracking-widest uppercase flex items-center gap-2"><Youtube size={12} className="text-red-600" /> YouTube *</label>
            <input type="url" value={project.youtubeUrl} onChange={(e) => onChange({ youtubeUrl: e.target.value })} placeholder="https://youtube.com/..." className={inputClass('youtubeUrl')} />
            {fieldErrors.youtubeUrl && <p className="text-red-600 font-mono text-[10px]">{fieldErrors.youtubeUrl}</p>}
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black text-zinc-500 tracking-widest uppercase flex items-center gap-2"><Instagram size={12} className="text-red-600" /> Instagram *</label>
            <input value={project.instagram} onChange={(e) => onChange({ instagram: e.target.value })} placeholder="@bandaname" className={inputClass('instagram')} />
            {fieldErrors.instagram && <p className="text-red-600 font-mono text-[10px]">{fieldErrors.instagram}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 tracking-widest uppercase flex items-center gap-2"><User size={12} className="text-red-600" /> Seu Nome *</label>
            <input value={project.contactName} onChange={(e) => onChange({ contactName: e.target.value })} placeholder="RESPONSÁVEL" className={inputClass('contactName')} />
            {fieldErrors.contactName && <p className="text-red-600 font-mono text-[10px]">{fieldErrors.contactName}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 tracking-widest uppercase">WhatsApp *</label>
            <input value={project.contactPhone} onChange={(e) => onChange({ contactPhone: e.target.value })} placeholder="(31) 99999-9999" className={inputClass('contactPhone')} />
            {fieldErrors.contactPhone && <p className="text-red-600 font-mono text-[10px]">{fieldErrors.contactPhone}</p>}
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black text-zinc-500 tracking-widest uppercase flex items-center gap-2"><Music2 size={12} className="text-red-600" /> Mensagem</label>
            <textarea value={project.message} onChange={(e) => onChange({ message: e.target.value })} rows={4} className={`${inputClass('message')} resize-none`} />
          </div>
        </div>

        <p className="text-zinc-600 font-mono text-[10px] italic">Projeto {project.id} · Salvo neste navegador</p>

        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-zinc-900">
          <button type="button" onClick={onBack} className="px-8 py-4 border border-zinc-800 text-zinc-500 font-black tracking-[0.25em] text-[11px] uppercase hover:border-red-600">Voltar</button>
          <button type="submit" disabled={exporting} className="flex-1 px-10 py-4 bg-red-600 text-white font-black tracking-[0.25em] text-[11px] uppercase flex items-center justify-center gap-3 hover:bg-red-500 disabled:opacity-50">
            <MessageCircle size={16} /> {exporting ? 'Exportando...' : 'ENVIAR VIA WHATSAPP'}
          </button>
        </div>
      </form>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80">
          <div className="bg-zinc-950 border border-zinc-800 max-w-md w-full p-8 space-y-6 relative">
            <button type="button" onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-zinc-500"><X size={20} /></button>
            <h3 className="font-metal text-xl text-white uppercase">Enviar Pedido</h3>
            <p className="text-zinc-400 font-mono text-[11px]">Anexe o ZIP na conversa do WhatsApp e clique abaixo.</p>
            <button type="button" onClick={() => { openWhatsApp(project); setShowModal(false); }} className="w-full py-4 bg-red-600 text-white font-black text-[11px] uppercase flex items-center justify-center gap-2">
              <MessageCircle size={16} /> Abrir WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
