import { Metadata } from 'next';
import ReleasesListClient from './ReleasesListClient';

export const metadata: Metadata = {
  title: 'Próximas Invocações | Lançamentos Futuros de black metal',
  description: 'Descubra os próximos lançamentos do underground metal, álbuns anunciados e datas de lançamento. Anunciamentos e rituais futuros.',
  openGraph: {
    title: 'Próximas Invocações | Oldisco',
    description: 'Descubra os próximos lançamentos do underground metal, álbuns anunciados e datas de lançamento.',
  },
};

export default function ReleasesPage() {
  return <ReleasesListClient />;
}
