import React from 'react';
import * as css from './RssPlayer.module.css';

interface RssPlayerProps {
  url: string;
  title?: string;
}

const RssPlayer: React.FC<RssPlayerProps> = ({ url, title }) => (
  <audio
    className={css.player}
    controls
    preload="metadata"
    aria-label={title || 'Episodio de podcast'}
  >
    <source src={url} type="audio/mpeg" />
  </audio>
);

export default RssPlayer;
