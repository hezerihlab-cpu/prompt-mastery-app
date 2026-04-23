import { useState } from 'react'
import { TIPS } from '../data/tips'

function TipCard({ tip }: { tip: typeof TIPS[number] }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left px-4 py-4 flex items-start justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl font-bold text-indigo-200 leading-none mt-0.5 flex-shrink-0">{tip.num}</span>
          <div>
            <h3 className="font-semibold text-gray-800 text-sm leading-snug">{tip.title}</h3>
            <p className="text-xs text-gray-500 mt-1 leading-snug">{tip.sub}</p>
          </div>
        </div>
        <span className="text-gray-300 ml-2 flex-shrink-0 text-sm mt-0.5">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-gray-100 space-y-2 pt-3">
          <div className="bg-red-50 rounded-lg p-3">
            <p className="text-xs font-semibold text-red-500 mb-1">Bad ❌</p>
            <p className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">{tip.bad}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-xs font-semibold text-green-600 mb-1">Good ✅</p>
            <p className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">{tip.good}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function exportMarkdown() {
  const lines = TIPS.flatMap((t) => [
    `## ${t.num}. ${t.title}`,
    '',
    t.sub,
    '',
    '**Bad:**',
    `> ${t.bad}`,
    '',
    '**Good:**',
    `> ${t.good}`,
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-start">
        {TIPS.map((tip) => (
          <TipCard key={tip.num} tip={tip} />
        ))}
      </div>
    </div>
  )
}
