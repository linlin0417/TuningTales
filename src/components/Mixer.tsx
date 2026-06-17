import { useState } from 'react'
import { useTranslation } from '../i18n'

export function Mixer() {
  const { t } = useTranslation()
  const [targetRatio, setTargetRatio] = useState<number>(70)
  
  return (
    <div>
      <h2>{t('mix.title')}</h2>
      <p>{t('mix.desc')}</p>

      <div className="glass-panel" style={{ padding: '1rem', marginTop: '1rem' }}>
        <h3>{t('mix.config')}</h3>
        
        <div className="input-group">
          <label>{t('mix.ratio')}</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <input 
              type="range" 
              min="10" 
              max="90" 
              value={targetRatio} 
              onChange={e => setTargetRatio(Number(e.target.value))}
              style={{ flex: 1 }}
            />
            <span style={{ fontWeight: 600 }}>{targetRatio}% {t('mix.roleplay')} {100 - targetRatio}% {t('mix.general')}</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {t('mix.ratio_desc')}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <div style={{ flex: 1, padding: '1rem', border: '1px dashed var(--border-color)', borderRadius: '8px', textAlign: 'center' }}>
            <h4>{t('mix.select_rp')}</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>JSONL (OpenAI format)</p>
            <button className="secondary">{t('mix.browse')}</button>
          </div>
          <div style={{ flex: 1, padding: '1rem', border: '1px dashed var(--border-color)', borderRadius: '8px', textAlign: 'center' }}>
            <h4>{t('mix.select_gen')}</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>JSONL / Alpaca</p>
            <button className="secondary">{t('mix.browse')}</button>
          </div>
        </div>

        <button style={{ width: '100%', marginTop: '2rem' }} disabled>
          {t('mix.merge')}
        </button>
        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {t('mix.pending')}
        </p>
      </div>
    </div>
  )
}
