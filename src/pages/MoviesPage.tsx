import { useEffect, useState } from 'react'
import { ContentGrid } from '../components/ContentGrid'
import { DetailModal } from '../components/DetailModal'
import { fetchTitles } from '../api/catalog'
import type { Content } from '../types'

export function MoviesPage() {
  const [movies, setMovies] = useState<Content[]>([])
  const [selected, setSelected] = useState<Content | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTitles({ type: 'movie' })
      .then(setMovies)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page">
      <header className="page__header">
        <p className="page__kicker mono">02 · MOVIES</p>
        <h1>Movies</h1>
        <p>
          {loading
            ? 'Loading…'
            : `Films, shorts, and one-off experiences · ${movies.length} titles`}
        </p>
      </header>
      <ContentGrid items={movies} onSelect={setSelected} emptyMessage="No movies found." />
      <DetailModal content={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
