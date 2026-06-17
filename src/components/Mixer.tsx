import { useState } from 'react'

export function Mixer() {
  const [targetRatio, setTargetRatio] = useState<number>(70)
  
  return (
    <div>
      <h2>Dataset Mixer</h2>
      <p>Merge multiple JSON/JSONL datasets and adjust their ratios.</p>

      <div className="glass-panel" style={{ padding: '1rem', marginTop: '1rem' }}>
        <h3>Mixer Configuration</h3>
        
        <div className="input-group">
          <label>Target Roleplay Ratio (%)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <input 
              type="range" 
              min="10" 
              max="90" 
              value={targetRatio} 
              onChange={e => setTargetRatio(Number(e.target.value))}
              style={{ flex: 1 }}
            />
            <span style={{ fontWeight: 600 }}>{targetRatio}% Roleplay / {100 - targetRatio}% General</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            The system will automatically oversample or undersample the roleplay dataset to achieve this target ratio when mixed with a general dataset.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <div style={{ flex: 1, padding: '1rem', border: '1px dashed var(--border-color)', borderRadius: '8px', textAlign: 'center' }}>
            <h4>Select Roleplay Dataset</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>JSONL (OpenAI format)</p>
            <button className="secondary">Browse File</button>
          </div>
          <div style={{ flex: 1, padding: '1rem', border: '1px dashed var(--border-color)', borderRadius: '8px', textAlign: 'center' }}>
            <h4>Select General Dataset</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>JSONL / Alpaca</p>
            <button className="secondary">Browse File</button>
          </div>
        </div>

        <button style={{ width: '100%', marginTop: '2rem' }} disabled>
          Merge & Export Dataset
        </button>
        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          * Full merging backend logic is pending in this preview.
        </p>
      </div>
    </div>
  )
}
