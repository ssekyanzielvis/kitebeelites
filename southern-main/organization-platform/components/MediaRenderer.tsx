import Image from 'next/image';

interface MediaRendererProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  // If true, render a simpler video tag (no autoplay, controls only on hover, muted always) for thumbnails
  isThumbnail?: boolean;
}

export default function MediaRenderer({
  src,
  alt,
  className = '',
  fill = false,
  priority = false,
  quality,
  isThumbnail = false,
}: MediaRendererProps) {
  if (!src) {
    return <div className={`bg-gray-200 flex items-center justify-center text-gray-400 ${className}`}>No Media</div>;
  }

  const isVideo = src.match(/\.(mp4|webm|ogg)$/i) || src.includes('video');

  if (isVideo) {
    if (isThumbnail) {
      return (
        <video
          src={src}
          className={className}
          muted
          playsInline
          loop
          autoPlay
          style={{ objectFit: 'cover' }}
        />
      );
    }

    return (
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className={className}
        style={fill ? { objectFit: 'cover', width: '100%', height: '100%' } : {}}
      />
    );
  }

  // Determine if it's an external URL (Supabase storage URL) or a static asset
  const isExternal = src.startsWith('http');

  if (fill) {
    if (isExternal) {
      // Bypassing Next.js image optimization to prevent ECONNRESET timeouts fetching from Supabase
      return (
        <img 
          src={src} 
          alt={alt} 
          className={className} 
          style={{ position: 'absolute', height: '100%', width: '100%', left: 0, top: 0, right: 0, bottom: 0, objectFit: 'cover' }} 
        />
      );
    }
    return <Image src={src} alt={alt} fill className={className} priority={priority} quality={quality} />;
  }

  // Without fill, if it's a relative next/image (like static assets), we need width/height
  // but we can just use a standard img tag if dimensions aren't provided.
  if (isExternal) {
    // If not fill and external, next/image demands width/height. We don't have them here.
    return <img src={src} alt={alt} className={className} />;
  }

  // For static assets without fill, we can still use next/image if they are statically imported
  // But here `src` is a string, so we just use <img> to be safe.
  return <img src={src} alt={alt} className={className} />;
}
