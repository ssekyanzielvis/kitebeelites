'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { adminDb } from '@/lib/supabase/adminDb';
import { RefreshCw, Trophy, Edit, Trash2 } from 'lucide-react';
import { useNotification } from '@/lib/store';
import { Database } from '@/lib/supabase/types';

type Standing = Database['public']['Tables']['standings']['Row'];
type Team = Database['public']['Tables']['teams']['Row'];
type Fixture = Database['public']['Tables']['fixtures']['Row'];

export default function StandingsManager({ leagueId }: { leagueId: string }) {
  const [standings, setStandings] = useState<(Standing & { team?: Team })[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchStandings();
  }, [leagueId]);

  const fetchStandings = async () => {
    try {
      setLoading(true);
      // Fetch standings
      const { data: standingsData } = await (supabase.from('standings') as any).select('*').eq('league_id', leagueId);
      
      // Fetch teams for mapping
      const { data: teamsData } = await (supabase.from('teams') as any).select('*').eq('league_id', leagueId);

      const enriched = (standingsData || []).map((s: any) => ({
        ...s,
        team: teamsData?.find((t: any) => t.id === s.team_id)
      })).sort((a: any, b: any) => {
        // Sort by points, then goal difference, then goals scored
        if (b.points !== a.points) return b.points - a.points;
        const gdA = a.goals_for - a.goals_against;
        const gdB = b.goals_for - b.goals_against;
        if (gdB !== gdA) return gdB - gdA;
        return b.goals_for - a.goals_for;
      });

      setStandings(enriched);
    } catch (error) {
      showNotification('Failed to load standings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const recalculateStandings = async () => {
    if (!confirm('This will overwrite current standings based on all Completed fixtures. Continue?')) return;
    setIsRecalculating(true);
    
    try {
      // 1. Get all completed fixtures
      const { data: fixtures } = await (supabase.from('fixtures') as any)
        .select('*')
        .eq('league_id', leagueId)
        .eq('status', 'Completed')
        .not('home_score', 'is', null)
        .not('away_score', 'is', null);

      // 2. Get all teams
      const { data: teams } = await (supabase.from('teams') as any)
        .select('id')
        .eq('league_id', leagueId);

      if (!teams) throw new Error('No teams found');

      // 3. Initialize standings object
      const newStandings: Record<string, Omit<Standing, 'id' | 'created_at' | 'updated_at'>> = {};
      teams.forEach((t: any) => {
        newStandings[t.id] = {
          league_id: leagueId,
          team_id: t.id,
          played: 0, won: 0, drawn: 0, lost: 0,
          goals_for: 0, goals_against: 0, points: 0
        };
      });

      // 4. Calculate
      (fixtures || []).forEach((f: Fixture) => {
        const home = f.home_team_id;
        const away = f.away_team_id;
        const hScore = f.home_score!;
        const aScore = f.away_score!;

        if (home && newStandings[home]) {
          newStandings[home].played += 1;
          newStandings[home].goals_for += hScore;
          newStandings[home].goals_against += aScore;
          if (hScore > aScore) { newStandings[home].won += 1; newStandings[home].points += 3; }
          else if (hScore === aScore) { newStandings[home].drawn += 1; newStandings[home].points += 1; }
          else { newStandings[home].lost += 1; }
        }

        if (away && newStandings[away]) {
          newStandings[away].played += 1;
          newStandings[away].goals_for += aScore;
          newStandings[away].goals_against += hScore;
          if (aScore > hScore) { newStandings[away].won += 1; newStandings[away].points += 3; }
          else if (aScore === hScore) { newStandings[away].drawn += 1; newStandings[away].points += 1; }
          else { newStandings[away].lost += 1; }
        }
      });

      // 5. Delete old standings and insert new
      await adminDb('standings').delete().eq('league_id', leagueId);
      
      const insertData = Object.values(newStandings);
      if (insertData.length > 0) {
        await adminDb('standings').insert(insertData);
      }

      showNotification('Standings recalculated successfully!', 'success');
      fetchStandings();
    } catch (error: any) {
      showNotification(error.message, 'error');
    } finally {
      setIsRecalculating(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">League Standings</h2>
          <p className="text-gray-500 text-sm">Manage team rankings based on match results.</p>
        </div>
        <button
          onClick={recalculateStandings}
          disabled={isRecalculating}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 text-sm font-medium disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRecalculating ? 'animate-spin' : ''}`} />
          {isRecalculating ? 'Recalculating...' : 'Recalculate from Results'}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
      ) : standings.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg bg-gray-50">
          <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No standings generated yet.</p>
          <p className="text-sm text-gray-500 mt-1">Click Recalculate to generate from fixture results.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-xl shadow-sm">
          <table className="w-full text-left bg-white">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-bold text-gray-600 w-16 text-center">Pos</th>
                <th className="p-4 font-bold text-gray-600">Team</th>
                <th className="p-4 font-bold text-gray-600 text-center w-16" title="Played">P</th>
                <th className="p-4 font-bold text-gray-600 text-center w-16" title="Won">W</th>
                <th className="p-4 font-bold text-gray-600 text-center w-16" title="Drawn">D</th>
                <th className="p-4 font-bold text-gray-600 text-center w-16" title="Lost">L</th>
                <th className="p-4 font-bold text-gray-600 text-center w-16" title="Goals For">GF</th>
                <th className="p-4 font-bold text-gray-600 text-center w-16" title="Goals Against">GA</th>
                <th className="p-4 font-bold text-gray-600 text-center w-16" title="Goal Difference">GD</th>
                <th className="p-4 font-bold text-gray-900 text-center w-20">Pts</th>
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
                  <td className="p-4 text-center font-medium {row.goals_for - row.goals_against > 0 ? 'text-green-600' : row.goals_for - row.goals_against < 0 ? 'text-red-600' : ''}">
                    {row.goals_for > row.goals_against ? '+' : ''}{row.goals_for - row.goals_against}
                  </td>
                  <td className="p-4 text-center font-black text-lg bg-gray-50/50">{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
