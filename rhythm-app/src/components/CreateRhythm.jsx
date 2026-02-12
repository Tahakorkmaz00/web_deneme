import { useState } from 'react';
import { addRhythm, addXP } from '../utils/dataStore';
import { getAllChords } from '../utils/chordDatabase';
import './CreateRhythm.css';

export default function CreateRhythm({ username, onBack, onCreated }) {
    const [title, setTitle] = useState('');
    const [chords, setChords] = useState([]);
    const [selectedChord, setSelectedChord] = useState('');
    const [repeatCount, setRepeatCount] = useState(4);
    const [strumPattern, setStrumPattern] = useState('↓ ↓ ↑ ↓ ↑');
    const [bpm, setBpm] = useState(100);

    const allChords = getAllChords();

    const handleAddChord = () => {
        if (!selectedChord) return;
        const chord = allChords.find((c) => c.name === selectedChord);
        if (chord) {
            setChords([...chords, { name: chord.name, fullName: chord.fullName, repeat: repeatCount }]);
            setRepeatCount(4);
        }
    };

    const handleRemoveChord = (index) => {
        setChords(chords.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || chords.length === 0) return;

        const rhythm = addRhythm({
            title: title.trim(),
            chords,
            strumPattern: strumPattern.trim(),
            bpm,
            author: username,
            youtubeUrl: youtubeUrl.trim(), // Add youtubeUrl to the rhythm object
        });

        if (rhythm) {
            // Gamification: Add 50 XP
            const result = addXP(50);
            if (result.leveledUp) {
                alert(`🎉 TEBRİKLER!\nSeviye Atladın: ${result.newLevel}`);
            }
            onCreated(rhythm);
        }
    };

    return (
        <section className="create-rhythm-page">
            <div className="create-container">

                <div className="create-header">
                    <span className="create-icon">✨</span>
                    <h1>Yeni Ritim Oluştur</h1>
                    <p>Ritim kalıbını tanımla, akorlarını ekle ve topluluğa paylaş</p>
                </div>

                <form className="create-form" onSubmit={handleSubmit}>
                    {/* Title */}
                    <div className="form-group">
                        <label>🏷️ Başlık</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="ör: Lady in Black Rhythm"
                            className="form-input"
                        />
                    </div>

                    {/* Strum Pattern */}
                    <div className="form-group">
                        <label>🎵 Ritim Kalıbı</label>
                        <input
                            type="text"
                            value={strumPattern}
                            onChange={(e) => setStrumPattern(e.target.value)}
                            placeholder="ör: ↓ ↓ ↑ ↓ ↑ veya D D U D U"
                            className="form-input strum-input"
                        />
                        <div className="strum-helpers">
                            <span className="helper-label">Hızlı ekle:</span>
                            <button type="button" className="strum-btn" onClick={() => setStrumPattern(p => p + '↓')}>↓</button>
                            <button type="button" className="strum-btn" onClick={() => setStrumPattern(p => p + '↑')}>↑</button>
                            <button type="button" className="strum-btn" onClick={() => setStrumPattern(p => p + ' x')}>x</button>
                            <button type="button" className="strum-btn" onClick={() => setStrumPattern(p => p + ' ')}>⎵</button>
                            <button type="button" className="strum-btn clear" onClick={() => setStrumPattern('')}>Temizle</button>
                        </div>
                    </div>

                    {/* BPM */}
                    <div className="form-group">
                        <label>🥁 BPM (Tempo)</label>
                        <div className="bpm-control">
                            <button type="button" className="bpm-btn" onClick={() => setBpm(Math.max(40, bpm - 5))}>−</button>
                            <input
                                type="number"
                                value={bpm}
                                onChange={(e) => setBpm(Math.max(40, Math.min(240, parseInt(e.target.value) || 100)))}
                                className="bpm-input"
                                min="40"
                                max="240"
                            />
                            <button type="button" className="bpm-btn" onClick={() => setBpm(Math.min(240, bpm + 5))}>+</button>
                        </div>
                    </div>

                    {/* Add Chord */}
                    <div className="form-group">
                        <label>🎸 Akor Ekle</label>
                        <div className="add-chord-row">
                            <select
                                value={selectedChord}
                                onChange={(e) => setSelectedChord(e.target.value)}
                                className="chord-select"
                            >
                                <option value="">Akor seç...</option>
                                {allChords.map((chord) => (
                                    <option key={chord.name} value={chord.name}>
                                        {chord.name} — {chord.fullName}
                                    </option>
                                ))}
                            </select>
                            <div className="repeat-control">
                                <span className="repeat-label">Tekrar:</span>
                                <button type="button" className="repeat-btn" onClick={() => setRepeatCount(Math.max(1, repeatCount - 1))}>−</button>
                                <span className="repeat-value">{repeatCount}</span>
                                <button type="button" className="repeat-btn" onClick={() => setRepeatCount(Math.min(32, repeatCount + 1))}>+</button>
                            </div>
                            <button type="button" className="add-chord-btn" onClick={handleAddChord} disabled={!selectedChord}>
                                Ekle
                            </button>
                        </div>
                    </div>

                    {/* Chord List */}
                    {chords.length > 0 && (
                        <div className="form-group">
                            <label>📋 Akor Sıralaması</label>
                            <div className="chord-sequence">
                                {chords.map((chord, index) => (
                                    <div key={index} className="chord-item">
                                        <span className="chord-index">{index + 1}</span>
                                        <span className="chord-name">{chord.name}</span>
                                        <span className="chord-repeat">×{chord.repeat}</span>
                                        <button
                                            type="button"
                                            className="remove-chord-btn"
                                            onClick={() => handleRemoveChord(index)}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* YouTube Link */}
                    <div className="form-group">
                        <label>🎥 YouTube Video Linki (Opsiyonel)</label>
                        <input
                            type="text"
                            value={youtubeUrl}
                            onChange={(e) => setYoutubeUrl(e.target.value)}
                            placeholder="Ör: https://youtu.be/..."
                            className="form-input"
                        />
                    </div>

                    {/* Submit */}
                    <div className="form-actions">
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={!title.trim() || chords.length === 0}
                        >
                            💾 Ritmi Kaydet
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
