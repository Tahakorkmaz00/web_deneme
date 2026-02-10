// Rhythm library - 15 curated rhythm objects (authoritative source)
const rhythmLibrary = [
    {
        id: 1,
        name: 'Basic Downstroke',
        pattern: '↓ ↓ ↓ ↓',
        bpm: [70, 100],
        density: 'low',
        energy: 'low',
        complexity: 'beginner',
        feel: 'steady / folk',
        best_for: ['folk', 'slow pop'],
        practice_tip: 'Lock each downstroke directly to the beat. Focus on timing, not volume.'
    },
    {
        id: 2,
        name: 'Folk Rock Basic',
        pattern: '↓ ↓↑ ↓ ↓',
        bpm: [80, 110],
        density: 'medium',
        energy: 'medium',
        complexity: 'beginner',
        feel: 'pop / folk',
        best_for: ['pop', 'acoustic', 'singer-songwriter'],
        practice_tip: 'Keep upstrokes lighter than downstrokes for clarity.'
    },
    {
        id: 3,
        name: 'Pop 8th Groove',
        pattern: '↓ ↓↑ ↓↑ ↓↑',
        bpm: [85, 115],
        density: 'medium',
        energy: 'medium',
        complexity: 'beginner–intermediate',
        feel: 'flowing / pop',
        best_for: ['pop', 'acoustic covers'],
        practice_tip: 'Maintain constant hand motion, even during silent strokes.'
    },
    {
        id: 4,
        name: 'Classic Pop Strum',
        pattern: '↓  ↓↑  ↓',
        bpm: [75, 105],
        density: 'medium',
        energy: 'medium',
        complexity: 'beginner',
        feel: 'relaxed / pop',
        best_for: ['pop ballads', 'Turkish pop'],
        practice_tip: 'Accent the first downstroke of each bar.'
    },
    {
        id: 5,
        name: 'Pop Rock Driver',
        pattern: '↓ ↓ ↓↑ ↓',
        bpm: [90, 120],
        density: 'medium',
        energy: 'medium–high',
        complexity: 'beginner',
        feel: 'driving / rock',
        best_for: ['pop rock', 'upbeat songs'],
        practice_tip: 'Lean slightly into beats 2 and 4 for groove.'
    },
    {
        id: 6,
        name: 'Essential Pop Groove',
        pattern: '↓  ↓↑  ↓↑',
        bpm: [85, 110],
        density: 'medium',
        energy: 'medium',
        complexity: 'beginner–intermediate',
        feel: 'modern pop',
        best_for: ['radio pop', 'acoustic pop'],
        practice_tip: 'Relax your wrist and avoid over-accenting upstrokes.'
    },
    {
        id: 7,
        name: 'Campfire Classic',
        pattern: '↓ ↓↑ ↓ ↑',
        bpm: [80, 100],
        density: 'medium',
        energy: 'medium',
        complexity: 'beginner',
        feel: 'easy-going',
        best_for: ['sing-along', 'campfire'],
        practice_tip: 'Use light palm muting if it feels too busy.'
    },
    {
        id: 8,
        name: 'Rock Eighths',
        pattern: '↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓',
        bpm: [100, 130],
        density: 'high',
        energy: 'high',
        complexity: 'beginner',
        feel: 'straight rock',
        best_for: ['rock', 'punk-pop'],
        practice_tip: 'Think like a drummer—consistent and aggressive.'
    },
    {
        id: 9,
        name: 'Syncopated Pop',
        pattern: '↓ ↑ ↓ ↓↑ ↓',
        bpm: [85, 110],
        density: 'medium',
        energy: 'medium',
        complexity: 'intermediate',
        feel: 'groovy / syncopated',
        best_for: ['pop', 'funk-pop'],
        practice_tip: 'Focus on accents rather than speed.'
    },
    {
        id: 10,
        name: 'Ballad Flow',
        pattern: '↓  ↓↑  ↓  ↓↑',
        bpm: [65, 90],
        density: 'medium',
        energy: 'low–medium',
        complexity: 'beginner',
        feel: 'smooth / emotional',
        best_for: ['ballads', 'slow pop'],
        practice_tip: 'Strum closer to the neck for a warmer tone.'
    },
    {
        id: 11,
        name: 'Indie Pop Pulse',
        pattern: '↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑',
        bpm: [95, 120],
        density: 'high',
        energy: 'medium',
        complexity: 'intermediate',
        feel: 'indie / modern',
        best_for: ['indie', 'alternative'],
        practice_tip: 'Control dynamics—avoid hitting every stroke equally.'
    },
    {
        id: 12,
        name: 'Soft Groove Pop',
        pattern: '↓ ↑  ↓↑  ↓',
        bpm: [80, 105],
        density: 'medium',
        energy: 'medium',
        complexity: 'beginner–intermediate',
        feel: 'laid-back',
        best_for: ['acoustic pop'],
        practice_tip: 'Ghost weaker beats slightly for groove.'
    },
    {
        id: 13,
        name: 'Singer-Songwriter Core',
        pattern: '↓ ↓ ↑ ↓ ↑',
        bpm: [75, 100],
        density: 'medium',
        energy: 'medium',
        complexity: 'beginner',
        feel: 'intimate',
        best_for: ['solo acoustic', 'vocal-driven songs'],
        practice_tip: 'Let vocals lead—keep guitar supportive.'
    },
    {
        id: 14,
        name: 'Pop Drive Sync',
        pattern: '↓  ↓↑  ↓ ↑',
        bpm: [90, 115],
        density: 'medium',
        energy: 'medium–high',
        complexity: 'intermediate',
        feel: 'dynamic pop',
        best_for: ['energetic pop'],
        practice_tip: 'Stay loose; tension kills groove.'
    },
    {
        id: 15,
        name: 'Universal Pop Strum',
        pattern: '↓ ↓↑ ↓↑ ↑',
        bpm: [85, 110],
        density: 'medium',
        energy: 'medium',
        complexity: 'intermediate',
        feel: 'mainstream pop',
        best_for: ['pop', 'acoustic covers', 'live performance'],
        practice_tip: 'Feel the groove first, pattern second.'
    }
];

