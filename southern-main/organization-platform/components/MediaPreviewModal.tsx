import { X } from 'lucide-react';

interface MediaPreviewModalProps {
  url: string;
  onClose: () => void;
}

export default function MediaPreviewModal({ url, onClose }: MediaPreviewModalProps) {
  if (!url) return null;
  const isVideo = url.match(/\.(mp4|webm|ogg)$/i);

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 p-2 rounded-full text-white transition-colors"
      >
        <X className="w-6 h-6" />
      </button>
      <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
        {isVideo ? (
          <video 
            src={url} 
            controls 
            autoPlay 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
          />
        ) : (
          <img 
            src={url} 
            alt="Preview" 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
          />
        )}
      </div>
    </div>
  );
}
