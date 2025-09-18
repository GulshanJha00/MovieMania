const mongoose = require('mongoose');
const Movie = require('../models/Movie');
require('dotenv').config();

const movies = [
  {
    title: "Quantum Horizon",
    poster: "/placeholder-vd1oy.png",
    backdrop: "/placeholder-3hk25.png",
    overview: "A mind-bending sci-fi thriller about a physicist who discovers parallel dimensions and must save reality itself.",
    rating: 8.7,
    year: 2024,
    genre: ["Sci-Fi", "Thriller"],
    duration: "2h 18m",
    director: "Alex Chen",
    cast: ["Emma Stone", "Ryan Gosling", "Michael Fassbender"],
    featured: true,
    popularity: 95
  },
  {
    title: "Shadow's Edge",
    poster: "/placeholder-ir7p9.png",
    backdrop: "/placeholder-rg8kf.png",
    overview: "An elite assassin must protect a witness while being hunted by his former organization.",
    rating: 7.9,
    year: 2024,
    genre: ["Action", "Thriller"],
    duration: "1h 56m",
    director: "James Rodriguez",
    cast: ["Tom Hardy", "Charlize Theron", "Idris Elba"],
    featured: true,
    popularity: 88
  },
  {
    title: "The Last Symphony",
    poster: "/placeholder-wh4rd.png",
    backdrop: "/placeholder-s45oh.png",
    overview: "A young conductor fights to save a historic orchestra while dealing with personal tragedy.",
    rating: 8.2,
    year: 2024,
    genre: ["Drama", "Music"],
    duration: "2h 4m",
    director: "Sophie Williams",
    cast: ["Timothée Chalamet", "Cate Blanchett", "Anthony Hopkins"],
    featured: true,
    popularity: 82
  },
  {
    title: "Cosmic Comedy Club",
    poster: "/placeholder-z1x0n.png",
    backdrop: "/placeholder-mhhbe.png",
    overview: "Aliens visit Earth to learn about human comedy, with hilarious results.",
    rating: 7.5,
    year: 2024,
    genre: ["Comedy", "Sci-Fi"],
    duration: "1h 42m",
    director: "Mike Johnson",
    cast: ["Kevin Hart", "Tiffany Haddish", "Will Ferrell"],
    featured: false,
    popularity: 75
  },
  {
    title: "Midnight Runner",
    poster: "/placeholder-l97bu.png",
    backdrop: "/placeholder-j3o1l.png",
    overview: "A parkour expert becomes the city's most wanted after witnessing a conspiracy.",
    rating: 7.8,
    year: 2024,
    genre: ["Action", "Crime"],
    duration: "1h 48m",
    director: "David Park",
    cast: ["Dwayne Johnson", "Gal Gadot", "Jason Statham"],
    featured: false,
    popularity: 78
  },
  {
    title: "Love in Tokyo",
    poster: "/placeholder-nq16t.png",
    backdrop: "/placeholder-n924a.png",
    overview: "Two strangers meet during cherry blossom season and discover love in unexpected places.",
    rating: 8.0,
    year: 2024,
    genre: ["Romance", "Drama"],
    duration: "1h 52m",
    director: "Yuki Tanaka",
    cast: ["Rachel McAdams", "Ryan Reynolds", "Ken Watanabe"],
    featured: true,
    popularity: 80
  },
  {
    title: "The Haunted Manor",
    poster: "/placeholder-l6jwh.png",
    backdrop: "/placeholder-nma5c.png",
    overview: "A family inherits a Victorian mansion with a dark secret that threatens their lives.",
    rating: 7.3,
    year: 2024,
    genre: ["Horror", "Mystery"],
    duration: "1h 38m",
    director: "Sarah Mitchell",
    cast: ["Vera Farmiga", "Patrick Wilson", "Mckenna Grace"],
    featured: false,
    popularity: 73
  },
  {
    title: "Ocean's Fury",
    poster: "/placeholder-22365.png",
    backdrop: "/placeholder.svg?height=600&width=1200",
    overview: "A crew battles against nature's fury when their ship is caught in the storm of the century.",
    rating: 7.6,
    year: 2024,
    genre: ["Adventure", "Drama"],
    duration: "2h 12m",
    director: "Robert Storm",
    cast: ["Chris Hemsworth", "Natalie Portman", "Jake Gyllenhaal"],
    featured: false,
    popularity: 76
  },
  {
    title: "The Art of War",
    poster: "/placeholder-nma5c.png",
    backdrop: "/placeholder-rg8kf.png",
    overview: "A military strategist must outwit an AI system that has taken control of global defense networks.",
    rating: 8.4,
    year: 2024,
    genre: ["Action", "Sci-Fi", "Thriller"],
    duration: "2h 25m",
    director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio", "Anne Hathaway", "Tom Hardy"],
    featured: true,
    popularity: 84
  },
  {
    title: "Family Reunion",
    poster: "/placeholder-mhhbe.png",
    backdrop: "/placeholder-s45oh.png",
    overview: "Three generations come together for a chaotic but heartwarming family reunion.",
    rating: 7.1,
    year: 2024,
    genre: ["Comedy", "Family"],
    duration: "1h 45m",
    director: "Jennifer Lopez",
    cast: ["Jennifer Lopez", "Owen Wilson", "Diane Keaton"],
    featured: false,
    popularity: 71
  },
  {
    title: "The Detective's Daughter",
    poster: "/placeholder-j3o1l.png",
    backdrop: "/placeholder-wh4rd.png",
    overview: "A young woman follows in her father's footsteps to solve his final unsolved case.",
    rating: 8.1,
    year: 2024,
    genre: ["Mystery", "Drama", "Crime"],
    duration: "2h 8m",
    director: "David Fincher",
    cast: ["Scarlett Johansson", "Brad Pitt", "Morgan Freeman"],
    featured: true,
    popularity: 81
  },
  {
    title: "Space Odyssey 2024",
    poster: "/placeholder-vd1oy.png",
    backdrop: "/placeholder-z1x0n.png",
    overview: "Astronauts embark on a mission to establish the first human colony on Mars.",
    rating: 8.9,
    year: 2024,
    genre: ["Sci-Fi", "Adventure", "Drama"],
    duration: "2h 45m",
    director: "Denis Villeneuve",
    cast: ["Matthew McConaughey", "Jessica Chastain", "Matt Damon"],
    featured: true,
    popularity: 89
  }
];

async function seedMovies() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/moviemania');
    console.log('Connected to MongoDB');

    // Clear existing movies
    await Movie.deleteMany({});
    console.log('Cleared existing movies');

    // Insert new movies
    await Movie.insertMany(movies);
    console.log(`Seeded ${movies.length} movies successfully`);

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding movies:', error);
    process.exit(1);
  }
}

// Run the seed function
seedMovies();
