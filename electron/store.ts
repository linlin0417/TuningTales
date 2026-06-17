import { app } from 'electron'
import fs from 'node:fs'
import path from 'node:path'

const userDataPath = app.getPath('userData')
const settingsPath = path.join(userDataPath, 'settings.json')
const charactersPath = path.join(userDataPath, 'characters.json')

export interface Settings {
  openaiKey: string
  geminiKey: string
  ollamaHost: string
  defaultProvider: 'ollama' | 'gemini' | 'openai'
  defaultModelName: string
}

export interface Character {
  id: string
  name: string
  systemPrompt: string
  personality: string
  exampleDialogues: string
}

export function getSettings(): Settings {
  try {
    if (fs.existsSync(settingsPath)) {
      return JSON.parse(fs.readFileSync(settingsPath, 'utf-8'))
    }
  } catch (e) {
    console.error('Error reading settings', e)
  }
  return {
    openaiKey: '',
    geminiKey: '',
    ollamaHost: 'http://localhost:11434',
    defaultProvider: 'ollama',
    defaultModelName: ''
  }
}

export function saveSettings(settings: Settings) {
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2))
}

export function getCharacters(): Character[] {
  try {
    if (fs.existsSync(charactersPath)) {
      return JSON.parse(fs.readFileSync(charactersPath, 'utf-8'))
    }
  } catch (e) {
    console.error('Error reading characters', e)
  }
  return []
}

export function saveCharacters(characters: Character[]) {
  fs.writeFileSync(charactersPath, JSON.stringify(characters, null, 2))
}
