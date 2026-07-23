import { createContext, useContext, type ReactNode } from 'react'
import { useMyList } from '../hooks/useMyList'
import { useAuth } from './AuthContext'
import type { Content } from '../types'

interface MyListContextValue {
  ids: string[]
  items: Content[]
  isInList: (id: string) => boolean
  toggle: (id: string) => void
  add: (id: string) => void
  remove: (id: string) => void
}

const MyListContext = createContext<MyListContextValue | null>(null)

export function MyListProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth()
  const value = useMyList(profile?.id ?? null)
  return <MyListContext.Provider value={value}>{children}</MyListContext.Provider>
}

export function useMyListContext() {
  const ctx = useContext(MyListContext)
  if (!ctx) throw new Error('useMyListContext must be used within MyListProvider')
  return ctx
}
