import { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'Sobre Nós | Oldisco - Selo Underground',
  description: 'Oldisco é um selo especializado em CDs, dedicado a preservar e promover a cultura do underground. Conheça nossa missão e valores.',
  openGraph: {
    title: 'Sobre Nós | Oldisco',
    description: 'Selo especializado em CDs, dedicado a preservar e promover a cultura do underground.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
