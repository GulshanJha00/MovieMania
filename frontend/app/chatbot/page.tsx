"use client"

import type React from "react"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, User, Send, Loader2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function ChatbotPage() {
  const [input, setInput] = useState("")

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || status === "in_progress") return

    sendMessage({ text: input })
    setInput("")
  }

  const suggestedQuestions = [
    "Recommend me a good action movie",
    "What's a great comedy to watch tonight?",
    "I'm in the mood for something romantic",
    "Show me the highest rated movies",
    "What sci-fi movies do you have?",
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <DashboardNavbar />

        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">AI Movie Recommendations</h1>
            <p className="text-muted-foreground">
              Get personalized movie recommendations powered by AI. Ask me about genres, moods, or specific preferences!
            </p>
          </div>

          <Card className="h-[600px] flex flex-col">
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-full p-6">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Welcome to MovieMate AI!</h3>
                    <p className="text-muted-foreground mb-6">
                      I'm here to help you discover amazing movies. Try asking me one of these questions:
                    </p>
                    <div className="grid gap-2 max-w-md mx-auto">
                      {suggestedQuestions.map((question, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="text-left justify-start bg-transparent"
                          onClick={() => {
                            setInput(question)
                            sendMessage({ text: question })
                          }}
                        >
                          {question}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {message.role === "assistant" && (
                          <Avatar className="h-8 w-8 bg-primary">
                            <AvatarFallback>
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            message.role === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
                          }`}
                        >
                          <div className="whitespace-pre-wrap">
                            {message.parts.map((part, index) => {
                              if (part.type === "text") {
                                return <span key={index}>{part.text}</span>
                              }
                              return null
                            })}
                          </div>
                        </div>

                        {message.role === "user" && (
                          <Avatar className="h-8 w-8 bg-muted">
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}

                    {status === "in_progress" && (
                      <div className="flex gap-3 justify-start">
                        <Avatar className="h-8 w-8 bg-primary">
                          <AvatarFallback>
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-muted rounded-lg px-4 py-2">
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm text-muted-foreground">Thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>
            </CardContent>

            <div className="border-t p-4">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me about movies..."
                  disabled={status === "in_progress"}
                  className="flex-1"
                />
                <Button type="submit" disabled={!input.trim() || status === "in_progress"} size="icon">
                  {status === "in_progress" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
