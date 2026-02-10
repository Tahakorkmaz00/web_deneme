import { useState, useEffect } from 'react';
import { rhythmLibrary } from '../utils/rhythmEngine';
import { chordDatabase } from '../utils/chordDatabase';
import { saveSession, loadSessions, deleteSession, createNewSession } from '../utils/sessionStorage';
import './SessionBuilder.css';

export default function SessionBuilder({ onBackToModes, onStartPractice, initialSession }) {
    const [sessions, setSessions] = useState(loadSessions());
    const [currentSession, setCurrentSession] = useState(initialSession || null);
    const [selectedChordType, setSelectedChordType] = useState('major');
    const [showChordSelector, setShowChordSelector] = useState(false);
    const [draggedChordIndex, setDraggedChordIndex] = useState(null);

    // Update if initialSession changes
    useEffect(() => {
        if (initialSession) {
            setCurrentSession(initialSession);
        }
    }, [initialSession]);

    // Reload sessions list
    useEffect(() => {
        setSessions(loadSessions());
    }, []);

    const handleNewSession = () => {
        const newSession = createNewSession();
        setCurrentSession(newSession);
    };

    const handleLoadSession = (session) => {
        setCurrentSession({ ...session });
    };

    const handleSaveSession = () => {
        if (!currentSession) return;

        const saved = saveSession(currentSession);
        setSessions(loadSessions());
        alert('Session saved successfully! ✓');
    };

    const handleDeleteSession = (sessionId) => {
        if (confirm('Are you sure you want to delete this session?')) {
            deleteSession(sessionId);
            setSessions(loadSessions());
            if (currentSession?.id === sessionId) {
                setCurrentSession(null);
            }
        }
    };

    const handleAddChord = (chord) => {
        if (!currentSession) return;

        setCurrentSession({
            ...currentSession,
            chords: [...currentSession.chords, { chord: chord.name, beats: 4 }]
        });
        setShowChordSelector(false);
    };

    const handleRemoveChord = (index) => {
        if (!currentSession) return;

        const newChords = currentSession.chords.filter((_, i) => i !== index);
        setCurrentSession({
            ...currentSession,
            chords: newChords
        });
    };

    const handleUpdateChordBeats = (index, beats) => {
        if (!currentSession) return;

        const newChords = [...currentSession.chords];
        newChords[index] = { ...newChords[index], beats: Math.max(1, Math.min(16, beats)) };
        setCurrentSession({
            ...currentSession,
            chords: newChords
        });
    };

    const handleSelectRhythm = (rhythm) => {
        if (!currentSession) return;

        setCurrentSession({
            ...currentSession,
            rhythm: rhythm
        });
    };

    const handleUpdateBPM = (newBpm) => {
        if (!currentSession) return;

        setCurrentSession({
            ...currentSession,
            bpm: Math.max(40, Math.min(200, newBpm))
        });
    };

    const handleUpdateName = (name) => {
        if (!currentSession) return;

        setCurrentSession({
            ...currentSession,
            name: name
        });
    };

    const handleStartPractice = () => {
        if (!currentSession || !currentSession.rhythm || currentSession.chords.length === 0) {
            alert('Please add chords and select a rhythm pattern first!');
            return;
        }

        onStartPractice(currentSession);
    };

    const handleDragStart = (index) => {
        setDraggedChordIndex(index);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (dropIndex) => {
        if (draggedChordIndex === null || !currentSession) return;

        const newChords = [...currentSession.chords];
        const [draggedChord] = newChords.splice(draggedChordIndex, 1);
        newChords.splice(dropIndex, 0, draggedChord);

        setCurrentSession({
            ...currentSession,
            chords: newChords
        });

        setDraggedChordIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedChordIndex(null);
    };

    // Drag from chord selector 
    const handleChordDragStart = (e, chord) => {
        e.dataTransfer.setData('newChord', JSON.stringify(chord));
    };

    const handleProgressionDrop = (e) => {
        e.preventDefault();
        const newChordData = e.dataTransfer.getData('newChord');
        if (newChordData && currentSession) {
            const chord = JSON.parse(newChordData);
            setCurrentSession({
                ...currentSession,
                chords: [...currentSession.chords, { chord: chord.name, beats: 4 }]
            });
        }
    };

    const handleProgressionDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    };

    const handleProgressionDragLeave = (e) => {
        e.currentTarget.classList.remove('drag-over');
    };

    return (
        <section className="session-builder">
            <div className="builder-container">
                {/* Header */}
                <div className="builder-header">
                    <button className="back-btn" onClick={onBackToModes}>
                        ← Back to Modes
                    </button>
                    <h1>Session Builder</h1>
                </div>

                <div className="builder-layout">
                    {/* Left: Session List */}
                    <div className="sessions-sidebar">
                        <div className="sidebar-header">
                            <h3>My Sessions</h3>
                            <button className="new-session-btn" onClick={handleNewSession}>
                                + New
                            </button>
                        </div>

                        <div className="sessions-list">
                            {sessions.length === 0 ? (
                                <p className="empty-message">No saved sessions yet</p>
                            ) : (
                                sessions.map(session => (
                                    <div
                                        key={session.id}
                                        className={`session-item ${currentSession?.id === session.id ? 'active' : ''}`}
                                        onClick={() => handleLoadSession(session)}
                                    >
                                        <div className="session-item-info">
                                            <div className="session-name">{session.name}</div>
                                            <div className="session-meta">
                                                {session.chords.length} chords • {session.bpm} BPM
                                            </div>
                                        </div>
                                        <button
                                            className="delete-session-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteSession(session.id);
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right: Session Editor */}
                    <div className="session-editor">
                        {!currentSession ? (
                            <div className="empty-state">
                                <div className="empty-icon">🎸</div>
                                <h2>Create or select a session</h2>
                                <p>Build custom practice sessions with chords and rhythms</p>
                                <button className="create-btn" onClick={handleNewSession}>
                                    Create New Session
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Session Name */}
                                <div className="editor-section">
                                    <label>Session Name</label>
                                    <input
                                        type="text"
                                        className="session-name-input"
                                        value={currentSession.name}
                                        onChange={(e) => handleUpdateName(e.target.value)}
                                        placeholder="Enter session name..."
                                    />
                                </div>

                                {/* Chord Progression */}
                                <div className="editor-section">
                                    <div className="section-header">
                                        <label>Chord Progression</label>
                                        <button
                                            className="add-chord-btn"
                                            onClick={() => setShowChordSelector(!showChordSelector)}
                                        >
                                            + Add Chord
                                        </button>
                                    </div>

                                    {showChordSelector && (
                                        <div className="chord-selector">
                                            <div className="chord-types">
                                                {Object.keys(chordDatabase).map(type => (
                                                    <button
                                                        key={type}
                                                        className={`chord-type-btn ${selectedChordType === type ? 'active' : ''}`}
                                                        onClick={() => setSelectedChordType(type)}
                                                    >
                                                        {type}
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="chords-grid">
                                                {chordDatabase[selectedChordType].map(chord => (
                                                    <button
                                                        key={chord.name}
                                                        className="chord-btn"
                                                        onClick={() => handleAddChord(chord)}
                                                        draggable
                                                        onDragStart={(e) => handleChordDragStart(e, chord)}
                                                    >
                                                        {chord.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div
                                        className="chord-progression"
                                        onDrop={handleProgressionDrop}
                                        onDragOver={handleProgressionDragOver}
                                        onDragLeave={handleProgressionDragLeave}
                                    >
                                        {currentSession.chords.length === 0 ? (
                                            <p className="empty-chords">Drag chords here or click to add</p>
                                        ) : (
                                            currentSession.chords.map((chordItem, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`chord-card ${draggedChordIndex === idx ? 'dragging' : ''}`}
                                                    draggable
                                                    onDragStart={() => handleDragStart(idx)}
                                                    onDragOver={handleDragOver}
                                                    onDrop={() => handleDrop(idx)}
                                                    onDragEnd={handleDragEnd}
                                                >
                                                    <div className="drag-handle">⋮⋮</div>
                                                    <div className="chord-name">{chordItem.chord}</div>
                                                    <div className="chord-beats-editor">
                                                        <button
                                                            className="beats-btn"
                                                            onClick={() => handleUpdateChordBeats(idx, chordItem.beats - 1)}
                                                        >
                                                            −
                                                        </button>
                                                        <input
                                                            type="number"
                                                            className="beats-input"
                                                            value={chordItem.beats}
                                                            onChange={(e) => handleUpdateChordBeats(idx, parseInt(e.target.value) || 4)}
                                                            min="1"
                                                            max="16"
                                                        />
                                                        <button
                                                            className="beats-btn"
                                                            onClick={() => handleUpdateChordBeats(idx, chordItem.beats + 1)}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    <div className="beats-label">beats</div>
                                                    <button
                                                        className="remove-chord-btn"
                                                        onClick={() => handleRemoveChord(idx)}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Rhythm Pattern */}
                                <div className="editor-section">
                                    <label>Rhythm Pattern</label>
                                    <div className="rhythm-selector">
                                        {rhythmLibrary.slice(0, 6).map(rhythm => (
                                            <button
                                                key={rhythm.id}
                                                className={`rhythm-option ${currentSession.rhythm?.id === rhythm.id ? 'selected' : ''}`}
                                                onClick={() => handleSelectRhythm(rhythm)}
                                            >
                                                <div className="rhythm-name">{rhythm.name}</div>
                                                <div className="rhythm-pattern">{rhythm.pattern}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* BPM Control */}
                                <div className="editor-section">
                                    <label>Tempo (BPM)</label>
                                    <div className="bpm-control">
                                        <button onClick={() => handleUpdateBPM(currentSession.bpm - 5)}>-5</button>
                                        <button onClick={() => handleUpdateBPM(currentSession.bpm - 1)}>-1</button>
                                        <div className="bpm-display">{currentSession.bpm}</div>
                                        <button onClick={() => handleUpdateBPM(currentSession.bpm + 1)}>+1</button>
                                        <button onClick={() => handleUpdateBPM(currentSession.bpm + 5)}>+5</button>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="editor-actions">
                                    <button className="save-btn" onClick={handleSaveSession}>
                                        💾 Save Session
                                    </button>
                                    <button className="practice-btn" onClick={handleStartPractice}>
                                        ▶ Start Practice
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
