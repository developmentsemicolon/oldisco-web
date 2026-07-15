'use client';

import type { BuilderStep } from '@/lib/packaging/types';

const STEPS: { num: BuilderStep; label: string }[] = [
  { num: 1, label: 'Pacote' },
  { num: 2, label: 'Arte' },
  { num: 3, label: 'Preview' },
  { num: 4, label: 'Revisão' },
  { num: 5, label: 'Contato' },
];

interface WizardProgressProps {
  current: BuilderStep;
}

export function WizardProgress({ current }: WizardProgressProps) {
  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
      {STEPS.map((step, i) => {
        const done = current > step.num;
        const active = current === step.num;
        return (
          <div key={step.num} className="flex items-center gap-2 md:gap-4">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-mono text-xs font-black border transition-all ${
                  active
                    ? 'bg-red-600 border-red-600 text-white'
                    : done
                      ? 'bg-zinc-900 border-red-900 text-red-600'
                      : 'bg-black border-zinc-800 text-zinc-600'
                }`}
              >
                {done ? '✓' : step.num}
              </div>
              <span
                className={`text-[9px] font-mono tracking-widest uppercase hidden sm:block ${
                  active ? 'text-red-600' : 'text-zinc-600'
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-6 md:w-12 h-[1px] ${done ? 'bg-red-900' : 'bg-zinc-800'}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
