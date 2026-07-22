const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  role?: string;
}

export interface GoogleExchangeDto {
  code: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Adicionar token se existir
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorMessage = 'Erro na requisição';
        try {
          const error = await response.json();
          errorMessage = error.message || error.error || errorMessage;
        } catch {
          // Se não conseguir parsear JSON, usar mensagem padrão
          errorMessage = `Erro ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const jsonData = await response.json();
      return jsonData;
    } catch (error) {
      // Se for erro de rede (CORS, conexão, etc)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Erro de conexão. Verifique se a API está rodando e se o CORS está configurado corretamente.');
      }
      throw error;
    }
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  }

  // Autenticação
  async login(credentials: LoginDto): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(data: RegisterDto): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMe(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      // Ignorar erros de logout (token pode estar expirado)
      console.error('Logout error:', error);
    }
  }

  initiateGoogleAuth(): void {
    // Redireciona para o endpoint do Google OAuth na API
    window.location.href = `${this.baseURL}/auth/google`;
  }

  async exchangeGoogleCode(code: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/google/exchange', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }

  // Radio API Methods
  async uploadTrack(file: File, metadata: {
    title: string;
    artist: string;
    band?: string;
    album?: string;
    genre?: string;
    duration?: number;
    priority?: number;
  }): Promise<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', metadata.title);
    formData.append('artist', metadata.artist);
    if (metadata.band) formData.append('band', metadata.band);
    if (metadata.album) formData.append('album', metadata.album);
    if (metadata.genre) formData.append('genre', metadata.genre);
    if (metadata.duration) formData.append('duration', metadata.duration.toString());
    if (metadata.priority) formData.append('priority', metadata.priority.toString());

    const response = await fetch(`${this.baseURL}/radio/admin/tracks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro no upload' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getRadioTracks(): Promise<any[]> {
    return this.request<any[]>('/radio/admin/tracks');
  }

  async getRadioTrack(id: string): Promise<any> {
    return this.request<any>(`/radio/admin/tracks/${id}`);
  }

