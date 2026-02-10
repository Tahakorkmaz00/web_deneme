import { useState } from 'react';
import './CreateRhythmModal.css';

export default function CreateRhythmModal({ onClose, onSave }) {
    const [name, setName] = useState('');
    const [timeSigType, setTimeSigType] = useState('4/4');
    const [customNum, setCustomNum] = useState(4);
    const [customDen, setCustomDen] = useState(4);
    const [groupingStr, setGroupingStr] = useState('1,1,1,1');
    const [pattern, setPattern] = useState('↓ ↓ ↑ ↓ ↑');
    const [bpmRange, setBpmRange] = useState('80-120');

    const presets = {
        '4/4': { ts: [4, 4], gr: [1, 1, 1, 1] },
        '3/4': { ts: [3, 4], gr: [1, 1, 1] },
        '6/8': { ts: [6, 8], gr: [3, 3] },
        '9/8 (Aksak)': { ts: [9, 8], gr: [2, 2, 2, 3] },
        '5/8 (2+3)': { ts: [5, 8], gr: [2, 3] },
        '5/8 (3+2)': { ts: [5, 8], gr: [3, 2] },
        '7/8 (2+2+3)': { ts: [7, 8], gr: [2, 2, 3] },
        '7/8 (3+2+2)': { ts: [7, 8], gr: [3, 2, 2] },
        'Custom': { ts: [4, 4], gr: [1, 1, 1, 1] }
    };

    const handlePresetChange = (e) => {
        const val = e.target.value;
        setTimeSigType(val);
        if (val !== 'Custom') {
            const p = presets[val];
            setCustomNum(p.ts[0]);
            setCustomDen(p.ts[1]);
            setGroupingStr(p.gr.join(','));
        }
    };

    const handleSave = () => {
        if (!name || !pattern) {
            alert('Please fill in Name and Pattern.');
            return;
        }

        let ts = [customNum, customDen];
        let gr = groupingStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));

        // Validate grouping
        const sum = gr.reduce((a, b) => a + b, 0);
        if (sum !== ts[0]) {
            alert(`Grouping sum (${sum}) must match Time Signature numerator (${ts[0]}).`);
            return;
        }

        const [minBpm, maxBpm] = bpmRange.split('-').map(s => parseInt(s));

        const newRhythm = {
            id: Date.now(), // Use timestamp as ID
            name,
            pattern,
            timeSignature: ts,
            grouping: gr,
            bpm: [minBpm || 80, maxBpm || 120],
            density: 'medium',
            energy: 'medium',
            complexity: 'custom',
            feel: 'User Created',
            best_for: ['Custom'],
            practice_tip: 'Your custom rhythm!'
        };

        onSave(newRhythm);
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Create Custom Rhythm</h2>

                <div className="form-group">
                    <label>Rhythm Name</label>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. My 9/8 Groove" />
                </div>

                <div className="form-group">
                    <label>Time Signature</label>
                    <select value={timeSigType} onChange={handlePresetChange}>
                        {Object.keys(presets).map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                </div>

                {timeSigType === 'Custom' && (
                    <div className="row">
                        <div className="form-group half">
                            <label>Numerator</label>
                            <input type="number" value={customNum} onChange={e => setCustomNum(parseInt(e.target.value))} />
                        </div>
                        <div className="form-group half">
                            <label>Denominator</label>
                            <select value={customDen} onChange={e => setCustomDen(parseInt(e.target.value))}>
                                <option value="4">4</option>
                                <option value="8">8</option>
                            </select>
                        </div>
                    </div>
                )}

                <div className="form-group">
                    <label>Grouping (comma separated)</label>
                    <input value={groupingStr} onChange={e => setGroupingStr(e.target.value)} />
                    <small>For metronome accents (e.g. 2,2,2,3 for 9/8)</small>
                </div>

                <div className="form-group">
                    <label>Pattern (Arrows)</label>
                    <div className="pattern-input-row">
                        <button onClick={() => setPattern(p => p + ' ↓')}>↓</button>
                        <button onClick={() => setPattern(p => p + ' ↑')}>↑</button>
                        <button onClick={() => setPattern(p => p + ' ')}>space</button>
                        <button onClick={() => setPattern(p => p.slice(0, -2))}>⌫</button>
                    </div>
                    <input value={pattern} onChange={e => setPattern(e.target.value)} />
                </div>

                <div className="actions">
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="save-btn" onClick={handleSave}>Save Rhythm</button>
                </div>
            </div>
        </div>
    );
}
