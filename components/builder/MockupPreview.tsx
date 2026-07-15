'use client';

import { useEffect, useRef, useState } from 'react';
import type { BuilderProject } from '@/lib/packaging/types';
import { getTemplate } from '@/lib/packaging/templates';
import { Download } from 'lucide-react';

export type MockupMode = 'closed' | 'open' | 'slipcase';

interface MockupPreviewProps {
  project: BuilderProject;
  mode: MockupMode;
  onPreviewCanvas?: (canvas: HTMLCanvasElement) => void;
}

function getCoverUrl(project: BuilderProject): string | null {
  const cover =
    project.panels['cover'] ??
    project.panels['outer-spread'] ??
    project.panels['disc-art'] ??
    project.panels['insert-front'];
  return cover?.imageDataUrl ?? null;
}

function getBackUrl(project: BuilderProject): string | null {
  return project.panels['back']?.imageDataUrl ?? project.panels['inner-spread']?.imageDataUrl ?? null;
}

function getDiscUrl(project: BuilderProject): string | null {
  return project.panels['disc-label']?.imageDataUrl ?? project.panels['disc-art']?.imageDataUrl ?? null;
}

function getSlipcaseUrl(project: BuilderProject): string | null {
  return project.panels['slipcase']?.imageDataUrl ?? getCoverUrl(project);
}

