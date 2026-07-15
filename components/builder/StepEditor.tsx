'use client';

import { CheckCircle2, Circle } from 'lucide-react';
import type { BuilderProject } from '@/lib/packaging/types';
import { getActivePanels } from '@/lib/packaging/utils';
import { useState } from 'react';
import PanelEditor from './PanelEditor';

interface StepEditorProps {
  project: BuilderProject;
  updatePanel: (panelId: string, state: BuilderProject['panels'][string]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepEditor({ project, updatePanel, onNext, onBack }: StepEditorProps) {
  const panels = getActivePanels(project.templateId, project.addons);
  const [activeId, setActiveId] = useState(panels[0]?.id ?? 'cover');

  const activePanel = panels.find((p) => p.id === activeId) ?? panels[0];
  const filledCount = panels.filter((p) => project.panels[p.id]?.imageDataUrl).length;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-metal text-white tracking-widest uppercase border-l-4 border-red-600 pl-6 mb-2">
          Editor de Arte
        </h2>
        <p className="text-zinc-500 font-mono text-[11px] pl-7">
          {filledCount}/{panels.length} painéis preenchidos · Recomendado desktop
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <div className="space-y-2">
          {panels.map((panel) => {
            const filled = !!project.panels[panel.id]?.imageDataUrl;
            return (
              <button
                key={panel.id}
                type="button"
                onClick={() => setActiveId(panel.id)}
                className={`w-full text-left px-4 py-3 border font-mono text-[10px] uppercase tracking-wider flex items-center gap-2 transition-all ${
                  activeId === panel.id
                    ? 'border-red-600 bg-red-950/20 text-white'
                    : 'border-zinc-900 bg-zinc-950 text-zinc-500 hover:border-zinc-700'
                }`}
              >
                {filled ? (
                  <CheckCircle2 size={14} className="text-red-600 shrink-0" />
                ) : (
                  <Circle size={14} className="text-zinc-700 shrink-0" />
                )}
                {panel.label}
              </button>
            );
          })}
        </div>

        {activePanel && (
          <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-sm">
            <h3 className="font-metal text-white tracking-wider uppercase mb-4">{activePanel.label}</h3>
            <PanelEditor
              panel={activePanel}
              state={project.panels[activePanel.id] ?? null}
              onChange={(s) => updatePanel(activePanel.id, s)}
            />
          </div>
        )}
      </div>

      <p className="text-amber-700/80 font-mono text-[10px] border border-amber-900/30 bg-amber-950/10 p-3">
        Arquivos exportados em RGB. A Oldisco converte para CMYK na produção.
      </p>

      <div className="flex justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="px-8 py-4 border border-zinc-800 text-zinc-500 font-black tracking-[0.25em] text-[11px] uppercase hover:border-red-600 transition-all"
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-10 py-4 bg-red-600 text-white font-black tracking-[0.25em] text-[11px] uppercase hover:bg-red-500 transition-all"
        >
          Ver Preview
        </button>
      </div>
    </div>
  );
}
