import { useMemo, useState } from 'react'
import { FeaturedBento } from '../components/FeaturedBento'
import { ContentRow } from '../components/ContentRow'
import { DetailModal } from '../components/DetailModal'
import { buildRows, catalog, getFeatured } from '../data/catalog'
import { useAuth } from '../context/AuthContext'
import { useMyListContext } from '../context/MyListContext'
import { useContinueWatching } from '../hooks/useContinueWatching'
import type { Content } from '../types'
import './HomePage.css'

export function HomePage() {
  const rows = buildRows()
  const { profile } = useAuth()
  const { items: listItems } = useMyListContext()
  const { items: continueItems } = useContinueWatching(profile?.id ?? null)
  const [selected, setSelected] = useState<Content | null>(null)
  const [genre, setGenre] = useState<string | null>(null)

  const featuredPool = useMemo(() => {
    const flagged = catalog.filter((c) => c.featured)
    if (flagged.length >= 2) return flagged
    // pad with high-match titles for rotation
    const rest = [...catalog]
      .filter((c) => !flagged.some((f) => f.id === c.id))
      .sort((a, b) => b.matchScore - a.matchScore)
    return [...flagged, ...rest].slice(0, 4)
  }, [])

  const featuredIds = useMemo(() => new Set(featuredPool.map((c) => c.id)), [featuredPool])

  const spotlights = useMemo(
    () =>
      catalog
        .filter((c) => !featuredIds.has(c.id) && (c.newRelease || c.trending))
        .slice(0, 2),
    [featuredIds],
  )

  const signalPick = useMemo(() => {
    return (
      [...catalog]
        .filter((c) => !featuredIds.has(c.id))
        .sort((a, b) => b.matchScore - a.matchScore)[0] ?? getFeatured()
    )
  }, [featuredIds])

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

  const hour = new Date().getHours()
  const dayPart = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'

  return (
    <div className="home">
      <header className="home__cmd">
        <div>
          <p className="home__kicker mono">SESSION · SIGNAL · {dayPart.toUpperCase()}</p>
          <h1 className="home__greet">
            {profile ? `Good ${dayPart}, ${profile.name}` : 'Welcome'}
          </h1>
          <p className="home__sub">
            {catalog.length} titles in catalog · {listItems.length} on your list
          </p>
        </div>
        <div className="home__stats mono">
          <div>
            <span className="home__stat-val">{catalog.length}</span>
            <span className="home__stat-lab">titles</span>
          </div>
          <div>
            <span className="home__stat-val">{listItems.length}</span>
            <span className="home__stat-lab">queued</span>
          </div>
          <div>
            <span className="home__stat-val">{continueItems.length}</span>
            <span className="home__stat-lab">resume</span>
          </div>
        </div>
      </header>

      <FeaturedBento
        featuredPool={featuredPool}
        spotlights={
          spotlights.length >= 2
            ? spotlights
            : catalog.filter((c) => !featuredIds.has(c.id)).slice(0, 2)
        }
        signalPick={signalPick}
        listPreview={listItems}
        continueWatching={continueItems}
        onSelect={setSelected}
      />

      <div className="home__section-head">
        <div>
          <p className="home__kicker mono">COLLECTIONS</p>
          <h2 className="home__section-title">Browse the stack</h2>
        </div>
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
          <p className="home__empty">No collections match that filter.</p>
        )}
      </div>

      <DetailModal content={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
