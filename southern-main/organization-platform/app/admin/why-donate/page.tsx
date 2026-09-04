'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { adminDb } from '@/lib/supabase/adminDb';
import { Database } from '@/lib/supabase/types';
import { Save, Plus, Trash2, Edit2, MoveUp, MoveDown } from 'lucide-react';
import MediaRenderer from '@/components/MediaRenderer';
import LoadingSpinner from '@/components/LoadingSpinner';
import FileUpload from '@/components/FileUpload';
import { useNotification } from '@/lib/store';

type WhyDonate = Database['public']['Tables']['why_donate']['Row'];

export default function WhyDonateManagement() {
  const [items, setItems] = useState<WhyDonate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WhyDonate | null>(null);
  const { showNotification } = useNotification();

  const [form, setForm] = useState({
    title: '',
    description: '',
    media_url: '',
    media_type: 'image'
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await (supabase.from('why_donate') as any).select('*').order('display_order', { ascending: true });
      if (error) throw error;
      setItems(data || []);
    } catch (error: any) {
      showNotification('Failed to load items', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title) {
      showNotification('Title is required', 'error');
      return;
    }

    try {
      const payload = {
        title: form.title,
        description: form.description,
        media_url: form.media_url,
        media_type: form.media_type
      };

      if (editingItem) {
        const { error } = await adminDb('why_donate').update(payload).eq('id', editingItem.id);
        if (error) throw error;
        showNotification('Item updated', 'success');
      } else {
        const display_order = items.length;
        const { error } = await adminDb('why_donate').insert([{ ...payload, display_order }]);
        if (error) throw error;
        showNotification('Item added', 'success');
      }
      
      setIsFormOpen(false);
      setEditingItem(null);
      setForm({ title: '', description: '', media_url: '', media_type: 'image' });
      fetchItems();
    } catch (error: any) {
      showNotification(error.message, 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this section?')) return;
    try {
      await adminDb('why_donate').delete().eq('id', id);
      showNotification('Item deleted', 'success');
      fetchItems();
    } catch (error: any) {
      showNotification(error.message, 'error');
    }
  };

  const openEdit = (item: WhyDonate) => {
    setEditingItem(item);
    setForm({
      title: item.title,
      description: item.description || '',
      media_url: item.media_url || '',
      media_type: item.media_type || 'image'
    });
    setIsFormOpen(true);
  };

  const openNew = () => {
    setEditingItem(null);
    setForm({ title: '', description: '', media_url: '', media_type: 'image' });
    setIsFormOpen(true);
  };

  const moveItem = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === items.length - 1)
    ) return;

    const newItems = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setItems(newItems);

    try {
      // Update DB sequentially
      await adminDb('why_donate').update({ display_order: targetIndex }).eq('id', newItems[targetIndex].id);
      await adminDb('why_donate').update({ display_order: index }).eq('id', newItems[index].id);
    } catch (error: any) {
      showNotification('Failed to reorder items', 'error');
      fetchItems();
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Why We Donate</h1>
          <p className="text-gray-500 text-sm">Manage the sections displayed on the public Why We Donate page.</p>
        </div>
        {!isFormOpen && (
          <button
            onClick={openNew}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            <span>Add Section</span>
          </button>
        )}
      </div>

      {isFormOpen ? (
        <div className="bg-white p-6 rounded-xl border shadow-sm mb-8">
          <h2 className="text-xl font-bold mb-6">{editingItem ? 'Edit Section' : 'New Section'}</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g. Empowering Youth"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                rows={4}
                placeholder="Explain the impact of donations here..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Media Upload</label>
                <FileUpload
                  bucket="content"
                  onUploadComplete={(url) => setForm({ ...form, media_url: url })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Media Type</label>
                <select
                  value={form.media_type}
                  onChange={(e) => setForm({ ...form, media_type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md mb-4"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>

                {form.media_url && (
                  <div className="w-full aspect-video rounded-lg overflow-hidden border bg-gray-50">
                    <MediaRenderer src={form.media_url} alt="Media preview" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
              >
                <Save size={20} />
                <span>Save Section</span>
              </button>
            </div>
          </div>
        </div>
      ) : loading ? (
        <div className="flex justify-center p-12"><LoadingSpinner /></div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="bg-white p-4 rounded-xl border flex flex-col md:flex-row gap-6 shadow-sm hover:border-blue-200 transition group">
              <div className="w-full md:w-48 aspect-video rounded-lg overflow-hidden shrink-0 bg-gray-100 relative">
                {item.media_url ? (
                  <MediaRenderer src={item.media_url} alt="Media" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Media</div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-3">{item.description}</p>
              </div>
              <div className="flex flex-col items-center justify-center gap-2 border-l pl-4 shrink-0">
                <button onClick={() => moveItem(index, 'up')} disabled={index === 0} className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30">
                  <MoveUp size={16} />
                </button>
                <button onClick={() => moveItem(index, 'down')} disabled={index === items.length - 1} className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30">
                  <MoveDown size={16} />
                </button>
              </div>
              <div className="flex flex-row md:flex-col justify-center gap-2 border-l pl-4 shrink-0">
                <button
                  onClick={() => openEdit(item)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  title="Edit"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-center py-16 bg-white border border-dashed rounded-xl">
              <p className="text-gray-500">No sections created yet. Click "Add Section" to get started.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
