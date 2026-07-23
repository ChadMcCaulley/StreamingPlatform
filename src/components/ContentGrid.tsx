import type { Content } from '../types'
import { ContentCard } from './ContentCard'
import './ContentGrid.css'

interface ContentGridProps {
  items: Content[]
  onSelect: (content: Content) => void
  emptyMessage?: string
}

export function ContentGrid({ items, onSelect, emptyMessage = 'Nothing here yet.' }: ContentGridProps) {
  if (!items.length) {
    return <p className="grid-empty">{emptyMessage}</p>
  }

  return (
    <div className="grid">
      {items.map((item) => (
        <ContentCard key={item.id} content={item} onSelect={onSelect} />
      ))}
    </div>
  )
}
