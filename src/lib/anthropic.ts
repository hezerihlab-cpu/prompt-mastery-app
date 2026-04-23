import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY as string,
  dangerouslyAllowBrowser: true,
})

const SYSTEM_PROMPT = `あなたはプロンプト設計の専門家です。ユーザーが書いたAIへのプロンプトを評価し、以下の観点で採点・改善案を返してください。

観点：
1. 目的の明確さ（何のためかが伝わるか）
2. 制約と自由度のバランス（固定すべきものが明示されているか）
3. 曖昧さの排除（余分な解釈を生まないか）
4. 例示・文脈の質（例や場面が提供されているか）

返答形式：
- 総合評価：A/B/C/D
- 良い点：1〜2点
- 改善点：1〜2点
- 改善後のプロンプト案：（具体的に書き直す）

簡潔に、日本語で返答してください。`

export interface ScoreResult {
  grade: string
  feedback: string
}

export async function scorePrompt(scenarioLabel: string, scenarioDesc: string, userPrompt: string): Promise<ScoreResult> {
  const userMessage = `シナリオ：${scenarioLabel}（${scenarioDesc}）\n\nユーザーが書いたプロンプト：\n${userPrompt}`

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  })

  const feedback = message.content[0].type === 'text' ? message.content[0].text : ''
  const gradeMatch = feedback.match(/総合評価[：:]\s*([ABCD])/)
  const grade = gradeMatch ? gradeMatch[1] : '—'

  return { grade, feedback }
}
