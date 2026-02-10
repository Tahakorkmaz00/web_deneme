import { useState, useEffect } from 'react';
import CreateRhythmModal from './CreateRhythmModal';
import './RhythmLibrary.css';

export default function RhythmLibrary({ rhythms, onStartPractice, onBackToModes }) {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [customRhythms, setCustomRhythms] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem('customRhythms');
        if (saved) {
            setCustomRhythms(JSON.parse(saved));
        }
    }, []);

    const handleSaveRhythm = (newRhythm) => {
        const updated = [...customRhythms, newRhythm];
        setCustomRhythms(updated);
        localStorage.setItem('customRhythms', JSON.stringify(updated));
    };

    const categories = [
        { id: 'all', name: 'All Rhythms' },
        { id: 'custom', name: 'My Rhythms' }
    ];

    const allRhythms = [...rhythms, ...customRhythms];

    const filteredRhythms = selectedCategory === 'all'
        ? allRhythms
        : selectedCategory === 'custom'
            ? customRhythms
            : allRhythms;

    return (
        <section className="rhythm-library">
            <div className="container">
                <div className="library-header">
                    <div>
                        {onBackToModes && (
                            <button className="back-to-modes-btn" onClick={onBackToModes}>
                                ← Back to Modes
                            </button>
                        )}
                        <h2>Rhythm Library</h2>
                        <p className="library-subtitle">Choose a rhythm pattern and start practicing</p>
                    </div>
                    <button className="create-rhythm-btn" onClick={() => setShowModal(true)}>
                        + Create Rhythm
                    </button>
                </div>

                <div className="category-filters">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat.id)}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                <div className="rhythm-grid">
                    {filteredRhythms.map((rhythm, index) => (
                        <div key={rhythm.id} className="rhythm-card">
                            <div className="rhythm-card-header">
                                <h3>{rhythm.name}</h3>
                                <span className={`complexity-badge ${rhythm.complexity === 'custom' ? 'advanced' : rhythm.complexity}`}>
                                    {rhythm.complexity}
                                </span>
                            </div>

                            <div className="rhythm-pattern">
                                <div className="pattern-display">{rhythm.pattern}</div>
                            </div>

                            <div className="rhythm-info">
                                <div className="info-row">
                                    <span className="info-label">BPM Range:</span>
                                    <span className="info-value">{rhythm.bpm[0]} - {rhythm.bpm[1]}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Feel:</span>
                                    <span className="info-value">{rhythm.feel}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Energy:</span>
                                    <span className="info-value">{rhythm.energy}</span>
                                </div>
                                {rhythm.timeSignature && (
                                    <div className="info-row">
                                        <span className="info-label">Time Sig:</span>
                                        <span className="info-value">{rhythm.timeSignature[0]}/{rhythm.timeSignature[1]}</span>
                                    </div>
                                )}
                            </div>

                            <div className="practice-tip">
                                <span className="tip-icon">💡</span>
                                <p>{rhythm.practice_tip}</p>
                            </div>

                            <button
                                className="practice-btn"
                                onClick={() => {
                                    const originalIndex = rhythms.findIndex(r => r.id === rhythm.id);
                                    if (originalIndex !== -1) {
                                        onStartPractice(originalIndex);
                                    } else {
                                        onStartPractice(rhythm);
                                    }
                                }}
                            >
                                🥁 Practice This Rhythm
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {showModal && (
                <CreateRhythmModal onClose={() => setShowModal(false)} onSave={handleSaveRhythm} />
            )}
        </section>
    );
}
