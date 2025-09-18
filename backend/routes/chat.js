const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Movie = require('../models/Movie');
const { auth } = require('../middleware/auth');
const { validateChat } = require('../middleware/validation');

const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @route   POST /api/chat
// @desc    Chat with AI for movie recommendations
// @access  Private
router.post('/', auth, validateChat, async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        message: 'AI service is not configured. Please contact administrator.' 
      });
    }
    
    // Get movies from database for context
    const movies = await Movie.find({})
      .select('title year genre rating overview duration director cast')
      .limit(50)
      .lean();
    
    // Create movie context for AI
    const movieContext = movies.map(movie => 
      `Title: ${movie.title} (${movie.year})
Genre: ${movie.genre.join(', ')}
Rating: ${movie.rating}/10
Duration: ${movie.duration}
Director: ${movie.director || 'N/A'}
Cast: ${movie.cast ? movie.cast.join(', ') : 'N/A'}
Overview: ${movie.overview}
---`
    ).join('\n');
    
    // Create system prompt
    const systemPrompt = `You are MovieMate's AI recommendation assistant. You help users discover movies based on their preferences.

Available movies in our catalog:
${movieContext}

Guidelines:
- Recommend movies from the catalog based on user preferences
- Ask follow-up questions about genres, mood, or specific actors they like
- Provide detailed explanations for your recommendations
- Be enthusiastic and knowledgeable about movies
- If asked about movies not in the catalog, then give that movies details from the internet including its rating from imdb and all. Do this for all the movies too.
- Keep responses conversational and engaging
- Always provide specific movie titles from the catalog when making recommendations
- Include ratings, genres, and brief descriptions when recommending movies
- If the user asks for a specific genre, filter recommendations to that genre
- Be helpful and provide multiple options when possible`;

    // Prepare conversation history
    const conversation = [
      {
        role: 'user',
        parts: [{ text: systemPrompt }]
      }
    ];
    
    // Add conversation history
    conversationHistory.forEach(msg => {
      conversation.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      });
    });
    
    // Add current message
    conversation.push({
      role: 'user',
      parts: [{ text: message }]
    });
    
    // Generate response using Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const result = await model.generateContent({
      contents: conversation
    });
    
    const response = await result.response;
    const aiResponse = response.text();
    
    res.json({
      message: aiResponse,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Chat error:', error);
    
    // Handle specific Gemini API errors
    if (error.message.includes('API_KEY')) {
      return res.status(500).json({ 
        message: 'AI service configuration error. Please contact administrator.' 
      });
    }
    
    if (error.message.includes('quota') || error.message.includes('limit')) {
      return res.status(429).json({ 
        message: 'AI service is temporarily unavailable. Please try again later.' 
      });
    }
    
    res.status(500).json({ 
      message: 'Sorry, I encountered an error. Please try again.' 
    });
  }
});

// @route   POST /api/chat/recommend
// @desc    Get AI movie recommendations based on genre/preferences
// @access  Private
router.post('/recommend', auth, async (req, res) => {
  try {
    const { genre, mood, preferences } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        message: 'AI service is not configured. Please contact administrator.' 
      });
    }
    
    // Get movies from database
    let query = {};
    if (genre) {
      query.genre = { $in: Array.isArray(genre) ? genre : [genre] };
    }
    
    const movies = await Movie.find(query)
      .select('title year genre rating overview duration director cast')
      .sort({ rating: -1 })
      .limit(20)
      .lean();
    
    if (movies.length === 0) {
      return res.json({
        message: "I couldn't find any movies matching your criteria. Try exploring different genres!",
        recommendations: []
      });
    }
    
    // Create context for AI
    const movieContext = movies.map(movie => 
      `${movie.title} (${movie.year}) - ${movie.genre.join(', ')} - Rating: ${movie.rating}/10 - ${movie.overview}`
    ).join('\n');
    
    const prompt = `Based on the user's preferences, recommend 3-5 movies from this list:

User preferences:
- Genre: ${genre || 'Any'}
- Mood: ${mood || 'Any'}
- Additional preferences: ${preferences || 'None'}

Available movies:
${movieContext}

Please provide:
1. 3-5 specific movie recommendations
2. Brief explanation for each recommendation
3. Why these movies match their preferences
4. Any additional suggestions

Format your response in a friendly, conversational way.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponse = response.text();
    
    res.json({
      message: aiResponse,
      recommendations: movies.slice(0, 5), // Return top 5 movies as well
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ 
      message: 'Sorry, I encountered an error while generating recommendations. Please try again.' 
    });
  }
});

// @route   GET /api/chat/suggestions
// @desc    Get suggested questions for the chatbot
// @access  Private
router.get('/suggestions', auth, async (req, res) => {
  try {
    const suggestions = [
      "Recommend me a good action movie",
      "What's a great comedy to watch tonight?",
      "I'm in the mood for something romantic",
      "Show me the highest rated movies",
      "What sci-fi movies do you have?",
      "I want to watch something with my family",
      "Recommend a thriller movie",
      "What are the best movies from 2024?",
      "I like movies with strong female leads",
      "What's a good movie for date night?"
    ];
    
    res.json({ suggestions });
  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({ message: 'Server error while fetching suggestions' });
  }
});

module.exports = router;
