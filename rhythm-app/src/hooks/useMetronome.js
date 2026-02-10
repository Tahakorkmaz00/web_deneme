import { useState, useRef, useCallback, useEffect } from 'react';

export function useMetronome(initialBPM = 92, timeSignature = [4, 4], grouping = [1, 1, 1, 1]) {
    const [bpm, setBpm] = useState(initialBPM);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentBeat, setCurrentBeat] = useState(0);

    const audioContextRef = useRef(null);
    const intervalRef = useRef(null);

    // Refs to hold latest values so start() can access them without dependency modification
    const tsRef = useRef(timeSignature);
    const groupingRef = useRef(grouping);

    useEffect(() => {
        tsRef.current = timeSignature;
        groupingRef.current = grouping;
    }, [timeSignature, grouping]);

    // Initialize audio context
    useEffect(() => {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();

        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    const playClick = useCallback((isStrongBeat) => {
        if (!audioContextRef.current) return;

        const oscillator = audioContextRef.current.createOscillator();
        const gainNode = audioContextRef.current.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);

        // Strong beat is slightly lower pitch and louder
        oscillator.frequency.value = isStrongBeat ? 800 : 1000;
        gainNode.gain.value = isStrongBeat ? 0.3 : 0.15;

        oscillator.start(audioContextRef.current.currentTime);

        // Fade out
        gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            audioContextRef.current.currentTime + 0.1
        );

        oscillator.stop(audioContextRef.current.currentTime + 0.1);
    }, []);

    const start = useCallback((overriddenBPM = null) => {
        if (intervalRef.current) return; // Already playing

        const effectiveBPM = overriddenBPM || bpm;
        const ts = tsRef.current;
        const gr = groupingRef.current;

        // Calculate interval for one "tick" based on the time signature denominator.
        // We assume BPM is Clicks Per Minute where Click is the denominator unit.
        const interval = (60 / effectiveBPM) * 1000;

        let tickCount = 0;
        const totalTicks = ts[0]; // Numerator (e.g. 9 for 9/8)

        // Helper to determine if current tick is a strong beat based on grouping
        const isStrongEvent = (tickIndex) => {
            if (tickIndex === 0) return true; // First beat always strong

            // Check if current tick aligns with the start of a group
            let accumulator = 0;
            for (let g of gr) {
                accumulator += g;
                if (tickIndex === accumulator) return true; // Start of next group
                if (accumulator > tickIndex) return false; // Inside a group
            }
            return false;
        };

        // Play first beat immediately
        playClick(true);
        setCurrentBeat(1);

        intervalRef.current = setInterval(() => {
            tickCount = (tickCount + 1) % totalTicks;
            const beatNumber = tickCount + 1;

            // Determine emphasis based on grouping
            const isStrong = isStrongEvent(tickCount);

            playClick(isStrong);
            setCurrentBeat(beatNumber);
        }, interval);

        setIsPlaying(true);
    }, [bpm, playClick]);

    const stop = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsPlaying(false);
        setCurrentBeat(0);
    }, []);

    const toggle = useCallback(() => {
        if (isPlaying) {
            stop();
        } else {
            start();
        }
    }, [isPlaying, start, stop]);

    const adjustBPM = useCallback((change) => {
        setBpm(prev => Math.max(40, Math.min(200, prev + change)));

        // Restart metronome if playing
        if (isPlaying) {
            stop();
            // Use setTimeout to allow state to update
            setTimeout(() => start(), 50);
        }
    }, [isPlaying, stop, start]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return {
        bpm,
        setBpm,
        isPlaying,
        currentBeat,
        start,
        stop,
        toggle,
        adjustBPM
    };
}
