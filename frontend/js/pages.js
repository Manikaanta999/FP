// Navigation between pages
function goToPage(pageNumber) {
  // Validate page number
  if (pageNumber < 1 || pageNumber > 5) return;

  // For results page, validate selections and fetch movies
  if (pageNumber === 5) {
    if (!userSelections.language) {
      alert('Please select a language');
      return;
    }
    if (!userSelections.age) {
      alert('Please select an age rating');
      return;
    }
    if (!userSelections.genre) {
      alert('Please select a genre');
      return;
    }
    if (!userSelections.ott) {
      alert('Please select a streaming platform');
      return;
    }

    // Show loading and fetch movies
    showLoading();
    fetchMovies();
  }

  // Update current page
  currentPage = pageNumber;

  // Hide all pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });

  // Show target page with animation
  const targetPage = document.getElementById(`page-language${pageNumber === 1 ? '' : pageNumber === 2 ? '' : ''}`);
  const pageId = `page-${getPageName(pageNumber)}`;
  const page = document.getElementById(pageId);
  
  if (page) {
    page.classList.add('active');
    // Scroll to top
    window.scrollTo(0, 0);
  }
}

// Get page name by number
function getPageName(pageNumber) {
  const pageNames = ['', 'language', 'age', 'genre', 'ott', 'results'];
  return pageNames[pageNumber] || 'language';
}

// Show loading state
function showLoading() {
  const loading = document.getElementById('loading');
  const resultsContainer = document.getElementById('results-container');
  const noResults = document.getElementById('no-results');

  loading.style.display = 'flex';
  resultsContainer.innerHTML = '';
  noResults.style.display = 'none';
}

// Fetch movies from API
async function fetchMovies() {
  try {
    const params = new URLSearchParams({
      language: userSelections.language,
      age: userSelections.age,
      genre: userSelections.genre,
      ott: userSelections.ott
    });

    const response = await fetch(`/api/movies/filter?${params}`);
    const data = await response.json();

    // Hide loading
    document.getElementById('loading').style.display = 'none';

    if (data.success && data.data && data.data.length > 0) {
      displayMovies(data.data);
    } else {
      showNoResults();
    }
  } catch (error) {
    console.error('Error fetching movies:', error);
    document.getElementById('loading').style.display = 'none';
    showNoResults();
  }
}

// Display movies in results
function displayMovies(movies) {
  const container = document.getElementById('results-container');
  container.innerHTML = '';

  movies.forEach((movie, index) => {
    const card = createMovieCard(movie);
    container.appendChild(card);
    
    // Stagger animation
    setTimeout(() => {
      card.style.animation = 'fadeIn 0.5s ease-out forwards';
    }, index * 100);
  });
}

// Create movie card element
function createMovieCard(movie) {
  const card = document.createElement('div');
  card.className = 'movie-card';

  const ratingStars = formatRating(movie.rating);

  card.innerHTML = `
    <div class="movie-poster">
      <div class="movie-poster-placeholder">🎬</div>
    </div>
    <div class="movie-info">
      <h3 class="movie-title">${movie.title}</h3>
      <div class="movie-rating">
        <span class="rating-stars">${ratingStars}</span>
      </div>
      <div class="movie-meta">
        <span class="meta-badge">${movie.language}</span>
        <span class="meta-badge">${movie.age}</span>
        <span class="meta-badge">${movie.genre}</span>
        <span class="meta-badge">${movie.ott}</span>
      </div>
      <p class="movie-plot">${movie.plot}</p>
      <div class="movie-links">
        <button class="movie-link" onclick="openMovieTrailer('${movie.trailer}')">Trailer</button>
        <button class="movie-link" onclick="openMovieDetails('${movie._id}', '${movie.title}', '${movie.plot}', ${movie.rating}, '${movie.detailsLink}')">Details</button>
      </div>
    </div>
  `;

  return card;
}

// Open movie trailer
function openMovieTrailer(trailerUrl) {
  const content = `
    <div style="aspect-ratio: 16/9; margin-bottom: 1rem;">
      <iframe 
        width="100%" 
        height="100%" 
        src="${trailerUrl.replace('watch?v=', 'embed/')}" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
      </iframe>
    </div>
  `;
  openModal('Movie Trailer', content);
}

// Open movie details
function openMovieDetails(movieId, title, plot, rating, detailsLink) {
  const ratingStars = formatRating(rating);
  const content = `
    <div style="margin-bottom: 1.5rem;">
      <div style="margin-bottom: 1rem;">
        <strong>Rating:</strong> ${ratingStars}
      </div>
      <div style="margin-bottom: 1rem;">
        <strong>Plot:</strong>
        <p style="margin-top: 0.5rem; line-height: 1.6; opacity: 0.8;">${plot}</p>
      </div>
      <div style="margin-bottom: 1rem;">
        <strong>Filters Applied:</strong>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem;">
          <span class="meta-badge" style="background: rgba(102, 126, 234, 0.1); color: #667eea; padding: 0.4rem 0.8rem; border-radius: 8px; font-size: 0.85rem;">
            ${userSelections.language}
          </span>
          <span class="meta-badge" style="background: rgba(102, 126, 234, 0.1); color: #667eea; padding: 0.4rem 0.8rem; border-radius: 8px; font-size: 0.85rem;">
            ${userSelections.age}
          </span>
          <span class="meta-badge" style="background: rgba(102, 126, 234, 0.1); color: #667eea; padding: 0.4rem 0.8rem; border-radius: 8px; font-size: 0.85rem;">
            ${userSelections.genre}
          </span>
          <span class="meta-badge" style="background: rgba(102, 126, 234, 0.1); color: #667eea; padding: 0.4rem 0.8rem; border-radius: 8px; font-size: 0.85rem;">
            ${userSelections.ott}
          </span>
        </div>
      </div>
      <a href="${detailsLink}" target="_blank" style="
        display: inline-block;
        margin-top: 1rem;
        padding: 0.875rem 1.5rem;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        text-decoration: none;
        border-radius: 8px;
        font-weight: 600;
        transition: all 0.3s ease;
      " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
        View on IMDb
      </a>
    </div>
  `;
  openModal(title, content);
}

// Show no results
function showNoResults() {
  document.getElementById('no-results').style.display = 'block';
  document.getElementById('results-container').innerHTML = '';
}

// Page transition with scroll
window.addEventListener('load', () => {
  goToPage(1);
});
