import type { BuilderProject } from './types';
import { WHATSAPP_NUMBER, SITE_URL } from './types';
import { estimateTotal, formatBRL } from './pricing';
import { getTemplate } from './templates';

function formatInstagram(raw: string): string {
  if (raw.startsWith('@')) return raw;
  if (raw.includes('instagram.com')) return raw;
  return `@${raw.replace(/^@/, '')}`;
}

export function buildUnifiedWhatsAppMessage(project: BuilderProject): string {
  const template = getTemplate(project.templateId);
  const addons: string[] = [];
  if (project.addons.slipcase) addons.push('Slipcase');
  if (project.addons.extraBookletPages === 4) addons.push('Encarte +4 páginas');
  if (project.addons.extraBookletPages === 8) addons.push('Encarte +8 páginas');

  const lines = [
    '🎸 *SUBMISSÃO DE MATERIAL — Oldisco* 🎸',
    '',
    `*Projeto:* ${project.id}`,
    `*BANDA:* ${project.bandName.trim()}`,
    `*ÁLBUM:* ${project.albumTitle.trim()}`,
    `*ESTILO:* ${project.genre.trim()}`,
    `*YOUTUBE:* ${project.youtubeUrl.trim()}`,
    `*INSTAGRAM:* ${formatInstagram(project.instagram.trim())}`,
    `*RESPONSÁVEL:* ${project.contactName.trim()}`,
    `*WHATSAPP:* ${project.contactPhone.trim()}`,
    '',
    '--- PACOTE CD ---',
    `*Formato:* ${template?.label ?? '—'}`,
    `*Tiragem:* ${project.quantity} un`,
    `*Opcionais:* ${addons.length ? addons.join(', ') : 'Nenhum'}`,
    `*Orçamento est.:* ${formatBRL(estimateTotal(project))}`,
  ];

  if (project.message.trim()) {
    lines.push('', '*MENSAGEM:*', project.message.trim());
  }

  lines.push(
    '',
    '📎 *Anexe o ZIP exportado nesta conversa.*',
    '',
    `Retomar projeto: ${SITE_URL}/produzir-material?p=${project.id}`
  );

  return lines.join('\n');
}

/** @deprecated use buildUnifiedWhatsAppMessage */
export function buildWhatsAppMessage(project: BuilderProject): string {
  return buildUnifiedWhatsAppMessage(project);
}

export function openWhatsApp(project: BuilderProject): void {
  const text = encodeURIComponent(buildUnifiedWhatsAppMessage(project));
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
}

export function projectResumeUrl(projectId: string): string {
  return `${SITE_URL}/produzir-material?p=${projectId}`;
}
