import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Heart, Search, Sparkles, Users, Zap } from "lucide-react"

const features = [
  {
    icon: Bot,
    title: "AI-Powered Recommendations",
    description: "Get personalized movie suggestions based on your preferences and viewing history.",
  },
  {
    icon: Search,
    title: "Advanced Search",
    description: "Find exactly what you're looking for with our powerful search and filtering system.",
  },
  {
    icon: Heart,
    title: "Favorites Management",
    description: "Save your favorite movies and create custom watchlists for easy access.",
  },
  {
    icon: Sparkles,
    title: "Curated Collections",
    description: "Explore handpicked movie collections from critics and fellow movie enthusiasts.",
  },
  {
    icon: Users,
    title: "Social Features",
    description: "Share recommendations with friends and discover what others are watching.",
  },
  {
    icon: Zap,
    title: "Instant Streaming",
    description: "Start watching immediately with our fast, reliable streaming technology.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
            Everything You Need for the
            <span className="text-primary block">Perfect Movie Experience</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Discover why millions of movie lovers choose MovieMate for their entertainment needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur-sm border-border hover:bg-card/70 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
