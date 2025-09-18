"use client";

import type { Movie } from "@/lib/movie-data";
import { Button } from "@/components/ui/button";
import { Star, Plus, Heart } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/auth-context";
import { OMDbMovie } from "@/lib/omdb-service";

interface MovieRowProps {
  title: string;
  movies: OMDbMovie[];
  onAddToFavorites?: (movieId: string) => void;
}

export function MovieRow({ title, movies, onAddToFavorites }: MovieRowProps) {
  const { isFavorite } = useAuth();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold px-4 sm:px-6 lg:px-8">{title}</h2>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-4 px-4 sm:px-6 lg:px-8 pb-4">
          {movies.map((movie) => (
            <div key={movie.id} className="flex-none w-48 group">
              <div className="relative overflow-hidden rounded-lg bg-muted">
                <img
                  src={movie.poster || "/placeholder.svg"}
                  alt={movie.title}
                  className="w-full h-72 object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2">
                      {movie.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-white/80">
                        <Star className="h-3 w-3 text-yellow-400 mr-1" />
                        <span>{movie.rating}</span>
                      </div>
                      <Button
                        size="sm"
                        variant={
                          isFavorite(movie.imdbId) ? "destructive" : "secondary"
                        }
                        className="h-6 px-2 text-xs"
                        onClick={() => onAddToFavorites?.(movie.imdbId)}
                      >
                        {isFavorite(movie.imdbId) ? (
                          <Heart className="h-3 w-3 fill-current" />
                        ) : (
                          <Plus className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
