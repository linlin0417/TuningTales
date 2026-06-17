import React, { createContext, useContext, useState, useEffect } from 'react'

export type Language = 'en' | 'tw'

export const dictionary: Record<Language, Record<string, string>> = {
  en: {
    'nav.generator': 'Generator',
    'nav.characters': 'Characters',
    'nav.mixer': 'Dataset Mixer',
    'nav.settings': 'Settings',
    
    'settings.title': 'API Settings',
    'settings.desc': 'Configure your connection to different LLM providers.',
    'settings.ui_lang': 'UI Language',
    'settings.gen_lang': 'Generation Language (Default Output)',
    'settings.provider': 'Default Provider',
    'settings.model_name': 'Default Model Name (e.g., llama3:8b, gemini-1.5-pro, gpt-4o)',
    'settings.ollama_host': 'Host URL',
    'settings.gemini_key': 'Gemini API Key',
    'settings.openai_key': 'OpenAI API Key',
    'settings.save': 'Save Settings',
    'settings.saved': 'Settings saved successfully!',
    
    'char.library': 'Character Library',
    'char.create': 'Create New Character',
    'char.edit': 'Edit Character',
    'char.new': 'New Character',
    'char.name': 'Name',
    'char.name_placeholder': 'E.g., Alice (Tech Support)',
    'char.system_prompt': 'System Prompt (Core Persona)',
    'char.system_prompt_placeholder': 'You are Alice, a helpful tech support...',
    'char.personality': 'Personality / Guidelines',
    'char.personality_placeholder': 'Be polite, sometimes make programming jokes.',
    'char.examples': 'Example Dialogues',
    'char.examples_placeholder': 'User: Help me! AI: Did you try turning it off and on again?',
    'char.save': 'Save',
    'char.cancel': 'Cancel',
    'char.btn_edit': 'Edit',
    'char.btn_delete': 'Delete',
    'char.no_chars': 'No characters found. Create one to get started!',

    'gen.title': 'Dialogue Generator',
    'gen.select_char': 'Select Character Persona',
    'gen.target_lines': 'Target Conversation Turns',
    'gen.target_lines_desc': 'Max 2000 lines. The system will loop based on the plan to reach this target.',
    'gen.plan_topic': 'Plan Generation Prompt / Topic',
    'gen.plan_topic_placeholder': 'e.g. User is frustrated about a bug, and the AI comforts them...',
    'gen.btn_generate_plan': 'Generate Plan with AI',
    'gen.generating_plan': 'Generating Plan...',
    'gen.plan': 'Conversation Plan / Outline',
    'gen.plan_placeholder': 'e.g. 1. User complains about a bug. 2. AI comforts the user. 3. AI proposes a solution. 4. User tests it and fails. 5. AI finds the root cause...',
    'gen.btn_start': 'Start Generation',
    'gen.btn_generating': 'Generating...',
    'gen.preview': 'Live Preview',
    'gen.status': 'Status:',
    'gen.empty_preview': 'Generated conversation will appear here...',

    'mix.title': 'Dataset Mixer',
    'mix.desc': 'Merge multiple JSON/JSONL datasets and adjust their ratios.',
    'mix.config': 'Mixer Configuration',
    'mix.ratio': 'Target Roleplay Ratio (%)',
    'mix.ratio_desc': 'The system will automatically oversample or undersample the roleplay dataset to achieve this target ratio when mixed with a general dataset.',
    'mix.roleplay': 'Roleplay /',
    'mix.general': 'General',
    'mix.select_rp': 'Select Roleplay Dataset',
    'mix.select_gen': 'Select General Dataset',
    'mix.browse': 'Browse File',
    'mix.merge': 'Merge & Export Dataset',
    'mix.pending': '* Full merging backend logic is pending in this preview.'
  },
  tw: {
    'nav.generator': '對話生成器',
    'nav.characters': '角色庫',
    'nav.mixer': '資料集混合器',
    'nav.settings': '設定',
    
    'settings.title': 'API 設定',
    'settings.desc': '設定您與各個 LLM 服務提供者的連線。',
    'settings.ui_lang': '介面語言',
    'settings.gen_lang': '對話生成語言',
    'settings.provider': '預設提供者',
    'settings.model_name': '預設模型名稱 (例如: llama3:8b, gemini-1.5-pro, gpt-4o)',
    'settings.ollama_host': '主機網址 (Host URL)',
    'settings.gemini_key': 'Gemini API 金鑰',
    'settings.openai_key': 'OpenAI API 金鑰',
    'settings.save': '儲存設定',
    'settings.saved': '設定已成功儲存！',
    
    'char.library': '角色庫',
    'char.create': '建立新角色',
    'char.edit': '編輯角色',
    'char.new': '新角色',
    'char.name': '名稱',
    'char.name_placeholder': '例如：愛麗絲 (技術支援)',
    'char.system_prompt': '系統提示詞 (核心人設)',
    'char.system_prompt_placeholder': '你是愛麗絲，一位樂於助人的技術支援人員...',
    'char.personality': '個性與準則',
    'char.personality_placeholder': '保持禮貌，偶爾開個程式設計的玩笑。',
    'char.examples': '對話範例',
    'char.examples_placeholder': '使用者：救命啊！ AI：你有試過重開機嗎？',
    'char.save': '儲存',
    'char.cancel': '取消',
    'char.btn_edit': '編輯',
    'char.btn_delete': '刪除',
    'char.no_chars': '找不到角色，請建立一個角色來開始吧！',

    'gen.title': '對話生成器',
    'gen.select_char': '選擇角色設定',
    'gen.target_lines': '目標對話輪數',
    'gen.target_lines_desc': '最大 2000 輪。系統將根據對話計畫循環生成以達到此目標。',
    'gen.plan_topic': '對話主題 (供 AI 生成計畫使用)',
    'gen.plan_topic_placeholder': '例如：使用者剛下班心情不好，想要人安慰...',
    'gen.btn_generate_plan': '使用 AI 生成計畫',
    'gen.generating_plan': '計畫生成中...',
    'gen.plan': '對話計畫與大綱',
    'gen.plan_placeholder': '例如：1. 使用者抱怨遇到 bug。 2. AI 安撫使用者。 3. AI 提出解決方案。 4. 使用者測試後失敗。 5. AI 找出根本原因...',
    'gen.btn_start': '開始生成',
    'gen.btn_generating': '生成中...',
    'gen.preview': '即時預覽',
    'gen.status': '狀態：',
    'gen.empty_preview': '生成的對話將顯示在這裡...',

    'mix.title': '資料集混合器',
    'mix.desc': '合併多個 JSON/JSONL 資料集並調整其比例。',
    'mix.config': '混合器設定',
    'mix.ratio': '目標角色扮演比例 (%)',
    'mix.ratio_desc': '系統將在與通用資料集混合時，自動對角色扮演資料集進行上採樣或下採樣，以達到此目標比例。',
    'mix.roleplay': '角色扮演 /',
    'mix.general': '通用',
    'mix.select_rp': '選擇角色扮演資料集',
    'mix.select_gen': '選擇通用資料集',
    'mix.browse': '瀏覽檔案',
    'mix.merge': '合併並匯出資料集',
    'mix.pending': '* 目前預覽版本尚未實作完整合併後端邏輯。'
  }
}

export interface I18nContextProps {
  lang: Language
  setLang: (lang: Language) => void
  t: (key: string) => string
}

export const I18nContext = createContext<I18nContextProps | null>(null)

export function useTranslation() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useTranslation must be used within I18nProvider')
  return ctx
}
