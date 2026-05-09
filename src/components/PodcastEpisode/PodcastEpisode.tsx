import React, { useState } from 'react';
import * as css from './PodcastEpisode.module.css';
import SpotifyPlayer from './players/SpotifyPlayer';
import IvooxPlayer from './players/IvooxPlayer';
import RssPlayer from './players/RssPlayer';
import ShareButton from '../ShareButton/ShareButton';

type Platform = 'spotify' | 'pocket-casts' | 'ivoox' | 'rss';

const EMBEDDABLE: Set<Platform> = new Set(['spotify', 'ivoox', 'rss']);

interface PodcastEpisodeProps {
  url: string;
  title?: string;
}

const PLATFORM_LABELS: Record<Platform, string> = {
  spotify: 'escuchar en Spotify',
  'pocket-casts': 'escuchar en Pocket Casts',
  ivoox: 'escuchar en iVoox',
  rss: 'descargar episodio',
};

export function detectPlatform(url: string): Platform {
  if (url.includes('open.spotify.com/episode/')) return 'spotify';
  if (url.includes('pocketcasts.com') || url.includes('pca.st')) return 'pocket-casts';
  if (url.includes('ivoox.com')) return 'ivoox';
  if (/\.(mp3|ogg|wav|m4a|aac|opus)(\?|$)/i.test(url)) return 'rss';
  throw new Error(`URL de podcast no soportada: ${url}`);
}

const PodcastEpisode: React.FC<PodcastEpisodeProps> = ({ url, title }) => {
  const [showPlayer, setShowPlayer] = useState(false);

  const platform = detectPlatform(url);
  const label = PLATFORM_LABELS[platform];
  const embeddable = EMBEDDABLE.has(platform);

  const playLabel = showPlayer
    ? `Ocultar reproductor${title ? `: ${title}` : ''}`
    : `Reproducir${title ? `: ${title}` : ' episodio'}`;

  return (
    <div className={css.episode}>
      <div className={css.compact}>
        {embeddable ? (
          <button
            className={`${css.playButton} ${showPlayer ? css.playButtonActive : ''}`}
            onClick={() => setShowPlayer(prev => !prev)}
            aria-label={playLabel}
            aria-expanded={showPlayer}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </button>
        ) : (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={css.playButton}
            aria-label={`Escuchar${title ? `: ${title}` : ' episodio'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </a>
        )}

        <div className={css.info}>
          {title && <p className={css.title}>{title}</p>}
          <ShareButton url={url} title={label}/>
        </div>
      </div>

      {showPlayer && platform === 'spotify' && (
        <div className={css.player}>
          <SpotifyPlayer url={url} title={title} />
        </div>
      )}

      {showPlayer && platform === 'ivoox' && (
        <div className={css.player}>
          <IvooxPlayer url={url} title={title} />
        </div>
      )}

      {showPlayer && platform === 'rss' && (
        <div className={css.player}>
          <RssPlayer url={url} title={title} />
        </div>
      )}
    </div>
  );
};

export default PodcastEpisode;
