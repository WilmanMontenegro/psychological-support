'use client';

import { useState, useEffect } from 'react';
import {
  FaWhatsapp,
  FaFacebookF,
  FaLinkedinIn,
  FaLink,
  FaXTwitter,
  FaShare
} from 'react-icons/fa6';
import toast from 'react-hot-toast';

interface ShareButtonsProps {
  title: string;
  variant?: 'default' | 'minimal' | 'social-only';
}

export default function ShareButtons({ title, variant = 'default' }: ShareButtonsProps) {
  const [url, setUrl] = useState('');
  const [mounted, setMounted] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setMounted(true);
    setUrl(window.location.href);
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      setCanNativeShare(true);
    }
  }, []);

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: title,
        text: `Te comparto este artículo: ${title}`,
        url: url,
      });
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('¡Enlace copiado!');
    } catch {
      toast.error('Error al copiar');
    }
  };

  if (!mounted) return null;

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      href: `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`,
      color: 'bg-[#25D366] hover:bg-[#20bd5a]',
    },
    {
      name: 'Facebook',
      icon: FaFacebookF,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: 'bg-[#1877F2] hover:bg-[#166fe5]',
    },
    {
      name: 'X (Twitter)',
      icon: FaXTwitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      color: 'bg-[#000000] hover:bg-[#333333]',
    },
    {
      name: 'LinkedIn',
      icon: FaLinkedinIn,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: 'bg-[#0A66C2] hover:bg-[#0958a8]',
    },

  ];

  if (!url) return null;

  if (variant === 'social-only') {
    if (canNativeShare) {
      return (
        <button
          onClick={handleNativeShare}
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition-all shadow-sm w-full justify-center"
        >
          <FaShare className="text-sm" />
          <span className="font-medium text-sm">Compartir</span>
        </button>
      );
    }

    return (
      <div className="flex items-center justify-center gap-2">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-9 h-9 flex items-center justify-center rounded-full text-white transition-all hover:scale-110 shadow-sm ${link.color}`}
            title={`Compartir en ${link.name}`}
          >
            <link.icon className="text-sm" />
          </a>
        ))}
        <button
          onClick={handleCopyLink}
          className="w-9 h-9 flex items-center justify-center rounded-full text-white bg-secondary hover:bg-opacity-90 transition-all hover:scale-110 shadow-sm"
          title="Copiar enlace"
        >
          <FaLink className="text-sm" />
        </button>
      </div>
    );
  }

  const containerClasses = variant === 'default'
    ? "flex flex-col items-center justify-center py-8 border-t border-b border-gray-100 my-8"
    : "flex flex-col items-center justify-center";

  return (
    <div className={containerClasses}>
      <h3 className="text-lg font-libre-baskerville text-accent mb-4 font-medium">
        ¿Te gustó este artículo? ¡Compártelo!
      </h3>

      {canNativeShare ? (
        <button
          onClick={handleNativeShare}
          className="flex items-center gap-3 px-6 py-3 bg-secondary text-white rounded-full hover:bg-opacity-90 transition-transform hover:-translate-y-1 shadow-md text-lg font-medium"
        >
          <FaShare />
          Compartir en mis redes
        </button>
      ) : (
        <div className="flex flex-wrap gap-3 justify-center">
          {shareLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-10 h-10 flex items-center justify-center rounded-full text-white transition-transform hover:-translate-y-1 shadow-md ${link.color}`}
              aria-label={`Compartir en ${link.name}`}
              title={`Compartir en ${link.name}`}
            >
              <link.icon className="text-lg" />
            </a>
          ))}

          <button
            onClick={handleCopyLink}
            className="w-10 h-10 flex items-center justify-center rounded-full text-white bg-secondary hover:bg-opacity-90 transition-transform hover:-translate-y-1 shadow-md"
            aria-label="Copiar enlace"
            title="Copiar enlace"
          >
            <FaLink className="text-lg" />
          </button>
        </div>
      )}
    </div>
  );
}
