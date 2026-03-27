const app = {
  currentScreen: "welcome",
  currentOnboardingStep: 1,
  watchlist: [],
  profiles: [],
  editingProfileId: null,
  homeLoaded: false,
  carouselTimer: null,
  carouselState: {
    index: 0,
    total: 0,
    touchStartX: 0,
    touchEndX: 0
  },
  preferences: {
    selectedLanguages: [],
    ageRating: null,
    genres: [],
    ottPlatforms: []
  },

  init() {
    this.loadPreferences();
    this.loadProfiles();
    this.loadWatchlist();
    this.initTheme();
    this.bindGlobalEvents();
    this.restoreOnboardingUI();
    this.initWelcomeCarousel();
  },

  bindGlobalEvents() {
    const themeToggle = document.getElementById("themeToggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", () => this.toggleTheme());
    }

    document.querySelectorAll(".onboarding-step .option-card").forEach((button) => {
      button.addEventListener("click", () => {
        const stepEl = button.closest(".onboarding-step");
        if (!stepEl) {
          return;
        }
        const step = Number(stepEl.getAttribute("data-step"));
        this.selectOnboarding(step, button);
      });
    });

    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
          performSearch();
        }
      });
    }

    const viewport = document.getElementById("welcome-carousel-viewport");
    if (viewport) {
      viewport.addEventListener("touchstart", (event) => {
        this.carouselState.touchStartX = event.changedTouches[0].clientX;
      });

      viewport.addEventListener("touchend", (event) => {
        this.carouselState.touchEndX = event.changedTouches[0].clientX;
        const delta = this.carouselState.touchStartX - this.carouselState.touchEndX;
        if (Math.abs(delta) > 45) {
          if (delta > 0) {
            nextWelcomeSlide();
          } else {
            prevWelcomeSlide();
          }
        }
      });

      viewport.addEventListener("mouseenter", () => {
        this.stopCarousel();
      });

      viewport.addEventListener("mouseleave", () => {
        this.startCarousel();
      });
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMovieModal();
        closeSearchModal();
        this.closeWatchlist();
      }
    });
  },

  initTheme() {
    const preferred = localStorage.getItem("cinemaflow-theme");
    const fallback = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    this.applyTheme(preferred || fallback);
  },

  toggleTheme() {
    const nextTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
    this.applyTheme(nextTheme);
  },

  applyTheme(mode) {
    const dark = mode === "dark";
    document.body.classList.toggle("dark-mode", dark);
    localStorage.setItem("cinemaflow-theme", mode);

    const label = document.getElementById("themeLabel");
    const button = document.getElementById("themeToggle");
    if (label) {
      label.textContent = dark ? "Dark" : "Light";
    }
    if (button) {
      button.setAttribute("aria-pressed", String(dark));
    }
  },

  loadPreferences() {
    const raw = localStorage.getItem("cinemaflow-preferences");
    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      const selectedLanguages = Array.isArray(parsed.selectedLanguages)
        ? parsed.selectedLanguages
        : (parsed.language ? [parsed.language] : []);

      this.preferences = {
        ...this.preferences,
        ...parsed,
        selectedLanguages,
        genres: Array.isArray(parsed.genres) ? parsed.genres : [],
        ottPlatforms: Array.isArray(parsed.ottPlatforms) ? parsed.ottPlatforms : []
      };
    } catch (_error) {
      this.preferences = {
        selectedLanguages: [],
        ageRating: null,
        genres: [],
        ottPlatforms: []
      };
    }
  },

  loadProfiles() {
    const raw = localStorage.getItem("cinemaflow-profiles");
    if (!raw) {
      this.profiles = [];
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      this.profiles = Array.isArray(parsed) ? parsed.slice(0, 4) : [];
    } catch (_error) {
      this.profiles = [];
    }
  },

  saveProfiles() {
    localStorage.setItem("cinemaflow-profiles", JSON.stringify(this.profiles.slice(0, 4)));
  },

  savePreferences() {
    localStorage.setItem("cinemaflow-preferences", JSON.stringify(this.preferences));
  },

  loadWatchlist() {
    const raw = localStorage.getItem("cinemaflow-watchlist");
    if (!raw) {
      this.watchlist = [];
      return;
    }
    try {
      this.watchlist = JSON.parse(raw);
    } catch (_error) {
      this.watchlist = [];
    }
    this.renderWatchlist();
  },

  saveWatchlist() {
    localStorage.setItem("cinemaflow-watchlist", JSON.stringify(this.watchlist));
  },

  addToWatchlist(movie) {
    if (!movie || !movie.id) {
      return false;
    }

    if (this.watchlist.find((entry) => entry.id === movie.id)) {
      return false;
    }

    this.watchlist.push(movie);
    this.saveWatchlist();
    this.renderWatchlist();
    return true;
  },

  removeFromWatchlist(movieId) {
    this.watchlist = this.watchlist.filter((movie) => movie.id !== movieId);
    this.saveWatchlist();
    this.renderWatchlist();
  },

  renderWatchlist() {
    const container = document.getElementById("watchlist-items");
    if (!container) {
      return;
    }

    if (!this.watchlist.length) {
      container.innerHTML = '<p class="empty-state">Your watchlist is empty</p>';
      return;
    }

    container.innerHTML = this.watchlist
      .map((movie) => {
        const year = movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A";
        const image = movie.poster_path ? `https://image.tmdb.org/t/p/w185${movie.poster_path}` : "https://via.placeholder.com/60x90?text=NA";
        return `
          <article class="watchlist-item" onclick="showMovieModal(${movie.id})">
            <img loading="lazy" src="${image}" alt="${movie.title || "Movie"}">
            <div>
              <p class="watchlist-title">${movie.title || "Untitled"}</p>
              <p class="watchlist-year">${year}</p>
            </div>
          </article>
        `;
      })
      .join("");
  },

  closeWatchlist() {
    const sidebar = document.getElementById("watchlist-sidebar");
    if (sidebar) {
      sidebar.classList.remove("active");
    }
  },

  restoreOnboardingUI() {
    this.updateProgressUI();
    document.querySelectorAll('.onboarding-step[data-step="1"] .option-card').forEach((button) => {
      button.classList.toggle("selected", this.preferences.selectedLanguages.includes(button.dataset.value));
    });

    document.querySelectorAll('.onboarding-step[data-step="2"] .option-card').forEach((button) => {
      button.classList.toggle("selected", button.dataset.value === this.preferences.ageRating);
    });

    document.querySelectorAll('.onboarding-step[data-step="3"] .option-card').forEach((button) => {
      button.classList.toggle("selected", this.preferences.genres.includes(button.dataset.value));
    });

    document.querySelectorAll('.onboarding-step[data-step="4"] .option-card').forEach((button) => {
      button.classList.toggle("selected", this.preferences.ottPlatforms.includes(button.dataset.value));
    });
  },

  selectOnboarding(step, button) {
    const group = button.closest(".options-grid");
    if (!group) {
      return;
    }

    const isMulti = group.classList.contains("multiselect");

    if (!isMulti) {
      group.querySelectorAll(".option-card").forEach((entry) => entry.classList.remove("selected"));
      button.classList.add("selected");
    } else {
      button.classList.toggle("selected");
    }

    if (step === 1) {
      this.preferences.selectedLanguages = Array.from(group.querySelectorAll(".option-card.selected")).map((entry) => entry.dataset.value);
    } else if (step === 2) {
      this.preferences.ageRating = button.dataset.value;
    } else if (step === 3) {
      this.preferences.genres = Array.from(group.querySelectorAll(".option-card.selected")).map((entry) => entry.dataset.value);
    } else if (step === 4) {
      this.preferences.ottPlatforms = Array.from(group.querySelectorAll(".option-card.selected")).map((entry) => entry.dataset.value);
    }

    this.savePreferences();
  },

  validateStep(step) {
    if (step === 1 && this.preferences.selectedLanguages.length === 0) {
      showError("Please select at least one language.");
      return false;
    }
    if (step === 2 && !this.preferences.ageRating) {
      showError("Please select an age rating.");
      return false;
    }
    if (step === 3 && this.preferences.genres.length === 0) {
      showError("Please select at least one genre.");
      return false;
    }
    if (step === 4 && this.preferences.ottPlatforms.length === 0) {
      showError("Please select at least one OTT platform.");
      return false;
    }
    return true;
  },

  updateProgressUI() {
    const steps = document.querySelectorAll(".progress-indicator .step");
    const onboardingSteps = document.querySelectorAll(".onboarding-step");

    steps.forEach((entry, index) => {
      entry.classList.toggle("active", index + 1 === this.currentOnboardingStep);
    });

    onboardingSteps.forEach((entry, index) => {
      entry.classList.toggle("active", index + 1 === this.currentOnboardingStep);
    });

    const next = document.getElementById("onboarding-next-btn");
    if (next) {
      if (this.currentOnboardingStep === 4) {
        next.textContent = this.editingProfileId ? "Save Profile & Explore" : "Start Exploring";
      } else {
        next.textContent = "Next";
      }
    }
  },

  renderProfileList() {
    const list = document.getElementById("profile-list");
    if (!list) {
      return;
    }

    if (!this.profiles.length) {
      list.innerHTML = '<div class="profile-empty">No saved profiles yet. Save your current preferences to create one.</div>';
      return;
    }

    list.innerHTML = this.profiles
      .map((profile) => {
        const prefs = profile.preferences || {};
        const languages = Array.isArray(prefs.selectedLanguages) ? prefs.selectedLanguages.join(", ") : "None";
        const genres = Array.isArray(prefs.genres) ? prefs.genres.join(", ") : "None";
        const ott = Array.isArray(prefs.ottPlatforms) ? prefs.ottPlatforms.join(", ") : "None";
        return `
          <article class="profile-card">
            <h4>${profile.name}</h4>
            <p class="profile-meta">Languages: ${languages}<br>Age: ${prefs.ageRating || "None"}<br>Genres: ${genres}<br>OTT: ${ott}</p>
            <div class="profile-card-actions">
              <button class="btn-secondary" type="button" onclick="applySavedProfile('${profile.id}')">Apply</button>
              <button class="btn-secondary" type="button" onclick="editSavedProfile('${profile.id}')">Edit</button>
              <button class="btn-secondary" type="button" onclick="deleteSavedProfile('${profile.id}')">Delete</button>
            </div>
          </article>
        `;
      })
      .join("");
  },

  saveCurrentProfile() {
    const existing = this.profiles.length;
    if (existing >= 4) {
      showError("You can save up to 4 profiles. Delete one to add another.");
      return;
    }

    const name = window.prompt("Profile name", `Profile ${existing + 1}`);
    if (!name) {
      return;
    }

    const profile = {
      id: String(Date.now()),
      name: name.trim().slice(0, 32) || `Profile ${existing + 1}`,
      preferences: {
        selectedLanguages: [...this.preferences.selectedLanguages],
        ageRating: this.preferences.ageRating,
        genres: [...this.preferences.genres],
        ottPlatforms: [...this.preferences.ottPlatforms]
      }
    };

    this.profiles.push(profile);
    this.saveProfiles();
    this.renderProfileList();
    showSuccess("Profile saved");
  },

  applyProfile(profileId) {
    const profile = this.profiles.find((entry) => entry.id === profileId);
    if (!profile) {
      return;
    }

    const prefs = profile.preferences || {};
    this.preferences = {
      selectedLanguages: Array.isArray(prefs.selectedLanguages) ? prefs.selectedLanguages : [],
      ageRating: prefs.ageRating || null,
      genres: Array.isArray(prefs.genres) ? prefs.genres : [],
      ottPlatforms: Array.isArray(prefs.ottPlatforms) ? prefs.ottPlatforms : []
    };

    this.savePreferences();
    this.restoreOnboardingUI();
    goToScreen("app");
    showSuccess(`Applied profile: ${profile.name}`);
  },

  editProfile(profileId) {
    const profile = this.profiles.find((entry) => entry.id === profileId);
    if (!profile) {
      return;
    }

    const prefs = profile.preferences || {};
    this.preferences = {
      selectedLanguages: Array.isArray(prefs.selectedLanguages) ? prefs.selectedLanguages : [],
      ageRating: prefs.ageRating || null,
      genres: Array.isArray(prefs.genres) ? prefs.genres : [],
      ottPlatforms: Array.isArray(prefs.ottPlatforms) ? prefs.ottPlatforms : []
    };

    this.editingProfileId = profileId;
    this.currentOnboardingStep = 1;
    this.savePreferences();
    this.restoreOnboardingUI();
    goToScreen("onboarding");
  },

  deleteProfile(profileId) {
    const profile = this.profiles.find((entry) => entry.id === profileId);
    if (!profile) {
      return;
    }

    this.profiles = this.profiles.filter((entry) => entry.id !== profileId);
    this.saveProfiles();
    this.renderProfileList();
    showSuccess(`Deleted profile: ${profile.name}`);
  },

  async initWelcomeCarousel() {
    renderWelcomeSlidesLoading();

    try {
      const feed = await API.getMoviefeedImages(1);
      let slides = Array.isArray(feed) ? feed.filter((movie) => movie && (movie.backdrop_path || movie.poster_path)) : [];

      if (!slides.length) {
        const trending = await API.getTrending(1);
        slides = Array.isArray(trending) ? trending.filter((movie) => movie && (movie.backdrop_path || movie.poster_path)) : [];
      }

      if (!slides.length) {
        const featured = await API.getFeatured();
        slides = featured ? [featured] : [];
      }

      renderWelcomeSlides(slides);
      this.attachCarouselDots();
      this.startCarousel();
    } catch (_error) {
      renderWelcomeSlides([]);
      this.attachCarouselDots();
    }
  },

  attachCarouselDots() {
    updateWelcomeDots(this.carouselState.index);
  },

  startCarousel() {
    this.stopCarousel();
    if (this.carouselState.total <= 1) {
      return;
    }
    this.carouselTimer = window.setInterval(() => {
      nextWelcomeSlide();
    }, 3200);
  },

  stopCarousel() {
    if (this.carouselTimer) {
      window.clearInterval(this.carouselTimer);
      this.carouselTimer = null;
    }
  },

  goToCarouselSlide(index) {
    if (this.carouselState.total === 0) {
      return;
    }

    const track = document.getElementById("welcome-carousel-track");
    if (!track) {
      return;
    }

    const normalized = ((index % this.carouselState.total) + this.carouselState.total) % this.carouselState.total;
    this.carouselState.index = normalized;
    track.style.transform = `translateX(-${normalized * 100}%)`;
    updateWelcomeDots(normalized);
  }
};

