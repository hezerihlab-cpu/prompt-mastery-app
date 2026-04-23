import { useState } from 'react'
import { scorePrompt } from '../lib/anthropic'
import type { LogEntry } from '../hooks/usePracticeLog'

interface Scenario {
  id: string
  title: string
  description: string
}

const scenarios: Scenario[] = [
  {
    id: 'email',
    title: 'ビジネスメール作成',
    description: '顧客への謝罪メールを依頼するプロンプトを書いてください',
  },
  {
    id: 'summary',
    title: '長文の要約',
    description: '技術記事を初心者向けに要約させるプロンプトを書いてください',
  },
  {
    id: 'code_review',
    title: 'コードレビュー',
    description: 'Pythonコードのレビューをさせるプロンプトを書いてください',
  },
  {
    id: 'idea',
    title: 'アイデア出し',
    description: '新しいアプリの機能アイデアを10個出させるプロンプトを書いてください',
  },
  {
    id: 'translate',
    title: '翻訳・ローカライズ',
    description: '英語のマーケティング文を日本市場向けに翻訳させるプロンプトを書いてください',
  },
]

interface Props {
  onSaveLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void
}

export default function PracticeMode({ onSaveLog }: Props) {
  const [selectedId, setSelectedId] = useState(scenarios[0].id)
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ score: number; feedback: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const scenario = scenarios.find((s) => s.id === selectedId)!

  const handleSubmit = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    setResult(null)
    setError(null)
    setSaved(false)
    try {
      const res = await scorePrompt(scenario.description, prompt)
      setResult(res)
    } catch (e) {
      setError(e instanceof Error ? e.message : '採点中にエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = () => {
    if (!result) return
    onSaveLog({
      scenario: scenario.title,
      prompt,
      score: result.score,
      feedback: result.feedback,
    })
    setSaved(true)
  }

  const scoreColor =
    result === null
      ? ''
      : result.score >= 80
        ? 'text-green-600'
        : result.score >= 60
          ? 'text-yellow-600'
          : 'text-red-600'

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          シナリオを選択
        </label>
        <select
          value={selectedId}
          onChange={(e) => {
            setSelectedId(e.target.value)
            setPrompt('')
            setResult(null)
            setError(null)
            setSaved(false)
          }}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {scenarios.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
        <p className="mt-3 text-sm text-indigo-700 bg-indigo-50 rounded-lg px-3 py-2">
          {scenario.description}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          プロンプトを入力
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={6}
          placeholder="ここにプロンプトを書いてください..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-y"
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !prompt.trim()}
          className="mt-3 w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '採点中...' : 'Claude に採点してもらう'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
          <div className="flex items-center gap-4">
            <div className={`text-5xl font-bold ${scoreColor}`}>{result.score}</div>
            <div>
              <p className="text-xs text-gray-400">スコア（100点満点）</p>
              <p className="text-sm font-medium text-gray-600">
                {result.score >= 80 ? '素晴らしい！' : result.score >= 60 ? 'もう少し！' : '改善の余地あり'}
              </p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs font-semibold text-gray-500 mb-1">フィードバック</p>
            <p className="text-sm text-gray-700 leading-relaxed">{result.feedback}</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saved}
            className="w-full border border-indigo-500 text-indigo-600 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saved ? '✓ ログに保存しました' : 'ログに保存する'}
          </button>
        </div>
      )}
    </div>
  )
}
