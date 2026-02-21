import { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
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
  const [user, setUser] = useState({ name: '', isAdmin: false, uid: null });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [pageData, setPageData] = useState({});
  const [exerciseRhythm, setExerciseRhythm] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('strumflow_theme') || 'dark';
  });

  // Firebase auth state listener - sayfa yenilendiginde oturum korunur
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Email'den kullanici adini cikar (xxx@strumflow.app -> xxx)
        const name = firebaseUser.email?.split('@')[0] || 'Kullanici';
        setUser({ name, isAdmin: false, uid: firebaseUser.uid });
        setIsLoggedIn(true);
        setShowLoginModal(false);
      } else {
        // Sadece Firebase oturumu kapandiysa sifirla
        // Admin girisi veya local giris durumunu korumak icin kontrol
        if (user.uid) {
          setIsLoggedIn(false);
          setUser({ name: '', isAdmin: false, uid: null });
        }
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('strumflow_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Admin girisi icin (logo 3x tiklama)
  const handleLogin = (name, isAdmin = false) => {
    setUser({ name, isAdmin, uid: null });
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch {
      // Firebase oturumu yoksa bile local state'i temizle
    }
    // Cikis yapinca kisisel verileri temizle
    localStorage.removeItem('strumflow_user_chords');
    localStorage.removeItem('strumflow_profile');
    window.dispatchEvent(new Event('chordsUpdated'));
    setIsLoggedIn(false);
    setUser({ name: '', isAdmin: false, uid: null });
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
            user={user}
            onBack={() => navigateTo('education')}
            onRequestLogin={() => setShowLoginModal(true)}
            onNavigate={navigateTo}
          />
        );

      case 'chords':
        return <ChordLibrary onBack={goHome} user={user} />;

      case 'create-article':
        return (
          <CreateArticle
            user={user}
            onBack={() => navigateTo('education')}
            onCreated={(article) => navigateTo('article-view', { articleId: article.id })}
          />
        );

      case 'edit-article':
        return (
          <CreateArticle
            user={user}
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
            user={user}
            onBack={() => navigateTo('library')}
            onCreated={(rhythm) => navigateTo('rhythm-detail', { rhythmId: rhythm.id })}
          />
        );

      case 'rhythm-detail':
        return (
          <RhythmDetail
            rhythmId={pageData.rhythmId}
            user={user}
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
            <div className="logo" onClick={goHome}>StrumFlow Lab</div>
            <nav className="header-nav">
              <button
                className={`header-nav-link${currentPage === 'education' || currentPage === 'article-view' || currentPage === 'create-article' || currentPage === 'edit-article' ? ' active' : ''}`}
                onClick={() => navigateTo('education')}
              >
                Forum
              </button>
              <button
                className={`header-nav-link${currentPage === 'library' || currentPage === 'create' || currentPage === 'rhythm-detail' || currentPage === 'exercise' ? ' active' : ''}`}
                onClick={() => navigateTo('library')}
              >
                Ritimler
              </button>
              <button
                className={`header-nav-link${currentPage === 'chords' ? ' active' : ''}`}
                onClick={() => navigateTo('chords')}
              >
                Akorlar
              </button>
            </nav>
            <div className="header-right">
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
                  <span className="user-name">
                    {user.isAdmin && <span className="admin-badge">ADMIN</span>}
                    {user.name}
                  </span>
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
