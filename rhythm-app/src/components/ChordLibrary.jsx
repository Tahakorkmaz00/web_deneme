import { useState, useEffect } from 'react';
import { CHORDS, searchChords, getChordsByDifficulty, DIFFICULTY_LABELS } from '../data/chords';
import { getUserChords, getUserChordsLocal, updateUserChord, getUserProfile } from '../utils/dataStore';
import './ChordLibrary.css';

const ChordDiagram = ({ chord, size = 'normal' }) => {
    const { frets, fingers, barre } = chord;

    const isLarge = size === 'large';
    const width = isLarge ? 220 : 140;
    const height = isLarge ? 250 : 160;
    const p = isLarge ? 35 : 25;
    const w = width - p * 2;
    const h = height - p * 2;
    const stringGap = w / 5;
    const fretGap = h / 5;
    const dotR = isLarge ? 13 : 9;
    const fontSize = isLarge ? 14 : 11;

    return (
        <svg width={width} height={height} className="chord-svg" viewBox={`0 0 ${width} ${height}`}>
            {[0, 1, 2, 3, 4, 5].map(i => (
                <line
                    key={`f-${i}`}
                    x1={p} y1={p + i * fretGap}
                    x2={width - p} y2={p + i * fretGap}
                    stroke="currentColor"
                    strokeWidth={i === 0 ? 4 : 1}
                    className="fret-line"
                    opacity={i === 0 ? 1 : 0.3}
                />
            ))}

            {[0, 1, 2, 3, 4, 5].map(i => (
                <line
                    key={`s-${i}`}
                    x1={p + i * stringGap} y1={p}
                    x2={p + i * stringGap} y2={height - p}
                    stroke="currentColor"
                    strokeWidth={i < 3 ? 1 : 2}
                    className="string-line"
                    opacity="0.6"
                />
            ))}

            {barre && (
                <rect
                    x={p + (barre.from - 1) * stringGap}
                    y={p + (barre.fret * fretGap) - (isLarge ? 8 : 6)}
                    width={(barre.to - barre.from) * stringGap}
                    height={isLarge ? 16 : 12}
                    rx={isLarge ? 8 : 6}
                    fill="var(--accent-orange)"
                    className="barre"
                />
            )}

            {frets.map((fret, s) => {
                if (fret > 0) {
                    return (
                        <g key={`d-${s}`}>
                            <circle
                                cx={p + s * stringGap}
                                cy={p + (fret - 0.5) * fretGap}
                                r={dotR}
                                fill="var(--accent-orange)"
                                className="finger-dot"
                            />
                            {fingers && fingers[s] > 0 && (
                                <text
                                    x={p + s * stringGap}
                                    y={p + (fret - 0.5) * fretGap + (isLarge ? 5 : 4)}
                                    textAnchor="middle"
                                    fill="#fff"
                                    fontSize={fontSize}
                                    fontWeight="bold"
                                    className="finger-num"
                                >
                                    {fingers[s]}
                                </text>
                            )}
                        </g>
                    );
                }
                return null;
            })}

            {frets.map((fret, s) => {
                const x = p + s * stringGap;
                const y = p - 12;
                if (fret === 0) return <circle key={`o-${s}`} cx={x} cy={y + 5} r={isLarge ? 5 : 4} fill="none" stroke="currentColor" strokeWidth="1.5" className="open-string" />;
                if (fret === -1) return <text key={`x-${s}`} x={x} y={y + 9} textAnchor="middle" fill="currentColor" fontSize={isLarge ? 16 : 14} className="mute-string">×</text>;
                return null;
            })}
        </svg>
    );
};

