import type { LogEntry } from '../hooks/usePracticeLog'
import { TIPS } from '../data/tips'

interface Props {
  logs: LogEntry[]
  onClear: () => void
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function exportMarkdown(logs: LogEntry[]) {
  const lines = logs.flatMap((log) => {
    const checkedTitles = TIPS
      .filter((t) => log.checkedPrinciples.includes(t.num))
      .map((t) => `- [x] ${t.num} ${t.title}`)
    const uncheckedTitles = TIPS
      .filter((t) => !log.checkedPrinciples.includes(t.num))
      .map((t) => `- [ ] ${t.num} ${t.title}`)

    return [
      `## ${log.scenario} — ${formatDate(log.timestamp)}`,
      '',
      '**プロンプト:**',
      '```',
      log.prompt,
      '```',
      '',
      `**使えた原則（${log.checkedPrinciples.length} / 8）:**`,
      ...checkedTitles,
      ...uncheckedTitles,
      '',
      '---',
      '',
    ]
  })

  const blob = new Blob([lines.join('\n')], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'practice-log.md'
  a.click()
  URL.revokeObjectURL(url)
}

export default function PracticeLog({ logs, onClear }: Props) {
  if (logs.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">📭</p>
        <p className="text-sm">まだ練習ログがありません。</p>
        <p className="text-sm">練習モードでプロンプトを書いてセルフチェックしましょう。</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-700">練習ログ（{logs.length}件）</h2>
        <div className="flex gap-2">
          <button
            onClick={() => exportMarkdown(logs)}
            className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Markdownでエクスポート
          </button>
          <button
            onClick={() => { if (confirm('全ログを削除しますか？')) onClear() }}
            className="text-sm border border-red-300 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
          >
            全削除
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {logs.map((log) => (
          <div key={log.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <span className="text-xs text-gray-400">{formatDate(log.timestamp)}</span>
                <p className="font-semibold text-gray-800 text-sm mt-0.5">{log.scenario}</p>
              </div>
              <span className="flex-shrink-0 text-sm font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                {log.checkedPrinciples.length} / 8
              </span>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <p className="text-xs text-gray-400 mb-1">プロンプト</p>
              <p className="text-sm text-gray-700 font-mono whitespace-pre-wrap leading-relaxed">{log.prompt}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-2">使えた原則</p>
              <div className="flex flex-wrap gap-1.5">
                {TIPS.map((tip) => (
                  <span
                    key={tip.num}
                    className={`text-xs px-2 py-1 rounded-md font-medium ${
                      log.checkedPrinciples.includes(tip.num)
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {tip.num} {tip.title}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
