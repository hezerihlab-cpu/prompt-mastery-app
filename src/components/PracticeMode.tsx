import { useState } from 'react'
import { SCENARIOS, TIPS } from '../data/tips'
import type { LogEntry } from '../hooks/usePracticeLog'

interface Props {
  onSaveLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void
}

export default function PracticeMode({ onSaveLog }: Props) {
  const [selectedId, setSelectedId] = useState(SCENARIOS[0].id)
  const [prompt, setPrompt] = useState('')
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [saved, setSaved] = useState(false)

  const scenario = SCENARIOS.find((s) => s.id === selectedId)!

  const toggleCheck = (num: string) => {
    setChecked((prev) => {
      const next = new Set(prev)
      next.has(num) ? next.delete(num) : next.add(num)
      return next
    })
  }

  const handleScenarioChange = (id: string) => {
    setSelectedId(id)
    setPrompt('')
    setChecked(new Set())
    setSaved(false)
  }

  const handleSave = () => {
    if (!prompt.trim()) return
    onSaveLog({
      scenario: scenario.label,
      prompt,
      checkedPrinciples: Array.from(checked),
    })
    setSaved(true)
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
          onChange={(e) => {
            setPrompt(e.target.value)
            setSaved(false)
          }}
          rows={6}
          placeholder="ここにプロンプトを書いてください..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-y font-mono"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <p className="text-sm font-semibold text-gray-700 mb-3">
          セルフチェック — 使えた原則にチェックを入れてください
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {TIPS.map((tip) => (
            <label
              key={tip.num}
              className={`flex items-start gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors ${
                checked.has(tip.num)
                  ? 'border-indigo-400 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={checked.has(tip.num)}
                onChange={() => toggleCheck(tip.num)}
                className="mt-0.5 accent-indigo-600 flex-shrink-0"
              />
              <div>
                <span className="text-xs font-bold text-indigo-300 mr-1">{tip.num}</span>
                <span className="text-sm font-medium text-gray-700">{tip.title}</span>
                <p className="text-xs text-gray-400 mt-0.5">{tip.sub}</p>
              </div>
            </label>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={!prompt.trim() || saved}
            className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saved ? '✓ ログに保存しました' : `${checked.size} / 8 チェック完了 → 保存する`}
          </button>
        </div>
      </div>
    </div>
  )
}
