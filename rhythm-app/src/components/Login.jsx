import { useState } from 'react';
import './Login.css';

export default function Login({ onLogin, onClose }) {
    const [username, setUsername] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            onLogin(username.trim());
        }
    };

    return (
        <div className="login-modal-overlay" onClick={onClose}>
            <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>✕</button>
                <div className="login-container">
                    <div className="login-header">
                        <div className="logo-large">StrumFlow</div>
                        <p className="login-subtitle">Rhythm Exercise Metronome</p>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <h2>Welcome! 🎸</h2>
                        <p className="form-description">Enter your name to get started</p>

                        <input
                            type="text"
                            className="login-input"
                            placeholder="Your name..."
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoFocus
                        />

                        <button type="submit" className="login-button" disabled={!username.trim()}>
                            Start Playing
                        </button>
                    </form>

                    <div className="login-features">
                        <div className="feature-item">🎸 Rhythm Exercises</div>
                        <div className="feature-item">🎵 Interactive Metronome</div>
                        <div className="feature-item">📈 Track Your Progress</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
