'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Download } from 'lucide-react';
import type { BuilderProject } from '@/lib/packaging/types';
import { getTemplate } from '@/lib/packaging/templates';
import { estimateTotal, formatBRL } from '@/lib/packaging/pricing';
import { validatePanels, hasBlockingErrors } from '@/lib/packaging/validation';
import { exportProjectZip, downloadBlob, editorToExportTransform, getEditorStageSize } from '@/lib/packaging/export';
import { getActivePanels, slugify } from '@/lib/packaging/utils';

interface StepReviewProps {
  project: BuilderProject;
  onBack: () => void;
  onNext: () => void;
  onExported: () => void;
}

export function StepReview({ project, onBack, onNext, onExported }: StepReviewProps) {
  const [loading, setLoading] = useState(false);
  const issues = validatePanels(project);
  const blocked = hasBlockingErrors(issues);
  const template = getTemplate(project.templateId);

  const handleExport = async () => {
    if (blocked) return;
    setLoading(true);
    try {
      const exportProject: BuilderProject = {
        ...project,
        panels: { ...project.panels },
      };
      const activePanels = getActivePanels(project.templateId, project.addons);
      for (const panel of activePanels) {
        const state = project.panels[panel.id];
        if (!state) continue;
        const { width } = getEditorStageSize(panel);
        exportProject.panels[panel.id] = editorToExportTransform(panel, state, width, getEditorStageSize(panel).height);
      }

      const zip = await exportProjectZip(exportProject);
      const band = slugify(project.bandName);
      const album = slugify(project.albumTitle);
      downloadBlob(zip, `OLDISCO_${band}_${album}_${project.id}.zip`);
      onExported();
    } catch (err) {
      console.error(err);
      alert('Erro ao exportar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const addons: string[] = [];
  if (project.addons.slipcase) addons.push('Slipcase');
  if (project.addons.extraBookletPages === 4) addons.push('Encarte +4 pág');
  if (project.addons.extraBookletPages === 8) addons.push('Encarte +8 pág');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-metal text-white tracking-widest uppercase border-l-4 border-red-600 pl-6 mb-2">
          Revisão do Pacote
        </h2>
        <p className="text-zinc-500 font-mono text-[11px] pl-7">
          Confira o pedido e baixe o ZIP print-ready antes de finalizar o contato.
        </p>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-sm space-y-4 font-mono text-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-zinc-400">
          <p><span className="text-zinc-600">Banda:</span> {project.bandName}</p>
          <p><span className="text-zinc-600">Álbum:</span> {project.albumTitle}</p>
          <p><span className="text-zinc-600">Pacote:</span> {template?.label}</p>
          <p><span className="text-zinc-600">Tiragem:</span> {project.quantity} un</p>
          <p><span className="text-zinc-600">Opcionais:</span> {addons.length ? addons.join(', ') : 'Nenhum'}</p>
        </div>
        <p className="text-white font-black text-lg pt-4 border-t border-zinc-900">
          Orçamento est.: {formatBRL(estimateTotal(project))}
        </p>
      </div>

      {issues.length > 0 && (
        <div className="space-y-2">
          {issues.map((issue, i) => (
            <div
              key={i}
              className={`flex items-start gap-2 p-3 font-mono text-[11px] border ${
                issue.severity === 'error'
                  ? 'border-red-900 bg-red-950/20 text-red-400'
                  : 'border-amber-900/50 bg-amber-950/10 text-amber-600'
              }`}
            >
              <AlertTriangle size={14} className="shrink-0 mt-0.5" />
              {issue.message}
            </div>
          ))}
        </div>
      )}

      {!blocked && (
        <div className="flex items-center gap-2 text-green-700 font-mono text-[11px]">
          <CheckCircle2 size={16} />
          {project.exported ? 'ZIP exportado — prossiga para o contato' : 'Arte pronta para exportação'}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="button"
          onClick={onBack}
          className="px-8 py-4 border border-zinc-800 text-zinc-500 font-black tracking-[0.25em] text-[11px] uppercase hover:border-red-600 transition-all"
        >
          Voltar
        </button>
        <button
          type="button"
          disabled={blocked || loading}
          onClick={handleExport}
          className="flex-1 flex items-center justify-center gap-2 px-10 py-4 bg-zinc-900 border border-zinc-800 text-white font-black tracking-[0.25em] text-[11px] uppercase disabled:opacity-40 hover:border-red-600 transition-all"
        >
          <Download size={16} />
          {loading ? 'Exportando...' : project.exported ? 'Baixar ZIP novamente' : 'Baixar ZIP Print-Ready'}
        </button>
        <button
          type="button"
          disabled={blocked || !project.exported}
          onClick={onNext}
          className="flex-1 px-10 py-4 bg-red-600 text-white font-black tracking-[0.25em] text-[11px] uppercase disabled:opacity-40 hover:bg-red-500 transition-all"
        >
          Finalizar Contato
        </button>
      </div>
    </div>
  );
}
