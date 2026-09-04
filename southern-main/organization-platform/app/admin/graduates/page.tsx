'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { adminDb } from '@/lib/supabase/adminDb';
import { Database } from '@/lib/supabase/types';
import { Plus, Eye, EyeOff } from 'lucide-react';
import MediaRenderer from '@/components/MediaRenderer';
import MediaPreviewModal from '@/components/MediaPreviewModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import FileUpload from '@/components/FileUpload';
import { useNotification } from '@/lib/store';

type Graduate = Database['public']['Tables']['graduates']['Row'];

export default function GraduatesManagement() {
  const [graduates, setGraduates] = useState<Graduate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<string | null>(null);
  const [editingGraduate, setEditingGraduate] = useState<Graduate | null>(null);
  const { showNotification } = useNotification();

  const [formData, setFormData] = useState({
    full_name: '',
    profile_image_url: '',
    graduation_year: new Date().getFullYear(),
    course: '',
    is_active: true,
    is_featured: false,
  });

  useEffect(() => {
    fetchGraduates();
  }, []);

  const fetchGraduates = async () => {
    try {
      const { data, error } = await supabase
        .from('graduates')
        .select('*')
        .order('graduation_year', { ascending: false });

      if (error) throw error;
      setGraduates(data || []);
    } catch (error: any) {
      showNotification('Failed to load graduates', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingGraduate) {
        const { error } = await adminDb('graduates').update({
            ...formData,
            updated_at: new Date().toISOString(),
          }).eq('id', editingGraduate.id);

        if (error) throw error;
        showNotification('Graduate updated successfully', 'success');
      } else {
        const { error } = await adminDb('graduates').insert(formData);

        if (error) throw error;
        showNotification('Graduate added successfully', 'success');
      }

      resetForm();
      fetchGraduates();
    } catch (error: any) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this graduate?')) return;

    try {
      const { error } = await adminDb('graduates').delete().eq('id', id);

      if (error) throw error;
      showNotification('Graduate deleted successfully', 'success');
      fetchGraduates();
    } catch (error: any) {
      showNotification(error.message, 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      profile_image_url: '',
      graduation_year: new Date().getFullYear(),
      course: '',
      is_active: true,
      is_featured: false,
    });
    setEditingGraduate(null);
    setIsModalOpen(false);
  };

  const openEditModal = (graduate: Graduate) => {
    setEditingGraduate(graduate);
    setFormData({
      full_name: graduate.full_name,
      profile_image_url: graduate.profile_image_url || '',
      graduation_year: graduate.graduation_year,
      course: graduate.course,
      is_active: graduate.is_active,
      is_featured: graduate.is_featured,
    });
    setIsModalOpen(true);
  };

  if (loading && graduates.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kitebe Graduates Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Add Graduate
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {graduates.map((graduate) => (
          <div key={graduate.id} className="bg-white border rounded-lg overflow-hidden">
            {graduate.profile_image_url && (
              <MediaRenderer src={graduate.profile_image_url} alt={graduate.full_name} className="w-full h-64 object-cover" isThumbnail />
            )}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{graduate.full_name}</h3>
                  <p className="text-sm text-blue-600">Class of {graduate.graduation_year}</p>
                </div>
                <div className="flex gap-1">
                  {graduate.is_featured && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Featured
                    </span>
                  )}
                  {graduate.is_active ? (
                    <Eye className="w-4 h-4 text-green-600" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{graduate.course}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(graduate)}
                  className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(graduate.id)}
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
              {editingGraduate ? 'Edit Graduate' : 'Add Graduate'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name*</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Graduation Year*</label>
                  <input
                    type="number"
                    value={formData.graduation_year}
                    onChange={(e) => setFormData({ ...formData, graduation_year: parseInt(e.target.value) || new Date().getFullYear() })}
                    className="w-full border rounded-lg px-3 py-2"
                    min="1900"
                    max="2100"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Course / Program*</label>
                <input
                  type="text"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="e.g. Bachelor of Science in Information Technology"
                  required
                />
              </div>
              <FileUpload
                bucket="graduates"
                currentUrl={formData.profile_image_url}
                onUploadComplete={(url) => setFormData({ ...formData, profile_image_url: url })}
                accept="image"
                label="Profile Image"
                maxSizeMB={5}
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
                  <span className="text-sm font-medium">Featured (Show on Home Page)</span>
                </label>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingGraduate ? 'Update' : 'Create'}
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
