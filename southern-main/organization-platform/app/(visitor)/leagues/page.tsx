'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trophy, Calendar, MapPin, Users, Activity } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import LoadingSpinner from '@/components/LoadingSpinner';
import MediaRenderer from '@/components/MediaRenderer';
import { Database } from '@/lib/supabase/types';

type League = Database['public']['Tables']['leagues']['Row'];

export default function LeaguesPage() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSport, setFilterSport] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    fetchLeagues();
  }, []);

  const fetchLeagues = async () => {
    try {
      const { data, error } = await (supabase
        .from('leagues') as any)
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeagues(data || []);
    } catch (error: any) {
      console.error('Error fetching leagues:', error.message || JSON.stringify(error) || error);
    } finally {
      setLoading(false);
    }
  };

  const sports = ['All', ...Array.from(new Set(leagues.map(l => l.sport).filter(Boolean)))];
  const statuses = ['All', ...Array.from(new Set(leagues.map(l => l.status).filter(Boolean)))];

  const filteredLeagues = leagues.filter(league => {
    if (filterSport !== 'All' && league.sport !== filterSport) return false;
    if (filterStatus !== 'All' && league.status !== filterStatus) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sports Leagues</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our competitive leagues, upcoming tournaments, and active seasons across all sports.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
          <select
            value={filterSport}
            onChange={(e) => setFilterSport(e.target.value)}
            className="p-3 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-48"
          >
            {sports.map(sport => (
              <option key={sport as string} value={sport as string}>{sport === 'All' ? 'All Sports' : sport}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-3 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-48"
          >
            {statuses.map(status => (
              <option key={status as string} value={status as string}>{status === 'All' ? 'All Statuses' : status}</option>
            ))}
          </select>
        </div>

        {/* League Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredLeagues.map((league) => (
            <Link
              href={`/leagues/${league.id}`}
              key={league.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group transform hover:-translate-y-1"
            >
              {/* Media Section */}
              <div className="relative h-56 w-full bg-gray-200 overflow-hidden">
                {league.cover_url ? (
                  <MediaRenderer src={league.cover_url} alt={league.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" isThumbnail />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Trophy className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                
                {/* Logo overlay if exists */}
                {league.logo_url && (
                  <div className="absolute top-4 right-4 w-16 h-16 bg-white rounded-full p-1 shadow-lg">
                    <img src={league.logo_url} alt="Logo" className="w-full h-full object-contain rounded-full" />
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm backdrop-blur-md ${
                    league.status === 'Active' ? 'bg-green-500/90 text-white' :
                    league.status === 'Registration Open' ? 'bg-blue-500/90 text-white' :
                    league.status === 'Completed' ? 'bg-gray-800/90 text-white' :
                    'bg-white/90 text-gray-800'
                  }`}>
                    {league.status}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex gap-2 mb-3">
                  {league.sport && <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">{league.sport.toUpperCase()}</span>}
                  <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded">{league.gender}</span>
                  <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded">{league.age_category}</span>
                </div>

                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">{league.name}</h3>
                
                <div className="mt-auto space-y-2 pt-4">
                  {league.season && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      Season: {league.season}
                    </div>
                  )}
                  {league.competition_type && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Activity className="w-4 h-4 mr-2" />
                      Format: {league.competition_type}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredLeagues.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No leagues found</h3>
            <p className="text-gray-500">There are no active leagues matching your current filters.</p>
            <button 
              onClick={() => { setFilterSport('All'); setFilterStatus('All'); }}
              className="mt-4 text-blue-600 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
