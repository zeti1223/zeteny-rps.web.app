import React, { useState, useEffect } from 'react';
import type { Student } from '../types.ts';
import { subscribeToActiveStudentsWithMatchAndWinCounts } from '../services/firebaseService.ts';

const Leaderboard: React.FC = () => {
  const [students, setStudents] = useState<(Student & { matchCount: number; winCount: number })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToActiveStudentsWithMatchAndWinCounts((studentsWithCounts) => {
      const sortedStudents = studentsWithCounts.sort((a, b) => b.winCount - a.winCount);
      setStudents(sortedStudents);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-6">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-3"></div>
            <div className="text-lg font-semibold text-gray-600">Loading leaderboard...</div>
          </div>
        </div>
      </div>
    );
  }

  const topThree = students.slice(0, 3);
  const rest = students.slice(3);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-4 sm:p-6">
        <div className="text-center mb-6">
          <div className="text-3xl sm:text-4xl mb-2">🥇</div>
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent mb-1">
            Leaderboard
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Top players based on the number of matches won.
          </p>
        </div>

        {/* Podium for Top 3 */}
        {topThree.length > 0 && (
          <div className="flex justify-center items-end gap-4 mb-8">
            {/* 2nd Place */}
            {topThree[1] && (
              <div className="text-center">
                <div className="text-2xl">🥈</div>
                <div className="font-bold text-lg text-gray-700">{topThree[1].name}</div>
                <div className="text-gray-500">{topThree[1].winCount} wins</div>
              </div>
            )}
            {/* 1st Place */}
            {topThree[0] && (
              <div className="text-center mx-4">
                <div className="text-4xl">🥇</div>
                <div className="font-bold text-2xl text-yellow-600">{topThree[0].name}</div>
                <div className="text-gray-500">{topThree[0].winCount} wins</div>
              </div>
            )}
            {/* 3rd Place */}
            {topThree[2] && (
              <div className="text-center">
                <div className="text-2xl">🥉</div>
                <div className="font-bold text-lg text-orange-700">{topThree[2].name}</div>
                <div className="text-gray-500">{topThree[2].winCount} wins</div>
              </div>
            )}
          </div>
        )}

        {/* Rest of the list */}
        {rest.length > 0 && (
          <div className="space-y-3">
            {rest.map((student, index) => (
              <div
                key={student.id}
                className="p-4 rounded-xl border-2 bg-gradient-to-r from-gray-50 to-white border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white bg-gray-400">
                      {index + 4}
                    </div>
                    <div>
                      <div className="font-bold text-lg text-gray-800">
                        {student.name}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-700">
                      {student.winCount}
                    </div>
                    <div className="text-sm text-gray-600">
                      Wins
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {students.length === 0 && (
            <div className="text-center py-10">
                <div className="text-4xl mb-3">🤷</div>
                <div className="text-lg font-semibold text-gray-600 mb-1">No active players found!</div>
                <div className="text-gray-500 text-sm">Play some matches to see the leaderboard.</div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
