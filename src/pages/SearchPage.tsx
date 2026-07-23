import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ContentGrid } from '../components/ContentGrid'
import { DetailModal } from '../components/DetailModal'
import { searchCatalog } from '../data/catalog'
import type { Content } from '../types'

export function SearchPage() {
  const [params] = useSearchParams()
  const q = params.get('q') ?? ''
  const results = useMemo(() => searchCatalog(q), [q])
  const [selected, setSelected] = useState<Content | null>(null)

  return (
    <div className="page">
      <header className="page__header">
        <p className="page__kicker mono">SEARCH</p>
        <h1>Search</h1>
        <p className="mono">
          {q
            ? results.length
              ? `${results.length} hits · “${q}”`
              : `0 hits · “${q}”`
            : '// use the top bar or press /'}
        </p>
      </header>
      <ContentGrid
        items={results}
        onSelect={setSelected}
        emptyMessage={q ? '// try another title, genre, or cast member' : '// start typing to search'}
      />
      <DetailModal content={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
