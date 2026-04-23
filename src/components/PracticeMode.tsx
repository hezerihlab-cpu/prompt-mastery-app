import { useState } from 'react'
import { SCENARIOS } from '../data/tips'
import { scorePrompt } from '../lib/anthropic'
import type { LogEntry } from '../hooks/usePracticeLog'

interface Props {
  onSaveLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void
}

const gradeColor: Record<string, string> = {
  A: 'text-green-600 bg-green-50 border-green-200',
  B: 'text-blue-600 bg-blue-50 border-blue-200',
  C: 'text-yellow-700 bg-yellow-50 border-yellow-200',
  D: 'text-red-600 bg-red-50 border-red-200',
}

const gradeLabel: Record<string, string> = {
  A: '素晴らしい！',
  B: '良いです',
  C: 'もう少し！',
  D: '改善の余地あり',
}

export default function PracticeMode({ onSaveLog }: Props) {
  const [selectedId, setSelectedId] = useState(SCENARIOS[0].id)
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ grade: string; feedback: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const scenario = SCENARIOS.find((s) => s.id === selectedId)!

  const handleSubmit = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await scorePrompt(scenario.label, scenario.desc, prompt)
      setResult(res)
      onSaveLog({
        scenario: scenario.label,
        prompt,
        grade: res.grade,
        feedback: res.feedback,
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : '採点中にエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const handleScenarioChange = (id: string) => {
    setSelectedId(id)
    setPrompt('')
    setResult(null)
    setError(null)
  }

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <p className="text-sm font-semibold text-gray-700 mb-2">シナリオを選択</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => handleScenarioChange(s.id)}
              className={`text-left px-3 py-2.5 rounded-lg border text-sm transition-colors ${
                selectedId === s.id
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-medium'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <p className="font-medium text-sm">{s.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">プロンプトを入力</label>
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
          className="mt-3 w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '採点中...' : 'AIに採点してもらう'}
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
            <div
              className={`text-4xl font-bold w-16 h-16 flex items-center justify-center rounded-xl border ${gradeColor[result.grade] ?? 'text-gray-600 bg-gray-50 border-gray-200'}`}
            >
              {result.grade}
            </div>
            <div>
              <p className="text-xs text-gray-400">総合評価</p>
              <p className="text-sm font-semibold text-gray-700 mt-0.5">
                {gradeLabel[result.grade] ?? '評価完了'}
              </p>
              <p className="text-xs text-gray-400 mt-1">ログに自動保存しました</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs font-semibold text-gray-500 mb-2">フィードバック</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{result.feedback}</p>
          </div>
        </div>
      )}
    </div>
  )
}
