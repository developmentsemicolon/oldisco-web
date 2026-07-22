
import { Genre, Product, BlogPost, Order, CartItem } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    artist: 'ABYSSAL VOID',
    album: 'Cataclysmic Echoes',
    genre: Genre.BLACK_METAL,
    price: 45.00,
    image: 'https://picsum.photos/seed/abyssal/600/600',
    stock: 5,
    description: 'A masterpiece of atmospheric black metal from the depths of the Brazilian underground.',
    tracklist: ['Intro', 'Descent', 'Infinite Darkness', 'Void Ritual', 'Outro']
  },
  {
    id: '2',
    artist: 'GUTTED ALIVE',
    album: 'Flesh Harvest',
    genre: Genre.DEATH_METAL,
    price: 39.90,
    image: 'https://picsum.photos/seed/gutted/600/600',
    stock: 12,
    description: 'Raw, brutal death metal focusing on surgical precision and relentless aggression.',
    tracklist: ['Scalpel First', 'Organ Trade', 'Harvesting Skin', 'Septic Shock']
  },
  {
    id: '3',
    artist: 'NUCLEAR WINTER',
    album: 'Radiation Sickness',
    genre: Genre.THRASH_METAL,
    price: 35.00,
    image: 'https://picsum.photos/seed/nuclear/600/600',
    stock: 0,
    description: 'Old school thrash with modern production. Fast, loud, and radioactive.',
    tracklist: ['Meltdown', 'Bunker Life', 'Mutant Stomp', 'Final Flash']
  },
  {
    id: '4',
    artist: 'MORBID RITE',
    album: 'Cursed Relics',
    genre: Genre.DOOM_METAL,
    price: 42.00,
    image: 'https://picsum.photos/seed/morbid/600/600',
    stock: 8,
    description: 'Slow, heavy, and crushing doom metal for the end of times.',
    tracklist: ['Toll of the Bell', 'Ancient Dust', 'Ethereal Fog', 'Deep Grave']
  }
];

export const MOCK_POSTS: BlogPost[] = [
  {
    id: 'p1',
    title: 'O Renascimento do CD Físico',
    slug: 'cd-resurgence',
    excerpt: 'Por que a mídia física é mais importante do que nunca na era digital da música extrema.',
    content: 'Long form content about physical CDs...',
    date: '2024-05-15',
    image: 'https://picsum.photos/seed/cdpost/800/400'
  },
  {
    id: 'p2',
    title: 'Top 10 Lançamentos Underground de 2024',
    slug: 'top-10-2024',
    excerpt: 'Nossa lista definitiva dos lançamentos mais brutais que você provavelmente perdeu este ano.',
    content: 'Full list content...',
    date: '2024-05-10',
    image: 'https://picsum.photos/seed/metalpost/800/400'
  },
  {
    id: 'p3',
    title: 'A Arte da Capa de Álbum',
    slug: 'album-art',
    excerpt: 'Explorando a estética única e brutal das capas de álbum do underground metal.',
    content: 'Content about album artwork...',
    date: '2024-04-28',
    image: 'https://picsum.photos/seed/artpost/800/400'
  },
  {
    id: 'p4',
    title: 'Black Metal Brasileiro: Uma Cena em Ascensão',
    slug: 'brazilian-black-metal',
    excerpt: 'Mapeando a cena de black metal brasileira e suas características únicas no cenário mundial.',
    content: 'Content about Brazilian black metal scene...',
    date: '2024-04-15',
    image: 'https://picsum.photos/seed/brazilpost/800/400'
  },
  {
    id: 'p5',
    title: 'Por Que Ainda Lançamos em CD?',
    slug: 'why-cd',
    excerpt: 'A nostalgia não é o único motivo. Descubra por que CDs continuam relevantes.',
    content: 'Content about why CDs matter...',
    date: '2024-04-01',
    image: 'https://picsum.photos/seed/whycds/800/400'
  },
  {
    id: 'p6',
    title: 'Ritual e Performance no black metal',
    slug: 'ritual-performance',
    excerpt: 'Como o ritualismo e a performance se entrelaçam na música metal extrema.',
    content: 'Content about ritual and performance...',
    date: '2024-03-20',
    image: 'https://picsum.photos/seed/ritualpost/800/400'
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'o1',
    date: '2024-01-15',
    items: [
      {
        ...MOCK_PRODUCTS[0],
        quantity: 1
      },
      {
        ...MOCK_PRODUCTS[1],
        quantity: 2
      }
    ],
    total: 124.80,
    status: 'delivered'
  },
  {
    id: 'o2',
    date: '2024-01-10',
    items: [
      {
        ...MOCK_PRODUCTS[2],
        quantity: 1
      },
      {
        ...MOCK_PRODUCTS[3],
        quantity: 1
      }
    ],
    total: 77.00,
    status: 'shipped'
  },
  {
    id: 'o3',
    date: '2024-01-05',
    items: [
      {
        ...MOCK_PRODUCTS[0],
        quantity: 1
      }
    ],
    total: 45.00,
    status: 'completed'
  },
  {
    id: 'o4',
    date: '2024-01-01',
    items: [
      {
        ...MOCK_PRODUCTS[1],
        quantity: 3
      },
      {
        ...MOCK_PRODUCTS[3],
        quantity: 1
      }
    ],
    total: 161.70,
    status: 'delivered'
  }
];

