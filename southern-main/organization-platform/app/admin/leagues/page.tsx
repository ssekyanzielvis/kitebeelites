'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { adminDb } from '@/lib/supabase/adminDb';
import { Plus, Edit, Trash2, Trophy } from 'lucide-react';
import MediaRenderer from '@/components/MediaRenderer';
import LoadingSpinner from '@/components/LoadingSpinner';
import FileUpload from '@/components/FileUpload';
import { useNotification } from '@/lib/store';
import { Database } from '@/lib/supabase/types';

type League = Database['public']['Tables']['leagues']['Row'];

export default function LeaguesManagement() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLeague, setEditingLeague] = useState<League | null>(null);
  const { showNotification } = useNotification();

  const [formData, setFormData] = useState({
    name: '',
    short_name: '',
    slug: '',
    description: '',
    sport: '',
    competition_type: '',
    season: '',
    gender: '',
    age_category: '',
    location: '',
    venue: '',
    organizer: '',
    cover_url: '',
    logo_url: '',
    status: 'Upcoming',
    is_active: false,
    is_featured: false,
  });

  useEffect(() => {
    fetchLeagues();
  }, []);

  const fetchLeagues = async () => {
    try {
      const { data, error } = await (supabase
        .from('leagues') as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeagues(data || []);
    } catch (error: any) {
      showNotification('Failed to load leagues', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Auto-generate slug if empty, and add a timestamp to ensure uniqueness
      const currentSlug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();
      
      const defaultLogo = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'League')}&background=random&size=200`;
      const defaultCover = 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2000&auto=format&fit=crop';
      
      const dataToSave = { 
        ...formData, 
        slug: currentSlug,
        logo_url: formData.logo_url || defaultLogo,
        cover_url: formData.cover_url || defaultCover,
      };

      if (editingLeague) {
        const { error } = await adminDb('leagues').update({
            ...dataToSave,
            updated_at: new Date().toISOString(),
          }).eq('id', editingLeague.id);

        if (error) throw error;
        showNotification('League updated successfully', 'success');
      } else {
        const { error } = await adminDb('leagues').insert(dataToSave);

        if (error) throw error;
        showNotification('League created successfully', 'success');
      }

      resetForm();
      fetchLeagues();
    } catch (error: any) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this league?')) return;

    try {
      const { error } = await adminDb('leagues').delete().eq('id', id);

      if (error) throw error;
      showNotification('League deleted successfully', 'success');
      fetchLeagues();
    } catch (error: any) {
      showNotification(error.message, 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      short_name: '',
      slug: '',
      description: '',
      sport: '',
      competition_type: '',
      season: '',
      gender: '',
      age_category: '',
      location: '',
      venue: '',
      organizer: '',
      cover_url: '',
      logo_url: '',
      status: 'Upcoming',
      is_active: false,
      is_featured: false,
    });
    setEditingLeague(null);
    setIsModalOpen(false);
  };

  const openEditModal = (league: League) => {
    setEditingLeague(league);
    setFormData({
      name: league.name || '',
      short_name: league.short_name || '',
      slug: league.slug || '',
      description: league.description || '',
      sport: league.sport || '',
      competition_type: league.competition_type || '',
      season: league.season || '',
      gender: league.gender || '',
      age_category: league.age_category || '',
      location: league.location || '',
      venue: league.venue || '',
      organizer: league.organizer || '',
      cover_url: league.cover_url || '',
      logo_url: league.logo_url || '',
      status: league.status || 'Upcoming',
      is_active: league.is_active,
      is_featured: league.is_featured,
    });
    setIsModalOpen(true);
  };

  if (loading && leagues.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Leagues Management</h1>
          <p className="text-gray-600">Create and manage your sports leagues.</p>
        </div>
        <button
          onClick={() => {
            setFormData({
              name: '',
              short_name: '',
              slug: '',
              description: '',
              sport: '',
              competition_type: '',
              season: '',
              gender: '',
              age_category: '',
              location: '',
              venue: '',
              organizer: '',
              cover_url: '',
              logo_url: '',
              status: 'Upcoming',
              is_active: false,
              is_featured: false,
            });
            setEditingLeague(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Add New League
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {leagues.map((league) => (
          <div key={league.id} className="bg-white border rounded-lg overflow-hidden flex flex-col">
            {league.cover_url ? (
              <MediaRenderer src={league.cover_url} alt={league.name} className="w-full h-48 object-cover" isThumbnail />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                <Trophy className="w-12 h-12 text-gray-400" />
              </div>
            )}
            
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg line-clamp-2">{league.name}</h3>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-3">
                  <span className={`text-xs px-2 py-1 rounded ${league.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {league.status}
                  </span>
                  {league.sport && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {league.sport}
                    </span>
                  )}
                  {league.is_featured && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Featured
                    </span>
                  )}
                  {!league.is_active && (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                      Draft / Hidden
                    </span>
                  )}
              </div>

              <div className="text-sm text-gray-600 mb-4 flex-1">
                <p>{league.gender} • {league.age_category}</p>
                <p>{league.season}</p>
              </div>

              <div className="flex justify-end gap-2 mt-auto border-t pt-4">
                <Link
                  href={`/admin/leagues/${league.id}`}
                  className="px-3 py-2 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded font-medium mr-auto"
                >
                  Manage
                </Link>
                <button
                  onClick={() => openEditModal(league)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  title="Edit League Info"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(league.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                  title="Delete League"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {leagues.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-lg border">
            <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-lg font-medium">No leagues found</p>
            <p className="text-sm">Click "Add New League" to create your first competition.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8">
            <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {editingLeague ? 'Edit League' : 'Create New League'}
              </h2>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700 font-bold text-xl">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Left Column: Basic Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Basic Information</h3>
                  <div>
                    <label className="block text-sm font-medium mb-1">League Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                      placeholder="e.g. Summer Community Football 2026"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Short Name</label>
                      <input
                        type="text"
                        value={formData.short_name}
                        onChange={(e) => setFormData({ ...formData, short_name: e.target.value })}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="e.g. SCF '26"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Season</label>
                      <input
                        type="text"
                        value={formData.season}
                        onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="e.g. 2026"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none h-24"
                    />
                  </div>
                </div>

                {/* Right Column: Classification */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Classification</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Sport</label>
                      <input
                        type="text"
                        value={formData.sport}
                        onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="e.g. Football, Volleyball"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Format</label>
                      <input
                        type="text"
                        value={formData.competition_type}
                        onChange={(e) => setFormData({ ...formData, competition_type: e.target.value })}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="e.g. Round Robin, Knockout"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Gender</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option value="">Select Gender...</option>
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Mixed">Mixed</option>
                        <option value="Boys">Boys</option>
                        <option value="Girls">Girls</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Age Category</label>
                      <select
                        value={formData.age_category}
                        onChange={(e) => setFormData({ ...formData, age_category: e.target.value })}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option value="">Select Age...</option>
                        <option value="Children">Children</option>
                        <option value="U13">U13</option>
                        <option value="U15">U15</option>
                        <option value="U17">U17</option>
                        <option value="U19">U19</option>
                        <option value="Adults">Adults</option>
                        <option value="Veterans">Veterans</option>
                        <option value="Open">Open</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Upcoming">Upcoming</option>
                      <option value="Registration Open">Registration Open</option>
                      <option value="Active">Active</option>
                      <option value="Suspended">Suspended</option>
                      <option value="Completed">Completed</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Media Section */}
              <div className="space-y-4 mb-8">
                <h3 className="font-semibold text-lg border-b pb-2">Media</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FileUpload
                      bucket="leagues"
                      accept="both"
                      onUploadComplete={(url) => setFormData({ ...formData, cover_url: url })}
                      label="Cover Image/Video (Hero Header)"
                    />
                    {formData.cover_url && (
                      <div className="mt-2 relative h-32 rounded overflow-hidden">
                        <MediaRenderer src={formData.cover_url} alt="Cover Preview" className="w-full h-full object-cover" isThumbnail />
                      </div>
                    )}
                  </div>
                  <div>
                    <FileUpload
                      bucket="leagues"
                      accept="image"
                      onUploadComplete={(url) => setFormData({ ...formData, logo_url: url })}
                      label="League Logo"
                    />
                    {formData.logo_url && (
                      <div className="mt-2 relative h-32 w-32 rounded overflow-hidden bg-gray-100 p-2">
                        <img src={formData.logo_url} alt="Logo Preview" className="w-full h-full object-contain" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex gap-6 pt-4 border-t">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <div>
                    <p className="font-medium">Publish League</p>
                    <p className="text-sm text-gray-500">Make this league visible to the public</p>
                  </div>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <div>
                    <p className="font-medium">Featured</p>
                    <p className="text-sm text-gray-500">Show on the homepage</p>
                  </div>
                </label>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : editingLeague ? 'Update League' : 'Create League'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
