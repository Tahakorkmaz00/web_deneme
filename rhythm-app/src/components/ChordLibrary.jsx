import { useState, useEffect } from 'react';
import { CHORDS, searchChords } from '../data/chords';
import { getUserChords, updateUserChord, getUserProfile } from '../utils/dataStore';
import './ChordLibrary.css';

const ChordDiagram = ({ chord }) => {
    const { frets, fingers, barre } = chord;

    // SVG Config
    const width = 140;
    const height = 160;
    const p = 25; // padding
    const w = width - p * 2;
    const h = height - p * 2;
    const stringGap = w / 5;
    const fretGap = h / 5;

    return (
        <svg width={width} height={height} className="chord-svg" viewBox={`0 0 ${width} ${height}`}>
            {/* Frets (Horizontal) */}
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

            {/* Strings (Vertical) */}
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

            {/* Barre */}
            {barre && (
                <rect
                    x={p + (barre.from - 1) * stringGap}
                    y={p + (barre.fret * fretGap) - 6}
                    width={(barre.to - barre.from) * stringGap}
                    height={12}
                    rx={6}
                    fill="var(--accent-orange)"
                    className="barre"
                />
            )}

            {/* Dots */}
            {frets.map((fret, s) => {
                if (fret > 0) {
                    return (
                        <g key={`d-${s}`}>
                            <circle
                                cx={p + s * stringGap}
                                cy={p + (fret - 0.5) * fretGap}
                                r={9}
                                fill="var(--accent-orange)"
                                className="finger-dot"
                            />
                            {fingers && fingers[s] > 0 && (
                                <text
                                    x={p + s * stringGap}
                                    y={p + (fret - 0.5) * fretGap + 4}
                                    textAnchor="middle"
                                    fill="#fff"
                                    fontSize="11"
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

            {/* Top Indicators (x / o) */}
            {frets.map((fret, s) => {
                const x = p + s * stringGap;
                const y = p - 12;
                if (fret === 0) return <circle key={`o-${s}`} cx={x} cy={y + 5} r={4} fill="none" stroke="currentColor" strokeWidth="1.5" className="open-string" />;
                if (fret === -1) return <text key={`x-${s}`} x={x} y={y + 9} textAnchor="middle" fill="currentColor" fontSize="14" className="mute-string">×</text>;
                return null;
            })}
        </svg>
    );
};

export default function ChordLibrary({ onBack }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('library'); // 'library' | 'repertoire'
    const [userChords, setUserChords] = useState({ mastered: [], learning: [] });
    const allChords = searchChords(searchTerm);

    useEffect(() => {
        setUserChords(getUserChords());

        const handleUpdate = () => setUserChords(getUserChords());
        window.addEventListener('chordsUpdated', handleUpdate);
        return () => window.removeEventListener('chordsUpdated', handleUpdate);
    }, []);

    const toggleStatus = (chordId, status) => {
        // Toggle logic: if already in that status, remove it. Else set it.
        const currentStatus = userChords.mastered.includes(chordId) ? 'mastered' :
            userChords.learning.includes(chordId) ? 'learning' : 'none';

        if (currentStatus === status) {
            updateUserChord(chordId, 'none');
        } else {
            updateUserChord(chordId, status);
        }
    };

    const copyRepertoire = () => {
        const masteredNames = userChords.mastered.map(id => CHORDS.find(c => c.id === id)?.name).filter(Boolean).join(', ');
        const learningNames = userChords.learning.map(id => CHORDS.find(c => c.id === id)?.name).filter(Boolean).join(', ');
        const level = getUserProfile().level;

        const text = `🎸 **Benim Akor Yolculuğum** (Seviye ${level})\n\n🚀 **Ustalaştım:** ${masteredNames || 'Henüz yok'}\n🎯 **Öğreniyorum:** ${learningNames || 'Henüz yok'}\n\n#StrumFlow ile çalışıyorum!`;

        navigator.clipboard.writeText(text);
        alert('Repertuvar panoya kopyalandı! Arkadaşlarınla paylaşabilirsin.');
    };

    const renderChordCard = (chord) => {
        const isMastered = userChords.mastered.includes(chord.id);
        const isLearning = userChords.learning.includes(chord.id);

        return (
            <div key={chord.id} className={`chord-card ${isMastered ? 'mastered' : ''} ${isLearning ? 'learning' : ''}`}>
                <div className="card-top">
                    <h2>{chord.name}</h2>
                    <span className="chord-full">{chord.fullName}</span>
                </div>
                <div className="diagram-container">
                    <ChordDiagram chord={chord} />
                </div>
                <p className="chord-desc">{chord.description}</p>

                <div className="chord-actions">
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

    return (
        <section className="chord-page">

            <div className="chord-header">
                <span className="chord-icon">🎸</span>
                <h1>Akor Kütüphanesi</h1>
                <p>Akorları keşfet, repertuvarını oluştur ve paylaş.</p>
            </div>

            {/* Tabs */}
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

                    <div className="chord-grid">
                        {allChords.map(renderChordCard)}
                    </div>
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
