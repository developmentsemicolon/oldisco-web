'use client';

import { useCallback, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { nanoid } from 'nanoid';
import { Disc3, Mic2, Send } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { WizardProgress } from '@/components/builder/WizardProgress';
import { StepPackage } from '@/components/builder/StepPackage';
import { StepEditor } from '@/components/builder/StepEditor';
import { StepPreview } from '@/components/builder/StepPreview';
import { StepReview } from '@/components/builder/StepReview';
import { StepContact } from '@/components/builder/StepContact';
import { useBuilderProject } from '@/hooks/useBuilderProject';
import type { BuilderProject, BuilderStep } from '@/lib/packaging/types';
import { ensurePanelKeys } from '@/lib/packaging/utils';

function ProduzirMaterialWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('p');
  const { project, setProject, updatePanel, loaded } = useBuilderProject(projectId);

  useEffect(() => {
    if (!projectId) {
      router.replace(`/produzir-material?p=${nanoid(10)}`);
    }
  }, [projectId, router]);

  const goTo = (step: BuilderStep) => {
    setProject((p) => ({ ...p, step }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const applyPatch = useCallback(
    (patch: Partial<BuilderProject>) => {
      setProject((prev) =>
        ensurePanelKeys({
          ...prev,
          ...patch,
          addons: patch.addons ? { ...prev.addons, ...patch.addons } : prev.addons,
          panels: patch.panels ? { ...prev.panels, ...patch.panels } : prev.panels,
        })
      );
    },
    [setProject]
  );

  const markExported = useCallback(() => {
    setProject((p) => ({ ...p, exported: true }));
  }, [setProject]);

  if (!loaded || !project || !projectId) {
    return (
      <div className="py-20 text-center">
        <p className="text-zinc-500 font-mono text-sm animate-pulse">Carregando projeto...</p>
      </div>
    );
  }

  return (
    <section className="px-6 max-w-5xl mx-auto mt-12 space-y-12">
      <WizardProgress current={project.step} />

      {project.step === 1 && (
        <StepPackage project={project} onChange={applyPatch} onNext={() => goTo(2)} />
      )}
      {project.step === 2 && (
        <StepEditor project={project} updatePanel={updatePanel} onNext={() => goTo(3)} onBack={() => goTo(1)} />
      )}
      {project.step === 3 && (
        <StepPreview project={project} onPreviewCanvas={() => {}} onNext={() => goTo(4)} onBack={() => goTo(2)} />
      )}
      {project.step === 4 && (
        <StepReview project={project} onBack={() => goTo(3)} onNext={() => goTo(5)} onExported={markExported} />
      )}
      {project.step === 5 && (
        <StepContact project={project} onChange={applyPatch} onBack={() => goTo(4)} onExported={markExported} />
      )}

      <p className="text-center text-zinc-700 font-mono text-[10px] pb-8">
        Projeto <span className="text-zinc-500">{project.id}</span> · Salvo automaticamente neste navegador
      </p>
    </section>
  );
}

export default function ProduzirMaterialClient() {
  return (
    <div className="bg-black pt-32 pb-40">
      <section className="relative min-h-[50vh] flex flex-col items-center justify-center px-6">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black z-10" />
          <img
            src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1920&auto=format&fit=crop"
            className="w-full h-full object-cover grayscale opacity-10 contrast-150"
            alt="Estúdio underground"
          />
        </div>
        <div className="relative z-10 w-full flex flex-col items-center text-center space-y-8">
          <Logo size="lg" />
          <div className="flex items-center justify-center gap-4 text-red-600 font-mono text-[10px] font-black tracking-[0.4em] uppercase">
            <span className="h-[1px] w-12 bg-red-900/50" />
            SEL. UNDERGROUND • OLDISCO
            <span className="h-[1px] w-12 bg-red-900/50" />
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-metal text-white tracking-widest uppercase max-w-4xl">
            PARA PRODUZIR MATERIAL
          </h1>
          <p className="text-zinc-400 text-sm md:text-base font-mono leading-relaxed opacity-80 max-w-2xl uppercase tracking-tighter">
            Escolha o pacote, monte a arte do CD e finalize com seus dados de contato.
          </p>
        </div>
      </section>

      <section className="px-6 max-w-4xl mx-auto mt-12 space-y-12">
        <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-sm">
          <p className="text-zinc-300 font-mono text-sm leading-relaxed">
            A Oldisco é um selo de CDs de black metal e metal extremo. Preencha o pacote, monte a arte painel a painel,
            exporte o ZIP print-ready e envie tudo pelo WhatsApp do selo.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-sm">
            <Send className="text-red-600 mb-4" size={32} />
            <h3 className="font-metal text-xl text-white mb-3 tracking-wider">ENVIE O MATERIAL</h3>
            <p className="text-zinc-400 font-mono text-[11px]">Demo, EP ou álbum. Links e presença digital no passo final.</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-sm">
            <Mic2 className="text-red-600 mb-4" size={32} />
            <h3 className="font-metal text-xl text-white mb-3 tracking-wider">MONTE A ARTE</h3>
            <p className="text-zinc-400 font-mono text-[11px]">Jewel, digipack ou acrílico. Upload painel a painel com preview.</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-sm">
            <Disc3 className="text-red-600 mb-4" size={32} />
            <h3 className="font-metal text-xl text-white mb-3 tracking-wider">PRODUÇÃO</h3>
            <p className="text-zinc-400 font-mono text-[11px]">ZIP print-ready + WhatsApp. Retorno em até 7 dias úteis.</p>
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="py-20 text-center text-zinc-500 font-mono text-sm">Carregando...</div>}>
        <ProduzirMaterialWizard />
      </Suspense>
    </div>
  );
}
