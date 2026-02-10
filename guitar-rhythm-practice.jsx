import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════════
   RHYTHM LIBRARY — 15 authoritative patterns. No modifications allowed.
   ═══════════════════════════════════════════════════════════════════════ */
const RHYTHMS = [
  { id:1,  name:"Basic Downstroke",       pattern:"↓ ↓ ↓ ↓",         bpm:[70,100],  tip:"Lock each downstroke to the beat." },
  { id:2,  name:"Folk Rock Basic",        pattern:"↓ ↓↑ ↓ ↓",        bpm:[80,110],  tip:"Keep upstrokes lighter than downstrokes." },
  { id:3,  name:"Pop 8th Groove",         pattern:"↓ ↓↑ ↓↑ ↓↑",      bpm:[85,115],  tip:"Maintain constant hand motion throughout." },
  { id:4,  name:"Classic Pop Strum",      pattern:"↓  ↓↑  ↓",        bpm:[75,105],  tip:"Accent the first downstroke of each bar." },
  { id:5,  name:"Pop Rock Driver",        pattern:"↓ ↓ ↓↑ ↓",        bpm:[90,120],  tip:"Lean into beats 2 and 4 for groove." },
  { id:6,  name:"Essential Pop Groove",   pattern:"↓  ↓↑  ↓↑",       bpm:[85,110],  tip:"Relax your wrist on the upstrokes." },
  { id:7,  name:"Campfire Classic",       pattern:"↓ ↓↑ ↓ ↑",        bpm:[80,100],  tip:"Use light palm muting if it feels busy." },
  { id:8,  name:"Rock Eighths",           pattern:"↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓", bpm:[100,130], tip:"Stay consistent and aggressive." },
  { id:9,  name:"Syncopated Pop",         pattern:"↓ ↑ ↓ ↓↑ ↓",      bpm:[85,110],  tip:"Focus on accents rather than speed." },
  { id:10, name:"Ballad Flow",            pattern:"↓  ↓↑  ↓  ↓↑",    bpm:[65,90],   tip:"Strum closer to the neck for warmth." },
  { id:11, name:"Indie Pop Pulse",        pattern:"↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑", bpm:[95,120],  tip:"Control dynamics across all strokes." },
  { id:12, name:"Soft Groove Pop",        pattern:"↓ ↑  ↓↑  ↓",      bpm:[80,105],  tip:"Ghost the weaker beats for groove." },
  { id:13, name:"Singer-Songwriter Core", pattern:"↓ ↓ ↑ ↓ ↑",       bpm:[75,100],  tip:"Keep guitar supportive, not dominant." },
  { id:14, name:"Pop Drive Sync",         pattern:"↓  ↓↑  ↓ ↑",      bpm:[90,115],  tip:"Stay loose — tension kills groove." },
  { id:15, name:"Universal Pop Strum",    pattern:"↓ ↓↑ ↓↑ ↑",       bpm:[85,110],  tip:"Feel the groove first, pattern second." },
];

/* ═══ CHORD PALETTE — exact specification ═══ */
const PALETTE = [
  { label:"Major",  chords:["C","D","E","G","A"] },
  { label:"Minor",  chords:["Am","Dm","Em"] },
  { label:"Barre",  chords:["F","Bm"] },
];

