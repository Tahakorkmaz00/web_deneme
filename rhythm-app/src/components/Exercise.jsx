import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './Exercise.css';

// ─── Time signature definitions ───────────────────────────────────────────────
// accentBeats: indices that get a medium accent (in addition to beat 0 = strong)
// groups: how beats are visually grouped (6/8 → [3,3], 7/8 → [3,2,2], etc.)
const TIME_SIGNATURES = [
    { label: '2/4',  beats: 2,  division: 4, accentBeats: [0],          groups: [2] },
    { label: '3/4',  beats: 3,  division: 4, accentBeats: [0],          groups: [3] },
    { label: '4/4',  beats: 4,  division: 4, accentBeats: [0],          groups: [4] },
    { label: '5/4',  beats: 5,  division: 4, accentBeats: [0, 3],       groups: [3, 2] },
    { label: '6/8',  beats: 6,  division: 8, accentBeats: [0, 3],       groups: [3, 3] },
    { label: '7/8',  beats: 7,  division: 8, accentBeats: [0, 3, 5],    groups: [3, 2, 2] },
    { label: '9/8',  beats: 9,  division: 8, accentBeats: [0, 3, 6],    groups: [3, 3, 3] },
    { label: '12/8', beats: 12, division: 8, accentBeats: [0, 3, 6, 9], groups: [3, 3, 3, 3] },
];

const DEFAULT_TS = TIME_SIGNATURES.find(ts => ts.label === '4/4');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getAccentLevel(beatIndex, ts) {
    if (beatIndex === 0) return 'strong';
    if (ts.accentBeats.includes(beatIndex)) return 'medium';
    return 'weak';
}

function parsePattern(pattern) {
    if (!pattern || !pattern.trim()) return [];
    return pattern.trim().split(/\s+/).filter(Boolean);
}

function getBeatType(symbol) {
    if (!symbol) return null;
    if (symbol === '↓') return 'down';
    if (symbol === '↑') return 'up';
    if (symbol === 'x' || symbol === 'X') return 'mute';
    if (symbol === '-' || symbol === '—' || symbol === '_') return 'rest';
    return 'down';
}

// Returns oscillator frequency or null (= silence)
function getTickFreq(accentLevel, beatType) {
    if (beatType === 'rest') return null;
    if (beatType === 'mute') return accentLevel === 'strong' ? 480 : 340;
    if (accentLevel === 'strong') return 1000;
    if (accentLevel === 'medium') return 780;
    return 580;
}

