import { useState } from 'react'
import { ContentGrid } from '../components/ContentGrid'
import { DetailModal } from '../components/DetailModal'
import { getMovies } from '../data/catalog'
import type { Content } from '../types'

export function MoviesPage() {
  const movies = getMovies()
  const [selected, setSelected] = useState<Content | null>(null)

  return (
    <div className="page">
      <header className="page__header">
        <p className="page__kicker mono">02 · MOVIES</p>
        <h1>Movies</h1>
        <p>Films, shorts, and one-off experiences · {movies.length} titles</p>
      </header>
      <ContentGrid items={movies} onSelect={setSelected} />
      <DetailModal content={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
