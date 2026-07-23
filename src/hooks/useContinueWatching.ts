import { useCallback, useEffect, useState } from 'react'
import { getContentById } from '../data/catalog'
import type { Content } from '../types'

const PREFIX = 'signal-continue'

export interface ContinueEntry {
  id: string
  progress: number
  duration: number
  updatedAt: number
}

function key(profileId: string | null) {
  return `${PREFIX}:${profileId ?? 'anon'}`
}

function read(profileId: string | null): ContinueEntry[] {
  try {
    const raw = localStorage.getItem(key(profileId))
    if (!raw) return []
    const parsed = JSON.parse(raw) as ContinueEntry[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function write(profileId: string | null, entries: ContinueEntry[]) {
  localStorage.setItem(key(profileId), JSON.stringify(entries.slice(0, 8)))
}

export function recordContinueWatching(
  profileId: string | null,
  id: string,
  progress: number,
  duration: number,
) {
  if (!duration || progress < 3) return
  // Completed (>92%) — drop from continue
  if (progress / duration > 0.92) {
    const next = read(profileId).filter((e) => e.id !== id)
    write(profileId, next)
    return
  }
  const rest = read(profileId).filter((e) => e.id !== id)
  write(profileId, [
    { id, progress, duration, updatedAt: Date.now() },
    ...rest,
  ])
}

export function useContinueWatching(profileId: string | null) {
  const [entries, setEntries] = useState<ContinueEntry[]>(() => read(profileId))

  useEffect(() => {
    setEntries(read(profileId))
  }, [profileId])

  const refresh = useCallback(() => {
    setEntries(read(profileId))
  }, [profileId])

  useEffect(() => {
    const onFocus = () => refresh()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [refresh])

  const items = entries
    .map((e) => {
      const content = getContentById(e.id)
      if (!content) return null
      return {
        content,
        progress: e.progress,
        duration: e.duration,
        pct: Math.round((e.progress / e.duration) * 100),
      }
    })
    .filter((x): x is { content: Content; progress: number; duration: number; pct: number } =>
      Boolean(x),
    )

  const clear = useCallback(
    (id?: string) => {
      if (id) write(profileId, read(profileId).filter((e) => e.id !== id))
      else write(profileId, [])
      setEntries(read(profileId))
    },
    [profileId],
  )

  return { items, refresh, clear }
}
