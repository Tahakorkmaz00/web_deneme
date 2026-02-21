import { useState, useEffect, useRef, useCallback } from 'react';
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

const PARTICLES = [
    { type: 'note', top: '10%', left: '6%', size: 30, dur: 7, del: 0 },
    { type: 'pick', top: '18%', right: '7%', size: 24, dur: 5.5, del: 1.2 },
    { type: 'note2', top: '45%', left: '4%', size: 22, dur: 6.5, del: 0.8 },
    { type: 'pick', top: '58%', right: '5%', size: 28, dur: 8, del: 2 },
    { type: 'note', top: '75%', left: '8%', size: 20, dur: 6, del: 1.5 },
    { type: 'note2', top: '82%', right: '6%', size: 26, dur: 7.5, del: 0.5 },
];

function FloatingParticles() {
    return (
        <div className="floating-particles">
            {PARTICLES.map((p, i) => (
                <div key={i} className="floating-particle" style={{
                    top: p.top, left: p.left, right: p.right,
                    '--f-size': `${p.size}px`, '--f-dur': `${p.dur}s`, '--f-del': `${p.del}s`,
                }}>
                    {p.type === 'note' && (
                        <svg viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--accent-amber)' }}>
                            <path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z" />
                        </svg>
                    )}
                    {p.type === 'note2' && (
                        <svg viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--accent-sage)' }}>
                            <path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z" />
                        </svg>
                    )}
                    {p.type === 'pick' && (
                        <svg viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--accent-rose)' }}>
                            <path d="M12 2C9.5 2 7 4 7 7c0 4 5 13 5 13s5-9 5-13c0-3-2.5-5-5-5z" />
                        </svg>
                    )}
                </div>
            ))}
        </div>
    );
}

function StaggeredTitle({ lines }) {
    let letterIndex = 0;
    return (
        <h1 className="home-title">
            {lines.map((line, lineIdx) => (
                <span key={lineIdx} className="title-line">
                    {line.split('').map((char, i) => {
                        const delay = 0.2 + letterIndex++ * 0.06;
                        return (
                            <span key={i} className="hero-letter"
                                style={{ '--letter-delay': `${delay}s` }}>
                                {char}
                            </span>
                        );
                    })}
                </span>
            ))}
        </h1>
    );
}

function useCountUp(target, duration = 1500) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const hasAnimated = useRef(false);

    const startCount = useCallback(() => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;
        const start = performance.now();
        const animate = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [target, duration]);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) startCount(); },
            { threshold: 0.5 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [startCount]);

    return { count, ref };
}

function ForumIllustration() {
    return (
        <svg viewBox="0 0 400 320" fill="none">
            <rect x="60" y="40" width="180" height="100" rx="16" fill="var(--accent-amber)" fillOpacity="0.1" stroke="var(--accent-amber)" strokeWidth="1.5" strokeOpacity="0.3" />
            <rect x="80" y="65" width="100" height="8" rx="4" fill="var(--accent-amber)" fillOpacity="0.25" />
            <rect x="80" y="85" width="140" height="8" rx="4" fill="var(--accent-amber)" fillOpacity="0.15" />
            <rect x="80" y="105" width="80" height="8" rx="4" fill="var(--accent-amber)" fillOpacity="0.2" />
            <rect x="160" y="170" width="180" height="90" rx="16" fill="var(--accent-sage)" fillOpacity="0.1" stroke="var(--accent-sage)" strokeWidth="1.5" strokeOpacity="0.3" />
            <rect x="180" y="195" width="120" height="8" rx="4" fill="var(--accent-sage)" fillOpacity="0.25" />
            <rect x="180" y="215" width="90" height="8" rx="4" fill="var(--accent-sage)" fillOpacity="0.15" />
            <circle cx="150" cy="155" r="4" fill="var(--accent-amber)" fillOpacity="0.4" />
            <circle cx="170" cy="165" r="3" fill="var(--accent-sage)" fillOpacity="0.4" />
            <text x="310" y="60" fontSize="24" fill="var(--accent-amber)" fillOpacity="0.3" fontFamily="serif">&#9835;</text>
            <text x="350" y="120" fontSize="18" fill="var(--accent-sage)" fillOpacity="0.2" fontFamily="serif">&#9834;</text>
        </svg>
    );
}

