import { useState, useEffect } from 'react'
import { useTranslation } from '../i18n'

interface SettingsConfig {
  openaiKey: string
  geminiKey: string
  ollamaHost: string
  defaultProvider: 'ollama' | 'gemini' | 'openai'
  defaultModelName: string
  uiLanguage: 'en' | 'tw'
  generationLanguage: string
}

export function Settings() {
  const { t, setLang } = useTranslation()
  const [settings, setSettings] = useState<SettingsConfig>({
    openaiKey: '',
    geminiKey: '',
    ollamaHost: 'http://localhost:11434',
    defaultProvider: 'ollama',
    defaultModelName: '',
    uiLanguage: 'en',
    generationLanguage: 'tw'
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
      setLang(settings.uiLanguage)
      alert(t('settings.saved'))
    })
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h2>{t('settings.title')}</h2>
      <p>{t('settings.desc')}</p>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="input-group" style={{ flex: 1 }}>
          <label>{t('settings.ui_lang')}</label>
          <select 
            value={settings.uiLanguage}
            onChange={e => setSettings({...settings, uiLanguage: e.target.value as 'en' | 'tw'})}
          >
            <option value="en">English (EN)</option>
            <option value="tw">繁體中文 (TW)</option>
          </select>
        </div>
        <div className="input-group" style={{ flex: 1 }}>
          <label>{t('settings.gen_lang')}</label>
          <select 
            value={settings.generationLanguage}
            onChange={e => setSettings({...settings, generationLanguage: e.target.value})}
          >
            <option value="tw">繁體中文 (TW)</option>
          </select>
        </div>
      </div>

      <div className="input-group" style={{ marginTop: '1rem' }}>
        <label>{t('settings.provider')}</label>
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
        <label>{t('settings.model_name')}</label>
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
          <label>{t('settings.ollama_host')}</label>
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
          <label>{t('settings.gemini_key')}</label>
          <input 
            type="password" 
            value={settings.geminiKey}
            onChange={e => setSettings({...settings, geminiKey: e.target.value})}
            placeholder="AIzaSy..."
          />
        </div>
        <div className="input-group">
          <label>{t('settings.openai_key')}</label>
          <input 
            type="password" 
            value={settings.openaiKey}
            onChange={e => setSettings({...settings, openaiKey: e.target.value})}
            placeholder="sk-..."
          />
        </div>
      </div>

      <button onClick={handleSave} style={{ marginTop: '1rem' }}>{t('settings.save')}</button>
    </div>
  )
}
