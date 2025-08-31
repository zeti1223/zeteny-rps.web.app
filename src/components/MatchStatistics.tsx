import { useEffect, useState } from 'react';
import { getMatchStatistics, subscribeToAllStudentsWithMatchCounts } from '../services/firebaseService';
import type { MatchStatistics as MatchStatisticsType, Student } from '../types';

export const MatchStatistics = () => {
  const [stats, setStats] = useState<MatchStatisticsType | null>(null);
  const [students, setStudents] = useState<(Student & { matchCount: number })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const statistics = await getMatchStatistics();
        setStats(statistics);
      } catch (error) {
        console.error("Error fetching match statistics:", error);
      }
    };

    const unsubscribe = subscribeToAllStudentsWithMatchCounts((studentsWithCounts) => {
      setStudents(studentsWithCounts);
      setLoading(false);
    });

    fetchAllData();

    return () => unsubscribe();
  }, []);

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

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-4 sm:p-6">
        <div className="text-center mb-6">
          <div className="text-3xl sm:text-4xl mb-2">📊</div>
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-1">
            Tournament Statistics
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            A detailed overview of the tournament progress and game statistics.
          </p>
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
                  <li className="flex justify-between items-center"><span>✂️ Scissors</span> <span className="font-bold text-red-600">{stats.losses.scissors}</span></li>
                </ul>
              </div>
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
};