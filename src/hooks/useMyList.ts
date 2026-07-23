import { useCallback, useEffect, useState } from 'react'
import { fetchMyList, toggleMyList } from '../api/lists'
import { getCachedTitle } from '../api/catalog'
import type { Content } from '../types'

export function useMyList(profileId: string | null) {
  const [ids, setIds] = useState<string[]>([])
  const [items, setItems] = useState<Content[]>([])
  const [loading, setLoading] = useState(false)

  const reload = useCallback(async () => {
    if (!profileId) {
      setIds([])
      setItems([])
      return
    }
    setLoading(true)
    try {
      const data = await fetchMyList(profileId)
      setIds(data.ids)
      setItems(data.items)
    } catch {
      setIds([])
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [profileId])

  useEffect(() => {
    void reload()
  }, [reload])

  const isInList = useCallback((id: string) => ids.includes(id), [ids])

  const toggle = useCallback(
    (id: string) => {
      if (!profileId) return
      // optimistic
      setIds((prev) => {
        const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        return next
      })
      setItems((prev) => {
        if (prev.some((c) => c.id === id)) return prev.filter((c) => c.id !== id)
        const cached = getCachedTitle(id)
        return cached ? [...prev, cached] : prev
      })
      void toggleMyList(profileId, id)
        .then((res) => {
          setIds(res.ids)
          return fetchMyList(profileId)
        })
        .then((data) => {
          setIds(data.ids)
          setItems(data.items)
        })
        .catch(() => {
          void reload()
        })
    },
    [profileId, reload],
  )

  const add = useCallback(
    (id: string) => {
      if (!profileId || ids.includes(id)) return
      toggle(id)
    },
    [profileId, ids, toggle],
  )

  const remove = useCallback(
    (id: string) => {
      if (!profileId || !ids.includes(id)) return
      toggle(id)
    },
    [profileId, ids, toggle],
  )

  return { ids, items, isInList, toggle, add, remove, loading, reload }
}
