import { Link } from 'react-router-dom'
import type { Content } from '../types'
import { useMyListContext } from '../context/MyListContext'
import { Thumbnail } from './Thumbnail'
import './FeaturedBento.css'

interface FeaturedBentoProps {
  featured: Content
  secondary: Content[]
  listPreview: Content[]
  onSelect: (content: Content) => void
}

export function FeaturedBento({ featured, secondary, listPreview, onSelect }: FeaturedBentoProps) {
  const { isInList, toggle } = useMyListContext()
  const inList = isInList(featured.id)

  return (
    <section className="bento" aria-label="Featured">
      <article className="bento__feature">
        <div className="bento__media">
          <Thumbnail content={featured} variant="backdrop" priority className="bento__thumb" />
          <div className="bento__shade" />
        </div>
        <div className="bento__feature-body">
          <p className="bento__kicker mono">FEATURED · {featured.type.toUpperCase()}</p>
          <h2 className="bento__title">{featured.title}</h2>
          <p className="bento__desc">{featured.description}</p>
          <div className="bento__meta mono">
            <span className="bento__pill">MATCH · {featured.matchScore}</span>
            <span>{featured.year}</span>
            <span>{featured.rating}</span>
            <span>{featured.duration}</span>
            {featured.genres.slice(0, 2).map((g) => (
              <span key={g}>{g}</span>
            ))}
          </div>
          <div className="bento__actions">
            <Link to={`/watch/${featured.id}`} className="sig-btn sig-btn--primary">
              Play
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
          </div>
        </div>
      </article>

      <div className="bento__side">
        <p className="bento__side-label mono">UP NEXT</p>
        {secondary.slice(0, 2).map((item, i) => (
          <button
            key={item.id}
            type="button"
            className="bento__mini"
            onClick={() => onSelect(item)}
          >
            <span className="bento__mini-index mono">{String(i + 1).padStart(2, '0')}</span>
            <span className="bento__mini-poster">
              <Thumbnail content={item} />
            </span>
            <span className="bento__mini-body">
              <span className="bento__mini-title">{item.title}</span>
              <span className="bento__mini-meta mono">
                {item.year} · {item.duration} · {item.genres[0]}
              </span>
            </span>
          </button>
        ))}

        <div className="bento__list-card">
          <p className="bento__side-label mono">MY LIST</p>
          {listPreview.length === 0 ? (
            <p className="bento__empty mono">// empty — add titles with +</p>
          ) : (
            <ul className="bento__list">
              {listPreview.slice(0, 4).map((item) => (
                <li key={item.id}>
                  <button type="button" onClick={() => onSelect(item)}>
                    <span>{item.title}</span>
                    <span className="mono">{item.matchScore}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <Link to="/my-list" className="bento__list-link mono">
            View all →
          </Link>
        </div>
      </div>
    </section>
  )
}