export function MockupPreview({ project, mode, onPreviewCanvas }: MockupPreviewProps) {
  const template = getTemplate(project.templateId);
  const coverUrl = getCoverUrl(project);
  const backUrl = getBackUrl(project);
  const discUrl = getDiscUrl(project);
  const slipUrl = getSlipcaseUrl(project);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [exporting, setExporting] = useState(false);

  const mockupType = template?.mockupType ?? 'jewel';
  const variant = template?.mockupVariant ?? 'black';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !onPreviewCanvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 800;
    const h = 600;
    canvas.width = w;
    canvas.height = h;
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, w, h);

    const drawImageCover = (
      url: string | null,
      x: number,
      y: number,
      cw: number,
      ch: number
    ) => {
      if (!url) {
        ctx.fillStyle = '#18181b';
        ctx.fillRect(x, y, cw, ch);
        ctx.strokeStyle = '#3f3f46';
        ctx.strokeRect(x, y, cw, ch);
        return;
      }
      const img = new Image();
      img.src = url;
      if (img.complete) {
        const scale = Math.max(cw / img.width, ch / img.height);
        const sw = img.width * scale;
        const sh = img.height * scale;
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, cw, ch);
        ctx.clip();
        ctx.drawImage(img, x + (cw - sw) / 2, y + (ch - sh) / 2, sw, sh);
        ctx.restore();
      }
    };

    if (mockupType === 'jewel') {
      const caseColor = variant === 'clear' ? 'rgba(60,60,60,0.4)' : '#111';
      if (mode === 'slipcase' && project.addons.slipcase) {
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(180, 80, 440, 440);
        drawImageCover(slipUrl, 200, 100, 400, 400);
      }
      ctx.fillStyle = caseColor;
      ctx.fillRect(240, 120, 320, 320);
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.strokeRect(240, 120, 320, 320);
      if (mode === 'open') {
        drawImageCover(backUrl, 250, 130, 140, 300);
        drawImageCover(coverUrl, 410, 130, 140, 300);
        if (discUrl) {
          ctx.beginPath();
          ctx.arc(340, 280, 50, 0, Math.PI * 2);
          ctx.fillStyle = '#222';
          ctx.fill();
          drawImageCover(discUrl, 290, 230, 100, 100);
        }
      } else {
        drawImageCover(coverUrl, 250, 130, 300, 300);
      }
    } else if (mockupType === 'digipack') {
      if (mode === 'open') {
        drawImageCover(project.panels['inner-spread']?.imageDataUrl ?? backUrl, 100, 150, 600, 300);
        ctx.strokeStyle = '#444';
        ctx.beginPath();
        ctx.moveTo(400, 150);
        ctx.lineTo(400, 450);
        ctx.stroke();
      } else {
        drawImageCover(coverUrl, 150, 150, 500, 250);
      }
      if (discUrl) {
        ctx.beginPath();
        ctx.arc(680, 300, 45, 0, Math.PI * 2);
        ctx.fillStyle = '#222';
        ctx.fill();
        drawImageCover(discUrl, 635, 255, 90, 90);
      }
    } else {
      ctx.beginPath();
      ctx.arc(400, 300, 120, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(200,200,200,0.15)';
      ctx.fill();
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 3;
      ctx.stroke();
      drawImageCover(discUrl ?? coverUrl, 280, 180, 240, 240);
    }

    ctx.fillStyle = '#71717a';
    ctx.font = '12px monospace';
    ctx.fillText(`${project.bandName || 'BANDA'} — ${project.albumTitle || 'ÁLBUM'}`, 20, 580);

    onPreviewCanvas(canvas);
  }, [project, mode, coverUrl, backUrl, discUrl, slipUrl, mockupType, variant, onPreviewCanvas]);

  const handleExportPreview = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setExporting(true);
    try {
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => (b ? resolve(b) : reject()), 'image/jpeg', 0.92);
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `oldisco_preview_${project.id}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] max-w-2xl mx-auto border border-zinc-800 bg-black overflow-hidden rounded-sm">
        {/* Visual CSS mockup for live display */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          {mockupType === 'jewel' && (
            <div className="relative">
              {mode === 'slipcase' && project.addons.slipcase && (
                <div
                  className="absolute -inset-6 border border-zinc-700 bg-zinc-900/80 rounded-sm overflow-hidden"
                  style={{
                    backgroundImage: slipUrl ? `url(${slipUrl})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
              )}
              <div
                className={`relative w-48 h-48 md:w-64 md:h-64 border-2 overflow-hidden shadow-2xl ${
                  variant === 'clear' ? 'border-zinc-600/50 bg-zinc-900/30' : 'border-zinc-800 bg-zinc-950'
                }`}
              >
                {mode === 'open' ? (
                  <div className="flex h-full">
                    <div
                      className="w-1/2 h-full bg-zinc-900 border-r border-zinc-800"
                      style={{
                        backgroundImage: backUrl ? `url(${backUrl})` : undefined,
                        backgroundSize: 'cover',
                      }}
                    />
                    <div
                      className="w-1/2 h-full bg-zinc-900"
                      style={{
                        backgroundImage: coverUrl ? `url(${coverUrl})` : undefined,
                        backgroundSize: 'cover',
                      }}
                    />
                    {discUrl && (
                      <div
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-zinc-600 overflow-hidden bg-zinc-800"
                        style={{ backgroundImage: `url(${discUrl})`, backgroundSize: 'cover' }}
                      />
                    )}
                  </div>
                ) : (
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundImage: coverUrl ? `url(${coverUrl})` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundColor: '#18181b',
                    }}
                  />
                )}
              </div>
            </div>
          )}

          {mockupType === 'digipack' && (
            <div
              className={`w-72 md:w-96 h-40 md:h-48 border border-zinc-700 overflow-hidden ${
                mode === 'open' ? 'flex' : ''
              }`}
            >
              {mode === 'open' ? (
                <>
                  <div
                    className="flex-1 h-full border-r border-zinc-700"
                    style={{
                      backgroundImage: backUrl ? `url(${backUrl})` : undefined,
                      backgroundSize: 'cover',
                    }}
                  />
                  <div
                    className="flex-1 h-full"
                    style={{
                      backgroundImage: coverUrl ? `url(${coverUrl})` : undefined,
                      backgroundSize: 'cover',
                    }}
                  />
                </>
              ) : (
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage: coverUrl ? `url(${coverUrl})` : undefined,
                    backgroundSize: 'cover',
                    backgroundColor: '#18181b',
                  }}
                />
              )}
            </div>
          )}

          {mockupType === 'acrylic' && (
            <div
              className="w-48 h-48 md:w-56 md:h-56 rounded-full border-4 border-zinc-500/40 overflow-hidden shadow-xl"
              style={{
                backgroundImage: (discUrl ?? coverUrl) ? `url(${discUrl ?? coverUrl})` : undefined,
                backgroundSize: 'cover',
                backgroundColor: 'rgba(255,255,255,0.05)',
              }}
            />
          )}
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleExportPreview}
          disabled={exporting}
          className="flex items-center gap-2 px-6 py-2 border border-zinc-800 text-zinc-400 font-mono text-[10px] uppercase tracking-widest hover:border-red-600 hover:text-red-600 transition-all"
        >
          <Download size={14} /> Exportar preview JPG
        </button>
      </div>
    </div>
  );
}
