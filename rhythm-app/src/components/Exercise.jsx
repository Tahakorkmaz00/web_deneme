import { useState, useEffect, useRef, useCallback } from 'react';
import './Exercise.css';

export default function Exercise({ rhythm, onBack }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [bpm, setBpm] = useState(rhythm.bpm || 100);
    const [currentBeat, setCurrentBeat] = useState(0);
    const [currentChordIndex, setCurrentChordIndex] = useState(0);
    const [beatCount, setBeatCount] = useState(0);
    const [beatsPerMeasure] = useState(4);

    const audioContextRef = useRef(null);
    const intervalRef = useRef(null);
    const beatCountRef = useRef(0);
    const chordIndexRef = useRef(0);

    const totalBeatsForChord = useCallback((chordIdx) => {
        if (!rhythm.chords[chordIdx]) return 4;
        return rhythm.chords[chordIdx].repeat * beatsPerMeasure;
    }, [rhythm.chords, beatsPerMeasure]);

    // Create audio context
    const getAudioContext = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        return audioContextRef.current;
    }, []);

    // Play tick sound
    const playTick = useCallback((isAccent) => {
        try {
            const ctx = getAudioContext();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.frequency.setValueAtTime(isAccent ? 1000 : 700, ctx.currentTime);
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(isAccent ? 0.3 : 0.15, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.1);
        } catch (e) {
            // Audio not available
        }
    }, [getAudioContext]);

    // Main metronome loop
    const startMetronome = useCallback(() => {
        const intervalMs = (60 / bpm) * 1000;

        beatCountRef.current = 0;
        chordIndexRef.current = 0;
        setCurrentBeat(0);
        setCurrentChordIndex(0);
        setBeatCount(0);

        // Play first tick immediately
        playTick(true);

        intervalRef.current = setInterval(() => {
            beatCountRef.current++;
            const beatInMeasure = beatCountRef.current % beatsPerMeasure;
            const isAccent = beatInMeasure === 0;

            playTick(isAccent);
            setCurrentBeat(beatInMeasure);
            setBeatCount(beatCountRef.current);

            // Check if we need to switch chord
            const totalBeats = totalBeatsForChord(chordIndexRef.current);
            if (beatCountRef.current >= totalBeats) {
                beatCountRef.current = 0;
                setBeatCount(0);
                const nextChord = chordIndexRef.current + 1;
                if (nextChord >= rhythm.chords.length) {
                    chordIndexRef.current = 0;
                } else {
                    chordIndexRef.current = nextChord;
                }
                setCurrentChordIndex(chordIndexRef.current);
            }
        }, intervalMs);
    }, [bpm, beatsPerMeasure, playTick, totalBeatsForChord, rhythm.chords.length]);

    const stopMetronome = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const togglePlay = () => {
        if (isPlaying) {
            stopMetronome();
        } else {
            startMetronome();
        }
        setIsPlaying(!isPlaying);
    };

    const handleReset = () => {
        stopMetronome();
        setIsPlaying(false);
        setCurrentBeat(0);
        setCurrentChordIndex(0);
        setBeatCount(0);
        beatCountRef.current = 0;
        chordIndexRef.current = 0;
    };

    // Cleanup
    useEffect(() => {
        return () => {
            stopMetronome();
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, [stopMetronome]);

    // Restart metronome when BPM changes during play
    useEffect(() => {
        if (isPlaying) {
            stopMetronome();
            startMetronome();
        }
    }, [bpm]); // eslint-disable-line react-hooks/exhaustive-deps

    const currentChord = rhythm.chords[currentChordIndex];
    const totalBeats = totalBeatsForChord(currentChordIndex);
    const progress = totalBeats > 0 ? (beatCount / totalBeats) * 100 : 0;

    return (
        <section className="exercise-page">
            <div className="exercise-container">

                <div className="exercise-header">
                    <h1>🎯 Egzersiz Modu</h1>
                    <p className="exercise-song-title">{rhythm.title}</p>
                </div>

                {/* Main Metronome Display */}
                <div className="metronome-card">
                    {/* Current Chord - Big Display */}
                    <div className="chord-spotlight">
                        <div className={`chord-circle ${isPlaying ? 'playing' : ''}`}>
                            <span className="chord-letter">{currentChord?.name || '—'}</span>
                        </div>
                        <div className="chord-info">
                            <span className="chord-fullname">{currentChord?.fullName || currentChord?.name || ''}</span>
                            <span className="chord-remaining">
                                Tekrar: {Math.floor(beatCount / beatsPerMeasure) + 1} / {currentChord?.repeat || 1}
                            </span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="chord-progress-bar">
                        <div className="chord-progress-fill" style={{ width: `${Math.min(100, progress)}%` }}></div>
                    </div>

                    {/* Beat Indicators */}
                    <div className="beat-indicators">
                        {Array.from({ length: beatsPerMeasure }, (_, i) => (
                            <div
                                key={i}
                                className={`beat-dot ${i === currentBeat && isPlaying ? 'active' : ''} ${i === 0 ? 'accent' : ''}`}
                            >
                                {i + 1}
                            </div>
                        ))}
                    </div>

                    {/* Strum Pattern */}
                    <div className="exercise-strum">
                        <span className="strum-label">Ritim Kalıbı:</span>
                        <span className="strum-value">{rhythm.strumPattern}</span>
                    </div>

                    {/* Controls */}
                    <div className="metronome-controls">
                        <button className="control-btn reset-btn" onClick={handleReset}>
                            ⟲
                        </button>
                        <button className={`control-btn play-btn ${isPlaying ? 'playing' : ''}`} onClick={togglePlay}>
                            {isPlaying ? '⏸' : '▶'}
                        </button>
                    </div>

                    {/* BPM Control */}
                    <div className="bpm-section">
                        <span className="bpm-label">Tempo</span>
                        <div className="bpm-slider-row">
                            <button className="bpm-adj" onClick={() => setBpm(Math.max(40, bpm - 5))}>−5</button>
                            <button className="bpm-adj small" onClick={() => setBpm(Math.max(40, bpm - 1))}>−1</button>
                            <div className="bpm-display">{bpm} <small>BPM</small></div>
                            <button className="bpm-adj small" onClick={() => setBpm(Math.min(240, bpm + 1))}>+1</button>
                            <button className="bpm-adj" onClick={() => setBpm(Math.min(240, bpm + 5))}>+5</button>
                        </div>
                        <input
                            type="range"
                            min="40"
                            max="240"
                            value={bpm}
                            onChange={(e) => setBpm(parseInt(e.target.value))}
                            className="bpm-range"
                        />
                    </div>
                </div>

                {/* Chord Progression Overview */}
                <div className="progression-overview">
                    <h3>Akor Sıralaması</h3>
                    <div className="progression-chips">
                        {rhythm.chords.map((chord, index) => (
                            <div
                                key={index}
                                className={`prog-chip ${index === currentChordIndex ? 'current' : ''} ${index < currentChordIndex ? 'done' : ''}`}
                            >
                                <span className="chip-name">{chord.name}</span>
                                <span className="chip-repeat">×{chord.repeat}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
