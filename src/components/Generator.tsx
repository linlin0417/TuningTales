import { useState, useEffect } from 'react'
import type { Character } from './Characters'

export function Generator() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [selectedCharId, setSelectedCharId] = useState<string>('')
  const [plan, setPlan] = useState<string>('')
  const [targetLines, setTargetLines] = useState<number>(200)
  
  const [status, setStatus] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])
  const [error, setError] = useState<string>('')

  useEffect(() => {
    window.ipcRenderer.invoke('get-characters').then((data: any) => {
      setCharacters(data || [])
      if (data && data.length > 0) {
        setSelectedCharId(data[0].id)
      }
    })

    window.ipcRenderer.on('generator-status', (_: any, data: any) => setStatus(data))
    window.ipcRenderer.on('generator-update', (_: any, data: any) => setHistory(data.history))
    window.ipcRenderer.on('generator-error', (_: any, err: any) => setError(err))

    return () => {
      window.ipcRenderer.removeAllListeners('generator-status')
      window.ipcRenderer.removeAllListeners('generator-update')
      window.ipcRenderer.removeAllListeners('generator-error')
    }
  }, [])

  const handleStart = () => {
    setError('')
    setHistory([])
    setStatus({ step: 'init', message: 'Starting...' })
    const character = characters.find(c => c.id === selectedCharId)
    if (!character) return

    window.ipcRenderer.send('start-generation', {
      character,
      plan,
      targetLines
    })
  }

  return (
    <div style={{ display: 'flex', gap: '2rem', height: '100%' }}>
      {/* Configuration Panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2>Dialogue Generator</h2>
        
        <div className="input-group">
          <label>Select Character Persona</label>
          <select value={selectedCharId} onChange={e => setSelectedCharId(e.target.value)}>
            {characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="input-group">
          <label>Target Conversation Turns</label>
          <input 
            type="number" 
            value={targetLines} 
            onChange={e => setTargetLines(Number(e.target.value))} 
            min={10} max={2000}
          />
          <small style={{ color: 'var(--text-secondary)' }}>Max 2000 lines. The system will loop based on the plan to reach this target.</small>
        </div>

        <div className="input-group" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <label>Conversation Plan / Outline</label>
          <textarea 
            style={{ flex: 1, resize: 'none' }}
            value={plan} 
            onChange={e => setPlan(e.target.value)} 
            placeholder="e.g. 1. User complains about a bug. 2. AI comforts the user. 3. AI proposes a solution. 4. User tests it and fails. 5. AI finds the root cause..."
          />
        </div>

        <button 
          onClick={handleStart} 
          disabled={!plan || !selectedCharId || status?.step === 'generating' || status?.step === 'planning'}
        >
          {status?.step === 'generating' || status?.step === 'planning' ? 'Generating...' : 'Start Generation'}
        </button>

        {error && <div style={{ color: 'var(--danger)', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>{error}</div>}
      </div>

      {/* Live Preview Panel */}
      <div className="glass-panel" style={{ flex: 1.5, padding: '1rem', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ marginTop: 0 }}>Live Preview</h3>
        
        {status && (
          <div style={{ padding: '0.5rem', background: 'var(--bg-secondary)', borderRadius: '4px', marginBottom: '1rem' }}>
            <strong style={{ color: 'var(--accent-secondary)' }}>Status:</strong> {status.message}
            {status.progress !== undefined && ` (${status.progress} / ${status.total})`}
          </div>
        )}

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {history.map((msg, idx) => (
            <div 
              key={idx} 
              style={{ 
                padding: '0.8rem', 
                borderRadius: '8px',
                background: msg.role === 'user' ? 'var(--bg-secondary)' : 'rgba(99, 102, 241, 0.1)',
                border: msg.role === 'assistant' ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent',
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%'
              }}
            >
              <div style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '0.2rem', fontWeight: 600 }}>
                {msg.role === 'user' ? 'Human' : 'AI'}
              </div>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                {msg.content}
              </div>
            </div>
          ))}
          {history.length === 0 && !status && <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '4rem' }}>Generated conversation will appear here...</p>}
        </div>
      </div>
    </div>
  )
}
