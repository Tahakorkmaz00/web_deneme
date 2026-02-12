import { useState, useEffect } from 'react';
import './HomeScreen.css';

const QUOTES = [
    { text: "Müzik, kelimelerin bittiği yerde başlar.", author: "Hans Christian Andersen" },
    { text: "Gitar benim için ikinci bir ses gibi.", author: "B.B. King" },
    { text: "Her gün pratik yap, bir gün ustalaşırsın.", author: "Jimi Hendrix" },
    { text: "Müzik evrensel bir dildir.", author: "Henry Wadsworth Longfellow" },
    { text: "Bir gitar tüm bir orkestranın yerine geçer.", author: "Beethoven" },
    { text: "Basit çal ama kalpten çal.", author: "Eric Clapton" },
    { text: "Müzik ruhun gıdasıdır.", author: "Platon" },
    { text: "Hata yapmaktan korkma, çalmaktan korkma.", author: "Miles Davis" },
];

export default function HomeScreen({ onNavigate }) {
    const [hoveredCard, setHoveredCard] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [activeString, setActiveString] = useState(-1);
    const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);

    useEffect(() => {
        setTimeout(() => setLoaded(true), 100);
        for (let i = 0; i < 6; i++) {
            setTimeout(() => setActiveString(i), 400 + i * 120);
        }
    }, []);

    const notes = ['♪', '♫', '♬', '♩', '🎵', '🎶', '♪', '♫'];

    return (
        <section className="home-screen">
            {/* Floating Music Notes */}
            <div className="home-floating-notes">
                {notes.map((note, i) => (
                    <span key={i} className="home-note" style={{
                        '--n-delay': `${i * 2.2}s`,
                        '--n-left': `${5 + i * 12}%`,
                        '--n-end': `${10 + i * 10}%`,
                        '--n-dur': `${6 + i * 0.8}s`,
                    }}>{note}</span>
                ))}
            </div>

            {/* Glow Orbs */}
            <div className="home-orb orb-orange"></div>
            <div className="home-orb orb-green"></div>
            <div className="home-orb orb-pink"></div>

            <div className={`home-container ${loaded ? 'loaded' : ''}`}>
                {/* Hero Section */}
                <div className="home-hero">
                    {/* Guitar Neck */}
                    <div className="hero-guitar">
                        <div className="hero-guitar-neck">
                            <div className="hero-fret-dots">
                                <div className="hero-dot"></div>
                                <div className="hero-dot"></div>
                                <div className="hero-dot double-dot">
                                    <span></span><span></span>
                                </div>
                            </div>
                            <div className="hero-strings">
                                {[0, 1, 2, 3, 4, 5].map((i) => (
                                    <div
                                        key={i}
                                        className={`hero-string ${activeString >= i ? 'plucked' : ''}`}
                                        style={{
                                            '--si': i,
                                            '--thickness': `${1 + i * 0.5}px`,
                                            '--scolor': ['#f0dfc0', '#e8d1a8', '#dcc090', '#c9a868', '#b89050', '#a07030'][i],
                                        }}
                                    />
                                ))}
                            </div>
                            <div className="hero-frets">
                                {[0, 1, 2, 3, 4].map((i) => (
                                    <div key={i} className="hero-fret" />
                                ))}
                            </div>
                        </div>

                        {/* Sound Waves */}
                        <div className="hero-waves">
                            <div className="hero-wave w1"></div>
                            <div className="hero-wave w2"></div>
                            <div className="hero-wave w3"></div>
                        </div>

                        {/* Strum Icon */}
                        <div className="hero-strum-icon">
                            <span className="strum-emoji">🎸</span>
                            <div className="strum-ring r1"></div>
                            <div className="strum-ring r2"></div>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="hero-text">
                        <div className="title-glow">
                            <h1 className="home-title">StrumFlow</h1>
                        </div>
                        <p className="home-subtitle">
                            <span className="sub-line"></span>
                            Gitar tekniklerini öğren, ritimlerini paylaş, birlikte çal
                            <span className="sub-line"></span>
                        </p>
                    </div>

                    {/* Motivational Quote */}
                    <div className="hero-quote">
                        <p className="quote-text">"{quote.text}"</p>
                        <span className="quote-author">— {quote.author}</span>
                    </div>

                    {/* Stats */}
                    <div className="hero-stats">
                        {[
                            { value: '3+', label: 'Teknik Makale', icon: '📝' },
                            { value: '∞', label: 'Ritim Oluştur', icon: '🎵' },
                            { value: '🔥', label: 'Topluluk', icon: '' },
                        ].map((s, i) => (
                            <div key={i} className="stat-item" style={{ '--stat-delay': `${0.6 + i * 0.15}s` }}>
                                <span className="stat-value">{s.icon || s.value}</span>
                                <span className="stat-label">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Cards */}
                <div className="home-cards">
                    {/* Forum Card */}
                    <div
                        className={`home-card ${hoveredCard === 'edu' ? 'hovered' : ''}`}
                        onClick={() => onNavigate('education')}
                        onMouseEnter={() => setHoveredCard('edu')}
                        onMouseLeave={() => setHoveredCard(null)}
                        style={{ '--card-delay': '0.3s', '--card-color': 'var(--accent-orange)' }}
                    >
                        <div className="card-bg-pattern">
                            <svg viewBox="0 0 200 200" className="card-pattern-svg">
                                <circle cx="160" cy="40" r="80" fill="rgba(255,107,53,0.04)" />
                                <circle cx="180" cy="60" r="50" fill="rgba(255,107,53,0.03)" />
                            </svg>
                        </div>
                        <div className="card-accent-line"></div>
                        <div className="card-body">
                            <div className="card-icon-box">
                                <span className="card-icon">📚</span>
                                <div className="icon-ring"></div>
                            </div>
                            <div className="card-text">
                                <h2>Forum</h2>
                                <p>Kesme, susturma, rasguido gibi teknikleri detaylı makalelerle öğren. Topluluğa katıl ve deneyimlerini paylaş.</p>
                            </div>
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
                    <div className="cards-divider">
                        <div className="divider-line"></div>
                        <div className="divider-icon">
                            <span>♫</span>
                        </div>
                        <div className="divider-line"></div>
                    </div>

                    {/* Kütüphane Card */}
                    <div
                        className={`home-card ${hoveredCard === 'lib' ? 'hovered' : ''}`}
                        onClick={() => onNavigate('library')}
                        onMouseEnter={() => setHoveredCard('lib')}
                        onMouseLeave={() => setHoveredCard(null)}
                        style={{ '--card-delay': '0.5s', '--card-color': 'var(--accent-green)' }}
                    >
                        <div className="card-bg-pattern">
                            <svg viewBox="0 0 200 200" className="card-pattern-svg">
                                <circle cx="160" cy="40" r="80" fill="rgba(0,255,159,0.04)" />
                                <circle cx="180" cy="60" r="50" fill="rgba(0,255,159,0.03)" />
                            </svg>
                        </div>
                        <div className="card-accent-line"></div>
                        <div className="card-body">
                            <div className="card-icon-box">
                                <span className="card-icon">🎸</span>
                                <div className="icon-ring"></div>
                            </div>
                            <div className="card-text">
                                <h2>Ritimler</h2>
                                <p>Kendi ritimlerini oluştur, akorlarını ekle ve gelişmiş metronom ile pratik yap.</p>
                            </div>
                            <div className="card-tags">
                                <span className="tag">🎵 Oluştur</span>
                                <span className="tag">🥁 Metronom</span>
                            </div>
                            <div className="card-cta">
                                <span>Başla</span>
                                <span className="cta-arrow">→</span>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="cards-divider">
                        <div className="divider-line"></div>
                        <div className="divider-icon">
                            <span>🎼</span>
                        </div>
                        <div className="divider-line"></div>
                    </div>

                    {/* Akorlar Card */}
                    <div
                        className={`home-card ${hoveredCard === 'chords' ? 'hovered' : ''}`}
                        onClick={() => onNavigate('chords')}
                        onMouseEnter={() => setHoveredCard('chords')}
                        onMouseLeave={() => setHoveredCard(null)}
                        style={{ '--card-delay': '0.7s', '--card-color': '#6c5ce7' }}
                    >
                        <div className="card-bg-pattern">
                            <svg viewBox="0 0 200 200" className="card-pattern-svg">
                                <circle cx="160" cy="40" r="80" fill="rgba(108,92,231,0.04)" />
                                <circle cx="180" cy="60" r="50" fill="rgba(108,92,231,0.03)" />
                            </svg>
                        </div>
                        <div className="card-accent-line"></div>
                        <div className="card-body">
                            <div className="card-icon-box">
                                <span className="card-icon">🎹</span>
                                <div className="icon-ring"></div>
                            </div>
                            <div className="card-text">
                                <h2>Akorlar</h2>
                                <p>Am, E, G ve daha fazlası... Görsel şemalarla tüm akorları keşfet ve öğren.</p>
                            </div>
                            <div className="card-tags">
                                <span className="tag">👁️ Görsel</span>
                                <span className="tag">🔍 Arama</span>
                            </div>
                            <div className="card-cta">
                                <span>İncele</span>
                                <span className="cta-arrow">→</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="home-footer">
                    <span className="footer-note">🎼</span>
                    <span>Müzik bir yolculuktur — bugün başla</span>
                </div>
            </div>
        </section>
    );
}
