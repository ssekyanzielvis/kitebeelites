'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import MediaRenderer from '@/components/MediaRenderer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Database } from '@/lib/supabase/types';
import { Users, Info, X } from 'lucide-react';
import { useHydratedTheme } from '@/lib/store';

type Player = Database['public']['Tables']['players']['Row'];
type League = Database['public']['Tables']['leagues']['Row'];

export default function KnowYourPlayerPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeagueId, setSelectedLeagueId] = useState<string>('all');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const { theme } = useHydratedTheme();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [playersRes, leaguesRes] = await Promise.all([
        (supabase.from('players') as any).select('*').order('name'),
        (supabase.from('leagues') as any).select('*').eq('is_active', true)
      ]);

      if (playersRes.error) throw playersRes.error;
      if (leaguesRes.error) throw leaguesRes.error;

      setPlayers(playersRes.data || []);
      setLeagues(leaguesRes.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlayers = selectedLeagueId === 'all' 
    ? players 
    : players.filter(p => p.league_id === selectedLeagueId);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header Section */}
      <section 
        className="py-16 px-4 text-white text-center"
        style={{ backgroundColor: theme.primaryColor }}
      >
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Know Your Player</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Get up close and personal with the athletes participating in our various leagues.
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 px-4 bg-gray-50 border-b">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <h3 className="font-semibold text-gray-700">Filter by League:</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setSelectedLeagueId('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedLeagueId === 'all'
                    ? 'text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-300'
                }`}
                style={selectedLeagueId === 'all' ? { backgroundColor: '#8fbc8f' } : {}}
              >
                All Leagues
              </button>
              {leagues.map(league => (
                <button
                  key={league.id}
                  onClick={() => setSelectedLeagueId(league.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedLeagueId === league.id
                      ? 'text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-300'
                  }`}
                  style={selectedLeagueId === league.id ? { backgroundColor: '#8fbc8f' } : {}}
                >
                  {league.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Players Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredPlayers.map(player => (
              <div 
                key={player.id} 
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow overflow-hidden cursor-pointer flex flex-col group"
                onClick={() => setSelectedPlayer(player)}
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
                  {player.profile_image_url ? (
                    <MediaRenderer 
                      src={player.profile_image_url} 
                      alt={player.name} 
                      fill 
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Users className="w-20 h-20 text-gray-300" />
                    </div>
                  )}
                  {player.shirt_number && (
                    <div 
                      className="absolute top-4 right-4 text-white w-10 h-10 flex items-center justify-center rounded-full font-bold shadow-md text-lg"
                      style={{ backgroundColor: theme.primaryColor }}
                    >
                      {player.shirt_number}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                    <span className="text-white bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium">
                      <Info size={16} /> View Profile
                    </span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col items-center text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{player.name}</h3>
                  <p className="text-gray-500 text-sm font-medium">
                    {leagues.find(l => l.id === player.league_id)?.name || 'Unassigned'}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {filteredPlayers.length === 0 && (
            <div className="text-center py-20">
              <Users className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-600 mb-2">No Players Found</h3>
              <p className="text-gray-500">There are no players added to this league yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Player Modal */}
      {selectedPlayer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl relative flex flex-col md:flex-row overflow-hidden my-auto max-h-[90vh]">
            <button
              onClick={() => setSelectedPlayer(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="w-full md:w-2/5 relative h-64 md:h-auto bg-gray-100">
              {selectedPlayer.profile_image_url ? (
                <MediaRenderer 
                  src={selectedPlayer.profile_image_url} 
                  alt={selectedPlayer.name} 
                  fill 
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Users className="w-32 h-32 text-gray-300" />
                </div>
              )}
            </div>
            
            <div className="w-full md:w-3/5 p-6 md:p-10 overflow-y-auto">
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-2">
                  <h2 className="text-3xl font-bold text-gray-900">{selectedPlayer.name}</h2>
                  {selectedPlayer.shirt_number && (
                    <span 
                      className="text-white w-10 h-10 flex items-center justify-center rounded-full font-bold shadow-sm"
                      style={{ backgroundColor: theme.primaryColor }}
                    >
                      {selectedPlayer.shirt_number}
                    </span>
                  )}
                </div>
                <p className="text-lg text-gray-500 font-medium">
                  {leagues.find(l => l.id === selectedPlayer.league_id)?.name || 'Unassigned'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ProfileItem label="Nationality / Origin" value={selectedPlayer.origin} />
                <ProfileItem label="Date of Birth" value={selectedPlayer.date_of_birth} />
                <ProfileItem label="Height" value={selectedPlayer.height} />
                <ProfileItem label="Weight" value={selectedPlayer.weight} />
                <ProfileItem label="Speed" value={selectedPlayer.speed ? (selectedPlayer.speed.toLowerCase().includes('m/s') ? selectedPlayer.speed : `${selectedPlayer.speed} m/s`) : null} />
                <ProfileItem label="Marital Status" value={selectedPlayer.marital_status} />
                <ProfileItem label="Networth" value={selectedPlayer.networth ? (selectedPlayer.networth.toUpperCase().includes('UGX') ? selectedPlayer.networth : `${selectedPlayer.networth} UGX`) : null} />
                <ProfileItem label="Academics" value={selectedPlayer.academics} />
                
                <div className="col-span-1 sm:col-span-2 mt-4 pt-4 border-t">
                  <h4 className="text-lg font-semibold mb-4 text-gray-900">Favorites & Support</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <ProfileItem label="Int. Team Supported" value={selectedPlayer.international_team} />
                    <ProfileItem label="Best Int. Player" value={selectedPlayer.best_international_player} />
                    <ProfileItem label="Favourite Dish" value={selectedPlayer.favourite_dish} />
                    <ProfileItem label="Smartest Player Chosen" value={selectedPlayer.smartest_player_chosen} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileItem({ label, value }: { label: string, value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</h4>
      <p className="text-gray-900 font-medium">{value}</p>
    </div>
  );
}
