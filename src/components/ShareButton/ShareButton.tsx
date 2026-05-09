import React, { useState, useEffect } from 'react';
import * as css from './ShareButton.module.css';

interface ShareButtonProps {
  title?: string;
  text?: string;
  url?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ title, text, url }) => {
  const [copied, setCopied] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark as client-side rendered
    setIsClient(true);
  }, []);

  const handleShare = async () => {
    const currentUrl = url || window.location.href;

    // Try Web Share API first (available on mobile)
    if (navigator.share) {
      try {
        // iOS requires only url for best compatibility
        await navigator.share({
          url: currentUrl,
        });
        return; // Success
      } catch (err) {
        // User cancelled or error occurred
        const error = err as Error;
        if (error.name === 'AbortError') {
          // User cancelled, do nothing
          return;
        }
        // Continue to fallback
      }
    }
    
    // Fallback: copy URL to clipboard only
    fallbackToCopy(currentUrl);
  };

  const fallbackToCopy = async (shareUrl: string) => {
    try {
      // Try modern clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error('Error copying to clipboard:', err);
        }
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  // Only render on client side
  if (!isClient) {
    return null;
  }

  return (
    <button
      onClick={handleShare}
      className={css.shareButton}
      aria-label="Compartir esta página"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
      <span className={css.label}>
        <span aria-live="polite">{copied ? 'Copiado' : title}</span>
      </span>
    </button>
  );
};

export default ShareButton;
