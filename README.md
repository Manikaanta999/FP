# CinemaFlow

Premium movie discovery web app inspired by modern streaming and review platforms, with a polished onboarding flow, immersive welcome experience, and real TMDB API integration.

## Stack
- Frontend: HTML, CSS, Vanilla JavaScript
- Backend: Node.js + Express
- External API: TMDB
- Database prep (future): MongoDB schemas included

## Core Experience
- Welcome screen with cinematic auto-carousel
- Desktop split layout: carousel + onboarding CTA
- Mobile full-width carousel with touch swipe
- Light theme: yellow + white
- Dark theme: yellow + black
- Step-based onboarding with progress indicator
- Main app sections: featured hero, trending, recommended, and genre rows
- Movie detail modal with cast, runtime, overview, trailer, similar movies
- Search modal with live API-driven results
- Watchlist persisted in localStorage

## Project Structure

```text
FP/
  backend/
    server.js
    package.json
    .env
    .env.example
    models/
      Movie.js
      UserPreference.js
      MovieCache.js
  frontend/
    index.html
    css/
      modern-styles.css
      styles.css
    js/
      api.js
      movies.js
      app.js
```

## API Endpoints
- GET /api/health
- GET /api/movies/trending?page=1
- GET /api/movies/moviefeed-images?page=1
- GET /api/movies/featured
- GET /api/movies/search?query=inception&page=1
- GET /api/movies/by-genre/:genreId?page=1
- GET /api/movies/recommended?language=en&genres=28,35&page=1
- GET /api/movies/:movieId
- GET /api/genres

## Setup

1. Install backend dependencies

```bash
cd backend
npm install
```

2. Configure environment

Create or edit backend/.env:

```env
PORT=3000
NODE_ENV=development
TMDB_API_KEY=YOUR_API_KEY_HERE
MONGODB_URI=mongodb://localhost:27017/cinemaflow
```

3. Start server

```bash
npm start
```

4. Open app

http://localhost:3000

## TMDB Key
1. Open https://www.themoviedb.org/settings/api
2. Generate or copy your API key
3. Paste into backend/.env as TMDB_API_KEY

## Notes
- Movie data is fetched from TMDB in real time.
- MongoDB models are prepared for future user preferences and caching, but not required for current run mode.
- If TMDB key is missing, backend returns clear API configuration errors.

## Deploy To Internet (Render)
1. Push this repository to GitHub.
2. In Render, click New > Blueprint.
3. Select this repository (it uses render.yaml in project root).
4. Set environment variable TMDB_API_KEY in Render dashboard.
5. Deploy and open your public URL.

Important:
- Do not commit your real TMDB key into source control.
- Keep backend/.env for local development only.
