import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import './Library.css';

export default function Library({ onNavigate, onBack, isLoggedIn, onRequestLogin }) {
    const [allRhythms, setAllRhythms] = useState([]);
    const [rhythms, setRhythms] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'rhythms'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snap) => {
            const data = snap.docs.map(d => {
                const d_ = d.data();
                return {
                    id: d.id,
                    ...d_,
                    createdAt: d_.createdAt?.toDate?.().toISOString() || new Date().toISOString()
                };
            });
            setAllRhythms(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            setRhythms(allRhythms.filter(r =>
                r.title.toLowerCase().includes(q) ||
                r.chords.some(c => c.name.toLowerCase().includes(q)) ||
                (r.author && r.author.toLowerCase().includes(q))
            ));
        } else {
            setRhythms(allRhythms);
        }
    }, [searchQuery, allRhythms]);

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
                    {loading ? (
                        <div className="empty-library">
                            <span className="empty-icon">⏳</span>
                            <h3>Yükleniyor...</h3>
                        </div>
                    ) : rhythms.length === 0 ? (
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