async function loadHome() {
  const hero = document.getElementById("hero-banner");
  if (hero) {
    hero.innerHTML = `
      <div class="hero-skeleton"></div>
      <div class="hero-placeholder-copy">
        <h2>Featured spotlight loading...</h2>
        <p>Fetching today's top cinematic picks for your dashboard.</p>
        <div class="hero-placeholder-actions">
          <button class="btn-primary" type="button" disabled>Play</button>
          <button class="btn-secondary" type="button" disabled>Details</button>
        </div>
      </div>
    `;
  }

  renderSectionLoading("trending-section", "Trending Now");
  renderSectionLoading("recommended-section", "Recommended for You");

  const [featuredRes, trendingRes, recommendedRes] = await Promise.allSettled([
    API.getFeatured(),
    API.getTrending(1),
    getRecommendedForLanguages(app.preferences)
  ]);

  if (featuredRes.status === "fulfilled" && featuredRes.value) {
    displayHeroBanner(featuredRes.value);
  }

  if (trendingRes.status === "fulfilled") {
    renderMovieSection("trending-section", trendingRes.value);
  } else {
    renderSectionEmpty("trending-section", "Trending Now");
  }

  if (recommendedRes.status === "fulfilled") {
    const list = Array.isArray(recommendedRes.value) ? recommendedRes.value : [];
    if (list.length >= 6) {
      renderMovieSection("recommended-section", list);
    } else {
      const fallback = trendingRes.status === "fulfilled" ? trendingRes.value : [];
      renderSuggestionStrip(
        "recommended-section",
        "Recommended for You",
        fallback,
        "Few exact matches found. Broadened with trending globally."
      );
    }
  } else {
    const fallback = trendingRes.status === "fulfilled" ? trendingRes.value : [];
    renderSuggestionStrip(
      "recommended-section",
      "Recommended for You",
      fallback,
      "Could not load exact recommendations. Showing trending globally."
    );
  }

  const genreFallback = trendingRes.status === "fulfilled" ? trendingRes.value : [];
  await renderGenreRows(genreFallback);

  if (featuredRes.status === "rejected" || trendingRes.status === "rejected" || recommendedRes.status === "rejected") {
    showError("Some sections could not be loaded. Please retry.");
  }

  app.homeLoaded = true;
}

