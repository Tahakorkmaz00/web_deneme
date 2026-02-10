import { useState } from 'react';
import Login from './components/Login';
import ModeSelector from './components/ModeSelector';
import RhythmLibrary from './components/RhythmLibrary';
import PracticeMode from './components/PracticeMode';
import SessionsGallery from './components/SessionsGallery';
import SessionBuilder from './components/SessionBuilder';
import AdvancedPracticeMode from './components/AdvancedPracticeMode';
import { rhythmLibrary } from './utils/rhythmEngine';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentMode, setCurrentMode] = useState('selection'); // 'selection', 'simple', 'advanced'
  const [currentView, setCurrentView] = useState('home'); // 'home', 'practice', 'editor'
  const [results, setResults] = useState(null);
  const [selectedRhythmIndex, setSelectedRhythmIndex] = useState(0);
  const [advancedSession, setAdvancedSession] = useState(null);

  const handleLogin = (name) => {
    setUsername(name);
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

  const handleSelectRhythm = (index) => {
    setSelectedRhythmIndex(index);
  };

  const handleStartPractice = (index) => {
    setSelectedRhythmIndex(index);
    setCurrentView('practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExitPractice = () => {
    setCurrentView('home');
    setResults(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLibraryPractice = (rhythmOrIndex) => {
    let selectedRhythm;
    let nextRhythm1, nextRhythm2;

    if (typeof rhythmOrIndex === 'number') {
      selectedRhythm = rhythmLibrary[rhythmOrIndex];
      nextRhythm1 = rhythmLibrary[(rhythmOrIndex + 1) % rhythmLibrary.length];
      nextRhythm2 = rhythmLibrary[(rhythmOrIndex + 2) % rhythmLibrary.length];
    } else {
      selectedRhythm = rhythmOrIndex;
      // For custom rhythms, just pick first two from library as alternatives
      nextRhythm1 = rhythmLibrary[0];
      nextRhythm2 = rhythmLibrary[1];
    }

    const mockResults = {
      songName: selectedRhythm.name,
      estimatedBPM: Math.floor((selectedRhythm.bpm[0] + selectedRhythm.bpm[1]) / 2),
      rhythms: [
        selectedRhythm,
        nextRhythm1,
        nextRhythm2
      ]
    };
    setResults(mockResults);
    setSelectedRhythmIndex(0);
    setCurrentView('practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectMode = (mode) => {
    setCurrentMode(mode);
    setCurrentView('home');
  };

  const handleBackToModes = () => {
    setCurrentMode('selection');
    setCurrentView('home');
    setResults(null);
    setAdvancedSession(null);
  };

  // Advanced mode handlers
  const handleSelectSession = (session, action = 'edit') => {
    setAdvancedSession(session);
    if (action === 'play') {
      setCurrentView('practice');
    } else {
      setCurrentView('editor');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewSession = (session) => {
    setAdvancedSession(session);
    setCurrentView('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToGallery = () => {
    setCurrentView('home');
    setAdvancedSession(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app">
      {/* Animated background */}
      <div className="strum-background">
        <div className="strum-icon">↓</div>
        <div className="strum-icon">↑</div>
        <div className="strum-icon">↓</div>
        <div className="strum-icon">↑</div>
        <div className="strum-icon">↓</div>
        <div className="strum-icon">↑</div>
      </div>

      {/* Header */}
      <header>
        <div className="container">
          <div className="header-content">
            <div className="logo">StrumFlow</div>
            <div className="header-right">
              {isLoggedIn ? (
                <div className="user-profile">
                  <span className="user-name">👋 {username}</span>
                  <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
              ) : (
                <button className="login-btn" onClick={() => setShowLoginModal(true)}>
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Login Modal */}
      {showLoginModal && (
        <Login onLogin={handleLogin} onClose={() => setShowLoginModal(false)} />
      )}

      {/* Main Content */}
      {currentMode === 'selection' ? (
        <ModeSelector onSelectMode={handleSelectMode} />
      ) : currentMode === 'simple' ? (
        <>
          {currentView === 'practice' ? (
            <PracticeMode
              results={results}
              selectedRhythmIndex={selectedRhythmIndex}
              onExit={handleExitPractice}
            />
          ) : (
            <RhythmLibrary
              rhythms={rhythmLibrary}
              onStartPractice={handleLibraryPractice}
              onBackToModes={handleBackToModes}
            />
          )}
        </>
      ) : currentMode === 'advanced' ? (
        <>
          {currentView === 'practice' && advancedSession ? (
            <AdvancedPracticeMode
              session={advancedSession}
              onExit={handleBackToGallery}
            />
          ) : currentView === 'editor' && advancedSession ? (
            <SessionBuilder
              initialSession={advancedSession}
              onBackToModes={handleBackToGallery}
              onStartPractice={(session) => {
                setAdvancedSession(session);
                setCurrentView('practice');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : (
            <SessionsGallery
              onBackToModes={handleBackToModes}
              onSelectSession={handleSelectSession}
              onNewSession={handleNewSession}
            />
          )}
        </>
      ) : null}
    </div>
  );
}

export default App;
