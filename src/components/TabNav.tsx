type Tab = 'cheatsheet' | 'practice' | 'log'

interface Props {
  activeTab: Tab
  onChange: (tab: Tab) => void
}

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'cheatsheet', label: 'チートシート', icon: '📋' },
  { id: 'practice', label: '練習モード', icon: '✏️' },
  { id: 'log', label: 'ログ', icon: '📝' },
]

export default function TabNav({ activeTab, onChange }: Props) {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
