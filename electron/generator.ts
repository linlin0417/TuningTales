import { callLLM } from './llm'
import fs from 'node:fs'
import path from 'node:path'
import { app } from 'electron'
import type { Character } from './store'

function safeParseJSON(str: string) {
  try {
    return JSON.parse(str)
  } catch (e) {
    const fixedStr = str.replace(/「/g, '"').replace(/」/g, '"').replace(/```json/gi, '').replace(/```/g, '').trim()
    return JSON.parse(fixedStr)
  }
}

export async function generateDialogue(options: { character: Character, plan: string, targetLines: number, outputPath: string, generationLanguage?: string }, event: any, signal?: AbortSignal) {
  const { character, plan, targetLines, outputPath, generationLanguage = 'tw' } = options
  const defaultPath = path.join(app.getPath('userData'), `dataset_${Date.now()}.jsonl`)
  const savePath = outputPath || defaultPath

  event.sender.send('generator-status', { step: 'planning', message: 'Breaking down plan into plot points...' })
  
  const planPrompt = `Please break down the following dialogue plan into 5 to 10 distinct plot points or events. Return ONLY a JSON array of strings, nothing else. Generation language must be: ${generationLanguage}. \n\nPlan: ${plan}`
  
  let plotPoints: string[] = []
  try {
     if (signal?.aborted) return
     const planRes = await callLLM([{ role: 'user', content: planPrompt }], 'You are a helpful assistant that outputs only JSON arrays.', 0.7, signal)
     plotPoints = safeParseJSON(planRes)
     if (!Array.isArray(plotPoints)) throw new Error('Not an array')
  } catch (e: any) {
     if (e.name === 'AbortError') return
     console.error('Failed to parse plot points', e)
     plotPoints = [plan] 
  }

  let dialogueHistory: any[] = []
  let totalLines = 0
  const linesPerPlot = Math.ceil(targetLines / plotPoints.length)

  for (let i = 0; i < plotPoints.length; i++) {
    const currentObjective = plotPoints[i]
    let linesInThisPlot = 0

    while (linesInThisPlot < linesPerPlot && totalLines < targetLines) {
      event.sender.send('generator-status', { 
        step: 'generating', 
        message: `Plot ${i+1}/${plotPoints.length}: ${currentObjective}`,
        progress: totalLines,
        total: targetLines
      })
      
      // Sliding window
      const windowSize = 20
      const recentHistory = dialogueHistory.slice(-windowSize)
      
      const generationPrompt = `[Current Plot Point: ${currentObjective}]
Based on the current plot point and the character's persona, continue the conversation in ${generationLanguage}.
Generate exactly 1 turn for the user and 1 turn for the assistant.
Return ONLY valid JSON in this exact format:
[
  {"role": "user", "content": "..."},
  {"role": "assistant", "content": "..."}
]`

      if (signal?.aborted) return

      let success = false
      let attempts = 0
      
      const fullSystemPrompt = [
        character.highPriorityPrompt,
        character.systemPrompt,
        character.personality,
        character.lowPriorityPrompt
      ].filter(Boolean).join('\n\n')

      while (!success && attempts < 3) {
        if (signal?.aborted) return
        attempts++
        try {
          const res = await callLLM(
            [...recentHistory, { role: 'user', content: generationPrompt }], 
            fullSystemPrompt,
            0.7,
            signal
          )
          const newTurns = safeParseJSON(res)
          
          if (!Array.isArray(newTurns)) throw new Error('Expected JSON array')
          
          dialogueHistory.push(...newTurns)
          linesInThisPlot += newTurns.length
          totalLines += newTurns.length
          
          event.sender.send('generator-update', { history: dialogueHistory })
          success = true
        } catch (e: any) {
          if (e.name === 'AbortError') return
          console.error(`Generation error (Attempt ${attempts}/3)`, e)
          if (attempts >= 3) {
            event.sender.send('generator-error', 'Error generating turn after 3 attempts: ' + e.message)
            return // Give up completely if 3 attempts fail
          }
        }
      }
    }
  }

  // Final save
  event.sender.send('generator-status', { step: 'saving', message: `Saving to ${savePath}...` })
  
  const finalDatasetItem = {
    messages: [
      { role: 'system', content: character.systemPrompt },
      ...dialogueHistory
    ]
  }

  fs.appendFileSync(savePath, JSON.stringify(finalDatasetItem) + '\n', 'utf-8')

  event.sender.send('generator-status', { step: 'done', message: 'Generation complete!' })
}

export async function generatePlanWithAI(options: { character: Character, topic: string, generationLanguage: string }): Promise<string> {
  const { character, topic, generationLanguage = 'tw' } = options
  
  const fullSystemPrompt = [
    character.highPriorityPrompt,
    character.systemPrompt,
    character.personality,
    character.lowPriorityPrompt
  ].filter(Boolean).join('\n\n')

  const prompt = `You are a creative dialogue planner. The user wants to generate a conversation outline based on the following topic:
"${topic}"

The AI assistant's persona is defined as follows:
${fullSystemPrompt}

Please generate a step-by-step dialogue plan (outline).
Format Requirements:
1. It MUST be a numbered list (e.g. 1. 2. 3.).
2. Generate exactly 5 to 10 points.
3. Only output the outline itself, no introductory or concluding remarks.
4. Output language must be: ${generationLanguage}.`

  try {
    const res = await callLLM([{ role: 'user', content: prompt }], 'You are a dialogue planner that outputs strictly numbered lists.')
    return res.trim()
  } catch (e: any) {
    console.error('Plan generation error', e)
    throw new Error('Failed to generate plan: ' + e.message)
  }
}
