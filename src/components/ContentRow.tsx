import { useRef } from 'react'
import type { Content } from '../types'
import { ContentCard } from './ContentCard'
import './ContentRow.css'

interface ContentRowProps {
  title: string
  items: Content[]
  onSelect: (content: Content) => void
  index?: string
}

export function ContentRow({ title, items, onSelect, index }: ContentRowProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: -1 | 1) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  if (!items.length) return null

  return (
    <section className="row" aria-label={title}>
      <div className="row__header">
        <h2 className="row__title">
          {index && <span className="row__index mono">{index}</span>}
          <span>{title}</span>
          <span className="row__count mono">{items.length}</span>
        </h2>
        <div className="row__controls">
          <button type="button" className="row__arrow" onClick={() => scroll(-1)} aria-label={`Scroll ${title} left`}>
            ‹
          </button>
          <button type="button" className="row__arrow" onClick={() => scroll(1)} aria-label={`Scroll ${title} right`}>
            ›
          </button>
        </div>
      </div>
      <div className="row__scroller" ref={scrollerRef}>
        {items.map((item) => (
          <ContentCard key={item.id} content={item} onSelect={onSelect} />
        ))}
      </div>
    </section>
  )
}
