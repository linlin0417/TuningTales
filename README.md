# TuningTales

[English](README.md) | [繁體中文](README-TW.md)

TuningTales is a lightweight desktop application built for generating and managing fine-tuning datasets for conversational AI models like LLaMA, Qwen, and Gemini.

## Features
- 🤖 **Multiple LLM Providers**: Native support for Ollama (local), Gemini API, and OpenAI API.
- 🎭 **Character Library**: Create and store different AI character personas, including system prompts and personality traits.
- 📝 **Plan-based Looping Generator**: Feed a dialogue plan outline, and the engine automatically advances plot points to generate up to thousands of lines of coherent conversation. Uses a sliding window to prevent model looping or forgetting context.
- 📦 **OpenAI Chat Format**: Generates and exports datasets in the industry-standard JSONL format for direct fine-tuning.
- 🎛️ **Modern GUI**: Built with Electron, Vite, React, and a glassmorphism dark-mode UI.

## Getting Started

### Development
1. Install dependencies:
```bash
npm install
```
2. Start the local dev server and Electron window:
```bash
npm run dev
```

### Build
Build the executable for your local platform:
```bash
npm run build
```

## Tech Stack
- Frontend: React + Vite + TypeScript + Vanilla CSS
- Backend: Electron Main Process (Node.js)

## License
MIT License
