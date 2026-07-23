import { useCallback, useEffect, useState } from 'react'
import { fetchContinue, putContinue } from '../api/lists'
import type { Content } from '../types'

export interface ContinueEntry {
  id: string
  progress: number
  duration: number
  updatedAt: number
}

export function recordContinueWatching(
  profileId: string | null,
  id: string,
  progress: number,
  duration: number,
) {
  if (!profileId || !duration || progress < 3) return
  void putContinue(profileId, id, progress, duration).catch(() => {
    /* ignore offline */
  })
}

export function useContinueWatching(profileId: string | null) {
  const [items, setItems] = useState<
    { content: Content; progress: number; duration: number; pct: number }[]
  >([])

  const refresh = useCallback(async () => {
    if (!profileId) {
      setItems([])
      return
    }
    try {
      const data = await fetchContinue(profileId)
      setItems(
        data.map((e) => ({
          content: e.content,
          progress: e.progress,
          duration: e.duration,
          pct: e.pct,
        })),
      )
    } catch {
      setItems([])
    }
  }, [profileId])

  useEffect(() => {
    void refresh()
  }, [refresh])

  useEffect(() => {
    const onFocus = () => void refresh()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [refresh])

  const clear = useCallback(
    (_id?: string) => {
      void refresh()
    },
    [refresh],
  )

  return { items, refresh, clear }
}
