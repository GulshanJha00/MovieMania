"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { apiService } from "@/lib/api"

interface User {
  id: string
  email: string
  name: string
  favorites: string[]
  preferences?: {
    favoriteGenres: string[]
    language: string
  }
  role?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  addToFavorites: (movieId: string) => Promise<boolean>
  removeFromFavorites: (movieId: string) => Promise<boolean>
  isFavorite: (movieId: string) => boolean
  updateProfile: (name: string, email: string) => Promise<boolean>
  updatePreferences: (preferences: { favoriteGenres?: string[]; language?: string }) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem("token")
    if (token) {
      apiService.setToken(token)
      // Verify token and get user data
      apiService.getCurrentUser()
        .then(response => {
          setUser(response.user)
        })
        .catch(() => {
          // Token is invalid, clear it
          apiService.clearToken()
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [])

  // Helper function to update user data
  const updateUserData = (updatedUser: User) => {
    setUser(updatedUser)
  }

  // Favorites management functions
  const addToFavorites = async (movieId: string): Promise<boolean> => {
    if (!user) return false

    try {
      const response = await apiService.addToFavorites(movieId)
      const updatedUser = {
        ...user,
        favorites: response.favorites,
      }
      updateUserData(updatedUser)
      return true
    } catch (error) {
      console.error('Error adding to favorites:', error)
      return false
    }
  }

  const removeFromFavorites = async (movieId: string): Promise<boolean> => {
    if (!user) return false

    try {
      const response = await apiService.removeFromFavorites(movieId)
      const updatedUser = {
        ...user,
        favorites: response.favorites,
      }
      updateUserData(updatedUser)
      return true
    } catch (error) {
      console.error('Error removing from favorites:', error)
      return false
    }
  }

  const isFavorite = (movieId: string) => {
    return user?.favorites.includes(movieId) || false
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      const response = await apiService.login({ email, password })
      setUser(response.user)
      setIsLoading(false)
      return true
    } catch (error) {
      console.error('Login error:', error)
      setIsLoading(false)
      return false
    }
  }

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      const response = await apiService.register({ name, email, password })
      setUser(response.user)
      setIsLoading(false)
      return true
    } catch (error) {
      console.error('Signup error:', error)
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    apiService.clearToken()
  }

  const updateProfile = async (name: string, email: string): Promise<boolean> => {
    if (!user) return false

    setIsLoading(true)

    try {
      const response = await apiService.updateProfile({ name, email })
      setUser(response.user)
      setIsLoading(false)
      return true
    } catch (error) {
      console.error('Update profile error:', error)
      setIsLoading(false)
      return false
    }
  }

  const updatePreferences = async (preferences: { favoriteGenres?: string[]; language?: string }): Promise<boolean> => {
    if (!user) return false

    setIsLoading(true)

    try {
      const response = await apiService.updatePreferences(preferences)
      setUser(response.user)
      setIsLoading(false)
      return true
    } catch (error) {
      console.error('Update preferences error:', error)
      setIsLoading(false)
      return false
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isLoading,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        updateProfile,
        updatePreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
