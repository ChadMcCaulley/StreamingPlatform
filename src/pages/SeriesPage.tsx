import { useEffect, useState } from 'react'
import { ContentGrid } from '../components/ContentGrid'
import { DetailModal } from '../components/DetailModal'
import { fetchTitles } from '../api/catalog'
import type { Content } from '../types'

export function SeriesPage() {
  const [series, setSeries] = useState<Content[]>([])
  const [selected, setSelected] = useState<Content | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTitles({ type: 'series' })
      .then(setSeries)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page">
      <header className="page__header">
        <p className="page__kicker mono">03 · SERIES</p>
        <h1>Series</h1>
        <p>{loading ? 'Loading…' : `Episodic catalogs · ${series.length} titles`}</p>
      </header>
      <ContentGrid items={series} onSelect={setSelected} emptyMessage="No series found." />
      <DetailModal content={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