function goToScreen(name) {
  document.querySelectorAll("screen").forEach((screen) => {
    screen.classList.remove("active");
  });

  const target = document.getElementById(`${name}-screen`);
  if (!target) {
    return;
  }

  target.classList.add("active");
  app.currentScreen = name;

  if (name === "onboarding") {
    app.currentOnboardingStep = 1;
    app.updateProgressUI();
    app.restoreOnboardingUI();
  }

  if (name === "app") {
    loadHome();
  }

  if (name === "profile") {
    app.renderProfileList();
  }
}

function nextOnboardingStep() {
  const current = app.currentOnboardingStep;
  if (!app.validateStep(current)) {
    return;
  }

  if (current < 4) {
    app.currentOnboardingStep += 1;
    app.updateProgressUI();
    return;
  }

  app.savePreferences();

  if (app.editingProfileId) {
    const index = app.profiles.findIndex((entry) => entry.id === app.editingProfileId);
    if (index >= 0) {
      app.profiles[index].preferences = {
        selectedLanguages: [...app.preferences.selectedLanguages],
        ageRating: app.preferences.ageRating,
        genres: [...app.preferences.genres],
        ottPlatforms: [...app.preferences.ottPlatforms]
      };
      app.saveProfiles();
      showSuccess("Profile updated");
    }
    app.editingProfileId = null;
  }

  goToScreen("app");
}

