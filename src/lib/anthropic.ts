import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY as string,
  dangerouslyAllowBrowser: true,
})

export interface ScoreResult {
  score: number
  feedback: string
}

export async function scorePrompt(scenario: string, userPrompt: string): Promise<ScoreResult> {
  const systemPrompt = `あなたはプロンプトエンジニアリングの専門家です。
ユーザーが書いたプロンプトを以下の観点で100点満点で採点し、日本語でフィードバックを返してください。

採点観点：
- 具体性（指示が明確か）
- コンテキスト（背景・目的が伝わっているか）
- 出力形式（期待するフォーマットが指定されているか）
- 制約（不要な出力を防ぐ制約があるか）

必ず以下のJSON形式で返答してください：
{"score": <0-100の整数>, "feedback": "<改善点と良かった点を含む200字以内のフィードバック>"}`

  const userMessage = `シナリオ：${scenario}\n\nユーザーが書いたプロンプト：\n${userPrompt}`

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('APIからの応答をパースできませんでした')

  const parsed = JSON.parse(jsonMatch[0]) as { score: number; feedback: string }
  return { score: parsed.score, feedback: parsed.feedback }
}
