import { useState, useEffect } from 'react'
import type { Character } from './Characters'
import { useTranslation } from '../i18n'

export function Generator() {
  const { t } = useTranslation()
  const [characters, setCharacters] = useState<Character[]>([])
  const [selectedCharId, setSelectedCharId] = useState<string>('')
  const [planTopic, setPlanTopic] = useState<string>('')
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false)
  const [plan, setPlan] = useState<string>('')
  const [targetLines, setTargetLines] = useState<number>(200)
  const [generationLanguage, setGenerationLanguage] = useState<string>('tw')
  
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

    window.ipcRenderer.invoke('get-settings').then((data: any) => {
      if (data?.generationLanguage) setGenerationLanguage(data.generationLanguage)
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

  const handleGeneratePlan = async () => {
    if (!planTopic || !selectedCharId) return
    setIsGeneratingPlan(true)
    setError('')
    try {
      const character = characters.find(c => c.id === selectedCharId)
      const generatedPlan = await window.ipcRenderer.invoke('generate-plan', {
        character,
        topic: planTopic,
        generationLanguage
      })
      setPlan(generatedPlan)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setIsGeneratingPlan(false)
    }
  }

  const handleStart = () => {
    setError('')
    setHistory([])
    setStatus({ step: 'init', message: 'Starting...' })
    const character = characters.find(c => c.id === selectedCharId)
    if (!character) return

    window.ipcRenderer.send('start-generation', {
      character,
      plan,
      targetLines,
      generationLanguage
    })
  }

  const handleStop = () => {
    window.ipcRenderer.send('stop-generation')
  }

  return (
    <div style={{ display: 'flex', gap: '2rem', height: '100%' }}>
      {/* Configuration Panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2>{t('gen.title')}</h2>
        
        <div className="input-group">
          <label>{t('gen.select_char')}</label>
          <select value={selectedCharId} onChange={e => setSelectedCharId(e.target.value)}>
            {characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="input-group">
          <label>{t('gen.target_lines')}</label>
          <input 
            type="number" 
            value={targetLines} 
            onChange={e => setTargetLines(Number(e.target.value))} 
            min={10} max={2000}
          />
          <small style={{ color: 'var(--text-secondary)' }}>{t('gen.target_lines_desc')}</small>
        </div>

        <div className="input-group">
          <label>{t('gen.plan_topic')}</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              style={{ flex: 1 }}
              type="text" 
              value={planTopic} 
              onChange={e => setPlanTopic(e.target.value)} 
              placeholder={t('gen.plan_topic_placeholder')}
            />
            <button 
              className="secondary" 
              onClick={handleGeneratePlan} 
              disabled={isGeneratingPlan || !planTopic || !selectedCharId}
            >
              {isGeneratingPlan ? t('gen.generating_plan') : t('gen.btn_generate_plan')}
            </button>
          </div>
        </div>

        <div className="input-group" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <label>{t('gen.plan')}</label>
          <textarea 
            style={{ flex: 1, resize: 'none' }}
            value={plan} 
            onChange={e => setPlan(e.target.value)} 
            placeholder={t('gen.plan_placeholder')}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            style={{ flex: 1 }}
            onClick={handleStart} 
            disabled={!plan || !selectedCharId || status?.step === 'generating' || status?.step === 'planning'}
          >
            {status?.step === 'generating' || status?.step === 'planning' ? t('gen.btn_generating') : t('gen.btn_start')}
          </button>

          {(status?.step === 'generating' || status?.step === 'planning') && (
            <button 
              className="secondary"
              style={{ background: 'var(--danger)', color: 'white', border: 'none' }}
              onClick={handleStop}
            >
              {t('gen.btn_stop')}
            </button>
          )}
        </div>

        {error && <div style={{ color: 'var(--danger)', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>{error}</div>}
      </div>

      {/* Live Preview Panel */}
      <div className="glass-panel" style={{ flex: 1.5, padding: '1rem', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ marginTop: 0 }}>{t('gen.preview')}</h3>
        
        {status && (
          <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {status.progress !== undefined && status.total ? (
              <div style={{ 
                width: '50px', height: '50px', borderRadius: '50%', 
                background: `conic-gradient(var(--accent-primary) ${(status.progress/status.total)*360}deg, var(--bg-tertiary) 0deg)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                <div style={{ width: '40px', height: '40px', background: 'var(--bg-secondary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  {Math.round((status.progress/status.total)*100)}%
                </div>
              </div>
            ) : null}
            <div style={{ flex: 1 }}>
              <strong style={{ color: 'var(--accent-secondary)' }}>{t('gen.status')}</strong> {status.message}
            </div>
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
          {history.length === 0 && !status && <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '4rem' }}>{t('gen.empty_preview')}</p>}
        </div>
      </div>
    </div>
  )
}
