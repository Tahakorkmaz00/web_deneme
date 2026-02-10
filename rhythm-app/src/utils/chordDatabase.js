// Common guitar chords database

export const chordDatabase = {
    // Major chords
    major: [
        { name: 'C', fullName: 'C Major', type: 'major' },
        { name: 'D', fullName: 'D Major', type: 'major' },
        { name: 'E', fullName: 'E Major', type: 'major' },
        { name: 'F', fullName: 'F Major', type: 'major' },
        { name: 'G', fullName: 'G Major', type: 'major' },
        { name: 'A', fullName: 'A Major', type: 'major' },
        { name: 'B', fullName: 'B Major', type: 'major' }
    ],

    // Minor chords
    minor: [
        { name: 'Cm', fullName: 'C Minor', type: 'minor' },
        { name: 'Dm', fullName: 'D Minor', type: 'minor' },
        { name: 'Em', fullName: 'E Minor', type: 'minor' },
        { name: 'Fm', fullName: 'F Minor', type: 'minor' },
        { name: 'Gm', fullName: 'G Minor', type: 'minor' },
        { name: 'Am', fullName: 'A Minor', type: 'minor' },
        { name: 'Bm', fullName: 'B Minor', type: 'minor' }
    ],

    // Seventh chords
    seventh: [
        { name: 'C7', fullName: 'C Dominant 7th', type: 'seventh' },
        { name: 'D7', fullName: 'D Dominant 7th', type: 'seventh' },
        { name: 'E7', fullName: 'E Dominant 7th', type: 'seventh' },
        { name: 'F7', fullName: 'F Dominant 7th', type: 'seventh' },
        { name: 'G7', fullName: 'G Dominant 7th', type: 'seventh' },
        { name: 'A7', fullName: 'A Dominant 7th', type: 'seventh' },
        { name: 'B7', fullName: 'B Dominant 7th', type: 'seventh' }
    ],

    // Major 7th chords
    maj7: [
        { name: 'Cmaj7', fullName: 'C Major 7th', type: 'maj7' },
        { name: 'Dmaj7', fullName: 'D Major 7th', type: 'maj7' },
        { name: 'Emaj7', fullName: 'E Major 7th', type: 'maj7' },
        { name: 'Fmaj7', fullName: 'F Major 7th', type: 'maj7' },
        { name: 'Gmaj7', fullName: 'G Major 7th', type: 'maj7' },
        { name: 'Amaj7', fullName: 'A Major 7th', type: 'maj7' },
        { name: 'Bmaj7', fullName: 'B Major 7th', type: 'maj7' }
    ],

    // Suspended chords
    sus: [
        { name: 'Csus4', fullName: 'C Suspended 4th', type: 'sus' },
        { name: 'Dsus4', fullName: 'D Suspended 4th', type: 'sus' },
        { name: 'Esus4', fullName: 'E Suspended 4th', type: 'sus' },
        { name: 'Fsus4', fullName: 'F Suspended 4th', type: 'sus' },
        { name: 'Gsus4', fullName: 'G Suspended 4th', type: 'sus' },
        { name: 'Asus4', fullName: 'A Suspended 4th', type: 'sus' },
        { name: 'Bsus4', fullName: 'B Suspended 4th', type: 'sus' }
    ]
};

export function getAllChords() {
    return [
        ...chordDatabase.major,
        ...chordDatabase.minor,
        ...chordDatabase.seventh,
        ...chordDatabase.maj7,
        ...chordDatabase.sus
    ];
}

export function getChordsByType(type) {
    return chordDatabase[type] || [];
}