export default function HomeScreen({ onNavigate }) {
    const [loaded, setLoaded] = useState(false);
    const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    const cardRefs = useRef([]);
    const statsRef = useRef(null);

    const chordCount = useCountUp(50, 1400);

    useEffect(() => {
        setTimeout(() => setLoaded(true), 80);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) entry.target.classList.add('visible');
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
        );

        cardRefs.current.forEach((ref) => { if (ref) observer.observe(ref); });
        if (statsRef.current) observer.observe(statsRef.current);

        return () => observer.disconnect();
    }, []);

    const addCardRef = (el) => {
        if (el && !cardRefs.current.includes(el)) cardRefs.current.push(el);
    };

    return (
        <section className="home-screen">
            <div className="home-mesh-bg" />
            <FloatingParticles />

            <div className="home-strings-bg">
                {[0, 1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="bg-string" style={{ '--s-i': i }} />
                ))}
            </div>

            <div className={`home-container ${loaded ? 'loaded' : ''}`}>
                {/* ===== HERO ===== */}
                <div className="home-hero">
                    <div className="hero-rings">
                        <div className="hero-ring" />
                        <div className="hero-ring" />
                        <div className="hero-ring" />
                    </div>

                    <div className="hero-label">Gitar Toplulugu & Ritim Kutuphanesi</div>
                    <StaggeredTitle lines={["StrumFlow", "Lab"]} />
                    <p className="home-subtitle">
                        Gitar tekniklerini ogren, ritimlerini paylas, toplulukla birlikte gelis.
                    </p>

                    <div className="hero-cta-group">
                        <button className="hero-cta hero-cta-primary" onClick={() => onNavigate('library')}>
                            Kesfetmeye Basla
                        </button>
                        <button className="hero-cta hero-cta-secondary" onClick={() => onNavigate('chords')}>
                            Akorlari Gor
                        </button>
                    </div>

                    <div className="hero-quote">
                        <p className="quote-text">&ldquo;{quote.text}&rdquo;</p>
                        <span className="quote-author">&mdash; {quote.author}</span>
                    </div>

                    <div className="scroll-indicator">
                        <span>Kesfet</span>
                        <div className="scroll-line" />
                    </div>
                </div>

                {/* ===== FEATURE CARDS — Bento ===== */}
                <div className="features-section">
                    <div className="features-grid">
                        {/* Forum — wide card */}
                        <div className="feature-card card-amber card-wide"
                            ref={addCardRef}
                            style={{ '--slide-from': '-80px', '--card-delay': '0s' }}
                            onClick={() => onNavigate('education')}
                        >
                            <div>
                                <div className="card-icon amber-icon">&#9835;</div>
                                <span className="card-tag amber">Topluluk</span>
                                <h2 className="card-title">Forum</h2>
                                <p className="card-desc">
                                    Kesme, susturma, rasguido ve daha fazlasi... Gitar teknikleri hakkinda makaleler oku, deneyimlerini paylas.
                                </p>
                                <ul className="card-features">
                                    <li>Teknik makaleler</li>
                                    <li>Topluluk tartismalari</li>
                                    <li>Deneyim paylasimi</li>
                                </ul>
                                <button className="card-cta amber" onClick={(e) => { e.stopPropagation(); onNavigate('education'); }}>
                                    Forumu Kesfet <span className="card-cta-arrow">&rarr;</span>
                                </button>
                            </div>
                            <div className="card-illust">
                                <ForumIllustration />
                            </div>
                        </div>

                        {/* Ritimler */}
                        <div className="feature-card card-sage"
                            ref={addCardRef}
                            style={{ '--slide-from': '-80px', '--card-delay': '0.15s' }}
                            onClick={() => onNavigate('library')}
                        >
                            <div className="card-icon sage-icon">&#9834;</div>
                            <span className="card-tag sage">Pratik</span>
                            <h2 className="card-title">Ritimler</h2>
                            <p className="card-desc">
                                Kendi ritimlerini olustur, akorlarini ekle ve gelismis metronom ile pratik yap.
                            </p>
                            <ul className="card-features">
                                <li>Ritim olusturucu</li>
                                <li>Metronom</li>
                                <li>Akor progresyonlari</li>
                            </ul>
                            <button className="card-cta sage" onClick={(e) => { e.stopPropagation(); onNavigate('library'); }}>
                                Ritimlere Bak <span className="card-cta-arrow">&rarr;</span>
                            </button>
                        </div>

                        {/* Akorlar */}
                        <div className="feature-card card-rose"
                            ref={addCardRef}
                            style={{ '--slide-from': '80px', '--card-delay': '0.15s' }}
                            onClick={() => onNavigate('chords')}
                        >
                            <div className="card-icon rose-icon">&#119070;</div>
                            <span className="card-tag rose">Ogren</span>
                            <h2 className="card-title">Akorlar</h2>
                            <p className="card-desc">
                                Am, E, G ve daha fazlasi... Gorsel akor semalari ile parmak pozisyonlarini ogren.
                            </p>
                            <ul className="card-features">
                                <li>Gorsel semalar</li>
                                <li>Seviye filtresi</li>
                                <li>Parmak rehberi</li>
                            </ul>
                            <button className="card-cta rose" onClick={(e) => { e.stopPropagation(); onNavigate('chords'); }}>
                                Akorlari Incele <span className="card-cta-arrow">&rarr;</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* ===== STATS ===== */}
                <div className="stats-strip" ref={statsRef}>
                    <div className="stat-item" ref={chordCount.ref}>
                        <span className="stat-number amber">{chordCount.count}+</span>
                        <span className="stat-label">Akor</span>
                    </div>
                    <div className="stat-divider" />
                    <div className="stat-item">
                        <span className="stat-number sage">&infin;</span>
                        <span className="stat-label">Ritim</span>
                    </div>
                    <div className="stat-divider" />
                    <div className="stat-item">
                        <span className="stat-number rose">&#9834;</span>
                        <span className="stat-label">Topluluk</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="home-footer">
                    <span className="footer-wire" />
                    <span className="footer-text">Muzik bir yolculuktur</span>
                    <span className="footer-wire" />
                </div>
            </div>
        </section>
    );
}
