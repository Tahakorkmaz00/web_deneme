import { useState, useEffect } from 'react';
import { useMetronome } from '../hooks/useMetronome';
import './AdvancedPracticeMode.css';

export default function AdvancedPracticeMode({ session, onExit }) {
    const [currentChordIndex, setCurrentChordIndex] = useState(0);
    const [beatsInCurrentChord, setBeatsInCurrentChord] = useState(0);

    const { bpm, isPlaying, currentBeat, toggle, adjustBPM } = useMetronome(session.bpm);

    const currentChord = session.chords[currentChordIndex];
    const rhythm = session.rhythm;
    const strumChars = rhythm.pattern.split(' ').filter(s => s);

    // Auto-advance to next chord when beats complete
    useEffect(() => {
        if (!isPlaying) return;

        if (currentBeat === 1 && beatsInCurrentChord > 0) {
            if (beatsInCurrentChord >= currentChord.beats) {
                const nextIndex = (currentChordIndex + 1) % session.chords.length;
                setCurrentChordIndex(nextIndex);
                setBeatsInCurrentChord(1);
            } else {
                setBeatsInCurrentChord(prev => prev + 1);
            }
        } else if (beatsInCurrentChord === 0 && currentBeat === 1) {
            setBeatsInCurrentChord(1);
        }
    }, [currentBeat, isPlaying]);

    const handleReset = () => {
        setCurrentChordIndex(0);
        setBeatsInCurrentChord(0);
    };

    return (
        <section className="advanced-practice-screen">
            <div className="advanced-container">
                {/* Header */}
                <div className="advanced-header">
                    <button className="back-btn-advanced" onClick={onExit}>
                        ← Back
                    </button>
                    <div className="session-info-header">
                        <h1>{session.name}</h1>
                    </div>
                </div>

                {/* Main Practice Area - Rhythm Focused */}
                <div className="practice-main-area">
                    {/* Current Chord Badge */}
                    <div className="chord-badge">
                        <span className="chord-badge-label">Play:</span>
                        <span className="chord-badge-name">{currentChord.chord}</span>
                        <span className="chord-badge-progress">({beatsInCurrentChord}/{currentChord.beats})</span>
                    </div>

                    {/* Rhythm Display - CENTER FOCUS */}
                    <div className="rhythm-center">
                        <div className="rhythm-symbols-row">
                            {strumChars.map((symbol, idx) => {
                                const beatNumber = (idx % 4) + 1;
                                const isActive = currentBeat === beatNumber && isPlaying;

                                return (
                                    <div
                                        key={idx}
                                        className={`rhythm-beat ${isActive ? 'active' : ''}`}
                                    >
                                        <div className="beat-num">{beatNumber}</div>
                                        <div className="strum-symbol">{symbol}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Chord Progression Bar */}
                    <div className="progression-bar">
                        {session.chords.map((chord, idx) => (
                            <div
                                key={idx}
                                className={`prog-chord ${idx === currentChordIndex ? 'current' : ''} ${idx < currentChordIndex ? 'done' : ''}`}
                            >
                                {chord.chord}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Controls */}
                <div className="controls-bar">
                    <div className="bpm-controls">
                        <button onClick={() => adjustBPM(-5)}>-5</button>
                        <button onClick={() => adjustBPM(-1)}>-1</button>
                        <div className="bpm-value">{bpm} BPM</div>
                        <button onClick={() => adjustBPM(1)}>+1</button>
                        <button onClick={() => adjustBPM(5)}>+5</button>
                    </div>

                    <button
                        className={`play-btn ${isPlaying ? 'playing' : ''}`}
                        onClick={toggle}
                    >
                        {isPlaying ? '⏸ Pause' : '▶ Start'}
                    </button>

                    <button className="reset-btn" onClick={handleReset}>
                        ↻ Reset
                    </button>
                </div>
            </div>
        </section>
    );
}
