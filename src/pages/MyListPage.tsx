import { useState } from 'react'
import { ContentGrid } from '../components/ContentGrid'
import { DetailModal } from '../components/DetailModal'
import { useMyListContext } from '../context/MyListContext'
import type { Content } from '../types'

export function MyListPage() {
  const { items } = useMyListContext()
  const [selected, setSelected] = useState<Content | null>(null)

  return (
    <div className="page">
      <header className="page__header">
        <p className="page__kicker mono">04 · MY LIST</p>
        <h1>My List</h1>
        <p className="mono">
          {items.length
            ? `${items.length} saved · per-profile storage`
            : '// empty — browse and tap +'}
        </p>
      </header>
      <ContentGrid
        items={items}
        onSelect={setSelected}
        emptyMessage="// nothing queued — add titles from Home or Movies"
      />
      <DetailModal content={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
