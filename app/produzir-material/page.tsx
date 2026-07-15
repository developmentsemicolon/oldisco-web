import { Metadata } from 'next';
import ProduzirMaterialClient from './ProduzirMaterialClient';

export const metadata: Metadata = {
  title: 'Para Produzir Material | Oldisco - Selo de CDs',
  description: 'Bandas do underground: envie seu material e lance CDs pelo selo Oldisco. Curadoria, produção e lançamento em mídia física.',
  openGraph: {
    title: 'Para Produzir Material | Oldisco',
    description: 'Envie seu material e lance CDs pelo selo Oldisco. Selo underground de black metal.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ProduzirMaterialPage() {
  return <ProduzirMaterialClient />;
}
