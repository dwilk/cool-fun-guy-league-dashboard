'use client';

interface PlayerImageProps {
  src: string;
  alt: string;
  fallbackName: string;
  className?: string;
  size?: number;
}

export function PlayerImage({ src, alt, fallbackName, className = '', size = 40 }: PlayerImageProps) {
  const initials = fallbackName
    .split(' ')
    .map(n => n[0] || '')
    .join('')
    .slice(0, 2);

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=1f2937&color=9ca3af&size=${size}`;
      }}
    />
  );
}

export function AvatarImage({ src, alt, fallbackName, className = '', size = 56 }: PlayerImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=1f2937&color=c9a227&size=${size}`;
      }}
    />
  );
}



