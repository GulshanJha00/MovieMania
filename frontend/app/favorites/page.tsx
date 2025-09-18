"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Trash2, Play } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import axios from "axios"
import { omdbService, type OMDbMovie } from "@/lib/omdb-service"

const API_BASE = "http://localhost:5001/api/users"

export default function FavoritesPage() {
  console.log("omdbService", omdbService)
  const [favoriteMovies, setFavoriteMovies] = useState<OMDbMovie[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchFavorites = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      setIsLoading(false)
      return
    }

    try {
      // 1. Fetch user's favorite IDs
      const res = await axios.get(`${API_BASE}/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const favoriteIds: string[] = res.data.favorites || []
      console.log("favoriteIds", favoriteIds)


      if (favoriteIds.length === 0) {
        setFavoriteMovies([])
        return
      }

      const moviesData = await Promise.all(
        favoriteIds.map(async id => {
          try {
            const data = await omdbService.getMovieDetails(id)
            return data.movie
          } catch (error) {
            console.error("Failed to fetch movie:", id, error)
            return null
          }
        })
      )
      
      // Remove nulls in case some failed
      setFavoriteMovies(moviesData.filter((m): m is OMDbMovie => m !== null))

    } catch (error) {
      console.error("Error fetching favorites:", error)
      toast({
        title: "Error",
        description: "Failed to load favorites",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveFromFavorites = async (imdbId: string, movieTitle: string) => {
    const token = localStorage.getItem("token")
    if (!token) return

    try {
      const res = await axios.delete(`${API_BASE}/favorites/${imdbId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Update local state after removal
      setFavoriteMovies(prev => prev.filter(movie => movie.imdbId !== imdbId))

      toast({
        title: "Removed from favorites",
        description: `${movieTitle} has been removed from your list.`,
      })
    } catch (error) {
      console.error("Error removing from favorites:", error)
      toast({
        title: "Error",
        description: `Could not remove ${movieTitle} from favorites.`,
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchFavorites()
  }, [])
  console.log("favoriteMovies", favoriteMovies)

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <DashboardNavbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
            <p className="text-muted-foreground">Your personal collection of favorite movies</p>
          </div>

          {isLoading ? (
            <p>Loading...</p>
          ) : favoriteMovies.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="max-w-md mx-auto">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
                    <p className="text-muted-foreground">
                      Start adding movies to your favorites list to see them here.
                    </p>
                  </div>
                  <Button asChild>
                    <a href="/dashboard">Browse Movies</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteMovies.map(movie => (
                <Card key={movie.imdbId} className="group overflow-hidden">
                  <div className="relative">
                    <img
                      src={omdbService.getPosterUrl(movie.poster) || "/placeholder.svg"}
                      alt={movie.title}
                      className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1">
                            <Play className="mr-1 h-3 w-3" />
                            Play
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRemoveFromFavorites(movie.imdbId, movie.title)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">{movie.title}</h3>
                    <div className="flex items-center gap-4 mb-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span>{omdbService.formatRating(movie.rating)}/10</span>
                      </div>
                      <span>{movie.year}</span>
                      <span>{movie.duration}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {movie.genre.map(g => (
                        <span key={g} className="px-2 py-1 bg-muted rounded text-xs">
                          {g}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3">{movie.overview}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
