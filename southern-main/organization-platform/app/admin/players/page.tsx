'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { adminDb } from '@/lib/supabase/adminDb';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import MediaRenderer from '@/components/MediaRenderer';
import LoadingSpinner from '@/components/LoadingSpinner';
import FileUpload from '@/components/FileUpload';
import { useNotification } from '@/lib/store';
import { Database } from '@/lib/supabase/types';

type Player = Database['public']['Tables']['players']['Row'];
type League = Database['public']['Tables']['leagues']['Row'];

export default function PlayersManagement() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const { showNotification } = useNotification();

  const [formData, setFormData] = useState({
    league_id: '',
    name: '',
    date_of_birth: '',
    height: '',
    weight: '',
    speed: '',
    marital_status: '',
    networth: '',
    shirt_number: '',
    international_team: '',
    best_international_player: '',
    favourite_dish: '',
    smartest_player_chosen: '',
    profile_image_url: '',
    origin: '',
    academics: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [playersRes, leaguesRes] = await Promise.all([
        (supabase.from('players') as any).select('*').order('created_at', { ascending: false }),
        (supabase.from('leagues') as any).select('*').eq('is_active', true)
      ]);

      if (playersRes.error) throw playersRes.error;
      if (leaguesRes.error) throw leaguesRes.error;

      setPlayers(playersRes.data || []);
      setLeagues(leaguesRes.data || []);
    } catch (error: any) {
      showNotification('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSave = { 
        ...formData,
        league_id: formData.league_id || null, // null if empty string
        date_of_birth: formData.date_of_birth || null
      };

      if (editingPlayer) {
        const { error } = await adminDb('players').update(dataToSave).eq('id', editingPlayer.id);
        if (error) throw error;
        showNotification('Player updated successfully', 'success');
      } else {
        const { error } = await adminDb('players').insert(dataToSave);
        if (error) throw error;
        showNotification('Player created successfully', 'success');
      }

      resetForm();
      fetchData();
    } catch (error: any) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this player?')) return;

    try {
      const { error } = await adminDb('players').delete().eq('id', id);

      if (error) throw error;
      showNotification('Player deleted successfully', 'success');
      fetchData();
    } catch (error: any) {
      showNotification(error.message, 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      league_id: '',
      name: '',
      date_of_birth: '',
      height: '',
      weight: '',
      speed: '',
      marital_status: '',
      networth: '',
      shirt_number: '',
      international_team: '',
      best_international_player: '',
      favourite_dish: '',
      smartest_player_chosen: '',
      profile_image_url: '',
      origin: '',
      academics: '',
    });
    setEditingPlayer(null);
    setIsModalOpen(false);
  };

  const openEditModal = (player: Player) => {
    setEditingPlayer(player);
    setFormData({
      league_id: player.league_id || '',
      name: player.name || '',
      date_of_birth: player.date_of_birth || '',
      height: player.height || '',
      weight: player.weight || '',
      speed: player.speed || '',
      marital_status: player.marital_status || '',
      networth: player.networth || '',
      shirt_number: player.shirt_number || '',
      international_team: player.international_team || '',
      best_international_player: player.best_international_player || '',
      favourite_dish: player.favourite_dish || '',
      smartest_player_chosen: player.smartest_player_chosen || '',
      profile_image_url: player.profile_image_url || '',
      origin: player.origin || '',
      academics: player.academics || '',
    });
    setIsModalOpen(true);
  };

  if (loading && players.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Players Management</h1>
          <p className="text-gray-600">Create and manage your league players.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Add New Player
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">League</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shirt No.</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {players.map((player) => {
              const league = leagues.find(l => l.id === player.league_id);
              return (
                <tr key={player.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {player.profile_image_url ? (
                          <MediaRenderer src={player.profile_image_url} alt={player.name} className="h-10 w-10 rounded-full object-cover" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <Users className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{player.name}</div>
                        <div className="text-sm text-gray-500">{player.origin || 'Unknown Origin'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {league?.name || 'Unassigned'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {player.shirt_number || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openEditModal(player)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Edit className="w-5 h-5 inline" />
                    </button>
                    <button
                      onClick={() => handleDelete(player.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5 inline" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {players.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-lg font-medium">No players found</p>
            <p className="text-sm">Click "Add New Player" to add one.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-full flex flex-col">
            <div className="flex justify-between items-center p-6 border-b shrink-0">
              <h2 className="text-xl font-semibold">
                {editingPlayer ? 'Edit Player' : 'Add New Player'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col min-h-0 overflow-hidden">
              <div className="p-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold border-b pb-2">Basic Info</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      League
                    </label>
                    <select
                      value={formData.league_id}
                      onChange={(e) => setFormData({ ...formData, league_id: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Unassigned</option>
                      {leagues.map(l => (
                        <option key={l.id} value={l.id}>{l.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Shirt Number
                      </label>
                      <input
                        type="text"
                        value={formData.shirt_number}
                        onChange={(e) => setFormData({ ...formData, shirt_number: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={formData.date_of_birth}
                        onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Height
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 180 cm"
                        value={formData.height}
                        onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Weight
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 75 kg"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Origin / Nationality
                    </label>
                    <input
                      type="text"
                      value={formData.origin}
                      onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Additional Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold border-b pb-2">Additional Details</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Speed (m/s)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 10 m/s"
                        value={formData.speed}
                        onChange={(e) => setFormData({ ...formData, speed: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Marital Status
                      </label>
                      <input
                        type="text"
                        value={formData.marital_status}
                        onChange={(e) => setFormData({ ...formData, marital_status: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Networth (UGX)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 5,000,000 UGX"
                        value={formData.networth}
                        onChange={(e) => setFormData({ ...formData, networth: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Academics
                      </label>
                      <input
                        type="text"
                        value={formData.academics}
                        onChange={(e) => setFormData({ ...formData, academics: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      International Team Supported
                    </label>
                    <input
                      type="text"
                      value={formData.international_team}
                      onChange={(e) => setFormData({ ...formData, international_team: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Best Int. Player Supported
                    </label>
                    <input
                      type="text"
                      value={formData.best_international_player}
                      onChange={(e) => setFormData({ ...formData, best_international_player: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Favourite Dish
                      </label>
                      <input
                        type="text"
                        value={formData.favourite_dish}
                        onChange={(e) => setFormData({ ...formData, favourite_dish: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Smartest Player Chosen
                      </label>
                      <input
                        type="text"
                        value={formData.smartest_player_chosen}
                        onChange={(e) => setFormData({ ...formData, smartest_player_chosen: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Image
                  </label>
                  <FileUpload
                    bucket="players"
                    onUploadComplete={(url: string) => setFormData({ ...formData, profile_image_url: url })}
                    currentUrl={formData.profile_image_url}
                  />
                </div>
              </div>
              </div>

              <div className="p-6 flex justify-end gap-4 border-t shrink-0 bg-gray-50 rounded-b-xl">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (editingPlayer ? 'Update Player' : 'Create Player')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
