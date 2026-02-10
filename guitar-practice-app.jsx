import { useState, useEffect, useRef, useCallback } from "react";

const rhythmLibrary = [
  { id:1,  name:'Basic Downstroke',       pattern:'↓ ↓ ↓ ↓',         bpm:[70,100],  feel:'steady / folk',       tip:'Lock each downstroke directly to the beat. Focus on timing, not volume.' },
  { id:2,  name:'Folk Rock Basic',        pattern:'↓ ↓↑ ↓ ↓',        bpm:[80,110],  feel:'pop / folk',          tip:'Keep upstrokes lighter than downstrokes for clarity.' },
  { id:3,  name:'Pop 8th Groove',         pattern:'↓ ↓↑ ↓↑ ↓↑',      bpm:[85,115],  feel:'flowing / pop',       tip:'Maintain constant hand motion, even during silent strokes.' },
  { id:4,  name:'Classic Pop Strum',      pattern:'↓  ↓↑  ↓',        bpm:[75,105],  feel:'relaxed / pop',       tip:'Accent the first downstroke of each bar.' },
  { id:5,  name:'Pop Rock Driver',        pattern:'↓ ↓ ↓↑ ↓',        bpm:[90,120],  feel:'driving / rock',      tip:'Lean slightly into beats 2 and 4 for groove.' },
  { id:6,  name:'Essential Pop Groove',   pattern:'↓  ↓↑  ↓↑',       bpm:[85,110],  feel:'modern pop',          tip:'Relax your wrist and avoid over-accenting upstrokes.' },
  { id:7,  name:'Campfire Classic',       pattern:'↓ ↓↑ ↓ ↑',        bpm:[80,100],  feel:'easy-going',          tip:'Use light palm muting if it feels too busy.' },
  { id:8,  name:'Rock Eighths',           pattern:'↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓', bpm:[100,130], feel:'straight rock',       tip:'Think like a drummer—consistent and aggressive.' },
  { id:9,  name:'Syncopated Pop',         pattern:'↓ ↑ ↓ ↓↑ ↓',      bpm:[85,110],  feel:'groovy / syncopated', tip:'Focus on accents rather than speed.' },
  { id:10, name:'Ballad Flow',            pattern:'↓  ↓↑  ↓  ↓↑',    bpm:[65,90],   feel:'smooth / emotional',  tip:'Strum closer to the neck for a warmer tone.' },
  { id:11, name:'Indie Pop Pulse',        pattern:'↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑', bpm:[95,120],  feel:'indie / modern',      tip:'Control dynamics—avoid hitting every stroke equally.' },
  { id:12, name:'Soft Groove Pop',        pattern:'↓ ↑  ↓↑  ↓',      bpm:[80,105],  feel:'laid-back',           tip:'Ghost weaker beats slightly for groove.' },
  { id:13, name:'Singer-Songwriter Core', pattern:'↓ ↓ ↑ ↓ ↑',       bpm:[75,100],  feel:'intimate',            tip:'Let vocals lead—keep guitar supportive.' },
  { id:14, name:'Pop Drive Sync',         pattern:'↓  ↓↑  ↓ ↑',      bpm:[90,115],  feel:'dynamic pop',         tip:'Stay loose; tension kills groove.' },
  { id:15, name:'Universal Pop Strum',    pattern:'↓ ↓↑ ↓↑ ↑',       bpm:[85,110],  feel:'mainstream pop',      tip:'Feel the groove first, pattern second.' }
];

