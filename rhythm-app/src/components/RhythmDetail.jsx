import { useState, useEffect } from 'react';
import { getRhythmById, deleteRhythm } from '../utils/dataStore';
import './RhythmDetail.css';

export default function RhythmDetail({ rhythmId, username, onBack, onExercise, onDeleted }) {
    const [rhythm, setRhythm] = useState(null);

    useEffect(() => {
        if (rhythmId) {
            setRhythm(getRhythmById(rhythmId));
        }
    }, [rhythmId]);

    if (!rhythm) {
        return (
            <section className="rhythm-detail-page">
                <div className="detail-container">
                    <button className="back-btn" onClick={onBack}>← Kütüphaneye Dön</button>
                    <div className="not-found">Ritim bulunamadı.</div>
                </div>
            </section>
        );
    }

    const handleDelete = () => {
        if (window.confirm('Bu ritmi silmek istediğinize emin misiniz?')) {
            deleteRhythm(rhythm.id);
            onDeleted();
        }
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <section className="rhythm-detail-page">
            <div className="detail-container">
                <button className="back-btn" onClick={onBack}>
                    ← Kütüphaneye Dön
                </button>

                <div className="detail-card">
                    {/* Header */}
                    <div className="detail-header">
                        <div className="detail-title-section">
                            <h1>{rhythm.title}</h1>
                            <div className="detail-meta">
                                <span>👤 {rhythm.author}</span>
                                <span>📅 {formatDate(rhythm.createdAt)}</span>
                                <span>🥁 {rhythm.bpm} BPM</span>
                            </div>
                        </div>
                        {username === rhythm.author && (
                            <button className="delete-btn" onClick={handleDelete}>🗑️ Sil</button>
                        )}
                    </div>

                    {/* Strum Pattern */}
                    <div className="detail-section">
                        <h2>🎵 Ritim Kalıbı</h2>
                        <div className="strum-display">
                            {rhythm.strumPattern}
                        </div>
                    </div>

                    {/* Chords */}
                    <div className="detail-section">
                        <h2>🎸 Akor Sıralaması</h2>
                        <div className="chord-progression">
                            {rhythm.chords.map((chord, index) => (
                                <div key={index} className="progression-item">
                                    <span className="prog-number">{index + 1}</span>
                                    <div className="prog-info">
                                        <span className="prog-chord">{chord.name}</span>
                                        <span className="prog-repeat">{chord.repeat} tekrar</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Exercise Button */}
                    <button className="exercise-btn" onClick={() => onExercise(rhythm)}>
                        <span className="exercise-icon">🎯</span>
                        <div className="exercise-text">
                            <span className="exercise-title">Egzersiz Yap</span>
                            <span className="exercise-subtitle">Gelişmiş metronom ile pratik yap</span>
                        </div>
                    </button>
                </div>
            </div>
        </section>
    );
}
