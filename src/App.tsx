import { useState } from 'react'
import TabNav from './components/TabNav'
import CheatSheet from './components/CheatSheet'
import PracticeMode from './components/PracticeMode'
import PracticeLog from './components/PracticeLog'
import { usePracticeLog } from './hooks/usePracticeLog'

type Tab = 'cheatsheet' | 'practice' | 'log'

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('cheatsheet')
  const { logs, addLog, clearLogs } = usePracticeLog()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-700 text-white py-4 px-6 shadow">
        <h1 className="text-xl font-bold tracking-wide">Prompt Mastery App</h1>
        <p className="text-indigo-200 text-sm mt-0.5">プロンプト設計を練習しよう</p>
      </header>

      <TabNav activeTab={activeTab} onChange={setActiveTab} />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {activeTab === 'cheatsheet' && <CheatSheet />}
        {activeTab === 'practice' && <PracticeMode onSaveLog={addLog} />}
        {activeTab === 'log' && <PracticeLog logs={logs} onClear={clearLogs} />}
      </main>
    </div>
  )
}