let currentResults = null;
let selectedRhythmIndex = 0;
let currentSpeed = 'normal';
let metronomeBPM = 92;
let metronomeInterval = null;
let isPlaying = false;
let currentBeat = 0;
let audioContext = null;

function analyzeSong(songName) {
    const lowerSong = songName.toLowerCase();

    let tempoCategory = 'mid';
    let energyLevel = 'medium';
    let isVocalDriven = false;
    let isEmotional = false;

    const slowKeywords = ['slow', 'ballad', 'love', 'heart', 'tears', 'goodbye', 'miss', 'alone', 'dream', 'night', 'beautiful', 'stay', 'forever', 'please'];

    if (slowKeywords.some(kw => lowerSong.includes(kw))) {
        tempoCategory = 'slow';
        energyLevel = 'low';
        isEmotional = true;
    }

    const fastKeywords = ['rock', 'punk', 'dance', 'party', 'fast', 'run', 'wild', 'crazy', 'jump', 'loud'];

    if (fastKeywords.some(kw => lowerSong.includes(kw))) {
        tempoCategory = 'fast';
        energyLevel = 'high';
    }

    const vocalKeywords = ['singer', 'acoustic', 'unplugged', 'voice', 'solo', 'storytelling', 'folk'];
    if (vocalKeywords.some(kw => lowerSong.includes(kw))) {
        isVocalDriven = true;
    }

    return { tempoCategory, energyLevel, isVocalDriven, isEmotional };
}

