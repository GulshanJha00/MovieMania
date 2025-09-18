"use client"

import { Button } from "@/components/ui/button"
import { Play, Plus, Heart, Star } from "lucide-react"
import type { Movie } from "@/lib/movie-data"
import { useAuth } from "@/contexts/auth-context"

interface MovieHeroProps {
  movie: Movie
  onAddToFavorites?: (movieId: string) => void
}

export function MovieHero({ movie, onAddToFavorites }: MovieHeroProps) {
  const { isFavorite } = useAuth()

  return (
    <section className="relative h-[70vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src={movie.backdrop || "/placeholder.svg"} alt={movie.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-4">{movie.title}</h1>
          <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span>{movie.rating}/10</span>
            </div>
            <span>{movie.year}</span>
            <span>{movie.duration}</span>
            <div className="flex gap-2">
              {movie.genre.map((g) => (
                <span key={g} className="px-2 py-1 bg-muted rounded text-xs">
                  {g}
                </span>
              ))}
            </div>
          </div>
          <p className="text-lg text-muted-foreground mb-8 text-pretty">{movie.overview}</p>
          <div className="flex gap-4">
            <Button size="lg" className="text-lg px-8">
              <Play className="mr-2 h-5 w-5" />
              Play
            </Button>
            <Button
              size="lg"
              variant={isFavorite(movie.id) ? "destructive" : "outline"}
              className="text-lg px-8 bg-transparent"
              onClick={() => onAddToFavorites?.(movie.id)}
            >
              {isFavorite(movie.id) ? (
                <>
                  <Heart className="mr-2 h-5 w-5 fill-current" />
                  Remove from List
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-5 w-5" />
                  My List
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
