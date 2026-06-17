import { useState, useEffect } from 'react'
import { MessageSquare, Users, Settings as SettingsIcon, Database, Play } from 'lucide-react'
import { Settings } from './components/Settings'
import { Characters } from './components/Characters'
import { Generator } from './components/Generator'
import { Mixer } from './components/Mixer'
import { useTranslation } from './i18n'
import { I18nProvider } from './I18nProvider'
import './App.css'

function MainApp() {
  const [activeTab, setActiveTab] = useState('generator')
  const { t } = useTranslation()

  const navItems = [
    { id: 'generator', label: t('nav.generator'), icon: <Play size={20} /> },
    { id: 'characters', label: t('nav.characters'), icon: <Users size={20} /> },
    { id: 'mixer', label: t('nav.mixer'), icon: <Database size={20} /> },
    { id: 'settings', label: t('nav.settings'), icon: <SettingsIcon size={20} /> },
  ]

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div 
        className="glass-panel" 
        style={{ 
          width: '240px', 
          margin: '1rem', 
          display: 'flex', 
          flexDirection: 'column',
          padding: '1rem 0'
        }}
      >
        <div style={{ padding: '0 1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MessageSquare color="var(--accent-primary)" />
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>TuningTales</h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0 1rem' }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={activeTab === item.id ? '' : 'secondary'}
              style={{ 
                justifyContent: 'flex-start',
                padding: '0.8rem 1rem',
                opacity: activeTab === item.id ? 1 : 0.7,
                boxShadow: activeTab === item.id ? 'none' : 'none',
                backgroundColor: activeTab === item.id ? 'var(--accent-primary)' : 'transparent',
                border: 'none',
                textAlign: 'left'
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div style={{ 
        flex: 1, 
        padding: '1rem 1rem 1rem 0',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div className="glass-panel animate-fade-in" style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          {activeTab === 'generator' && <Generator />}
          {activeTab === 'characters' && <Characters />}
          {activeTab === 'mixer' && <Mixer />}
          {activeTab === 'settings' && <Settings />}
        </div>
      </div>
    </div>
  )
}

function App() {
  const [initialLang, setInitialLang] = useState<'en' | 'tw' | null>(null)

  useEffect(() => {
    if (window.ipcRenderer) {
      window.ipcRenderer.invoke('get-settings').then((data: any) => {
        setInitialLang(data?.uiLanguage || 'en')
      })
    }
  }, [])

  if (!window.ipcRenderer) {
    return (
      <div style={{ color: 'white', padding: '2rem' }}>
        <h2>Electron IPC Error</h2>
        <p>window.ipcRenderer is undefined. The preload script failed to load or this is not running in Electron.</p>
      </div>
    )
  }

  if (!initialLang) return null // Wait for settings to load

  return (
    <I18nProvider initialLang={initialLang}>
      <MainApp />
    </I18nProvider>
  )
}

export default App
