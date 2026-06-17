[English](README.md) | [繁體中文](README-TW.md)

# TuningTales

A lightweight and modern Desktop Application (Electron + React) designed to generate and mix "Role-Playing Dialogue Datasets" for AI model fine-tuning.
It allows you to define character personalities, provide a story plan, and automatically generate high-quality dataset conversations (JSONL/JSON) using Ollama, Gemini, or OpenAI.

Please use the generated datasets in compliance with the respective API provider's Terms of Service.

## Key Features
- **Robust Generation Engine**: Utilizes a sliding-window mechanism and plot-point breakdown to support up to 2000 lines of coherent long-form dialogue generation without repetitive loops.
- **Multi-Provider Support**: Built-in support for Ollama (local port 11434), Google Gemini API, and OpenAI API.
- **Modern GUI**: A sleek dark-themed, glassmorphism UI built with React + Vite, providing intuitive configuration and real-time generation progress.
- **Dataset Mixer**: Built-in dataset appending and ratio adjustment features to ensure your fine-tuning dataset gives the correct weight to role-playing data.

## Installation
Ensure you have [Node.js](https://nodejs.org/) (v18 or newer) installed.

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/TuningTales.git
   cd TuningTales
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Quick Start
Run the following command in your terminal to launch the TuningTales desktop app:

```bash
npm run dev
```

Once inside the app, you can:
1. Go to the **Settings** tab to enter your API Keys (e.g., Gemini or OpenAI), or select local Ollama.
2. Go to the **Characters** tab to create and manage your character cards, including System Prompts and Personality traits.
3. Go to the **Generator** tab, input your story plan and target lines, and click generate to watch the AI deduce the conversation in real-time!

## Build and Release
TuningTales supports automated releases via GitHub Actions. You can also build it locally:
```bash
npm run build
```
After building, the installers will be available in the `release/` directory.

## Credits & License
This project is open-source. Community contributions and Pull Requests are welcome!
