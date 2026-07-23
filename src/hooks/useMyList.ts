import { useCallback, useEffect, useState } from 'react'
import { getContentById } from '../data/catalog'
import type { Content } from '../types'

const STORAGE_PREFIX = 'streamflix-my-list'

function storageKey(profileId: string | null) {
  return `${STORAGE_PREFIX}:${profileId ?? 'anon'}`
}

function readIds(profileId: string | null): string[] {
  try {
    const raw = localStorage.getItem(storageKey(profileId))
    if (!raw) return []
    const parsed = JSON.parse(raw) as string[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeIds(profileId: string | null, ids: string[]) {
  localStorage.setItem(storageKey(profileId), JSON.stringify(ids))
}

export function useMyList(profileId: string | null) {
  const [ids, setIds] = useState<string[]>(() => readIds(profileId))

  useEffect(() => {
    setIds(readIds(profileId))
  }, [profileId])

  useEffect(() => {
    const key = storageKey(profileId)
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) setIds(readIds(profileId))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [profileId])

  const items: Content[] = ids
    .map((id) => getContentById(id))
    .filter((c): c is Content => Boolean(c))

  const isInList = useCallback((id: string) => ids.includes(id), [ids])

  const toggle = useCallback(
    (id: string) => {
      setIds((prev) => {
        const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        writeIds(profileId, next)
        return next
      })
    },
    [profileId],
  )

  const add = useCallback(
    (id: string) => {
      setIds((prev) => {
        if (prev.includes(id)) return prev
        const next = [...prev, id]
        writeIds(profileId, next)
        return next
      })
    },
    [profileId],
  )

  const remove = useCallback(
    (id: string) => {
      setIds((prev) => {
        const next = prev.filter((x) => x !== id)
        writeIds(profileId, next)
        return next
      })
    },
    [profileId],
  )

  return { ids, items, isInList, toggle, add, remove }
}
