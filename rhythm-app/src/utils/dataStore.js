// StrumFlow Data Store - localStorage based

const KEYS = {
    RHYTHMS: 'strumflow_rhythms',
    COMMENTS: 'strumflow_comments',
};

// --- Built-in Articles ---
export const articles = [
    {
        id: 'kesme',
        title: 'Kesme (Palm Mute) Tekniği',
        icon: '🤚',
        color: '#ff6b35',
        shortDesc: 'Sağ el ile tellere hafifçe dokunarak kesik, perkusif bir ses elde etme tekniği.',
        content: `
## Kesme (Palm Mute) Nedir?

Palm mute, Türkçe'de "kesme" olarak bilinen, gitar çalarken en sık kullanılan tekniklerden biridir. Sağ elinizin (veya mızrap tutan elinizin) avuç içi kısmını köprü (bridge) yakınında tellere hafifçe bastırarak çalarsınız.

## Nasıl Yapılır?

1. **Sağ elinizi konumlandırın**: Avucunuzun et kısmını (küçük parmak tarafı) köprünün hemen üzerine yerleştirin
2. **Hafif basınç uygulayın**: Tellere çok sert basmayın, aksi halde ses tamamen kesilir
3. **Mızrapla vurun**: Normal strum hareketinizi yapın, ama eliniz tellerin üzerinde kalmaya devam etsin
4. **Doğru noktayı bulun**: Köprüye çok yakın = az etki, köprüden uzak = çok boğuk ses

## İpuçları

- **"Chugging" sesi** için düşük tellerde (E, A, D) palm mute çok etkilidir
- Rock ve metal müzikte riff'lerin temelini oluşturur
- **Dinamik kontrast** yaratmak için açık çalma ile palm mute arasında geçiş yapın
- Başlangıçta yavaş tempo ile çalışın, el pozisyonunuz doğal hale gelsin

## Yaygın Hatalar

- ❌ Çok sert basma → Ses tamamen ölür
- ❌ Köprüden çok uzakta basma → Notalar çalmaz
- ❌ El pozisyonunu sabit tutmamak → Tutarsız ses
- ✅ Hafif dokunuş + doğru pozisyon = mükemmel kesme sesi

## Hangi Şarkılarda Kullanılır?

- Metallica - "Master of Puppets" (intro riff)
- Green Day - "American Idiot"
- AC/DC - hemen hemen her şarkı!
- Nirvana - "Smells Like Teen Spirit" (verse)
    `,
    },
    {
        id: 'susturma',
        title: 'Susturma (Muting) Tekniği',
        icon: '🔇',
        color: '#00ff9f',
        shortDesc: 'Telleri susturarak ritmik vurgu ve perkusif efektler yaratma.',
        content: `
## Susturma (Muting) Nedir?

Susturma, tellerin titreşimini durdurarak "şak" benzeri perkusif bir ses elde etme tekniğidir. Ritim gitarda dinamik ve groove yaratmanın en önemli unsurlarından biridir.

## Muting Türleri

### 1. Sol El Muting (Fret Hand Muting)
- Parmaklarınızı tellerin üzerine hafifçe koyun (basmadan)
- Strum yaptığınızda "chk chk" benzeri perkusif bir ses çıkar
- Ritim kalıplarının arasına eklenir

### 2. Sağ El Muting (Strum Hand Muting)
- Strum'dan hemen sonra avuç içinizi tellere basın
- Sesi aniden keser
- Staccato efekti yaratır

### 3. Kombine Muting
- Her iki eli birlikte kullanma
- En dinamik sonuçları verir
- Funk ve R&B müzikte çok yaygın

## Nasıl Çalışılır?

1. **Basit bir akor tutun** (Am veya Em gibi)
2. **Aşağı strum yapın**, ardından sol el parmaklarınızı gevşetin (basıyı kaldırın ama tellere dokunmaya devam edin)
3. **Tekrar strum yapın** – susturulmuş "chk" sesini duymalısınız
4. **Ritim kalıbı oluşturun**: Akor → Mute → Akor → Mute

## Notasyon

Ritmik gösterimde susturma genellikle **"x"** işareti ile gösterilir:
\`\`\`
↓  x  ↓  ↑  x  ↑
1  &  2  &  3  &
\`\`\`

## Pro İpuçları

- 🎯 Funk müzikte muting %50'den fazla kullanılır
- 🎯 Jimi Hendrix, John Mayer gibi sanatçılar muting ustasıdır
- 🎯 Metronom ile çalışmak ritminizi sağlamlaştırır
- 🎯 "Scratch" strum denen teknik tamamen muting üzerinedir
    `,
    },
    {
        id: 'rasguido',
        title: 'Rasguido Tekniği',
        icon: '💃',
        color: '#ff3366',
        shortDesc: 'Flamenko tarzı hızlı parmak vuruşları ile dramatik, tutkulu bir ses elde etme.',
        content: `
## Rasguido Nedir?

Rasguido (veya Rasgueado), flamenko gitarın en karakteristik tekniklerinden biridir. Parmakları sırayla açarak tellere hızlı, ardışık vuruşlar yapmayı içerir. Bu teknik, dramatik ve tutkulu bir ses yaratır.

## Temel Rasguido Çeşitleri

### 1. Tek Parmak Rasguido
- İşaret parmağınızı yumruk yapıp bırakarak çalın
- En basit form, başlangıç için idealdir

### 2. Dört Parmak Rasguido (Klasik)
- Serçe → Yüzük → Orta → İşaret sırasıyla parmaklar açılır
- Her parmak tellere ayrı ayrı vurur
- Çok hızlı, "machine gun" etkisi yaratır

### 3. Üç Parmak Rasguido
- Yüzük → Orta → İşaret sırasıyla
- Daha kontrollü ve yaygın kullanılır

## Adım Adım Öğrenme

### Aşama 1: Yumruk Pozisyonu
- Elinizi yumruk yapın (gevşek bir yumruk)
- Başparmağınızı işaret parmağınızın yanına koyun

### Aşama 2: Parmak Atışı
- Serçe parmağınızı açarak tellere vurun
- Sanki parmaklarınızı "fırlatıyorsunuz"
- Bilek değil, PARMAK hareketi olmalı

### Aşama 3: Sıralı Vuruş
- Serçe → Yüzük → Orta → İşaret
- Her parmak öncekinin hemen ardından gelir
- Hedef: sürekli, kesintisiz bir ses akışı

### Aşama 4: Hız ve Kontrol
- Yavaş başlayın, her vuruşu net duyun
- Tempoyu kademeli olarak artırın
- Eşit aralıklı vuruşlar hedefleyin

## Egzersiz Önerileri

1. **Masa egzersizi**: Masanın üzerinde parmak açma pratiği yapın
2. **Tek akor**: Am veya E akoru üzerinde tekrar edin
3. **Metronom**: 60 BPM'den başlayın, 120 BPM'e kadar çıkın
4. **Flamenko kalıbı**: Rasguido + golpe (gövdeye vurma) kombinasyonu

## Yaygın Hatalar

- ❌ Bilekten çalmak → Parmak hareketi olmalı
- ❌ Çok sert vurmak → Kontrollü "fırlatma" hareketi
- ❌ Parmakları aynı anda açmak → Sıralı olmalı
- ✅ Gevşek el + hızlı parmak açma = doğru rasguido

## İlham Kaynakları

- Paco de Lucía - "Entre Dos Aguas"
- Rodrigo y Gabriela
- Gipsy Kings - "Bamboléo"
- Jesse Cook
    `,
    },
];

