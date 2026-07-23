import { Link } from 'react-router-dom'
import type { Content } from '../types'
import { useMyListContext } from '../context/MyListContext'
import { Thumbnail } from './Thumbnail'
import './ContentCard.css'

interface ContentCardProps {
  content: Content
  onSelect: (content: Content) => void
}

export function ContentCard({ content, onSelect }: ContentCardProps) {
  const { isInList, toggle } = useMyListContext()
  const inList = isInList(content.id)

  return (
    <article className="card">
      <div className="card__frame">
        <button
          type="button"
          className="card__hit"
          onClick={() => onSelect(content)}
          aria-label={`Inspect ${content.title}`}
        >
          <div className="card__poster">
            <Thumbnail content={content} showBadge />
          </div>
        </button>
        <div className="card__body">
          <div className="card__top">
            <span className="card__match mono">MATCH · {content.matchScore}</span>
            <button
              type="button"
              className={`card__add ${inList ? 'is-on' : ''}`}
              onClick={() => toggle(content.id)}
              aria-label={inList ? 'Remove from My List' : 'Add to My List'}
            >
              {inList ? '✓' : '+'}
            </button>
          </div>
          <h3 className="card__title">{content.title}</h3>
          <p className="card__meta mono">
            {content.year} · {content.rating} · {content.duration}
          </p>
          <div className="card__footer">
            <Link to={`/watch/${content.id}`} className="card__play">
              Play
            </Link>
            <button type="button" className="card__info" onClick={() => onSelect(content)}>
              Info
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
