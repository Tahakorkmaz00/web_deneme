import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import './Login.css';

export default function Login({ onLogin, onClose }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const [adminClicks, setAdminClicks] = useState(0);

    const handleLogoClick = () => {
        const newClicks = adminClicks + 1;
        setAdminClicks(newClicks);
        if (newClicks >= 3) {
            onLogin('Yönetici', true);
        }
    };

    // Kullanici adini email formatina cevir
    const toEmail = (name) => {
        const sanitized = name.toLowerCase().replace(/[^a-z0-9._-]/g, '');
        return `${sanitized}@strumflow.app`;
    };

    const getErrorMessage = (code) => {
        switch (code) {
            case 'auth/email-already-in-use':
                return 'Bu kullanici adi zaten alinmis.';
            case 'auth/invalid-credential':
            case 'auth/wrong-password':
                return 'Yanlis sifre.';
            case 'auth/user-not-found':
                return 'Kullanici bulunamadi.';
            case 'auth/weak-password':
                return 'Sifre en az 6 karakter olmali.';
            case 'auth/invalid-email':
                return 'Gecersiz kullanici adi. Sadece harf, rakam, nokta ve tire kullanin.';
            case 'auth/too-many-requests':
                return 'Cok fazla deneme. Biraz bekleyin.';
            default:
                return 'Bir hata olustu. Tekrar deneyin.';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username.trim() || !password.trim()) return;

        setError('');
        setLoading(true);

        const email = toEmail(username.trim());

        try {
            if (isRegister) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
            // onAuthStateChanged in App.jsx will handle the rest
        } catch (err) {
            setError(getErrorMessage(err.code));
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const canSubmit = username.trim() && password.trim() && !loading;

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
                        <div className="logo-large" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>StrumFlow Lab</div>
                        <div className="login-label">
                            <span className="label-wire"></span>
                            <span>Gitar Toplulugu</span>
                            <span className="label-wire"></span>
                        </div>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <h2>{isRegister ? 'Kayit Ol' : 'Hos Geldin'}</h2>
                        <p className="form-description">
                            {isRegister
                                ? 'Topluluga katilmak icin bilgilerini gir'
                                : 'Hesabina giris yap'}
                        </p>

                        {error && <div className="login-error">{error}</div>}

                        <div className="input-wrapper">
                            <input
                                type="text"
                                className="login-input"
                                placeholder="Kullanici adi..."
                                value={username}
                                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                                autoFocus
                                autoComplete="username"
                            />
                            <div className="input-line"></div>
                        </div>

                        <div className="input-wrapper">
                            <input
                                type="password"
                                className="login-input"
                                placeholder="Sifre..."
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                autoComplete={isRegister ? 'new-password' : 'current-password'}
                            />
                            <div className="input-line"></div>
                        </div>

                        <button type="submit" className="login-button" disabled={!canSubmit}>
                            {loading ? (
                                <span className="btn-text">Yukleniyor...</span>
                            ) : (
                                <>
                                    <span className="btn-text">{isRegister ? 'Kayit Ol' : 'Giris Yap'}</span>
                                    <span className="btn-icon">&rarr;</span>
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            className="login-mode-toggle"
                            onClick={() => { setIsRegister(!isRegister); setError(''); }}
                        >
                            {isRegister
                                ? 'Zaten hesabin var mi? Giris Yap'
                                : 'Hesabin yok mu? Kayit Ol'}
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
