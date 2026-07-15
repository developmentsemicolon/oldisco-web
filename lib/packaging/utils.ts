import type { BuilderAddons, BuilderProject, PanelDef, PackagingId } from './types';
import { DPI } from './types';
import { getTemplate } from './templates';

export function mmToPx(mm: number): number {
  return Math.round((mm / 25.4) * DPI);
}

export function panelExportSize(panel: PanelDef): { width: number; height: number } {
  const totalW = panel.widthMm + panel.bleedMm * 2;
  const totalH = panel.heightMm + panel.bleedMm * 2;
  return { width: mmToPx(totalW), height: mmToPx(totalH) };
}

export function isPanelActive(panel: PanelDef, addons: BuilderAddons): boolean {
  if (!panel.requiresAddon) return true;
  if (panel.requiresAddon === 'slipcase') return addons.slipcase;
  if (panel.requiresAddon === 'extraBooklet4') return addons.extraBookletPages >= 4;
  if (panel.requiresAddon === 'extraBooklet8') return addons.extraBookletPages >= 8;
  return true;
}

export function getActivePanels(templateId: PackagingId | null, addons: BuilderAddons): PanelDef[] {
  if (!templateId) return [];
  const template = getTemplate(templateId);
  if (!template) return [];
  return template.panels.filter((p) => isPanelActive(p, addons));
}

export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .toUpperCase()
    .slice(0, 40) || 'PROJETO';
}

export function buildPanelFilename(
  project: BuilderProject,
  panel: PanelDef
): string {
  const band = slugify(project.bandName || 'BANDA');
  const album = slugify(project.albumTitle || 'ALBUM');
  const pkg = project.templateId || 'pacote';
  const dims = panel.shape === 'circle'
    ? `${panel.widthMm}mm_dia`
    : `${panel.widthMm}x${panel.heightMm}mm`;
  return `${band}_${album}_${pkg}_${panel.id}_${dims}_300dpi.png`;
}

export function createEmptyProject(id: string): BuilderProject {
  return {
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    step: 1,
    templateId: null,
    bandName: '',
    albumTitle: '',
    genre: '',
    youtubeUrl: '',
    instagram: '',
    contactName: '',
    contactPhone: '',
    message: '',
    quantity: 100,
    addons: { slipcase: false, extraBookletPages: 0 },
    panels: {},
    exported: false,
  };
}

export function normalizeProject(raw: Partial<BuilderProject> & { id: string }): BuilderProject {
  const base = createEmptyProject(raw.id);
  return ensurePanelKeys({
    ...base,
    ...raw,
    addons: { ...base.addons, ...raw.addons },
    panels: raw.panels ?? base.panels,
    exported: raw.exported ?? false,
  });
}

export function ensurePanelKeys(project: BuilderProject): BuilderProject {
  const active = getActivePanels(project.templateId, project.addons);
  const panels = { ...project.panels };
  for (const p of active) {
    if (!(p.id in panels)) panels[p.id] = null;
  }
  return { ...project, panels };
}