  async updateTrack(id: string, data: {
    title?: string;
    artist?: string;
    band?: string;
    album?: string;
    genre?: string;
    duration?: number;
    status?: string;
    priority?: number;
  }): Promise<any> {
    return this.request<any>(`/radio/admin/tracks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTrack(id: string): Promise<void> {
    await this.request(`/radio/admin/tracks/${id}`, {
      method: 'DELETE',
    });
  }

  async reorderPlaylist(tracks: { id: string; priority: number }[]): Promise<void> {
    await this.request('/radio/admin/tracks/reorder', {
      method: 'POST',
      body: JSON.stringify({ tracks }),
    });
  }

  async startRadio(): Promise<void> {
    await this.request('/radio/admin/play', {
      method: 'POST',
    });
  }

  async pauseRadio(): Promise<void> {
    await this.request('/radio/admin/pause', {
      method: 'POST',
    });
  }

  async getRadioStatus(): Promise<any> {
    return this.request<any>('/radio/status');
  }

  async getCurrentTrackUrl(): Promise<{ url: string | null; track: any | null }> {
    return this.request<{ url: string | null; track: any | null }>('/radio/current-track-url');
  }

  async getRadioPlaylist(): Promise<{
    isPlaying: boolean;
    playlistName: string;
    startIndex: number;
    tracks: Array<{
      id: string;
      title: string;
      artist: string;
      album?: string | null;
      duration?: number | null;
      fileUrl: string;
    }>;
  }> {
    return this.request('/radio/playlist');
  }

  async getRadioStats(): Promise<any> {
    return this.request<any>('/radio/admin/stats');
  }

  // Playlist API Methods
  async createPlaylist(data: { name: string; description?: string }): Promise<any> {
    return this.request<any>('/radio/admin/playlists', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAllPlaylists(): Promise<any[]> {
    return this.request<any[]>('/radio/admin/playlists');
  }

  async getPlaylist(id: string): Promise<any> {
    return this.request<any>(`/radio/admin/playlists/${id}`);
  }

  async updatePlaylist(id: string, data: { name?: string; description?: string }): Promise<any> {
    return this.request<any>(`/radio/admin/playlists/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePlaylist(id: string): Promise<void> {
    await this.request(`/radio/admin/playlists/${id}`, {
      method: 'DELETE',
    });
  }

  async addTrackToPlaylist(playlistId: string, trackId: string): Promise<void> {
    await this.request(`/radio/admin/playlists/${playlistId}/tracks`, {
      method: 'POST',
      body: JSON.stringify({ trackId }),
    });
  }

  async removeTrackFromPlaylist(playlistId: string, trackId: string): Promise<void> {
    await this.request(`/radio/admin/playlists/${playlistId}/tracks/${trackId}`, {
      method: 'DELETE',
    });
  }

  async reorderPlaylistTracks(playlistId: string, tracks: { trackId: string; order: number }[]): Promise<void> {
    await this.request(`/radio/admin/playlists/${playlistId}/tracks/reorder`, {
      method: 'PUT',
      body: JSON.stringify({ tracks }),
    });
  }

  // Schedule API Methods
  async createSchedule(data: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    playlistId: string;
    isActive?: boolean;
  }): Promise<any> {
    return this.request<any>('/radio/admin/schedules', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAllSchedules(): Promise<any[]> {
    return this.request<any[]>('/radio/admin/schedules');
  }

  async getSchedule(id: string): Promise<any> {
    return this.request<any>(`/radio/admin/schedules/${id}`);
  }

  async updateSchedule(id: string, data: {
    dayOfWeek?: number;
    startTime?: string;
    endTime?: string;
    playlistId?: string;
    isActive?: boolean;
  }): Promise<any> {
    return this.request<any>(`/radio/admin/schedules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSchedule(id: string): Promise<void> {
    await this.request(`/radio/admin/schedules/${id}`, {
      method: 'DELETE',
    });
  }

  // Products API Methods
  async createProduct(data: {
    band: string;
    album: string;
    genre: string;
    year: number;
    price: number;
    stock: number;
    description?: string;
    available?: boolean;
    images?: File[];
    tracklist?: {
      sideA: string[];
      sideB?: string[];
    };
    catalogNumber?: string;
  }): Promise<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const formData = new FormData();
    formData.append('band', data.band);
    formData.append('album', data.album);
    formData.append('genre', data.genre);
    formData.append('year', data.year.toString());
    formData.append('price', data.price.toString());
    formData.append('stock', data.stock.toString());
    if (data.description) formData.append('description', data.description);
    if (data.available !== undefined) formData.append('available', data.available.toString());
    if (data.tracklist) formData.append('tracklist', JSON.stringify(data.tracklist));
    if (data.catalogNumber) formData.append('catalogNumber', data.catalogNumber);
    
    if (data.images && data.images.length > 0) {
      data.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    const response = await fetch(`${this.baseURL}/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro ao criar produto' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getProducts(): Promise<any[]> {
    return this.request<any[]>('/products');
  }

  async getProduct(id: string): Promise<any> {
    return this.request<any>(`/products/${id}`);
  }

  async updateProduct(id: string, data: {
    band?: string;
    album?: string;
    genre?: string;
    year?: number;
    price?: number;
    stock?: number;
    description?: string;
    available?: boolean;
    tracklist?: {
      sideA: string[];
      sideB?: string[];
    };
    catalogNumber?: string;
  }): Promise<any> {
    return this.request<any>(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteProduct(id: string): Promise<void> {
    await this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Blog API Methods
  async getBlogPosts(): Promise<any[]> {
    return this.request<any[]>('/blog');
  }

  async getBlogPost(slug: string): Promise<any> {
    return this.request<any>(`/blog/${slug}`);
  }

  async createBlogPost(data: {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    image?: string;
    date?: string;
  }): Promise<any> {
    return this.request<any>('/blog', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBlogPost(slug: string, data: {
    slug?: string;
    title?: string;
    excerpt?: string;
    content?: string;
    image?: string;
    date?: string;
  }): Promise<any> {
    return this.request<any>(`/blog/${slug}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteBlogPost(slug: string): Promise<void> {
    await this.request(`/blog/${slug}`, {
      method: 'DELETE',
    });
  }

  async uploadBlogImage(file: File): Promise<{ url: string }> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${this.baseURL}/blog/upload-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro no upload' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Releases API Methods
  async getReleases(): Promise<any[]> {
    return this.request<any[]>('/releases');
  }

  async getRelease(slug: string): Promise<any> {
    return this.request<any>(`/releases/${slug}`);
  }

  async createRelease(data: {
    slug: string;
    title: string;
    band: string;
    album: string;
    genre: string;
    releaseDate: string;
    description?: string;
    image?: string;
    status?: string;
  }): Promise<any> {
    return this.request<any>('/releases', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRelease(slug: string, data: {
    slug?: string;
    title?: string;
    band?: string;
    album?: string;
    genre?: string;
    releaseDate?: string;
    description?: string;
    image?: string;
    status?: string;
  }): Promise<any> {
    return this.request<any>(`/releases/${slug}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteRelease(slug: string): Promise<void> {
    await this.request(`/releases/${slug}`, {
      method: 'DELETE',
    });
  }

  async uploadReleaseImage(file: File): Promise<{ url: string }> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${this.baseURL}/releases/upload-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro no upload' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Bands API Methods
  async getBands(): Promise<any[]> {
    return this.request<any[]>('/bands');
  }

  async getBand(slug: string): Promise<any> {
    return this.request<any>(`/bands/${slug}`);
  }

  async createBand(data: {
    name: string;
    genre: string;
    description?: string;
    logo?: string;
  }): Promise<any> {
    return this.request<any>('/bands', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBand(slug: string, data: {
    name?: string;
    genre?: string;
    description?: string;
    logo?: string;
  }): Promise<any> {
    return this.request<any>(`/bands/${slug}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteBand(slug: string): Promise<void> {
    await this.request(`/bands/${slug}`, {
      method: 'DELETE',
    });
  }

  async uploadBandImage(file: File): Promise<{ url: string }> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${this.baseURL}/bands/upload-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro no upload' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

export const apiClient = new ApiClient(API_URL);
