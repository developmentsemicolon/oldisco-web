import type { PackagingId, PackagingTemplate } from './types';

const JEWEL_PANELS: PackagingTemplate['panels'] = [
  { id: 'cover', label: 'Capa', widthMm: 121, heightMm: 121, bleedMm: 3, safeZoneMm: 5 },
  { id: 'back', label: 'Contracapa / Traseira', widthMm: 117.5, heightMm: 151, bleedMm: 3, safeZoneMm: 5 },
  { id: 'booklet-p1', label: 'Encarte — Página 1', widthMm: 117.5, heightMm: 121, bleedMm: 3, safeZoneMm: 5 },
  { id: 'booklet-p2', label: 'Encarte — Página 2', widthMm: 117.5, heightMm: 121, bleedMm: 3, safeZoneMm: 5 },
  {
    id: 'booklet-p3',
    label: 'Encarte — Página 3',
    widthMm: 117.5,
    heightMm: 121,
    bleedMm: 3,
    safeZoneMm: 5,
    requiresAddon: 'extraBooklet4',
  },
  {
    id: 'booklet-p4',
    label: 'Encarte — Página 4',
    widthMm: 117.5,
    heightMm: 121,
    bleedMm: 3,
    safeZoneMm: 5,
    requiresAddon: 'extraBooklet4',
  },
  {
    id: 'booklet-p5',
    label: 'Encarte — Página 5',
    widthMm: 117.5,
    heightMm: 121,
    bleedMm: 3,
    safeZoneMm: 5,
    requiresAddon: 'extraBooklet8',
  },
  {
    id: 'booklet-p6',
    label: 'Encarte — Página 6',
    widthMm: 117.5,
    heightMm: 121,
    bleedMm: 3,
    safeZoneMm: 5,
    requiresAddon: 'extraBooklet8',
  },
  {
    id: 'disc-label',
    label: 'Label do CD',
    widthMm: 118,
    heightMm: 118,
    bleedMm: 2,
    safeZoneMm: 5,
    shape: 'circle',
  },
  {
    id: 'slipcase',
    label: 'Slipcase — Capa externa',
    widthMm: 148,
    heightMm: 148,
    bleedMm: 3,
    safeZoneMm: 5,
    requiresAddon: 'slipcase',
  },
];

export const PACKAGING_TEMPLATES: PackagingTemplate[] = [
  {
    id: 'jewel-black',
    label: 'Jewel Case Preto',
    description: 'Case padrão preto opaco. Capa, contracapa, encarte e label.',
    basePrice: 12,
    mockupType: 'jewel',
    mockupVariant: 'black',
    panels: JEWEL_PANELS,
  },
  {
    id: 'jewel-clear',
    label: 'Jewel Case Transparente',
    description: 'Case transparente. Ideal para arte que dialogue com o encarte.',
    basePrice: 14,
    mockupType: 'jewel',
    mockupVariant: 'clear',
    panels: JEWEL_PANELS,
  },
  {
    id: 'digipack-4',
    label: 'Digipack 2 Painéis',
    description: 'Embalagem cartonada dobrável. Visual premium para lançamentos.',
    basePrice: 18,
    mockupType: 'digipack',
    panels: [
      { id: 'outer-spread', label: 'Arte Externa (spread)', widthMm: 242, heightMm: 121, bleedMm: 3, safeZoneMm: 5 },
      { id: 'inner-spread', label: 'Arte Interna (spread)', widthMm: 242, heightMm: 121, bleedMm: 3, safeZoneMm: 5 },
      { id: 'booklet-p1', label: 'Encarte — Página 1', widthMm: 117.5, heightMm: 121, bleedMm: 3, safeZoneMm: 5 },
      { id: 'booklet-p2', label: 'Encarte — Página 2', widthMm: 117.5, heightMm: 121, bleedMm: 3, safeZoneMm: 5 },
      {
        id: 'booklet-p3',
        label: 'Encarte — Página 3',
        widthMm: 117.5,
        heightMm: 121,
        bleedMm: 3,
        safeZoneMm: 5,
        requiresAddon: 'extraBooklet4',
      },
      {
        id: 'booklet-p4',
        label: 'Encarte — Página 4',
        widthMm: 117.5,
        heightMm: 121,
        bleedMm: 3,
        safeZoneMm: 5,
        requiresAddon: 'extraBooklet4',
      },
      {
        id: 'booklet-p5',
        label: 'Encarte — Página 5',
        widthMm: 117.5,
        heightMm: 121,
        bleedMm: 3,
        safeZoneMm: 5,
        requiresAddon: 'extraBooklet8',
      },
      {
        id: 'booklet-p6',
        label: 'Encarte — Página 6',
        widthMm: 117.5,
        heightMm: 121,
        bleedMm: 3,
        safeZoneMm: 5,
        requiresAddon: 'extraBooklet8',
      },
      {
        id: 'disc-label',
        label: 'Label do CD',
        widthMm: 118,
        heightMm: 118,
        bleedMm: 2,
        safeZoneMm: 5,
        shape: 'circle',
      },
      {
        id: 'slipcase',
        label: 'Slipcase — Capa externa',
        widthMm: 148,
        heightMm: 148,
        bleedMm: 3,
        safeZoneMm: 5,
        requiresAddon: 'slipcase',
      },
    ],
  },
  {
    id: 'cd-acrylic',
    label: 'CD Acrílico',
    description: 'Disco em acrílico transparente com arte impressa. Insert opcional.',
    basePrice: 22,
    mockupType: 'acrylic',
    panels: [
      { id: 'disc-art', label: 'Arte do Disco', widthMm: 118, heightMm: 118, bleedMm: 2, safeZoneMm: 5, shape: 'circle' },
      { id: 'insert-front', label: 'Insert — Frente', widthMm: 121, heightMm: 121, bleedMm: 3, safeZoneMm: 5 },
      { id: 'insert-back', label: 'Insert — Verso', widthMm: 121, heightMm: 121, bleedMm: 3, safeZoneMm: 5 },
      {
        id: 'slipcase',
        label: 'Slipcase — Capa externa',
        widthMm: 148,
        heightMm: 148,
        bleedMm: 3,
        safeZoneMm: 5,
        requiresAddon: 'slipcase',
      },
    ],
  },
];

export function getTemplate(id: PackagingId | null): PackagingTemplate | undefined {
  if (!id) return undefined;
  return PACKAGING_TEMPLATES.find((t) => t.id === id);
}

export const QUANTITY_TIERS = [50, 100, 300, 500] as const;

export const ADDON_PRICES = {
  slipcase: 8,
  extraBooklet4: 3,
  extraBooklet8: 5,
} as const;

export const QUANTITY_DISCOUNTS: Record<number, number> = {
  50: 1,
  100: 0.92,
  300: 0.85,
  500: 0.78,
};
