const IMAGE_BASE = "https://image.tmdb.org/t/p";
const FALLBACK_POSTER = "https://via.placeholder.com/400x600?text=No+Poster";
const FALLBACK_BACKDROP = "assets/featured-fallback.svg";

const CORE_GENRES = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 878, name: "Sci-Fi" }
];

function posterUrl(path, size = "w500") {
  if (!path) {
    return FALLBACK_POSTER;
  }
  if (typeof path === "string" && path.startsWith("http")) {
    return path;
  }
  return `${IMAGE_BASE}/${size}${path}`;
}

function backdropUrl(path, size = "w1280") {
  if (!path) {
    return FALLBACK_BACKDROP;
  }
  if (typeof path === "string" && path.startsWith("http")) {
    return path;
  }
  return `${IMAGE_BASE}/${size}${path}`;
}

function backdropOriginalUrl(path) {
  return path ? `https://image.tmdb.org/t/p/original/${path}` : FALLBACK_BACKDROP;
}

function getFeatureImageUrl(movie) {
  if (!movie) {
    return FALLBACK_BACKDROP;
  }
  if (movie.backdrop_path) {
    return backdropOriginalUrl(movie.backdrop_path);
  }
  if (movie.poster_path) {
    return backdropUrl(movie.poster_path, "w780");
  }
  return FALLBACK_BACKDROP;
}

function safeYear(dateString) {
  if (!dateString) {
    return "N/A";
  }
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }
  return date.getFullYear();
}

function ratingLabel(score) {
  if (typeof score !== "number") {
    return "N/A";
  }
  return `${score.toFixed(1)}/10`;
}

