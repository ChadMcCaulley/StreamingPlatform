import { apiRequest, setToken } from './client'
import type { Profile, UserAccount } from '../types'

export interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
    name: string
    profiles: Profile[]
    createdAt: string
  }
  session: {
    userId: string
    email: string
    name: string
    profileId: string | null
  }
}

export function mapUser(u: AuthResponse['user']): UserAccount {
  return {
    id: String(u.id),
    email: u.email,
    name: u.name,
    password: '',
    profiles: (u.profiles || []).map((p) => ({
      id: String(p.id),
      name: p.name,
      avatarColor: p.avatarColor,
      kids: p.kids,
    })),
    createdAt: u.createdAt,
  }
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const data = await apiRequest<AuthResponse>('/auth/login/', {
    method: 'POST',
    body: { email, password },
    auth: false,
  })
  setToken(data.token)
  return data
}

export async function register(
  name: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  const data = await apiRequest<AuthResponse>('/auth/register/', {
    method: 'POST',
    body: { name, email, password },
    auth: false,
  })
  setToken(data.token)
  return data
}

export async function logout(): Promise<void> {
  try {
    await apiRequest('/auth/logout/', { method: 'POST' })
  } catch {
    /* ignore network errors on logout */
  }
  setToken(null)
}

export async function fetchMe(): Promise<UserAccount> {
  const data = await apiRequest<{ user: AuthResponse['user'] }>('/auth/me/')
  return mapUser(data.user)
}

export async function createProfile(
  name: string,
  kids = false,
): Promise<Profile> {
  const p = await apiRequest<Profile>('/profiles/', {
    method: 'POST',
    body: { name, kids },
  })
  return {
    id: String(p.id),
    name: p.name,
    avatarColor: p.avatarColor,
    kids: p.kids,
  }
}

export async function deleteProfile(id: string): Promise<void> {
  await apiRequest(`/profiles/${id}/`, { method: 'DELETE' })
}
