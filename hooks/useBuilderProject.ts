'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { BuilderProject } from '@/lib/packaging/types';
import { STORAGE_PREFIX, LEGACY_STORAGE_PREFIX } from '@/lib/packaging/types';
import { createEmptyProject, normalizeProject } from '@/lib/packaging/utils';

function loadProject(id: string): BuilderProject | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${id}`);
    if (raw) return normalizeProject(JSON.parse(raw));
    const legacy = localStorage.getItem(`${LEGACY_STORAGE_PREFIX}${id}`);
    if (legacy) {
      const project = normalizeProject(JSON.parse(legacy));
      localStorage.setItem(`${STORAGE_PREFIX}${id}`, JSON.stringify(project));
      return project;
    }
    return null;
  } catch {
    return null;
  }
}

function saveProject(project: BuilderProject): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${STORAGE_PREFIX}${project.id}`, JSON.stringify(project));
}

export function useBuilderProject(projectId: string | null) {
  const [project, setProjectState] = useState<BuilderProject | null>(null);
  const [loaded, setLoaded] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!projectId) {
      setLoaded(true);
      return;
    }
    const existing = loadProject(projectId);
    setProjectState(existing ?? createEmptyProject(projectId));
    setLoaded(true);
  }, [projectId]);

  const persist = useCallback((next: BuilderProject) => {
    const withTimestamp = { ...next, updatedAt: new Date().toISOString() };
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveProject(withTimestamp);
    }, 500);
    return withTimestamp;
  }, []);

  const setProject = useCallback(
    (updater: BuilderProject | ((prev: BuilderProject) => BuilderProject)) => {
      setProjectState((prev) => {
        if (!prev) return prev;
        const next = typeof updater === 'function' ? updater(prev) : updater;
        return persist(next);
      });
    },
    [persist]
  );

  const updatePanel = useCallback(
    (panelId: string, state: BuilderProject['panels'][string]) => {
      setProject((prev) => ({
        ...prev,
        panels: { ...prev.panels, [panelId]: state },
      }));
    },
    [setProject]
  );

  return { project, setProject, updatePanel, loaded };
}

export function listSavedProjectIds(): string[] {
  if (typeof window === 'undefined') return [];
  const ids = new Set<string>();
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_PREFIX)) ids.add(key.slice(STORAGE_PREFIX.length));
    if (key?.startsWith(LEGACY_STORAGE_PREFIX)) ids.add(key.slice(LEGACY_STORAGE_PREFIX.length));
  }
  return Array.from(ids);
}