const ChordDetail = ({ chord, onBack, userChords, toggleStatus }) => {
    const isMastered = userChords.mastered.includes(chord.id);
    const isLearning = userChords.learning.includes(chord.id);
    const diffLabel = DIFFICULTY_LABELS[chord.difficulty] || chord.difficulty;
    const diffClass = chord.difficulty;

    return (
        <div className="chord-detail">
            <button className="detail-back-btn" onClick={onBack}>← Geri</button>

            <div className="detail-hero">
                <div className="detail-hero-left">
                    <span className={`detail-diff-badge ${diffClass}`}>{diffLabel}</span>
                    <h1 className="detail-name">{chord.name}</h1>
                    <p className="detail-fullname">{chord.fullName}</p>
                    <p className="detail-desc">{chord.description}</p>
                    <div className="detail-actions">
                        <button
                            className={`action-btn btn-master ${isMastered ? 'active' : ''}`}
                            onClick={() => toggleStatus(chord.id, 'mastered')}
                        >
                            {isMastered ? '🏆 Ustasısın' : '✓ Biliyorum'}
                        </button>
                        <button
                            className={`action-btn btn-learn ${isLearning ? 'active' : ''}`}
                            onClick={() => toggleStatus(chord.id, 'learning')}
                        >
                            {isLearning ? '📌 Listede' : '+ Öğren'}
                        </button>
                    </div>
                </div>
                <div className="detail-hero-right">
                    <div className="detail-diagram">
                        <ChordDiagram chord={chord} size="large" />
                    </div>
                </div>
            </div>

            {/* Parmak Yerleşimi */}
            <div className="detail-section">
                <h2>Parmak Yerleşimi</h2>
                <div className="finger-table">
                    <div className="finger-table-header">
                        <span>Tel</span>
                        <span>Perde</span>
                        <span>Parmak</span>
                    </div>
                    {chord.fingerPlacement.map((fp, i) => (
                        <div key={i} className="finger-table-row">
                            <span className="ft-string">{fp.string}</span>
                            <span className="ft-fret">{fp.fret}</span>
                            <span className="ft-finger">{fp.finger}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* İpuçları */}
            <div className="detail-section">
                <h2>İpuçları ve Teknikler</h2>
                <ul className="tips-list">
                    {chord.tips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                    ))}
                </ul>
            </div>

            {/* Örnek Şarkılar */}
            <div className="detail-section">
                <h2>Bu Akorla Çalınan Şarkılar</h2>
                <div className="songs-list">
                    {chord.commonSongs.map((song, i) => (
                        <div key={i} className="song-item">
                            <span className="song-icon">🎵</span>
                            <span>{song}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default function ChordLibrary({ onBack, user }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('library');
    const [activeDifficulty, setActiveDifficulty] = useState('all');
    const [selectedChord, setSelectedChord] = useState(null);
    const [userChords, setUserChords] = useState({ mastered: [], learning: [] });

    const filteredChords = (() => {
        let chords = searchTerm ? searchChords(searchTerm) : CHORDS;
        if (activeDifficulty !== 'all') {
            chords = chords.filter(c => c.difficulty === activeDifficulty);
        }
        return chords;
    })();

    const uid = user?.uid || null;

    useEffect(() => {
        // Ilk yuklemede Firestore'dan oku (async), localStorage'dan aninda goster
        setUserChords(getUserChordsLocal());
        if (uid) {
            getUserChords(uid).then(data => setUserChords(data));
        }
        const handleUpdate = () => setUserChords(getUserChordsLocal());
        window.addEventListener('chordsUpdated', handleUpdate);
        return () => window.removeEventListener('chordsUpdated', handleUpdate);
    }, [uid]);

    const toggleStatus = (chordId, status) => {
        const currentStatus = userChords.mastered.includes(chordId) ? 'mastered' :
            userChords.learning.includes(chordId) ? 'learning' : 'none';
        if (currentStatus === status) {
            updateUserChord(uid, chordId, 'none');
        } else {
            updateUserChord(uid, chordId, status);
        }
    };

    const copyRepertoire = () => {
        const masteredNames = userChords.mastered.map(id => CHORDS.find(c => c.id === id)?.name).filter(Boolean).join(', ');
        const learningNames = userChords.learning.map(id => CHORDS.find(c => c.id === id)?.name).filter(Boolean).join(', ');
        const level = getUserProfile().level;
        const text = `🎸 **Benim Akor Yolculuğum** (Seviye ${level})\n\n🚀 **Ustalaştım:** ${masteredNames || 'Henüz yok'}\n🎯 **Öğreniyorum:** ${learningNames || 'Henüz yok'}\n\n#StrumFlowLab ile çalışıyorum!`;
        navigator.clipboard.writeText(text);
        alert('Repertuvar panoya kopyalandı! Arkadaşlarınla paylaşabilirsin.');
    };

    if (selectedChord) {
        return (
            <section className="chord-page">
                <ChordDetail
                    chord={selectedChord}
                    onBack={() => setSelectedChord(null)}
                    userChords={userChords}
                    toggleStatus={toggleStatus}
                />
            </section>
        );
    }

    const renderChordCard = (chord) => {
        const isMastered = userChords.mastered.includes(chord.id);
        const isLearning = userChords.learning.includes(chord.id);
        const diffLabel = DIFFICULTY_LABELS[chord.difficulty] || chord.difficulty;

        return (
            <div
                key={chord.id}
                className={`chord-card ${isMastered ? 'mastered' : ''} ${isLearning ? 'learning' : ''}`}
                onClick={() => setSelectedChord(chord)}
                style={{ cursor: 'pointer' }}
            >
                <div className="card-top">
                    <span className={`card-diff-badge ${chord.difficulty}`}>{diffLabel}</span>
                    <h2>{chord.name}</h2>
                    <span className="chord-full">{chord.fullName}</span>
                </div>
                <div className="diagram-container">
                    <ChordDiagram chord={chord} />
                </div>
                <p className="chord-desc">{chord.description}</p>

                <div className="chord-actions" onClick={e => e.stopPropagation()}>
                    <button
                        className={`action-btn btn-master ${isMastered ? 'active' : ''}`}
                        onClick={() => toggleStatus(chord.id, 'mastered')}
                        title="Ustalaştım (Biliyorum)"
                    >
                        {isMastered ? '🏆 Ustasısın' : '✓ Biliyorum'}
                    </button>
                    <button
                        className={`action-btn btn-learn ${isLearning ? 'active' : ''}`}
                        onClick={() => toggleStatus(chord.id, 'learning')}
                        title="Öğrenilecekler listesine ekle"
                    >
                        {isLearning ? '📌 Listede' : '+ Öğren'}
                    </button>
                </div>
            </div>
        );
    };

    const difficultyFilters = [
        { key: 'all', label: 'Tümü' },
        { key: 'beginner', label: 'Başlangıç' },
        { key: 'intermediate', label: 'Orta Düzey' },
        { key: 'advanced', label: 'Zor' },
    ];

    const renderDifficultySection = (difficulty, label, emoji) => {
        const chords = filteredChords.filter(c => c.difficulty === difficulty);
        if (chords.length === 0) return null;
        return (
            <div className="difficulty-section" key={difficulty}>
                <div className="difficulty-section-header">
                    <span className="diff-emoji">{emoji}</span>
                    <h2>{label}</h2>
                    <span className="diff-count">{chords.length} akor</span>
                </div>
                <div className="chord-grid">
                    {chords.map(renderChordCard)}
                </div>
            </div>
        );
    };

    return (
        <section className="chord-page">
            <div className="chord-header">
                <span className="chord-icon">🎸</span>
                <h1>Akor Kütüphanesi</h1>
                <p>Akorları keşfet, repertuvarını oluştur ve paylaş.</p>
            </div>

            <div className="chord-tabs">
                <button
                    className={`tab-btn ${activeTab === 'library' ? 'active' : ''}`}
                    onClick={() => setActiveTab('library')}
                >
                    📚 Tüm Akorlar
                </button>
                <button
                    className={`tab-btn ${activeTab === 'repertoire' ? 'active' : ''}`}
                    onClick={() => setActiveTab('repertoire')}
                >
                    👤 Repertuvarım
                </button>
            </div>

            {activeTab === 'library' && (
                <>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Akor ara (ör: Am, G, F#m...)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="chord-search"
                        />
                    </div>

                    <div className="difficulty-filters">
                        {difficultyFilters.map(f => (
                            <button
                                key={f.key}
                                className={`diff-filter-btn ${activeDifficulty === f.key ? 'active' : ''} ${f.key !== 'all' ? f.key : ''}`}
                                onClick={() => setActiveDifficulty(f.key)}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {activeDifficulty === 'all' ? (
                        <>
                            {renderDifficultySection('beginner', 'Başlangıç', '🟢')}
                            {renderDifficultySection('intermediate', 'Orta Düzey', '🟡')}
                            {renderDifficultySection('advanced', 'Zor', '🔴')}
                        </>
                    ) : (
                        <div className="chord-grid">
                            {filteredChords.map(renderChordCard)}
                        </div>
                    )}

                    {filteredChords.length === 0 && (
                        <p className="empty-msg">Aramanızla eşleşen akor bulunamadı.</p>
                    )}
                </>
            )}

            {activeTab === 'repertoire' && (
                <div className="repertoire-view">
                    <div className="repertoire-header">
                        <h2>Benim Yolculuğum</h2>
                        <button className="share-btn" onClick={copyRepertoire}>
                            📤 Paylaş
                        </button>
                    </div>

                    <div className="repertoire-section">
                        <h3>🚀 Ustalaştıklarım ({userChords.mastered.length})</h3>
                        {userChords.mastered.length > 0 ? (
                            <div className="chord-grid">
                                {userChords.mastered.map(id => {
                                    const c = CHORDS.find(x => x.id === id);
                                    return c ? renderChordCard(c) : null;
                                })}
                            </div>
                        ) : (
                            <p className="empty-msg">Henüz ustalaştığın bir akor işaretlemedin.</p>
                        )}
                    </div>

                    <div className="repertoire-section">
                        <h3>🎯 Öğreneceklerim ({userChords.learning.length})</h3>
                        {userChords.learning.length > 0 ? (
                            <div className="chord-grid">
                                {userChords.learning.map(id => {
                                    const c = CHORDS.find(x => x.id === id);
                                    return c ? renderChordCard(c) : null;
                                })}
                            </div>
                        ) : (
                            <p className="empty-msg">Öğrenilecekler listen boş.</p>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
