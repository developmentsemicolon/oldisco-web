'use client';

import { useCallback, useState } from 'react';
import type { BuilderProject } from '@/lib/packaging/types';
import { MockupPreview, type MockupMode } from './MockupPreview';

interface StepPreviewProps {
  project: BuilderProject;
  onNext: () => void;
  onBack: () => void;
  onPreviewCanvas: (canvas: HTMLCanvasElement) => void;
}

export function StepPreview({ project, onNext, onBack, onPreviewCanvas }: StepPreviewProps) {
  const [mode, setMode] = useState<MockupMode>('closed');

  const modes: { id: MockupMode; label: string; show?: boolean }[] = [
    { id: 'closed', label: 'Fechado' },
    { id: 'open', label: 'Aberto' },
    { id: 'slipcase', label: 'Com Slipcase', show: project.addons.slipcase },
  ];

  const handleCanvas = useCallback(
    (canvas: HTMLCanvasElement) => onPreviewCanvas(canvas),
    [onPreviewCanvas]
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-metal text-white tracking-widest uppercase border-l-4 border-red-600 pl-6 mb-2">
          Preview do Pacote
        </h2>
        <p className="text-zinc-500 font-mono text-[11px] pl-7">
          Visualize como ficará o produto final.
        </p>
      </div>

      <div className="flex justify-center gap-3 flex-wrap">
        {modes
          .filter((m) => m.show !== false)
          .map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={`px-4 py-2 font-mono text-[10px] tracking-widest uppercase border transition-all ${
                mode === m.id
                  ? 'border-red-600 text-red-600 bg-red-950/20'
                  : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'
              }`}
            >
              {m.label}
            </button>
          ))}
      </div>

      <MockupPreview project={project} mode={mode} onPreviewCanvas={handleCanvas} />

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
          Revisar e Enviar
        </button>
      </div>
    </div>
  );
}
