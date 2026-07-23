import { useCallback, useEffect, useState, type CSSProperties, type MouseEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { Content } from '../types'
import { useMyListContext } from '../context/MyListContext'
import { Thumbnail } from './Thumbnail'
import { MatchRing } from './MatchRing'
import './FeaturedBento.css'

export interface ContinueItem {
  content: Content
  pct: number
}

interface FeaturedBentoProps {
  featuredPool: Content[]
  spotlights: Content[]
  signalPick: Content
  listPreview: Content[]
  continueWatching: ContinueItem[]
  onSelect: (content: Content) => void
}

export function FeaturedBento({
  featuredPool,
  spotlights,
  signalPick,
  listPreview,
  continueWatching,
  onSelect,
}: FeaturedBentoProps) {
  const { isInList, toggle } = useMyListContext()
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [listExpanding, setListExpanding] = useState(false)

  const pool = featuredPool.length ? featuredPool : spotlights.slice(0, 1)
  const featured = pool[index % pool.length]
  const inList = featured ? isInList(featured.id) : false

  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((i) => {
        const len = pool.length
        return ((i + dir) % len + len) % len
      })
    },
    [pool.length],
  )

  useEffect(() => {
    if (paused || pool.length < 2) return
    const id = window.setInterval(() => go(1), 7000)
    return () => window.clearInterval(id)
  }, [paused, pool.length, go])

  const openMyList = (e: MouseEvent) => {
    e.preventDefault()
    const panel = document.getElementById('my-list-panel') as HTMLElement | null
    if (panel) panel.style.viewTransitionName = 'my-list-panel'
    // Signal My List page to join the same transition
    sessionStorage.setItem('signal-mylist-vt', '1')

    const go = () => navigate('/my-list')
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { finished: Promise<void> }
    }

    if (typeof doc.startViewTransition === 'function') {
      document.documentElement.classList.add('vt-my-list')
      const transition = doc.startViewTransition(go)
      void transition.finished.finally(() => {
        document.documentElement.classList.remove('vt-my-list')
        if (panel) panel.style.viewTransitionName = ''
      })
      return
    }

    // Fallback: brief expand, then navigate with page enter animation
    setListExpanding(true)
    window.setTimeout(go, 400)
  }

  if (!featured) return null

  const hasContinue = continueWatching.length > 0
  const hasList = listPreview.length > 0

  return (
    <section
      className={[
        'bento',
        !hasContinue ? 'bento--no-continue' : '',
        !hasList ? 'bento--no-mylist' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="Discovery board"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <article className="bento__hero" key={featured.id}>
        <div className="bento__hero-media">
          <Thumbnail content={featured} variant="backdrop" priority className="bento__thumb" />
          <div className="bento__hero-shade" />
        </div>

        <div className="bento__hero-body">
          <div className="bento__hero-top">
            <p className="bento__kicker mono">FEATURED · {featured.type.toUpperCase()}</p>
          </div>

          <div className="bento__hero-main">
            <MatchRing score={featured.matchScore} size={52} />
            <div className="bento__hero-copy">
              <h2 className="bento__title">{featured.title}</h2>
              <p className="bento__desc">{featured.description}</p>
            </div>
          </div>

          <div className="bento__meta mono">
            <span className="bento__pill">{featured.year}</span>
            <span className="bento__pill">{featured.rating}</span>
            <span className="bento__pill">{featured.duration}</span>
            {featured.genres.slice(0, 3).map((g) => (
              <span key={g} className="bento__tag">
                {g}
              </span>
            ))}
          </div>

          <div className="bento__actions">
            <Link to={`/watch/${featured.id}`} className="sig-btn sig-btn--primary">
              <span aria-hidden="true">▶</span> Play
            </Link>
            <button type="button" className="sig-btn sig-btn--ghost" onClick={() => onSelect(featured)}>
              Inspect
            </button>
            <button
              type="button"
              className={`sig-btn sig-btn--icon ${inList ? 'is-on' : ''}`}
              onClick={() => toggle(featured.id)}
              aria-label={inList ? 'Remove from list' : 'Add to list'}
            >
              {inList ? '✓' : '+'}
            </button>
            {pool.length > 1 && (
              <div className="bento__nav">
                <button
                  type="button"
                  className="sig-btn sig-btn--icon"
                  onClick={() => go(-1)}
                  aria-label="Previous featured"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="sig-btn sig-btn--icon"
                  onClick={() => go(1)}
                  aria-label="Next featured"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>

        {pool.length > 1 && (
          <div className="bento__dots" role="tablist" aria-label="Featured titles">
            {pool.map((item, i) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={i === index % pool.length}
                className={`bento__dot ${i === index % pool.length ? 'is-active' : ''}`}
                onClick={() => setIndex(i)}
                aria-label={`Show ${item.title}`}
              />
            ))}
          </div>
        )}
      </article>

      {spotlights[0] && (
        <SpotlightTile
          content={spotlights[0]}
          label="SPOTLIGHT"
          index="A"
          areaClass="bento__spot--a"
          onSelect={onSelect}
        />
      )}

      {spotlights[1] && (
        <SpotlightTile
          content={spotlights[1]}
          label="SPOTLIGHT"
          index="B"
          areaClass="bento__spot--b"
          onSelect={onSelect}
        />
      )}

      <button
        type="button"
        className="bento__pick"
        onClick={() => onSelect(signalPick)}
        style={
          {
            '--pick-from': signalPick.accentFrom,
            '--pick-to': signalPick.accentTo,
          } as CSSProperties
        }
      >
        <div className="bento__pick-media">
          <Thumbnail content={signalPick} variant="backdrop" className="bento__thumb" />
          <div className="bento__pick-shade" />
        </div>
        <div className="bento__pick-body">
          <p className="bento__kicker mono">SIGNAL PICK</p>
          <h3>{signalPick.title}</h3>
          <p className="bento__pick-meta mono">
            Top match · {signalPick.matchScore} · {signalPick.genres[0]}
          </p>
        </div>
      </button>

      {hasContinue && (
        <div className="bento__continue">
          <div className="bento__board-head">
            <p className="bento__side-label mono">CONTINUE WATCHING</p>
            <span className="mono bento__count">{continueWatching.length}</span>
          </div>
          <div className="bento__continue-row">
            {continueWatching.slice(0, 3).map(({ content, pct }) => (
              <Link key={content.id} to={`/watch/${content.id}`} className="bento__continue-card">
                <span className="bento__continue-poster">
                  <Thumbnail content={content} />
                </span>
                <span className="bento__continue-info">
                  <span className="bento__continue-title">{content.title}</span>
                  <span className="bento__progress">
                    <span className="bento__progress-bar" style={{ width: `${pct}%` }} />
                  </span>
                  <span className="bento__continue-pct mono">{pct}%</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {hasList && (
        <div
          className={`bento__mylist ${listExpanding ? 'bento__mylist--expanding' : ''}`}
          id="my-list-panel"
        >
          <div className="bento__board-head bento__mylist-head">
            <div>
              <p className="bento__side-label mono">MY LIST</p>
              <p className="bento__mylist-count">
                {listPreview.length} title{listPreview.length === 1 ? '' : 's'} saved
              </p>
            </div>
            <button type="button" className="bento__view-all" onClick={openMyList}>
              View all
              <span aria-hidden="true">→</span>
            </button>
          </div>

          <div className="bento__mylist-posters">
            {listPreview.slice(0, 8).map((item) => (
              <button
                key={item.id}
                type="button"
                className="bento__mylist-item"
                onClick={() => onSelect(item)}
                title={item.title}
              >
                <Thumbnail content={item} />
                <span className="bento__mylist-item-title">{item.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

function SpotlightTile({
  content,
  label,
  index,
  areaClass,
  onSelect,
}: {
  content: Content
  label: string
  index: string
  areaClass: string
  onSelect: (c: Content) => void
}) {
  return (
    <button type="button" className={`bento__spot ${areaClass}`} onClick={() => onSelect(content)}>
      <div className="bento__spot-media">
        <Thumbnail content={content} variant="backdrop" className="bento__thumb" />
        <div className="bento__spot-shade" />
      </div>
      <div className="bento__spot-body">
        <span className="bento__spot-index mono">
          {label} · {index}
        </span>
        <span className="bento__spot-title">{content.title}</span>
        <span className="bento__spot-meta mono">
          {content.year} · {content.duration}
        </span>
      </div>
    </button>
  )
}
