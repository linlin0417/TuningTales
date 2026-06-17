[English](README.md) | [繁體中文](README-TW.md)

# TuningTales

> 注意:此專案前端完全交由copilot生成，後端則是由我手動撰寫，並且在生成過程中不斷修正 prompt 以達到更好的結果。雖然目前版本已經相當穩定，但仍可能存在一些小問題，歡迎大家提出 issue 或 pull request 來幫助改進！
>
專為微調 AI 模型打造的「角色扮演對話資料集」生成與混合工具 (Electron + React)。
這是一個輕量、現代化的跨平台桌面應用程式，讓你可以輕鬆定義角色性格、提供故事大綱，並透過 Ollama, Gemini, 或 OpenAI 自動推演與生成可用於 LLM 微調的高品質對話資料集 (JSONL/JSON)。

請只在符合各家 API 使用規範的情況下生成與使用資料。


## 主要特色
- **強大的生成引擎**：基於滑動視窗防呆機制與情節點拆解，支援生成至多 2000 行長篇連貫對話而不會陷入跳針。
- **多模型供應商支援**：內建支援 Ollama (本地 11434 埠)、Google Gemini API 以及 OpenAI API。
- **現代化介面**：採用 React + Vite 打造的深色玻璃擬態 (Glassmorphism) GUI，提供直覺的設定與生成即時進度顯示。
- **資料集混合器 (Mixer)**：內建資料集追加與比例調整功能，確保你的微調資料集能讓模型學習到更精確的角色扮演權重。

## 安裝方式
請確保您的電腦上已經安裝了 [Node.js](https://nodejs.org/) (建議 v18 或以上版本)。

1. 克隆此專案：
   ```bash
   git clone https://github.com/your-username/TuningTales.git
   cd TuningTales
   ```

2. 安裝依賴：
   ```bash
   npm install
   ```

## 快速啟動
在終端機中執行以下指令即可開啟 TuningTales 桌面應用程式：

```bash
npm run dev
```

進入程式後，您可以：
1. 到 **Settings** 分頁填寫您的 API Keys（例如 Gemini 或 OpenAI），或是選擇使用本機的 Ollama。
2. 到 **Characters** 分頁建立並管理您的角色卡片，包含 System Prompt 與 Personality。
3. 到 **Generator** 分頁輸入您的計畫與目標行數，點擊生成即可即時查看 AI 推演的對話過程！

## 打包發布
TuningTales 支援透過 GitHub Actions 自動發布版本，但您也可以在本地端進行打包測試：
```bash
npm run build
```
編譯完成後，安裝檔將會產生在 `release/` 目錄下。

## 致謝與開源授權
Apache-2.0