/* ═══════════════════════════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════════════════════════ */
export default function App() {
  const [view, setView] = useState("home");
  const [rhythm, setRhythm] = useState(null);
  const [seq, setSeq] = useState([]);
  const [bpm, setBpm] = useState(90);
  const [bars, setBars] = useState(2);
  const [repertoire, setRepertoire] = useState([]);
  const [saveName, setSaveName] = useState("");
  const [toast, setToast] = useState("");

  // Practice engine
  const [playing, setPlaying] = useState(false);
  const [beat, setBeat] = useState(0);
  const [bar, setBar] = useState(0);
  const [ci, setCi] = useState(0);
  const [pulseKey, setPulseKey] = useState(0);

  // Drag state
  const [dragSrc, setDragSrc] = useState(null);
  const [dropIdx, setDropIdx] = useState(null);
  const [zoneHover, setZoneHover] = useState(false);

  // Refs
  const ivRef = useRef(null);
  const audioRef = useRef(null);
  const stRef = useRef({ beat:0, bar:0, ci:0 });
  useEffect(() => { stRef.current = { beat, bar, ci }; }, [beat, bar, ci]);

  const flash = useCallback((m) => { setToast(m); setTimeout(()=>setToast(""), 2200); }, []);

  // ─── Navigation ───
  const go = useCallback((v) => {
    if (playing) { clearInterval(ivRef.current); ivRef.current=null; setPlaying(false); setBeat(0); }
    setView(v);
  }, [playing]);

  // ═══ AUDIO ═══
  const tick = useCallback((strong) => {
    if (!audioRef.current) return;
    const ctx = audioRef.current;
    if (ctx.state === "suspended") ctx.resume();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = "triangle";
    o.frequency.value = strong ? 880 : 1320;
    g.gain.value = strong ? 0.18 : 0.06;
    const t = ctx.currentTime;
    o.start(t); g.gain.exponentialRampToValueAtTime(0.001, t+0.05); o.stop(t+0.05);
  }, []);

  // ═══ PLAYBACK ═══
  const stop = useCallback(() => {
    setPlaying(false);
    if (ivRef.current) { clearInterval(ivRef.current); ivRef.current=null; }
    setBeat(0);
  }, []);

  const startEng = useCallback((s, b, br) => {
    if (!audioRef.current) audioRef.current = new (window.AudioContext || window.webkitAudioContext)();
    setPlaying(true);
    let _b=0,_br=0,_ci=0;
    setCi(0); setBar(0); setBeat(1); setPulseKey(k=>k+1);
    tick(true);
    const ms=(60/b)*1000;
    ivRef.current = setInterval(()=>{
      _b++;
      if(_b>=4){_b=0;_br++;if(_br>=br){_br=0;_ci=(_ci+1)%s.length;setCi(_ci);setPulseKey(k=>k+1);}setBar(_br);}
      setBeat(_b+1); tick(_b===0);
    }, ms);
  }, [tick]);

  const toggle = useCallback(()=>{ playing?stop():startEng(seq,bpm,bars); },[playing,stop,startEng,seq,bpm,bars]);

  const nudge = useCallback((d)=>{
    setBpm(prev=>{
      const n=Math.max(40,Math.min(200,prev+d));
      if(playing){
        clearInterval(ivRef.current);
        let{beat:_b,bar:_br,ci:_ci}=stRef.current; _b=_b-1;
        const ms=(60/n)*1000;
        ivRef.current=setInterval(()=>{
          _b++;if(_b>=4){_b=0;_br++;if(_br>=bars){_br=0;_ci=(_ci+1)%seq.length;setCi(_ci);setPulseKey(k=>k+1);}setBar(_br);}
          setBeat(_b+1);tick(_b===0);
        },ms);
      }
      return n;
    });
  },[playing,bars,seq,tick]);

  // Spacebar
  useEffect(()=>{
    const h=(e)=>{if(e.code==="Space"&&view==="practice"&&document.activeElement.tagName!=="INPUT"){e.preventDefault();toggle();}};
    window.addEventListener("keydown",h); return ()=>window.removeEventListener("keydown",h);
  },[view,toggle]);
  useEffect(()=>()=>{if(ivRef.current)clearInterval(ivRef.current);},[]);

  // ═══ DRAG & DROP ═══
  const palDragStart = (e, chord) => {
    setDragSrc({ type:"pal", chord });
    e.dataTransfer.effectAllowed="copy";
    e.dataTransfer.setData("text/plain",chord);
  };
  const seqDragStart = (e, idx) => {
    setDragSrc({ type:"seq", idx });
    e.dataTransfer.effectAllowed="move";
  };
  const dragEnd = () => { setDragSrc(null); setDropIdx(null); setZoneHover(false); };

  const zoneDragOver = (e) => { e.preventDefault(); setZoneHover(true); };
  const zoneDragLeave = () => setZoneHover(false);
  const zoneDrop = (e) => {
    e.preventDefault(); setZoneHover(false);
    if(dragSrc?.type==="pal") setSeq(p=>[...p,dragSrc.chord]);
    setDragSrc(null); setDropIdx(null);
  };

  const slotDragOver = (e,idx) => { e.preventDefault(); e.stopPropagation(); setDropIdx(idx); };
  const slotDrop = (e,tgt) => {
    e.preventDefault(); e.stopPropagation(); setDropIdx(null);
    if(dragSrc?.type==="seq"){
      const from=dragSrc.idx; if(from===tgt){setDragSrc(null);return;}
      setSeq(p=>{const c=[...p];const[it]=c.splice(from,1);c.splice(tgt,0,it);return c;});
    } else if(dragSrc?.type==="pal"){
      setSeq(p=>{const c=[...p];c.splice(tgt,0,dragSrc.chord);return c;});
    }
    setDragSrc(null);
  };
  const rmChord = (i) => setSeq(p=>p.filter((_,j)=>j!==i));

  // ═══ REPERTOIRE ═══
  const saveRep = () => {
    if(!saveName.trim()){flash("Name your exercise");return;}
    setRepertoire(p=>[...p,{
      id:Date.now(), name:saveName.trim(), rhythmId:rhythm.id,
      chordSequence:[...seq], bpm, barsPerChord:bars, createdAt:new Date().toISOString()
    }]);
    setSaveName(""); flash("Saved to repertoire");
  };
  const loadRep = (it) => {
    const r=RHYTHMS.find(x=>x.id===it.rhythmId); if(!r)return;
    stop(); setRhythm(r); setSeq([...it.chordSequence]); setBpm(it.bpm); setBars(it.barsPerChord);
    setCi(0);setBar(0);setBeat(0);setSaveName("");setView("practice");
  };
  const delRep = (id) => setRepertoire(p=>p.filter(x=>x.id!==id));

  // Launch
  const launch = () => {
    if(!rhythm){flash("Select a rhythm");return;}
    if(!seq.length){flash("Add at least one chord");return;}
    setCi(0);setBar(0);setBeat(0);setSaveName("");setView("practice");
  };

  const nextCi = seq.length>1 ? (ci+1)%seq.length : -1;

  // ═══ RENDER ═══
  return (
    <div style={S.root}>
      <style>{CSS}</style>

      {/* HEADER */}
      <header style={S.hdr}>
        <div style={S.hdrInner}>
          <button style={S.logo} onClick={()=>go("home")}>
            <span style={{fontWeight:900}}>RHYTHM</span><span style={{fontWeight:300,opacity:0.4}}>PRACTICE</span>
          </button>
          <nav style={S.nav}>
            {[["home","Home"],["setup","Session"],["repertoire","Repertoire"]].map(([k,l])=>(
              <button key={k} onClick={()=>go(k)} style={{...S.tab,...(view===k?S.tabOn:{})}}>{l}</button>
            ))}
          </nav>
        </div>
      </header>

      <div style={S.page}>

        {/* ═══ HOME ═══ */}
        {view==="home"&&(
          <div style={S.hero} className="fi">
            <p style={S.eye}>GUITAR RHYTHM TRAINER</p>
            <h1 style={S.h1}>Practice rhythm.<br/>Build timing.</h1>
            <p style={S.sub}>Pick a strumming pattern. Arrange your chords. Set the tempo. Loop until it's second nature.</p>
            <button style={S.wBtn} onClick={()=>go("setup")}>New Session<span style={{marginLeft:8,opacity:0.4}}>→</span></button>
          </div>
        )}

        {/* ═══ SETUP ═══ */}
        {view==="setup"&&(
          <div style={S.setup} className="fi">

            <SL n="01" t="RHYTHM"/>
            <div style={S.rg}>
              {RHYTHMS.map(r=>(
                <button key={r.id} onClick={()=>{setRhythm(r);setBpm(Math.floor((r.bpm[0]+r.bpm[1])/2));}}
                  style={{...S.rc,...(rhythm?.id===r.id?S.rcOn:{})}}>
                  <div style={S.rcN}>{r.name}</div>
                  <div style={S.rcP}>{r.pattern}</div>
                  <div style={S.rcB}>{r.bpm[0]}–{r.bpm[1]} BPM</div>
                </button>
              ))}
            </div>

            <hr style={S.hr}/>

            <SL n="02" t="CHORDS"/>
            <p style={S.ht}>Drag chords from the palette into the timeline below. Reorder by dragging within the timeline. Click ✕ to remove.</p>

            {/* Palette */}
            <div style={S.palOuter}>
              {PALETTE.map(g=>(
                <div key={g.label} style={S.palG}>
                  <div style={S.palLbl}>{g.label}</div>
                  <div style={S.palR}>
                    {g.chords.map(c=>(
                      <div key={c} draggable onDragStart={e=>palDragStart(e,c)} onDragEnd={dragEnd}
                        className="palChip" style={S.palC}>{c}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div className={`dropZone ${zoneHover?"dropHover":""}`}
              style={{...S.zone,...(zoneHover?S.zoneHov:{})}}
              onDragOver={zoneDragOver} onDragLeave={zoneDragLeave} onDrop={zoneDrop}>
              {seq.length===0?(
                <div style={S.zonePh}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{opacity:0.25}}>
                    <path d="M9 3v12M3 9h12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <span>Drop chords here to build your sequence</span>
                </div>
              ):(
                <div style={S.seqR}>
                  {seq.map((c,i)=>(
                    <div key={i+c+seq.length} style={{position:"relative",display:"flex",alignItems:"center"}}>
                      {dropIdx===i && <div style={S.dropBar}/>}
                      <div draggable
                        onDragStart={e=>seqDragStart(e,i)} onDragEnd={dragEnd}
                        onDragOver={e=>slotDragOver(e,i)} onDrop={e=>slotDrop(e,i)}
                        className="seqItem"
                        style={{...S.seqC,...(dragSrc?.type==="seq"&&dragSrc.idx===i?{opacity:0.2}:{})}}>
                        <span style={S.seqL}>{c}</span>
                        <button onClick={e=>{e.stopPropagation();rmChord(i);}} style={S.seqX}>✕</button>
                      </div>
                      {i<seq.length-1 && <span style={S.seqArrow}>→</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <hr style={S.hr}/>

            <SL n="03" t="SETTINGS"/>
            <div style={S.setG}>
              <div>
                <label style={S.fl}>BPM</label>
                <input type="number" value={bpm} min={40} max={200}
                  onChange={e=>setBpm(Math.max(40,Math.min(200,+e.target.value||90)))} style={S.inp}/>
              </div>
              <div>
                <label style={S.fl}>BARS / CHORD</label>
                <select value={bars} onChange={e=>setBars(+e.target.value)} style={S.inp}>
                  {[1,2,4,8].map(n=><option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>

            <div style={{display:"flex",gap:10,marginTop:44}}>
              <button style={S.wBtn} onClick={launch}>Start Practice →</button>
              <button style={S.gBtn} onClick={()=>go("home")}>Cancel</button>
            </div>
          </div>
        )}

        {/* ═══ PRACTICE ═══ */}
        {view==="practice"&&rhythm&&(
          <div style={S.pOuter} className="fi">
            <div style={S.pPanel}>

              <div style={S.pTop}>
                <button style={S.gBtn} onClick={()=>{stop();go("setup")}}>← Setup</button>
                <div style={{textAlign:"right"}}>
                  <div style={S.mk}>RHYTHM</div>
                  <div style={S.mv}>{rhythm.name}</div>
                </div>
              </div>

              {/* Chord timeline */}
              <div style={S.pTL}>
                {seq.map((c,i)=>{
                  const active=i===ci, next=i===nextCi;
                  return (
                    <div key={i} style={{...S.pPill,...(active?S.pPillOn:{}),...(next?S.pPillNx:{})}}>
                      {active && <div style={S.pPillDot}/>}
                      {c}
                    </div>
                  );
                })}
              </div>

              {/* Big chord */}
              <div style={S.bigW}>
                <div key={pulseKey} style={S.bigC} className="chP">{seq[ci]||"–"}</div>
                <div style={S.barI}>BAR {bar+1} <span style={{opacity:0.3}}>/ {bars}</span></div>
              </div>

              {/* Pattern — always visible */}
              <div style={S.patBox}>
                <div style={S.patK}>PATTERN</div>
                <div style={S.patV}>{rhythm.pattern}</div>
              </div>

              {/* Beats */}
              <div style={S.bRow}>
                {[1,2,3,4].map(b=>{
                  const on=beat===b, dn=b===1;
                  return(
                    <div key={b} style={{...S.bDot,...(on?(dn?S.bDn:S.bOn):{})}}>
                      <span style={{position:"relative",zIndex:1}}>{b}</span>
                      {on && <div style={S.bRing} className="bRA"/>}
                    </div>
                  );
                })}
              </div>

              {/* Transport */}
              <div style={S.trRow}>
                <div style={S.bpmG}>
                  <button style={S.bpmB} onClick={()=>nudge(-5)} aria-label="−5 BPM">
                    <svg width="12" height="2" viewBox="0 0 12 2"><rect width="12" height="2" rx="1" fill="currentColor"/></svg>
                  </button>
                  <div style={{textAlign:"center",minWidth:68}}>
                    <div style={S.bpmN}>{bpm}</div>
                    <div style={S.bpmW}>BPM</div>
                  </div>
                  <button style={S.bpmB} onClick={()=>nudge(5)} aria-label="+5 BPM">
                    <svg width="12" height="12" viewBox="0 0 12 12"><rect y="5" width="12" height="2" rx="1" fill="currentColor"/><rect x="5" width="2" height="12" rx="1" fill="currentColor"/></svg>
                  </button>
                </div>

                <button onClick={toggle} style={{...S.plB,...(playing?S.plOn:{})}} aria-label={playing?"Pause":"Play"}>
                  {playing?(
                    <svg width="16" height="18" viewBox="0 0 16 18"><rect x="1" y="0" width="4.5" height="18" rx="1.5" fill="currentColor"/><rect x="10.5" y="0" width="4.5" height="18" rx="1.5" fill="currentColor"/></svg>
                  ):(
                    <svg width="16" height="18" viewBox="0 0 16 18"><path d="M1.5 1a1 1 0 011.5-.87l11.5 7.5a1 1 0 010 1.74L3 16.87A1 1 0 011.5 16V1z" fill="currentColor"/></svg>
                  )}
                </button>
              </div>

              {/* Tip */}
              <div style={S.tipB}>{rhythm.tip}</div>

              {/* Save */}
              <div style={S.svRow}>
                <input value={saveName} onChange={e=>setSaveName(e.target.value)} placeholder="Name this exercise…"
                  style={{...S.inp,flex:1,minWidth:140}} onKeyDown={e=>{if(e.key==="Enter")saveRep();}}/>
                <button style={S.svBtn} onClick={saveRep}>Save</button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ REPERTOIRE ═══ */}
        {view==="repertoire"&&(
          <div style={S.repO} className="fi">
            <SL n="" t="REPERTOIRE"/>
            {repertoire.length===0?(
              <div style={S.repE}>
                <p style={{opacity:0.25,marginBottom:6}}>Empty</p>
                <p>Save an exercise from the practice panel to see it here.</p>
              </div>
            ):(
              <div style={S.repL}>
                {repertoire.map(it=>{
                  const rh=RHYTHMS.find(x=>x.id===it.rhythmId);
                  return(
                    <div key={it.id} style={S.repC} className="repHov">
                      <div style={{flex:1,minWidth:200}}>
                        <div style={S.repN}>{it.name}</div>
                        <div style={S.repM}>{it.chordSequence.join(" → ")}</div>
                        <div style={S.repS}>{rh?.name} · {it.bpm} BPM · {it.barsPerChord} bar{it.barsPerChord>1?"s":""}/chord</div>
                      </div>
                      <div style={{display:"flex",gap:6}}>
                        <button style={S.repLB} onClick={()=>loadRep(it)}>Load</button>
                        <button style={S.repDB} onClick={()=>delRep(it.id)}>✕</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {toast&&<div style={S.toast} className="tI">{toast}</div>}
    </div>
  );
}

function SL({n,t}){
  return(
    <div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:18}}>
      {n&&<span style={{fontFamily:M,fontSize:"0.68rem",color:"#2a2a2a",letterSpacing:1}}>{n}</span>}
      <span style={{fontFamily:G,fontSize:"0.8rem",fontWeight:700,letterSpacing:5,color:"#fff"}}>{t}</span>
    </div>
  );
}

/* ═══ FONTS ═══ */
const G = "'Schibsted Grotesk',sans-serif";
const M = "'IBM Plex Mono',monospace";

/* ═══ CSS ═══ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500;600;700;800;900&family=IBM+Plex+Mono:wght@300;400;500;600&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
body{background:#000;overflow-x:hidden}
::selection{background:#fff;color:#000}
input:focus,select:focus{outline:none;border-color:#444!important}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:#000}
::-webkit-scrollbar-thumb{background:#1a1a1a;border-radius:2px}

.fi{animation:fi .3s ease-out}
@keyframes fi{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
.chP{animation:chP .2s ease-out}
@keyframes chP{0%{transform:scale(.92);opacity:.35}100%{transform:scale(1);opacity:1}}
.tI{animation:tI .2s ease-out}
@keyframes tI{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
.bRA{animation:bRA .4s ease-out forwards}
@keyframes bRA{0%{transform:scale(.7);opacity:.5}100%{transform:scale(2);opacity:0}}

[draggable]{-webkit-user-select:none;user-select:none}
.palChip{cursor:grab;transition:all .12s}
.palChip:hover{border-color:#444!important;color:#fff!important}
.palChip:active{cursor:grabbing;transform:scale(.96)}
.seqItem{cursor:grab;transition:all .12s}
.seqItem:hover{border-color:#444!important}
.seqItem:active{cursor:grabbing}
.repHov{transition:border-color .12s}
.repHov:hover{border-color:#2a2a2a!important}
`;

/* ═══ STYLES ═══ */
const S = {
  root:{minHeight:"100vh",background:"#000",color:"#c8c8c8",fontFamily:G,lineHeight:1.5,fontSize:"15px"},

  hdr:{position:"sticky",top:0,zIndex:100,background:"rgba(0,0,0,.95)",backdropFilter:"blur(10px)",borderBottom:"1px solid #111",padding:"0 24px"},
  hdrInner:{maxWidth:1000,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",height:54,gap:12,flexWrap:"wrap"},
  logo:{fontFamily:G,fontSize:".92rem",letterSpacing:5,color:"#fff",background:"none",border:"none",cursor:"pointer",padding:0,display:"flex",gap:3},
  nav:{display:"flex",gap:1},
  tab:{padding:"7px 15px",fontSize:".73rem",fontWeight:600,fontFamily:G,border:"1px solid transparent",background:"transparent",color:"#3a3a3a",borderRadius:5,cursor:"pointer",transition:"all .12s",letterSpacing:.8},
  tabOn:{background:"#fff",color:"#000",borderColor:"#fff"},

  page:{maxWidth:1000,margin:"0 auto",padding:"0 24px"},

  // Hero
  hero:{padding:"clamp(80px,14vh,140px) 0 80px",maxWidth:560},
  eye:{fontFamily:M,fontSize:".62rem",letterSpacing:5,color:"#222",marginBottom:24},
  h1:{fontFamily:G,fontSize:"clamp(2.4rem,7vw,4.2rem)",fontWeight:900,lineHeight:1,color:"#fff",letterSpacing:"-.02em",marginBottom:22},
  sub:{fontSize:".92rem",color:"#444",lineHeight:1.65,marginBottom:44,maxWidth:400},

  wBtn:{display:"inline-flex",alignItems:"center",background:"#fff",color:"#000",border:"none",padding:"13px 32px",fontSize:".84rem",fontWeight:700,fontFamily:G,borderRadius:6,cursor:"pointer",letterSpacing:.5,transition:"all .1s"},
  gBtn:{display:"inline-flex",alignItems:"center",background:"transparent",border:"1px solid #1e1e1e",color:"#666",padding:"10px 20px",borderRadius:6,fontWeight:600,fontSize:".8rem",cursor:"pointer",fontFamily:G,transition:"all .12s"},

  // Setup
  setup:{padding:"40px 0 80px"},
  hr:{border:"none",borderTop:"1px solid #111",margin:"32px 0"},
  ht:{fontSize:".8rem",color:"#333",marginBottom:18},

  rg:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(205px,1fr))",gap:6},
  rc:{padding:"10px 12px",background:"#060606",border:"1px solid #161616",borderRadius:6,cursor:"pointer",textAlign:"left",fontFamily:G,transition:"all .12s"},
  rcOn:{borderColor:"#fff",background:"#0c0c0c"},
  rcN:{fontWeight:700,fontSize:".8rem",color:"#aaa",marginBottom:2},
  rcP:{fontFamily:M,fontSize:".88rem",color:"#fff",letterSpacing:1.5,marginBottom:2,fontWeight:500},
  rcB:{fontFamily:M,fontSize:".66rem",color:"#2a2a2a"},

  // Palette
  palOuter:{display:"flex",gap:28,flexWrap:"wrap",marginBottom:22},
  palG:{},
  palLbl:{fontFamily:M,fontSize:".6rem",letterSpacing:3,color:"#222",marginBottom:8,textTransform:"uppercase",fontWeight:500},
  palR:{display:"flex",gap:6,flexWrap:"wrap"},
  palC:{padding:"10px 20px",background:"#060606",border:"1px solid #1a1a1a",borderRadius:6,fontFamily:G,fontWeight:700,fontSize:".88rem",color:"#999",lineHeight:1},

  // Timeline zone
  zone:{minHeight:68,border:"1px dashed #1a1a1a",borderRadius:8,padding:"12px 14px",display:"flex",alignItems:"center",transition:"all .15s"},
  zoneHov:{borderColor:"#555",borderStyle:"solid",background:"rgba(255,255,255,.02)"},
  zonePh:{display:"flex",alignItems:"center",gap:10,color:"#1e1e1e",fontFamily:M,fontSize:".75rem",width:"100%"},

  seqR:{display:"flex",gap:4,flexWrap:"wrap",width:"100%",alignItems:"center"},
  seqC:{display:"flex",alignItems:"center",gap:8,padding:"8px 12px 8px 16px",background:"#0c0c0c",border:"1px solid #252525",borderRadius:6,position:"relative"},
  seqL:{fontWeight:700,fontSize:".88rem",color:"#fff",lineHeight:1},
  seqX:{background:"none",border:"none",color:"#2a2a2a",fontSize:".68rem",cursor:"pointer",fontFamily:G,padding:"2px 3px",lineHeight:1,borderRadius:3,transition:"color .1s"},
  seqArrow:{fontFamily:M,fontSize:".65rem",color:"#1e1e1e",margin:"0 2px"},
  dropBar:{position:"absolute",left:-3,top:4,bottom:4,width:2,background:"#fff",borderRadius:1,zIndex:2},

  // Settings
  setG:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:16},
  fl:{display:"block",fontFamily:M,fontSize:".62rem",letterSpacing:3,color:"#2a2a2a",marginBottom:6,fontWeight:500},
  inp:{width:"100%",padding:"10px 12px",fontSize:".86rem",background:"#060606",border:"1px solid #1a1a1a",borderRadius:6,color:"#fff",fontFamily:G,transition:"border-color .12s",WebkitAppearance:"none",appearance:"none"},

  // Practice
  pOuter:{padding:"28px 0 80px"},
  pPanel:{maxWidth:700,margin:"0 auto",background:"#040404",borderRadius:12,padding:"clamp(20px,3.5vw,36px)",border:"1px solid #131313"},
  pTop:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24,flexWrap:"wrap",gap:12},
  mk:{fontFamily:M,fontSize:".58rem",letterSpacing:3,color:"#2a2a2a",fontWeight:500},
  mv:{fontFamily:G,fontSize:"1rem",fontWeight:700,color:"#fff",letterSpacing:1,marginTop:2},

  pTL:{display:"flex",justifyContent:"center",gap:6,flexWrap:"wrap",marginBottom:4},
  pPill:{padding:"4px 14px",borderRadius:14,fontWeight:600,fontSize:".8rem",border:"1px solid #151515",color:"#2a2a2a",background:"#060606",transition:"all .2s cubic-bezier(.25,.46,.45,.94)",position:"relative"},
  pPillOn:{borderColor:"#fff",color:"#fff",background:"#141414"},
  pPillNx:{borderColor:"#1e1e1e",color:"#555"},
  pPillDot:{position:"absolute",top:-3,left:"50%",transform:"translateX(-50%)",width:4,height:4,borderRadius:"50%",background:"#fff"},

  bigW:{textAlign:"center",padding:"18px 0 4px"},
  bigC:{fontFamily:G,fontSize:"clamp(4rem,14vw,8rem)",fontWeight:900,color:"#fff",lineHeight:.9,letterSpacing:"-.03em"},
  barI:{fontFamily:M,fontSize:".66rem",letterSpacing:4,color:"#1e1e1e",marginTop:12,fontWeight:500},

  patBox:{margin:"22px 0",padding:"12px 16px",background:"#060606",borderRadius:6,border:"1px solid #111",textAlign:"center"},
  patK:{fontFamily:M,fontSize:".55rem",letterSpacing:3,color:"#222",marginBottom:5,fontWeight:500},
  patV:{fontFamily:M,fontSize:"clamp(1.3rem,3vw,1.9rem)",letterSpacing:5,color:"#fff",fontWeight:500},

  bRow:{display:"flex",justifyContent:"center",gap:16,margin:"22px 0"},
  bDot:{width:46,height:46,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:M,fontSize:".85rem",fontWeight:600,color:"#151515",border:"1.5px solid #151515",background:"#060606",position:"relative",overflow:"hidden",transition:"all .07s ease-out"},
  bOn:{background:"#fff",borderColor:"#fff",color:"#000",transform:"scale(1.15)",boxShadow:"0 0 14px rgba(255,255,255,.08)"},
  bDn:{background:"#fff",borderColor:"#fff",color:"#000",transform:"scale(1.25)",boxShadow:"0 0 22px rgba(255,255,255,.14)"},
  bRing:{position:"absolute",inset:0,borderRadius:"50%",border:"1.5px solid rgba(255,255,255,.35)",pointerEvents:"none"},

  trRow:{display:"flex",justifyContent:"center",alignItems:"center",gap:30,margin:"22px 0",flexWrap:"wrap"},
  bpmG:{display:"flex",alignItems:"center",gap:14},
  bpmB:{width:36,height:36,background:"#060606",border:"1px solid #1e1e1e",color:"#555",borderRadius:"50%",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .12s",padding:0},
  bpmN:{fontFamily:G,fontSize:"1.9rem",fontWeight:800,color:"#fff",lineHeight:1},
  bpmW:{fontFamily:M,fontSize:".55rem",letterSpacing:3,color:"#2a2a2a",fontWeight:500,marginTop:2},
  plB:{width:60,height:60,borderRadius:"50%",border:"1.5px solid #fff",background:"transparent",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .12s",padding:0},
  plOn:{background:"#fff",color:"#000"},

  tipB:{textAlign:"center",padding:"9px 12px",background:"#060606",borderRadius:6,color:"#2a2a2a",fontSize:".76rem",fontFamily:M,marginTop:20,border:"1px solid #0e0e0e"},

  svRow:{display:"flex",gap:8,marginTop:20,flexWrap:"wrap"},
  svBtn:{padding:"10px 22px",background:"#fff",color:"#000",border:"none",borderRadius:6,fontWeight:700,fontSize:".78rem",cursor:"pointer",fontFamily:G,whiteSpace:"nowrap"},

  // Repertoire
  repO:{padding:"40px 0 80px",maxWidth:740,margin:"0 auto"},
  repE:{textAlign:"center",padding:"60px 20px",color:"#2a2a2a",fontFamily:M,fontSize:".8rem"},
  repL:{display:"flex",flexDirection:"column",gap:6},
  repC:{background:"#040404",border:"1px solid #151515",borderRadius:8,padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:14,flexWrap:"wrap"},
  repN:{fontWeight:700,fontSize:".9rem",color:"#fff",marginBottom:2},
  repM:{fontFamily:M,fontSize:".74rem",color:"#444",marginBottom:2},
  repS:{fontFamily:M,fontSize:".66rem",color:"#222"},
  repLB:{padding:"7px 18px",background:"#fff",color:"#000",border:"none",borderRadius:5,fontWeight:700,fontSize:".72rem",cursor:"pointer",fontFamily:G},
  repDB:{padding:"7px 12px",background:"transparent",border:"1px solid #1e1e1e",color:"#333",borderRadius:5,fontWeight:600,fontSize:".72rem",cursor:"pointer",fontFamily:G,transition:"all .12s"},

  toast:{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",background:"#111",border:"1px solid #333",color:"#fff",padding:"8px 20px",borderRadius:6,fontWeight:600,fontSize:".8rem",fontFamily:G,zIndex:1000},
};
