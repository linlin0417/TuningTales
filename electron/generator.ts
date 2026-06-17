import { callLLM } from './llm'
import fs from 'node:fs'
import path from 'node:path'
import { app } from 'electron'
import type { Character } from './store'

export async function generateDialogue(options: { character: Character, plan: string, targetLines: number, outputPath: string, generationLanguage?: string }, event: any) {
  const { character, plan, targetLines, outputPath, generationLanguage = 'tw' } = options
  const defaultPath = path.join(app.getPath('userData'), `dataset_${Date.now()}.jsonl`)
  const savePath = outputPath || defaultPath

  event.sender.send('generator-status', { step: 'planning', message: 'Breaking down plan into plot points...' })
  
  const planPrompt = `Please break down the following dialogue plan into 5 to 10 distinct plot points or events. Return ONLY a JSON array of strings, nothing else. Generation language must be: ${generationLanguage}. \n\nPlan: ${plan}`
  
  let plotPoints: string[] = []
  try {
     const planRes = await callLLM([{ role: 'user', content: planPrompt }], 'You are a helpful assistant that outputs only JSON arrays.')
     const jsonStr = planRes.replace(/```json/gi, '').replace(/```/g, '').trim()
     plotPoints = JSON.parse(jsonStr)
  } catch (e) {
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

      try {
        const res = await callLLM(
          [...recentHistory, { role: 'user', content: generationPrompt }], 
          character.systemPrompt + "\n\n" + character.personality
        )
        const jsonStr = res.replace(/```json/gi, '').replace(/```/g, '').trim()
        const newTurns = JSON.parse(jsonStr)
        
        dialogueHistory.push(...newTurns)
        linesInThisPlot += newTurns.length
        totalLines += newTurns.length
        
        // Save to file incrementally or at the end. For JSONL format of complete conversation:
        // In OpenAI format, each line is a full conversation object `{"messages": [...]}`
        // But for continuous generation, maybe we write the final conversation at the end.
        // Wait, if it's 2000 lines, a single line in JSONL with 2000 messages is HUGE. But valid.
        
        event.sender.send('generator-update', { history: dialogueHistory })
      } catch (e: any) {
        console.error('Generation error', e)
        event.sender.send('generator-error', 'Error generating turn: ' + e.message)
        break // Try to move to next plot point or stop
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
