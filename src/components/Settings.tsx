import { useState, useEffect } from 'react'

interface SettingsConfig {
  openaiKey: string
  geminiKey: string
  ollamaHost: string
  defaultProvider: 'ollama' | 'gemini' | 'openai'
  defaultModelName: string
}

export function Settings() {
  const [settings, setSettings] = useState<SettingsConfig>({
    openaiKey: '',
    geminiKey: '',
    ollamaHost: 'http://localhost:11434',
    defaultProvider: 'ollama',
    defaultModelName: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.ipcRenderer.invoke('get-settings').then((data: any) => {
      if (data) setSettings(data)
      setLoading(false)
    })
  }, [])

  const handleSave = () => {
    window.ipcRenderer.invoke('save-settings', settings).then(() => {
      alert('Settings saved successfully!')
    })
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h2>API Settings</h2>
      <p>Configure your connection to different LLM providers.</p>

      <div className="input-group">
        <label>Default Provider</label>
        <select 
          value={settings.defaultProvider}
          onChange={e => setSettings({...settings, defaultProvider: e.target.value as any})}
        >
          <option value="ollama">Ollama (Local)</option>
          <option value="gemini">Google Gemini API</option>
          <option value="openai">OpenAI API</option>
        </select>
      </div>

      <div className="input-group">
        <label>Default Model Name (e.g., llama3:8b, gemini-1.5-pro, gpt-4o)</label>
        <input 
          type="text" 
          value={settings.defaultModelName}
          onChange={e => setSettings({...settings, defaultModelName: e.target.value})}
          placeholder="Model name"
        />
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3>Ollama Configuration</h3>
        <div className="input-group">
          <label>Host URL</label>
          <input 
            type="text" 
            value={settings.ollamaHost}
            onChange={e => setSettings({...settings, ollamaHost: e.target.value})}
            placeholder="http://localhost:11434"
          />
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3>API Keys</h3>
        <div className="input-group">
          <label>Gemini API Key</label>
          <input 
            type="password" 
            value={settings.geminiKey}
            onChange={e => setSettings({...settings, geminiKey: e.target.value})}
            placeholder="AIzaSy..."
          />
        </div>
        <div className="input-group">
          <label>OpenAI API Key</label>
          <input 
            type="password" 
            value={settings.openaiKey}
            onChange={e => setSettings({...settings, openaiKey: e.target.value})}
            placeholder="sk-..."
          />
        </div>
      </div>

      <button onClick={handleSave} style={{ marginTop: '1rem' }}>Save Settings</button>
    </div>
  )
}
