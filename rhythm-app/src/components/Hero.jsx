import { useState } from 'react';
import './Hero.css';

export default function Hero({ onAnalyze }) {
    const [songInput, setSongInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = () => {
        if (!songInput.trim()) {
            alert('Please enter an exercise name');
            return;
        }

        setIsLoading(true);

        // Simulate AI analysis delay
        setTimeout(() => {
            setIsLoading(false);
            onAnalyze(songInput);
        }, 1500);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <section className="hero">
            <div className="container">
                <h1>
                    Master Your Rhythm.<br />
                    <span className="highlight">Practice with Purpose.</span>
                </h1>
                <p className="subtitle">
                    Interactive rhythm exercises with metronome to improve your timing and groove.
                </p>
                <div className="search-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Enter exercise name or select from library..."
                        value={songInput}
                        onChange={(e) => setSongInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                </div>
                <button className="cta-button" onClick={handleSubmit}>
                    Find Rhythm Exercise
                </button>

                {isLoading && (
                    <div className="loading active">
                        <div className="loading-spinner"></div>
                        <p className="loading-text">Loading exercise...</p>
                    </div>
                )}
            </div>
        </section>
    );
}
