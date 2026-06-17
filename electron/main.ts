import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getSettings, saveSettings, getCharacters, saveCharacters } from './store'
import { generateDialogue } from './generator'

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
const _filename = fileURLToPath(import.meta.url)
const _dirname = path.dirname(_filename)

process.env.DIST = path.join(_dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null

const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC || '', 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(_dirname, 'preload.js'),
    },
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(process.env.DIST || '', 'index.html'))
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
  ipcMain.handle('get-settings', () => getSettings())
  ipcMain.handle('save-settings', (_, settings) => saveSettings(settings))
  ipcMain.handle('get-characters', () => getCharacters())
  ipcMain.handle('save-characters', (_, characters) => saveCharacters(characters))
  
  ipcMain.on('start-generation', (event, options) => {
    generateDialogue(options, event).catch(e => {
      event.sender.send('generator-error', e.toString())
    })
  })
  
  createWindow()
})
