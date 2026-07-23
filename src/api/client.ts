/**
 * Signal API client — talks to Django REST backend.
 * Base URL: VITE_API_URL or same-origin /api (Vite proxy in dev).
 */

const TOKEN_KEY = 'signal-api-token'
const PROFILE_KEY = 'signal-active-profile'

export function getApiBase(): string {
  const env = import.meta.env.VITE_API_URL as string | undefined
  if (env) return env.replace(/\/$/, '')
  return '/api'
}

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* ignore */
  }
}

export function getStoredProfileId(): string | null {
  try {
    return localStorage.getItem(PROFILE_KEY)
  } catch {
    return null
  }
}

export function setStoredProfileId(id: string | null) {
  try {
    if (id) localStorage.setItem(PROFILE_KEY, id)
    else localStorage.removeItem(PROFILE_KEY)
  } catch {
    /* ignore */
  }
}

export class ApiError extends Error {
  status: number
  body: unknown

  constructor(message: string, status: number, body?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

type RequestOptions = {
  method?: string
  body?: unknown
  auth?: boolean
  profileId?: string | null
  signal?: AbortSignal
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true, profileId, signal } = options
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  if (auth) {
    const token = getToken()
    if (token) headers.Authorization = `Token ${token}`
  }

  const pid = profileId === undefined ? getStoredProfileId() : profileId
  if (pid) headers['X-Profile-Id'] = pid

  const url = `${getApiBase()}${path.startsWith('/') ? path : `/${path}`}`
  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  })

  if (res.status === 204) {
    return undefined as T
  }

  let data: unknown = null
  const text = await res.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  if (!res.ok) {
    let detail = res.statusText || 'Request failed'
    if (typeof data === 'object' && data) {
      const obj = data as Record<string, unknown>
      if (typeof obj.detail === 'string') detail = obj.detail
      else if (Array.isArray(obj.non_field_errors) && obj.non_field_errors[0]) {
        detail = String(obj.non_field_errors[0])
      } else {
        const firstKey = Object.keys(obj)[0]
        const val = firstKey ? obj[firstKey] : null
        if (Array.isArray(val) && val[0]) detail = String(val[0])
        else if (typeof val === 'string') detail = val
      }
    }
    throw new ApiError(detail, res.status, data)
  }

  return data as T
}
