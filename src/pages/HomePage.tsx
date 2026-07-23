import { useEffect, useMemo, useState } from 'react'
import { FeaturedBento } from '../components/FeaturedBento'
import { ContentRow } from '../components/ContentRow'
import { DetailModal } from '../components/DetailModal'
import { fetchCatalogHome, type CatalogHomeResponse } from '../api/catalog'
import { useAuth } from '../context/AuthContext'
import { useMyListContext } from '../context/MyListContext'
import { useContinueWatching } from '../hooks/useContinueWatching'
import type { Content } from '../types'
import './HomePage.css'

export function HomePage() {
  const { profile } = useAuth()
  const { items: listItems } = useMyListContext()
  const { items: continueItems } = useContinueWatching(profile?.id ?? null)
  const [selected, setSelected] = useState<Content | null>(null)
  const [genre, setGenre] = useState<string | null>(null)
  const [home, setHome] = useState<CatalogHomeResponse | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchCatalogHome()
      .then((data) => {
        if (!cancelled) {
          setHome(data)
          setError('')
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load catalog')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const filteredRows = useMemo(() => {
    if (!home) return []
    if (!genre) return home.rows
    return home.rows
      .map((row) => ({
        ...row,
        items: row.items.filter((i) => i.genres.includes(genre)),
      }))
      .filter((row) => row.items.length > 0)
  }, [home, genre])

  const hour = new Date().getHours()
  const dayPart = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'

  if (loading) {
    return (
      <div className="home home--status">
        <p className="mono">Loading catalog…</p>
      </div>
    )
  }

  if (error || !home) {
    return (
      <div className="home home--status">
        <p>Could not load catalog from the API.</p>
        <p className="home__sub">{error || 'Unknown error'}</p>
        <p className="home__sub">Is Django running on port 8000?</p>
      </div>
    )
  }

  return (
    <div className="home">
      <header className="home__cmd">
        <div>
          <p className="home__kicker mono">SESSION · SIGNAL · {dayPart.toUpperCase()}</p>
          <h1 className="home__greet">
            {profile ? `Good ${dayPart}, ${profile.name}` : 'Welcome'}
          </h1>
          <p className="home__sub">
            {home.count} titles in catalog · {listItems.length} on your list
          </p>
        </div>
        <div className="home__stats mono">
          <div>
            <span className="home__stat-val">{home.count}</span>
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
        featuredPool={home.featuredPool}
        spotlights={home.spotlights}
        signalPick={home.signalPick}
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
          {home.genres.map((g) => (
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
