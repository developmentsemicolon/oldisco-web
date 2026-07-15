import type { BuilderProject, PanelDef, PanelImageState } from './types';
import { getTemplate } from './templates';
import { buildPanelFilename, getActivePanels, mmToPx, panelExportSize } from './utils';
import { estimateTotal, formatBRL } from './pricing';
import { projectResumeUrl } from './whatsapp';

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function renderPanelToBlob(
  panel: PanelDef,
  state: PanelImageState
): Promise<Blob> {
  const exportSize = panelExportSize(panel);
  const canvas = document.createElement('canvas');
  canvas.width = exportSize.width;
  canvas.height = exportSize.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas não disponível');

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const img = await loadImage(state.imageDataUrl);
  ctx.save();
  ctx.translate(state.x, state.y);
  ctx.rotate((state.rotation * Math.PI) / 180);
  ctx.scale(state.scaleX, state.scaleY);
  ctx.drawImage(img, 0, 0);
  ctx.restore();

  if (panel.shape === 'circle') {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = Math.min(canvas.width, canvas.height) / 2;
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Falha ao exportar painel'))),
      'image/png'
    );
  });
}

export function buildPedidoText(project: BuilderProject): string {
  const template = getTemplate(project.templateId);
  const activePanels = getActivePanels(project.templateId, project.addons);
  const addons: string[] = [];
  if (project.addons.slipcase) addons.push('Slipcase');
  if (project.addons.extraBookletPages === 4) addons.push('Encarte +4 páginas');
  if (project.addons.extraBookletPages === 8) addons.push('Encarte +8 páginas');

  const lines = [
    '========================================',
    '       PEDIDO CD — OLDISCO',
    '========================================',
    '',
    `Projeto ID: ${project.id}`,
    `Data: ${new Date().toLocaleString('pt-BR')}`,
    '',
    '--- DADOS ---',
    `Banda: ${project.bandName}`,
    `Álbum: ${project.albumTitle}`,
    `Contato: ${project.contactName}`,
    `WhatsApp: ${project.contactPhone}`,
    '',
    '--- PACOTE ---',
    `Formato: ${template?.label ?? project.templateId}`,
    `Tiragem: ${project.quantity} unidades`,
    `Opcionais: ${addons.length ? addons.join(', ') : 'Nenhum'}`,
    `Orçamento estimado: ${formatBRL(estimateTotal(project))}`,
    '',
    '--- PAINÉIS EXPORTADOS ---',
  ];

  for (const panel of activePanels) {
    const dims =
      panel.shape === 'circle'
        ? `Ø ${panel.widthMm} mm`
        : `${panel.widthMm} × ${panel.heightMm} mm (+ ${panel.bleedMm} mm bleed)`;
    lines.push(`• ${panel.label} (${panel.id}): ${dims}`);
    lines.push(`  Arquivo: ${buildPanelFilename(project, panel)}`);
  }

  lines.push(
    '',
    '--- OBSERVAÇÕES ---',
    '• Arquivos em RGB @ 300 DPI',
    '• Validar sangria e safe zone antes de imprimir',
    '• Conversão CMYK na produção',
    '',
    `Link retomar (mesmo navegador): ${projectResumeUrl(project.id)}`,
    '========================================'
  );

  return lines.join('\n');
}

export async function exportProjectZip(project: BuilderProject): Promise<Blob> {
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();
  const activePanels = getActivePanels(project.templateId, project.addons);

  const printFolder = zip.folder('print');
  if (!printFolder) throw new Error('Erro ao criar ZIP');

  for (const panel of activePanels) {
    const state = project.panels[panel.id];
    if (!state) continue;
    const blob = await renderPanelToBlob(panel, state);
    printFolder.file(buildPanelFilename(project, panel), blob);
  }

  zip.file('PEDIDO.txt', buildPedidoText(project));

  return zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportPreviewJpg(
  canvas: HTMLCanvasElement,
  maxSize = 1200
): Promise<Blob> {
  const scale = Math.min(1, maxSize / Math.max(canvas.width, canvas.height));
  const w = Math.round(canvas.width * scale);
  const h = Math.round(canvas.height * scale);
  const off = document.createElement('canvas');
  off.width = w;
  off.height = h;
  const ctx = off.getContext('2d');
  if (!ctx) throw new Error('Canvas não disponível');
  ctx.drawImage(canvas, 0, 0, w, h);
  return new Promise((resolve, reject) => {
    off.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Falha ao exportar preview'))),
      'image/jpeg',
      0.92
    );
  });
}

/** Escala editor → export (canvas Konva usa escala de tela) */
export function editorToExportTransform(
  panel: PanelDef,
  state: PanelImageState,
  stageWidth: number,
  stageHeight: number
): PanelImageState {
  const exportSize = panelExportSize(panel);
  const scaleFactor = exportSize.width / stageWidth;
  return {
    ...state,
    x: state.x * scaleFactor,
    y: state.y * scaleFactor,
    scaleX: state.scaleX * scaleFactor,
    scaleY: state.scaleY * scaleFactor,
  };
}

export function getEditorStageSize(panel: PanelDef, maxPx = 520): { width: number; height: number; scale: number } {
  const exportSize = panelExportSize(panel);
  const aspect = exportSize.width / exportSize.height;
  let width = maxPx;
  let height = maxPx;
  if (aspect > 1) {
    height = maxPx / aspect;
  } else {
    width = maxPx * aspect;
  }
  return {
    width: Math.round(width),
    height: Math.round(height),
    scale: width / exportSize.width,
  };
}

export function fitImageToStage(
  naturalWidth: number,
  naturalHeight: number,
  stageWidth: number,
  stageHeight: number
): Pick<PanelImageState, 'x' | 'y' | 'scaleX' | 'scaleY'> {
  const scale = Math.max(stageWidth / naturalWidth, stageHeight / naturalHeight);
  const w = naturalWidth * scale;
  const h = naturalHeight * scale;
  return {
    x: (stageWidth - w) / 2,
    y: (stageHeight - h) / 2,
    scaleX: scale,
    scaleY: scale,
  };
}

export { mmToPx, panelExportSize };