function selectRhythms(context) {
    let validRhythms = rhythmLibrary.filter(rhythm => {
        if (context.isEmotional || context.tempoCategory === 'slow') {
            if (rhythm.energy === 'high' || rhythm.energy === 'medium–high') return false;
            if (rhythm.density === 'high') return false;
        }

        if (context.isVocalDriven) {
            if (rhythm.density === 'high') return false;
        }

        if (context.energyLevel === 'high') {
            if (rhythm.energy === 'low' || rhythm.energy === 'low–medium') return false;
        }

        return true;
    });

    if (validRhythms.length < 3) {
        validRhythms = rhythmLibrary.filter(r => r.energy === 'medium' || r.energy === 'medium–high');
    }

    const selected = [];
    const usedIds = new Set();

    let primary;
    if (context.tempoCategory === 'slow') {
        primary = validRhythms.find(r => r.id === 10 || r.id === 1 || r.id === 4);
    } else if (context.energyLevel === 'high') {
        primary = validRhythms.find(r => r.id === 8 || r.id === 5 || r.id === 11);
    } else if (context.isVocalDriven) {
        primary = validRhythms.find(r => r.id === 13 || r.id === 2 || r.id === 7);
    } else {
        primary = validRhythms.find(r => r.id === 3 || r.id === 6 || r.id === 15);
    }

    if (!primary) primary = validRhythms[0];
    selected.push(primary);
    usedIds.add(primary.id);

    let alt1 = validRhythms.find(r => !usedIds.has(r.id) && (r.complexity !== primary.complexity || r.density !== primary.density));
    if (!alt1) alt1 = validRhythms.find(r => !usedIds.has(r.id));
    if (!alt1) alt1 = validRhythms[1] || validRhythms[0];

    selected.push(alt1);
    usedIds.add(alt1.id);

    let alt2 = validRhythms.find(r => !usedIds.has(r.id) && (r.energy !== primary.energy || r.feel !== primary.feel));
    if (!alt2) alt2 = validRhythms.find(r => !usedIds.has(r.id));
    if (!alt2) alt2 = validRhythms[2] || validRhythms[1] || validRhythms[0];

    selected.push(alt2);
    return selected;
}

function generateRhythmResults(songName) {
    const context = analyzeSong(songName);
    const selectedRhythms = selectRhythms(context);

    let estimatedBPM;
    if (context.tempoCategory === 'slow') {
        estimatedBPM = Math.floor((selectedRhythms[0].bpm[0] + selectedRhythms[0].bpm[1]) / 2);
    } else if (context.tempoCategory === 'fast') {
        estimatedBPM = Math.floor((selectedRhythms[0].bpm[0] + selectedRhythms[0].bpm[1]) / 2) + 10;
    } else {
        estimatedBPM = Math.floor((selectedRhythms[0].bpm[0] + selectedRhythms[0].bpm[1]) / 2);
    }

    return {
        songName: songName,
        bpm: estimatedBPM,
        primary: {
            name: selectedRhythms[0].name,
            pattern: selectedRhythms[0].pattern,
            bpm: selectedRhythms[0].bpm,
            style: selectedRhythms[0].feel,
            desc: selectedRhythms[0].practice_tip,
            label: 'Recommended',
            tag: 'You can play this'
        },
        alternatives: [
            {
                name: selectedRhythms[1].name,
                pattern: selectedRhythms[1].pattern,
                bpm: selectedRhythms[1].bpm,
                style: selectedRhythms[1].feel,
                desc: selectedRhythms[1].practice_tip,
                label: 'Alternative 1',
                tag: 'Easier version'
            },
            {
                name: selectedRhythms[2].name,
                pattern: selectedRhythms[2].pattern,
                bpm: selectedRhythms[2].bpm,
                style: selectedRhythms[2].feel,
                desc: selectedRhythms[2].practice_tip,
                label: 'Alternative 2',
                tag: 'More dynamic version'
            }
        ]
    };
}

