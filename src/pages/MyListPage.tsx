import { useLayoutEffect, useRef, useState } from 'react'
import { ContentGrid } from '../components/ContentGrid'
import { DetailModal } from '../components/DetailModal'
import { useMyListContext } from '../context/MyListContext'
import type { Content } from '../types'
import './MyListPage.css'

export function MyListPage() {
  const { items } = useMyListContext()
  const [selected, setSelected] = useState<Content | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const [fromBento, setFromBento] = useState(false)

  useLayoutEffect(() => {
    const joinVt = sessionStorage.getItem('signal-mylist-vt') === '1'
    if (joinVt) {
      sessionStorage.removeItem('signal-mylist-vt')
      setFromBento(true)
      const el = rootRef.current
      if (el) el.style.viewTransitionName = 'my-list-panel'
      const clear = window.setTimeout(() => {
        if (el) el.style.viewTransitionName = ''
      }, 700)
      return () => window.clearTimeout(clear)
    }
    return undefined
  }, [])

  return (
    <div
      ref={rootRef}
      className={`page my-list-page ${fromBento ? 'my-list-page--from-bento' : 'my-list-page--enter'}`}
    >
      <header className="page__header my-list-page__header">
        <p className="page__kicker mono">04 · MY LIST</p>
        <h1>My List</h1>
        <p>
          {items.length
            ? `${items.length} title${items.length === 1 ? '' : 's'} saved for later`
            : 'Save titles while you browse — they show up here.'}
        </p>
      </header>
      <ContentGrid
        items={items}
        onSelect={setSelected}
        emptyMessage="Nothing here yet. Browse Home or Movies and tap + to add titles."
      />
      <DetailModal content={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
