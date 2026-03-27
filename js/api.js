const API = {
  baseUrl: (() => {
    if (window.location.protocol === "file:") {
      return "http://localhost:3000/api";
    }

    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    if (isLocal && window.location.port && window.location.port !== "3000") {
      return "http://localhost:3000/api";
    }
    return "/api";
  })(),

  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {})
        }
      });

      const contentType = response.headers.get("content-type") || "";
      const raw = await response.text();

      if (!contentType.includes("application/json")) {
        const snippet = raw.slice(0, 120).replace(/\s+/g, " ").trim();
        throw new Error(`API returned non-JSON response. ${snippet || "Check backend server at http://localhost:3000"}`);
      }

      let payload;
      try {
        payload = JSON.parse(raw);
      } catch (_parseError) {
        throw new Error("Invalid JSON received from API. Check backend logs and API routes.");
      }

      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || `Request failed (${response.status})`);
      }

      return payload.data;
    } catch (error) {
      if (error && /failed to fetch/i.test(String(error.message || ""))) {
        throw new Error("Cannot reach backend API. Start server with: cd backend && npm start");
      }
      throw new Error(error.message || "Network request failed");
    }
  },

  getHealth() {
    return this.request("/health");
  },

  getTrending(page = 1) {
    return this.request(`/movies/trending?page=${page}`);
  },

  getMoviefeedImages(page = 1) {
    return this.request(`/movies/moviefeed-images?page=${page}`);
  },

  getFeatured() {
    return this.request("/movies/featured");
  },

  getGenres() {
    return this.request("/genres");
  },

  searchMovies(query, page = 1) {
    const encoded = encodeURIComponent(query.trim());
    return this.request(`/movies/search?query=${encoded}&page=${page}`);
  },

  getMovieDetails(movieId) {
    return this.request(`/movies/${movieId}`);
  },

  getMoviesByGenre(genreId, page = 1) {
    return this.request(`/movies/by-genre/${genreId}?page=${page}`);
  },

  getRecommended(preferences = {}, page = 1) {
    const params = new URLSearchParams();
    const selectedLanguage = preferences.language
      || (Array.isArray(preferences.selectedLanguages) ? preferences.selectedLanguages[0] : null);

    if (selectedLanguage) {
      params.append("language", selectedLanguage);
    }
    if (preferences.genres && preferences.genres.length) {
      params.append("genres", preferences.genres.join(","));
    }
    params.append("page", String(page));
    return this.request(`/movies/recommended?${params.toString()}`);
  }
};

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  if (type === "error") {
    toast.style.background = "#ef4444";
    toast.style.color = "#fff";
  }
  document.body.appendChild(toast);
  window.setTimeout(() => {
    toast.remove();
  }, 2600);
}

function showError(message) {
  showToast(message, "error");
}

function showSuccess(message) {
  showToast(message, "success");
}
