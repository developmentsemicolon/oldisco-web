'use client';

import { Disc3, Music2, Package } from 'lucide-react';
import type { BuilderProject, PackagingId } from '@/lib/packaging/types';
import { PACKAGING_TEMPLATES, QUANTITY_TIERS, ADDON_PRICES } from '@/lib/packaging/templates';
import { estimateTotal, formatBRL } from '@/lib/packaging/pricing';

interface StepPackageProps {
  project: BuilderProject;
  onChange: (patch: Partial<BuilderProject>) => void;
  onNext: () => void;
}

export function StepPackage({ project, onChange, onNext }: StepPackageProps) {
  const inputClass =
    'w-full bg-black border border-zinc-800 focus:border-red-600 p-4 font-mono text-sm outline-none transition-all placeholder:text-zinc-700';

  const canNext =
    project.templateId !== null &&
    project.bandName.trim() &&
    project.albumTitle.trim();

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-metal text-white tracking-widest uppercase border-l-4 border-red-600 pl-6 mb-2">
          Pacote e Projeto
        </h2>
        <p className="text-zinc-500 font-mono text-[11px] pl-7">
          Informe banda, álbum e selecione o formato físico do lançamento.
        </p>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-sm grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-500 tracking-widest uppercase flex items-center gap-2">
            <Music2 size={12} className="text-red-600" /> Nome da Banda *
          </label>
          <input
            value={project.bandName}
            onChange={(e) => onChange({ bandName: e.target.value })}
            placeholder="NOME DA BANDA"
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-500 tracking-widest uppercase">
            Título do Lançamento *
          </label>
          <input
            value={project.albumTitle}
            onChange={(e) => onChange({ albumTitle: e.target.value })}
            placeholder="TÍTULO DO LANÇAMENTO"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PACKAGING_TEMPLATES.map((pkg) => (
          <button
            key={pkg.id}
            type="button"
            onClick={() => onChange({ templateId: pkg.id as PackagingId })}
            className={`text-left p-6 border rounded-sm transition-all ${
              project.templateId === pkg.id
                ? 'border-red-600 bg-red-950/20'
                : 'border-zinc-900 bg-zinc-950 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-start gap-4">
              <Package className="text-red-600 shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-metal text-lg text-white tracking-wider uppercase">
                  {pkg.label}
                </h3>
                <p className="text-zinc-500 font-mono text-[10px] mt-2 leading-relaxed">
                  {pkg.description}
                </p>
                <p className="text-red-600 font-mono text-[10px] mt-3 font-black">
                  A partir de R$ {pkg.basePrice.toFixed(2)}/un
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-sm space-y-6">
        <h3 className="font-metal text-white tracking-wider uppercase text-sm">Opcionais</h3>

        <label className="flex items-center justify-between gap-4 cursor-pointer group">
          <div>
            <span className="text-zinc-300 font-mono text-sm">Slipcase</span>
            <p className="text-zinc-600 font-mono text-[10px]">Caixa externa de proteção</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-zinc-500 font-mono text-[10px]">+R$ {ADDON_PRICES.slipcase}/un</span>
            <input
              type="checkbox"
              checked={project.addons.slipcase}
              onChange={(e) =>
                onChange({ addons: { ...project.addons, slipcase: e.target.checked } })
              }
              className="w-5 h-5 accent-red-600"
            />
          </div>
        </label>

        <div>
          <span className="text-zinc-300 font-mono text-sm block mb-3">Páginas extras no encarte</span>
          <div className="flex flex-wrap gap-3">
            {([0, 4, 8] as const).map((pages) => (
              <button
                key={pages}
                type="button"
                onClick={() =>
                  onChange({ addons: { ...project.addons, extraBookletPages: pages } })
                }
                className={`px-4 py-2 font-mono text-[10px] tracking-widest uppercase border transition-all ${
                  project.addons.extraBookletPages === pages
                    ? 'border-red-600 text-red-600 bg-red-950/20'
                    : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'
                }`}
              >
                {pages === 0 ? 'Padrão' : `+${pages} pág`}
                {pages === 4 && ` (+R$${ADDON_PRICES.extraBooklet4})`}
                {pages === 8 && ` (+R$${ADDON_PRICES.extraBooklet8})`}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="text-zinc-300 font-mono text-sm block mb-3">Tiragem</span>
          <div className="flex flex-wrap gap-3">
            {QUANTITY_TIERS.map((qty) => (
              <button
                key={qty}
                type="button"
                onClick={() => onChange({ quantity: qty })}
                className={`px-4 py-2 font-mono text-[10px] tracking-widest uppercase border transition-all ${
                  project.quantity === qty
                    ? 'border-red-600 text-red-600 bg-red-950/20'
                    : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'
                }`}
              >
                {qty} un
              </button>
            ))}
          </div>
        </div>

        {project.templateId && (
          <div className="flex items-center gap-3 pt-4 border-t border-zinc-900">
            <Disc3 className="text-red-600" size={20} />
            <span className="text-zinc-400 font-mono text-sm">
              Orçamento estimado:{' '}
              <strong className="text-white">{formatBRL(estimateTotal(project))}</strong>
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          disabled={!canNext}
          onClick={onNext}
          className="px-10 py-4 bg-red-600 text-white font-black tracking-[0.25em] text-[11px] uppercase disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-500 transition-all"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