function getTickVolume(accentLevel) {
    if (accentLevel === 'strong') return 0.38;
    if (accentLevel === 'medium') return 0.22;
    return 0.12;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Exercise({ rhythm }) {
    const [timeSig, setTimeSig] = useState(() => {
        const saved = localStorage.getItem(`ts_${rhythm.id}`);
        return TIME_SIGNATURES.find(ts => ts.label === saved) || DEFAULT_TS;
    });

    const [isPlaying, setIsPlaying] = useState(false);
    const [bpm, setBpm] = useState(rhythm.bpm || 100);
    const [currentBeat, setCurrentBeat] = useState(0);
    const [currentChordIndex, setCurrentChordIndex] = useState(0);
    const [beatCount, setBeatCount] = useState(0);

    const patternSymbols = useMemo(() => parsePattern(rhythm.strumPattern), [rhythm.strumPattern]);
    const beatsPerMeasure = timeSig.beats;

    const audioCtxRef = useRef(null);
    const intervalRef = useRef(null);
    const beatCountRef = useRef(0);
    const chordIdxRef = useRef(0);

    // ── Audio ──────────────────────────────────────────────────────────────────

    const getAudioCtx = useCallback(() => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        return audioCtxRef.current;
    }, []);

    const playTick = useCallback((beatIndex, beatSymbol, accentLevel) => {
        const beatType = getBeatType(beatSymbol);
        const freq = getTickFreq(accentLevel, beatType);
        if (freq === null) return;
        try {
            const ctx = getAudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            const isMute = beatType === 'mute';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            osc.type = isMute ? 'square' : 'sine';

            const vol = getTickVolume(accentLevel);
            gain.gain.setValueAtTime(vol, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (isMute ? 0.04 : 0.1));

            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.13);
        } catch (_) {}
    }, [getAudioCtx]);

    // ── Metronome core ─────────────────────────────────────────────────────────

    const totalBeatsForChord = useCallback((chordIdx) => {
        if (!rhythm.chords[chordIdx]) return beatsPerMeasure;
        return rhythm.chords[chordIdx].repeat * beatsPerMeasure;
    }, [rhythm.chords, beatsPerMeasure]);

    const stopMetronome = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const startMetronome = useCallback(() => {
        const intervalMs = (60 / bpm) * (4 / timeSig.division) * 1000;
        beatCountRef.current = 0;
        chordIdxRef.current = 0;
        setCurrentBeat(0);
        setCurrentChordIndex(0);
        setBeatCount(0);

        // First tick immediately
        const firstSymbol = patternSymbols[0] ?? null;
        playTick(0, firstSymbol, 'strong');

        intervalRef.current = setInterval(() => {
            beatCountRef.current++;
            const beatInMeasure = beatCountRef.current % beatsPerMeasure;
            const accentLevel = getAccentLevel(beatInMeasure, timeSig);
            const symbol = patternSymbols.length > 0
                ? patternSymbols[beatInMeasure % patternSymbols.length]
                : null;

            playTick(beatInMeasure, symbol, accentLevel);
            setCurrentBeat(beatInMeasure);
            setBeatCount(beatCountRef.current);

            // Chord switching
            const total = totalBeatsForChord(chordIdxRef.current);
            if (beatCountRef.current >= total) {
                beatCountRef.current = 0;
                setBeatCount(0);
                const next = chordIdxRef.current + 1;
                chordIdxRef.current = next >= rhythm.chords.length ? 0 : next;
                setCurrentChordIndex(chordIdxRef.current);
            }
        }, intervalMs);
    }, [bpm, beatsPerMeasure, timeSig, patternSymbols, playTick, totalBeatsForChord, rhythm.chords.length]);

    // ── Handlers ───────────────────────────────────────────────────────────────

    const togglePlay = () => {
        if (isPlaying) {
            stopMetronome();
            setIsPlaying(false);
        } else {
            startMetronome();
            setIsPlaying(true);
        }
    };

    const handleReset = () => {
        stopMetronome();
        setIsPlaying(false);
        setCurrentBeat(0);
        setCurrentChordIndex(0);
        setBeatCount(0);
        beatCountRef.current = 0;
        chordIdxRef.current = 0;
    };

    const handleTimeSigChange = (ts) => {
        stopMetronome();
        setIsPlaying(false);
        setTimeSig(ts);
        setCurrentBeat(0);
        setCurrentChordIndex(0);
        setBeatCount(0);
        beatCountRef.current = 0;
        chordIdxRef.current = 0;
        localStorage.setItem(`ts_${rhythm.id}`, ts.label);
    };

    // ── Effects ────────────────────────────────────────────────────────────────

    useEffect(() => {
        return () => {
            stopMetronome();
            if (audioCtxRef.current) audioCtxRef.current.close();
        };
    }, [stopMetronome]);

    // Restart when BPM changes mid-play
    useEffect(() => {
        if (isPlaying) {
            stopMetronome();
            startMetronome();
        }
    }, [bpm]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Derived display values ─────────────────────────────────────────────────

    const currentChord = rhythm.chords[currentChordIndex];
    const totalBeats = totalBeatsForChord(currentChordIndex);
    const progress = totalBeats > 0 ? (beatCount / totalBeats) * 100 : 0;

    // Build grouped beat dots
    const beatGroups = useMemo(() => {
        const groups = [];
        let idx = 0;
        for (const groupSize of timeSig.groups) {
            const group = [];
            for (let i = 0; i < groupSize; i++) {
                const bi = idx++;
                const symbol = patternSymbols.length > 0
                    ? patternSymbols[bi % patternSymbols.length]
                    : null;
                group.push({ index: bi, symbol, accentLevel: getAccentLevel(bi, timeSig) });
            }
            groups.push(group);
        }
        return groups;
    }, [timeSig, patternSymbols]);

    // ── Render ─────────────────────────────────────────────────────────────────

    return (
        <section className="exercise-page">
            <div className="exercise-container">

                <div className="exercise-header">
                    <h1>Egzersiz Modu</h1>
                    <p className="exercise-song-title">{rhythm.title}</p>
                </div>

                <div className="metronome-card">

                    {/* Current Chord */}
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
                        <div className="chord-progress-fill" style={{ width: `${Math.min(100, progress)}%` }} />
                    </div>

                    {/* ── Time Signature Selector ── */}
                    <div className="ts-selector">
                        <span className="ts-selector-label">Ölçü (Zaman İmzası)</span>
                        <div className="ts-grid">
                            {TIME_SIGNATURES.map(ts => (
                                <button
                                    key={ts.label}
                                    className={`ts-btn${timeSig.label === ts.label ? ' active' : ''}`}
                                    onClick={() => handleTimeSigChange(ts)}
                                    title={ts.label}
                                >
                                    {ts.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Beat Indicators (grouped) ── */}
                    <div className="beat-groups-wrap">
                        {beatGroups.map((group, gi) => (
                            <div key={gi} className="beat-group">
                                {group.map(({ index, symbol, accentLevel }) => {
                                    const type = getBeatType(symbol);
                                    const isActive = index === currentBeat && isPlaying;
                                    const cls = [
                                        'beat-dot',
                                        type ? `beat-${type}` : '',
                                        `accent-${accentLevel}`,
                                        isActive ? 'active' : '',
                                    ].filter(Boolean).join(' ');

                                    return (
                                        <div key={index} className={cls}>
                                            <span className="beat-num">{index + 1}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    {/* Controls */}
                    <div className="metronome-controls">
                        <button className="control-btn reset-btn" onClick={handleReset}>⟲</button>
                        <button
                            className={`control-btn play-btn${isPlaying ? ' playing' : ''}`}
                            onClick={togglePlay}
                        >
                            {isPlaying ? '⏸' : '▶'}
                        </button>
                    </div>

                    {/* BPM */}
                    <div className="bpm-section">
                        <span className="bpm-label">Tempo</span>
                        <div className="bpm-slider-row">
                            <button className="bpm-adj" onClick={() => setBpm(b => Math.max(40, b - 5))}>−5</button>
                            <button className="bpm-adj small" onClick={() => setBpm(b => Math.max(40, b - 1))}>−1</button>
                            <div className="bpm-display">{bpm} <small>BPM</small></div>
                            <button className="bpm-adj small" onClick={() => setBpm(b => Math.min(240, b + 1))}>+1</button>
                            <button className="bpm-adj" onClick={() => setBpm(b => Math.min(240, b + 5))}>+5</button>
                        </div>
                        <input
                            type="range" min="40" max="240" value={bpm}
                            onChange={e => setBpm(parseInt(e.target.value))}
                            className="bpm-range"
                        />
                    </div>
                </div>

                {/* Chord Progression */}
                <div className="progression-overview">
                    <h3>Akor Sıralaması</h3>
                    <div className="progression-chips">
                        {rhythm.chords.map((chord, index) => (
                            <div
                                key={index}
                                className={`prog-chip${index === currentChordIndex ? ' current' : ''}${index < currentChordIndex ? ' done' : ''}`}
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
