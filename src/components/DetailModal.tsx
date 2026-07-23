import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { Content } from '../types'
import { useMyListContext } from '../context/MyListContext'
import { Thumbnail } from './Thumbnail'
import './DetailModal.css'

interface DetailModalProps {
  content: Content | null
  onClose: () => void
}

export function DetailModal({ content, onClose }: DetailModalProps) {
  const { isInList, toggle } = useMyListContext()

  useEffect(() => {
    if (!content) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [content, onClose])

  if (!content) return null

  const inList = isInList(content.id)

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button type="button" className="modal__backdrop" onClick={onClose} aria-label="Close dialog" />
      <div className="modal__panel">
        <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div className="modal__hero">
          <Thumbnail content={content} variant="backdrop" priority className="modal__thumb" />
          <div className="modal__hero-fade" />
          <div className="modal__hero-content">
            <p className="modal__kicker mono">INSPECT · {content.type.toUpperCase()}</p>
            <h2 id="modal-title">{content.title}</h2>
            <div className="modal__actions">
              <Link to={`/watch/${content.id}`} className="sig-btn sig-btn--primary" onClick={onClose}>
                Play
              </Link>
              <button
                type="button"
                className={`sig-btn sig-btn--icon ${inList ? 'is-on' : ''}`}
                onClick={() => toggle(content.id)}
                aria-label={inList ? 'Remove from My List' : 'Add to My List'}
              >
                {inList ? '✓' : '+'}
              </button>
            </div>
          </div>
        </div>
        <div className="modal__body">
          <div className="modal__main">
            <div className="modal__meta mono">
              <span className="modal__pill">MATCH · {content.matchScore}</span>
              <span>{content.year}</span>
              <span>{content.rating}</span>
              <span>{content.duration}</span>
              {content.seasons ? <span>{content.seasons} SEASONS</span> : null}
            </div>
            <p className="modal__desc">{content.description}</p>
          </div>
          <aside className="modal__aside">
            <dl className="modal__dl">
              <div>
                <dt className="mono">CAST</dt>
                <dd>{content.cast.join(', ')}</dd>
              </div>
              <div>
                <dt className="mono">GENRES</dt>
                <dd>{content.genres.join(', ')}</dd>
              </div>
              <div>
                <dt className="mono">ID</dt>
                <dd className="mono">{content.id}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>
    </div>
  )
}
