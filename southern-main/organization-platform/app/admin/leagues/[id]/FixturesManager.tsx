'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { adminDb } from '@/lib/supabase/adminDb';
import { Plus, Edit, Trash2, Calendar as CalendarIcon, MapPin, Clock, FileText, CheckCircle } from 'lucide-react';
import { useNotification } from '@/lib/store';
import { Database } from '@/lib/supabase/types';

type Fixture = Database['public']['Tables']['fixtures']['Row'];
type Team = Database['public']['Tables']['teams']['Row'];

export default function FixturesManager({ leagueId }: { leagueId: string }) {
  const [fixtures, setFixtures] = useState<(Fixture & { home_team?: Team, away_team?: Team })[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [editingFixture, setEditingFixture] = useState<Fixture | null>(null);
  const { showNotification } = useNotification();

  const [formData, setFormData] = useState({
    home_team_id: '',
    away_team_id: '',
    match_date: '',
    venue: '',
    status: 'Scheduled',
    match_type: 'Group Stage',
  });

  const [resultData, setResultData] = useState({
    home_score: '',
    away_score: '',
    match_report: '',
    highlights_url: '',
    status: 'Completed'
  });

  useEffect(() => {
    fetchData();
  }, [leagueId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: teamsData } = await (supabase.from('teams') as any).select('*').eq('league_id', leagueId).order('name');
      setTeams(teamsData || []);

      const { data: fixturesData } = await (supabase.from('fixtures') as any).select('*').eq('league_id', leagueId).order('match_date', { ascending: true });
      
      const fixturesWithTeams = (fixturesData || []).map((f: any) => ({
        ...f,
        home_team: teamsData?.find((t: any) => t.id === f.home_team_id),
        away_team: teamsData?.find((t: any) => t.id === f.away_team_id),
      }));

      setFixtures(fixturesWithTeams);
    } catch (error) {
      showNotification('Failed to load fixtures', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.home_team_id === formData.away_team_id) {
      showNotification('Home and Away teams must be different', 'error');
      return;
    }

    setLoading(true);
    try {
      const dataToSave = {
        league_id: leagueId,
        home_team_id: formData.home_team_id,
        away_team_id: formData.away_team_id,
        match_date: formData.match_date ? new Date(formData.match_date).toISOString() : null,
        venue: formData.venue,
        status: formData.status,
        match_type: formData.match_type,
      };

      if (editingFixture) {
        await adminDb('fixtures').update({ ...dataToSave, updated_at: new Date().toISOString() }).eq('id', editingFixture.id);
        showNotification('Fixture updated successfully', 'success');
      } else {
        await adminDb('fixtures').insert(dataToSave);
        showNotification('Fixture added successfully', 'success');
      }

      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminDb('fixtures').update({
        home_score: resultData.home_score === '' ? null : parseInt(resultData.home_score),
        away_score: resultData.away_score === '' ? null : parseInt(resultData.away_score),
        match_report: resultData.match_report,
        highlights_url: resultData.highlights_url,
        status: resultData.status,
        updated_at: new Date().toISOString()
      }).eq('id', editingFixture!.id);

      showNotification('Result saved successfully', 'success');
      setIsResultModalOpen(false);
      fetchData();
    } catch (error: any) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this fixture?')) return;
    try {
      await adminDb('fixtures').delete().eq('id', id);
      showNotification('Fixture deleted successfully', 'success');
      fetchData();
    } catch (error: any) {
      showNotification(error.message, 'error');
    }
  };

  const openEditModal = (fixture: Fixture) => {
    setEditingFixture(fixture);
    setFormData({
      home_team_id: fixture.home_team_id || '',
      away_team_id: fixture.away_team_id || '',
      match_date: fixture.match_date ? new Date(fixture.match_date).toISOString().slice(0, 16) : '',
      venue: fixture.venue || '',
      status: fixture.status || 'Scheduled',
      match_type: fixture.match_type || 'Group Stage',
    });
    setIsModalOpen(true);
  };

  const openResultModal = (fixture: Fixture) => {
    setEditingFixture(fixture);
    setResultData({
      home_score: fixture.home_score !== null ? String(fixture.home_score) : '',
      away_score: fixture.away_score !== null ? String(fixture.away_score) : '',
      match_report: fixture.match_report || '',
      highlights_url: fixture.highlights_url || '',
      status: fixture.status === 'Scheduled' ? 'Completed' : (fixture.status || 'Completed')
    });
    setIsResultModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Fixtures & Results</h2>
          <p className="text-gray-500 text-sm">Schedule matches and input results.</p>
        </div>
        <button
          onClick={() => { setEditingFixture(null); setFormData({home_team_id: '', away_team_id: '', match_date: '', venue: '', status: 'Scheduled', match_type: 'Group Stage'}); setIsModalOpen(true); }}
          disabled={teams.length < 2}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 text-sm font-medium disabled:bg-blue-300"
        >
          <Plus className="w-4 h-4" /> Schedule Match
        </button>
      </div>

      {loading && fixtures.length === 0 ? (
        <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
      ) : fixtures.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg bg-gray-50">
          <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No fixtures scheduled.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {fixtures.map((fixture) => (
            <div key={fixture.id} className="border rounded-xl bg-white shadow-sm overflow-hidden flex flex-col md:flex-row items-stretch">
              
              <div className="bg-gray-50 p-4 md:w-48 flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-100 shrink-0">
                <div className="flex items-center text-sm font-bold text-gray-700 mb-2">
                  <Clock className="w-4 h-4 mr-2 text-blue-600" />
                  {fixture.match_date ? new Date(fixture.match_date).toLocaleDateString() : 'TBA'}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span className="truncate">{fixture.venue || 'Venue TBA'}</span>
                </div>
              </div>

              <div className="flex-1 p-4 flex flex-col md:flex-row items-center justify-between gap-6 relative">
                
                <div className="flex-1 flex items-center justify-center gap-4 md:gap-8 w-full">
                  <div className="flex flex-col items-center flex-1 w-0">
                    <span className="font-bold text-center w-full truncate">{fixture.home_team?.name || 'Unknown'}</span>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center shrink-0">
                    <span className={`text-xs font-bold px-2 py-1 rounded mb-1 ${fixture.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{fixture.status}</span>
                    
                    {/* Score display */}
                    {fixture.home_score !== null && fixture.away_score !== null ? (
                      <div className="bg-gray-900 text-white font-black text-2xl rounded-lg px-4 py-2 shadow-sm tracking-widest">
                        {fixture.home_score} - {fixture.away_score}
                      </div>
                    ) : (
                      <div className="bg-blue-600 text-white font-black text-xl rounded-lg px-4 py-2 shadow-sm">VS</div>
                    )}
                    <span className="text-xs text-gray-400 mt-1">{fixture.match_type}</span>
                  </div>
                  
                  <div className="flex flex-col items-center flex-1 w-0">
                    <span className="font-bold text-center w-full truncate">{fixture.away_team?.name || 'Unknown'}</span>
                  </div>
                </div>

                <div className="flex md:flex-col gap-2 md:border-l pl-0 md:pl-4 border-gray-100 self-center">
                  <button onClick={() => openResultModal(fixture)} className="p-2 text-green-600 hover:bg-green-50 rounded bg-green-50/50" title="Add/Edit Result">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button onClick={() => openEditModal(fixture)} className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="Edit Fixture">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(fixture.id)} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Delete Fixture">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Result Modal */}
      {isResultModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6 pb-2 border-b">
              <h3 className="text-lg font-bold">Match Result</h3>
              <button onClick={() => setIsResultModalOpen(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>

            <form onSubmit={handleResultSubmit} className="space-y-6">
              
              <div className="flex items-center justify-between bg-gray-50 p-6 rounded-lg border">
                <div className="text-center w-1/3">
                  <p className="font-bold text-sm mb-2 truncate">{(editingFixture as any)?.home_team?.name}</p>
                  <input
                    type="number"
                    min="0"
                    value={resultData.home_score}
                    onChange={e => setResultData({...resultData, home_score: e.target.value})}
                    className="w-20 p-2 text-center text-2xl font-bold border rounded outline-none"
                    placeholder="-"
                  />
                </div>
                <div className="text-gray-400 font-bold">VS</div>
                <div className="text-center w-1/3">
                  <p className="font-bold text-sm mb-2 truncate">{(editingFixture as any)?.away_team?.name}</p>
                  <input
                    type="number"
                    min="0"
                    value={resultData.away_score}
                    onChange={e => setResultData({...resultData, away_score: e.target.value})}
                    className="w-20 p-2 text-center text-2xl font-bold border rounded outline-none"
                    placeholder="-"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={resultData.status}
                  onChange={e => setResultData({...resultData, status: e.target.value})}
                  className="w-full p-2 border rounded outline-none"
                >
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Abandoned">Abandoned</option>
                  <option value="Postponed">Postponed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Match Report / Summary</label>
                <textarea
                  value={resultData.match_report}
                  onChange={e => setResultData({...resultData, match_report: e.target.value})}
                  className="w-full p-2 border rounded outline-none h-24 text-sm"
                  placeholder="Key moments, scorers, etc."
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button type="button" onClick={() => setIsResultModalOpen(false)} className="px-4 py-2 border rounded hover:bg-gray-50 text-sm font-medium">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save Result'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Fixture Modal here (simplified for brevity since it exists above) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
             <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h3 className="text-lg font-bold">{editingFixture ? 'Edit Fixture' : 'Schedule Match'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4 items-end bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Home Team *</label>
                  <select
                    required
                    value={formData.home_team_id}
                    onChange={e => setFormData({...formData, home_team_id: e.target.value})}
                    className="w-full p-2 border rounded bg-white outline-none"
                  >
                    <option value="">Select Team...</option>
                    {teams.map(t => (
                      <option key={t.id} value={t.id} disabled={t.id === formData.away_team_id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div className="text-center font-bold text-gray-400 -mb-2">VS</div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Away Team *</label>
                  <select
                    required
                    value={formData.away_team_id}
                    onChange={e => setFormData({...formData, away_team_id: e.target.value})}
                    className="w-full p-2 border rounded bg-white outline-none"
                  >
                    <option value="">Select Team...</option>
                    {teams.map(t => (
                      <option key={t.id} value={t.id} disabled={t.id === formData.home_team_id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date & Time</label>
                  <input
                    type="datetime-local"
                    value={formData.match_date}
                    onChange={e => setFormData({...formData, match_date: e.target.value})}
                    className="w-full p-2 border rounded outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    className="w-full p-2 border rounded outline-none text-sm"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Postponed">Postponed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Match Type / Round</label>
                  <input type="text" value={formData.match_type} onChange={e => setFormData({...formData, match_type: e.target.value})} className="w-full p-2 border rounded outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Venue</label>
                  <input type="text" value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})} className="w-full p-2 border rounded outline-none text-sm" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded hover:bg-gray-50 text-sm font-medium">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save Fixture'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
