import { useState, useEffect } from 'react';
import { loadSessions, deleteSession, createNewSession } from '../utils/sessionStorage';
import './SessionsGallery.css';

export default function SessionsGallery({ onBackToModes, onSelectSession, onNewSession }) {
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        setSessions(loadSessions());
    }, []);

    const handleDelete = (e, sessionId) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this session?')) {
            deleteSession(sessionId);
            setSessions(loadSessions());
        }
    };

    const handleNewSession = () => {
        const newSession = createNewSession();
        onNewSession(newSession);
    };

    return (
        <section className="sessions-gallery">
            <div className="gallery-container">
                {/* Header */}
                <div className="gallery-header">
                    <button className="back-btn-gallery" onClick={onBackToModes}>
                        ← Back to Modes
                    </button>
                    <div className="header-info">
                        <h1>My Sessions</h1>
                        <p>Create and manage your practice sessions</p>
                    </div>
                </div>

                {/* New Session Card */}
                <div className="sessions-grid">
                    <div className="session-card new-session-card" onClick={handleNewSession}>
                        <div className="new-icon">+</div>
                        <div className="new-text">Create New Session</div>
                    </div>

                    {/* Saved Sessions */}
                    {sessions.map(session => (
                        <div
                            key={session.id}
                            className="session-card"
                            onClick={() => onSelectSession(session)}
                        >
                            <div className="card-header">
                                <h3>{session.name}</h3>
                                <button
                                    className="delete-btn"
                                    onClick={(e) => handleDelete(e, session.id)}
                                >
                                    ×
                                </button>
                            </div>

                            <div className="card-chords">
                                {session.chords.slice(0, 4).map((chord, idx) => (
                                    <span key={idx} className="chord-tag">{chord.chord}</span>
                                ))}
                                {session.chords.length > 4 && (
                                    <span className="chord-more">+{session.chords.length - 4}</span>
                                )}
                            </div>

                            <div className="card-meta">
                                <span className="meta-item">
                                    🎵 {session.rhythm?.name || 'No rhythm'}
                                </span>
                                <span className="meta-item">
                                    ⏱ {session.bpm} BPM
                                </span>
                            </div>

                            <div className="card-actions">
                                <button className="edit-btn" onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectSession(session, 'edit');
                                }}>
                                    ✏️ Edit
                                </button>
                                <button className="play-btn-card" onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectSession(session, 'play');
                                }}>
                                    ▶ Play
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {sessions.length === 0 && (
                    <div className="empty-gallery">
                        <div className="empty-icon">🎸</div>
                        <h2>No sessions yet</h2>
                        <p>Create your first practice session to get started!</p>
                    </div>
                )}
            </div>
        </section>
    );
}