function displayRhythm(results, selectedIndex) {
    if (!results) return;

    const allRhythms = [results.primary, ...results.alternatives];
    const selected = allRhythms[selectedIndex];

    const patternDisplay = document.querySelector('.pattern-display');
    patternDisplay.innerHTML = '';

    const strumChars = selected.pattern.split(' ').filter(s => s);
    strumChars.forEach((strum, idx) => {
        const span = document.createElement('span');
        span.className = 'strum';
        span.textContent = strum;
        span.style.animationDelay = `${idx * 0.3}s`;
        span.style.color = idx % 2 === 0 ? 'var(--accent-orange)' : 'var(--accent-green)';
        patternDisplay.appendChild(span);
    });

    // Update rhythm info
    let infoHTML = `
        <div style="margin-top: 32px; text-align: center;">
            <div style="display: inline-block; padding: 8px 20px; background: rgba(255, 107, 53, 0.1); border-radius: 20px; margin-bottom: 16px;">
                <span style="color: var(--accent-green); font-weight: 700;">${selected.tag}</span>
            </div>
            <h4 style="font-family: 'Bebas Neue', sans-serif; font-size: 1.5rem; margin-bottom: 8px; letter-spacing: 1px;">${selected.style}</h4>
            <p style="color: var(--text-secondary); margin-bottom: 24px;">${selected.desc}</p>
        </div>
    `;

    // Add rhythm selector buttons
    infoHTML += `
        <div style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; margin-top: 24px;">
            ${allRhythms.map((r, idx) => `
                <button class="rhythm-option-btn ${idx === selectedIndex ? 'active' : ''}" onclick="selectRhythm(${idx})" style="
                    padding: 12px 24px;
                    background: ${idx === selectedIndex ? 'rgba(255, 107, 53, 0.2)' : 'transparent'};
                    border: 2px solid ${idx === selectedIndex ? 'var(--accent-orange)' : 'var(--border-color)'};
                    color: ${idx === selectedIndex ? 'var(--accent-orange)' : 'var(--text-secondary)'};
                    border-radius: 8px;
                    cursor: pointer;
                    font-family: 'DM Sans', sans-serif;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    font-size: 0.9rem;
                ">
                    ${r.label}
                </button>
            `).join('')}
        </div>
        <div style="text-align: center; margin-top: 32px;">
            <button class="select-rhythm-btn" onclick="startPractice()">
                Practice This Rhythm
            </button>
        </div>
    `;

    const existingInfo = document.querySelector('.rhythm-info');
    if (existingInfo) {
        existingInfo.innerHTML = infoHTML;
    } else {
        const infoDiv = document.createElement('div');
        infoDiv.className = 'rhythm-info';
        infoDiv.innerHTML = infoHTML;
        document.querySelector('.preview-card').appendChild(infoDiv);
    }
}

