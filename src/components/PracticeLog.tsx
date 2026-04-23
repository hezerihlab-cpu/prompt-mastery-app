import type { LogEntry } from '../hooks/usePracticeLog'

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
  const lines = logs.flatMap((log) => [
    `## ${log.scenario} — ${formatDate(log.timestamp)}`,
    '',
    `**スコア:** ${log.score}点`,
    '',
    '**プロンプト:**',
    '```',
    log.prompt,
    '```',
    '',
    `**フィードバック:** ${log.feedback}`,
    '',
    '---',
    '',
  ])

  const blob = new Blob([lines.join('\n')], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'practice-log.md'
  a.click()
  URL.revokeObjectURL(url)
}

const scoreColor = (score: number) =>
  score >= 80 ? 'text-green-600 bg-green-50' : score >= 60 ? 'text-yellow-700 bg-yellow-50' : 'text-red-600 bg-red-50'

export default function PracticeLog({ logs, onClear }: Props) {
  if (logs.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">📭</p>
        <p className="text-sm">まだ練習ログがありません。</p>
        <p className="text-sm">練習モードでプロンプトを採点してログを保存しましょう。</p>
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
            onClick={() => {
              if (confirm('全ログを削除しますか？')) onClear()
            }}
            className="text-sm border border-red-300 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
          >
            全削除
          </button>
        </div>
      </div>
      <div className="space-y-3">
        {logs.map((log) => (
          <div key={log.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <span className="text-xs text-gray-400">{formatDate(log.timestamp)}</span>
                <p className="font-semibold text-gray-800 text-sm mt-0.5">{log.scenario}</p>
              </div>
              <span
                className={`text-lg font-bold px-3 py-1 rounded-lg flex-shrink-0 ${scoreColor(log.score)}`}
              >
                {log.score}点
              </span>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <p className="text-xs text-gray-400 mb-1">プロンプト</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{log.prompt}</p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-3">
              <p className="text-xs text-indigo-400 mb-1">フィードバック</p>
              <p className="text-sm text-gray-700">{log.feedback}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
