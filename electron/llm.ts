import { getSettings } from './store'

export async function callLLM(messages: any[], systemPrompt: string, temperature = 0.7, signal?: AbortSignal) {
  const settings = getSettings()
  const provider = settings.defaultProvider
  const model = settings.defaultModelName

  const fullMessages = [{ role: 'system', content: systemPrompt }, ...messages]

  if (provider === 'ollama') {
    const res = await fetch(`${settings.ollamaHost}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages: fullMessages, stream: false, options: { temperature } }),
      signal
    })
    const data: any = await res.json()
    return data.message.content
  }

  if (provider === 'openai') {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.openaiKey}`
      },
      body: JSON.stringify({ model, messages: fullMessages, temperature }),
      signal
    })
    const data: any = await res.json()
    return data.choices[0].message.content
  }

  if (provider === 'gemini') {
    const geminiMessages = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${settings.geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: { text: systemPrompt } },
        contents: geminiMessages,
        generationConfig: { temperature }
      }),
      signal
    })
    const data: any = await res.json()
    return data.candidates[0].content.parts[0].text
  }
  
  throw new Error('Unknown provider')
}
