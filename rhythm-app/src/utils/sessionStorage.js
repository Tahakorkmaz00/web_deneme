// Session storage utilities using localStorage

export function saveSession(session) {
    const sessions = loadSessions();
    const existingIndex = sessions.findIndex(s => s.id === session.id);

    if (existingIndex >= 0) {
        sessions[existingIndex] = session;
    } else {
        sessions.push(session);
    }

    localStorage.setItem('rhythmPro_sessions', JSON.stringify(sessions));
    return session;
}

export function loadSessions() {
    const stored = localStorage.getItem('rhythmPro_sessions');
    return stored ? JSON.parse(stored) : [];
}

export function deleteSession(sessionId) {
    const sessions = loadSessions();
    const filtered = sessions.filter(s => s.id !== sessionId);
    localStorage.setItem('rhythmPro_sessions', JSON.stringify(filtered));
}

export function createNewSession() {
    return {
        id: Date.now().toString(),
        name: 'New Session',
        chords: [],
        rhythm: null,
        bpm: 90,
        notes: '',
        createdAt: new Date().toISOString()
    };
}
