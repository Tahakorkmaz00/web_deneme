# StrumAI - AI-Powered Guitar Rhythm Generator

**StrumAI** is a modern web application that uses AI to generate personalized guitar strumming patterns for any song. Whether you're a beginner or an experienced guitarist, StrumAI helps you learn to play your favorite songs with the perfect rhythm pattern.

## 🎸 Features

✨ **AI-Powered Rhythm Generation** - Get instant rhythm patterns tailored to any song
🎵 **15 Curated Rhythm Patterns** - From basic downstrokes to complex syncopated patterns
⏱️ **Interactive Metronome** - Adjustable BPM from 40-200 with visual beat indicators
📱 **Responsive Design** - Beautiful UI optimized for all devices
🎯 **Song Analysis** - Smart analysis based on song keywords and style
🎼 **Multiple Alternatives** - Get recommended rhythm plus 2 alternatives
💡 **Practice Tips** - Get helpful tips for each rhythm pattern

## 📁 Project Structure

```
StrumAI/
├── index.html          # Main HTML file (clean, semantic)
├── styles.css          # External CSS stylesheet
├── script.js           # External JavaScript (all functionality)
├── README.md          # This file
└── ANJNJNJN.html      # Original monolithic HTML (archived)
```

## 🚀 How to Use

### Quick Start
1. Open `index.html` in your web browser
2. Type a song name (e.g., "Duman – Senden Daha Güzel")
3. Click "Show Me the Rhythm"
4. Select your preferred rhythm pattern
5. Click "Practice This Rhythm" to start training

### Practice Mode
- Adjust the BPM using the +/- buttons
- Click "Start Practice" to activate the metronome
- The beat indicator shows which beat you're on
- Practice at different speeds (Slow, Normal, Fast)

## 🎯 How It Works

### Song Analysis Algorithm
The app analyzes song names using keyword detection:
- **Slow keywords**: ballad, love, heart, tears, etc. → Lower tempo, emotional feel
- **Fast keywords**: rock, punk, dance, party, etc. → Higher tempo, energetic feel
- **Vocal keywords**: acoustic, singer, voice, etc. → Less dense patterns

### Rhythm Selection
Based on song analysis, the app selects from 15 pre-defined rhythm patterns:
1. Basic Downstroke (1) - Steady folk feel
2. Folk Rock Basic (2) - Pop/folk hybrid
3. Pop 8th Groove (3) - Flowing modern pop
4. Classic Pop Strum (4) - Relaxed popular style
5. Pop Rock Driver (5) - Driving energy
... and 10 more specialized patterns

## 🛠️ Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS variables, flexbox, grid
- **Vanilla JavaScript** - No frameworks needed
- **Web Audio API** - Metronome sound generation

## 🎨 Design System

**Color Palette:**
- Primary: #ff6b35 (Orange accent)
- Secondary: #00ff9f (Green accent)
- Dark: #0a0a0a (Background)
- Light: #ffffff (Text)

**Typography:**
- Bebas Neue (headings, large text)
- DM Sans (body, UI elements)

## 🔊 Audio Functionality

The metronome uses the Web Audio API to generate:
- **Strong beats** (Beat 1): 800Hz, louder
- **Weak beats** (2-4): 1000Hz, quieter
- Smooth exponential fade-out for natural sound

## 📱 Responsive Breakpoints

- Desktop: 1200px+ (full layout)
- Tablet: 768px-1199px (adjusted spacing)
- Mobile: <768px (stacked layout, optimized touch targets)

## 🎓 Practice Tips

Each rhythm includes context-specific practice tips:
- Technical advice (hand position, tension)
- Musical guidance (dynamics, groove)
- Tempo recommendations

## ✨ Key Code Components

### `analyzeSong(songName)`
Analyzes song name and returns tempo category, energy level, vocal-driven status.

### `selectRhythms(context)`
Filters and selects 3 appropriate rhythms based on analysis context.

### `startMetronome()`
Activates the Web Audio metronome with beat highlighting.

### `displayRhythm(results, selectedIndex)`
Renders the selected rhythm pattern with visual animations.

## 🐛 Browser Compatibility

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

Requires Web Audio API support.

## 📝 License

© 2024 StrumAI. All rights reserved.

## 🤝 Contributing

Feel free to extend this project with:
- More rhythm patterns
- Enhanced song analysis
- User accounts and saved preferences
- Integration with music streaming APIs
- Mobile app version

## 📞 Support

For issues or feature requests, please open an issue or contact the development team.

---

**Happy playing! 🎸**

Created with ❤️ for guitarists everywhere.
