"use client";

import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { DashboardNavbar } from "@/components/dashboard-navbar";
import { MovieHero } from "@/components/movie-hero";
import { MovieRow } from "@/components/movie-row";
import {
  omdbService,
  type OMDbMovie,
  type OMDbGenre,
} from "@/lib/omdb-service";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMovies, setFilteredMovies] = useState<OMDbMovie[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<OMDbMovie | null>(null);
  const [trendingMovies, setTrendingMovies] = useState<OMDbMovie[]>([]);
  const [popularMovies, setPopularMovies] = useState<OMDbMovie[]>([]);

  const [topRatedMovies, setTopRatedMovies] = useState<OMDbMovie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<OMDbMovie[]>([]);
  const [genres, setGenres] = useState<OMDbGenre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, addToFavorites, removeFromFavorites, isFavorite } = useAuth();

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery);
    } else {
      setFilteredMovies([]);
    }
  }, [searchQuery]);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);

      // Load genres first
      const genresData = await omdbService.getGenres();
      setGenres(genresData.genres);

      // Load featured movie (first trending movie)
      const trending = await omdbService.getTrendingMovies();
      if (trending.movies.length > 0) {
        setFeaturedMovie(trending.movies[0]);
      }

      // Load different movie categories
      const [trendingData, popularData, topRatedData, nowPlayingData] =
        await Promise.all([
          omdbService.getTrendingMovies(),
          omdbService.getPopularMovies(),
          omdbService.getTopRatedMovies(),
          omdbService.getNowPlayingMovies(),
        ]);

      setTrendingMovies(trendingData.movies);
      setPopularMovies(popularData.movies);
      setTopRatedMovies(topRatedData.movies);
      setNowPlayingMovies(nowPlayingData.movies);
    } catch (error) {
      console.error("Error loading initial data:", error);
      toast({
        title: "Error",
        description: "Failed to load movies. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredMovies([]);
      return;
    }

    try {
      const searchResults = await omdbService.searchMovies(query, 1);
      setFilteredMovies(searchResults.movies);
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search Error",
        description: "Failed to search movies. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddToFavorites = async (movieId: string) => {
    const allMovies = [
      ...trendingMovies,
      ...popularMovies,
      ...topRatedMovies,
      ...nowPlayingMovies,
      ...filteredMovies,
    ];
    console.log("movieId", movieId);
    const movie = allMovies.find((m) => m.imdbId === movieId);
    console.log("movie", movie);
    if (!movie) return;

    if (isFavorite(movieId)) {
      const success = await removeFromFavorites(movieId);
      if (success) {
        toast({
          title: "Removed from favorites",
          description: `${movie.title} has been removed from your list.`,
        });
      }
    } else {
      const success = await addToFavorites(movieId);
      if (success) {
        toast({
          title: "Added to favorites!",
          description: `${movie.title} has been added to your list.`,
        });
      }
    }
  };
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <DashboardNavbar onSearch={handleSearch} />

        {!searchQuery && featuredMovie && (
          <MovieHero
            movie={featuredMovie}
            onAddToFavorites={handleAddToFavorites}
          />
        )}


        <div className="space-y-8 py-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading movies...</p>
              </div>
            </div>
          ) : searchQuery ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold px-4 sm:px-6 lg:px-8">
                Search Results for "{searchQuery}"
                
              </h2>
              {filteredMovies.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 px-4 sm:px-6 lg:px-8">
                  {filteredMovies.map((movie) => (
                    <div key={movie.imdbId} className="group">
                      <div className="relative overflow-hidden rounded-lg bg-muted">
                        <img
                          src={
                            omdbService.getPosterUrl(movie.poster) ||
                            "/placeholder.svg"
                          }
                          alt={movie.title}
                          className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2">
                              {movie.title}
                            </h3>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-xs text-white/80">
                                <span>
                                  {omdbService.formatRating(movie.rating)}
                                </span>
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                <div className="absolute bottom-0 left-0 right-0 p-3 pointer-events-auto">
                                  <button
                                    onClick={() =>
                                      handleAddToFavorites(movie.imdbId)
                                    }
                                    className={`px-2 py-1 rounded text-xs transition-colors ${
                                      isFavorite(movie.imdbId)
                                        ? "bg-red-600 text-white"
                                        : "bg-white/20 text-white hover:bg-white/30"
                                    }`}
                                  >
                                    {isFavorite(movie.imdbId) ? "♥" : "+"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No movies found for "{searchQuery}"
                  </p>
                </div>
              )}
            </div>
          ) : (
            <>
              <MovieRow
                title="Trending Now"
                movies={trendingMovies}
                onAddToFavorites={handleAddToFavorites}
              />
              <MovieRow
                title="Popular Movies"
                movies={popularMovies}
                onAddToFavorites={handleAddToFavorites}
              />
              <MovieRow
                title="Top Rated"
                movies={topRatedMovies}
                onAddToFavorites={handleAddToFavorites}
              />
              <MovieRow
                title="Now Playing"
                movies={nowPlayingMovies}
                onAddToFavorites={handleAddToFavorites}
              />
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
