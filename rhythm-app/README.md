# StrumAI - Guitar Rhythm Practice App 🎸

Modern, PWA-enabled guitar rhythm practice application built with React + Vite.

## Features

✅ **AI-Powered Rhythm Analysis** - Enter any song name and get personalized rhythm patterns
🎵 **Interactive Metronome** - Practice with adjustable BPM and beat visualization  
📱 **Progressive Web App** - Install on mobile/desktop, works offline
🎨 **Modern UI** - Beautiful dark theme with smooth animations
🔄 **Multiple Rhythm Options** - Choose from recommended and alternative patterns

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm run preview
```

## PWA Features

- ✅ Installable on mobile and desktop
- ✅ Offline support with service worker
- ✅ App-like experience with standalone display
- ✅ Cached assets for fast loading

## Project Structure

```
rhythm-app/
├── src/
│   ├── components/      # React components
│   │   ├── Hero.jsx
│   │   ├── RhythmPreview.jsx
│   │   └── PracticeMode.jsx
│   ├── hooks/           # Custom React hooks
│   │   └── useMetronome.js
│   ├── utils/          # Utility functions
│   │   └── rhythmEngine.js
│   ├── App.jsx         # Main app component
│   └── main.jsx        # Entry point
├── public/
│   ├── icons/          # PWA icons
│   └── manifest.json   # PWA manifest
└── vite.config.js      # Vite + PWA config
```

## Technologies

- **React 19** - UI library
- **Vite 7** - Build tool and dev server
- **vite-plugin-pwa** - PWA support
- **Web Audio API** - Metronome functionality
- **CSS3** - Animations and styling

## License

All rights reserved © 2026 StrumAI
