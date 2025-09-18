# MovieMania Setup Guide

This guide will help you set up the MovieMania application with both frontend and backend components.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Google Gemini API key (for AI chatbot functionality)

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
```bash
cp env.example .env
```

Edit the `.env` file with your configuration:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/moviemania

# JWT
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRE=7d

# Google Gemini API
GEMINI_API_KEY=your-gemini-api-key-here

# Server
PORT=5000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:3000
```

### 4. Start MongoDB
Make sure MongoDB is running on your system. If using MongoDB Atlas, update the `MONGODB_URI` in your `.env` file.

### 5. Seed the Database
```bash
npm run seed
```

This will populate your database with sample movies.

### 6. Start the Backend Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The backend will be available at `http://localhost:5000`

## Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Start the Frontend Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Getting Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key
5. Add it to your backend `.env` file as `GEMINI_API_KEY`

## Features

### Authentication
- User registration and login
- JWT-based authentication
- Protected routes
- User profile management

### Movies
- Browse movies by category
- Search functionality
- Movie details and ratings
- Featured movies carousel

### Favorites
- Add/remove movies from favorites
- View favorite movies list
- Persistent favorites across sessions

### AI Chatbot
- Intelligent movie recommendations
- Genre-based filtering
- Conversational interface
- Powered by Google Gemini AI

### Admin Features
- Movie CRUD operations (admin only)
- User management
- Database seeding

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/verify-token` - Verify JWT token

### Movies
- `GET /api/movies` - Get all movies (with filtering)
- `GET /api/movies/featured` - Get featured movies
- `GET /api/movies/genres` - Get available genres
- `GET /api/movies/:id` - Get single movie
- `GET /api/movies/search/:query` - Search movies

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/favorites` - Get favorites
- `POST /api/users/favorites/:id` - Add to favorites
- `DELETE /api/users/favorites/:id` - Remove from favorites

### Chat
- `POST /api/chat` - Chat with AI
- `POST /api/chat/recommend` - Get AI recommendations
- `GET /api/chat/suggestions` - Get chat suggestions

## Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  favorites: [ObjectId],
  role: String (user/admin),
  preferences: {
    favoriteGenres: [String],
    language: String
  }
}
```

### Movie
```javascript
{
  title: String,
  overview: String,
  poster: String,
  backdrop: String,
  rating: Number,
  year: Number,
  genre: [String],
  duration: String,
  director: String,
  cast: [String],
  featured: Boolean,
  popularity: Number
}
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the connection string in `.env`
   - Verify network access if using MongoDB Atlas

2. **JWT Token Issues**
   - Make sure `JWT_SECRET` is set in `.env`
   - Check token expiration settings

3. **Gemini API Errors**
   - Verify your API key is correct
   - Check API quota limits
   - Ensure internet connectivity

4. **CORS Issues**
   - Verify `FRONTEND_URL` in backend `.env`
   - Check that frontend is running on the correct port

### Development Tips

- Use `npm run dev` for both frontend and backend for hot reloading
- Check browser console and server logs for debugging
- Use MongoDB Compass or similar tools to inspect your database
- Test API endpoints using Postman or similar tools

## Production Deployment

### Backend
1. Set `NODE_ENV=production` in `.env`
2. Use a production MongoDB instance
3. Set up proper JWT secrets
4. Configure CORS for production domain
5. Use PM2 or similar for process management

### Frontend
1. Build the application: `npm run build`
2. Set production API URL in environment variables
3. Deploy to Vercel, Netlify, or similar platform

## Support

If you encounter any issues:
1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check that MongoDB and the backend server are running

## License

MIT License - see LICENSE file for details