export default function GuitarPractice() {
  const [screen, setScreen] = useState('hero');
  const [selectedRhythm, setSelectedRhythm] = useState(null);
  const [chordInput, setChordInput] = useState('');
  const [bpm, setBpm] = useState(92);
  const [barsPerChord, setBarsPerChord] = useState(2);
  const [beatsPerBar] = useState(4);
  const [filter, setFilter] = useState('');

  // Practice state
  const [chords, setChords] = useState([]);
  const [currentChordIdx, setCurrentChordIdx] = useState(0);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [currentBar, setCurrentBar] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Repertoire
  const [repertoire, setRepertoire] = useState([]);
  const [exerciseName, setExerciseName] = useState('');
  const [toast, setToast] = useState('');

  const audioCtxRef = useRef(null);
  const intervalRef = useRef(null);
  const stateRef = useRef({ currentBeat: 0, currentBar: 0, currentChordIdx: 0 });

  // Keep ref in sync
  useEffect(() => {
    stateRef.current = { currentBeat, currentBar, currentChordIdx };
  }, [currentBeat, currentBar, currentChordIdx]);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  }, []);

  const playClick = useCallback((isStrong) => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = isStrong ? 880 : 1100;
    gain.gain.value = isStrong ? 0.28 : 0.12;
    const t = ctx.currentTime;
    osc.start(t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    osc.stop(t + 0.08);
  }, []);

  const stopPlay = useCallback(() => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCurrentBeat(0);
  }, []);

  const startPlay = useCallback((chordsArr, bpmVal, barsVal) => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    setIsPlaying(true);
    let beat = 0, bar = 0, chordIdx = 0;
    setCurrentBeat(1);
    setCurrentBar(0);
    setCurrentChordIdx(0);

    playClick(true);

    const ms = (60 / bpmVal) * 1000;
    intervalRef.current = setInterval(() => {
      beat++;
      if (beat >= 4) {
        beat = 0;
        bar++;
        if (bar >= barsVal) {
          bar = 0;
          chordIdx = (chordIdx + 1) % chordsArr.length;
          setCurrentChordIdx(chordIdx);
        }
        setCurrentBar(bar);
      }
      const beatNum = beat + 1;
      setCurrentBeat(beatNum);
      playClick(beatNum === 1);
    }, ms);
  }, [playClick]);

  const launchPractice = () => {
    if (!selectedRhythm) { showToast('Select a rhythm first'); return; }
    const raw = chordInput.trim();
    if (!raw) { showToast('Enter at least one chord'); return; }
    const parsed = raw.split(/[\s,–—\-]+/).filter(c => c.length > 0);
    if (!parsed.length) { showToast('Enter at least one chord'); return; }
    setChords(parsed);
    setCurrentChordIdx(0);
    setCurrentBeat(0);
    setCurrentBar(0);
    setExerciseName('');
    setScreen('practice');
  };

  const exitPractice = () => {
    stopPlay();
    setScreen('setup');
  };

  const adjustBPM = (delta) => {
    const newBpm = Math.max(40, Math.min(200, bpm + delta));
    setBpm(newBpm);
    if (isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      let beat = stateRef.current.currentBeat - 1;
      let bar = stateRef.current.currentBar;
      let chordIdx = stateRef.current.currentChordIdx;

      const ms = (60 / newBpm) * 1000;
      intervalRef.current = setInterval(() => {
        beat++;
        if (beat >= 4) {
          beat = 0;
          bar++;
          if (bar >= barsPerChord) {
            bar = 0;
            chordIdx = (chordIdx + 1) % chords.length;
            setCurrentChordIdx(chordIdx);
          }
          setCurrentBar(bar);
        }
        const beatNum = beat + 1;
        setCurrentBeat(beatNum);
        playClick(beatNum === 1);
      }, ms);
    }
  };

  const saveExercise = () => {
    if (!exerciseName.trim()) { showToast('Give your exercise a name'); return; }
    const entry = {
      id: Date.now(),
      name: exerciseName.trim(),
      chords: [...chords],
      rhythmId: selectedRhythm.id,
      rhythmName: selectedRhythm.name,
      pattern: selectedRhythm.pattern,
      bpm,
      barsPerChord
    };
    setRepertoire(prev => [...prev, entry]);
    setExerciseName('');
    showToast('Saved to repertoire');
  };

  const loadExercise = (ex) => {
    const rhythm = rhythmLibrary.find(r => r.id === ex.rhythmId);
    if (!rhythm) return;
    stopPlay();
    setSelectedRhythm(rhythm);
    setChords([...ex.chords]);
    setBpm(ex.bpm);
    setBarsPerChord(ex.barsPerChord);
    setCurrentChordIdx(0);
    setCurrentBeat(0);
    setCurrentBar(0);
    setExerciseName('');
    setScreen('practice');
  };

  const deleteExercise = (id) => {
    setRepertoire(prev => prev.filter(r => r.id !== id));
    showToast('Exercise removed');
  };

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e) => {
      if (e.code === 'Space' && screen === 'practice' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        if (isPlaying) stopPlay();
        else startPlay(chords, bpm, barsPerChord);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [screen, isPlaying, chords, bpm, barsPerChord, stopPlay, startPlay]);

  // Cleanup on unmount
  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const filtered = rhythmLibrary.filter(r => {
    const lf = filter.toLowerCase();
    return r.name.toLowerCase().includes(lf) || r.feel.toLowerCase().includes(lf);
  });

  const nextChordIdx = chords.length > 1 ? (currentChordIdx + 1) % chords.length : -1;

  return (
    <div style={{ minHeight:'100vh', background:'#06080a', color:'#f0f0f0', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
      {/* Header */}
      <div style={{ position:'sticky', top:0, zIndex:100, background:'rgba(6,8,10,0.92)', backdropFilter:'blur(12px)', borderBottom:'1px solid #1e2228', padding:'14px 20px' }}>
        <div style={{ maxWidth:1000, margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <div style={{ fontSize:'1.6rem', fontWeight:900, letterSpacing:3, color:'#ff6b35', fontFamily:"'Bebas Neue',system-ui,sans-serif" }}>RHYTHM PRACTICE</div>
          <div style={{ display:'flex', gap:4, background:'#0f1215', border:'1px solid #1e2228', borderRadius:10, padding:3 }}>
            {['Home','Repertoire'].map((t, i) => (
              <button key={t} onClick={() => { stopPlay(); setScreen(i === 0 ? 'hero' : 'repertoire'); }}
                style={{ padding:'7px 18px', fontSize:'0.82rem', fontWeight:600, border:'none', borderRadius:7, cursor:'pointer',
                  background: (screen === 'hero' && i === 0) || (screen === 'repertoire' && i === 1) ? '#ff6b35' : 'transparent',
                  color: (screen === 'hero' && i === 0) || (screen === 'repertoire' && i === 1) ? '#fff' : '#6b7280',
                  fontFamily:'inherit', transition:'all 0.2s' }}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1000, margin:'0 auto', padding:'0 20px' }}>

        {/* ─── HERO ─── */}
        {screen === 'hero' && (
          <div style={{ textAlign:'center', padding:'100px 0 80px' }}>
            <h1 style={{ fontSize:'clamp(2.5rem,8vw,4.5rem)', fontWeight:900, lineHeight:1.05, marginBottom:18, letterSpacing:1 }}>
              Practice rhythm.<br/>
              <span style={{ background:'linear-gradient(135deg,#ff6b35,#00ff9f)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Build muscle memory.</span>
            </h1>
            <p style={{ fontSize:'1.05rem', color:'#6b7280', maxWidth:520, margin:'0 auto 40px', lineHeight:1.6 }}>
              Loop strumming patterns over your own chords. Stay on beat. Build timing and consistency, one bar at a time.
            </p>
            <button onClick={() => setScreen('setup')}
              style={{ background:'#ff6b35', color:'#fff', border:'none', padding:'16px 44px', fontSize:'1rem', fontWeight:700, borderRadius:12, cursor:'pointer', letterSpacing:1, textTransform:'uppercase', boxShadow:'0 8px 32px rgba(255,107,53,0.25)', fontFamily:'inherit' }}>
              Start Practice Session
            </button>
          </div>
        )}

        {/* ─── SETUP ─── */}
        {screen === 'setup' && (
          <div style={{ padding:'50px 0 80px' }}>
            <div style={{ background:'#0f1215', borderRadius:24, padding:'clamp(24px,4vw,44px)', border:'1px solid #1e2228' }}>

              <StepLabel num={1} text="Select Rhythm" />
              <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filter rhythms…"
                style={{ ...inputStyle, marginBottom:12, width:'100%' }} />
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))', gap:10 }}>
                {filtered.map(r => (
                  <div key={r.id} onClick={() => { setSelectedRhythm(r); setBpm(Math.floor((r.bpm[0]+r.bpm[1])/2)); }}
                    style={{ padding:'12px 14px', background: selectedRhythm?.id === r.id ? 'rgba(255,107,53,0.12)' : '#161a1e',
                      border: `2px solid ${selectedRhythm?.id === r.id ? '#ff6b35' : '#1e2228'}`, borderRadius:10, cursor:'pointer', transition:'all 0.2s' }}>
                    <div style={{ fontWeight:700, fontSize:'0.88rem', marginBottom:4 }}>{r.name}</div>
                    <div style={{ fontFamily:'monospace', fontSize:'1.02rem', color:'#ff6b35', letterSpacing:1, marginBottom:4 }}>{r.pattern}</div>
                    <div style={{ fontSize:'0.76rem', color:'#6b7280' }}>{r.feel} · {r.bpm[0]}–{r.bpm[1]} BPM</div>
                  </div>
                ))}
              </div>

              <div style={{ height:1, background:'#1e2228', margin:'28px 0' }} />

              <StepLabel num={2} text="Enter Your Chords" />
              <p style={{ fontSize:'0.84rem', color:'#6b7280', marginBottom:10 }}>Type chords separated by spaces or commas. They'll loop in order.</p>
              <input value={chordInput} onChange={e => setChordInput(e.target.value)} placeholder="e.g.  C  G  Am  F"
                style={{ ...inputStyle, width:'100%' }} />

              <div style={{ height:1, background:'#1e2228', margin:'28px 0' }} />

              <StepLabel num={3} text="Settings" />
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))', gap:16, marginTop:10 }}>
                <div>
                  <label style={{ display:'block', fontSize:'0.82rem', fontWeight:600, color:'#6b7280', marginBottom:6 }}>BPM</label>
                  <input type="number" value={bpm} onChange={e => setBpm(Math.max(40,Math.min(200,+e.target.value||92)))} min={40} max={200}
                    style={{ ...inputStyle, width:'100%' }} />
                </div>
                <div>
                  <label style={{ display:'block', fontSize:'0.82rem', fontWeight:600, color:'#6b7280', marginBottom:6 }}>Bars per Chord</label>
                  <select value={barsPerChord} onChange={e => setBarsPerChord(+e.target.value)}
                    style={{ ...inputStyle, width:'100%', cursor:'pointer' }}>
                    {[1,2,4,8].map(n => <option key={n} value={n}>{n} bar{n>1?'s':''}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display:'flex', gap:10, marginTop:32, flexWrap:'wrap' }}>
                <button onClick={launchPractice}
                  style={{ background:'#ff6b35', color:'#fff', border:'none', padding:'14px 36px', fontWeight:700, borderRadius:10, cursor:'pointer', fontSize:'0.95rem', fontFamily:'inherit', letterSpacing:1 }}>
                  Start Practice
                </button>
                <button onClick={() => setScreen('hero')}
                  style={{ background:'transparent', border:'2px solid #1e2228', color:'#f0f0f0', padding:'12px 24px', borderRadius:10, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── PRACTICE ─── */}
        {screen === 'practice' && selectedRhythm && (
          <div style={{ padding:'36px 0 80px' }}>
            <div style={{ background:'#0f1215', borderRadius:24, padding:'clamp(24px,4vw,40px)', border:'1px solid #1e2228', maxWidth:800, margin:'0 auto' }}>

              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28, flexWrap:'wrap', gap:12 }}>
                <button onClick={exitPractice}
                  style={{ background:'transparent', border:'2px solid #1e2228', color:'#f0f0f0', padding:'10px 20px', borderRadius:8, fontWeight:600, cursor:'pointer', fontFamily:'inherit', fontSize:'0.85rem' }}>
                  ← Back
                </button>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:'0.75rem', color:'#6b7280', textTransform:'uppercase', letterSpacing:1, marginBottom:2 }}>Rhythm</div>
                  <div style={{ fontSize:'1.3rem', fontWeight:900, color:'#00ff9f', letterSpacing:1 }}>{selectedRhythm.name}</div>
                </div>
              </div>

              {/* Chord pills */}
              <div style={{ display:'flex', justifyContent:'center', gap:8, flexWrap:'wrap', marginBottom:8 }}>
                {chords.map((c, i) => (
                  <div key={i} style={{ padding:'5px 16px', borderRadius:20, fontWeight:600, fontSize:'0.88rem', transition:'all 0.25s',
                    border: `2px solid ${i === currentChordIdx ? '#ff6b35' : i === nextChordIdx ? '#2d333b' : '#1e2228'}`,
                    background: i === currentChordIdx ? 'rgba(255,107,53,0.12)' : '#06080a',
                    color: i === currentChordIdx ? '#ff6b35' : i === nextChordIdx ? '#f0f0f0' : '#6b7280' }}>
                    {c}
                  </div>
                ))}
              </div>

              {/* Current chord */}
              <div style={{ textAlign:'center', padding:'20px 0 8px' }}>
                <div key={`${currentChordIdx}-${currentBar}`}
                  style={{ fontSize:'clamp(4rem,12vw,6.5rem)', fontWeight:900, color:'#ff6b35', letterSpacing:4, lineHeight:1,
                    animation:'pulse 0.25s ease-out' }}>
                  {chords[currentChordIdx] || '–'}
                </div>
                <div style={{ fontSize:'0.82rem', color:'#6b7280', marginTop:6, fontFamily:'monospace' }}>
                  Bar {currentBar + 1} / {barsPerChord}
                </div>
              </div>

              {/* Pattern */}
              <div style={{ textAlign:'center', fontFamily:'monospace', fontSize:'clamp(1.6rem,4vw,2.4rem)', letterSpacing:5, margin:'24px 0',
                color:'#00ff9f', padding:'14px', background:'rgba(0,255,159,0.06)', borderRadius:10 }}>
                {selectedRhythm.pattern}
              </div>

              {/* Beat indicators */}
              <div style={{ display:'flex', justifyContent:'center', gap:12, margin:'24px 0' }}>
                {[1,2,3,4].map(b => (
                  <div key={b} style={{ width:52, height:52, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:'1.1rem', fontWeight:700, transition:'all 0.1s',
                    background: currentBeat === b ? (b === 1 ? '#fff' : '#ff6b35') : '#06080a',
                    border: `2px solid ${currentBeat === b ? (b === 1 ? '#fff' : '#ff6b35') : '#1e2228'}`,
                    color: currentBeat === b ? (b === 1 ? '#06080a' : '#fff') : '#3d4450',
                    transform: currentBeat === b ? 'scale(1.18)' : 'scale(1)',
                    boxShadow: currentBeat === b ? `0 0 20px ${b === 1 ? 'rgba(255,255,255,0.2)' : 'rgba(255,107,53,0.35)'}` : 'none' }}>
                    {b}
                  </div>
                ))}
              </div>

              {/* Controls */}
              <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:28, margin:'24px 0', flexWrap:'wrap' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <button onClick={() => adjustBPM(-5)} style={bpmBtnStyle}>−</button>
                  <div style={{ textAlign:'center', minWidth:70 }}>
                    <div style={{ fontSize:'2.2rem', fontWeight:900, color:'#ff6b35', lineHeight:1 }}>{bpm}</div>
                    <div style={{ fontSize:'0.68rem', color:'#6b7280', textTransform:'uppercase', letterSpacing:1 }}>BPM</div>
                  </div>
                  <button onClick={() => adjustBPM(5)} style={bpmBtnStyle}>+</button>
                </div>

                <button onClick={() => isPlaying ? stopPlay() : startPlay(chords, bpm, barsPerChord)}
                  style={{ width:70, height:70, borderRadius:'50%', border:'none', fontSize:'1.6rem', cursor:'pointer', transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center',
                    background: isPlaying ? '#fff' : '#ff6b35',
                    color: isPlaying ? '#06080a' : '#fff',
                    boxShadow: isPlaying ? '0 8px 24px rgba(255,255,255,0.12)' : '0 8px 28px rgba(255,107,53,0.3)' }}>
                  {isPlaying ? '⏸' : '▶'}
                </button>
              </div>

              {/* Tip */}
              <div style={{ textAlign:'center', padding:'10px 14px', background:'rgba(0,255,159,0.06)', borderRadius:10, color:'#00ff9f', fontSize:'0.88rem', marginTop:20, border:'1px solid rgba(0,255,159,0.08)' }}>
                {selectedRhythm.tip}
              </div>

              {/* Save */}
              <div style={{ display:'flex', gap:8, marginTop:20, flexWrap:'wrap' }}>
                <input value={exerciseName} onChange={e => setExerciseName(e.target.value)} placeholder="Name this exercise…"
                  style={{ ...inputStyle, flex:1, minWidth:160 }} />
                <button onClick={saveExercise}
                  style={{ padding:'12px 22px', background:'#00ff9f', color:'#06080a', border:'none', borderRadius:10, fontWeight:700, fontSize:'0.84rem', cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap' }}>
                  Save to Repertoire
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── REPERTOIRE ─── */}
        {screen === 'repertoire' && (
          <div style={{ padding:'50px 0 80px' }}>
            <h2 style={{ fontSize:'2rem', fontWeight:900, textAlign:'center', marginBottom:28, letterSpacing:2 }}>Your Repertoire</h2>
            {repertoire.length === 0 ? (
              <div style={{ textAlign:'center', padding:'60px 20px', color:'#6b7280' }}>
                <div style={{ fontSize:'2.5rem', marginBottom:12, opacity:0.4 }}>🎸</div>
                <p>No saved exercises yet.</p>
                <p style={{ fontSize:'0.88rem', marginTop:6 }}>Start a practice session and save it here.</p>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:10, maxWidth:800, margin:'0 auto' }}>
                {repertoire.map(r => (
                  <div key={r.id} style={{ background:'#0f1215', border:'1px solid #1e2228', borderRadius:16, padding:'16px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', gap:14, flexWrap:'wrap' }}>
                    <div style={{ flex:1, minWidth:180 }}>
                      <div style={{ fontWeight:700, fontSize:'1rem', marginBottom:3 }}>{r.name}</div>
                      <div style={{ fontSize:'0.8rem', color:'#6b7280' }}>
                        {r.chords.join(' – ')} &nbsp;·&nbsp; {r.bpm} BPM &nbsp;·&nbsp; {r.barsPerChord} bar{r.barsPerChord>1?'s':''}/chord
                      </div>
                      <div style={{ fontFamily:'monospace', color:'#ff6b35', fontSize:'0.85rem', marginTop:4 }}>{r.rhythmName}: {r.pattern}</div>
                    </div>
                    <div style={{ display:'flex', gap:6 }}>
                      <button onClick={() => loadExercise(r)}
                        style={{ padding:'7px 16px', background:'#ff6b35', color:'#fff', border:'none', borderRadius:7, fontWeight:600, fontSize:'0.78rem', cursor:'pointer', fontFamily:'inherit' }}>
                        Load
                      </button>
                      <button onClick={() => deleteExercise(r.id)}
                        style={{ padding:'7px 14px', background:'transparent', border:'1px solid #1e2228', color:'#6b7280', borderRadius:7, fontWeight:600, fontSize:'0.78rem', cursor:'pointer', fontFamily:'inherit' }}>
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position:'fixed', bottom:28, left:'50%', transform:'translateX(-50%)', background:'#161a1e', border:'1px solid #00ff9f', color:'#00ff9f', padding:'10px 24px', borderRadius:10, fontWeight:600, fontSize:'0.88rem', zIndex:1000, animation:'fadeUp 0.3s ease-out' }}>
          {toast}
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%{transform:scale(0.92);opacity:0.6} 100%{transform:scale(1);opacity:1} }
        @keyframes fadeUp { from{opacity:0;transform:translateX(-50%) translateY(16px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        input:focus, select:focus { outline:none; border-color:#ff6b35 !important; }
        button:hover { opacity:0.92; }
      `}</style>
    </div>
  );
}

function StepLabel({ num, text }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
      <div style={{ width:26, height:26, background:'#ff6b35', color:'#fff', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem', fontWeight:700 }}>{num}</div>
      <div style={{ fontSize:'1.2rem', fontWeight:900, letterSpacing:2, color:'#ff6b35', textTransform:'uppercase' }}>{text}</div>
    </div>
  );
}

const inputStyle = {
  padding:'12px 16px', fontSize:'0.92rem', background:'#06080a', border:'2px solid #1e2228', borderRadius:10, color:'#f0f0f0', fontFamily:'inherit', transition:'border-color 0.2s'
};

const bpmBtnStyle = {
  width:40, height:40, background:'#06080a', border:'2px solid #1e2228', color:'#f0f0f0', borderRadius:'50%', fontSize:'1.2rem', cursor:'pointer', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'inherit'
};
