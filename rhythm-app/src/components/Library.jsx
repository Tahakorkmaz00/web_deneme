import { useState, useEffect } from 'react';
import { getAllRhythms, searchRhythms } from '../utils/dataStore';
import './Library.css';

export default function Library({ onNavigate, onBack, isLoggedIn, onRequestLogin }) {
    const [rhythms, setRhythms] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setRhythms(getAllRhythms());
    }, []);

    useEffect(() => {
        if (searchQuery.trim()) {
            setRhythms(searchRhythms(searchQuery));
        } else {
            setRhythms(getAllRhythms());
        }
    }, [searchQuery]);

    const refreshRhythms = () => {
        setRhythms(searchQuery.trim() ? searchRhythms(searchQuery) : getAllRhythms());
    };

    const handleCreate = () => {
        if (!isLoggedIn) {
            onRequestLogin();
            return;
        }
        onNavigate('create');
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <section className="library-page">
            <div className="library-container">

                <div className="library-header">
                    <span className="library-header-icon">🎸</span>
                    <h1>Kütüphane</h1>
                    <p>Topluluk ritimlerini keşfet veya kendi ritimlerini oluştur</p>
                </div>

                {/* Actions Bar */}
                <div className="library-actions">
                    <div className="search-bar">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Ritim ara... (başlık, akor veya kullanıcı)"
                            className="search-input"
                        />
                        {searchQuery && (
                            <button className="clear-search" onClick={() => setSearchQuery('')}>✕</button>
                        )}
                    </div>
                    <button className="create-btn" onClick={handleCreate}>
                        <span>＋</span> Yeni Ritim
                    </button>
                </div>

                {/* Rhythm List */}
                <div className="rhythm-list">
                    {rhythms.length === 0 ? (
                        <div className="empty-library">
                            <span className="empty-icon">🎵</span>
                            <h3>{searchQuery ? 'Sonuç bulunamadı' : 'Henüz ritim yok'}</h3>
                            <p>{searchQuery
                                ? 'Farklı bir arama deneyin'
                                : 'İlk ritmi oluşturmak için "Yeni Ritim" butonuna tıklayın!'
                            }</p>
                        </div>
                    ) : (
                        rhythms.map((rhythm, idx) => (
                            <div
                                key={rhythm.id}
                                className="rhythm-card"
                                onClick={() => onNavigate('rhythm-detail', { rhythmId: rhythm.id })}
                                style={{ '--ri': idx }}
                            >
                                <div className="rhythm-card-left">
                                    <h3>{rhythm.title}</h3>
                                    <div className="rhythm-card-meta">
                                        <span className="meta-author">👤 {rhythm.author}</span>
                                        <span className="meta-date">📅 {formatDate(rhythm.createdAt)}</span>
                                    </div>
                                    <div className="rhythm-chords-preview">
                                        {rhythm.chords.slice(0, 6).map((chord, i) => (
                                            <span key={i} className="chord-badge">
                                                {chord.name} ×{chord.repeat}
                                            </span>
                                        ))}
                                        {rhythm.chords.length > 6 && (
                                            <span className="chord-badge more">+{rhythm.chords.length - 6}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="rhythm-card-right">
                                    <span className="card-arrow">→</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
