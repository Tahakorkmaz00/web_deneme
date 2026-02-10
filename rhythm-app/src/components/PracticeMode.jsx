import { useMetronome } from '../hooks/useMetronome';
import './PracticeMode.css';

export default function PracticeMode({ results, selectedRhythmIndex, onExit }) {
    if (!results) return null;

    const rhythm = results.rhythms[selectedRhythmIndex];
    const estimatedBPM = results.estimatedBPM;

    const timeSignature = rhythm.timeSignature || [4, 4];
    const grouping = rhythm.grouping || [1, 1, 1, 1];

    const { bpm, isPlaying, currentBeat, toggle, adjustBPM } = useMetronome(estimatedBPM, timeSignature, grouping);

    const strumChars = rhythm.pattern.split(' ').filter(s => s);
    const beatsPerMeasure = timeSignature[0];

    return (
        <section className="practice-screen">
            {/* Top Bar */}
            <div className="practice-topbar">
                <button className="back-btn" onClick={onExit}>
                    ← Geri
                </button>
                <div className="topbar-info">
                    <h1 className="rhythm-title">{rhythm.name}</h1>
                    <div className="rhythm-tags">
                        <span className="tag tag-feel">{rhythm.feel}</span>
                        <span className="tag tag-time">{timeSignature[0]}/{timeSignature[1]}</span>
                    </div>
                </div>
            </div>

            <div className="practice-content">
                {/* BPM & Controls - Compact Top Section */}
                <div className="metronome-strip">
                    <button className="bpm-btn" onClick={() => adjustBPM(-5)}>−5</button>
                    <button className="bpm-btn" onClick={() => adjustBPM(-1)}>−1</button>
                    <div className="bpm-center">
                        <span className="bpm-number">{bpm}</span>
                        <span className="bpm-label">BPM</span>
                    </div>
                    <button className="bpm-btn" onClick={() => adjustBPM(1)}>+1</button>
                    <button className="bpm-btn" onClick={() => adjustBPM(5)}>+5</button>
                </div>

                {/* Beat Indicators */}
                <div className="beat-track" style={{
                    gridTemplateColumns: `repeat(${beatsPerMeasure}, 1fr)`
                }}>
                    {Array.from({ length: beatsPerMeasure }, (_, i) => i + 1).map(beat => {
                        let isStrong = false;
                        if (beat === 1) isStrong = true;
                        else {
                            let acc = 0;
                            for (let g of grouping) {
                                acc += g;
                                if (beat === acc + 1) isStrong = true;
                            }
                        }
                        return (
                            <div
                                key={beat}
                                className={`beat-pip ${currentBeat === beat && isPlaying ? 'active' : ''} ${isStrong ? 'strong' : ''}`}
                            >
                                {beat}
                            </div>
                        );
                    })}
                </div>

                {/* Play Button */}
                <button
                    className={`play-btn-main ${isPlaying ? 'playing' : ''}`}
                    onClick={toggle}
                >
                    <span className="play-icon">{isPlaying ? '⏸' : '▶'}</span>
                    <span>{isPlaying ? 'Durdur' : 'Başlat'}</span>
                </button>

                {/* === MAIN RHYTHM PATTERN === */}
                <div className="pattern-stage">
                    <div className="pattern-symbols">
                        {strumChars.map((symbol, idx) => {
                            const totalBeats = Math.max(1, beatsPerMeasure);
                            const totalSymbols = Math.max(1, strumChars.length);
                            const beatNumber = Math.floor((idx * totalBeats) / totalSymbols) + 1;
                            const isActive = currentBeat === beatNumber && isPlaying;

                            const isMute = symbol.toLowerCase().includes('x');
                            const isAccent = symbol.includes('>');
                            const isRest = symbol === '.';

                            // ✕ for rest, original symbol for others
                            let displaySymbol;
                            if (isRest) {
                                displaySymbol = '✕';
                            } else {
                                displaySymbol = symbol.replace('>', '');
                            }

                            return (
                                <div
                                    key={idx}
                                    className={`strum-slot ${isActive ? 'active' : ''} ${isMute ? 'mute' : ''} ${isAccent ? 'accent' : ''} ${isRest ? 'rest' : ''}`}
                                >
                                    <div className="strum-char">{displaySymbol}</div>
                                    <div className="strum-beat">{beatNumber}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Tip */}
                <div className="practice-tip">
                    <span className="tip-icon">💡</span>
                    <p>{rhythm.practice_tip}</p>
                </div>

                {/* Info Cards */}
                <div className="info-cards">
                    {rhythm.switch_practice && (
                        <div className="info-card">
                            <div className="info-card-label">🎸 Akor Geçişi</div>
                            <div className="info-card-value">{rhythm.switch_practice}</div>
                        </div>
                    )}
                    {rhythm.similar_songs && (
                        <div className="info-card">
                            <div className="info-card-label">🎵 Benzer Şarkılar</div>
                            <div className="info-card-value">{rhythm.similar_songs}</div>
                        </div>
                    )}
                    <div className="info-card">
                        <div className="info-card-label">⚡ BPM Aralığı</div>
                        <div className="info-card-value">{rhythm.bpm[0]} – {rhythm.bpm[1]}</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
