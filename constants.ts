
import { Genre, Product, BlogPost, Band, Order, CartItem } from './types';

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

export const MOCK_BANDS: Band[] = [
  {
    id: 'b1',
    name: 'ABYSSAL VOID',
    slug: 'abyssal-void',
    genre: Genre.BLACK_METAL,
    bio: 'Formada nas profundezas do underground brasileiro, ABYSSAL VOID explora os abismos mais sombrios do black metal atmosférico. Com uma sonoridade que mescla melancolia e fúria, a banda cria paisagens sonoras que transportam o ouvinte para dimensões de escuridão absoluta.',
    website: 'https://abyssalvoid.bandcamp.com',
    image: 'https://picsum.photos/seed/abyssal-band/800/600',
    discography: ['1']
  },
  {
    id: 'b2',
    name: 'GUTTED ALIVE',
    slug: 'gutted-alive',
    genre: Genre.DEATH_METAL,
    bio: 'Brutalidade cirúrgica e precisão técnica definem GUTTED ALIVE. Com influências do death metal clássico e grindcore, a banda entrega uma experiência visceral que não deixa espaço para contemplação. Cada nota é calculada para máxima destruição.',
    website: 'https://guttedalive.bandcamp.com',
    image: 'https://picsum.photos/seed/gutted-band/800/600',
    discography: ['2']
  },
  {
    id: 'b3',
    name: 'NUCLEAR WINTER',
    slug: 'nuclear-winter',
    genre: Genre.THRASH_METAL,
    bio: 'Velocidade, agressão e riffs radioativos. NUCLEAR WINTER resgata o espírito do thrash metal dos anos 80 com uma produção moderna e letras que refletem sobre o colapso da sociedade. Uma bomba atômica sonora que não perdoa.',
    website: 'https://nuclearwinter.bandcamp.com',
    image: 'https://picsum.photos/seed/nuclear-band/800/600',
    discography: ['3']
  },
  {
    id: 'b4',
    name: 'MORBID RITE',
    slug: 'morbid-rite',
    genre: Genre.DOOM_METAL,
    bio: 'Ritualismo sombrio e peso esmagador. MORBID RITE navega pelas águas mais pesadas do doom metal, criando uma atmosfera opressiva que prende o ouvinte em um estado de contemplação mórbida. Cada acorde é uma sentença de morte.',
    website: 'https://morbidrite.bandcamp.com',
    image: 'https://picsum.photos/seed/morbid-band/800/600',
    discography: ['4']
  },
  {
    id: 'b5',
    name: 'CRIMSON ALTAR',
    slug: 'crimson-altar',
    genre: Genre.BLACK_METAL,
    bio: 'Sacrifícios sonoros em altares de sangue. CRIMSON ALTAR combina black metal raw com elementos de folk pagão, criando uma experiência ritualística única. A banda explora temas de paganismo, natureza e escuridão ancestral.',
    website: 'https://crimsonaltar.bandcamp.com',
    image: 'https://picsum.photos/seed/crimson-band/800/600',
    discography: []
  },
  {
    id: 'b6',
    name: 'FLESH ROT',
    slug: 'flesh-rot',
    genre: Genre.GRINDCORE,
    bio: 'Grindcore puro e direto ao ponto. FLESH ROT não perde tempo com intros ou interlúdios - apenas destruição em sua forma mais pura. Blast beats implacáveis, vocais guturais e riffs que cortam como facas.',
    website: 'https://fleshrot.bandcamp.com',
    image: 'https://picsum.photos/seed/flesh-band/800/600',
    discography: []
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

