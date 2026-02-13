import { useState, useEffect } from 'react';
import './Login.css';

export default function Login({ onLogin, onClose }) {
    const [username, setUsername] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
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

    return (
        <div className={`login-modal-overlay ${isVisible ? 'visible' : ''}`} onClick={handleClose}>
            <div className={`login-modal-content ${isVisible ? 'visible' : ''}`} onClick={(e) => e.stopPropagation()}>

                {/* Decorative strings */}
                <div className="login-strings">
                    {[0, 1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="login-string" style={{ '--ls-i': i }} />
                    ))}
                </div>

                {/* Close */}
                <button className="modal-close" onClick={handleClose}>&#x2715;</button>

                {/* Main Content */}
                <div className="login-container">
                    <div className="login-header">
                        <div className="logo-large">StrumFlow</div>
                        <div className="login-label">
                            <span className="label-wire"></span>
                            <span>Gitar Toplulugu</span>
                            <span className="label-wire"></span>
                        </div>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <h2>Hos Geldin</h2>
                        <p className="form-description">Topluluga katilmak icin adini yaz</p>

                        <div className="input-wrapper">
                            <input
                                type="text"
                                className="login-input"
                                placeholder="Adiniz..."
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoFocus
                            />
                            <div className="input-line"></div>
                        </div>

                        <button type="submit" className="login-button" disabled={!username.trim()}>
                            <span className="btn-text">Calmaya Basla</span>
                            <span className="btn-icon">&rarr;</span>
                        </button>
                    </form>

                    <div className="login-features">
                        {[
                            { label: 'Teknik Makaleler', accent: 'var(--accent-amber)' },
                            { label: 'Ritim Kutuphanesi', accent: 'var(--accent-sage)' },
                            { label: 'Gelismis Metronom', accent: 'var(--accent-rose)' },
                        ].map((f, i) => (
                            <div
                                key={i}
                                className="feature-item"
                                style={{ '--feature-delay': `${0.5 + i * 0.1}s`, '--feature-accent': f.accent }}
                            >
                                <span className="feature-dot"></span>
                                <span>{f.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="login-quote">
                        <p>"Muzik, kelimelerin bittigi yerde baslar."</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
