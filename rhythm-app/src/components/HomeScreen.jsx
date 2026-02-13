import { useState, useEffect } from 'react';
import './HomeScreen.css';

const QUOTES = [
    { text: "Muzik, kelimelerin bittigi yerde baslar.", author: "Hans Christian Andersen" },
    { text: "Gitar benim icin ikinci bir ses gibi.", author: "B.B. King" },
    { text: "Her gun pratik yap, bir gun ustalasirsin.", author: "Jimi Hendrix" },
    { text: "Muzik evrensel bir dildir.", author: "Henry Wadsworth Longfellow" },
    { text: "Bir gitar tum bir orkestranin yerine gecer.", author: "Beethoven" },
    { text: "Basit cal ama kalpten cal.", author: "Eric Clapton" },
    { text: "Muzik ruhun gidasidir.", author: "Platon" },
    { text: "Hata yapmaktan korkma, calmaktan korkma.", author: "Miles Davis" },
];

export default function HomeScreen({ onNavigate }) {
    const [hoveredCard, setHoveredCard] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);

    useEffect(() => {
        setTimeout(() => setLoaded(true), 80);
    }, []);

    return (
        <section className="home-screen">
            {/* Rosette — sound hole pattern */}
            <div className="home-rosette">
                <div className="rosette-ring r1"></div>
                <div className="rosette-ring r2"></div>
                <div className="rosette-ring r3"></div>
                <div className="rosette-ring r4"></div>
                <div className="rosette-dots">
                    {Array.from({ length: 24 }).map((_, i) => (
                        <div key={i} className="rosette-dot" style={{ '--dot-i': i }} />
                    ))}
                </div>
            </div>

            {/* Horizontal strings — six lines across the viewport */}
            <div className="home-strings-bg">
                {[0, 1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="bg-string" style={{ '--s-i': i }} />
                ))}
            </div>

            <div className={`home-container ${loaded ? 'loaded' : ''}`}>
                {/* Hero */}
                <div className="home-hero">
                    <div className="hero-label">Gitar Toplulugu & Ritim Kutuphanesi</div>
                    <h1 className="home-title">StrumFlow</h1>
                    <p className="home-subtitle">
                        Gitar tekniklerini ogren, ritimlerini paylas, birlikte cal
                    </p>

                    {/* String divider */}
                    <div className="string-divider">
                        <span className="divider-wire"></span>
                        <span className="divider-node"></span>
                        <span className="divider-wire"></span>
                    </div>

                    {/* Quote */}
                    <div className="hero-quote">
                        <p className="quote-text">{quote.text}</p>
                        <span className="quote-author">{quote.author}</span>
                    </div>
                </div>

                {/* Navigation Cards — editorial stagger */}
                <div className="home-cards">
                    <div
                        className={`home-card ${hoveredCard === 'edu' ? 'hovered' : ''}`}
                        onClick={() => onNavigate('education')}
                        onMouseEnter={() => setHoveredCard('edu')}
                        onMouseLeave={() => setHoveredCard(null)}
                        style={{ '--card-delay': '0.15s', '--card-accent': 'var(--accent-amber)' }}
                    >
                        <div className="card-index">01</div>
                        <div className="card-body">
                            <h2>Forum</h2>
                            <p>Kesme, susturma, rasguido gibi teknikleri detayli makalelerle ogren. Topluluga katil ve deneyimlerini paylas.</p>
                            <div className="card-tags">
                                <span className="tag">Kesme</span>
                                <span className="tag">Susturma</span>
                                <span className="tag">Rasguido</span>
                            </div>
                            <div className="card-cta">
                                <span>Kesfet</span>
                                <span className="cta-arrow">&rarr;</span>
                            </div>
                        </div>
                        <div className="card-string"></div>
                    </div>

                    <div
                        className={`home-card ${hoveredCard === 'lib' ? 'hovered' : ''}`}
                        onClick={() => onNavigate('library')}
                        onMouseEnter={() => setHoveredCard('lib')}
                        onMouseLeave={() => setHoveredCard(null)}
                        style={{ '--card-delay': '0.3s', '--card-accent': 'var(--accent-sage)' }}
                    >
                        <div className="card-index">02</div>
                        <div className="card-body">
                            <h2>Ritimler</h2>
                            <p>Kendi ritimlerini olustur, akorlarini ekle ve gelismis metronom ile pratik yap.</p>
                            <div className="card-tags">
                                <span className="tag">Olustur</span>
                                <span className="tag">Metronom</span>
                            </div>
                            <div className="card-cta">
                                <span>Basla</span>
                                <span className="cta-arrow">&rarr;</span>
                            </div>
                        </div>
                        <div className="card-string"></div>
                    </div>

                    <div
                        className={`home-card ${hoveredCard === 'chords' ? 'hovered' : ''}`}
                        onClick={() => onNavigate('chords')}
                        onMouseEnter={() => setHoveredCard('chords')}
                        onMouseLeave={() => setHoveredCard(null)}
                        style={{ '--card-delay': '0.45s', '--card-accent': 'var(--accent-rose)' }}
                    >
                        <div className="card-index">03</div>
                        <div className="card-body">
                            <h2>Akorlar</h2>
                            <p>Am, E, G ve daha fazlasi... Gorsel semalarla tum akorlari kesfet ve ogren.</p>
                            <div className="card-tags">
                                <span className="tag">Gorsel</span>
                                <span className="tag">Arama</span>
                            </div>
                            <div className="card-cta">
                                <span>Incele</span>
                                <span className="cta-arrow">&rarr;</span>
                            </div>
                        </div>
                        <div className="card-string"></div>
                    </div>
                </div>

                {/* Footer */}
                <div className="home-footer">
                    <span className="footer-wire"></span>
                    <span className="footer-text">Muzik bir yolculuktur</span>
                    <span className="footer-wire"></span>
                </div>
            </div>
        </section>
    );
}
