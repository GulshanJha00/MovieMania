# 🎬 MovieMania
Project Video Demo(https://drive.google.com/file/d/1xItEoEGNEiQWvFElhbxlNwswhD15Z01t/view?usp=sharing)

A modern, full-stack movie recommendation application with AI-powered chatbot functionality. Built with Next.js, Node.js, MongoDB, and Google Gemini AI.

![MovieMania](https://img.shields.io/badge/MovieMania-v1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.2.16-black)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)

## ✨ Features

### 🔐 Authentication & User Management
- **JWT-based Authentication** - Secure login and registration
- **User Profiles** - Manage personal information and preferences
- **Protected Routes** - Secure access to user-specific content
- **Role-based Access** - Admin and user roles with different permissions

### 🎬 Movie Management
- **Real Movie Database** - Browse thousands of real movies from OMDb API (works globally including India)
- **Advanced Search & Filtering** - Find movies by genre, year, rating, and more
- **Movie Categories** - Organized by genres (Action, Comedy, Drama, Sci-Fi, etc.)
- **Featured Movies** - Highlighted recommendations and trending content
- **Movie Details** - Detailed information including cast, director, ratings, awards, and box office

### ❤️ Personalization
- **Favorites System** - Save and manage your favorite movies
- **Personalized Recommendations** - AI-powered suggestions based on preferences
- **User Preferences** - Set favorite genres and language preferences
- **Watch History** - Track your movie viewing preferences

### 🤖 AI-Powered Chatbot
- **Intelligent Recommendations** - Get personalized movie suggestions
- **Genre-based Filtering** - Ask for specific types of movies
- **Conversational Interface** - Natural language interaction
- **Powered by Google Gemini** - Advanced AI for better recommendations

### 🎨 Modern UI/UX
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Dark/Light Theme** - Beautiful interface with theme switching
- **Smooth Animations** - Engaging user experience with smooth transitions
- **Intuitive Navigation** - Easy-to-use interface for all users

## 🏗️ Architecture

### Frontend (Next.js)
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context API
- **Authentication**: JWT token management
- **API Integration**: Custom API service layer

### Backend (Node.js)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt password hashing
- **AI Integration**: Google Gemini API
- **Security**: Helmet, CORS, Rate limiting
- **Validation**: Express-validator

### Database Schema
- **Users**: Authentication, preferences, favorites
- **Movies**: Complete movie information with metadata
- **Relationships**: User favorites linked to movies

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Google Gemini API key

### 1. Clone the Repository
```bash
git clone <repository-url>
cd MovieMania
```

### 2. Backend Setup
```bash
cd backend
npm install
cp env.example .env
# Edit .env with your configuration
npm run seed  # Populate database with sample movies
npm run dev   # Start backend server
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# Create .env.local with NEXT_PUBLIC_API_URL=http://localhost:5000/api
npm run dev   # Start frontend server
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📋 Environment Configuration

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/moviemania
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
GEMINI_API_KEY=your-gemini-api-key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/verify-token` - Verify JWT token

### Movies
- `GET /api/movies` - Get movies with filtering
- `GET /api/movies/featured` - Get featured movies
- `GET /api/movies/genres` - Get available genres
- `GET /api/movies/:id` - Get single movie
- `GET /api/movies/search/:query` - Search movies

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/favorites` - Get user favorites
- `POST /api/users/favorites/:id` - Add to favorites
- `DELETE /api/users/favorites/:id` - Remove from favorites

### AI Chat
- `POST /api/chat` - Chat with AI
- `POST /api/chat/recommend` - Get AI recommendations
- `GET /api/chat/suggestions` - Get chat suggestions

## 🛠️ Development

### Project Structure
```
MovieMania/
├── backend/                 # Node.js/Express backend
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── scripts/            # Database seeding
│   └── server.js           # Main server file
├── frontend/               # Next.js frontend
│   ├── app/                # App router pages
│   ├── components/         # React components
│   ├── lib/                # Utilities and services
│   └── contexts/           # React contexts
└── setup.md               # Detailed setup guide
```

### Available Scripts

#### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data

#### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🔧 Configuration

### MongoDB Setup
1. Install MongoDB locally or use MongoDB Atlas
2. Update `MONGODB_URI` in backend `.env`
3. Run `npm run seed` to populate with sample data

### Gemini AI Setup
1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to backend `.env` as `GEMINI_API_KEY`
3. Restart backend server

### Security Configuration
- Set strong `JWT_SECRET` in backend `.env`
- Configure CORS settings for production
- Use environment variables for sensitive data

## 🚀 Deployment

### Backend Deployment
1. Set `NODE_ENV=production`
2. Use production MongoDB instance
3. Configure proper CORS settings
4. Deploy to Heroku, Railway, or similar

### Frontend Deployment
1. Build: `npm run build`
2. Set production API URL
3. Deploy to Vercel, Netlify, or similar

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Express.js](https://expressjs.com/) - Node.js framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Google Gemini](https://ai.google.dev/) - AI integration
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling

## 📞 Support

If you encounter any issues or have questions:
1. Check the [setup guide](setup.md) for detailed instructions
2. Review the console logs for error messages
3. Verify all environment variables are configured correctly
4. Ensure MongoDB and backend server are running

---

**Made with ❤️ for movie lovers everywhere!**
