'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Radio } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

type RadioTrack = {
  id: string;
  title: string;
  artist: string;
  album?: string | null;
  duration?: number | null;
  fileUrl: string;
};

const PLAYLIST_REFRESH_MS = 8 * 60 * 1000;

export const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [vuLevels, setVuLevels] = useState([40, 60, 30, 80, 50]);
  const [currentTrack, setCurrentTrack] = useState('Carregando...');
  const [playlistName, setPlaylistName] = useState('RÁDIO MALDITA');
  const [currentTrackData, setCurrentTrackData] = useState<{
    artist?: string;
    title?: string;
    album?: string;
    artwork?: string;
  } | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const tracksRef = useRef<RadioTrack[]>([]);
  const trackIndexRef = useRef(0);
  const playlistNameRef = useRef(playlistName);
  const playNextTrackRef = useRef<() => Promise<void>>(async () => {});

  useEffect(() => {
    playlistNameRef.current = playlistName;
  }, [playlistName]);

  const updateMediaSessionMetadata = useCallback(
    (trackData: {
      artist?: string;
      title?: string;
      album?: string;
      artwork?: string;
    } | null) => {
      if (typeof window === 'undefined' || !('mediaSession' in navigator)) {
        return;
      }

      if (!trackData || !trackData.artist || !trackData.title) {
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
    },
    [playlistName]
  );

  const applyTrack = useCallback(
    (track: RadioTrack, shouldPlay: boolean) => {
      setCurrentTrack(`${track.artist} - ${track.title}`);

      const trackData = {
        artist: track.artist,
        title: track.title,
        album: track.album || playlistNameRef.current,
      };
      setCurrentTrackData(trackData);
      updateMediaSessionMetadata(trackData);

      if (!audioRef.current) return;

      audioRef.current.pause();
      audioRef.current.src = track.fileUrl;
      audioRef.current.load();

      if (shouldPlay) {
        audioRef.current.play().catch((error) => {
          console.error('Erro ao tocar faixa:', error);
          setIsPlaying(false);
        });
      }
    },
    [updateMediaSessionMetadata]
  );

  const loadPlaylist = useCallback(
    async (opts?: { resetIndex?: boolean; autoPlay?: boolean; silent?: boolean }) => {
      try {
        const data = await apiClient.getRadioPlaylist();
        const previousId = tracksRef.current[trackIndexRef.current]?.id;
        tracksRef.current = data.tracks;
        setPlaylistName((data.playlistName || 'TRANSMISSÃO BRUTAL').toUpperCase());

        if (!data.isPlaying || data.tracks.length === 0) {
          if (!opts?.silent) {
            setCurrentTrack('Nenhuma música tocando');
            setCurrentTrackData(null);
            if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current.removeAttribute('src');
            }
            setIsPlaying(false);
          }
          return data;
        }

        // Refresh silencioso: só atualiza a fila; não interrompe a faixa atual
        if (opts?.silent) {
          if (previousId) {
            const found = data.tracks.findIndex((t) => t.id === previousId);
            if (found >= 0) trackIndexRef.current = found;
          }
          return data;
        }

        const start =
          opts?.resetIndex === false
            ? Math.min(trackIndexRef.current, data.tracks.length - 1)
            : Math.min(Math.max(data.startIndex, 0), data.tracks.length - 1);

        trackIndexRef.current = start;
        applyTrack(data.tracks[start], Boolean(opts?.autoPlay));
        return data;
      } catch (error) {
        console.error('Erro ao carregar playlist:', error);
        if (!opts?.silent) {
          setCurrentTrack('Erro ao conectar à rádio');
        }
        return null;
      }
    },
    [applyTrack]
  );

  const playNextTrack = useCallback(async () => {
    try {
      const status = await apiClient.getRadioStatus();
      if (!status.isPlaying) {
        setIsPlaying(false);
        return;
      }
    } catch {
      // Se status falhar, ainda tenta avançar com a fila local
    }

    if (tracksRef.current.length === 0) {
      await loadPlaylist({ resetIndex: true, autoPlay: true });
      return;
    }

    trackIndexRef.current = (trackIndexRef.current + 1) % tracksRef.current.length;
    applyTrack(tracksRef.current[trackIndexRef.current], true);
    setIsPlaying(true);
  }, [applyTrack, loadPlaylist]);

  useEffect(() => {
    playNextTrackRef.current = playNextTrack;
  }, [playNextTrack]);

  // Inicializar áudio uma vez
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.preload = 'auto';
    audio.volume = volume;
    audioRef.current = audio;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      void playNextTrackRef.current();
    };
    const onError = (e: Event) => {
      console.error('Erro no áudio:', e);
      setIsPlaying(false);
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount once
  }, []);

  useEffect(() => {
    if (isPlaying && currentTrackData) {
      updateMediaSessionMetadata(currentTrackData);
    } else if (!currentTrackData) {
      updateMediaSessionMetadata(null);
    }
  }, [currentTrackData, playlistName, isPlaying, updateMediaSessionMetadata]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setVuLevels(() =>
        Array.from({ length: 5 }, () => Math.floor(Math.random() * 90) + 10)
      );
    }, 150);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Carga inicial + refresh periódico da playlist (sem cortar a faixa atual)
  useEffect(() => {
    void loadPlaylist({ resetIndex: true, autoPlay: false });
    const interval = setInterval(() => {
      void loadPlaylist({ silent: true });
    }, PLAYLIST_REFRESH_MS);
    return () => clearInterval(interval);
  }, [loadPlaylist]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        return;
      }

      const data = await loadPlaylist({ resetIndex: true, autoPlay: false });
      if (!data) {
        alert('Erro ao conectar à rádio. Verifique se a API está online.');
        return;
      }

      if (!data.isPlaying) {
        alert('A transmissão não está ativa. Inicie a transmissão no painel admin primeiro.');
        return;
      }

      if (data.tracks.length === 0) {
        alert('Nenhuma música está tocando no momento.');
        return;
      }

      trackIndexRef.current = Math.min(
        Math.max(data.startIndex, 0),
        data.tracks.length - 1
      );
      applyTrack(data.tracks[trackIndexRef.current], true);
      setIsPlaying(true);
    } catch (error: unknown) {
      console.error('Erro ao tocar:', error);
      const message = error instanceof Error ? error.message : 'Erro ao conectar à rádio.';
      alert(message);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 glass-heavy z-40 flex items-center px-4 md:px-10 border-t-2 border-red-950">
      <div className="flex items-center gap-5 w-1/4">
        <div className="relative shrink-0">
          <div
            className={`p-3 rounded bg-zinc-900 border border-zinc-800 ${
              isPlaying ? 'ring-2 ring-red-600/50' : ''
            }`}
          >
            <Radio size={24} className={isPlaying ? 'text-red-600' : 'text-zinc-600'} />
          </div>
          {isPlaying && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full animate-ping"></span>
          )}
        </div>
        <div className="hidden lg:block overflow-hidden">
          <p className="text-[10px] text-red-600 font-black uppercase tracking-[0.2em] animate-pulse">
            {playlistName}
          </p>
          <p className="text-sm font-bold text-white truncate font-mono">ON AIR: {currentTrack}</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-2">
        <div className="flex items-center gap-8">
          <button
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-zinc-900 border-2 border-red-600 hover:bg-red-600 group transition-all duration-300 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.2)]"
          >
            {isPlaying ? (
              <Pause
                size={24}
                fill="currentColor"
                className="text-red-600 group-hover:text-white transition-colors"
              />
            ) : (
              <Play
                size={24}
                fill="currentColor"
                className="text-red-600 group-hover:text-white transition-colors ml-1"
              />
            )}
          </button>
        </div>

        <div className="flex gap-1 h-3 items-end">
          {vuLevels.map((lvl, i) => (
            <div
              key={i}
              className={`w-4 transition-all duration-150 rounded-t-sm ${
                lvl > 70 ? 'bg-red-500' : 'bg-red-900'
              }`}
              style={{ height: isPlaying ? `${lvl}%` : '2px', opacity: isPlaying ? 1 : 0.2 }}
            ></div>
          ))}
        </div>
      </div>

      <div className="w-1/4 flex items-center justify-end gap-6">
        <div className="hidden md:flex items-center gap-3 bg-black/40 p-2 rounded border border-zinc-800">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-zinc-500 hover:text-red-500 transition-colors"
          >
            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-24 accent-red-600 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
