import { Link } from 'react-router-dom'
import type { Content } from '../types'
import { useMyListContext } from '../context/MyListContext'
import { Thumbnail } from './Thumbnail'
import './Hero.css'

interface HeroProps {
  content: Content
  onMoreInfo?: (content: Content) => void
}

export function Hero({ content, onMoreInfo }: HeroProps) {
  const { isInList, toggle } = useMyListContext()
  const inList = isInList(content.id)

  return (
    <section className="hero" aria-label="Featured">
      <div className="hero__media">
        <Thumbnail content={content} variant="backdrop" priority className="hero__thumb" />
      </div>
      <div className="hero__gradient" />
      <div className="hero__content">
        <p className="hero__eyebrow">
          {content.type === 'series' ? 'Series' : 'Film'} · Featured
        </p>
        <h1 className="hero__title">{content.title}</h1>
        <div className="hero__meta">
          <span className="hero__match">{content.matchScore}% Match</span>
          <span>{content.year}</span>
          <span className="hero__rating">{content.rating}</span>
          <span>{content.duration}</span>
          {content.seasons ? <span>{content.seasons} Seasons</span> : null}
        </div>
        <p className="hero__desc">{content.description}</p>
        <div className="hero__genres">
          {content.genres.map((g) => (
            <span key={g}>{g}</span>
          ))}
        </div>
        <div className="hero__actions">
          <Link to={`/watch/${content.id}`} className="btn btn--play">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            Play
          </Link>
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => onMoreInfo?.(content)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            More Info
          </button>
          <button
            type="button"
            className={`btn btn--icon ${inList ? 'btn--icon-active' : ''}`}
            onClick={() => toggle(content.id)}
            aria-label={inList ? 'Remove from My List' : 'Add to My List'}
            title={inList ? 'Remove from My List' : 'Add to My List'}
          >
            {inList ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12l5 5L20 7" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </section>
  )
}
