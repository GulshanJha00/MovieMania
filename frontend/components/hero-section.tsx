import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Play, Star } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/cinematic-movie-theater-with-red-seats-and-dramati.jpg"
          alt="Hero Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center lg:text-left">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div className="mb-8 lg:mb-0">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-balance mb-6">
              Your Ultimate
              <span className="text-primary block">Movie Experience</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-pretty max-w-2xl">
              Discover, explore, and enjoy thousands of movies with personalized recommendations powered by AI. Your
              perfect movie night starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8 py-4">
                  <Play className="mr-2 h-5 w-5" />
                  Get Started Free
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-transparent">
                <Star className="mr-2 h-5 w-5" />
                Watch Trailer
              </Button>
            </div>
          </div>

          {/* Featured Movie Card */}
          <div className="hidden lg:block">
            <div className="bg-card/90 backdrop-blur-sm rounded-lg p-6 border border-border">
              <img
                src="/movie-poster-for-blockbuster-action-film.jpg"
                alt="Featured Movie"
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Featured This Week</h3>
              <p className="text-muted-foreground mb-4">
                Experience the latest blockbuster with stunning visuals and incredible storytelling.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="text-sm">8.5/10</span>
                </div>
                <Button size="sm">
                  <Play className="mr-1 h-3 w-3" />
                  Watch Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