// --- Rhythm CRUD ---
function getStoredRhythms() {
    try {
        const data = localStorage.getItem(KEYS.RHYTHMS);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

function saveRhythms(rhythms) {
    localStorage.setItem(KEYS.RHYTHMS, JSON.stringify(rhythms));
}

export function getAllRhythms() {
    return getStoredRhythms();
}

export function searchRhythms(query) {
    const q = query.toLowerCase().trim();
    if (!q) return getStoredRhythms();
    return getStoredRhythms().filter(
        (r) =>
            r.title.toLowerCase().includes(q) ||
            r.chords.some((c) => c.name.toLowerCase().includes(q)) ||
            (r.author && r.author.toLowerCase().includes(q))
    );
}

export function addRhythm(rhythm) {
    const rhythms = getStoredRhythms();
    const newRhythm = {
        ...rhythm,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
    };
    rhythms.unshift(newRhythm);
    saveRhythms(rhythms);
    return newRhythm;
}

export function getRhythmById(id) {
    return getStoredRhythms().find((r) => r.id === id) || null;
}

export function deleteRhythm(id) {
    const rhythms = getStoredRhythms().filter((r) => r.id !== id);
    saveRhythms(rhythms);
}

// --- Comments CRUD ---
function getStoredComments() {
    try {
        const data = localStorage.getItem(KEYS.COMMENTS);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

function saveComments(comments) {
    localStorage.setItem(KEYS.COMMENTS, JSON.stringify(comments));
}

export function getCommentsByArticle(articleId) {
    return getStoredComments()
        .filter((c) => c.articleId === articleId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function addComment(comment) {
    const comments = getStoredComments();
    const newComment = {
        ...comment,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        replies: [],
    };
    comments.push(newComment);
    saveComments(comments);
    return newComment;
}

export function addReply(commentId, reply) {
    const comments = getStoredComments();
    const comment = comments.find((c) => c.id === commentId);
    if (comment) {
        const newReply = {
            ...reply,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
        };
        if (!comment.replies) comment.replies = [];
        comment.replies.push(newReply);
        saveComments(comments);
        return newReply;
    }
    return null;
}
