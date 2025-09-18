# OMDb API Setup Guide

OMDb (Open Movie Database) API is a free, global movie database that works in all countries including India. It provides comprehensive movie information including ratings, cast, plot, and more.

## Step 1: Get OMDb API Key

1. Go to [OMDb API](http://www.omdbapi.com/)
2. Click "API Key" in the top navigation
3. Fill out the form:
   - **Name**: Your name
   - **Email**: Your email address
   - **Purpose**: Personal/Educational use
4. Click "Submit"
5. You'll receive your API key via email (usually within minutes)

## Step 2: Configure API Key

1. Open `/backend/.env` file
2. Replace `your-omdb-api-key-here` with your actual API key:
   ```
   OMDB_API_KEY=your_actual_api_key_here
   ```
3. Restart the backend server

## Step 3: Test the Integration

1. Make sure both frontend and backend are running
2. Visit http://localhost:3001
3. You should now see real movie data from OMDb

## Features Available with OMDb API

- **Real Movie Data**: Comprehensive movie database with accurate information
- **High-Quality Images**: Official movie posters
- **Detailed Information**: Plot, cast, director, ratings, awards, box office
- **Search Functionality**: Search by title, year, genre
- **IMDb Integration**: Direct links to IMDb pages
- **Global Access**: Works in all countries including India
- **Free Tier**: 1,000 requests per day (more than enough for personal use)

## API Limits

- **Free Tier**: 1,000 requests per day
- **No Rate Limiting**: No strict rate limits on free tier
- **Commercial Use**: Free for personal/educational use

## Sample API Response

```json
{
  "Title": "The Dark Knight",
  "Year": "2008",
  "Rated": "PG-13",
  "Released": "18 Jul 2008",
  "Runtime": "152 min",
  "Genre": "Action, Crime, Drama",
  "Director": "Christopher Nolan",
  "Writer": "Jonathan Nolan, Christopher Nolan",
  "Actors": "Christian Bale, Heath Ledger, Aaron Eckhart",
  "Plot": "When the menace known as the Joker wreaks havoc...",
  "Language": "English, Mandarin",
  "Country": "United States, United Kingdom",
  "Awards": "Won 2 Oscars. 163 wins & 163 nominations total",
  "Poster": "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg",
  "Ratings": [
    {
      "Source": "Internet Movie Database",
      "Value": "9.0/10"
    },
    {
      "Source": "Rotten Tomatoes",
      "Value": "94%"
    },
    {
      "Source": "Metacritic",
      "Value": "84/100"
    }
  ],
  "Metascore": "84",
  "imdbRating": "9.0",
  "imdbVotes": "2,847,000",
  "imdbID": "tt0468569",
  "Type": "movie",
  "DVD": "09 Dec 2008",
  "BoxOffice": "$534,987,076",
  "Production": "Warner Bros. Pictures",
  "Website": "N/A"
}
```

## Troubleshooting

### Common Issues

1. **"Failed to fetch data from OMDb API"**
   - Check if your API key is correct
   - Verify you've restarted the backend server
   - Check if you've exceeded the daily request limit

2. **"No movies found"**
   - Ensure your API key is valid
   - Check your internet connection
   - Verify the OMDb service is running

3. **Images not loading**
   - This is normal - OMDb images are served from their CDN
   - Check your internet connection
   - Some images might be missing for certain movies

### Getting Help

- [OMDb API Documentation](http://www.omdbapi.com/)
- [OMDb API Forum](http://www.omdbapi.com/forum/)

## Alternative: Use Without API Key

If you don't want to set up OMDb API, the app will still work with placeholder data, but you'll see limited movie information and placeholder images.

## Advantages of OMDb over TMDB

1. **Global Access**: Works in all countries including India
2. **No Blocking**: No regional restrictions
3. **Comprehensive Data**: Includes IMDb ratings, awards, box office
4. **Easy Setup**: Simple API key request process
5. **Reliable**: Stable and well-maintained service
6. **Free**: No cost for personal use

---

**Note**: The OMDb API is free for personal use. For commercial applications, you may need to contact OMDb for licensing.
