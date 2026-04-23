import Anthropic from '@anthropic-ai/sdk'

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined
const IS_MOCK = !API_KEY || API_KEY === 'your_api_key_here'

const client = IS_MOCK
  ? null
  : new Anthropic({ apiKey: API_KEY, dangerouslyAllowBrowser: true })

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
  isMock?: boolean
}

function mockScore(userPrompt: string): ScoreResult {
  const len = userPrompt.trim().length
  const hasExample = /例|たとえば|like|example/i.test(userPrompt)
  const hasPurpose = /ため|目的|したい|ほしい|して(?:ください|くれ)/i.test(userPrompt)
  const hasConstraint = /禁止|しない|使わない|以内|文字|制限/i.test(userPrompt)

  const score = (len > 30 ? 1 : 0) + (hasExample ? 1 : 0) + (hasPurpose ? 1 : 0) + (hasConstraint ? 1 : 0)
  const grade = score >= 4 ? 'A' : score === 3 ? 'B' : score === 2 ? 'C' : 'D'

  const feedbacks: Record<string, string> = {
    A: `- 総合評価：A\n- 良い点：目的・制約・例示がバランスよく含まれており、AIが迷わず動ける設計になっています。文脈の明示も十分です。\n- 改善点：さらに出力フォーマットを指定すると完璧です。\n- 改善後のプロンプト案：（現状でも高品質です。出力形式を「箇条書き3点」などと加えるとより安定します）\n\n※ これはモックの採点です。実際の採点にはAPIキーが必要です。`,
    B: `- 総合評価：B\n- 良い点：目的や文脈がある程度伝わっており、基本的な構造はできています。\n- 改善点：例示または具体的な制約を追加するとさらに精度が上がります。\n- 改善後のプロンプト案：「例えば〜のような形式で」または「〜字以内で」など制約を1つ追加してみてください。\n\n※ これはモックの採点です。実際の採点にはAPIキーが必要です。`,
    C: `- 総合評価：C\n- 良い点：指示の方向性は伝わります。\n- 改善点：「何のために」という目的と、Bad/Goodの例示が不足しています。AIが解釈を広げすぎてしまう状態です。\n- 改善後のプロンプト案：「〇〇のために、△△な形式で、例えば〜のように書いてください」と構造化してみてください。\n\n※ これはモックの採点です。実際の採点にはAPIキーが必要です。`,
    D: `- 総合評価：D\n- 良い点：何かを依頼しようとしている意図は読み取れます。\n- 改善点：目的・制約・例示のすべてが不足しています。AIに全部を委ねている状態で、出力が不安定になります。\n- 改善後のプロンプト案：「【目的】〜 【制約】〜 【例】〜」の3点セットを意識して書き直してみてください。\n\n※ これはモックの採点です。実際の採点にはAPIキーが必要です。`,
  }

  return { grade, feedback: feedbacks[grade], isMock: true }
}

export async function scorePrompt(scenarioLabel: string, scenarioDesc: string, userPrompt: string): Promise<ScoreResult> {
  if (IS_MOCK || !client) {
    await new Promise((r) => setTimeout(r, 800))
    return mockScore(userPrompt)
  }

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

export { IS_MOCK }