function selectRhythm(index) {
    selectedRhythmIndex = index;
    displayRhythm(currentResults, index);

    // Apply current speed
    const speedButtons = document.querySelectorAll('.speed-btn');
    speedButtons.forEach(btn => {
        if (btn.textContent.toLowerCase() === currentSpeed) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    applySpeed(currentSpeed);
}

function changeSpeed(speed) {
    currentSpeed = speed;
    const buttons = document.querySelectorAll('.speed-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    applySpeed(speed);
}

function applySpeed(speed) {
    const strums = document.querySelectorAll('.strum');
    let duration = speed === 'slow' ? '2s' : speed === 'fast' ? '0.8s' : '1.2s';
    strums.forEach(strum => {
        strum.style.animationDuration = duration;
    });
}

function showRhythm() {
    const songInput = document.getElementById('songInput').value.trim() ||
        document.getElementById('songInput2').value.trim();

    if (!songInput) {
        alert('Please enter a song name');
        return;
    }

    const loading = document.getElementById('loading');
    loading.classList.add('active');

    setTimeout(() => {
        loading.classList.remove('active');

        // Generate rhythm results
        currentResults = generateRhythmResults(songInput);
        selectedRhythmIndex = 0;

        // Display results
        displayRhythm(currentResults, 0);

        // Scroll to preview
        document.querySelector('.rhythm-preview').scrollIntoView({
            behavior: 'smooth'
        });
    }, 1500);
}

// Allow Enter key to trigger search
document.addEventListener('DOMContentLoaded', () => {
    [document.getElementById('songInput'), document.getElementById('songInput2')].forEach(input => {
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    showRhythm();
                }
            });
        }
    });

    // Parallax effect
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const strums = document.querySelectorAll('.strum-icon');
        strums.forEach((strum, index) => {
            const speed = (index + 1) * 0.1;
            strum.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Initialize audio context on first user interaction
    document.body.addEventListener('click', initAudio, { once: true });
});

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function startPractice() {
    if (!currentResults) return;

    const allRhythms = [currentResults.primary, ...currentResults.alternatives];
    const selected = allRhythms[selectedRhythmIndex];

    // Hide main sections
    document.querySelector('.rhythm-preview').style.display = 'none';
    document.querySelector('.why-section').style.display = 'none';
    document.querySelector('.social-proof').style.display = 'none';
    document.querySelector('.final-cta').style.display = 'none';

    // Show practice screen
    const practiceScreen = document.getElementById('practiceScreen');
    practiceScreen.style.display = 'block';

    // Set practice screen content
    document.getElementById('practiceSongTitle').textContent = currentResults.songName;
    document.getElementById('practiceStyleLabel').textContent = selected.style;

    metronomeBPM = currentResults.bpm;
    document.getElementById('currentBPM').textContent = metronomeBPM;

    // Display pattern
    const patternDisplay = document.getElementById('practicePatternDisplay');
    patternDisplay.innerHTML = '';
    const strumChars = selected.pattern.split(' ').filter(s => s);
    strumChars.forEach((strum, idx) => {
        const span = document.createElement('span');
        span.className = 'strum';
        span.textContent = strum;
        span.style.animationDelay = `${idx * 0.3}s`;
        span.style.color = idx % 2 === 0 ? 'var(--accent-orange)' : 'var(--accent-green)';
        patternDisplay.appendChild(span);
    });

    // Set practice tips based on style
    const tips = [
        selected.desc,
        'Keep steady time with the metronome',
        'Focus on clean, consistent strokes'
    ];
    document.getElementById('practiceTip').textContent = tips[0];

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Initialize audio context
    initAudio();
}

function exitPractice() {
    // Stop metronome if playing
    if (isPlaying) {
        toggleMetronome();
    }

    // Hide practice screen
    document.getElementById('practiceScreen').style.display = 'none';

    // Show main sections
    document.querySelector('.rhythm-preview').style.display = 'block';
    document.querySelector('.why-section').style.display = 'block';
    document.querySelector('.social-proof').style.display = 'block';
    document.querySelector('.final-cta').style.display = 'block';

    // Scroll back to results
    document.querySelector('.rhythm-preview').scrollIntoView({ behavior: 'smooth' });
}

function adjustBPM(change) {
    metronomeBPM = Math.max(40, Math.min(200, metronomeBPM + change));
    document.getElementById('currentBPM').textContent = metronomeBPM;

    // Restart metronome if playing
    if (isPlaying) {
        stopMetronome();
        startMetronome();
    }
}

function toggleMetronome() {
    if (isPlaying) {
        stopMetronome();
        document.getElementById('playPauseIcon').textContent = '▶';
        document.getElementById('playPauseText').textContent = 'Start Practice';
        isPlaying = false;
    } else {
        startMetronome();
        document.getElementById('playPauseIcon').textContent = '⏸';
        document.getElementById('playPauseText').textContent = 'Pause';
        isPlaying = true;
    }
}

function startMetronome() {
    if (!audioContext) {
        initAudio();
    }

    const interval = (60 / metronomeBPM) * 1000;
    currentBeat = 0;

    // Play first beat immediately
    playClick(true);
    highlightBeat(1);

    metronomeInterval = setInterval(() => {
        currentBeat = (currentBeat + 1) % 4;
        const beatNumber = currentBeat + 1;
        const isStrongBeat = beatNumber === 1;

        playClick(isStrongBeat);
        highlightBeat(beatNumber);
    }, interval);
}

function stopMetronome() {
    if (metronomeInterval) {
        clearInterval(metronomeInterval);
        metronomeInterval = null;
    }

    // Clear all beat highlights
    document.querySelectorAll('.beat').forEach(beat => {
        beat.classList.remove('active');
    });
}

function playClick(isStrongBeat) {
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Strong beat is slightly lower pitch and louder
    oscillator.frequency.value = isStrongBeat ? 800 : 1000;
    gainNode.gain.value = isStrongBeat ? 0.3 : 0.15;

    oscillator.start(audioContext.currentTime);

    // Fade out
    gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.1
    );

    oscillator.stop(audioContext.currentTime + 0.1);
}

function highlightBeat(beatNumber) {
    // Remove all highlights
    document.querySelectorAll('.beat').forEach(beat => {
        beat.classList.remove('active');
    });

    // Highlight current beat
    const currentBeatEl = document.querySelector(`.beat[data-beat="${beatNumber}"]`);
    if (currentBeatEl) {
        currentBeatEl.classList.add('active');
        if (beatNumber === 1) {
            currentBeatEl.classList.add('strong-beat');
        } else {
            currentBeatEl.classList.remove('strong-beat');
        }
    }
}
