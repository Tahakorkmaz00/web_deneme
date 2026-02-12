import { useState, useEffect } from 'react';
import './Login.css';

export default function Login({ onLogin, onClose }) {
    const [username, setUsername] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [activeString, setActiveString] = useState(-1);

    useEffect(() => {
        setIsVisible(true);
        const timers = [];
        for (let i = 0; i < 6; i++) {
            timers.push(setTimeout(() => setActiveString(i), 200 + i * 120));
        }
        return () => timers.forEach(clearTimeout);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            onLogin(username.trim());
        }
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const notes = ['♪', '♫', '♬', '♩', '🎵', '🎶'];

    return (
        <div className={`login-modal-overlay ${isVisible ? 'visible' : ''}`} onClick={handleClose}>
            <div className={`login-modal-content ${isVisible ? 'visible' : ''}`} onClick={(e) => e.stopPropagation()}>

                {/* Floating Music Notes */}
                <div className="floating-notes">
                    {notes.map((note, i) => (
                        <span key={i} className="floating-note" style={{
                            '--delay': `${i * 1.5}s`,
                            '--x-start': `${10 + i * 15}%`,
                            '--x-end': `${20 + i * 12}%`,
                            '--duration': `${4 + i * 0.7}s`,
                        }}>{note}</span>
                    ))}
                </div>

                {/* Glow orbs */}
                <div className="glow-orb orb-1"></div>
                <div className="glow-orb orb-2"></div>
                <div className="glow-orb orb-3"></div>

                {/* Close Button */}
                <button className="modal-close" onClick={handleClose}>✕</button>

                {/* Guitar Neck Visual */}
                <div className="guitar-visual">
                    <div className="guitar-neck">
                        <div className="fret-markers">
                            <div className="fret-dot"></div>
                            <div className="fret-dot"></div>
                            <div className="fret-dot double">
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                        <div className="guitar-strings">
                            {[0, 1, 2, 3, 4, 5].map((i) => (
                                <div
                                    key={i}
                                    className={`guitar-string ${activeString >= i ? 'active' : ''}`}
                                    style={{
                                        '--string-index': i,
                                        '--string-thickness': `${1 + i * 0.4}px`,
                                        '--string-color': ['#e8d5b7', '#e0c9a3', '#d4b88c', '#c9a86e', '#b8944f', '#a67c32'][i],
                                    }}
                                >
                                    <div className="string-vibration"></div>
                                </div>
                            ))}
                        </div>
                        <div className="fret-lines">
                            {[0, 1, 2, 3, 4].map((i) => (
                                <div key={i} className="fret-line"></div>
                            ))}
                        </div>
                    </div>

                    {/* Sound Wave Rings */}
                    <div className="sound-waves">
                        <div className="wave-ring ring-1"></div>
                        <div className="wave-ring ring-2"></div>
                        <div className="wave-ring ring-3"></div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="login-container">
                    <div className="login-header">
                        <div className="logo-glow">
                            <div className="logo-large">StrumFlow</div>
                        </div>
                        <p className="login-subtitle">
                            <span className="subtitle-line"></span>
                            Gitar Topluluğu & Ritim Kütüphanesi
                            <span className="subtitle-line"></span>
                        </p>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <h2>Hoş Geldin! <span className="wave-emoji">🎸</span></h2>
                        <p className="form-description">Topluluğa katılmak için adını yaz</p>

                        <div className="input-wrapper">
                            <div className="input-glow"></div>
                            <span className="input-icon">🎵</span>
                            <input
                                type="text"
                                className="login-input"
                                placeholder="Adınız..."
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoFocus
                            />
                        </div>

                        <button type="submit" className="login-button" disabled={!username.trim()}>
                            <span className="btn-text">Çalmaya Başla</span>
                            <span className="btn-icon">→</span>
                            <div className="btn-shine"></div>
                        </button>
                    </form>

                    <div className="login-features">
                        {[
                            { icon: '📚', text: 'Teknik Makaleler', color: '#ff6b35' },
                            { icon: '🎸', text: 'Ritim Kütüphanesi', color: '#00ff9f' },
                            { icon: '🥁', text: 'Gelişmiş Metronom', color: '#ff3366' },
                        ].map((f, i) => (
                            <div
                                key={i}
                                className="feature-item"
                                style={{ '--feature-delay': `${0.8 + i * 0.15}s`, '--feature-color': f.color }}
                            >
                                <span className="feature-icon-wrapper">
                                    <span className="feature-icon">{f.icon}</span>
                                </span>
                                <span>{f.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Motivational quote */}
                    <div className="login-quote">
                        <p>"Müzik, kelimelerin bittiği yerde başlar."</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
