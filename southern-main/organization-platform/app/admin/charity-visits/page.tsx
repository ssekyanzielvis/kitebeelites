'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { adminDb } from '@/lib/supabase/adminDb';
import { Database } from '@/lib/supabase/types';
import { Save, Plus, Trash2, Edit2, MapPin, Calendar, Target, DollarSign, X, CheckCircle, Image as ImageIcon } from 'lucide-react';
import MediaRenderer from '@/components/MediaRenderer';
import LoadingSpinner from '@/components/LoadingSpinner';
import FileUpload from '@/components/FileUpload';
import { useNotification } from '@/lib/store';

type CharityVisit = Database['public']['Tables']['charity_visits']['Row'];

export default function CharityVisitsManagement() {
  const [items, setItems] = useState<CharityVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CharityVisit | null>(null);
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Completed'>('Upcoming');
  const { showNotification } = useNotification();

  const [form, setForm] = useState<Partial<CharityVisit>>({
    title: '',
    location: '',
    visit_date: new Date().toISOString().split('T')[0],
    status: 'Upcoming',
    objective: '',
    activities: '',
    estimated_budget_ugx: 0,
    actual_spent_ugx: 0,
    impact_summary: '',
    main_media_url: '',
    main_media_type: 'image',
    funders: [],
    gallery: []
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await (supabase.from('charity_visits') as any).select('*').order('visit_date', { ascending: false });
      if (error) throw error;
      setItems(data || []);
    } catch (error: any) {
      showNotification('Failed to load charity visits', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.location || !form.visit_date) {
      showNotification('Title, Location, and Date are required', 'error');
      return;
    }

    try {
      if (editingItem) {
        await adminDb('charity_visits').update(form).eq('id', editingItem.id);
        showNotification('Visit updated', 'success');
      } else {
        await adminDb('charity_visits').insert([form]);
        showNotification('Visit added', 'success');
      }
      
      setIsFormOpen(false);
      setEditingItem(null);
      fetchItems();
    } catch (error: any) {
      showNotification(error.message, 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this charity visit?')) return;
    try {
      await adminDb('charity_visits').delete().eq('id', id);
      showNotification('Visit deleted', 'success');
      fetchItems();
    } catch (error: any) {
      showNotification(error.message, 'error');
    }
  };

  const openEdit = (item: CharityVisit) => {
    setEditingItem(item);
    setForm(item);
    setIsFormOpen(true);
  };

  const openNew = () => {
    setEditingItem(null);
    setForm({
      title: '',
      location: '',
      visit_date: new Date().toISOString().split('T')[0],
      status: activeTab,
      objective: '',
      activities: '',
      estimated_budget_ugx: 0,
      actual_spent_ugx: 0,
      impact_summary: '',
      main_media_url: '',
      main_media_type: 'image',
      funders: [],
      gallery: []
    });
    setIsFormOpen(true);
  };

  const addFunder = () => {
    setForm({
      ...form,
      funders: [...(form.funders || []), { name: '', logo_url: '', type: 'Funder' }]
    });
  };

  const updateFunder = (index: number, field: string, value: string) => {
    const newFunders = [...(form.funders || [])];
    newFunders[index] = { ...newFunders[index], [field]: value };
    setForm({ ...form, funders: newFunders });
  };

  const removeFunder = (index: number) => {
    const newFunders = [...(form.funders || [])];
    newFunders.splice(index, 1);
    setForm({ ...form, funders: newFunders });
  };

  const addGalleryImage = (url: string) => {
    setForm({
      ...form,
      gallery: [...(form.gallery || []), url]
    });
  };

  const removeGalleryImage = (index: number) => {
    const newGallery = [...(form.gallery || [])];
    newGallery.splice(index, 1);
    setForm({ ...form, gallery: newGallery });
  };

  const filteredItems = items.filter(i => i.status === activeTab);

  return (
    <div className="p-6 max-w-6xl mx-auto pb-24">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Charity Visits</h1>
          <p className="text-gray-500 text-sm">Manage upcoming and completed charitable activities.</p>
        </div>
        {!isFormOpen && (
          <button
            onClick={openNew}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            <span>Add Visit</span>
          </button>
        )}
      </div>

      {!isFormOpen && (
        <div className="flex space-x-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab('Upcoming')}
            className={`pb-2 px-4 font-medium transition-colors border-b-2 ${activeTab === 'Upcoming' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('Completed')}
            className={`pb-2 px-4 font-medium transition-colors border-b-2 ${activeTab === 'Completed' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Completed
          </button>
        </div>
      )}

      {isFormOpen ? (
        <div className="bg-white p-6 rounded-xl border shadow-sm mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{editingItem ? 'Edit Visit' : 'New Visit'}</h2>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold border-2 ${form.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}
            >
              <option value="Upcoming">Status: Upcoming</option>
              <option value="Completed">Status: Completed</option>
            </select>
          </div>
          
          <div className="space-y-8">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={form.title || ''}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="e.g. Orphanage Visit"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={form.location || ''}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="e.g. Kampala Slums"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={form.visit_date || ''}
                  onChange={(e) => setForm({ ...form, visit_date: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Budget (UGX)</label>
                <input
                  type="number"
                  value={form.estimated_budget_ugx || 0}
                  onChange={(e) => setForm({ ...form, estimated_budget_ugx: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Objective</label>
                <textarea
                  value={form.objective || ''}
                  onChange={(e) => setForm({ ...form, objective: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  placeholder="What is the goal of this visit?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Activities</label>
                <textarea
                  value={form.activities || ''}
                  onChange={(e) => setForm({ ...form, activities: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  placeholder="e.g. Football matches, food distribution..."
                />
              </div>
            </div>

            {/* Media Upload */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-bold mb-4">Main Cover Media</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <FileUpload
                    bucket="content"
                    onUploadComplete={(url) => setForm({ ...form, main_media_url: url })}
                  />
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Media Type</label>
                    <select
                      value={form.main_media_type || 'image'}
                      onChange={(e) => setForm({ ...form, main_media_type: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                </div>
                <div>
                  {form.main_media_url ? (
                    <div className="w-full aspect-video rounded-lg overflow-hidden border bg-gray-50">
                      <MediaRenderer src={form.main_media_url} alt="Cover preview" />
                    </div>
                  ) : (
                    <div className="w-full aspect-video rounded-lg border-2 border-dashed flex items-center justify-center text-gray-400 bg-gray-50">
                      No cover media uploaded
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Funders & Sponsors (JSONB) */}
            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Key Funders & Sponsors</h3>
                <button type="button" onClick={addFunder} className="text-sm bg-gray-100 px-3 py-1.5 rounded-md hover:bg-gray-200">
                  + Add Funder
                </button>
              </div>
              <div className="space-y-4">
                {(form.funders || []).map((funder: any, idx: number) => (
                  <div key={idx} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-gray-50 relative">
                    <button type="button" onClick={() => removeFunder(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                      <X size={20} />
                    </button>
                    <div className="w-full md:w-1/3">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Logo</label>
                      {funder.logo_url ? (
                        <div className="relative">
                          <img src={funder.logo_url} className="h-16 w-auto object-contain bg-white border p-1 rounded" alt="logo" />
                          <button type="button" onClick={() => updateFunder(idx, 'logo_url', '')} className="text-xs text-red-500 mt-1">Remove Logo</button>
                        </div>
                      ) : (
                        <FileUpload
                          bucket="content"
                          onUploadComplete={(url) => updateFunder(idx, 'logo_url', url)}
                        />
                      )}
                    </div>
                    <div className="w-full md:w-1/3">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Name / Organization</label>
                      <input
                        type="text"
                        value={funder.name}
                        onChange={(e) => updateFunder(idx, 'name', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="e.g. MTN Uganda"
                      />
                    </div>
                    <div className="w-full md:w-1/3">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
                      <select
                        value={funder.type}
                        onChange={(e) => updateFunder(idx, 'type', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="Funder">Funder</option>
                        <option value="Sponsor">Sponsor</option>
                        <option value="Partner">Partner</option>
                      </select>
                    </div>
                  </div>
                ))}
                {(form.funders || []).length === 0 && <p className="text-gray-500 text-sm">No funders added yet.</p>}
              </div>
            </div>

            {/* Completed specific fields */}
            {form.status === 'Completed' && (
              <div className="border-t pt-6 bg-green-50/50 p-6 -mx-6 rounded-b-xl border-green-100 border-x border-b">
                <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
                  <CheckCircle size={20} />
                  Completion Report
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Actual Spent (UGX)</label>
                    <input
                      type="number"
                      value={form.actual_spent_ugx || 0}
                      onChange={(e) => setForm({ ...form, actual_spent_ugx: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border rounded-md bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Impact Summary</label>
                    <textarea
                      value={form.impact_summary || ''}
                      onChange={(e) => setForm({ ...form, impact_summary: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md bg-white"
                      rows={3}
                      placeholder="What was the outcome? E.g., Helped 50 families..."
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Media Gallery (After Event)</h4>
                  <div className="flex flex-wrap gap-4 mb-4">
                    {(form.gallery || []).map((url: string, idx: number) => (
                      <div key={idx} className="relative w-32 h-32 border rounded-lg overflow-hidden bg-black">
                        <MediaRenderer src={url} alt="Gallery item" />
                        <button type="button" onClick={() => removeGalleryImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    <div className="w-32 h-32">
                      <FileUpload
                        bucket="content"
                        onUploadComplete={addGalleryImage}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-6 border-t">
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
                <span>Save Visit</span>
              </button>
            </div>
          </div>
        </div>
      ) : loading ? (
        <div className="flex justify-center p-12"><LoadingSpinner /></div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col group">
              <div className="aspect-video bg-gray-100 relative">
                {item.main_media_url ? (
                  <MediaRenderer src={item.main_media_url} alt="Cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ImageIcon size={40} className="opacity-30" />
                  </div>
                )}
                <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${item.status === 'Completed' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}>
                  {item.status}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-lg mb-2 line-clamp-1">{item.title}</h3>
                
                <div className="flex items-center text-gray-500 text-sm mb-1">
                  <MapPin size={14} className="mr-1.5" />
                  <span className="truncate">{item.location}</span>
                </div>
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <Calendar size={14} className="mr-1.5" />
                  <span>{new Date(item.visit_date).toLocaleDateString()}</span>
                </div>

                <div className="mt-auto pt-4 border-t flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-500">
                    {(item.funders as any[])?.length || 0} Funders
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEdit(item)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredItems.length === 0 && (
            <div className="col-span-full text-center py-16 bg-white border border-dashed rounded-xl">
              <p className="text-gray-500">No {activeTab.toLowerCase()} visits found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
