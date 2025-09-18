export interface Movie {
  id: string
  title: string
  poster: string
  backdrop: string
  overview: string
  rating: number
  year: number
  genre: string[]
  duration: string
  featured?: boolean
}

export const mockMovies: Movie[] = [
  {
    id: "1",
    title: "Quantum Horizon",
    poster: "/placeholder-vd1oy.png",
    backdrop: "/placeholder-3hk25.png",
    overview:
      "A mind-bending sci-fi thriller about a physicist who discovers parallel dimensions and must save reality itself.",
    rating: 8.7,
    year: 2024,
    genre: ["Sci-Fi", "Thriller"],
    duration: "2h 18m",
    featured: true,
  },
  {
    id: "2",
    title: "Shadow's Edge",
    poster: "/placeholder-ir7p9.png",
    backdrop: "/placeholder-rg8kf.png",
    overview: "An elite assassin must protect a witness while being hunted by his former organization.",
    rating: 7.9,
    year: 2024,
    genre: ["Action", "Thriller"],
    duration: "1h 56m",
  },
  {
    id: "3",
    title: "The Last Symphony",
    poster: "/placeholder-wh4rd.png",
    backdrop: "/placeholder-s45oh.png",
    overview: "A young conductor fights to save a historic orchestra while dealing with personal tragedy.",
    rating: 8.2,
    year: 2024,
    genre: ["Drama", "Music"],
    duration: "2h 4m",
  },
  {
    id: "4",
    title: "Cosmic Comedy Club",
    poster: "/placeholder-z1x0n.png",
    backdrop: "/placeholder-mhhbe.png",
    overview: "Aliens visit Earth to learn about human comedy, with hilarious results.",
    rating: 7.5,
    year: 2024,
    genre: ["Comedy", "Sci-Fi"],
    duration: "1h 42m",
  },
  {
    id: "5",
    title: "Midnight Runner",
    poster: "/placeholder-l97bu.png",
    backdrop: "/placeholder-j3o1l.png",
    overview: "A parkour expert becomes the city's most wanted after witnessing a conspiracy.",
    rating: 7.8,
    year: 2024,
    genre: ["Action", "Crime"],
    duration: "1h 48m",
  },
  {
    id: "6",
    title: "Love in Tokyo",
    poster: "/placeholder-nq16t.png",
    backdrop: "/placeholder-n924a.png",
    overview: "Two strangers meet during cherry blossom season and discover love in unexpected places.",
    rating: 8.0,
    year: 2024,
    genre: ["Romance", "Drama"],
    duration: "1h 52m",
  },
  {
    id: "7",
    title: "The Haunted Manor",
    poster: "/placeholder-l6jwh.png",
    backdrop: "/placeholder-nma5c.png",
    overview: "A family inherits a Victorian mansion with a dark secret that threatens their lives.",
    rating: 7.3,
    year: 2024,
    genre: ["Horror", "Mystery"],
    duration: "1h 38m",
  },
  {
    id: "8",
    title: "Ocean's Fury",
    poster: "/placeholder-22365.png",
    backdrop: "/placeholder.svg?height=600&width=1200",
    overview: "A crew battles against nature's fury when their ship is caught in the storm of the century.",
    rating: 7.6,
    year: 2024,
    genre: ["Adventure", "Drama"],
    duration: "2h 12m",
  },
]

export const getMoviesByGenre = (genre: string): Movie[] => {
  return mockMovies.filter((movie) => movie.genre.some((g) => g.toLowerCase().includes(genre.toLowerCase())))
}

export const getFeaturedMovie = (): Movie => {
  return mockMovies.find((movie) => movie.featured) || mockMovies[0]
}

export const searchMovies = (query: string): Movie[] => {
  if (!query) return mockMovies

  return mockMovies.filter(
    (movie) =>
      movie.title.toLowerCase().includes(query.toLowerCase()) ||
      movie.overview.toLowerCase().includes(query.toLowerCase()) ||
      movie.genre.some((g) => g.toLowerCase().includes(query.toLowerCase())),
  )
}
