import { useState } from 'react'
import { tips, type Tip } from '../data/tips'

function TipCard({ tip }: { tip: Tip }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div>
          <h3 className="font-semibold text-gray-800">{tip.principle}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{tip.summary}</p>
        </div>
        <span className="text-gray-400 ml-4 flex-shrink-0 text-lg">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-gray-100 space-y-4 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-red-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-red-500 mb-1">Before ❌</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{tip.before}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-green-600 mb-1">After ✅</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{tip.after}</p>
            </div>
          </div>
          <div className="bg-indigo-50 rounded-lg p-3">
            <p className="text-xs font-semibold text-indigo-600 mb-1">ポイント 💡</p>
            <p className="text-sm text-gray-700">{tip.point}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function exportMarkdown() {
  const lines = tips.flatMap((t) => [
    `## ${t.principle}`,
    '',
    t.summary,
    '',
    '**Before:**',
    `> ${t.before}`,
    '',
    '**After:**',
    `> ${t.after}`,
    '',
    `**ポイント:** ${t.point}`,
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
      <div className="space-y-3">
        {tips.map((tip) => (
          <TipCard key={tip.id} tip={tip} />
        ))}
      </div>
    </div>
  )
}
