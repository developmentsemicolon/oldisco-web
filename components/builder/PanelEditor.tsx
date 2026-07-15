'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { PanelDef, PanelImageState } from '@/lib/packaging/types';
import { fitImageToStage, getEditorStageSize } from '@/lib/packaging/export';
import { Maximize2, RotateCcw, Upload } from 'lucide-react';

interface PanelEditorProps {
  panel: PanelDef;
  state: PanelImageState | null;
  onChange: (state: PanelImageState | null) => void;
}

function useLoadedImage(src: string | undefined) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    if (!src) {
      setImage(null);
      return;
    }
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setImage(img);
    img.src = src;
  }, [src]);
  return image;
}

function drawDashedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  dash: number[]
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.setLineDash(dash);
  ctx.strokeRect(x, y, w, h);
  ctx.restore();
}

export default function PanelEditor({ panel, state, onChange }: PanelEditorProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

  const { width: stageW, height: stageH } = getEditorStageSize(panel);
  const bleedPx = (panel.bleedMm / (panel.widthMm + panel.bleedMm * 2)) * stageW;
  const safePx = (panel.safeZoneMm / panel.widthMm) * (stageW - bleedPx * 2) + bleedPx;

  const image = useLoadedImage(state?.imageDataUrl);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, stageW, stageH);

    if (state && image) {
      ctx.save();
      ctx.translate(state.x, state.y);
      ctx.rotate((state.rotation * Math.PI) / 180);
      ctx.scale(state.scaleX, state.scaleY);
      ctx.drawImage(image, 0, 0);
      ctx.restore();
    }

    drawDashedRect(ctx, bleedPx, bleedPx, stageW - bleedPx * 2, stageH - bleedPx * 2, '#991b1b', [4, 4]);
    drawDashedRect(ctx, safePx, safePx, stageW - safePx * 2, stageH - safePx * 2, '#52525b', [2, 4]);

    if (panel.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(stageW / 2, stageH / 2, Math.min(stageW, stageH) / 2 - bleedPx, 0, Math.PI * 2);
      ctx.strokeStyle = '#991b1b';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    if (panel.id.includes('spread')) {
      ctx.beginPath();
      ctx.setLineDash([6, 4]);
      ctx.strokeStyle = '#444';
      ctx.moveTo(stageW / 2, bleedPx);
      ctx.lineTo(stageW / 2, stageH - bleedPx);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [state, image, stageW, stageH, bleedPx, safePx, panel]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const img = new window.Image();
      img.onload = () => {
        const fit = fitImageToStage(img.naturalWidth, img.naturalHeight, stageW, stageH);
        onChange({
          imageDataUrl: dataUrl,
          ...fit,
          rotation: 0,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
        });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleFit = () => {
    if (!state) return;
    const fit = fitImageToStage(state.naturalWidth, state.naturalHeight, stageW, stageH);
    onChange({ ...state, ...fit, rotation: 0 });
  };

  const handleReset = () => onChange(null);

  const getCanvasPoint = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!state) return;
    const pt = getCanvasPoint(e);
    dragRef.current = { startX: pt.x, startY: pt.y, origX: state.x, origY: state.y };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragRef.current || !state) return;
    const pt = getCanvasPoint(e);
    const dx = pt.x - dragRef.current.startX;
    const dy = pt.y - dragRef.current.startY;
    onChange({ ...state, x: dragRef.current.origX + dx, y: dragRef.current.origY + dy });
  };

  const handleMouseUp = () => {
    dragRef.current = null;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 border border-zinc-800 text-zinc-400 font-mono text-[10px] uppercase tracking-widest hover:border-red-600 hover:text-red-600 transition-all"
        >
          <Upload size={14} /> Upload
        </button>
        <button
          type="button"
          onClick={handleFit}
          disabled={!state}
          className="flex items-center gap-2 px-4 py-2 border border-zinc-800 text-zinc-400 font-mono text-[10px] uppercase tracking-widest hover:border-red-600 disabled:opacity-40 transition-all"
        >
          <Maximize2 size={14} /> Preencher
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={!state}
          className="flex items-center gap-2 px-4 py-2 border border-zinc-800 text-zinc-400 font-mono text-[10px] uppercase tracking-widest hover:border-red-600 disabled:opacity-40 transition-all"
        >
          <RotateCcw size={14} /> Resetar
        </button>
        <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleUpload} />
      </div>

      <div className="border border-zinc-800 bg-zinc-950 inline-block max-w-full overflow-auto">
        <canvas
          ref={canvasRef}
          width={stageW}
          height={stageH}
          className={`max-w-full ${state ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
          style={{ width: stageW, height: stageH }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>

      <p className="text-zinc-600 font-mono text-[10px]">
        Vermelho: sangria · Cinza: safe zone · Arraste a imagem para posicionar
        {panel.id.includes('spread') && ' · Linha central: dobra do digipack'}
      </p>
    </div>
  );
}
