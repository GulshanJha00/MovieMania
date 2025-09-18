# MovieMania Backend API

A comprehensive backend API for the MovieMania application built with Node.js, Express, MongoDB, and JWT authentication.

## Features

- 🔐 JWT Authentication & Authorization
- 🎬 Movie CRUD Operations
- 🤖 AI-Powered Chatbot with Gemini API
- ❤️ User Favorites Management
- 👤 User Profile Management
- 🔍 Advanced Movie Search & Filtering
- 📊 Personalized Recommendations
- 🛡️ Security Middleware (Helmet, Rate Limiting)
- ✅ Input Validation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **AI Integration**: Google Gemini API
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express Validator

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MovieMania/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/moviemania
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   GEMINI_API_KEY=your-gemini-api-key-here
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Seed the database**
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/verify-token` - Verify JWT token

### Movies
- `GET /api/movies` - Get all movies (with filtering & pagination)
- `GET /api/movies/featured` - Get featured movies
- `GET /api/movies/genres` - Get all available genres
- `GET /api/movies/:id` - Get single movie
- `GET /api/movies/search/:query` - Search movies
- `POST /api/movies` - Create movie (Admin only)
- `PUT /api/movies/:id` - Update movie (Admin only)
- `DELETE /api/movies/:id` - Delete movie (Admin only)

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/preferences` - Update user preferences
- `GET /api/users/favorites` - Get user's favorite movies
- `POST /api/users/favorites/:movieId` - Add movie to favorites
- `DELETE /api/users/favorites/:movieId` - Remove movie from favorites
- `GET /api/users/recommendations` - Get personalized recommendations

### Chat
- `POST /api/chat` - Chat with AI for movie recommendations
- `POST /api/chat/recommend` - Get AI recommendations based on preferences
- `GET /api/chat/suggestions` - Get suggested questions

## Database Models

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

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Rate Limiting**: Prevent API abuse
- **CORS**: Configured for frontend communication
- **Helmet**: Security headers
- **Input Validation**: Express-validator for request validation
- **Error Handling**: Comprehensive error handling middleware

## AI Integration

The chatbot uses Google's Gemini API to provide intelligent movie recommendations. Features include:

- Context-aware responses based on movie database
- Genre-based filtering
- Personalized recommendations
- Conversational interface
- Error handling for API limits

## Development

### Project Structure
```
backend/
├── models/          # Database models
├── routes/          # API routes
├── middleware/      # Custom middleware
├── scripts/         # Database seeding scripts
├── server.js        # Main server file
└── package.json     # Dependencies
```

### Adding New Features

1. Create model in `models/`
2. Add routes in `routes/`
3. Add middleware if needed in `middleware/`
4. Update server.js to include new routes

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/moviemania` |
| `JWT_SECRET` | Secret key for JWT tokens | Required |
| `JWT_EXPIRE` | JWT token expiration | `7d` |
| `GEMINI_API_KEY` | Google Gemini API key | Required |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
