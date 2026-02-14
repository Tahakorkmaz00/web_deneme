import { useState, useEffect, useRef } from 'react';
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

function ForumIllustration() {
    return (
        <svg viewBox="0 0 400 320" fill="none" className="feature-illustration">
            {/* Speech bubbles */}
            <rect x="60" y="40" width="180" height="100" rx="16" fill="var(--accent-amber)" fillOpacity="0.1" stroke="var(--accent-amber)" strokeWidth="1.5" strokeOpacity="0.3" />
            <rect x="80" y="65" width="100" height="8" rx="4" fill="var(--accent-amber)" fillOpacity="0.25" />
            <rect x="80" y="85" width="140" height="8" rx="4" fill="var(--accent-amber)" fillOpacity="0.15" />
            <rect x="80" y="105" width="80" height="8" rx="4" fill="var(--accent-amber)" fillOpacity="0.2" />
            {/* Second bubble */}
            <rect x="160" y="170" width="180" height="90" rx="16" fill="var(--accent-sage)" fillOpacity="0.1" stroke="var(--accent-sage)" strokeWidth="1.5" strokeOpacity="0.3" />
            <rect x="180" y="195" width="120" height="8" rx="4" fill="var(--accent-sage)" fillOpacity="0.25" />
            <rect x="180" y="215" width="90" height="8" rx="4" fill="var(--accent-sage)" fillOpacity="0.15" />
            {/* Guitar pick */}
            <path d="M40 220 L60 280 L20 280 Z" fill="var(--accent-amber)" fillOpacity="0.15" stroke="var(--accent-amber)" strokeWidth="1.5" strokeOpacity="0.4" strokeLinejoin="round" />
            {/* Connection dots */}
            <circle cx="150" cy="155" r="4" fill="var(--accent-amber)" fillOpacity="0.4" />
            <circle cx="170" cy="165" r="3" fill="var(--accent-sage)" fillOpacity="0.4" />
            {/* Floating music notes */}
            <text x="310" y="60" fontSize="24" fill="var(--accent-amber)" fillOpacity="0.2" fontFamily="serif">&#9835;</text>
            <text x="350" y="120" fontSize="18" fill="var(--accent-sage)" fillOpacity="0.15" fontFamily="serif">&#9834;</text>
        </svg>
    );
}

function RhythmIllustration() {
    return (
        <svg viewBox="0 0 400 320" fill="none" className="feature-illustration">
            {/* Metronome body */}
            <path d="M180 280 L220 280 L210 80 L190 80 Z" fill="var(--accent-sage)" fillOpacity="0.08" stroke="var(--accent-sage)" strokeWidth="1.5" strokeOpacity="0.3" />
            {/* Metronome pendulum */}
            <line x1="200" y1="260" x2="160" y2="100" stroke="var(--accent-sage)" strokeWidth="2" strokeOpacity="0.4" strokeLinecap="round" />
            <circle cx="160" cy="100" r="8" fill="var(--accent-sage)" fillOpacity="0.3" stroke="var(--accent-sage)" strokeWidth="1.5" strokeOpacity="0.4" />
            {/* Base */}
            <rect x="160" y="275" width="80" height="12" rx="4" fill="var(--accent-sage)" fillOpacity="0.15" stroke="var(--accent-sage)" strokeWidth="1" strokeOpacity="0.2" />
            {/* Waveform lines */}
            <g opacity="0.35">
                <rect x="260" y="140" width="3" height="40" rx="1.5" fill="var(--accent-sage)" />
                <rect x="272" y="120" width="3" height="80" rx="1.5" fill="var(--accent-sage)" />
                <rect x="284" y="150" width="3" height="30" rx="1.5" fill="var(--accent-sage)" />
                <rect x="296" y="130" width="3" height="60" rx="1.5" fill="var(--accent-sage)" />
                <rect x="308" y="145" width="3" height="35" rx="1.5" fill="var(--accent-sage)" />
                <rect x="320" y="125" width="3" height="70" rx="1.5" fill="var(--accent-sage)" />
                <rect x="332" y="140" width="3" height="40" rx="1.5" fill="var(--accent-sage)" />
                <rect x="344" y="155" width="3" height="20" rx="1.5" fill="var(--accent-sage)" />
            </g>
            {/* BPM indicator */}
            <rect x="60" y="130" width="70" height="36" rx="8" fill="var(--accent-sage)" fillOpacity="0.08" stroke="var(--accent-sage)" strokeWidth="1" strokeOpacity="0.25" />
            <text x="95" y="153" textAnchor="middle" fontSize="14" fill="var(--accent-sage)" fillOpacity="0.5" fontFamily="Space Grotesk, sans-serif" fontWeight="600">BPM</text>
            {/* Tempo dots */}
            <circle cx="75" cy="200" r="4" fill="var(--accent-amber)" fillOpacity="0.3" />
            <circle cx="95" cy="200" r="4" fill="var(--accent-sage)" fillOpacity="0.5" />
            <circle cx="115" cy="200" r="4" fill="var(--accent-amber)" fillOpacity="0.3" />
            <circle cx="135" cy="200" r="4" fill="var(--accent-sage)" fillOpacity="0.5" />
        </svg>
    );
}

