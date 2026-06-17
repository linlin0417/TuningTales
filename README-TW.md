# TuningTales

[English](README.md) | [繁體中文](README-TW.md)

TuningTales 是一款專為微調對話型 AI 模型（如 LLaMA, Qwen, Gemini 等）設計的輕量級資料集生成與管理桌面應用程式。

## 特色功能
- 🤖 **支援多種 LLM 提供者**：原生支援 Ollama (本地模型)、Gemini API 與 OpenAI API。
- 🎭 **角色庫管理**：建立並儲存不同的 AI 角色卡（包含 System Prompt、性格設定與範例對話）。
- 📝 **計畫導向循環生成 (Plan-based Looping)**：透過輸入「對話計畫大綱」，引擎會自動推進情節，生成高達數千行的連貫對話，並利用滑動視窗 (Sliding Window) 避免模型跳針或遺忘設定。
- 📦 **支援 OpenAI Chat 格式**：完美相容並匯出為主流行業標準的 JSONL 訓練格式。
- 🎛️ **輕量現代化 GUI**：採用玻璃擬態與深色模式設計，並透過 Electron 確保流暢的桌面原生體驗。

## 快速開始

### 開發與本地測試
1. 安裝依賴套件：
```bash
npm install
```
2. 啟動本地開發伺服器與 Electron：
```bash
npm run dev
```

### 打包與建置
建置本地平台的執行檔：
```bash
npm run build
```

## 技術堆疊
- 前端：React + Vite + TypeScript + Vanilla CSS
- 後端：Electron Main Process (Node.js)

## 授權條款
MIT License
