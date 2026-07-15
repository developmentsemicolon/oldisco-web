import type { BuilderProject } from './types';
import { ADDON_PRICES, getTemplate, QUANTITY_DISCOUNTS } from './templates';

export function estimateUnitPrice(project: BuilderProject): number {
  const template = getTemplate(project.templateId);
  if (!template) return 0;

  let unit = template.basePrice;
  if (project.addons.slipcase) unit += ADDON_PRICES.slipcase;
  if (project.addons.extraBookletPages === 4) unit += ADDON_PRICES.extraBooklet4;
  if (project.addons.extraBookletPages === 8) unit += ADDON_PRICES.extraBooklet8;

  return unit;
}

export function estimateTotal(project: BuilderProject): number {
  const unit = estimateUnitPrice(project);
  const discount = QUANTITY_DISCOUNTS[project.quantity] ?? 1;
  return Math.round(unit * project.quantity * discount * 100) / 100;
}

export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
