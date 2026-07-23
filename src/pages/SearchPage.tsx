import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ContentGrid } from '../components/ContentGrid'
import { DetailModal } from '../components/DetailModal'
import { searchTitles } from '../api/catalog'
import type { Content } from '../types'

export function SearchPage() {
  const [params] = useSearchParams()
  const q = params.get('q') ?? ''
  const [results, setResults] = useState<Content[]>([])
  const [selected, setSelected] = useState<Content | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!q.trim()) {
      setResults([])
      return
    }
    setLoading(true)
    searchTitles(q)
      .then(setResults)
      .finally(() => setLoading(false))
  }, [q])

  return (
    <div className="page">
      <header className="page__header">
        <p className="page__kicker mono">SEARCH</p>
        <h1>Search</h1>
        <p>
          {q
            ? loading
              ? `Searching “${q}”…`
              : results.length
                ? `${results.length} result${results.length === 1 ? '' : 's'} for “${q}”`
                : `No results for “${q}”`
            : 'Search from the bar above, or press / on desktop.'}
        </p>
      </header>
      <ContentGrid
        items={results}
        onSelect={setSelected}
        emptyMessage={
          q ? 'Try another title, genre, or cast member.' : 'Start typing to search the catalog.'
        }
      />
      <DetailModal content={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
