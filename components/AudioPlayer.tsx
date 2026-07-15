'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Radio } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
 
export const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [vuLevels, setVuLevels] = useState([40, 60, 30, 80, 50]);
  const [currentTrack, setCurrentTrack] = useState('Carregando...');
  const [playlistName, setPlaylistName] = useState('RÁDIO MALDITA');
  const [currentTrackUrl, setCurrentTrackUrl] = useState<string | null>(null);
  const [currentTrackData, setCurrentTrackData] = useState<{
    artist?: string;
    title?: string;
    album?: string;
    artwork?: string;
  } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Atualizar Media Session Metadata
  const updateMediaSessionMetadata = (trackData: {
    artist?: string;
    title?: string;
    album?: string;
    artwork?: string;
  } | null) => {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) {
      return;
    }

    if (!trackData || !trackData.artist || !trackData.title) {
      // Fallback para quando não há track
      navigator.mediaSession.metadata = new MediaMetadata({
        title: 'Oldisco',
        artist: 'RÁDIO MALDITA',
        album: 'BLACK INVOCATION',
      });
      return;
    }

    const artwork: MediaImage[] = [];
    if (trackData.artwork) {
      artwork.push({
        src: trackData.artwork,
        sizes: '512x512',
        type: 'image/jpeg',
      });
    } else {
      // Logo padrão como fallback
      artwork.push({
        src: '/images/logo.png',
        sizes: '512x512',
        type: 'image/jpeg',
      });
    }

    navigator.mediaSession.metadata = new MediaMetadata({
      title: `${trackData.artist} - ${trackData.title} | Oldisco`,
      artist: trackData.artist,
      album: trackData.album || playlistName || 'Oldisco Radio',
      artwork: artwork,
    });
  };

  // Buscar informações da música atual e sua URL
  const fetchCurrentTrack = async () => {
    try {
      const status = await apiClient.getRadioStatus();
      
      if (status.currentTrack) {
        const trackInfo = `${status.currentTrack.artist} - ${status.currentTrack.title}`;
        setCurrentTrack(trackInfo);
        
        // Armazenar dados completos da track
        const trackData = {
          artist: status.currentTrack.artist,
          title: status.currentTrack.title,
          album: status.currentTrack.album || status.currentSchedule?.playlistName,
          artwork: status.currentTrack.artwork || status.currentTrack.image,
        };
        setCurrentTrackData(trackData);
        
        // Atualiza o nome da playlist se houver schedule ativo
        if (status.currentSchedule?.playlistName) {
          setPlaylistName(status.currentSchedule.playlistName.toUpperCase());
        } else {
          setPlaylistName('TRANSMISSÃO BRUTAL');
        }

        // Atualiza a URL da música atual
        if (status.currentTrack.fileUrl) {
          setCurrentTrackUrl(status.currentTrack.fileUrl);
        } else {
          // Se não tem URL no status, busca do endpoint específico
          const trackUrlData = await apiClient.getCurrentTrackUrl();
          if (trackUrlData.url) {
            setCurrentTrackUrl(trackUrlData.url);
          }
        }
      } else {
        setCurrentTrack('Nenhuma música tocando');
        setPlaylistName('TRANSMISSÃO BRUTAL');
        setCurrentTrackUrl(null);
        setCurrentTrackData(null);
      }
    } catch (error) {
      console.error('Erro ao buscar track:', error);
    }
  };

  // Inicializar áudio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.crossOrigin = 'anonymous';
      audioRef.current.preload = 'auto';
      audioRef.current.volume = volume;

      audioRef.current.addEventListener('play', () => {
        setIsPlaying(true);
      });

      audioRef.current.addEventListener('pause', () => {
        setIsPlaying(false);
      });

      audioRef.current.addEventListener('ended', async () => {
        // Quando a música termina naturalmente, busca a próxima
        // Verifica se transmissão ainda está ativa antes de continuar
        try {
          const status = await apiClient.getRadioStatus();
          if (status.isPlaying) {
            // Busca a próxima música e atualiza o estado
            // O useEffect que monitora currentTrackUrl vai cuidar de tocar automaticamente
            await fetchCurrentTrack();
            // Mantém isPlaying como true para que o useEffect toque automaticamente
            setIsPlaying(true);
          } else {
            setIsPlaying(false);
          }
        } catch (error) {
          console.error('Erro ao verificar status:', error);
          setIsPlaying(false);
        }
      });

      audioRef.current.addEventListener('error', (e) => {
        console.error('Erro no áudio:', e);
        setIsPlaying(false);
      });

      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = '';
        }
      };
    }
  }, []);

  // Atualizar Media Session quando track mudar ou quando começar a tocar
  useEffect(() => {
    if (isPlaying && currentTrackData) {
      updateMediaSessionMetadata(currentTrackData);
    } else if (!currentTrackData) {
      updateMediaSessionMetadata(null);
    }
  }, [currentTrackData, playlistName, isPlaying]);

  // Atualizar URL do áudio quando currentTrackUrl mudar
  useEffect(() => {
    if (!audioRef.current || !currentTrackUrl) return;
    
    // Pausa antes de mudar a URL
    audioRef.current.pause();
    audioRef.current.src = currentTrackUrl;
    audioRef.current.load();

    // Se está tocando, retoma a reprodução
    if (isPlaying) {
      audioRef.current.play().catch((error) => {
        console.error('Erro ao retomar reprodução:', error);
        setIsPlaying(false);
      });
    }
  }, [currentTrackUrl, isPlaying]);


  // Atualizar volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // VU Meter simulado
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setVuLevels((prev) => {
        return prev.map(() => Math.floor(Math.random() * 90) + 10);
      });
    }, 150);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Buscar status inicial
  useEffect(() => {
    fetchCurrentTrack();
  }, []);

  const togglePlay = async () => {
    if (!audioRef.current) {
      return;
    }

    try {
      if (isPlaying) {
        audioRef.current.pause();
        return;
      }

      // Buscar status e URL atual
      await fetchCurrentTrack();

      const status = await apiClient.getRadioStatus();
      
      if (!status.isPlaying) {
        alert('A transmissão não está ativa. Inicie a transmissão no painel admin primeiro.');
        return;
      }

      if (!currentTrackUrl) {
        // Se não tem URL ainda, busca do endpoint específico
        const trackUrlData = await apiClient.getCurrentTrackUrl();
        if (!trackUrlData.url) {
          alert('Nenhuma música está tocando no momento.');
          return;
        }
        setCurrentTrackUrl(trackUrlData.url);
      }

      // Tocar o áudio
      try {
        await audioRef.current.play();
      } catch (playError: any) {
        console.error('Erro ao tocar:', playError);
        
        if (playError.name === 'NotAllowedError' || playError.name === 'NotSupportedError') {
          alert('O navegador bloqueou a reprodução automática. Por favor, clique novamente no botão Play.');
        } else {
          alert(`Erro ao reproduzir áudio: ${playError.message || 'Erro desconhecido'}`);
        }
      }
    } catch (error: any) {
      console.error('Erro ao tocar:', error);
      alert(error.message || 'Erro ao conectar à rádio. Verifique se a transmissão está ativa.');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 glass-heavy z-40 flex items-center px-4 md:px-10 border-t-2 border-red-950">
      {/* Info Banda */}
      <div className="flex items-center gap-5 w-1/4">
        <div className="relative shrink-0">
           <div className={`p-3 rounded bg-zinc-900 border border-zinc-800 ${isPlaying ? 'ring-2 ring-red-600/50' : ''}`}>
              <Radio size={24} className={isPlaying ? 'text-red-600' : 'text-zinc-600'} />
           </div>
           {isPlaying && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full animate-ping"></span>}
        </div>
        <div className="hidden lg:block overflow-hidden">
          <p className="text-[10px] text-red-600 font-black uppercase tracking-[0.2em] animate-pulse">{playlistName}</p>
          <p className="text-sm font-bold text-white truncate font-mono">ON AIR: {currentTrack}</p>
        </div>
      </div>

      {/* Controls & VU Meters */}
      <div className="flex-1 flex flex-col items-center justify-center gap-2">
        <div className="flex items-center gap-8">
           <button 
             onClick={togglePlay}
             className="w-14 h-14 rounded-full bg-zinc-900 border-2 border-red-600 hover:bg-red-600 group transition-all duration-300 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.2)]"
           >
             {isPlaying ? 
               <Pause size={24} fill="currentColor" className="text-red-600 group-hover:text-white transition-colors" /> : 
               <Play size={24} fill="currentColor" className="text-red-600 group-hover:text-white transition-colors ml-1" />
             }
           </button>
        </div>
        
        {/* VU Meter Visualizer */}
        <div className="flex gap-1 h-3 items-end">
          {vuLevels.map((lvl, i) => (
            <div 
              key={i} 
              className={`w-4 transition-all duration-150 rounded-t-sm ${lvl > 70 ? 'bg-red-500' : 'bg-red-900'}`} 
              style={{ height: isPlaying ? `${lvl}%` : '2px', opacity: isPlaying ? 1 : 0.2 }}
            ></div>
          ))}
        </div>
      </div>

      {/* Volume & Details */}
      <div className="w-1/4 flex items-center justify-end gap-6">
        <div className="hidden md:flex items-center gap-3 bg-black/40 p-2 rounded border border-zinc-800">
          <button onClick={() => setIsMuted(!isMuted)} className="text-zinc-500 hover:text-red-500 transition-colors">
            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input 
            type="range" 
            min="0" max="1" step="0.01" 
            value={isMuted ? 0 : volume} 
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-24 accent-red-600 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
