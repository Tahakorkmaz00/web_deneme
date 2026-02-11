import { useState } from 'react';
import './HomeScreen.css';

export default function HomeScreen({ onNavigate }) {
    const [hoveredCard, setHoveredCard] = useState(null);

    return (
        <section className="home-screen">
            {/* Background Effects */}
            <div className="home-bg-glow glow-1"></div>
            <div className="home-bg-glow glow-2"></div>

            <div className="home-container">
                {/* Hero */}
                <div className="home-hero">
                    <div className="hero-logo-ring">
                        <div className="ring ring-outer"></div>
                        <div className="ring ring-inner"></div>
                        <span className="hero-guitar-icon">🎸</span>
                    </div>
                    <h1 className="home-title" data-text="StrumFlow">StrumFlow</h1>
                    <p className="home-subtitle">
                        Gitar tekniklerini öğren, ritimlerini paylaş, birlikte çal.
                    </p>
                </div>

                {/* Cards */}
                <div className="home-cards">
                    {/* Eğitim Card */}
                    <div
                        className={`home-card education-card ${hoveredCard === 'education' ? 'hovered' : ''}`}
                        onClick={() => onNavigate('education')}
                        onMouseEnter={() => setHoveredCard('education')}
                        onMouseLeave={() => setHoveredCard(null)}
                    >
                        <div className="card-glow education-glow"></div>
                        <div className="card-body">
                            <div className="card-icon-wrapper">
                                <span className="card-icon">📚</span>
                                <div className="icon-pulse"></div>
                            </div>
                            <h2>Eğitim</h2>
                            <p>Kesme, susturma, rasguido gibi teknikleri detaylı makalelerle öğren. Topluluğa katıl ve deneyimlerini paylaş.</p>
                            <div className="card-tags">
                                <span className="tag">🤚 Kesme</span>
                                <span className="tag">🔇 Susturma</span>
                                <span className="tag">💃 Rasguido</span>
                            </div>
                            <div className="card-cta">
                                <span>Keşfet</span>
                                <span className="cta-arrow">→</span>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="cards-separator">
                        <div className="separator-line"></div>
                        <span className="separator-icon">♫</span>
                        <div className="separator-line"></div>
                    </div>

                    {/* Kütüphane Card */}
                    <div
                        className={`home-card library-card ${hoveredCard === 'library' ? 'hovered' : ''}`}
                        onClick={() => onNavigate('library')}
                        onMouseEnter={() => setHoveredCard('library')}
                        onMouseLeave={() => setHoveredCard(null)}
                    >
                        <div className="card-glow library-glow"></div>
                        <div className="card-body">
                            <div className="card-icon-wrapper">
                                <span className="card-icon">🎸</span>
                                <div className="icon-pulse green"></div>
                            </div>
                            <h2>Kütüphane</h2>
                            <p>Kendi ritimlerini oluştur, akorlarını ekle ve gelişmiş metronom ile pratik yap. Ritimlerini herkesle paylaş.</p>
                            <div className="card-tags">
                                <span className="tag green">🎵 Ritim Oluştur</span>
                                <span className="tag green">🥁 Metronom</span>
                                <span className="tag green">🌍 Paylaş</span>
                            </div>
                            <div className="card-cta green">
                                <span>Başla</span>
                                <span className="cta-arrow">→</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
