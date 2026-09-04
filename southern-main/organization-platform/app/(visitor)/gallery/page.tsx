'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import Image from 'next/image';
import {
  X, ChevronLeft, ChevronRight, ZoomIn, Play,
  Images, Loader2
} from 'lucide-react';
import { useAppStore, useHydratedTheme } from '@/lib/store';

interface GalleryItem {
  id: string;
  image_url: string;
  media_type: 'image' | 'video';
  description: string | null;
  category: string | null;
  is_featured: boolean;
}

export default function GalleryPage() {
  const { theme } = useHydratedTheme();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filtered, setFiltered] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCat, setSelectedCat] = useState('all');
  const [loading, setLoading] = useState(true);

  // Lightbox
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  useEffect(() => { fetchGallery(); }, []);

  useEffect(() => {
    setFiltered(
      selectedCat === 'all' ? items : items.filter(i => i.category === selectedCat)
    );
  }, [selectedCat, items]);

  // Keyboard navigation for lightbox
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (lightboxIdx === null) return;
    if (e.key === 'Escape') setLightboxIdx(null);
    if (e.key === 'ArrowRight') setLightboxIdx(i => (i! + 1) % filtered.length);
    if (e.key === 'ArrowLeft') setLightboxIdx(i => (i! - 1 + filtered.length) % filtered.length);
  }, [lightboxIdx, filtered.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  // Lock scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = lightboxIdx !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxIdx]);

  const fetchGallery = async () => {
    try {
      const { data, error } = await (supabase.from('gallery') as any)
        .select('id, image_url, media_type, description, category, is_featured')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      const list = (data || []) as GalleryItem[];
      setItems(list);
      setFiltered(list);
      const cats = Array.from(new Set(list.map(i => i.category).filter(Boolean))) as string[];
      setCategories(cats);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (idx: number) => setLightboxIdx(idx);
  const closeLightbox = () => setLightboxIdx(null);
  const prev = () => setLightboxIdx(i => (i! - 1 + filtered.length) % filtered.length);
  const next = () => setLightboxIdx(i => (i! + 1) % filtered.length);

  const current = lightboxIdx !== null ? filtered[lightboxIdx] : null;

  // ── Masonry column split (3 cols) ─────────────────────────────────────────
  const col0 = filtered.filter((_, i) => i % 3 === 0);
  const col1 = filtered.filter((_, i) => i % 3 === 1);
  const col2 = filtered.filter((_, i) => i % 3 === 2);

  const GalleryCard = ({ item, globalIdx }: { item: GalleryItem; globalIdx: number }) => (
    <div
      onClick={() => openLightbox(globalIdx)}
      className="relative overflow-hidden rounded-2xl cursor-pointer group shadow-md hover:shadow-2xl transition-all duration-300 bg-gray-100"
    >
      {/* Media */}
      {item.media_type === 'video' ? (
        <div className="relative w-full">
          <video
            src={item.image_url}
            className="w-full object-cover block"
            muted
            playsInline
            preload="metadata"
          />
          {/* Play icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-14 h-14 bg-black/50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play size={24} className="text-white fill-white ml-1" />
            </div>
          </div>
        </div>
      ) : (
        <img
          src={item.image_url}
          alt={item.description || 'Gallery image'}
          className="w-full object-cover block group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      )}

      {/* Caption overlay — appears on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 pointer-events-none">
        {item.description && (
          <p className="text-white text-sm font-medium leading-snug drop-shadow-sm">
            {item.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-2">
          {item.is_featured && (
            <span className="text-[10px] font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded">
              ★ Featured
            </span>
          )}
          {item.category && (
            <span className="text-[10px] font-semibold bg-white/20 text-white px-1.5 py-0.5 rounded backdrop-blur-sm">
              {item.category}
            </span>
          )}
        </div>
      </div>

      {/* Zoom hint */}
      <div className="absolute top-3 right-3 w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <ZoomIn size={14} className="text-white" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative py-20 px-4 text-center overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto">
          <span 
            className="inline-block border text-sm font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wider uppercase opacity-70"
            style={{ borderColor: 'currentColor' }}
          >
            Photo & Video Gallery
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Our
            <span className="block" style={{ color: theme.primaryColor }}>
              Moments & Memories
            </span>
          </h1>
          <p className="text-xl opacity-70 leading-relaxed max-w-2xl mx-auto">
            A visual journey through our events, activities, and community highlights. 
            Hover over any image to see its caption.
          </p>
          {!loading && (
            <p className="mt-4 opacity-50 text-sm">
              {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* Category filter */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {['all', ...categories].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className="px-5 py-2 rounded-full text-sm font-semibold transition-all border"
                style={{ 
                  backgroundColor: selectedCat === cat ? theme.primaryColor : 'transparent',
                  color: selectedCat === cat ? '#ffffff' : 'inherit',
                  borderColor: selectedCat === cat ? theme.primaryColor : 'currentColor',
                  opacity: selectedCat === cat ? 1 : 0.6
                }}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        )}

        {/* Gallery */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={40} className="animate-spin opacity-50" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <Images size={56} className="opacity-30 mx-auto mb-4" />
            <p className="opacity-50 text-xl">
              {selectedCat === 'all' ? 'No gallery items yet.' : `No items in "${selectedCat}".`}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile: single column */}
            <div className="flex flex-col gap-4 sm:hidden">
              {filtered.map((item, idx) => (
                <GalleryCard key={item.id} item={item} globalIdx={idx} />
              ))}
            </div>

            {/* Tablet+: masonry 3-col */}
            <div className="hidden sm:grid grid-cols-3 gap-4 items-start">
              {[col0, col1, col2].map((col, ci) => (
                <div key={ci} className="flex flex-col gap-4">
                  {col.map(item => {
                    const globalIdx = filtered.indexOf(item);
                    return <GalleryCard key={item.id} item={item} globalIdx={globalIdx} />;
                  })}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── LIGHTBOX ──────────────────────────────────────────────────────────── */}
      {current && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center transition-colors z-10"
          >
            <X size={20} className="text-white" />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/50 text-sm bg-black/40 px-3 py-1 rounded-full">
            {lightboxIdx! + 1} / {filtered.length}
          </div>

          {/* Prev */}
          {filtered.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); prev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center transition-colors z-10"
            >
              <ChevronLeft size={24} className="text-white" />
            </button>
          )}

          {/* Media */}
          <div
            className="relative max-w-5xl max-h-[85vh] mx-auto px-16"
            onClick={e => e.stopPropagation()}
          >
            {current.media_type === 'video' ? (
              <video
                src={current.image_url}
                controls
                autoPlay
                className="max-h-[80vh] max-w-full rounded-2xl shadow-2xl"
              />
            ) : (
              <img
                src={current.image_url}
                alt={current.description || ''}
                className="max-h-[80vh] max-w-full object-contain rounded-2xl shadow-2xl"
              />
            )}

            {/* Caption bar */}
            {current.description && (
              <div className="absolute bottom-0 left-0 right-0 mx-4 mb-4 bg-black/70 backdrop-blur-sm rounded-xl px-4 py-3">
                <p className="text-white text-sm leading-relaxed text-center">
                  {current.description}
                </p>
              </div>
            )}
          </div>

          {/* Next */}
          {filtered.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); next(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center transition-colors z-10"
            >
              <ChevronRight size={24} className="text-white" />
            </button>
          )}

          {/* Thumbnail strip */}
          {filtered.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 overflow-x-auto px-4 pb-1">
              {filtered.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={e => { e.stopPropagation(); setLightboxIdx(idx); }}
                  className={`shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === lightboxIdx ? 'border-blue-400 opacity-100' : 'border-transparent opacity-40 hover:opacity-70'
                  }`}
                >
                  {item.media_type === 'video' ? (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <Play size={14} className="text-white fill-white" />
                    </div>
                  ) : (
                    <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