function ChordsIllustration() {
    return (
        <svg viewBox="0 0 400 320" fill="none" className="feature-illustration">
            {/* Chord diagram - fretboard */}
            <rect x="120" y="40" width="160" height="240" rx="8" fill="var(--accent-rose)" fillOpacity="0.05" stroke="var(--accent-rose)" strokeWidth="1.5" strokeOpacity="0.2" />
            {/* Strings (6 vertical lines) */}
            {[0, 1, 2, 3, 4, 5].map(i => (
                <line key={`s${i}`} x1={140 + i * 24} y1="60" x2={140 + i * 24} y2="260" stroke="var(--accent-rose)" strokeWidth={0.8 + i * 0.15} strokeOpacity="0.2" />
            ))}
            {/* Frets (horizontal lines) */}
            {[0, 1, 2, 3, 4].map(i => (
                <line key={`f${i}`} x1="130" y1={80 + i * 45} x2="270" y2={80 + i * 45} stroke="var(--accent-rose)" strokeWidth="1" strokeOpacity="0.15" />
            ))}
            {/* Finger positions (Am chord) */}
            <circle cx="164" cy="102" r="10" fill="var(--accent-rose)" fillOpacity="0.4" stroke="var(--accent-rose)" strokeWidth="1.5" strokeOpacity="0.5" />
            <circle cx="212" cy="147" r="10" fill="var(--accent-rose)" fillOpacity="0.4" stroke="var(--accent-rose)" strokeWidth="1.5" strokeOpacity="0.5" />
            <circle cx="236" cy="147" r="10" fill="var(--accent-rose)" fillOpacity="0.4" stroke="var(--accent-rose)" strokeWidth="1.5" strokeOpacity="0.5" />
            {/* Open string indicators */}
            <circle cx="140" cy="50" r="5" stroke="var(--accent-rose)" strokeWidth="1" strokeOpacity="0.3" fill="none" />
            <circle cx="188" cy="50" r="5" stroke="var(--accent-rose)" strokeWidth="1" strokeOpacity="0.3" fill="none" />
            {/* X for muted string */}
            <text x="256" y="55" textAnchor="middle" fontSize="14" fill="var(--accent-rose)" fillOpacity="0.3" fontWeight="bold">x</text>
            {/* Chord name label */}
            <rect x="300" y="80" width="60" height="32" rx="8" fill="var(--accent-rose)" fillOpacity="0.1" stroke="var(--accent-rose)" strokeWidth="1" strokeOpacity="0.25" />
            <text x="330" y="101" textAnchor="middle" fontSize="16" fill="var(--accent-rose)" fillOpacity="0.6" fontFamily="Syne, sans-serif" fontWeight="700">Am</text>
            {/* More chord labels */}
            <rect x="300" y="130" width="60" height="32" rx="8" fill="var(--accent-amber)" fillOpacity="0.08" stroke="var(--accent-amber)" strokeWidth="1" strokeOpacity="0.2" />
            <text x="330" y="151" textAnchor="middle" fontSize="16" fill="var(--accent-amber)" fillOpacity="0.4" fontFamily="Syne, sans-serif" fontWeight="700">G</text>
            <rect x="300" y="180" width="60" height="32" rx="8" fill="var(--accent-sage)" fillOpacity="0.08" stroke="var(--accent-sage)" strokeWidth="1" strokeOpacity="0.2" />
            <text x="330" y="201" textAnchor="middle" fontSize="16" fill="var(--accent-sage)" fillOpacity="0.4" fontFamily="Syne, sans-serif" fontWeight="700">E</text>
        </svg>
    );
}

function HeroIllustration() {
    return (
        <svg viewBox="0 0 600 200" fill="none" className="hero-illustration">
            {/* Sound waves radiating outward */}
            <path d="M300 100 Q 250 60, 200 100 Q 250 140, 300 100" stroke="var(--accent-amber)" strokeWidth="1" strokeOpacity="0.15" fill="none" />
            <path d="M300 100 Q 230 40, 160 100 Q 230 160, 300 100" stroke="var(--accent-amber)" strokeWidth="1" strokeOpacity="0.12" fill="none" />
            <path d="M300 100 Q 210 20, 120 100 Q 210 180, 300 100" stroke="var(--accent-amber)" strokeWidth="1" strokeOpacity="0.08" fill="none" />
            <path d="M300 100 Q 350 60, 400 100 Q 350 140, 300 100" stroke="var(--accent-sage)" strokeWidth="1" strokeOpacity="0.15" fill="none" />
            <path d="M300 100 Q 370 40, 440 100 Q 370 160, 300 100" stroke="var(--accent-sage)" strokeWidth="1" strokeOpacity="0.12" fill="none" />
            <path d="M300 100 Q 390 20, 480 100 Q 390 180, 300 100" stroke="var(--accent-sage)" strokeWidth="1" strokeOpacity="0.08" fill="none" />
            {/* Center circle — sound hole */}
            <circle cx="300" cy="100" r="20" stroke="var(--accent-amber)" strokeWidth="1.5" strokeOpacity="0.25" fill="var(--accent-amber)" fillOpacity="0.05" />
            <circle cx="300" cy="100" r="8" fill="var(--accent-amber)" fillOpacity="0.15" />
        </svg>
    );
}

