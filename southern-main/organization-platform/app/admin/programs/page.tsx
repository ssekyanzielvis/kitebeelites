'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { adminDb } from '@/lib/supabase/adminDb';
import { Plus, Edit, Trash2, Eye, EyeOff, Download, PlusCircle, MinusCircle } from 'lucide-react';
import { downloadBudgetPDF } from '@/lib/utils/pdfGenerator';
import MediaRenderer from '@/components/MediaRenderer';
import MediaPreviewModal from '@/components/MediaPreviewModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import FileUpload from '@/components/FileUpload';
import { useNotification } from '@/lib/store';
import { Database } from '@/lib/supabase/types';

type Program = Database['public']['Tables']['programs']['Row'];

export default function ProgramsManagement() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<string | null>(null);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const { showNotification } = useNotification();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    start_date: '',
    end_date: '',
    budget_items: [] as { item: string; cost: number }[],
    is_active: true,
    is_featured: false,
  });

  const addBudgetItem = () => {
    setFormData({
      ...formData,
      budget_items: [...formData.budget_items, { item: '', cost: 0 }]
    });
  };

  const updateBudgetItem = (index: number, field: 'item' | 'cost', value: string | number) => {
    const newItems = [...formData.budget_items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, budget_items: newItems });
  };

  const removeBudgetItem = (index: number) => {
    const newItems = formData.budget_items.filter((_, i) => i !== index);
    setFormData({ ...formData, budget_items: newItems });
  };

  const totalBudget = formData.budget_items.reduce((acc, curr) => acc + (Number(curr.cost) || 0), 0);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const { data, error } = await (supabase
        .from('programs') as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrograms(data || []);
    } catch (error: any) {
      showNotification('Failed to load programs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Clean dates if empty string
      const dataToSave = {
        ...formData,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
      };

      if (editingProgram) {
        const { error } = await adminDb('programs').update({
            ...dataToSave,
            updated_at: new Date().toISOString(),
          }).eq('id', editingProgram.id);

        if (error) throw error;
        showNotification('Program updated successfully', 'success');
      } else {
        const { error } = await adminDb('programs').insert(dataToSave);

        if (error) throw error;
        showNotification('Program created successfully', 'success');
      }

      resetForm();
      fetchPrograms();
    } catch (error: any) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this program?')) return;

    try {
      const { error } = await adminDb('programs').delete().eq('id', id);

      if (error) throw error;
      showNotification('Program deleted successfully', 'success');
      fetchPrograms();
    } catch (error: any) {
      showNotification(error.message, 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      start_date: '',
      end_date: '',
      budget_items: [],
      is_active: true,
      is_featured: false,
    });
    setEditingProgram(null);
    setIsModalOpen(false);
  };

  const openEditModal = (program: Program) => {
    setEditingProgram(program);
    setFormData({
      title: program.title,
      description: program.description || '',
      image_url: program.image_url || '',
      start_date: program.start_date || '',
      end_date: program.end_date || '',
      budget_items: program.budget_items || [],
      is_active: program.is_active,
      is_featured: program.is_featured,
    });
    setIsModalOpen(true);
  };

  if (loading && programs.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Programs Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Add New Program
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {programs.map((program) => (
          <div key={program.id} className="bg-white border rounded-lg overflow-hidden">
            {program.image_url && (
              <MediaRenderer src={program.image_url} alt={program.title} className="w-full h-48 object-cover" isThumbnail />
            )}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg">{program.title}</h3>
                <div className="flex gap-1">
                  {program.is_featured && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Featured
                    </span>
                  )}
                  {program.is_active ? (
                    <Eye className="w-4 h-4 text-green-600" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{program.description}</p>
              {program.budget_items && program.budget_items.length > 0 && (
                <button
                  onClick={() => downloadBudgetPDF(program.title, program.budget_items)}
                  className="w-full mb-4 flex items-center justify-center gap-2 bg-green-50 text-green-700 py-2 rounded-lg hover:bg-green-100 text-sm font-medium transition-colors"
                >
                  <Download className="w-4 h-4" /> Download Budget PDF
                </button>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(program)}
                  className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(program.id)}
                  className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {previewMedia && (
        <MediaPreviewModal 
          url={previewMedia} 
          onClose={() => setPreviewMedia(null)} 
        />
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingProgram ? 'Edit Program' : 'Add New Program'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title*</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              {/* Budget Builder */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-700">Estimated Budget (UGX)</h3>
                  <button
                    type="button"
                    onClick={addBudgetItem}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <PlusCircle className="w-4 h-4" /> Add Item
                  </button>
                </div>
                
                <div className="space-y-3">
                  {formData.budget_items.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Item Description"
                          value={item.item}
                          onChange={(e) => updateBudgetItem(idx, 'item', e.target.value)}
                          className="w-full border rounded px-2 py-1 text-sm"
                        />
                      </div>
                      <div className="w-1/3">
                        <input
                          type="number"
                          placeholder="Cost"
                          value={item.cost || ''}
                          onChange={(e) => updateBudgetItem(idx, 'cost', Number(e.target.value))}
                          className="w-full border rounded px-2 py-1 text-sm"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeBudgetItem(idx)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <MinusCircle className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  {formData.budget_items.length === 0 && (
                    <p className="text-sm text-gray-500 italic text-center py-2">No budget items added. Click "Add Item" to draft a budget.</p>
                  )}
                  {formData.budget_items.length > 0 && (
                    <div className="flex justify-between items-center pt-3 border-t mt-3">
                      <span className="font-semibold text-gray-700">Total:</span>
                      <span className="font-bold text-blue-700">UGX {totalBudget.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
              <FileUpload
                bucket="programs"
                currentUrl={formData.image_url}
                onUploadComplete={(url) => setFormData({ ...formData, image_url: url })}
                accept="both"
                label="Program Media (Image or Video)"
                maxSizeMB={10}
              />
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">Active</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">Featured</span>
                </label>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingProgram ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

