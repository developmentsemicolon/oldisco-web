import type { BuilderProject, ValidationIssue } from './types';
import { getActivePanels, panelExportSize } from './utils';

const MIN_EFFECTIVE_DPI = 200;

export function validatePanels(project: BuilderProject): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!project.templateId) {
    issues.push({ message: 'Selecione um formato de pacote.', severity: 'error' });
    return issues;
  }
  if (!project.bandName.trim()) {
    issues.push({ message: 'Informe o nome da banda.', severity: 'error' });
  }
  if (!project.albumTitle.trim()) {
    issues.push({ message: 'Informe o título do álbum.', severity: 'error' });
  }

  const activePanels = getActivePanels(project.templateId, project.addons);

  for (const panel of activePanels) {
    const state = project.panels[panel.id];
    if (!state?.imageDataUrl) {
      issues.push({
        panelId: panel.id,
        message: `Painel "${panel.label}" sem arte.`,
        severity: 'error',
      });
      continue;
    }

    const exportSize = panelExportSize(panel);
    const displayScale = Math.max(state.scaleX, state.scaleY);
    const effectiveWidth = state.naturalWidth * displayScale;
    const effectiveHeight = state.naturalHeight * displayScale;

    const dpiW = (effectiveWidth / exportSize.width) * 300;
    const dpiH = (effectiveHeight / exportSize.height) * 300;
    const effectiveDpi = Math.min(dpiW, dpiH);

    if (effectiveDpi < MIN_EFFECTIVE_DPI) {
      issues.push({
        panelId: panel.id,
        message: `"${panel.label}": resolução baixa (~${Math.round(effectiveDpi)} DPI). Use imagem maior ou preencha o painel.`,
        severity: 'warning',
      });
    }
  }

  return issues;
}

export function validateContact(project: BuilderProject): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!project.genre.trim()) {
    issues.push({ message: 'Informe o estilo musical.', severity: 'error' });
  }
  if (!project.youtubeUrl.trim()) {
    issues.push({ message: 'Informe o link do YouTube.', severity: 'error' });
  } else if (!/^https?:\/\/.+/i.test(project.youtubeUrl.trim())) {
    issues.push({ message: 'Use um link válido do YouTube (https://...).', severity: 'error' });
  }
  if (!project.instagram.trim()) {
    issues.push({ message: 'Informe o @ ou link do Instagram.', severity: 'error' });
  }
  if (!project.contactName.trim()) {
    issues.push({ message: 'Informe seu nome.', severity: 'error' });
  }
  if (!project.contactPhone.trim()) {
    issues.push({ message: 'Informe seu WhatsApp.', severity: 'error' });
  }

  return issues;
}

export function validateProject(project: BuilderProject): ValidationIssue[] {
  const issues = [...validatePanels(project), ...validateContact(project)];
  issues.push({
    message: 'Arquivos exportados em RGB. Conversão CMYK será feita na produção.',
    severity: 'warning',
  });
  return issues;
}

export function hasBlockingErrors(issues: ValidationIssue[]): boolean {
  return issues.some((i) => i.severity === 'error');
}
