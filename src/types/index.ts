export type ContentType = 'movie' | 'series'

export type ThemeId = 'dark' | 'light'

export interface Content {
  id: string
  title: string
  description: string
  type: ContentType
  year: number
  rating: string
  duration: string
  genres: string[]
  matchScore: number
  posterUrl: string
  backdropUrl: string
  trailerUrl: string
  videoUrl: string
  accentFrom: string
  accentTo: string
  featured?: boolean
  trending?: boolean
  newRelease?: boolean
  cast: string[]
  seasons?: number
}

export interface ContentRow {
  id: string
  title: string
  items: Content[]
}

export interface CatalogResponse {
  featured: Content
  rows: ContentRow[]
  all: Content[]
}

export interface Profile {
  id: string
  name: string
  avatarColor: string
  kids?: boolean
}

export interface UserAccount {
  id: string
  email: string
  /** Demo only — never store plain passwords in production */
  password: string
  name: string
  profiles: Profile[]
  createdAt: string
}

export interface AuthSession {
  userId: string
  email: string
  name: string
  profileId: string | null
}
