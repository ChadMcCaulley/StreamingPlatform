import { useState, type CSSProperties } from 'react'
import type { Content } from '../types'
import './Thumbnail.css'

interface ThumbnailProps {
  content: Content
  variant?: 'poster' | 'backdrop'
  className?: string
  showBadge?: boolean
  priority?: boolean
}

export function Thumbnail({
  content,
  variant = 'poster',
  className = '',
  showBadge = false,
  priority = false,
}: ThumbnailProps) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const src = variant === 'backdrop' ? content.backdropUrl : content.posterUrl
  const isPoster = variant === 'poster'

  return (
    <div
      className={`thumb thumb--${variant} ${loaded && !failed ? 'thumb--loaded' : ''} ${className}`}
      style={
        {
          '--thumb-from': content.accentFrom,
          '--thumb-to': content.accentTo,
        } as CSSProperties
      }
    >
      {/* Designed art always under the image */}
      <div className="thumb__art" aria-hidden="true">
        <div className="thumb__art-glow" />
        <div className="thumb__art-noise" />
        <div className="thumb__art-frame">
          <span className="thumb__art-mark">{content.title.charAt(0)}</span>
          {isPoster && (
            <>
              <span className="thumb__art-title">{content.title}</span>
              <span className="thumb__art-meta">
                {content.year} · {content.genres[0]}
              </span>
            </>
          )}
        </div>
        <div className="thumb__art-stripe" />
      </div>

      {!failed && (
        <img
          src={src}
          alt=""
          className="thumb__img"
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}

      {showBadge && content.newRelease && (
        <span className="thumb__badge">New</span>
      )}
      {showBadge && content.type === 'series' && content.seasons && (
        <span className="thumb__badge thumb__badge--series">S{content.seasons}</span>
      )}
    </div>
  )
}
