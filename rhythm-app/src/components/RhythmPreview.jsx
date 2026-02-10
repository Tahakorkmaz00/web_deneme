import { useState, useEffect } from 'react';
import './RhythmPreview.css';

export default function RhythmPreview({ results, onSelectRhythm, onStartPractice }) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [speed, setSpeed] = useState('normal');

    if (!results) return null;

    const allRhythms = [results.primary, ...results.alternatives];
    const selected = allRhythms[selectedIndex];

    const handleSelectRhythm = (index) => {
        setSelectedIndex(index);
        onSelectRhythm(index);
    };

    const handleSpeedChange = (newSpeed) => {
        setSpeed(newSpeed);
    };

    useEffect(() => {
        // Scroll to preview when results are shown
        const previewElement = document.querySelector('.rhythm-preview');
        if (previewElement) {
            previewElement.scrollIntoView({ behavior: 'smooth' });
        }
    }, [results]);

    const strumChars = selected.pattern.split(' ').filter(s => s);

    return (
        <section className="rhythm-preview">
            <div className="container">
                <h2 className="section-title">Rhythm Preview</h2>
                <div className="preview-card">
                    <div className="song-info">
                        <h3 className="song-title">{results.songName}</h3>
                        <p className="tempo">Estimated Tempo: {results.bpm} BPM</p>
                    </div>

                    <div className="pattern-display">
                        {strumChars.map((strum, idx) => (
                            <span
                                key={idx}
                                className={`strum speed-${speed}`}
                                style={{
                                    animationDelay: `${idx * 0.3}s`,
                                    color: idx % 2 === 0 ? 'var(--accent-orange)' : 'var(--accent-green)'
                                }}
                            >
                                {strum}
                            </span>
                        ))}
                    </div>

                    <div className="speed-controls">
                        <button
                            className={`speed-btn ${speed === 'slow' ? 'active' : ''}`}
                            onClick={() => handleSpeedChange('slow')}
                        >
                            Slow
                        </button>
                        <button
                            className={`speed-btn ${speed === 'normal' ? 'active' : ''}`}
                            onClick={() => handleSpeedChange('normal')}
                        >
                            Normal
                        </button>
                        <button
                            className={`speed-btn ${speed === 'fast' ? 'active' : ''}`}
                            onClick={() => handleSpeedChange('fast')}
                        >
                            Fast
                        </button>
                    </div>

                    <div className="rhythm-info">
                        <div style={{ marginTop: '32px', textAlign: 'center' }}>
                            <div style={{
                                display: 'inline-block',
                                padding: '8px 20px',
                                background: 'rgba(255, 107, 53, 0.1)',
                                borderRadius: '20px',
                                marginBottom: '16px'
                            }}>
                                <span style={{ color: 'var(--accent-green)', fontWeight: '700' }}>
                                    {selected.tag}
                                </span>
                            </div>
                            <h4 style={{
                                fontFamily: "'Bebas Neue', sans-serif",
                                fontSize: '1.5rem',
                                marginBottom: '8px',
                                letterSpacing: '1px'
                            }}>
                                {selected.style}
                            </h4>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                                {selected.desc}
                            </p>
                        </div>

                        <div style={{
                            display: 'flex',
                            gap: '12px',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            marginTop: '24px'
                        }}>
                            {allRhythms.map((r, idx) => (
                                <button
                                    key={idx}
                                    className={`rhythm-option-btn ${idx === selectedIndex ? 'active' : ''}`}
                                    onClick={() => handleSelectRhythm(idx)}
                                >
                                    {r.label}
                                </button>
                            ))}
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '32px' }}>
                            <button className="select-rhythm-btn" onClick={() => onStartPractice(selectedIndex)}>
                                Practice This Rhythm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
