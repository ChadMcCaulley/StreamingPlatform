import { apiRequest } from './client'
import type { Content, ContentRow } from '../types'

export interface CatalogHomeResponse {
  all: Content[]
  featuredPool: Content[]
  spotlights: Content[]
  signalPick: Content
  rows: ContentRow[]
  genres: string[]
  count: number
}

let cache: CatalogHomeResponse | null = null
let cacheAt = 0
const CACHE_MS = 30_000

export async function fetchCatalogHome(force = false): Promise<CatalogHomeResponse> {
  if (!force && cache && Date.now() - cacheAt < CACHE_MS) {
    return cache
  }
  const data = await apiRequest<CatalogHomeResponse>('/catalog/home/', { auth: false })
  cache = data
  cacheAt = Date.now()
  return data
}

export function getCachedCatalog(): CatalogHomeResponse | null {
  return cache
}

export function getCachedTitle(id: string): Content | undefined {
  return cache?.all.find((t) => t.id === id)
}

export async function fetchTitle(id: string): Promise<Content> {
  const cached = getCachedTitle(id)
  if (cached) return cached
  return apiRequest<Content>(`/catalog/${id}/`, { auth: false })
}

export async function fetchTitles(params: {
  type?: 'movie' | 'series'
  q?: string
  genre?: string
}): Promise<Content[]> {
  const qs = new URLSearchParams()
  if (params.type) qs.set('type', params.type)
  if (params.q) qs.set('q', params.q)
  if (params.genre) qs.set('genre', params.genre)
  const q = qs.toString()
  return apiRequest<Content[]>(`/catalog/${q ? `?${q}` : ''}`, { auth: false })
}

export async function searchTitles(q: string): Promise<Content[]> {
  if (!q.trim()) return []
  return fetchTitles({ q: q.trim() })
}
