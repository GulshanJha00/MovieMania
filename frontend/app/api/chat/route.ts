import { google } from "@ai-sdk/google"
import { convertToModelMessages, streamText, type UIMessage } from "ai"
import { mockMovies } from "@/lib/movie-data"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const prompt = convertToModelMessages(messages)

  // Create context about available movies
  const movieContext = `You are MovieMate's AI recommendation assistant. You help users discover movies based on their preferences.

Available movies in our catalog:
${mockMovies
  .map(
    (movie) =>
      `- ${movie.title} (${movie.year}) - ${movie.genre.join(", ")} - Rating: ${movie.rating}/10
    Overview: ${movie.overview}`,
  )
  .join("\n")}

Guidelines:
- Recommend movies from the catalog based on user preferences
- Ask follow-up questions about genres, mood, or specific actors they like
- Provide detailed explanations for your recommendations
- Be enthusiastic and knowledgeable about movies
- If asked about movies not in the catalog, acknowledge that and suggest similar ones from our collection
- Keep responses conversational and engaging`

  const result = streamText({
    model: google("gemini-1.5-flash"),
    messages: [
      {
        role: "system",
        content: movieContext,
      },
      ...prompt,
    ],
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse({
    onFinish: async ({ isAborted }) => {
      if (isAborted) {
        console.log("Chat aborted")
      }
    },
  })
}
