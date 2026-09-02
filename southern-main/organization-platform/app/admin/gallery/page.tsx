'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { adminDb } from '@/lib/supabase/adminDb';
import { Database } from '@/lib/supabase/types';
import {
  Plus, Edit3, Trash2, Eye, EyeOff, Upload, X, Check,
  Images, Loader2, AlertCircle, Star, StarOff, RefreshCw,
  ImageIcon, FileVideo
} from 'lucide-react';
import { useNotification } from '@/lib/store';

type GalleryItem = Database['public']['Tables']['gallery']['Row'];

// ── A single queued file before upload ──────────────────────────────────────
interface QueuedFile {
  id: string;                 // local-only uuid
  file: File;
  preview: string;            // local blob URL
  caption: string;
  mediaType: 'image' | 'video';
  status: 'pending' | 'uploading' | 'done' | 'error';
  errorMsg?: string;
  uploadedUrl?: string;
}

// ── Helper ───────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2) + Date.now();

const detectType = (file: File): 'image' | 'video' =>
  file.type.startsWith('video/') ? 'video' : 'image';

export default function GalleryManagement() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  // Multi-upload queue
  const [queue, setQueue] = useState<QueuedFile[]>([]);
  const [uploadingAll, setUploadingAll] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit modal
  const [editItem, setEditItem] = useState<GalleryItem | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [editActive, setEditActive] = useState(true);
  const [editFeatured, setEditFeatured] = useState(false);
  const [editSaving, setEditSaving] = useState(false);

  // Delete confirm
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { fetchGallery(); }, []);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase.from('gallery') as any)
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setGallery(data || []);
    } catch {
      showNotification('Failed to load gallery', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ── File selection ─────────────────────────────────────────────────────────
  const addFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files);
    const valid = arr.filter(f => f.type.startsWith('image/') || f.type.startsWith('video/'));
    if (valid.length < arr.length) {
      showNotification(`${arr.length - valid.length} file(s) skipped — only images/videos allowed.`, 'warning');
    }
    const newItems: QueuedFile[] = valid.map(f => ({
      id: uid(),
      file: f,
      preview: URL.createObjectURL(f),
      caption: '',
      mediaType: detectType(f),
      status: 'pending',
    }));
    setQueue(prev => [...prev, ...newItems]);
  }, [showNotification]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
    e.target.value = '';
  };

  // Drag & Drop
  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  // ── Update caption in queue ────────────────────────────────────────────────
  const updateCaption = (id: string, caption: string) => {
    setQueue(prev => prev.map(q => q.id === id ? { ...q, caption } : q));
  };

  const removeQueued = (id: string) => {
    setQueue(prev => {
      const item = prev.find(q => q.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter(q => q.id !== id);
    });
  };

  // ── Upload single file ─────────────────────────────────────────────────────
  const uploadOne = async (item: QueuedFile): Promise<void> => {
    setQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'uploading' } : q));
    try {
      const ext = item.file.name.split('.').pop();
      const fileName = `${uid()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('gallery')
        .upload(fileName, item.file, { cacheControl: '3600', upsert: false });
      if (upErr) throw upErr;

      const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(fileName);

      // Insert into gallery table
      const { error: dbErr } = await adminDb('gallery').insert({
        image_url: publicUrl,
        media_type: item.mediaType,
        description: item.caption.trim() || null,
        is_active: true,
        is_featured: false,
        order_index: 0,
      });
      if (dbErr) throw new Error(dbErr.message || 'DB insert failed');

      setQueue(prev => prev.map(q => q.id === item.id
        ? { ...q, status: 'done', uploadedUrl: publicUrl }
        : q));
    } catch (err: any) {
      setQueue(prev => prev.map(q => q.id === item.id
        ? { ...q, status: 'error', errorMsg: err.message || 'Upload failed' }
        : q));
    }
  };

  // ── Upload all pending ─────────────────────────────────────────────────────
  const uploadAll = async () => {
    const pending = queue.filter(q => q.status === 'pending' || q.status === 'error');
    if (!pending.length) return;
    setUploadingAll(true);
    await Promise.all(pending.map(uploadOne));
    setUploadingAll(false);
    await fetchGallery();
    // Auto-clear done after a moment
    setTimeout(() => {
      setQueue(prev => prev.filter(q => q.status !== 'done'));
    }, 2000);
    showNotification('Gallery updated!', 'success');
  };

  const clearDone = () => {
    setQueue(prev => {
      prev.filter(q => q.status === 'done').forEach(q => URL.revokeObjectURL(q.preview));
      return prev.filter(q => q.status !== 'done');
    });
  };

  // ── Edit ───────────────────────────────────────────────────────────────────
  const openEdit = (item: GalleryItem) => {
    setEditItem(item);
    setEditCaption(item.description || '');
    setEditActive(item.is_active);
    setEditFeatured(item.is_featured);
  };

  const saveEdit = async () => {
    if (!editItem) return;
    setEditSaving(true);
    try {
      const { error } = await adminDb('gallery').update({
        description: editCaption.trim() || null,
        is_active: editActive,
        is_featured: editFeatured,
        updated_at: new Date().toISOString(),
      }).eq('id', editItem.id);
      if (error) throw error;
      showNotification('Updated!', 'success');
      setEditItem(null);
      fetchGallery();
    } catch {
      showNotification('Update failed', 'error');
    } finally {
      setEditSaving(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await adminDb('gallery').delete().eq('id', deleteId);
      showNotification('Deleted', 'success');
      setDeleteId(null);
      fetchGallery();
    } catch {
      showNotification('Delete failed', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // ── Toggle active ──────────────────────────────────────────────────────────
  const toggleActive = async (item: GalleryItem) => {
    await adminDb('gallery').update({ is_active: !item.is_active }).eq('id', item.id);
    fetchGallery();
  };

  // ── Stats ──────────────────────────────────────────────────────────────────
  const total = gallery.length;
  const active = gallery.filter(g => g.is_active).length;
  const featured = gallery.filter(g => g.is_featured).length;
  const pendingCount = queue.filter(q => q.status === 'pending' || q.status === 'error').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
          <p className="text-gray-500 mt-1">Upload photos and videos — visitors see captions on hover</p>
        </div>
        <button onClick={fetchGallery} disabled={loading}
          className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: total, color: 'blue' },
          { label: 'Visible', value: active, color: 'emerald' },
          { label: 'Featured', value: featured, color: 'amber' },
        ].map(s => (
          <div key={s.label} className={`bg-${s.color}-50 border border-${s.color}-100 rounded-xl p-4 text-center`}>
            <p className="text-3xl font-bold text-gray-900">{s.value}</p>
            <p className={`text-sm font-medium text-${s.color}-600`}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── UPLOAD ZONE ─────────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Upload size={18} className="text-blue-600" />
            <h2 className="font-bold text-gray-900">Upload to Gallery</h2>
            <span className="text-sm text-gray-400">— select multiple files at once</span>
          </div>
          {queue.length > 0 && (
            <button onClick={clearDone} className="text-xs text-gray-400 hover:text-gray-600">
              Clear done
            </button>
          )}
        </div>

        <div className="p-6 space-y-4">
          {/* Drop zone */}
          <div
            ref={dropRef}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-xl p-10 text-center cursor-pointer transition-colors group"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 bg-blue-50 group-hover:bg-blue-100 rounded-2xl flex items-center justify-center transition-colors">
                <Images size={28} className="text-blue-500" />
              </div>
              <div>
                <p className="font-semibold text-gray-700 group-hover:text-blue-700 transition-colors">
                  Drop files here or click to browse
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Images &amp; videos · Any number of files · 20 MB per file
                </p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>

          {/* Queue items */}
          {queue.length > 0 && (
            <div className="space-y-3">
              {queue.map(item => (
                <div key={item.id} className={`flex gap-4 p-3 rounded-xl border transition-colors ${
                  item.status === 'done' ? 'border-emerald-200 bg-emerald-50'
                  : item.status === 'error' ? 'border-red-200 bg-red-50'
                  : item.status === 'uploading' ? 'border-blue-200 bg-blue-50'
                  : 'border-gray-200 bg-gray-50'
                }`}>
                  {/* Thumbnail */}
                  <div className="shrink-0 w-20 h-16 rounded-lg overflow-hidden bg-gray-200">
                    {item.mediaType === 'video' ? (
                      <video src={item.preview} className="w-full h-full object-cover" />
                    ) : (
                      <img src={item.preview} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                    <p className="text-sm font-medium text-gray-700 truncate">{item.file.name}</p>
                    <input
                      type="text"
                      placeholder="Add a caption (optional)…"
                      value={item.caption}
                      onChange={e => updateCaption(item.id, e.target.value)}
                      disabled={item.status !== 'pending' && item.status !== 'error'}
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400/40 disabled:opacity-60"
                    />
                    {item.status === 'error' && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle size={12} />{item.errorMsg}
                      </p>
                    )}
                  </div>

                  {/* Status badge + remove */}
                  <div className="shrink-0 flex flex-col items-center gap-2 justify-center">
                    {item.status === 'uploading' && (
                      <Loader2 size={20} className="text-blue-500 animate-spin" />
                    )}
                    {item.status === 'done' && (
                      <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                    {item.status === 'error' && (
                      <AlertCircle size={20} className="text-red-500" />
                    )}
                    {(item.status === 'pending' || item.status === 'error') && (
                      <button onClick={() => removeQueued(item.id)}
                        className="w-6 h-6 bg-gray-200 hover:bg-red-100 rounded-full flex items-center justify-center transition-colors">
                        <X size={12} className="text-gray-500 hover:text-red-500" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Upload All button */}
              {pendingCount > 0 && (
                <button
                  onClick={uploadAll}
                  disabled={uploadingAll}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  {uploadingAll ? (
                    <><Loader2 size={18} className="animate-spin" />Uploading {pendingCount} file{pendingCount > 1 ? 's' : ''}…</>
                  ) : (
                    <><Upload size={18} />Upload {pendingCount} file{pendingCount > 1 ? 's' : ''} to Gallery</>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── EXISTING GALLERY GRID ────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Existing Gallery ({total} items)</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={32} className="text-blue-500 animate-spin" />
          </div>
        ) : gallery.length === 0 ? (
          <div className="text-center py-16">
            <Images size={48} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400">No gallery items yet. Upload some above.</p>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {gallery.map(item => (
              <div key={item.id} className="group relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 aspect-square">
                {/* Media */}
                {item.media_type === 'video' ? (
                  <video src={item.image_url} className="w-full h-full object-cover" />
                ) : (
                  <img src={item.image_url} alt={item.description || ''} className="w-full h-full object-cover" />
                )}

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-2.5">
                  {/* Caption */}
                  {item.description && (
                    <p className="text-white text-xs leading-snug line-clamp-3 bg-black/40 rounded-lg px-2 py-1.5">
                      {item.description}
                    </p>
                  )}
                  {/* Actions */}
                  <div className="flex gap-1.5 justify-end">
                    <button onClick={() => toggleActive(item)}
                      title={item.is_active ? 'Hide from visitors' : 'Make visible'}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${item.is_active ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-gray-500 hover:bg-gray-600'}`}>
                      {item.is_active ? <Eye size={13} className="text-white" /> : <EyeOff size={13} className="text-white" />}
                    </button>
                    <button onClick={() => openEdit(item)}
                      className="w-7 h-7 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors">
                      <Edit3 size={13} className="text-white" />
                    </button>
                    <button onClick={() => setDeleteId(item.id)}
                      className="w-7 h-7 bg-red-600 hover:bg-red-700 rounded-lg flex items-center justify-center transition-colors">
                      <Trash2 size={13} className="text-white" />
                    </button>
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute top-1.5 left-1.5 flex gap-1 pointer-events-none">
                  {item.is_featured && (
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">★</span>
                  )}
                  {!item.is_active && (
                    <span className="bg-gray-700/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">Hidden</span>
                  )}
                  {item.media_type === 'video' && (
                    <span className="bg-purple-600/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">▶</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── EDIT MODAL ───────────────────────────────────────────────────────── */}
      {editItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="font-bold text-gray-900 text-lg mb-4">Edit Gallery Item</h3>
            {/* Preview */}
            <div className="w-full h-40 rounded-xl overflow-hidden bg-gray-100 mb-4">
              {editItem.media_type === 'video' ? (
                <video src={editItem.image_url} controls className="w-full h-full object-cover" />
              ) : (
                <img src={editItem.image_url} alt="" className="w-full h-full object-cover" />
              )}
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Caption</label>
                <textarea
                  rows={3}
                  value={editCaption}
                  onChange={e => setEditCaption(e.target.value)}
                  placeholder="Brief caption visible on hover…"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/40 resize-none"
                />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editActive} onChange={e => setEditActive(e.target.checked)} className="w-4 h-4 accent-emerald-600" />
                  <span className="text-sm font-medium text-gray-700">Visible to visitors</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editFeatured} onChange={e => setEditFeatured(e.target.checked)} className="w-4 h-4 accent-amber-500" />
                  <span className="text-sm font-medium text-gray-700">Featured</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setEditItem(null)}
                className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={saveEdit} disabled={editSaving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                {editSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM ───────────────────────────────────────────────────── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Delete Image?</h3>
            <p className="text-gray-500 text-sm mb-6">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={confirmDelete} disabled={deleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                {deleting ? <Loader2 size={16} className="animate-spin" /> : null}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
