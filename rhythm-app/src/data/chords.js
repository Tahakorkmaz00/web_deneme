export const CHORDS = [
    {
        id: 'am',
        name: 'Am',
        fullName: 'A Minor',
        description: 'Melankolik ve duygusal. Rock ve pop müzikte en sık kullanılan minör akor.',
        frets: [-1, 0, 2, 2, 1, 0], // Strings: E A D G B e (-1=mute, 0=open, >0=fret)
        fingers: [0, 0, 2, 3, 1, 0], // Fingers: 1=Index, 2=Middle, 3=Ring, 4=Pinky
    },
    {
        id: 'c',
        name: 'C',
        fullName: 'C Major',
        description: 'Parlak ve mutlu. Çoğu popüler şarkının temel taşı.',
        frets: [-1, 3, 2, 0, 1, 0],
        fingers: [0, 3, 2, 0, 1, 0],
    },
    {
        id: 'd',
        name: 'D',
        fullName: 'D Major',
        description: 'Neşeli ve enerjik. Genellikle şarkıların nakarat kısımlarında duyulur.',
        frets: [-1, -1, 0, 2, 3, 2],
        fingers: [0, 0, 0, 1, 3, 2],
    },
    {
        id: 'dm',
        name: 'Dm',
        fullName: 'D Minor',
        description: 'Hüzünlü ama umutlu. Baladların vazgeçilmezi.',
        frets: [-1, -1, 0, 2, 3, 1],
        fingers: [0, 0, 0, 2, 3, 1],
    },
    {
        id: 'e',
        name: 'E',
        fullName: 'E Major',
        description: 'Güçlü ve dolu. Rock ve Blues müziğin kralı.',
        frets: [0, 2, 2, 1, 0, 0],
        fingers: [0, 2, 3, 1, 0, 0],
    },
    {
        id: 'em',
        name: 'Em',
        fullName: 'E Minor',
        description: 'Karanlık ve derin. Metal ve Rock şarkılarının favorisi.',
        frets: [0, 2, 2, 0, 0, 0],
        fingers: [0, 2, 3, 0, 0, 0],
    },
    {
        id: 'g',
        name: 'G',
        fullName: 'G Major',
        description: 'Geniş ve ferah. Akustik gitarın en sevilen akoru.',
        frets: [3, 2, 0, 0, 0, 3],
        fingers: [2, 1, 0, 0, 0, 3],
    },
    {
        id: 'a',
        name: 'A',
        fullName: 'A Major',
        description: 'Pozitif ve aydınlık. Yükselen bir hissiyat verir.',
        frets: [-1, 0, 2, 2, 2, 0],
        fingers: [0, 0, 1, 2, 3, 0],
    },
    {
        id: 'f',
        name: 'F',
        fullName: 'F Major',
        description: 'Zorlu bare akoru. Geçişlerde zenginlik katar.',
        frets: [1, 3, 3, 2, 1, 1],
        fingers: [1, 3, 4, 2, 1, 1],
        barre: { fret: 1, from: 1, to: 6 } // Barre 1st fret, strings 1-6
    },
    {
        id: 'bm',
        name: 'Bm',
        fullName: 'B Minor',
        description: 'Duygusal ve yoğun. Rock baladlarının vazgeçilmezi.',
        frets: [-1, 2, 4, 4, 3, 2],
        fingers: [0, 1, 3, 4, 2, 1],
        barre: { fret: 2, from: 1, to: 5 }
    },
    {
        id: 'b7',
        name: 'B7',
        fullName: 'B Dominant 7',
        description: 'Blues tonlarında sıkça kullanılan gergin ama çözülmeyi bekleyen bir akor.',
        frets: [-1, 2, 1, 2, 0, 2],
        fingers: [0, 2, 1, 3, 0, 4],
    },
    {
        id: 'cadd9',
        name: 'Cadd9',
        fullName: 'C Added 9',
        description: 'G akoruna geçişi çok kolay olan, modern pop ve country favorisi.',
        frets: [-1, 3, 2, 0, 3, 3],
        fingers: [0, 2, 1, 0, 3, 4],
    },
    // --- Power Chords ---
    {
        id: 'a5',
        name: 'A5',
        fullName: 'A Power Chord',
        description: 'Rock ve Metal müziğin temeli. Sadece kök ses ve 5. dereceden oluşur.',
        frets: [-1, 0, 2, 2, -1, -1], // Open A5 (Root 5)
        fingers: [0, 0, 1, 1, 0, 0],
    },
    {
        id: 'e5',
        name: 'E5',
        fullName: 'E Power Chord',
        description: 'En kalın, en güçlü akor. Distortion ile harika tınlar.',
        frets: [0, 2, 2, -1, -1, -1], // Open E5 (Root 6)
        fingers: [0, 1, 1, 0, 0, 0],
    },
    {
        id: 'f5',
        name: 'F5',
        fullName: 'F Power Chord',
        description: 'Sert ve keskin. Punk ve Grunge parçalarında sıkça kullanılır.',
        frets: [1, 3, 3, -1, -1, -1], // F5 (Root 6)
        fingers: [1, 3, 4, 0, 0, 0],
    },
    {
        id: 'g5',
        name: 'G5',
        fullName: 'G Power Chord',
        description: 'Güçlü ve dolgun. Rock rifflerinin vazgeçilmezi.',
        frets: [3, 5, 5, -1, -1, -1], // G5 (Root 6)
        fingers: [1, 3, 4, 0, 0, 0],
    },
    {
        id: 'c5',
        name: 'C5',
        fullName: 'C Power Chord',
        description: 'Net ve güçlü. Pop-punk ve alternatif rock şarkılarında popüler.',
        frets: [-1, 3, 5, 5, -1, -1], // C5 (Root 5)
        fingers: [0, 1, 3, 4, 0, 0],
    },
    {
        id: 'd5',
        name: 'D5',
        fullName: 'D Power Chord',
        description: 'Hızlı ve atak. Hard Rock parçalarında sıkça duyulur.',
        frets: [-1, 5, 7, 7, -1, -1], // D5 (Root 5)
        fingers: [0, 1, 3, 4, 0, 0],
    }
];

export function searchChords(query) {
    const q = query.toLowerCase().trim();
    if (!q) return CHORDS;
    return CHORDS.filter(chord =>
        chord.name.toLowerCase().includes(q) ||
        chord.fullName.toLowerCase().includes(q)
    );
}
