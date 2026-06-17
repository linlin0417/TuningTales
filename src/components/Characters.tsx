import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useTranslation } from '../i18n'

export interface Character {
  id: string
  name: string
  systemPrompt: string
  personality: string
  exampleDialogues: string
}

export function Characters() {
  const { t } = useTranslation()
  const [characters, setCharacters] = useState<Character[]>([])
  const [editingChar, setEditingChar] = useState<Character | null>(null)
  
  useEffect(() => {
    window.ipcRenderer.invoke('get-characters').then((data: any) => {
      setCharacters(data || [])
    })
  }, [])

  const handleSave = () => {
    if (!editingChar) return
    let newChars
    if (!editingChar.id) {
      newChars = [...characters, { ...editingChar, id: uuidv4() }]
    } else {
      newChars = characters.map(c => c.id === editingChar.id ? editingChar : c)
    }
    setCharacters(newChars)
    setEditingChar(null)
    window.ipcRenderer.invoke('save-characters', newChars)
  }

  const handleDelete = (id: string) => {
    const newChars = characters.filter(c => c.id !== id)
    setCharacters(newChars)
    window.ipcRenderer.invoke('save-characters', newChars)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>{t('char.library')}</h2>
        {!editingChar && (
          <button onClick={() => setEditingChar({ id: '', name: '', systemPrompt: '', personality: '', exampleDialogues: '' })}>
            {t('char.create')}
          </button>
        )}
      </div>

      {editingChar ? (
        <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
          <h3>{editingChar.id ? t('char.edit') : t('char.new')}</h3>
          <div className="input-group">
            <label>{t('char.name')}</label>
            <input 
              value={editingChar.name} 
              onChange={e => setEditingChar({...editingChar, name: e.target.value})} 
              placeholder={t('char.name_placeholder')}
            />
          </div>
          <div className="input-group">
            <label>{t('char.system_prompt')}</label>
            <textarea 
              rows={4}
              value={editingChar.systemPrompt} 
              onChange={e => setEditingChar({...editingChar, systemPrompt: e.target.value})} 
              placeholder={t('char.system_prompt_placeholder')}
            />
          </div>
          <div className="input-group">
            <label>{t('char.personality')}</label>
            <textarea 
              rows={3}
              value={editingChar.personality} 
              onChange={e => setEditingChar({...editingChar, personality: e.target.value})} 
              placeholder={t('char.personality_placeholder')}
            />
          </div>
          <div className="input-group">
            <label>{t('char.examples')}</label>
            <textarea 
              rows={4}
              value={editingChar.exampleDialogues} 
              onChange={e => setEditingChar({...editingChar, exampleDialogues: e.target.value})} 
              placeholder={t('char.examples_placeholder')}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={handleSave}>{t('char.save')}</button>
            <button className="secondary" onClick={() => setEditingChar(null)}>{t('char.cancel')}</button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          {characters.map(char => (
            <div key={char.id} className="glass-panel" style={{ padding: '1rem' }}>
              <h4>{char.name}</h4>
              <p style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {char.systemPrompt}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button className="secondary" style={{ flex: 1 }} onClick={() => setEditingChar(char)}>{t('char.btn_edit')}</button>
                <button className="danger" onClick={() => handleDelete(char.id)}>{t('char.btn_delete')}</button>
              </div>
            </div>
          ))}
          {characters.length === 0 && <p>{t('char.no_chars')}</p>}
        </div>
      )}
    </div>
  )
}
