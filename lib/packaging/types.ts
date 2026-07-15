export type PackagingId = 'jewel-black' | 'jewel-clear' | 'digipack-4' | 'cd-acrylic';

export type MockupType = 'jewel' | 'digipack' | 'acrylic';

export type BuilderStep = 1 | 2 | 3 | 4 | 5;

export type QuantityTier = 50 | 100 | 300 | 500;

export type ExtraBookletPages = 0 | 4 | 8;

export interface PanelDef {
  id: string;
  label: string;
  widthMm: number;
  heightMm: number;
  bleedMm: number;
  safeZoneMm: number;
  shape?: 'rect' | 'circle';
  /** Painel só entra quando add-on correspondente está ativo */
  requiresAddon?: 'extraBooklet4' | 'extraBooklet8' | 'slipcase';
}

export interface PackagingTemplate {
  id: PackagingId;
  label: string;
  description: string;
  basePrice: number;
  mockupType: MockupType;
  mockupVariant?: 'black' | 'clear';
  panels: PanelDef[];
}

export interface PanelImageState {
  imageDataUrl: string;
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  naturalWidth: number;
  naturalHeight: number;
}

export interface BuilderAddons {
  slipcase: boolean;
  extraBookletPages: ExtraBookletPages;
}

export interface BuilderProject {
  id: string;
  createdAt: string;
  updatedAt: string;
  step: BuilderStep;
  templateId: PackagingId | null;
  bandName: string;
  albumTitle: string;
  genre: string;
  youtubeUrl: string;
  instagram: string;
  contactName: string;
  contactPhone: string;
  message: string;
  quantity: QuantityTier;
  addons: BuilderAddons;
  panels: Record<string, PanelImageState | null>;
  exported: boolean;
}

export interface ValidationIssue {
  panelId?: string;
  message: string;
  severity: 'error' | 'warning';
}

export const DPI = 300;
export const WHATSAPP_NUMBER = '5531985555017';
export const SITE_URL = 'https://oldisco.netlify.app';
export const STORAGE_PREFIX = 'oldisco_producao_project_';
export const LEGACY_STORAGE_PREFIX = 'oldisco_cd_project_';
