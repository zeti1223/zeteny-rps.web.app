import { useState, useEffect } from 'react'
import './App.css'
import StudentImport from './components/StudentImport'
import MatchRecorder from './components/MatchRecorder'
import MatchResults from './components/MatchResults'
import { MatchStatistics } from './components/MatchStatistics';
import PlayerList from './components/PlayerList'
import { getTournamentStatus } from './services/firebaseService.ts'
import type { Student } from './types.ts'

function App() {
  const [activeTab, setActiveTab] = useState<'import' | 'record' | 'results' | 'flowchart' | 'players' | 'statistics'>('record')
  const [refreshKey, setRefreshKey] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [tournamentStatus, setTournamentStatus] = useState<{
    totalStudents: number;
    activeStudents: number;
    eliminatedStudents: number;
    winner: Student | null;
    isComplete: boolean;
  } | null>(null)

  useEffect(() => {
    loadTournamentStatus()
  }, [refreshKey])

  const loadTournamentStatus = async () => {
    try {
      const status = await getTournamentStatus()
      setTournamentStatus(status)
    } catch (error) {
      console.error('Error loading tournament status:', error)
    }
  }

  const handleImportComplete = () => {
    setRefreshKey(prev => prev + 1)
    setActiveTab('record')
  }

  const handleMatchRecorded = () => {
    setRefreshKey(prev => prev + 1)
    // Stay on the current tab instead of redirecting to results
  }

  const handleTabChange = (tab: 'import' | 'record' | 'results' | 'flowchart' | 'players' | 'statistics') => {
    setActiveTab(tab)
    setIsMobileMenuOpen(false) // Close mobile menu when tab is selected
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        <header className="mb-4 sm:mb-6">
          <div className="text-center mb-4 sm:mb-5">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              🪨📄✂️
            </h1>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
              Rock Paper Scissors
            </h2>
            <p className="text-sm sm:text-base text-gray-600 font-medium">
              Tournament Manager
            </p>
          </div>
          
          {/* Mobile Navigation */}
          <div className="sm:hidden">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg bg-white border-2 border-gray-200 hover:border-gray-300 shadow-sm transition-all duration-200"
                aria-label="Toggle menu"
              >
                <div className="space-y-1.5">
                  <div className={`w-6 h-0.5 bg-gray-600 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
                  <div className={`w-6 h-0.5 bg-gray-600 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
                  <div className={`w-6 h-0.5 bg-gray-600 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
                </div>
              </button>
              <div className="text-lg font-bold text-gray-800">
                {activeTab === 'record' && '⚔️ Record Match'}
                {activeTab === 'players' && '👥 Player List'}
                {activeTab === 'results' && '🏆 View Results'}
                {activeTab === 'flowchart' && '🏆 Tournament Bracket'}
                {activeTab === 'import' && '📥 Import Students'}
                {activeTab === 'statistics' && '📊 Statistics'}
              </div>
            </div>
            
            {/* Mobile Menu Dropdown */}
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
              isMobileMenuOpen ? 'max-h-96 opacity-100 mb-4' : 'max-h-0 opacity-0'
            }`}>
              <nav className="bg-white rounded-xl border-2 border-gray-200 shadow-lg p-2 space-y-2">
                <button 
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                    activeTab === 'record' 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => handleTabChange('record')}
                >
                  ⚔️ Record Match
                </button>
                <button 
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                    activeTab === 'players' 
                      ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => handleTabChange('players')}
                >
                  👥 Player List
                </button>
                <button 
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                    activeTab === 'results' 
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => handleTabChange('results')}
                >
                  🏆 View Results
                </button>
                <button 
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                    activeTab === 'statistics' 
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => handleTabChange('statistics')}
                >
                  📊 Statistics
                </button>
                {/*<button 
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                    activeTab === 'flowchart' 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => handleTabChange('flowchart')}
                >
                  🏆 Tournament Bracket
                </button>*/}
                <button 
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                    activeTab === 'import' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => handleTabChange('import')}
                >
                  📥 Import Students
                </button>
              </nav>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex flex-row justify-center gap-2 max-w-5xl mx-auto">
            <button 
              className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                activeTab === 'record' 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md border-2 border-green-500' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 shadow-sm'
              }`}
              onClick={() => handleTabChange('record')}
            >
              ⚔️ Record Match
            </button>
            <button 
              className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                activeTab === 'players' 
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md border-2 border-indigo-500' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 shadow-sm'
              }`}
              onClick={() => handleTabChange('players')}
            >
              👥 Player List
            </button>
            <button 
              className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                activeTab === 'results' 
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md border-2 border-purple-500' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 shadow-sm'
              }`}
              onClick={() => handleTabChange('results')}
            >
              🏆 View Results
            </button>
            <button 
              className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                activeTab === 'statistics' 
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md border-2 border-yellow-500' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 shadow-sm'
              }`}
              onClick={() => handleTabChange('statistics')}
            >
              📊 Statistics
            </button>
            {/*<button 
              className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                activeTab === 'flowchart' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md border-2 border-cyan-500' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 shadow-sm'
              }`}
              onClick={() => handleTabChange('flowchart')}
            >
              🏆 Tournament Bracket
            </button>*/}
            <button 
              className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                activeTab === 'import' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md border-2 border-blue-500' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 shadow-sm'
              }`}
              onClick={() => handleTabChange('import')}
            >
              📥 Import Students
            </button>
          </nav>
        </header>

        {/* Tournament Status Banner */}
        {tournamentStatus && tournamentStatus.totalStudents > 0 && activeTab !== 'statistics' && (
          <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-2xl shadow-lg animate-fadeIn ${
            tournamentStatus.isComplete && tournamentStatus.winner
              ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300'
              : tournamentStatus.activeStudents <= 2 && tournamentStatus.totalStudents > 2
              ? 'bg-gradient-to-r from-orange-100 to-red-100 border-2 border-orange-300'
              : 'bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-blue-300'
          }`}>
            <div className="text-center">
              {tournamentStatus.isComplete && tournamentStatus.winner ? (
                <div>
                  <div className="text-2xl sm:text-3xl mb-2">🏆👑</div>
                  <div className="text-lg sm:text-xl font-bold text-yellow-800 mb-1">
                    Tournament Complete!
                  </div>
                  <div className="text-base sm:text-lg font-semibold text-yellow-700">
                    🎉 <span className="text-yellow-900">{tournamentStatus.winner.name}</span> is the Champion! 🎉
                  </div>
                </div>
              ) : tournamentStatus.activeStudents <= 2 && tournamentStatus.totalStudents > 2 ? (
                <div>
                  <div className="text-xl sm:text-2xl mb-2">🔥</div>
                  <div className="text-base sm:text-lg font-bold text-orange-800 mb-1">
                    Final Showdown!
                  </div>
                  <div className="text-sm sm:text-base text-orange-700">
                    Only {tournamentStatus.activeStudents} student{tournamentStatus.activeStudents === 1 ? ' remains' : 's remain'} • {tournamentStatus.eliminatedStudents} eliminated
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-lg sm:text-xl mb-2">⚔️</div>
                  <div className="text-sm sm:text-base font-semibold text-blue-800">
                    Tournament in Progress: {tournamentStatus.activeStudents} active • {tournamentStatus.eliminatedStudents} eliminated
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <main className="animate-fadeIn">
          {activeTab === 'import' && (
            <StudentImport onImportComplete={handleImportComplete} />
          )}
          {activeTab === 'players' && (
            <PlayerList key={refreshKey} />
          )}
          {activeTab === 'record' && (
            <MatchRecorder onMatchRecorded={handleMatchRecorded} />
          )}
          {activeTab === 'results' && (
            <MatchResults key={refreshKey} />
          )}
          {activeTab === 'statistics' && (
            <MatchStatistics />
          )}
          {/*{activeTab === 'flowchart' && (
            <MatchFlowChart key={refreshKey} />
          )}*/}
        </main>
      </div>
    </div>
  )
}

export default App