export default function HomeScreen({ onNavigate }) {
    const [loaded, setLoaded] = useState(false);
    const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    const sectionRefs = useRef([]);

    useEffect(() => {
        setTimeout(() => setLoaded(true), 80);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
        );

        sectionRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);

    const addRef = (el) => {
        if (el && !sectionRefs.current.includes(el)) {
            sectionRefs.current.push(el);
        }
    };

    return (
        <section className="home-screen">
            {/* Background strings */}
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

                    <HeroIllustration />

                    <div className="string-divider">
                        <span className="divider-wire"></span>
                        <span className="divider-node"></span>
                        <span className="divider-wire"></span>
                    </div>

                    <div className="hero-quote">
                        <p className="quote-text">{quote.text}</p>
                        <span className="quote-author">{quote.author}</span>
                    </div>
                </div>

                {/* Feature Section 1 — Forum */}
                <div className="feature-section" ref={addRef}>
                    <div className="feature-content">
                        <span className="feature-tag amber">Topluluk</span>
                        <h2 className="feature-title">Forum</h2>
                        <p className="feature-desc">
                            Kesme, susturma, rasguido ve daha fazlasi... Gitar teknikleri hakkinda detayli makaleler oku, kendi deneyimlerini paylas.
                        </p>
                        <ul className="feature-bullets">
                            <li>Teknik makaleler ve rehberler</li>
                            <li>Topluluk tartismalari</li>
                            <li>Deneyimlerini paylas</li>
                        </ul>
                        <button className="feature-cta amber" onClick={() => onNavigate('education')}>
                            Forumu Kesfet <span className="cta-arrow">&rarr;</span>
                        </button>
                    </div>
                    <div className="feature-illust-wrap amber-glow">
                        <ForumIllustration />
                    </div>
                </div>

                {/* Feature Section 2 — Ritimler (reversed) */}
                <div className="feature-section reversed" ref={addRef}>
                    <div className="feature-content">
                        <span className="feature-tag sage">Pratik</span>
                        <h2 className="feature-title">Ritimler</h2>
                        <p className="feature-desc">
                            Kendi ritimlerini olustur, akorlarini ekle ve gelismis metronom ile pratik yap. Paylas ve topluluktan geri bildirim al.
                        </p>
                        <ul className="feature-bullets">
                            <li>Ritim olusturucu</li>
                            <li>Gelismis metronom</li>
                            <li>Akor progresyonlari</li>
                        </ul>
                        <button className="feature-cta sage" onClick={() => onNavigate('library')}>
                            Ritimlere Bak <span className="cta-arrow">&rarr;</span>
                        </button>
                    </div>
                    <div className="feature-illust-wrap sage-glow">
                        <RhythmIllustration />
                    </div>
                </div>

                {/* Feature Section 3 — Akorlar */}
                <div className="feature-section" ref={addRef}>
                    <div className="feature-content">
                        <span className="feature-tag rose">Ogren</span>
                        <h2 className="feature-title">Akorlar</h2>
                        <p className="feature-desc">
                            Am, E, G ve daha fazlasi... Gorsel akor semalari ile tum akorlari kesfet, parmak pozisyonlarini ogren.
                        </p>
                        <ul className="feature-bullets">
                            <li>Gorsel akor semalari</li>
                            <li>Seviyeye gore filtreleme</li>
                            <li>Detayli parmak rehberi</li>
                        </ul>
                        <button className="feature-cta rose" onClick={() => onNavigate('chords')}>
                            Akorlari Incele <span className="cta-arrow">&rarr;</span>
                        </button>
                    </div>
                    <div className="feature-illust-wrap rose-glow">
                        <ChordsIllustration />
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="stats-bar" ref={addRef}>
                    <div className="stat-item">
                        <span className="stat-number">50+</span>
                        <span className="stat-label">Akor</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <span className="stat-number">&infin;</span>
                        <span className="stat-label">Ritim</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <span className="stat-number">&#9834;</span>
                        <span className="stat-label">Topluluk Forumu</span>
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
