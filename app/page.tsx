import { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Oldisco | Selo de CDs e Black Metal Underground',
  description: 'Oldisco é um selo e curadoria dedicados a demos raras, CDs e lançamentos obscuros de black metal underground do mundo todo. Rádio 24/7, artigos e coleção de CDs.',
  openGraph: {
    title: 'Oldisco | Selo de CDs e Black Metal Underground',
    description: 'Descubra demos raras, CDs e lançamentos obscuros de black metal underground. Oldisco traz curadoria especializada, rádio 24/7, artigos e selo dedicado ao metal extremo.',
  }
};

export default function HomePage() {
  return <HomeClient />;
}
