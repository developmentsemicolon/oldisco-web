
export enum Genre {
  BLACK_METAL = 'Black Metal',
  DEATH_METAL = 'Death Metal',
  THRASH_METAL = 'Thrash Metal',
  DOOM_METAL = 'Doom Metal',
  GRINDCORE = 'Grindcore'
}

export interface Product {
  id: string;
  artist: string;
  album: string;
  genre: Genre;
  price: number;
  image: string;
  stock: number;
  description: string;
  tracklist: string[];
  catalogNumber?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
  slug: string;
}

export interface Band {
  id: string;
  name: string;
  slug: string;
  genre: string;
  description?: string;
  logo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RadioState {
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  currentTrack: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'completed' | 'shipped' | 'delivered';
}

export interface RadioTrack {
  id: string;
  title: string;
  artist: string;
  band?: string;
  album?: string;
  genre?: string;
  duration?: number;
  fileUrl: string;
  r2Key: string;
  fileSize: number;
  mimeType: string;
  status: 'ACTIVE' | 'ARCHIVED';
  priority: number;
  playCount: number;
  lastPlayedAt?: string;
  addedById: string;
  createdAt: string;
  updatedAt: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  tracks: { track: RadioTrack; order: number }[];
  createdAt: string;
  updatedAt: string;
}

export interface Schedule {
  id: string;
  dayOfWeek: number; // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  startTime: string; // Formato HH:mm
  endTime: string; // Formato HH:mm
  playlistId: string;
  playlist: Playlist;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

