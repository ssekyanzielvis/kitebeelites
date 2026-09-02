'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Trophy, Calendar, MapPin, Users, Activity, ArrowLeft, Shield } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import LoadingSpinner from '@/components/LoadingSpinner';
import MediaRenderer from '@/components/MediaRenderer';
import { Database } from '@/lib/supabase/types';
import Link from 'next/link';

type League = Database['public']['Tables']['leagues']['Row'];
type LeagueMedia = Database['public']['Tables']['league_media']['Row'];

export default function LeagueDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [league, setLeague] = useState<League | null>(null);
  const [media, setMedia] = useState<LeagueMedia[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (params?.id) {
      fetchLeagueData(params.id as string);
    }
  }, [params?.id]);

  const fetchLeagueData = async (leagueId: string) => {
    try {
      // Fetch league basic info
      const { data: leagueData, error: leagueError } = await (supabase
        .from('leagues') as any)
        .select('*')
        .eq('id', leagueId)
        .eq('is_active', true)
        .single();

      if (leagueError) throw leagueError;
      setLeague(leagueData);

      // Fetch league media
      const { data: mediaData } = await (supabase
        .from('league_media') as any)
        .select('*')
        .eq('league_id', leagueId)
        .eq('is_published', true)
        .order('display_order', { ascending: true });

      if (mediaData) setMedia(mediaData);

      // Fetch teams
      const { data: teamsData } = await (supabase
        .from('teams') as any)
        .select('*')
        .eq('league_id', leagueId)
        .order('name');
        
      if (teamsData) setTeams(teamsData);

      // Fetch fixtures
      const { data: fixturesData } = await (supabase
        .from('fixtures') as any)
        .select('*, home_team:teams!home_team_id(*), away_team:teams!away_team_id(*)')
        .eq('league_id', leagueId)
        .order('match_date', { ascending: true });

      if (fixturesData) {
        // Since Supabase might not automatically join if there are multiple FKs without specifying,
        // if the above fails, we map manually:
        if (fixturesData[0] && !fixturesData[0].home_team && teamsData) {
            const mapped = fixturesData.map((f: any) => ({
                ...f,
                home_team: teamsData.find((t: any) => t.id === f.home_team_id),
                away_team: teamsData.find((t: any) => t.id === f.away_team_id)
            }));
            setFixtures(mapped);
        } else {
            setFixtures(fixturesData);
        }
      }

      // Fetch standings
      const { data: standingsData } = await (supabase
        .from('standings') as any)
        .select('*')
        .eq('league_id', leagueId);
        
      if (standingsData && teamsData) {
        const enriched = standingsData.map((s: any) => ({
          ...s,
          team: teamsData.find((t: any) => t.id === s.team_id)
        })).sort((a: any, b: any) => {
          if (b.points !== a.points) return b.points - a.points;
          const gdA = a.goals_for - a.goals_against;
          const gdB = b.goals_for - b.goals_against;
          if (gdB !== gdA) return gdB - gdA;
          return b.goals_for - a.goals_for;
        });
        setStandings(enriched);
      }

    } catch (error) {
      console.error('Error fetching league details:', error);
      router.push('/leagues'); // redirect if not found
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!league) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[60vh] w-full bg-gray-900">
        {league.cover_url ? (
          <MediaRenderer src={league.cover_url} alt={league.name} className="w-full h-full object-cover opacity-60" />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-40">
            <Trophy className="w-32 h-32 text-gray-500" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
          <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-12">
            <Link href="/leagues" className="text-white/80 hover:text-white flex items-center gap-2 mb-6 w-fit">
              <ArrowLeft className="w-4 h-4" /> Back to Leagues
            </Link>
            
            <div className="flex items-end gap-6">
              {league.logo_url && (
                <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-xl p-2 shadow-2xl flex-shrink-0">
                  <img src={league.logo_url} alt="Logo" className="w-full h-full object-contain" />
                </div>
              )}
              
              <div className="pb-2">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${league.status === 'Active' ? 'bg-green-500 text-white' : 'bg-white/20 text-white'}`}>
                    {league.status}
                  </span>
                  {league.sport && <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-500 text-white">{league.sport.toUpperCase()}</span>}
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{league.name}</h1>
                <p className="text-white/80 text-lg">{league.season} • {league.gender} • {league.age_category}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b sticky top-16 z-20 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto hide-scrollbar">
            {['overview', 'media', 'teams', 'fixtures', 'standings'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-semibold text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="container mx-auto px-4 py-12">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border">
                <h2 className="text-2xl font-bold mb-4">About the League</h2>
                {league.description ? (
                  <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                    {league.description}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No description provided yet.</p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border">
                <h3 className="text-lg font-bold mb-4 border-b pb-2">League Details</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-gray-700">
                    <Activity className="w-5 h-5 text-blue-600 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm text-gray-500">Format</p>
                      <p>{league.competition_type || 'TBA'}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm text-gray-500">Location / Venue</p>
                      <p>{league.location || 'TBA'}</p>
                      {league.venue && <p className="text-sm">{league.venue}</p>}
                    </div>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <Calendar className="w-5 h-5 text-blue-600 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm text-gray-500">Schedule</p>
                      <p>{league.start_date ? new Date(league.start_date).toLocaleDateString() : 'TBA'} - {league.end_date ? new Date(league.end_date).toLocaleDateString() : 'TBA'}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <Users className="w-5 h-5 text-blue-600 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm text-gray-500">Organizer</p>
                      <p>{league.organizer || 'TBA'}</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'media' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Gallery & Media</h2>
            {media.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {media.map((m) => (
                  <div key={m.id} className="bg-white rounded-xl shadow-sm overflow-hidden border">
                    <div className="relative h-64 bg-black">
                      <MediaRenderer src={m.media_url} alt={m.title} className="w-full h-full object-contain" />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-lg">{m.title}</h4>
                      {m.description && <p className="text-gray-600 text-sm mt-1">{m.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl shadow-sm border">
                <p className="text-gray-500">No media has been uploaded for this league yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'teams' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Participating Teams</h2>
            {teams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map((team) => (
                  <div key={team.id} className="bg-white rounded-xl shadow-sm overflow-hidden border p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                    <div className="w-24 h-24 rounded-full bg-gray-50 border flex items-center justify-center mb-4 p-2">
                      {team.logo_url ? (
                        <img src={team.logo_url} alt={team.name} className="w-full h-full object-contain" />
                      ) : (
                        <Shield className="w-12 h-12 text-gray-300" />
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-1">{team.name}</h3>
                    {team.location && <p className="text-gray-500 text-sm mb-2">{team.location}</p>}
                    {team.manager && <p className="text-sm bg-gray-100 px-3 py-1 rounded-full mt-2">Manager: {team.manager}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl shadow-sm border">
                <p className="text-gray-500">No teams have been added to this league yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'fixtures' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Fixtures & Results</h2>
            {fixtures.length > 0 ? (
              <div className="space-y-4">
                {fixtures.map((fixture) => (
                  <div key={fixture.id} className="bg-white rounded-xl shadow-sm overflow-hidden border flex flex-col md:flex-row hover:shadow-md transition-shadow">
                    
                    {/* Date Block */}
                    <div className="bg-gray-50 p-4 md:w-48 flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-100 shrink-0">
                      <div className="flex items-center text-sm font-bold text-gray-700 mb-1">
                        <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                        {fixture.match_date ? new Date(fixture.match_date).toLocaleDateString() : 'TBA'}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        {fixture.match_date ? new Date(fixture.match_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Time TBA'}
                      </div>
                      {fixture.venue && (
                        <div className="flex items-center text-xs text-gray-500 mt-2">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span className="truncate">{fixture.venue}</span>
                        </div>
                      )}
                    </div>

                    {/* Match Block */}
                    <div className="flex-1 p-6 flex flex-col justify-center">
                      <div className="flex items-center justify-between gap-4">
                        
                        {/* Home Team */}
                        <div className="flex flex-col items-center flex-1 w-0">
                          <div className="w-16 h-16 rounded-full border mb-3 flex items-center justify-center p-2 bg-white">
                            {fixture.home_team?.logo_url ? (
                              <img src={fixture.home_team.logo_url} className="w-full h-full object-contain" alt={fixture.home_team.name} />
                            ) : <span className="font-bold text-gray-300 text-xl">H</span>}
                          </div>
                          <span className="font-bold text-center w-full truncate">{fixture.home_team?.name || 'Unknown Team'}</span>
                        </div>

                        {/* VS / Score */}
                        <div className="flex flex-col items-center justify-center shrink-0 px-4">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full mb-2 ${fixture.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{fixture.status}</span>
                          {fixture.home_score !== null && fixture.away_score !== null ? (
                            <div className="bg-gray-900 text-white font-black text-2xl rounded-lg px-4 py-2 shadow-sm tracking-widest">
                              {fixture.home_score} - {fixture.away_score}
                            </div>
                          ) : (
                            <div className="bg-blue-600 text-white font-black text-xl rounded-lg px-4 py-2 shadow-sm">VS</div>
                          )}
                          <span className="text-xs text-gray-500 font-medium mt-2">{fixture.match_type}</span>
                        </div>

                        {/* Away Team */}
                        <div className="flex flex-col items-center flex-1 w-0">
                          <div className="w-16 h-16 rounded-full border mb-3 flex items-center justify-center p-2 bg-white">
                            {fixture.away_team?.logo_url ? (
                              <img src={fixture.away_team.logo_url} className="w-full h-full object-contain" alt={fixture.away_team.name} />
                            ) : <span className="font-bold text-gray-300 text-xl">A</span>}
                          </div>
                          <span className="font-bold text-center w-full truncate">{fixture.away_team?.name || 'Unknown Team'}</span>
                        </div>

                      </div>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl shadow-sm border">
                <p className="text-gray-500">No fixtures have been scheduled yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'standings' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">League Standings</h2>
            {standings.length > 0 ? (
              <div className="overflow-x-auto border rounded-xl shadow-sm">
                <table className="w-full text-left bg-white">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="p-4 font-bold text-gray-600 w-16 text-center">Pos</th>
                      <th className="p-4 font-bold text-gray-600 min-w-[200px]">Team</th>
                      <th className="p-4 font-bold text-gray-600 text-center w-16" title="Played">P</th>
                      <th className="p-4 font-bold text-gray-600 text-center w-16" title="Won">W</th>
                      <th className="p-4 font-bold text-gray-600 text-center w-16" title="Drawn">D</th>
                      <th className="p-4 font-bold text-gray-600 text-center w-16" title="Lost">L</th>
                      <th className="p-4 font-bold text-gray-600 text-center w-16" title="Goals For">GF</th>
                      <th className="p-4 font-bold text-gray-600 text-center w-16" title="Goals Against">GA</th>
                      <th className="p-4 font-bold text-gray-600 text-center w-16" title="Goal Difference">GD</th>
                      <th className="p-4 font-bold text-blue-600 text-center w-20 bg-blue-50/50">Pts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {standings.map((row, index) => (
                      <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 text-center font-medium">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto ${
                            index === 0 ? 'bg-yellow-100 text-yellow-700 font-bold' : 
                            index === 1 ? 'bg-gray-200 text-gray-700 font-bold' :
                            index === 2 ? 'bg-orange-100 text-orange-700 font-bold' : 'text-gray-500'
                          }`}>
                            {index + 1}
                          </span>
                        </td>
                        <td className="p-4 font-bold flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full border bg-white flex items-center justify-center p-0.5 overflow-hidden">
                            {row.team?.logo_url ? (
                              <img src={row.team.logo_url} alt={row.team.name} className="w-full h-full object-contain" />
                            ) : (
                              <span className="text-xs text-gray-400">?</span>
                            )}
                          </div>
                          {row.team?.name || 'Unknown Team'}
                        </td>
                        <td className="p-4 text-center">{row.played}</td>
                        <td className="p-4 text-center">{row.won}</td>
                        <td className="p-4 text-center">{row.drawn}</td>
                        <td className="p-4 text-center">{row.lost}</td>
                        <td className="p-4 text-center">{row.goals_for}</td>
                        <td className="p-4 text-center">{row.goals_against}</td>
                        <td className={`p-4 text-center font-medium ${row.goals_for - row.goals_against > 0 ? 'text-green-600' : row.goals_for - row.goals_against < 0 ? 'text-red-600' : ''}`}>
                          {row.goals_for > row.goals_against ? '+' : ''}{row.goals_for - row.goals_against}
                        </td>
                        <td className="p-4 text-center font-black text-lg bg-blue-50/50 text-blue-800">{row.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl shadow-sm border">
                <p className="text-gray-500">Standings are not available yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
