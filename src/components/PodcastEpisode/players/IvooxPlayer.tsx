import React from 'react';
import * as css from './IvooxPlayer.module.css';

interface IvooxPlayerProps {
  url: string;
  title?: string;
}

export function getIvooxId(url: string): string {
  const match = url.match(/_rf_(\d+)_/);
  if (!match) throw new Error(`URL de iVoox no válida: ${url}`);
  return match[1];
}

const IvooxPlayer: React.FC<IvooxPlayerProps> = ({ url, title }) => (
  <iframe
    className={css.player}
    src={`https://www.ivoox.com/player_ej_${getIvooxId(url)}_6_1.html`}
    width="100%"
    height="200"
    frameBorder="0"
    allowFullScreen
    loading="lazy"
    title={title || 'Episodio de iVoox'}
  />
);

export default IvooxPlayer;
