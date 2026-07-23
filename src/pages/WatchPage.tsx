import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchTitle } from '../api/catalog'
import { VideoPlayer } from '../components/VideoPlayer'
import { useAuth } from '../context/AuthContext'
import { recordContinueWatching } from '../hooks/useContinueWatching'
import type { Content } from '../types'
import './WatchPage.css'

export function WatchPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [content, setContent] = useState<Content | null>(null)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    if (!id) {
      setMissing(true)
      return
    }
    fetchTitle(id)
      .then(setContent)
      .catch(() => setMissing(true))
  }, [id])

  const onProgress = useCallback(
    (current: number, duration: number) => {
      if (!id) return
      recordContinueWatching(profile?.id ?? null, id, current, duration)
    },
    [id, profile?.id],
  )

  if (missing) {
    return (
      <div className="watch watch--missing">
        <h1>Title not found</h1>
        <Link to="/">Back to Home</Link>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="watch watch--missing">
        <h1>Loading…</h1>
      </div>
    )
  }

  return (
    <div className="watch">
      <div className="watch__stage">
        <VideoPlayer
          src={content.videoUrl}
          poster={content.backdropUrl}
          title={content.title}
          autoPlay
          onBack={() => navigate(-1)}
          onProgress={onProgress}
        />
      </div>
      <div className="watch__details">
        <div className="watch__details-inner">
          <h1>{content.title}</h1>
          <div className="watch__chips">
            <span className="watch__match">MATCH · {content.matchScore}</span>
            <span className="mono">{content.year}</span>
            <span className="watch__rating">{content.rating}</span>
            <span className="mono">{content.duration}</span>
            {content.genres.map((g) => (
              <span key={g} className="watch__genre">
                {g}
              </span>
            ))}
          </div>
          <p className="watch__desc">{content.description}</p>
          <p className="watch__meta-line">
            <strong>Cast:</strong> {content.cast.join(', ')}
          </p>
          <p className="watch__shortcuts">
            Shortcuts: <kbd>Space</kbd> play/pause · <kbd>←</kbd><kbd>→</kbd> seek ·{' '}
            <kbd>M</kbd> mute · <kbd>F</kbd> fullscreen · <kbd>Esc</kbd> back
          </p>
        </div>
      </div>
    </div>
  )
}
