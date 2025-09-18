"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { MovieHero } from "@/components/movie-hero"
import { MovieRow } from "@/components/movie-row"
import { mockMovies, getFeaturedMovie, getMoviesByGenre, searchMovies } from "@/lib/movie-data"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredMovies, setFilteredMovies] = useState(mockMovies)
  const { user, addToFavorites, removeFromFavorites, isFavorite } = useAuth()
  const featuredMovie = getFeaturedMovie()

  useEffect(() => {
    if (searchQuery) {
      setFilteredMovies(searchMovies(searchQuery))
    } else {
      setFilteredMovies(mockMovies)
    }
  }, [searchQuery])

  const handleAddToFavorites = (movieId: string) => {
    const movie = mockMovies.find((m) => m.id === movieId)
    if (!movie) return

    if (isFavorite(movieId)) {
      removeFromFavorites(movieId)
      toast({
        title: "Removed from favorites",
        description: `${movie.title} has been removed from your list.`,
      })
    } else {
      addToFavorites(movieId)
      toast({
        title: "Added to favorites!",
        description: `${movie.title} has been added to your list.`,
      })
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <DashboardNavbar onSearch={handleSearch} />

        {!searchQuery && <MovieHero movie={featuredMovie} onAddToFavorites={handleAddToFavorites} />}

        <div className="space-y-8 py-8">
          {searchQuery ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold px-4 sm:px-6 lg:px-8">Search Results for "{searchQuery}"</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 px-4 sm:px-6 lg:px-8">
                {filteredMovies.map((movie) => (
                  <div key={movie.id} className="group">
                    <div className="relative overflow-hidden rounded-lg bg-muted">
                      <img
                        src={movie.poster || "/placeholder.svg"}
                        alt={movie.title}
                        className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2">{movie.title}</h3>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-xs text-white/80">
                              <span>{movie.rating}/10</span>
                            </div>
                            <button
                              onClick={() => handleAddToFavorites(movie.id)}
                              className={`px-2 py-1 rounded text-xs transition-colors ${
                                isFavorite(movie.id)
                                  ? "bg-red-600 text-white"
                                  : "bg-white/20 text-white hover:bg-white/30"
                              }`}
                            >
                              {isFavorite(movie.id) ? "♥" : "+"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <MovieRow title="Trending Now" movies={mockMovies.slice(0, 6)} onAddToFavorites={handleAddToFavorites} />
              <MovieRow
                title="Action Movies"
                movies={getMoviesByGenre("Action")}
                onAddToFavorites={handleAddToFavorites}
              />
              <MovieRow title="Comedy" movies={getMoviesByGenre("Comedy")} onAddToFavorites={handleAddToFavorites} />
              <MovieRow title="Drama" movies={getMoviesByGenre("Drama")} onAddToFavorites={handleAddToFavorites} />
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
