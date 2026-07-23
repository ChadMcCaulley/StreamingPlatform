import type { Handler, HandlerEvent } from '@netlify/functions'

/**
 * Sample catalog API for Netlify Functions.
 * The SPA ships with the same data client-side for instant loads;
 * this endpoint is useful if you later move to a real database.
 */

const catalog = [
  {
    id: 'big-buck-bunny',
    title: 'Big Buck Bunny',
    type: 'movie',
    year: 2008,
    genres: ['Animation', 'Comedy', 'Family'],
    matchScore: 98,
    featured: true,
    trending: true,
  },
  {
    id: 'sintel',
    title: 'Sintel',
    type: 'movie',
    year: 2010,
    genres: ['Animation', 'Fantasy', 'Adventure'],
    matchScore: 96,
    featured: true,
    trending: true,
  },
  {
    id: 'night-city',
    title: 'Night City',
    type: 'series',
    year: 2024,
    genres: ['Thriller', 'Crime', 'Drama'],
    matchScore: 95,
    trending: true,
    newRelease: true,
  },
  {
    id: 'ocean-depths',
    title: 'Ocean Depths',
    type: 'series',
    year: 2022,
    genres: ['Documentary', 'Nature'],
    matchScore: 97,
    featured: true,
  },
]

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' }
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: cors,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  const id = event.queryStringParameters?.id
  const q = event.queryStringParameters?.q?.toLowerCase()

  if (id) {
    const item = catalog.find((c) => c.id === id)
    if (!item) {
      return {
        statusCode: 404,
        headers: cors,
        body: JSON.stringify({ error: 'Not found' }),
      }
    }
    return { statusCode: 200, headers: cors, body: JSON.stringify(item) }
  }

  let items = catalog
  if (q) {
    items = catalog.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.genres.some((g) => g.toLowerCase().includes(q)),
    )
  }

  return {
    statusCode: 200,
    headers: cors,
    body: JSON.stringify({ count: items.length, items }),
  }
}
