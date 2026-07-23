import { useCallback, useEffect, useRef, useState } from 'react'
import './VideoPlayer.css'

interface VideoPlayerProps {
  src: string
  poster?: string
  title: string
  autoPlay?: boolean
  onBack?: () => void
  /** Fired periodically with playback progress for continue-watching */
  onProgress?: (current: number, duration: number) => void
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

export function VideoPlayer({
  src,
  poster,
  title,
  autoPlay = true,
  onBack,
  onProgress,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const shellRef = useRef<HTMLDivElement>(null)
  const hideTimer = useRef<number | null>(null)
  const lastProgressEmit = useRef(0)

  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [buffered, setBuffered] = useState(0)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [controlsVisible, setControlsVisible] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)

  const showControls = useCallback(() => {
    setControlsVisible(true)
    if (hideTimer.current) window.clearTimeout(hideTimer.current)
    hideTimer.current = window.setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) {
        setControlsVisible(false)
      }
    }, 2800)
  }, [])

  const togglePlay = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) void v.play()
    else v.pause()
  }, [])

  const seekBy = useCallback((delta: number) => {
    const v = videoRef.current
    if (!v) return
    v.currentTime = Math.min(Math.max(0, v.currentTime + delta), v.duration || 0)
  }, [])

  const seekTo = useCallback((ratio: number) => {
    const v = videoRef.current
    if (!v || !v.duration) return
    v.currentTime = ratio * v.duration
  }, [])

  const toggleMute = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }, [])

  const changeVolume = useCallback((value: number) => {
    const v = videoRef.current
    if (!v) return
    v.volume = value
    v.muted = value === 0
    setVolume(value)
    setMuted(value === 0)
  }, [])

  const toggleFullscreen = useCallback(async () => {
    const el = shellRef.current
    if (!el) return
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch {
      /* ignore */
    }
  }, [])

  const cycleRate = useCallback(() => {
    const rates = [0.75, 1, 1.25, 1.5, 2]
    const v = videoRef.current
    if (!v) return
    const idx = rates.indexOf(playbackRate)
    const next = rates[(idx + 1) % rates.length]
    v.playbackRate = next
    setPlaybackRate(next)
  }, [playbackRate])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return

    const onPlay = () => setPlaying(true)
    const onPause = () => {
      setPlaying(false)
      setControlsVisible(true)
    }
    const onTime = () => {
      setCurrent(v.currentTime)
      if (onProgress && v.duration) {
        const now = Date.now()
        if (now - lastProgressEmit.current > 2500) {
          lastProgressEmit.current = now
          onProgress(v.currentTime, v.duration)
        }
      }
    }
    const onMeta = () => {
      setDuration(v.duration)
      setLoading(false)
    }
    const onWaiting = () => setLoading(true)
    const onPlaying = () => setLoading(false)
    const onBuffer = () => {
      if (v.buffered.length > 0) {
        setBuffered(v.buffered.end(v.buffered.length - 1))
      }
    }
    const onError = () => {
      setLoading(false)
      setError('Unable to load this stream. Try another title.')
    }
    const onVol = () => {
      setVolume(v.volume)
      setMuted(v.muted)
    }
    const onPauseProgress = () => {
      if (onProgress && v.duration) onProgress(v.currentTime, v.duration)
    }

    v.addEventListener('play', onPlay)
    v.addEventListener('pause', onPause)
    v.addEventListener('pause', onPauseProgress)
    v.addEventListener('timeupdate', onTime)
    v.addEventListener('loadedmetadata', onMeta)
    v.addEventListener('waiting', onWaiting)
    v.addEventListener('playing', onPlaying)
    v.addEventListener('progress', onBuffer)
    v.addEventListener('error', onError)
    v.addEventListener('volumechange', onVol)

    if (autoPlay) {
      void v.play().catch(() => setPlaying(false))
    }

    return () => {
      if (onProgress && v.duration) onProgress(v.currentTime, v.duration)
      v.removeEventListener('play', onPlay)
      v.removeEventListener('pause', onPause)
      v.removeEventListener('pause', onPauseProgress)
      v.removeEventListener('timeupdate', onTime)
      v.removeEventListener('loadedmetadata', onMeta)
      v.removeEventListener('waiting', onWaiting)
      v.removeEventListener('playing', onPlaying)
      v.removeEventListener('progress', onBuffer)
      v.removeEventListener('error', onError)
      v.removeEventListener('volumechange', onVol)
    }
  }, [src, autoPlay, onProgress])

  useEffect(() => {
    const onFs = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      showControls()
      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault()
          togglePlay()
          break
        case 'arrowleft':
        case 'j':
          e.preventDefault()
          seekBy(-10)
          break
        case 'arrowright':
        case 'l':
          e.preventDefault()
          seekBy(10)
          break
        case 'arrowup':
          e.preventDefault()
          changeVolume(Math.min(1, volume + 0.1))
          break
        case 'arrowdown':
          e.preventDefault()
          changeVolume(Math.max(0, volume - 0.1))
          break
        case 'm':
          toggleMute()
          break
        case 'f':
          void toggleFullscreen()
          break
        case 'escape':
          if (!document.fullscreenElement && onBack) onBack()
          break
        default:
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [
    togglePlay,
    seekBy,
    changeVolume,
    volume,
    toggleMute,
    toggleFullscreen,
    onBack,
    showControls,
  ])

  useEffect(
    () => () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current)
    },
    [],
  )

  const progress = duration ? (current / duration) * 100 : 0
  const bufferPct = duration ? (buffered / duration) * 100 : 0

  return (
    <div
      ref={shellRef}
      className={`vplayer ${controlsVisible ? 'vplayer--controls' : ''} ${isFullscreen ? 'vplayer--fs' : ''}`}
      onMouseMove={showControls}
      onTouchStart={showControls}
    >
      <video
        ref={videoRef}
        className="vplayer__video"
        src={src}
        poster={poster}
        playsInline
        preload="metadata"
        onClick={togglePlay}
      />

      {loading && !error && (
        <div className="vplayer__spinner" aria-hidden="true">
          <div className="vplayer__spinner-ring" />
        </div>
      )}

      {error && (
        <div className="vplayer__error">
          <p>{error}</p>
          {onBack && (
            <button type="button" className="vplayer__btn-text" onClick={onBack}>
              Go back
            </button>
          )}
        </div>
      )}

      <div className={`vplayer__ui ${controlsVisible ? 'is-visible' : ''}`}>
        <div className="vplayer__top">
          {onBack && (
            <button type="button" className="vplayer__icon-btn" onClick={onBack} aria-label="Back">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
          <div className="vplayer__title-wrap">
            <p className="vplayer__label">SIGNAL · PLAYBACK</p>
            <h2 className="vplayer__title">{title}</h2>
          </div>
        </div>

        {!playing && !loading && !error && (
          <button
            type="button"
            className="vplayer__center-play"
            onClick={togglePlay}
            aria-label="Play"
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        )}

        <div className="vplayer__bottom">
          <div
            className="vplayer__progress"
            role="slider"
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            tabIndex={0}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              seekTo((e.clientX - rect.left) / rect.width)
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') seekBy(-5)
              if (e.key === 'ArrowRight') seekBy(5)
            }}
          >
            <div className="vplayer__buffer" style={{ width: `${bufferPct}%` }} />
            <div className="vplayer__played" style={{ width: `${progress}%` }} />
            <div className="vplayer__knob" style={{ left: `${progress}%` }} />
          </div>

          <div className="vplayer__controls">
            <div className="vplayer__controls-left">
              <button type="button" className="vplayer__icon-btn" onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>
                {playing ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
              <button type="button" className="vplayer__icon-btn" onClick={() => seekBy(-10)} aria-label="Back 10 seconds">
                <span className="vplayer__skip">-10</span>
              </button>
              <button type="button" className="vplayer__icon-btn" onClick={() => seekBy(10)} aria-label="Forward 10 seconds">
                <span className="vplayer__skip">+10</span>
              </button>
              <div className="vplayer__volume">
                <button type="button" className="vplayer__icon-btn" onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}>
                  {muted || volume === 0 ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 5L6 9H2v6h4l5 4V5zM15.5 8.5a5 5 0 010 7M19 5a9 9 0 010 14" />
                    </svg>
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={muted ? 0 : volume}
                  onChange={(e) => changeVolume(Number(e.target.value))}
                  className="vplayer__vol-slider"
                  aria-label="Volume"
                />
              </div>
              <span className="vplayer__time">
                {formatTime(current)} / {formatTime(duration)}
              </span>
            </div>
            <div className="vplayer__controls-right">
              <button type="button" className="vplayer__chip" onClick={cycleRate} title="Playback speed">
                {playbackRate}x
              </button>
              <button
                type="button"
                className="vplayer__icon-btn"
                onClick={() => void toggleFullscreen()}
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 3v3H5M16 3v3h3M8 21v-3H5M16 21v-3h3" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 3H5v3M16 3h3v3M8 21H5v-3M16 21h3v-3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
