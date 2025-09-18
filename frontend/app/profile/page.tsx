"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { useAuth } from "@/contexts/auth-context"
import { mockMovies } from "@/lib/movie-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "@/hooks/use-toast"
import { User, Mail, Heart, Star, Loader2, Edit, Save, X } from "lucide-react"

export default function ProfilePage() {
  const { user, updateProfile, isLoading, removeFromFavorites } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(user?.name || "")
  const [editEmail, setEditEmail] = useState(user?.email || "")

  const favoriteMovies = mockMovies.filter((movie) => user?.favorites.includes(movie.id))

  const handleSaveProfile = async () => {
    if (!editName.trim() || !editEmail.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    const success = await updateProfile(editName, editEmail)

    if (success) {
      setIsEditing(false)
      toast({
        title: "Profile updated!",
        description: "Your profile has been successfully updated.",
      })
    } else {
      toast({
        title: "Update failed",
        description: "Email is already taken by another user",
        variant: "destructive",
      })
    }
  }

  const handleCancelEdit = () => {
    setEditName(user?.name || "")
    setEditEmail(user?.email || "")
    setIsEditing(false)
  }

  const handleRemoveFromFavorites = (movieId: string, movieTitle: string) => {
    removeFromFavorites(movieId)
    toast({
      title: "Removed from favorites",
      description: `${movieTitle} has been removed from your list.`,
    })
  }

  if (!user) return null

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <DashboardNavbar />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Profile</h1>
            <p className="text-muted-foreground">Manage your account settings and view your movie preferences</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Profile Information */}
            <div className="md:col-span-1">
              <Card>
                <CardHeader className="text-center">
                  <Avatar className="h-20 w-20 mx-auto mb-4">
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl">{user.name}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Favorite Movies</span>
                      <span className="font-medium">{user.favorites.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Member Since</span>
                      <span className="font-medium">2024</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Settings */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Profile Settings</CardTitle>
                      <CardDescription>Update your personal information</CardDescription>
                    </div>
                    {!isEditing && (
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        disabled={isLoading}
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-muted rounded">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{user.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        disabled={isLoading}
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-muted rounded">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{user.email}</span>
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleSaveProfile} disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                      <Button variant="outline" onClick={handleCancelEdit} disabled={isLoading}>
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Favorite Movies Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                My Favorite Movies ({favoriteMovies.length})
              </CardTitle>
              <CardDescription>Your personal collection of favorite movies</CardDescription>
            </CardHeader>
            <CardContent>
              {favoriteMovies.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
                  <p className="text-muted-foreground mb-4">Start adding movies to your favorites to see them here</p>
                  <Button asChild>
                    <a href="/dashboard">Browse Movies</a>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {favoriteMovies.slice(0, 12).map((movie) => (
                    <div key={movie.id} className="group">
                      <div className="relative overflow-hidden rounded-lg bg-muted">
                        <img
                          src={movie.poster || "/placeholder.svg"}
                          alt={movie.title}
                          className="w-full h-32 object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-0 left-0 right-0 p-2">
                            <h4 className="font-medium text-white text-xs mb-1 line-clamp-2">{movie.title}</h4>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-xs text-white/80">
                                <Star className="h-3 w-3 text-yellow-400 mr-1" />
                                <span>{movie.rating}</span>
                              </div>
                              <button
                                onClick={() => handleRemoveFromFavorites(movie.id, movie.title)}
                                className="text-xs text-red-400 hover:text-red-300"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {favoriteMovies.length > 12 && (
                <div className="mt-6 text-center">
                  <Button variant="outline" asChild>
                    <a href="/favorites">View All Favorites</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
