import { apiRequest } from './client'
import type { Content } from '../types'

export async function fetchMyList(profileId: string): Promise<{ ids: string[]; items: Content[] }> {
  return apiRequest('/my-list/', { profileId })
}

export async function toggleMyList(
  profileId: string,
  titleId: string,
): Promise<{ ids: string[]; inList: boolean }> {
  return apiRequest('/my-list/toggle/', {
    method: 'POST',
    body: { titleId },
    profileId,
  })
}

export interface ContinueApiItem {
  id: string
  content: Content
  progress: number
  duration: number
  pct: number
  updatedAt: string
}

export async function fetchContinue(profileId: string): Promise<ContinueApiItem[]> {
  const data = await apiRequest<{ items: ContinueApiItem[] }>('/continue/', { profileId })
  return data.items ?? []
}

export async function putContinue(
  profileId: string,
  titleId: string,
  progress: number,
  duration: number,
): Promise<ContinueApiItem[]> {
  const data = await apiRequest<{ items: ContinueApiItem[] }>('/continue/', {
    method: 'PUT',
    body: { titleId, progress, duration },
    profileId,
  })
  return data.items ?? []
}
