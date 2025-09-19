"use client";

import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

interface SpotifyResponse {
  isPlaying: boolean;
  track?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  spotifyUrl?: string;
  progress?: number;
  duration?: number;
}

const fetchNowPlaying = async (): Promise<SpotifyResponse> => {
  const response = await fetch('https://nowplayingwidget.vercel.app/api/now-playing/0e14e651-5f86-485b-af92-8d316adb5e77');
  if (!response.ok) {
    throw new Error('Failed to fetch now playing');
  }
  return response.json();
};

export function NowPlaying() {
  const {
    data: trackData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['nowPlaying'],
    queryFn: fetchNowPlaying,
    refetchInterval: 30000, // 30 segundos
    staleTime: 25000, // 25 segundos
    retry: 2,
  });

  const formatProgress = (progress: number, duration: number) => {
    const formatTime = (ms: number) => {
      const minutes = Math.floor(ms / 60000);
      const seconds = Math.floor((ms % 60000) / 1000);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };
    
    return `${formatTime(progress)} / ${formatTime(duration)}`;
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-foreground"></div>
          <span className="text-muted-foreground">Conectando con Spotify...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-3">
          <svg className="text-muted-foreground" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
          <span className="text-muted-foreground">Error conectando con Spotify</span>
        </div>
      </div>
    );
  }

  if (!trackData || !trackData.isPlaying || !trackData.track) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-3">
          <svg className="text-muted-foreground" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
          <span className="text-muted-foreground">No hay música reproduciéndose</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 relative">
          {trackData.albumImageUrl ? (
            <div className="relative">
              <Image
                src={trackData.albumImageUrl}
                alt={`Portada de ${trackData.album}`}
                width={60}
                height={60}
                className="rounded-md shadow-md"
              />
              {trackData.isPlaying && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse border-2 border-background"></div>
              )}
            </div>
          ) : (
            <div className="w-15 h-15 bg-muted rounded-md flex items-center justify-center">
              <svg className="text-foreground" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground text-balance truncate">{trackData.track}</h3>
            {trackData.isPlaying && (
              <span className="flex items-center gap-1 text-xs text-green-500 font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                En vivo
              </span>
            )}
          </div>
          <p className="text-foreground text-sm truncate">
            {trackData.artist} • {trackData.album}
          </p>
          {trackData.progress && trackData.duration && (
            <div className="mt-2">
              <div className="w-full bg-muted rounded-full h-1">
                <div 
                  className="bg-green-500 h-1 rounded-full transition-all duration-1000" 
                  style={{ width: `${(trackData.progress / trackData.duration) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatProgress(trackData.progress, trackData.duration)}
              </p>
            </div>
          )}
        </div>

        <div className="flex-shrink-0">
          {trackData.spotifyUrl && (
            <a 
              href={trackData.spotifyUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-foreground hover:text-green-500 transition-colors"
              title="Abrir en Spotify"
            >
              <ExternalLink size={20} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