function renderWelcomeSlides(movies) {
  const track = document.getElementById("welcome-carousel-track");
  const dots = document.getElementById("welcome-carousel-dots");
  if (!track || !dots) {
    return;
  }

  if (!Array.isArray(movies) || movies.length === 0) {
    track.innerHTML = `
      <article class="welcome-slide">
        <div class="welcome-slide-art" style="background-image:url('${FALLBACK_BACKDROP}')">
          <div class="welcome-slide-caption">
            <p class="welcome-slide-title">Your next favorite movie is waiting</p>
            <p class="welcome-slide-sub">Discover live TMDB trends and recommendations.</p>
          </div>
        </div>
      </article>
    `;
    dots.innerHTML = '<button class="carousel-dot active" type="button" aria-label="Slide 1"></button>';
    app.carouselState.total = 1;
    app.carouselState.index = 0;
    return;
  }

  const selected = movies.slice(0, 6);

  track.innerHTML = selected
    .map((movie) => {
      const title = movie.title || movie.name || "Untitled";
      const imageUrl = getFeatureImageUrl(movie);
      return `
        <article class="welcome-slide">
          <div class="welcome-slide-art" style="background-image:url('${imageUrl}')">
            <div class="welcome-slide-caption">
              <p class="welcome-slide-title">${title}</p>
              <p class="welcome-slide-sub">${safeYear(movie.release_date)} · ${ratingLabel(movie.vote_average)}</p>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  dots.innerHTML = selected
    .map((_, index) => {
      const active = index === 0 ? " active" : "";
      return `<button class="carousel-dot${active}" type="button" aria-label="Slide ${index + 1}" onclick="goToWelcomeSlide(${index})"></button>`;
    })
    .join("");

  app.carouselState.total = selected.length;
  app.carouselState.index = 0;
}

function renderWelcomeSlidesLoading() {
  const track = document.getElementById("welcome-carousel-track");
  const dots = document.getElementById("welcome-carousel-dots");
  if (!track || !dots) {
    return;
  }

  track.innerHTML = `
    <article class="welcome-slide">
      <div class="welcome-slide-art" style="background-image:url('${FALLBACK_BACKDROP}')">
        <div class="welcome-slide-caption">
          <p class="welcome-slide-title">Loading featured feed...</p>
          <p class="welcome-slide-sub">Preparing cinematic picks for you.</p>
        </div>
      </div>
    </article>
  `;

  dots.innerHTML = '<button class="carousel-dot active" type="button" aria-label="Loading slide"></button>';
  app.carouselState.total = 1;
  app.carouselState.index = 0;
}

function updateWelcomeDots(index) {
  document.querySelectorAll(".carousel-dot").forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === index);
  });
}

function displayHeroBanner(movie) {
  const container = document.getElementById("hero-banner");
  if (!container || !movie) {
    return;
  }

  const title = movie.title || "Featured Movie";
  const overview = movie.overview || "No overview available for this movie.";

  container.innerHTML = `
    <div class="hero-backdrop" style="background-image:url('${backdropUrl(movie.backdrop_path)}')"></div>
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <div class="hero-poster">
        <img loading="lazy" src="${posterUrl(movie.poster_path, "w342")}" alt="${title}">
      </div>
      <div class="hero-text">
        <h1>${title}</h1>
        <div class="hero-meta">
          <span>${safeYear(movie.release_date)}</span>
          <span>${ratingLabel(movie.vote_average)}</span>
        </div>
        <p class="hero-overview">${overview}</p>
        <div class="hero-actions">
          <button class="btn-primary" type="button" onclick="showMovieModal(${movie.id})">View Details</button>
          <button class="btn-secondary" type="button" onclick="addMovieToWatchlist(${movie.id})">Add to Watchlist</button>
        </div>
      </div>
    </div>
  `;
}

function createMovieCard(movie) {
  const title = movie.title || "Untitled";
  return `
    <article class="movie-card" onclick="showMovieModal(${movie.id})">
      <div class="movie-poster-wrap">
        <img loading="lazy" class="movie-poster" src="${posterUrl(movie.poster_path, "w342")}" alt="${title}">
      </div>
      <div class="movie-body">
        <h3 class="movie-title">${title}</h3>
        <p class="movie-sub">${safeYear(movie.release_date)}</p>
        <span class="rating-pill">★ ${ratingLabel(movie.vote_average)}</span>
      </div>
    </article>
  `;
}

function createMovieStripCard(movie) {
  const title = movie.title || "Untitled";
  return `
    <article class="movie-strip-card" onclick="showMovieModal(${movie.id})">
      <img loading="lazy" src="${posterUrl(movie.poster_path, "w500")}" alt="${title}">
      <p>${title}</p>
    </article>
  `;
}

function renderMovieSection(sectionId, movies) {
  const section = document.getElementById(sectionId);
  if (!section) {
    return;
  }

  if (!Array.isArray(movies) || movies.length === 0) {
    renderSectionEmpty(sectionId, section.querySelector(".section-head h2")?.textContent || "Section");
    return;
  }

  const grid = `<div class="movies-grid">${movies.slice(0, 18).map(createMovieCard).join("")}</div>`;
  section.innerHTML = section.querySelector(".section-head")?.outerHTML || "";
  section.insertAdjacentHTML("beforeend", grid);
}

function renderSectionLoading(sectionId, title) {
  const section = document.getElementById(sectionId);
  if (!section) {
    return;
  }

  section.innerHTML = `
    <div class="section-head">
      <h2>${title}</h2>
    </div>
    <div class="skeleton-grid">
      ${Array.from({ length: 8 }).map(() => '<div class="skeleton-card"></div>').join("")}
    </div>
  `;
}

function renderSectionEmpty(sectionId, title) {
  const section = document.getElementById(sectionId);
  if (!section) {
    return;
  }

  section.innerHTML = `
    <div class="section-head">
      <h2>${title}</h2>
    </div>
    <div class="section-empty">
      <span>No movies found right now.</span>
      <button class="btn-secondary" type="button" onclick="loadHome()">Retry</button>
    </div>
  `;
}

function renderSuggestionStrip(sectionId, title, movies, note) {
  const section = document.getElementById(sectionId);
  if (!section) {
    return;
  }

  if (!Array.isArray(movies) || movies.length === 0) {
    renderSectionEmpty(sectionId, title);
    return;
  }

  section.innerHTML = `
    <div class="section-head">
      <h2>${title}</h2>
    </div>
    <p class="suggestion-note">${note}</p>
    <div class="movies-strip">
      ${movies.slice(0, 18).map(createMovieStripCard).join("")}
    </div>
  `;
}

async function renderGenreRows(fallbackMovies = []) {
  const container = document.getElementById("genre-rows");
  if (!container) {
    return;
  }

  container.innerHTML = "";

  const rows = await Promise.all(
    CORE_GENRES.map(async (genre) => {
      try {
        const movies = await API.getMoviesByGenre(genre.id, 1);
        return { ...genre, movies: Array.isArray(movies) ? movies.slice(0, 10) : [] };
      } catch (_error) {
        return { ...genre, movies: [] };
      }
    })
  );

  rows.forEach((row) => {
    if (!row.movies.length) {
      return;
    }

    container.insertAdjacentHTML(
      "beforeend",
      `
      <section class="genre-row">
        <h3 class="genre-row-title">${row.name}</h3>
        <div class="movies-grid">
          ${row.movies.map(createMovieCard).join("")}
        </div>
      </section>
    `
    );
  });

  if (!container.innerHTML.trim()) {
    if (!Array.isArray(fallbackMovies) || fallbackMovies.length === 0) {
      container.innerHTML = `
        <section class="genre-row">
          <h3 class="genre-row-title">Categories</h3>
          <div class="section-empty">
            <span>No movies found for selected categories.</span>
            <button class="btn-secondary" type="button" onclick="loadHome()">Retry</button>
          </div>
        </section>
      `;
      return;
    }

    container.innerHTML = `
      <section class="genre-row">
        <h3 class="genre-row-title">Trending globally</h3>
        <p class="suggestion-note">Category matches are limited, so here are popular picks.</p>
        <div class="movies-strip">
          ${fallbackMovies.slice(0, 18).map(createMovieStripCard).join("")}
        </div>
      </section>
    `;
  }
}

function displaySearchResults(movies, query) {
  const container = document.getElementById("search-results");
  const modal = document.getElementById("search-modal");
  if (!container || !modal) {
    return;
  }

  if (!Array.isArray(movies) || movies.length === 0) {
    container.innerHTML = `
      <div class="section-empty">
        <span>No results for "${query}".</span>
        <button class="btn-secondary" type="button" onclick="performSearch()">Retry</button>
      </div>
    `;
    modal.classList.add("active");
    return;
  }

  container.innerHTML = `
    <div class="movies-grid">
      ${movies.slice(0, 24).map(createMovieCard).join("")}
    </div>
  `;
  modal.classList.add("active");
}

function buildTrailerEmbed(videos) {
  if (!Array.isArray(videos)) {
    return "";
  }

  const trailer = videos.find((item) => item.type === "Trailer" && item.site === "YouTube");
  if (!trailer) {
    return "";
  }

  return `
    <div class="detail-trailer">
      <h3>Trailer</h3>
      <iframe width="100%" height="320" src="https://www.youtube.com/embed/${trailer.key}" title="Movie trailer" frameborder="0" allowfullscreen></iframe>
    </div>
  `;
}

function displayMovieModal(movie) {
  const modal = document.getElementById("movie-modal");
  const content = document.getElementById("movie-modal-content");
  if (!modal || !content || !movie) {
    return;
  }

  const title = movie.title || "Untitled";
  const genres = Array.isArray(movie.genres) && movie.genres.length ? movie.genres.map((g) => g.name).join(", ") : "N/A";
  const cast = Array.isArray(movie.credits?.cast) ? movie.credits.cast.slice(0, 5).map((actor) => actor.name).join(", ") : "N/A";
  const similar = Array.isArray(movie.recommendations?.results) ? movie.recommendations.results.slice(0, 6) : [];

  content.innerHTML = `
    <section class="detail-hero">
      <div class="detail-backdrop" style="background-image:url('${backdropUrl(movie.backdrop_path)}')"></div>
      <div class="detail-overlay"></div>
      <div class="detail-content">
        <div class="detail-poster">
          <img loading="lazy" src="${posterUrl(movie.poster_path, "w342")}" alt="${title}">
        </div>
        <div class="detail-text">
          <h2>${title}</h2>
          <div class="detail-meta">
            <span>${safeYear(movie.release_date)}</span>
            <span>${ratingLabel(movie.vote_average)}</span>
            <span>${movie.runtime ? `${movie.runtime} min` : "Runtime N/A"}</span>
          </div>
          <button class="btn-primary" type="button" onclick="addMovieToWatchlist(${movie.id})">Add to Watchlist</button>
        </div>
      </div>
    </section>

    <section class="detail-body">
      <p><strong>Genres:</strong> ${genres}</p>
      <p><strong>Overview:</strong> ${movie.overview || "No overview available."}</p>
      <p><strong>Cast:</strong> ${cast}</p>
      ${buildTrailerEmbed(movie.videos?.results || [])}

      ${
        similar.length
          ? `
            <h3>Similar Movies</h3>
            <div class="similar-grid">
              ${similar
                .map(
                  (item) => `
                    <article class="similar-card" onclick="showMovieModal(${item.id})">
                      <img loading="lazy" src="${posterUrl(item.poster_path, "w185")}" alt="${item.title || "Movie"}">
                      <p>${item.title || "Untitled"}</p>
                    </article>
                  `
                )
                .join("")}
            </div>
          `
          : ""
      }
    </section>
  `;

  modal.classList.add("active");
}
