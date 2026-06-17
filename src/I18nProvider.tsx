import React, { useState } from 'react'
import { I18nContext, dictionary, type Language } from './i18n'

export function I18nProvider({ children, initialLang = 'en' }: { children: React.ReactNode, initialLang?: Language }) {
  const [lang, setLang] = useState<Language>(initialLang)

  const t = (key: string) => {
    return dictionary[lang]?.[key] || key
  }

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  )
}
