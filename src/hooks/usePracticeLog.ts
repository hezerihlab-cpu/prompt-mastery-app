import { useState, useEffect } from 'react'

export interface LogEntry {
  id: string
  scenario: string
  prompt: string
  grade: string
  feedback: string
  timestamp: string
}

const STORAGE_KEY = 'prompt-mastery-logs'

export function usePracticeLog() {
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as LogEntry[]) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs))
  }, [logs])

  const addLog = (entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const newEntry: LogEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    }
    setLogs((prev) => [newEntry, ...prev])
  }

  const clearLogs = () => setLogs([])

  return { logs, addLog, clearLogs }
}