function prevOnboardingStep() {
  if (app.currentOnboardingStep <= 1) {
    return;
  }
  app.currentOnboardingStep -= 1;
  app.updateProgressUI();
}

async function performSearch() {
  const input = document.getElementById("search-input");
  if (!input) {
    return;
  }

  const query = input.value.trim();
  if (query.length < 2) {
    showError("Type at least 2 characters to search.");
    return;
  }

  try {
    const result = await API.searchMovies(query, 1);
    displaySearchResults(result, query);
  } catch (error) {
    showError(error.message || "Search failed.");
  }
}

function closeSearchModal() {
  const modal = document.getElementById("search-modal");
  if (modal) {
    modal.classList.remove("active");
  }
}

function closeMovieModal() {
  const modal = document.getElementById("movie-modal");
  if (modal) {
    modal.classList.remove("active");
  }
}

async function showMovieModal(movieId) {
  try {
    const movie = await API.getMovieDetails(movieId);
    displayMovieModal(movie);
  } catch (error) {
    showError(error.message || "Unable to open movie details.");
  }
}

async function addMovieToWatchlist(movieId) {
  try {
    const movie = await API.getMovieDetails(movieId);
    const added = app.addToWatchlist(movie);
    if (added) {
      showSuccess("Added to watchlist");
    } else {
      showError("Movie is already in watchlist");
    }
  } catch (error) {
    showError(error.message || "Could not add movie to watchlist.");
  }
}

