'use client';

import { useCallback, useEffect, useState, Suspense, type FormEvent } from 'react';
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

const WHATSAPP_NUMBER = '5531985555017';

// WIZARD PAUSED — unused until restored (kept for later completion)
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

type LeadFormState = {
  name: string;
  phone: string;
  email: string;
  bandName: string;
  album: string;
  youtubeUrl: string;
  socialUrl: string;
};

const INITIAL_LEAD: LeadFormState = {
  name: '',
  phone: '',
  email: '',
  bandName: '',
  album: '',
  youtubeUrl: '',
  socialUrl: '',
};

function SimpleLeadForm() {
  const [form, setForm] = useState<LeadFormState>(INITIAL_LEAD);
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormState, string>>>({});

  const inputClass = (field: keyof LeadFormState) =>
    `w-full bg-black border p-4 font-mono text-sm outline-none transition-all placeholder:text-zinc-700 ${
      errors[field]
        ? 'border-red-600 focus:border-red-500'
        : 'border-zinc-800 focus:border-red-600'
    }`;

  const setField = (field: keyof LeadFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const nextErrors: Partial<Record<keyof LeadFormState, string>> = {};
    if (!form.name.trim()) nextErrors.name = 'Informe seu nome';
    if (!form.phone.trim()) nextErrors.phone = 'Informe seu telefone';
    if (!form.email.trim()) nextErrors.email = 'Informe seu e-mail';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'E-mail inválido';
    }
    if (!form.bandName.trim()) nextErrors.bandName = 'Informe o nome da banda';
    if (!form.album.trim()) nextErrors.album = 'Informe o álbum';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const lines = [
      '*SUBMISSÃO DE MATERIAL — Oldisco*',
      '',
      `*NOME:* ${form.name.trim()}`,
      `*TELEFONE:* ${form.phone.trim()}`,
      `*EMAIL:* ${form.email.trim()}`,
      `*BANDA:* ${form.bandName.trim()}`,
      `*ÁLBUM:* ${form.album.trim()}`,
      `*YOUTUBE:* ${form.youtubeUrl.trim() || '—'}`,
      `*REDES:* ${form.socialUrl.trim() || '—'}`,
    ];

    const text = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
  };

  return (
    <section className="px-6 max-w-2xl mx-auto mt-12 space-y-8">
      <div>
        <h2 className="text-3xl font-metal text-white tracking-widest uppercase border-l-4 border-red-600 pl-6 mb-2">
          Envie seu material
        </h2>
        <p className="text-zinc-500 font-mono text-[11px] pl-7">
          Preencha os dados e envie pelo WhatsApp do selo.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 bg-zinc-950 border border-zinc-900 p-6 md:p-8 rounded-sm">
        <div>
          <label className="block text-zinc-400 font-mono text-[10px] tracking-widest uppercase mb-2">
            Nome *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setField('name', e.target.value)}
            placeholder="SEU NOME"
            className={inputClass('name')}
          />
          {errors.name && <p className="mt-1 text-red-600 font-mono text-[10px]">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-zinc-400 font-mono text-[10px] tracking-widest uppercase mb-2">
            Telefone *
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setField('phone', e.target.value)}
            placeholder="(31) 99999-9999"
            className={inputClass('phone')}
          />
          {errors.phone && <p className="mt-1 text-red-600 font-mono text-[10px]">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-zinc-400 font-mono text-[10px] tracking-widest uppercase mb-2">
            Email *
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setField('email', e.target.value)}
            placeholder="SEU@EMAIL.COM"
            className={inputClass('email')}
          />
          {errors.email && <p className="mt-1 text-red-600 font-mono text-[10px]">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-zinc-400 font-mono text-[10px] tracking-widest uppercase mb-2">
            Nome da banda *
          </label>
          <input
            type="text"
            value={form.bandName}
            onChange={(e) => setField('bandName', e.target.value)}
            placeholder="NOME DA BANDA"
            className={inputClass('bandName')}
          />
          {errors.bandName && <p className="mt-1 text-red-600 font-mono text-[10px]">{errors.bandName}</p>}
        </div>

        <div>
          <label className="block text-zinc-400 font-mono text-[10px] tracking-widest uppercase mb-2">
            Álbum *
          </label>
          <input
            type="text"
            value={form.album}
            onChange={(e) => setField('album', e.target.value)}
            placeholder="TÍTULO DO ÁLBUM"
            className={inputClass('album')}
          />
          {errors.album && <p className="mt-1 text-red-600 font-mono text-[10px]">{errors.album}</p>}
        </div>

        <div>
          <label className="block text-zinc-400 font-mono text-[10px] tracking-widest uppercase mb-2">
            Link YouTube
          </label>
          <input
            type="url"
            value={form.youtubeUrl}
            onChange={(e) => setField('youtubeUrl', e.target.value)}
            placeholder="HTTPS://YOUTUBE.COM/..."
            className={inputClass('youtubeUrl')}
          />
        </div>

        <div>
          <label className="block text-zinc-400 font-mono text-[10px] tracking-widest uppercase mb-2">
            Link redes sociais
          </label>
          <input
            type="url"
            value={form.socialUrl}
            onChange={(e) => setField('socialUrl', e.target.value)}
            placeholder="HTTPS://INSTAGRAM.COM/..."
            className={inputClass('socialUrl')}
          />
        </div>

        <button
          type="submit"
          className="w-full mt-4 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-black tracking-[0.3em] uppercase py-4 transition-colors"
        >
          Enviar pelo WhatsApp
        </button>
      </form>
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
            Preencha o formulário com os dados da banda e envie pelo WhatsApp do selo.
          </p>
        </div>
      </section>

      <section className="px-6 max-w-4xl mx-auto mt-12 space-y-12">
        <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-sm">
          <p className="text-zinc-300 font-mono text-sm leading-relaxed">
            A Oldisco é um selo de CDs de black metal e metal extremo. Envie os dados do seu projeto pelo
            formulário abaixo — a conversa continua no WhatsApp do selo.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-sm">
            <Send className="text-red-600 mb-4" size={32} />
            <h3 className="font-metal text-xl text-white mb-3 tracking-wider">ENVIE O MATERIAL</h3>
            <p className="text-zinc-400 font-mono text-[11px]">Demo, EP ou álbum. Links e presença digital no formulário.</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-sm">
            <Mic2 className="text-red-600 mb-4" size={32} />
            <h3 className="font-metal text-xl text-white mb-3 tracking-wider">CONVERSE NO ZAP</h3>
            <p className="text-zinc-400 font-mono text-[11px]">Ao enviar, abrimos o WhatsApp com seus dados prontos.</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-sm">
            <Disc3 className="text-red-600 mb-4" size={32} />
            <h3 className="font-metal text-xl text-white mb-3 tracking-wider">PRODUÇÃO</h3>
            <p className="text-zinc-400 font-mono text-[11px]">Curadoria e produção física. Retorno em até 7 dias úteis.</p>
          </div>
        </div>
      </section>

      <SimpleLeadForm />

      {/* WIZARD PAUSED — restore later
      <Suspense fallback={<div className="py-20 text-center text-zinc-500 font-mono text-sm">Carregando...</div>}>
        <ProduzirMaterialWizard />
      </Suspense>
      */}
    </div>
  );
}

// Keep reference so the paused wizard is not tree-shaken / unused-linted away
void ProduzirMaterialWizard;
void Suspense;
