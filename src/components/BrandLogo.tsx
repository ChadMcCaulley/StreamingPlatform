import { Link } from 'react-router-dom'
import './BrandLogo.css'

interface BrandLogoProps {
  to?: string
  size?: 'sm' | 'md' | 'lg'
  showWordmark?: boolean
  className?: string
}

/**
 * Brand mark is intentionally fixed: lime plate + dark glyph.
 * Wordmark uses --wordmark (contrast only), never theme accent.
 */
export function BrandLogo({
  to = '/',
  size = 'md',
  showWordmark = true,
  className = '',
}: BrandLogoProps) {
  const content = (
    <>
      <span className="brand__mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="7" fill="#C8F542" />
          <path d="M11 9.5v13l11-6.5-11-6.5z" fill="#0A0A0B" />
          <path
            d="M22 11.5c1.6 1.1 2.6 2.7 2.6 4.5s-1 3.4-2.6 4.5"
            stroke="#0A0A0B"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.45"
          />
        </svg>
      </span>
      {showWordmark && <span className="brand__word">Signal</span>}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={`brand brand--${size} ${className}`} aria-label="Signal home">
        {content}
      </Link>
    )
  }

  return <span className={`brand brand--${size} ${className}`}>{content}</span>
}
