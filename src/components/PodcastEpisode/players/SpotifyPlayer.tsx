import React from 'react';
import * as css from './SpotifyPlayer.module.css';

interface SpotifyPlayerProps {
  url: string;
  title?: string;
}

export function getSpotifyId(url: string): string {
  const match = url.match(/open\.spotify\.com\/episode\/([a-zA-Z0-9]+)/);
  if (!match) throw new Error(`URL de Spotify no válida: ${url}`);
  return match[1];
}

const SpotifyPlayer: React.FC<SpotifyPlayerProps> = ({ url, title }) => (
  <iframe
    className={css.player}
    src={`https://open.spotify.com/embed/episode/${getSpotifyId(url)}?utm_source=generator`}
    width="100%"
    height="152"
    frameBorder="0"
    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    loading="lazy"
    title={title || 'Episodio de Spotify'}
  />
);

export default SpotifyPlayer;
