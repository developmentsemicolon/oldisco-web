import { Metadata } from 'next';
import BlogListClient from './BlogListClient';

export const metadata: Metadata = {
  title: 'Grimório | Artigos sobre black metal e a cena underground',
  description: 'Artigos, resenhas e reflexões sobre o underground metal, a cena extrema e o universo do selo. Conhecimento e ritual do underground.',
  openGraph: {
    title: 'Grimório | Oldisco',
    description: 'Artigos, resenhas e reflexões sobre o underground metal e a cena extrema.',
  },
};

export default function BlogPage() {
  return <BlogListClient />;
}
