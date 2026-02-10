import { useState } from 'react';
import './ModeSelector.css';

export default function ModeSelector({ onSelectMode }) {
    const [hoveredCard, setHoveredCard] = useState(null);

    return (
        <section className="mode-selector-screen">
            {/* Pulsing Rhythm Background */}
            <div className="rhythm-pulse"></div>
            <div className="rhythm-pulse delay-1"></div>
            <div className="rhythm-pulse delay-2"></div>

            {/* Guitar Strings */}
            <div className="guitar-strings">
                <div className="string"></div>
                <div className="string"></div>
                <div className="string"></div>
                <div className="string"></div>
                <div className="string"></div>
                <div className="string"></div>
            </div>

            {/* Strum Pattern Animation */}
            <div className="strum-animation">
                <span className="strum-char">↓</span>
                <span className="strum-char">↓</span>
                <span className="strum-char">↑</span>
                <span className="strum-char">↓</span>
                <span className="strum-char">↑</span>
                <span className="strum-char">↓</span>
            </div>

            <div className="mode-container">
                {/* Animated Logo */}
                <div className="hero-section">
                    <div className="logo-wrapper">
                        <div className="logo-ring"></div>
                        <div className="logo-ring ring-2"></div>
                        <span className="hero-icon">🎸</span>
                    </div>
                    <h1 className="glitch-title" data-text="StrumFlow">StrumFlow</h1>
                    <p className="hero-tagline">
                        <span className="tagline-word">Feel</span>
                        <span className="tagline-word">the</span>
                        <span className="tagline-word">Rhythm.</span>
                        <span className="tagline-word accent">Play</span>
                        <span className="tagline-word accent">the</span>
                        <span className="tagline-word accent">Music.</span>
                    </p>
                </div>

                {/* Interactive 3D Cards */}
                <div className="mode-cards-3d">
                    {/* Simple Mode */}
                    <div
                        className={`card-3d simple ${hoveredCard === 'simple' ? 'hovered' : ''}`}
                        onClick={() => onSelectMode('simple')}
                        onMouseEnter={() => setHoveredCard('simple')}
                        onMouseLeave={() => setHoveredCard(null)}
                    >
                        <div className="card-inner">
                            <div className="card-shine"></div>
                            <div className="card-content">
                                <div className="card-icon-box">
                                    <span className="card-emoji">🎵</span>
                                    <div className="icon-beats">
                                        <span></span><span></span><span></span>
                                    </div>
                                </div>
                                <h2>QUICK PLAY</h2>
                                <p>Instant rhythm practice with 15+ patterns</p>
                                <div className="card-stats">
                                    <div className="stat"><span className="stat-num">15+</span><span className="stat-label">Patterns</span></div>
                                    <div className="stat"><span className="stat-num">∞</span><span className="stat-label">Practice</span></div>
                                </div>
                                <div className="card-enter">
                                    <span>Enter</span>
                                    <div className="enter-arrow">
                                        <span>→</span><span>→</span><span>→</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="cards-divider">
                        <span className="or-text">OR</span>
                    </div>

                    {/* Advanced Mode */}
                    <div
                        className={`card-3d advanced ${hoveredCard === 'advanced' ? 'hovered' : ''}`}
                        onClick={() => onSelectMode('advanced')}
                        onMouseEnter={() => setHoveredCard('advanced')}
                        onMouseLeave={() => setHoveredCard(null)}
                    >
                        <div className="card-inner">
                            <div className="card-shine"></div>
                            <div className="pro-badge">PRO</div>
                            <div className="card-content">
                                <div className="card-icon-box">
                                    <span className="card-emoji">🎸</span>
                                    <div className="chord-display">Am→G→C</div>
                                </div>
                                <h2>SESSION BUILDER</h2>
                                <p>Build custom chord progressions & save sessions</p>
                                <div className="card-stats">
                                    <div className="stat"><span className="stat-num">💾</span><span className="stat-label">Save</span></div>
                                    <div className="stat"><span className="stat-num">🔄</span><span className="stat-label">Auto</span></div>
                                </div>
                                <div className="card-enter green">
                                    <span>Create</span>
                                    <div className="enter-arrow">
                                        <span>→</span><span>→</span><span>→</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Beat Visualization */}
                <div className="beat-visualizer">
                    <div className="beat-bar"></div>
                    <div className="beat-bar"></div>
                    <div className="beat-bar"></div>
                    <div className="beat-bar"></div>
                    <div className="beat-bar"></div>
                    <div className="beat-bar"></div>
                    <div className="beat-bar"></div>
                    <div className="beat-bar"></div>
                </div>
            </div>
        </section>
    );
}
