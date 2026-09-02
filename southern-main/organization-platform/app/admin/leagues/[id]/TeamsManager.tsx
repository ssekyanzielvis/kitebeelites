'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { adminDb } from '@/lib/supabase/adminDb';
import { Plus, Edit, Trash2, Shield } from 'lucide-react';
import { useNotification } from '@/lib/store';
import FileUpload from '@/components/FileUpload';
import { Database } from '@/lib/supabase/types';

type Team = Database['public']['Tables']['teams']['Row'];

export default function TeamsManager({ leagueId }: { leagueId: string }) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const { showNotification } = useNotification();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    manager: '',
    logo_url: '',
  });

  useEffect(() => {
    fetchTeams();
  }, [leagueId]);

  const fetchTeams = async () => {
    try {
      const { data, error } = await (supabase
        .from('teams') as any)
        .select('*')
        .eq('league_id', leagueId)
        .order('name');

      if (error) throw error;
      setTeams(data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
      showNotification('Failed to load teams', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingTeam) {
        const { error } = await adminDb('teams').update({
          ...formData,
          updated_at: new Date().toISOString(),
        }).eq('id', editingTeam.id);

        if (error) throw error;
        showNotification('Team updated successfully', 'success');
      } else {
        const { error } = await adminDb('teams').insert({
          ...formData,
          league_id: leagueId,
        });

        if (error) throw error;
        showNotification('Team added successfully', 'success');
      }

      resetForm();
      fetchTeams();
    } catch (error: any) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team? All their fixtures will be affected.')) return;
    try {
      const { error } = await adminDb('teams').delete().eq('id', id);
      if (error) throw error;
      showNotification('Team deleted successfully', 'success');
      fetchTeams();
    } catch (error: any) {
      showNotification(error.message, 'error');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', location: '', manager: '', logo_url: '' });
    setEditingTeam(null);
    setIsModalOpen(false);
  };

  const openEditModal = (team: Team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      description: team.description || '',
      location: team.location || '',
      manager: team.manager || '',
      logo_url: team.logo_url || '',
    });
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Participating Teams</h2>
          <p className="text-gray-500 text-sm">Manage the teams competing in this league.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> Add Team
        </button>
      </div>

      {loading && teams.length === 0 ? (
        <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
      ) : teams.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg bg-gray-50">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No teams added yet.</p>
          <button onClick={() => setIsModalOpen(true)} className="text-blue-600 hover:underline mt-2 text-sm">Add the first team</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <div key={team.id} className="border rounded-lg p-4 flex items-center gap-4 bg-gray-50/50 hover:bg-gray-50 transition-colors">
              <div className="w-16 h-16 rounded-full bg-white border flex-shrink-0 flex items-center justify-center overflow-hidden shadow-sm">
                {team.logo_url ? (
                  <img src={team.logo_url} alt={team.name} className="w-full h-full object-contain p-1" />
                ) : (
                  <Shield className="w-8 h-8 text-gray-300" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 truncate">{team.name}</h3>
                {team.manager && <p className="text-xs text-gray-500 truncate">Manager: {team.manager}</p>}
                {team.location && <p className="text-xs text-gray-500 truncate">{team.location}</p>}
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={() => openEditModal(team)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(team.id)} className="p-1.5 text-red-600 hover:bg-red-100 rounded-md transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h3 className="text-lg font-bold">{editingTeam ? 'Edit Team' : 'Add New Team'}</h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Team Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Red Stars FC"
                />
              </div>

              <div>
                <FileUpload
                  bucket="leagues"
                  accept="image"
                  label="Team Logo (Optional)"
                  onUploadComplete={(url) => setFormData({...formData, logo_url: url})}
                />
                {formData.logo_url && (
                  <div className="mt-2 w-16 h-16 border rounded-full overflow-hidden bg-gray-50 flex items-center justify-center">
                    <img src={formData.logo_url} alt="Logo" className="w-full h-full object-contain p-1" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Manager/Coach</label>
                  <input
                    type="text"
                    value={formData.manager}
                    onChange={e => setFormData({...formData, manager: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description / Bio</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm h-20"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t mt-6">
                <button type="button" onClick={resetForm} className="px-4 py-2 border rounded hover:bg-gray-50 text-sm font-medium">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save Team'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
