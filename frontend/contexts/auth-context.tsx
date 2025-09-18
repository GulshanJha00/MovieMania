"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  email: string
  name: string
  favorites: string[]
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  addToFavorites: (movieId: string) => void
  removeFromFavorites: (movieId: string) => void
  isFavorite: (movieId: string) => boolean
  updateProfile: (name: string, email: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const savedUser = localStorage.getItem("moviemate-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  // Helper function to update user data in localStorage
  const updateUserData = (updatedUser: User) => {
    setUser(updatedUser)
    localStorage.setItem("moviemate-user", JSON.stringify(updatedUser))

    // Also update in the users array
    const users = JSON.parse(localStorage.getItem("moviemate-users") || "[]")
    const userIndex = users.findIndex((u: any) => u.id === updatedUser.id)
    if (userIndex !== -1) {
      users[userIndex] = { ...updatedUser, password: users[userIndex].password }
      localStorage.setItem("moviemate-users", JSON.stringify(users))
    }
  }

  // Favorites management functions
  const addToFavorites = (movieId: string) => {
    if (!user) return

    if (!user.favorites.includes(movieId)) {
      const updatedUser = {
        ...user,
        favorites: [...user.favorites, movieId],
      }
      updateUserData(updatedUser)
    }
  }

  const removeFromFavorites = (movieId: string) => {
    if (!user) return

    const updatedUser = {
      ...user,
      favorites: user.favorites.filter((id) => id !== movieId),
    }
    updateUserData(updatedUser)
  }

  const isFavorite = (movieId: string) => {
    return user?.favorites.includes(movieId) || false
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem("moviemate-users") || "[]")
    const existingUser = users.find((u: any) => u.email === email && u.password === password)

    if (existingUser) {
      const userWithoutPassword = { ...existingUser }
      delete userWithoutPassword.password
      setUser(userWithoutPassword)
      localStorage.setItem("moviemate-user", JSON.stringify(userWithoutPassword))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem("moviemate-users") || "[]")
    const existingUser = users.find((u: any) => u.email === email)

    if (existingUser) {
      setIsLoading(false)
      return false
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
      favorites: [],
    }

    users.push(newUser)
    localStorage.setItem("moviemate-users", JSON.stringify(users))

    // Log in the new user
    const userWithoutPassword = { ...newUser }
    delete userWithoutPassword.password
    setUser(userWithoutPassword)
    localStorage.setItem("moviemate-user", JSON.stringify(userWithoutPassword))

    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("moviemate-user")
  }

  const updateProfile = async (name: string, email: string): Promise<boolean> => {
    if (!user) return false

    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if email is already taken by another user
    const users = JSON.parse(localStorage.getItem("moviemate-users") || "[]")
    const existingUser = users.find((u: any) => u.email === email && u.id !== user.id)

    if (existingUser) {
      setIsLoading(false)
      return false
    }

    // Update user data
    const updatedUser = {
      ...user,
      name,
      email,
    }

    updateUserData(updatedUser)
    setIsLoading(false)
    return true
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
