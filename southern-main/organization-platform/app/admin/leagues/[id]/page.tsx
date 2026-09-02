'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { ArrowLeft, Users, Calendar, Trophy, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Database } from '@/lib/supabase/types';

import TeamsManager from './TeamsManager';
import FixturesManager from './FixturesManager';
import StandingsManager from './StandingsManager';

type League = Database['public']['Tables']['leagues']['Row'];

export default function LeagueDashboard() {
  const params = useParams();
  const router = useRouter();
  const [league, setLeague] = useState<League | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'teams' | 'fixtures' | 'standings' | 'media' | 'settings'>('teams');

  useEffect(() => {
    if (params?.id) {
      fetchLeague(params.id as string);
    }
  }, [params?.id]);

  const fetchLeague = async (id: string) => {
    try {
      const { data, error } = await (supabase
        .from('leagues') as any)
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      setLeague(data);
    } catch (error) {
      console.error('Error fetching league:', error);
      router.push('/admin/leagues');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!league) return null;

  const tabs = [
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'fixtures', label: 'Fixtures & Results', icon: Calendar },
    { id: 'standings', label: 'Standings', icon: Trophy },
    { id: 'media', label: 'League Media', icon: ImageIcon },
    { id: 'settings', label: 'Settings', icon: Trophy },
  ];

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div>
          <Link href="/admin/leagues" className="text-gray-500 hover:text-blue-600 flex items-center gap-1 text-sm font-medium mb-2 w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to Leagues
          </Link>
          <h1 className="text-3xl font-bold">{league.name}</h1>
          <p className="text-gray-600">League Management Dashboard</p>
        </div>
        <div className="flex gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${league.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {league.is_active ? 'Published' : 'Draft'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b mb-6 hide-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white border rounded-xl shadow-sm min-h-[500px]">
        {activeTab === 'teams' && <TeamsManager leagueId={league.id} />}
        {activeTab === 'fixtures' && <FixturesManager leagueId={league.id} />}
        {activeTab === 'standings' && <StandingsManager leagueId={league.id} />}
        {activeTab === 'media' && (
          <div className="p-12 text-center text-gray-500">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <h2 className="text-xl font-medium text-gray-700 mb-2">Media Management</h2>
            <p>Component implementation pending. Use the main leagues page to edit Cover and Logo for now.</p>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="p-12 text-center text-gray-500">
            <Trophy className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <h2 className="text-xl font-medium text-gray-700 mb-2">League Settings</h2>
            <p>Component implementation pending. Edit league details from the main leagues page.</p>
          </div>
        )}
      </div>
    </div>
  );
}
