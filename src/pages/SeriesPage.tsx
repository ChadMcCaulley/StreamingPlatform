import { useState } from 'react'
import { ContentGrid } from '../components/ContentGrid'
import { DetailModal } from '../components/DetailModal'
import { getSeries } from '../data/catalog'
import type { Content } from '../types'

export function SeriesPage() {
  const series = getSeries()
  const [selected, setSelected] = useState<Content | null>(null)

  return (
    <div className="page">
      <header className="page__header">
        <p className="page__kicker mono">03 · SERIES</p>
        <h1>Series</h1>
        <p>Episodic catalogs · {series.length} titles</p>
      </header>
      <ContentGrid items={series} onSelect={setSelected} />
      <DetailModal content={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
