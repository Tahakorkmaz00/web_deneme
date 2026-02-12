import { useState, useEffect } from 'react';
import Login from './components/Login';
import HomeScreen from './components/HomeScreen';
import Education from './components/Education';
import ArticleView from './components/ArticleView';
import Library from './components/Library';
import CreateRhythm from './components/CreateRhythm';
import CreateArticle from './components/CreateArticle';
import RhythmDetail from './components/RhythmDetail';
import Exercise from './components/Exercise';
import ChordLibrary from './components/ChordLibrary';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [pageData, setPageData] = useState({});
  const [exerciseRhythm, setExerciseRhythm] = useState(null);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('strumflow_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('strumflow_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLogin = (name) => {
    setUsername(name);
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

  const navigateTo = (page, data = {}) => {
    setCurrentPage(page);
    setPageData(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goHome = () => {
    setCurrentPage('home');
    setPageData({});
    setExerciseRhythm(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomeScreen onNavigate={navigateTo} />;

      case 'education':
        return (
          <Education
            onNavigate={navigateTo}
            onBack={goHome}
          />
        );

      case 'article-view':
        return (
          <ArticleView
            articleId={pageData.articleId}
            isLoggedIn={isLoggedIn}
            username={username}
            onBack={() => navigateTo('education')}
            onRequestLogin={() => setShowLoginModal(true)}
            onNavigate={navigateTo}
          />
        );

      case 'chords':
        return <ChordLibrary onBack={goHome} />;

      case 'create-article':
        return (
          <CreateArticle
            username={username}
            onBack={() => navigateTo('education')}
            onCreated={(article) => navigateTo('article-view', { articleId: article.id })}
          />
        );

      case 'edit-article':
        return (
          <CreateArticle
            username={username}
            onBack={() => navigateTo('article-view', { articleId: pageData.article.id })}
            onCreated={(updatedArticle) => navigateTo('article-view', { articleId: updatedArticle.id })}
            initialData={pageData.article}
          />
        );

      case 'library':
        return (
          <Library
            onNavigate={navigateTo}
            onBack={goHome}
            isLoggedIn={isLoggedIn}
            onRequestLogin={() => setShowLoginModal(true)}
          />
        );

      case 'create':
        return (
          <CreateRhythm
            username={username}
            onBack={() => navigateTo('library')}
            onCreated={(rhythm) => navigateTo('rhythm-detail', { rhythmId: rhythm.id })}
          />
        );

      case 'rhythm-detail':
        return (
          <RhythmDetail
            rhythmId={pageData.rhythmId}
            username={username}
            onBack={() => navigateTo('library')}
            onExercise={(rhythm) => {
              setExerciseRhythm(rhythm);
              navigateTo('exercise');
            }}
            onDeleted={() => navigateTo('library')}
          />
        );

      case 'exercise':
        return exerciseRhythm ? (
          <Exercise
            rhythm={exerciseRhythm}
            onBack={() => navigateTo('rhythm-detail', { rhythmId: exerciseRhythm.id })}
          />
        ) : null;

      default:
        return <HomeScreen onNavigate={navigateTo} />;
    }
  };

  const getBackHandler = () => {
    switch (currentPage) {
      case 'education':
      case 'chords':
      case 'library':
        return goHome;
      case 'article-view':
      case 'create-article':
        return () => navigateTo('education');
      case 'edit-article':
        return () => navigateTo('article-view', { articleId: pageData.article?.id });
      case 'create':
      case 'rhythm-detail':
        return () => navigateTo('library');
      case 'exercise':
        return () => navigateTo('rhythm-detail', { rhythmId: exerciseRhythm?.id });
      default:
        return null;
    }
  };

  const backAction = getBackHandler();

  return (
    <div className="app">
      {/* Animated background */}
      <div className="bg-particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      {/* Header */}
      <header>
        <div className="container">
          <div className="header-content">
            <div className="logo" onClick={goHome}>StrumFlow</div>
            <div className="header-right">
              {currentPage !== 'home' && (
                <button className="nav-home-btn" onClick={goHome}>
                  🏠 Ana Sayfa
                </button>
              )}
              <button
                className="theme-toggle"
                onClick={toggleTheme}
                title={theme === 'dark' ? 'Aydınlık Mod' : 'Karanlık Mod'}
              >
                <span className="theme-icon">
                  {theme === 'dark' ? '☀️' : '🌙'}
                </span>
              </button>
              {isLoggedIn ? (
                <div className="user-profile">
                  <span className="user-name">{username}</span>
                  <button className="logout-btn" onClick={handleLogout}>Çıkış</button>
                </div>
              ) : (
                <button className="login-btn" onClick={() => setShowLoginModal(true)}>
                  Giriş Yap
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
      <div key={currentPage} className="page-enter">
        {renderPage()}
      </div>

      {/* Global Sticky Back Button */}
      {backAction && (
        <button className="sticky-back-btn" onClick={backAction}>
          ← Geri Dön
        </button>
      )}
    </div>
  );
}

export default App;
