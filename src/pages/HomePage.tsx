import { useMemo, useState } from 'react'
import { FeaturedBento } from '../components/FeaturedBento'
import { ContentRow } from '../components/ContentRow'
import { DetailModal } from '../components/DetailModal'
import { buildRows, catalog, getFeatured } from '../data/catalog'
import { useAuth } from '../context/AuthContext'
import { useMyListContext } from '../context/MyListContext'
import type { Content } from '../types'
import './HomePage.css'

export function HomePage() {
  const featured = getFeatured()
  const rows = buildRows()
  const { profile } = useAuth()
  const { items: listItems } = useMyListContext()
  const [selected, setSelected] = useState<Content | null>(null)
  const [genre, setGenre] = useState<string | null>(null)

  const secondary = useMemo(
    () => catalog.filter((c) => c.id !== featured.id && (c.trending || c.newRelease)).slice(0, 4),
    [featured.id],
  )

  const genres = useMemo(() => {
    const set = new Set<string>()
    catalog.forEach((c) => c.genres.forEach((g) => set.add(g)))
    return Array.from(set).sort()
  }, [])

  const filteredRows = useMemo(() => {
    if (!genre) return rows
    return rows
      .map((row) => ({
        ...row,
        items: row.items.filter((i) => i.genres.includes(genre)),
      }))
      .filter((row) => row.items.length > 0)
  }, [rows, genre])

  return (
    <div className="home">
      <header className="home__cmd">
        <div>
          <p className="home__kicker mono">SESSION · SIGNAL</p>
          <h1 className="home__greet">
            {profile ? `Hey, ${profile.name}` : 'Welcome'}
          </h1>
          <p className="home__sub mono">
            Watching as {profile?.name ?? 'guest'} · curated locally · no tracking
          </p>
        </div>
        <div className="home__stats mono">
          <div>
            <span className="home__stat-val">{catalog.length}</span>
            <span className="home__stat-lab">titles</span>
          </div>
          <div>
            <span className="home__stat-val">{listItems.length}</span>
            <span className="home__stat-lab">in list</span>
          </div>
        </div>
      </header>

      <FeaturedBento
        featured={featured}
        secondary={secondary}
        listPreview={listItems}
        onSelect={setSelected}
      />

      <div className="home__filters" role="toolbar" aria-label="Filter by genre">
        <button
          type="button"
          className={`home__chip mono ${genre === null ? 'is-active' : ''}`}
          onClick={() => setGenre(null)}
        >
          All
        </button>
        {genres.map((g) => (
          <button
            key={g}
            type="button"
            className={`home__chip mono ${genre === g ? 'is-active' : ''}`}
            onClick={() => setGenre(g === genre ? null : g)}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="home__rows">
        {filteredRows.map((row, i) => (
          <ContentRow
            key={row.id}
            index={String(i + 1).padStart(2, '0')}
            title={row.title}
            items={row.items}
            onSelect={setSelected}
          />
        ))}
        {filteredRows.length === 0 && (
          <p className="home__empty mono">// no collections match that filter</p>
        )}
      </div>

      <DetailModal content={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
