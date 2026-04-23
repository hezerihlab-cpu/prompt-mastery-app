import { Fragment, useState } from 'react'
import { TIPS, type Tip } from '../data/tips'

interface DetailPanelProps {
  tip: Tip
  onClose: () => void
}

function DetailPanel({ tip, onClose }: DetailPanelProps) {
  return (
    <div className="col-span-2 md:col-span-4 bg-white border border-gray-200 rounded-xl shadow-md p-5 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-indigo-400 tracking-widest">{tip.num}</p>
          <h3 className="text-base font-bold text-gray-800 mt-0.5">{tip.title}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{tip.sub}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none mt-0.5"
          aria-label="閉じる"
        >
          ✕
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <p className="text-xs font-semibold text-blue-600 mb-1.5">なぜ重要か？</p>
        <p className="text-sm text-blue-900 leading-relaxed">{tip.reason}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-red-50 border border-red-100 rounded-lg p-4">
          <p className="text-xs font-semibold text-red-500 mb-2">Bad ❌</p>
          <p className="text-sm text-red-900 font-mono whitespace-pre-wrap leading-relaxed">{tip.bad}</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-lg p-4">
          <p className="text-xs font-semibold text-green-600 mb-2">Good ✅</p>
          <p className="text-sm text-green-900 font-mono whitespace-pre-wrap leading-relaxed">{tip.good}</p>
        </div>
      </div>
    </div>
  )
}

function exportMarkdown() {
  const lines = TIPS.flatMap((t) => [
    `## ${t.num}. ${t.title}`,
    '',
    `> ${t.sub}`,
    '',
    '### なぜ重要か？',
    '',
    t.reason,
    '',
    '**Bad:**',
    '```',
    t.bad,
    '```',
    '',
    '**Good:**',
    '```',
    t.good,
    '```',
    '',
    '---',
    '',
  ])

  const blob = new Blob([lines.join('\n')], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'prompt-cheatsheet.md'
  a.click()
  URL.revokeObjectURL(url)
}

export default function CheatSheet() {
  const [selected, setSelected] = useState<string | null>(null)

  const toggle = (num: string) => setSelected((prev) => (prev === num ? null : num))

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-700">プロンプト設計 8原則</h2>
        <button
          onClick={exportMarkdown}
          className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Markdownでエクスポート
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {TIPS.map((tip) => (
          <Fragment key={tip.num}>
            <button
              onClick={() => toggle(tip.num)}
              className={`h-28 text-left px-4 py-3 rounded-xl border transition-colors flex flex-col justify-between ${
                selected === tip.num
                  ? 'bg-indigo-50 border-indigo-400 shadow-sm'
                  : 'bg-white border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl font-bold text-indigo-200 leading-none">{tip.num}</span>
              <div>
                <p className="text-sm font-semibold text-gray-800 leading-snug">{tip.title}</p>
                <p className="text-xs text-gray-400 mt-0.5 leading-snug line-clamp-2">{tip.sub}</p>
              </div>
            </button>

            {selected === tip.num && (
              <DetailPanel tip={tip} onClose={() => setSelected(null)} />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