function toggleWatchlist() {
  const sidebar = document.getElementById("watchlist-sidebar");
  if (!sidebar) {
    return;
  }
  sidebar.classList.toggle("active");
}

function goToWelcomeSlide(index) {
  app.goToCarouselSlide(index);
}

function prevWelcomeSlide() {
  app.goToCarouselSlide(app.carouselState.index - 1);
}

function nextWelcomeSlide() {
  app.goToCarouselSlide(app.carouselState.index + 1);
}

async function getRecommendedForLanguages(preferences) {
  const selected = Array.isArray(preferences.selectedLanguages) ? preferences.selectedLanguages.slice(0, 3) : [];
  const languages = selected.length ? selected : ["en"];

  const lists = await Promise.all(
    languages.map((language) =>
      API.getRecommended({ ...preferences, language }, 1).catch(() => [])
    )
  );

  const unique = [];
  const seen = new Set();

  lists.flat().forEach((movie) => {
    if (!movie || !movie.id || seen.has(movie.id)) {
      return;
    }
    seen.add(movie.id);
    unique.push(movie);
  });

  return unique;
}

function saveCurrentProfile() {
  app.saveCurrentProfile();
}

function applySavedProfile(profileId) {
  app.applyProfile(profileId);
}

function editSavedProfile(profileId) {
  app.editProfile(profileId);
}

function deleteSavedProfile(profileId) {
  app.deleteProfile(profileId);
}

document.addEventListener("DOMContentLoaded", () => {
  app.init();
});
