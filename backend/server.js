const express = require("express");
const cors = require("cors");
const path = require("path");
const axios = require("axios");
require("dotenv").config();

const app = express();

const PORT = Number(process.env.PORT || 3000);
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  timeout: 15000
});

function ensureTmdbConfigured(res) {
  if (!TMDB_API_KEY || TMDB_API_KEY === "YOUR_API_KEY_HERE") {
    res.status(500).json({
      success: false,
      message: "TMDB API key is missing. Update backend/.env with TMDB_API_KEY."
    });
    return false;
  }
  return true;
}

async function tmdbGet(endpoint, params = {}) {
  const response = await tmdbClient.get(endpoint, {
    params: {
      api_key: TMDB_API_KEY,
      language: "en-US",
      ...params
    }
  });

  if (!response.data) {
    throw new Error("TMDB request failed");
  }

  return response.data;
}

function buildImage(pathValue) {
  return pathValue || null;
}

function normalizeMovie(item) {
  return {
    id: item.id,
    title: item.title,
    release_date: item.release_date,
    vote_average: item.vote_average,
    overview: item.overview || "No overview available.",
    poster_path: buildImage(item.poster_path),
    backdrop_path: buildImage(item.backdrop_path),
    genre_ids: Array.isArray(item.genre_ids) ? item.genre_ids : []
  };
}

function normalizeDetailMovie(item) {
  return {
    id: item.id,
    title: item.title,
    release_date: item.release_date,
    vote_average: item.vote_average,
    overview: item.overview || "No overview available.",
    poster_path: buildImage(item.poster_path),
    backdrop_path: buildImage(item.backdrop_path),
    genre_ids: Array.isArray(item.genres) ? item.genres.map((entry) => entry.id) : (item.genre_ids || []),
    genres: item.genres || [],
    runtime: item.runtime || null,
    credits: {
      cast: (item.credits && item.credits.cast) || [],
      crew: (item.credits && item.credits.crew) || []
    },
    videos: {
      results: (item.videos && item.videos.results) || []
    },
    recommendations: {
      results: ((item.recommendations && item.recommendations.results) || []).map(normalizeMovie)
    }
  };
}

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    data: {
      status: "ok",
      provider: "tmdb",
      timestamp: new Date().toISOString()
    }
  });
});

app.get("/api/movies/trending", async (req, res) => {
  if (!ensureTmdbConfigured(res)) {
    return;
  }

  try {
    const page = Number(req.query.page || 1);
    const data = await tmdbGet("/trending/movie/week", { page });
    res.json({ success: true, data: (data.results || []).map(normalizeMovie) });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch trending movies from TMDB." });
  }
});

app.get("/api/movies/moviefeed-images", async (req, res) => {
  if (!ensureTmdbConfigured(res)) {
    return;
  }

  try {
    const page = Number(req.query.page || 1);
    const [popular, nowPlaying] = await Promise.all([
      tmdbGet("/movie/popular", { page }),
      tmdbGet("/movie/now_playing", { page })
    ]);

    const merged = [...(nowPlaying.results || []), ...(popular.results || [])]
      .map(normalizeMovie)
      .filter((movie) => movie.backdrop_path || movie.poster_path);

    const unique = [];
    const seen = new Set();
    for (const movie of merged) {
      if (seen.has(movie.id)) {
        continue;
      }
      seen.add(movie.id);
      unique.push(movie);
      if (unique.length >= 18) {
        break;
      }
    }

    res.json({ success: true, data: unique });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch movie feed images from TMDB." });
  }
});

app.get("/api/movies/featured", async (_req, res) => {
  if (!ensureTmdbConfigured(res)) {
    return;
  }

  try {
    const nowPlaying = await tmdbGet("/movie/now_playing", { page: 1 });
    const pool = (nowPlaying.results || []).map(normalizeMovie);
    const selected = pool[Math.floor(Math.random() * pool.length)] || pool[0] || null;

    if (!selected) {
      return res.json({ success: true, data: null });
    }

    const full = await tmdbGet(`/movie/${selected.id}`, {
      append_to_response: "credits,videos,recommendations"
    });
    res.json({ success: true, data: normalizeDetailMovie(full) });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch featured movie from TMDB." });
  }
});

app.get("/api/movies/search", async (req, res) => {
  if (!ensureTmdbConfigured(res)) {
    return;
  }

  try {
    const query = String(req.query.query || "").trim();
    const page = Number(req.query.page || 1);

    if (query.length < 2) {
      return res.status(400).json({ success: false, message: "Query must be at least 2 characters." });
    }

    const data = await tmdbGet("/search/movie", { query, page, include_adult: false });
    res.json({ success: true, data: (data.results || []).map(normalizeMovie) });
  } catch (error) {
    res.status(500).json({ success: false, message: "Search failed on TMDB." });
  }
});

app.get("/api/movies/by-genre/:genreId", async (req, res) => {
  if (!ensureTmdbConfigured(res)) {
    return;
  }

  try {
    const genreId = Number(req.params.genreId);
    const page = Number(req.query.page || 1);
    const data = await tmdbGet("/discover/movie", {
      page,
      with_genres: genreId,
      sort_by: "popularity.desc",
      include_adult: false
    });
    res.json({ success: true, data: (data.results || []).map(normalizeMovie) });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch genre movies from TMDB." });
  }
});

app.get("/api/movies/recommended", async (req, res) => {
  if (!ensureTmdbConfigured(res)) {
    return;
  }

  try {
    const page = Number(req.query.page || 1);
    const language = String(req.query.language || "").trim();
    const genres = String(req.query.genres || "").trim();

    const params = {
      page,
      sort_by: "popularity.desc",
      include_adult: false,
      include_video: false,
      vote_count_gte: 100
    };

    if (genres) {
      params.with_genres = genres;
    }

    if (language) {
      params.with_original_language = language;
    }

    const data = await tmdbGet("/discover/movie", params);
    res.json({ success: true, data: (data.results || []).map(normalizeMovie) });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch recommendations from TMDB." });
  }
});

app.get("/api/movies/:movieId", async (req, res) => {
  if (!ensureTmdbConfigured(res)) {
    return;
  }

  try {
    const movieId = Number(req.params.movieId);
    const detail = await tmdbGet(`/movie/${movieId}`, {
      append_to_response: "credits,videos,recommendations"
    });
    res.json({ success: true, data: normalizeDetailMovie(detail) });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch movie details from TMDB." });
  }
});

app.get("/api/genres", async (_req, res) => {
  if (!ensureTmdbConfigured(res)) {
    return;
  }

  try {
    const data = await tmdbGet("/genre/movie/list");
    res.json({ success: true, data: data.genres || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch genres." });
  }
});

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.use("*", (_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  if (!TMDB_API_KEY || TMDB_API_KEY === "YOUR_API_KEY_HERE") {
    console.log("TMDB key missing. Add TMDB_API_KEY to backend/.env");
  } else {
    console.log("TMDB API is configured");
  }
});
