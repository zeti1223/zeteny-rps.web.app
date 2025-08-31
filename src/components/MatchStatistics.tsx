import { useEffect, useState, useCallback } from 'react';
import { getMatchStatistics, subscribeToAllStudentsWithMatchCounts } from '../services/firebaseService';
import type { MatchStatistics as MatchStatisticsType, Student } from '../types';

export const MatchStatistics = () => {
  const [stats, setStats] = useState<MatchStatisticsType | null>(null);
  const [students, setStudents] = useState<(Student & { matchCount: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const statistics = await getMatchStatistics();
      setStats(statistics);
    } catch (err) {
      console.error("Error fetching match statistics:", err);
      setError('Failed to load match statistics.');
    }
    // We don't set loading to false here because the subscription will do it.
  }, []);

  useEffect(() => {
    fetchStats();

    const unsubscribe = subscribeToAllStudentsWithMatchCounts(
      (studentsWithCounts) => {
        setStudents(studentsWithCounts);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [fetchStats]);

  const handleRefresh = () => {
    // Re-fetch the stats, the subscription will handle the student list update
    fetchStats();
  };

  const activeStudents = students.filter(s => !s.eliminated);
  const eliminatedStudents = students.filter(s => s.eliminated);
  const totalMatches = students.reduce((sum, student) => sum + student.matchCount, 0) / 2;
  const studentsWithMultipleMatches = students.filter(s => s.matchCount >= 1);
  const participationPercentage = students.length > 0 ? (studentsWithMultipleMatches.length / students.length * 100) : 0;

  if (loading) {
    return (
        <div className="max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-6">
                <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-3"></div>
                    <div className="text-lg font-semibold text-gray-600">Loading statistics...</div>
                </div>
            </div>
        </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-6">
          <div className="text-center">
            <div className="text-3xl mb-3">❌</div>
            <div className="text-red-700 bg-red-50 border-2 border-red-200 p-3 rounded-xl font-semibold text-sm">{error}</div>
             <button 
              onClick={handleRefresh}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-sm rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-purple-200 flex items-center gap-2 mx-auto"
            >
              🔄 Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-4 sm:p-6">
        <div className="text-center mb-5">
          <div className="text-3xl sm:text-4xl mb-2">📊</div>
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-1">
            Tournament Statistics
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            A detailed overview of the tournament progress and game statistics.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
            <div className="text-base font-semibold text-gray-700">
              {students.length} {students.length === 1 ? 'Player' : 'Players'}
            </div>
            <button 
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-sm rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-blue-200 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                '🔄 Refresh Stats'
              )}
            </button>
          </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-100">
            <div className="text-2xl font-bold text-green-700">{activeStudents.length}</div>
            <div className="text-sm text-green-600 font-semibold">Active Players</div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-xl border-2 border-red-100">
            <div className="text-2xl font-bold text-red-700">{eliminatedStudents.length}</div>
            <div className="text-sm text-red-600 font-semibold">Eliminated Players</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border-2 border-blue-100">
            <div className="text-2xl font-bold text-blue-700">{totalMatches}</div>
            <div className="text-sm text-blue-600 font-semibold">Total Matches</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-xl border-2 border-purple-100">
            <div className="text-2xl font-bold text-purple-700">{participationPercentage.toFixed(1)}%</div>
            <div className="text-sm text-purple-600 font-semibold">Tournament Participation</div>
            <div className="text-xs text-purple-500 mt-1">({studentsWithMultipleMatches.length}/{students.length} with 1+ matches)</div>
          </div>
        </div>

        {/* Match Choice Statistics */}
        {stats && (
          <div className="mt-8">
            <h3 className="text-lg font-bold text-center mb-4 text-gray-700">Game Choice Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border">
                <h4 className="font-bold text-center text-lg mb-2">Wins</h4>
                <ul className="space-y-2">
                  <li className="flex justify-between items-center"><span>🪨 Rock</span> <span className="font-bold text-green-600">{stats.wins.rock}</span></li>
                  <li className="flex justify-between items-center"><span>📄 Paper</span> <span className="font-bold text-green-600">{stats.wins.paper}</span></li>
                  <li className="flex justify-between items-center"><span>✂️ Scissors</span> <span className="font-bold text-green-600">{stats.wins.scissors}</span></li>
                </ul>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border">
                <h4 className="font-bold text-center text-lg mb-2">Losses</h4>
                <ul className="space-y-2">
                  <li className="flex justify-between items-center"><span>🪨 Rock</span> <span className="font-bold text-red-600">{stats.losses.rock}</span></li>
                  <li className="flex justify-between items-center"><span>📄 Paper</span> <span className="font-bold text-red-600">{stats.losses.paper}</span></li>
                  <li className="flex justify-between items.center"><span>✂️ Scissors</span> <span className="font-bold text-red-600">{stats.losses.scissors}</span></li>
                </ul>
              </div>
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
