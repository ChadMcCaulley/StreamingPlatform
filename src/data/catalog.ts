import type { Content } from '../types'

/** Reliable image hosts: picsum (seeded) + Wikimedia for open films */
const pic = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`

/**
 * Demo catalog using open-source Blender Foundation films and sample streams.
 */
export const catalog: Content[] = [
  {
    id: 'big-buck-bunny',
    title: 'Big Buck Bunny',
    description:
      'A giant rabbit with a heart bigger than himself faces three bullying rodents in a comedy adventure that launched open movie history.',
    type: 'movie',
    year: 2008,
    rating: 'PG',
    duration: '10m',
    genres: ['Animation', 'Comedy', 'Family'],
    matchScore: 98,
    posterUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/500px-Big_buck_bunny_poster_big.jpg',
    backdropUrl: pic('bbb-bg', 1280, 720),
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    accentFrom: '#2d6a4f',
    accentTo: '#95d5b2',
    featured: true,
    trending: true,
    cast: ['Sacha Goedegebure', 'Andy Goralczyk'],
  },
  {
    id: 'elephants-dream',
    title: 'Elephants Dream',
    description:
      'Two strange characters explore a surreal mechanical world in the first open movie ever produced with Blender.',
    type: 'movie',
    year: 2006,
    rating: 'PG',
    duration: '11m',
    genres: ['Animation', 'Sci-Fi', 'Drama'],
    matchScore: 91,
    posterUrl: pic('elephants-dream', 400, 600),
    backdropUrl: pic('elephants-dream-bg', 1280, 720),
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    accentFrom: '#3d348b',
    accentTo: '#7678ed',
    trending: true,
    cast: ['Tygo Gernandt', 'Cas Jansen'],
  },
  {
    id: 'sintel',
    title: 'Sintel',
    description:
      'A lonely young woman searches for a baby dragon she raised, in a sweeping fantasy short that redefined open animation.',
    type: 'movie',
    year: 2010,
    rating: 'PG-13',
    duration: '15m',
    genres: ['Animation', 'Fantasy', 'Adventure'],
    matchScore: 96,
    posterUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Sintel_poster.jpg/500px-Sintel_poster.jpg',
    backdropUrl: pic('sintel-bg', 1280, 720),
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    accentFrom: '#6a040f',
    accentTo: '#e85d04',
    featured: true,
    trending: true,
    cast: ['Halina Reijn', 'Thom Hoffman'],
  },
  {
    id: 'tears-of-steel',
    title: 'Tears of Steel',
    description:
      'In a dystopian Amsterdam, a group of warriors and scientists try to stop an army of robots from destroying the city.',
    type: 'movie',
    year: 2012,
    rating: 'PG-13',
    duration: '12m',
    genres: ['Sci-Fi', 'Action', 'Drama'],
    matchScore: 88,
    posterUrl: pic('tears-of-steel', 400, 600),
    backdropUrl: pic('tears-of-steel-bg', 1280, 720),
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    accentFrom: '#212529',
    accentTo: '#adb5bd',
    trending: true,
    cast: ['Derek de Lint', 'Sergio Hasselbaink', 'Vanja Rukavina'],
  },
  {
    id: 'for-bigger-blazes',
    title: 'For Bigger Blazes',
    description:
      'A high-octane promotional short that captures the thrill of speed, fire, and cinematic scale in under a minute.',
    type: 'movie',
    year: 2015,
    rating: 'G',
    duration: '15s',
    genres: ['Action', 'Short'],
    matchScore: 84,
    posterUrl: pic('bigger-blazes', 400, 600),
    backdropUrl: pic('bigger-blazes-bg', 1280, 720),
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    accentFrom: '#9b2226',
    accentTo: '#ee9b00',
    newRelease: true,
    cast: ['Chromecast Studio'],
  },
  {
    id: 'for-bigger-escapes',
    title: 'For Bigger Escapes',
    description:
      'Escape into a world of adventure with this vibrant short that celebrates exploration and cinematic freedom.',
    type: 'movie',
    year: 2015,
    rating: 'G',
    duration: '15s',
    genres: ['Adventure', 'Short'],
    matchScore: 82,
    posterUrl: pic('bigger-escapes', 400, 600),
    backdropUrl: pic('bigger-escapes-bg', 1280, 720),
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    accentFrom: '#0077b6',
    accentTo: '#90e0ef',
    newRelease: true,
    cast: ['Chromecast Studio'],
  },
  {
    id: 'for-bigger-fun',
    title: 'For Bigger Fun',
    description:
      'A playful, colorful short packed with energy — perfect for anyone who wants pure entertainment.',
    type: 'movie',
    year: 2015,
    rating: 'G',
    duration: '60s',
    genres: ['Comedy', 'Family', 'Short'],
    matchScore: 90,
    posterUrl: pic('bigger-fun', 400, 600),
    backdropUrl: pic('bigger-fun-bg', 1280, 720),
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    accentFrom: '#7209b7',
    accentTo: '#f72585',
    cast: ['Chromecast Studio'],
  },
  {
    id: 'for-bigger-joyrides',
    title: 'For Bigger Joyrides',
    description:
      'Buckle up for a high-speed joyride through stunning landscapes and pulse-pounding thrills.',
    type: 'movie',
    year: 2015,
    rating: 'G',
    duration: '15s',
    genres: ['Action', 'Adventure', 'Short'],
    matchScore: 87,
    posterUrl: pic('bigger-joyrides', 400, 600),
    backdropUrl: pic('bigger-joyrides-bg', 1280, 720),
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    accentFrom: '#d00000',
    accentTo: '#ffba08',
    trending: true,
    cast: ['Chromecast Studio'],
  },
  {
    id: 'for-bigger-meltdowns',
    title: 'For Bigger Meltdowns',
    description:
      'When things heat up, only the bold survive. An intense short that pushes cinematic limits.',
    type: 'movie',
    year: 2015,
    rating: 'PG',
    duration: '15s',
    genres: ['Thriller', 'Action', 'Short'],
    matchScore: 85,
    posterUrl: pic('bigger-meltdowns', 400, 600),
    backdropUrl: pic('bigger-meltdowns-bg', 1280, 720),
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    accentFrom: '#370617',
    accentTo: '#dc2f02',
    cast: ['Chromecast Studio'],
  },
  {
    id: 'subaru-outback',
    title: 'Subaru Outback — On the Road',
    description:
      'Hit the open road in this cinematic automotive short that celebrates freedom, design, and the journey itself.',
    type: 'movie',
    year: 2016,
    rating: 'G',
    duration: '2m',
    genres: ['Documentary', 'Short'],
    matchScore: 79,
    posterUrl: pic('subaru-outback', 400, 600),
    backdropUrl: pic('subaru-outback-bg', 1280, 720),
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    accentFrom: '#1b4332',
    accentTo: '#52b788',
    cast: ['Subaru'],
  },
  {
    id: 'volkswagen-gtis',
    title: 'Volkswagen GTI Review',
    description:
      'A sharp look at performance and style — the GTI redefined in a sleek short-form review experience.',
    type: 'movie',
    year: 2016,
    rating: 'G',
    duration: '2m',
    genres: ['Documentary', 'Short'],
    matchScore: 76,
    posterUrl: pic('vw-gti', 400, 600),
    backdropUrl: pic('vw-gti-bg', 1280, 720),
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    accentFrom: '#10002b',
    accentTo: '#7b2cbf',
    cast: ['Garage Studio'],
  },
  {
    id: 'we-are-going-on-bullrun',
    title: 'We Are Going on Bullrun',
    description:
      'Join an epic cross-country rally of supercars, friendship, and pure adrenaline.',
    type: 'movie',
    year: 2017,
    rating: 'PG',
    duration: '2m',
    genres: ['Action', 'Documentary', 'Adventure'],
    matchScore: 93,
    posterUrl: pic('bullrun', 400, 600),
    backdropUrl: pic('bullrun-bg', 1280, 720),
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    accentFrom: '#03045e',
    accentTo: '#00b4d8',
    trending: true,
    newRelease: true,
    cast: ['Bullrun Crew'],
  },
  {
    id: 'what-car-can-you-get',
    title: 'What Car Can You Get for a Grand?',
    description:
      'A fun, practical guide to finding the best wheels on a budget — comedy and car culture collide.',
    type: 'series',
    year: 2018,
    rating: 'TV-PG',
    duration: '3m',
    genres: ['Comedy', 'Reality', 'Documentary'],
    matchScore: 81,
    posterUrl: pic('car-grand', 400, 600),
    backdropUrl: pic('car-grand-bg', 1280, 720),
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
    accentFrom: '#264653',
    accentTo: '#e9c46a',
    seasons: 1,
    cast: ['Auto Experts'],
  },
  {
    id: 'cosmos-journey',
    title: 'Cosmos Journey',
    description:
      'Travel beyond the stars in this immersive visual voyage through nebulae, galaxies, and the unknown.',
    type: 'series',
    year: 2023,
    rating: 'TV-G',
    duration: '45m',
    genres: ['Documentary', 'Sci-Fi'],
    matchScore: 94,
    posterUrl: pic('cosmos-journey', 400, 600),
    backdropUrl: pic('cosmos-journey-bg', 1280, 720),
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    accentFrom: '#0d1b2a',
    accentTo: '#415a77',
    seasons: 3,
    newRelease: true,
    featured: true,
    cast: ['Narrator Ensemble'],
  },
  {
    id: 'night-city',
    title: 'Night City',
    description:
      'Neon lights, rain-soaked streets, and secrets that never sleep — a stylish crime thriller series.',
    type: 'series',
    year: 2024,
    rating: 'TV-MA',
    duration: '52m',
    genres: ['Thriller', 'Crime', 'Drama'],
    matchScore: 95,
    posterUrl: pic('night-city', 400, 600),
    backdropUrl: pic('night-city-bg', 1280, 720),
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    accentFrom: '#240046',
    accentTo: '#7b2cbf',
    seasons: 2,
    trending: true,
    newRelease: true,
    cast: ['Alex Rivera', 'Jordan Lee', 'Sam Okonkwo'],
  },
  {
    id: 'ocean-depths',
    title: 'Ocean Depths',
    description:
      'Dive into the most mysterious places on Earth in this breathtaking nature documentary series.',
    type: 'series',
    year: 2022,
    rating: 'TV-PG',
    duration: '48m',
    genres: ['Documentary', 'Nature'],
    matchScore: 97,
    posterUrl: pic('ocean-depths', 400, 600),
    backdropUrl: pic('ocean-depths-bg', 1280, 720),
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    accentFrom: '#023e8a',
    accentTo: '#48cae4',
    seasons: 4,
    featured: true,
    cast: ['Marine Biologists'],
  },
  {
    id: 'kitchen-wars',
    title: 'Kitchen Wars',
    description:
      'Top chefs battle under pressure in the ultimate culinary competition. Heat, hustle, and haute cuisine.',
    type: 'series',
    year: 2024,
    rating: 'TV-14',
    duration: '42m',
    genres: ['Reality', 'Comedy'],
    matchScore: 89,
    posterUrl: pic('kitchen-wars', 400, 600),
    backdropUrl: pic('kitchen-wars-bg', 1280, 720),
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    accentFrom: '#bc4749',
    accentTo: '#f2e8cf',
    seasons: 5,
    newRelease: true,
    cast: ['Chef Marco', 'Chef Yuki', 'Host Dana'],
  },
  {
    id: 'shadow-protocol',
    title: 'Shadow Protocol',
    description:
      'An elite spy must stop a global conspiracy before time runs out. Espionage at its most intense.',
    type: 'movie',
    year: 2023,
    rating: 'R',
    duration: '2h 8m',
    genres: ['Action', 'Thriller', 'Mystery'],
    matchScore: 92,
    posterUrl: pic('shadow-protocol', 400, 600),
    backdropUrl: pic('shadow-protocol-bg', 1280, 720),
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    accentFrom: '#0b090a',
    accentTo: '#5c677d',
    trending: true,
    cast: ['Morgan Blake', 'Priya Shah', 'Chris Dunn'],
  },
  {
    id: 'laugh-track',
    title: 'Laugh Track',
    description:
      'A failed stand-up comic finds unexpected fame — and chaos — when his life becomes a live sitcom.',
    type: 'series',
    year: 2021,
    rating: 'TV-14',
    duration: '28m',
    genres: ['Comedy', 'Drama'],
    matchScore: 86,
    posterUrl: pic('laugh-track', 400, 600),
    backdropUrl: pic('laugh-track-bg', 1280, 720),
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    accentFrom: '#f77f00',
    accentTo: '#fcbf49',
    seasons: 3,
    cast: ['Jamie Cole', 'Riley Fox'],
  },
  {
    id: 'ember-peak',
    title: 'Ember Peak',
    description:
      'A family returns to their mountain hometown and uncovers a legend that was never meant to be found.',
    type: 'movie',
    year: 2024,
    rating: 'PG-13',
    duration: '1h 54m',
    genres: ['Horror', 'Mystery', 'Thriller'],
    matchScore: 88,
    posterUrl: pic('ember-peak', 400, 600),
    backdropUrl: pic('ember-peak-bg', 1280, 720),
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    accentFrom: '#1a1423',
    accentTo: '#3d348b',
    newRelease: true,
    cast: ['Elena Vargas', 'Tom Briggs'],
  },
]

export function getContentById(id: string): Content | undefined {
  return catalog.find((item) => item.id === id)
}

export function searchCatalog(query: string): Content[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return catalog.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.genres.some((g) => g.toLowerCase().includes(q)) ||
      item.cast.some((c) => c.toLowerCase().includes(q)),
  )
}

export function getByGenre(genre: string): Content[] {
  return catalog.filter((item) =>
    item.genres.some((g) => g.toLowerCase() === genre.toLowerCase()),
  )
}

export function getFeatured(): Content {
  return catalog.find((c) => c.featured) ?? catalog[0]
}

export function buildRows(): { id: string; title: string; items: Content[] }[] {
  const genres = [
    'Trending Now',
    'New Releases',
    'Action',
    'Comedy',
    'Documentary',
    'Animation',
    'Thriller',
    'Sci-Fi',
  ]

  return genres
    .map((title) => {
      let items: Content[]
      if (title === 'Trending Now') {
        items = catalog.filter((c) => c.trending)
      } else if (title === 'New Releases') {
        items = catalog.filter((c) => c.newRelease)
      } else {
        items = getByGenre(title)
      }
      return { id: title.toLowerCase().replace(/\s+/g, '-'), title, items }
    })
    .filter((row) => row.items.length > 0)
}

export function getMovies(): Content[] {
  return catalog.filter((c) => c.type === 'movie')
}

export function getSeries(): Content[] {
  return catalog.filter((c) => c.type === 'series')
}
