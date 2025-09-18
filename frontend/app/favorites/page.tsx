"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { useAuth } from "@/contexts/auth-context"
import { mockMovies } from "@/lib/movie-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Trash2, Play } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function FavoritesPage() {
  const { user, removeFromFavorites } = useAuth()

  const favoriteMovies = mockMovies.filter((movie) => user?.favorites.includes(movie.id))

  const handleRemoveFromFavorites = (movieId: string, movieTitle: string) => {
    removeFromFavorites(movieId)
    toast({
      title: "Removed from favorites",
      description: `${movieTitle} has been removed from your list.`,
    })
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <DashboardNavbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
            <p className="text-muted-foreground">Your personal collection of favorite movies</p>
          </div>

          {favoriteMovies.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="max-w-md mx-auto">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
                    <p className="text-muted-foreground">
                      Start adding movies to your favorites list to see them here. Browse our collection and click the
                      "+" button on any movie you love!
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
              {favoriteMovies.map((movie) => (
                <Card key={movie.id} className="group overflow-hidden">
                  <div className="relative">
                    <img
                      src={movie.poster || "/placeholder.svg"}
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
                            onClick={() => handleRemoveFromFavorites(movie.id, movie.title)}
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
                        <span>{movie.rating}/10</span>
                      </div>
                      <span>{movie.year}</span>
                      <span>{movie.duration}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {movie.genre.map((g) => (
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
