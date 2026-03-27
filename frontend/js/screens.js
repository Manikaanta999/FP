// ============= SCREEN MANAGEMENT =============
const screens = {
  welcome: 'welcome-screen',
  onboarding: 'onboarding-screen',
  app: 'app-screen'
};

// ============= SCREEN NAVIGATION =============
function switchScreen(screenName) {
  // Hide all screens
  document.querySelectorAll('screen').forEach(screen => {
    screen.classList.remove('active');
  });

  // Show target screen
  const screenElement = document.getElementById(screens[screenName] || screenName + '-screen');
  if (screenElement) {
    screenElement.classList.add('active');
    app.currentScreen = screenName;

    // Screen-specific initialization
    switch (screenName) {
      case 'app':
        initAppScreen();
        break;
      case 'onboarding':
        initOnboardingScreen();
        break;
      case 'welcome':
        break;
    }
  }
}

// ============= WELCOME SCREEN =============
function initWelcomeScreen() {
  // Set up welcome screen
  const welcomeBtn = document.querySelector('[onclick*="onboarding"]');
  if (welcomeBtn) {
    welcomeBtn.addEventListener('click', () => switchScreen('onboarding'));
  }
}

// ============= ONBOARDING SCREEN =============
function initOnboardingScreen() {
  app.setupOnboardingSteps();
  updateOnboardingStepUI();

  // Setup navigation buttons
  const nextBtn = document.getElementById('onboarding-next-btn');
  const backBtn = document.getElementById('onboarding-back-btn');

  if (nextBtn) {
    nextBtn.onclick = nextOnboardingStep;
  }

  if (backBtn) {
    backBtn.onclick = prevOnboardingStep;
  }

  // Setup step items (language, age, genres, platforms)
  setupOnboardingStepOptions();
}

function setupOnboardingStepOptions() {
  const steps = {
    '1': {
      name: 'Language',
      options: [
        { label: 'English', value: 'en' },
        { label: 'Hindi', value: 'hi' },
        { label: 'Telugu', value: 'te' },
        { label: 'Tamil', value: 'ta' }
      ]
    },
    '2': {
      name: 'Age Rating',
      options: [
        { label: 'G (General)', value: 'G' },
        { label: 'PG (Parental Guidance)', value: 'PG' },
        { label: 'PG-13 (13 and above)', value: 'PG-13' },
        { label: 'R (Restricted)', value: 'R' }
      ]
    },
    '3': {
      name: 'Favorite Genres',
      isMultiselect: true,
      options: [
        { label: 'Action', value: '28' },
        { label: 'Adventure', value: '12' },
        { label: 'Animation', value: '16' },
        { label: 'Comedy', value: '35' },
        { label: 'Crime', value: '80' },
        { label: 'Documentary', value: '99' },
        { label: 'Drama', value: '18' },
        { label: 'Family', value: '10751' },
        { label: 'Fantasy', value: '14' },
        { label: 'Horror', value: '27' },
        { label: 'Romance', value: '10749' },
        { label: 'Sci-Fi', value: '878' }
      ]
    },
    '4': {
      name: 'Streaming Platforms',
      isMultiselect: true,
      options: [
        { label: 'Netflix', value: 'netflix' },
        { label: 'Prime Video', value: 'prime' },
        { label: 'Disney+', value: 'disney' },
        { label: 'Apple TV+', value: 'apple' },
        { label: 'Hulu', value: 'hulu' },
        { label: 'Max', value: 'max' }
      ]
    }
  };

  // Initialize each step
  Object.entries(steps).forEach(([stepNum, stepData]) => {
    setupStepOptions(stepNum, stepData);
  });
}

function setupStepOptions(stepNum, stepData) {
  const stepContainer = document.querySelector(`[data-step="${stepNum}"]`);
  if (!stepContainer) return;

  const optionsContainer = stepContainer.querySelector('.step-options') || stepContainer;
  const isMultiselect = stepData.isMultiselect;

  // Add class for styling
  if (isMultiselect) {
    optionsContainer.classList.add('multiselect');
  }

  // Ensure all options exist in DOM
  stepData.options.forEach(option => {
    let optionElement = optionsContainer.querySelector(
      `.option-card[data-value="${option.value}"]`
    );

    if (optionElement) {
      optionElement.textContent = option.label;
    }
  });
}

function nextOnboardingStep() {
  if (app.currentOnboardingStep < 4) {
    // Validate current step
    const step = app.currentOnboardingStep;
    let isValid = true;

    if (step === 1 && !app.userPreferences.language) {
      isValid = false;
    } else if (step === 2 && !app.userPreferences.ageRating) {
      isValid = false;
    } else if (step === 3 && app.userPreferences.genres.length === 0) {
      isValid = false;
    } else if (step === 4 && app.userPreferences.ottPlatforms.length === 0) {
      isValid = false;
    }

    if (!isValid) {
      showError('Please make a selection to continue');
      return;
    }

    app.currentOnboardingStep++;
    updateOnboardingStepUI();
  } else if (app.currentOnboardingStep === 4) {
    // Complete onboarding - move to app screen
    const step = 4;
    if (app.userPreferences.ottPlatforms.length === 0) {
      showError('Please select at least one streaming platform');
      return;
    }

    app.savePreferences();
    switchScreen('app');
  }
}

function prevOnboardingStep() {
  if (app.currentOnboardingStep > 1) {
    app.currentOnboardingStep--;
    updateOnboardingStepUI();
  }
}

function updateOnboardingStepUI() {
  const steps = document.querySelectorAll('.onboarding-step');
  const progressItems = document.querySelectorAll('.progress-step');

  steps.forEach((step, index) => {
    if (index + 1 === app.currentOnboardingStep) {
      step.classList.add('active');
    } else {
      step.classList.remove('active');
    }
  });

  progressItems.forEach((item, index) => {
    if (index + 1 === app.currentOnboardingStep) {
      item.classList.add('active');
    } else if (index + 1 < app.currentOnboardingStep) {
      item.classList.add('completed');
    } else {
      item.classList.remove('active', 'completed');
    }
  });

  // Update next button text
  const nextBtn = document.getElementById('onboarding-next-btn');
  if (nextBtn) {
    if (app.currentOnboardingStep === 4) {
      nextBtn.textContent = 'Start Exploring';
    } else {
      nextBtn.textContent = 'Next';
    }
  }

  // Show/hide back button
  const backBtn = document.getElementById('onboarding-back-btn');
  if (backBtn) {
    backBtn.style.visibility = app.currentOnboardingStep === 1 ? 'hidden' : 'visible';
  }
}

// ============= APP / MAIN SCREEN =============
function initAppScreen() {
  // Setup search functionality
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
  }

  // Setup watchlist toggle
  const watchlistBtn = document.querySelector('[onclick="toggleWatchlist()"]');
  if (watchlistBtn) {
    watchlistBtn.addEventListener('click', toggleWatchlist);
  }

  // Load app data
  loadAppData();
}

// ============= MODAL MANAGEMENT =============
function showSearchModal() {
  document.getElementById('search-modal').classList.add('active');
}

function closeSearchModal() {
  document.getElementById('search-modal').classList.remove('active');
}

function showMovieDetailsModal(movieId) {
  fetchMovieDetails(movieId);
}

function closeMovieModal() {
  document.getElementById('movie-modal').classList.remove('active');
}

// ============= SIDEBAR MANAGEMENT =============
function toggleWatchlist() {
  const sidebar = document.getElementById('watchlist-sidebar');
  if (sidebar) {
    sidebar.classList.toggle('active');
  }
}

function closeWatchlistSidebar() {
  const sidebar = document.getElementById('watchlist-sidebar');
  if (sidebar) {
    sidebar.classList.remove('active');
  }
}

// ============= INITIALIZATION =============
document.addEventListener('DOMContentLoaded', () => {
  // Initialize screens
  initWelcomeScreen();

  // Check for existing preferences
  if (app.userPreferences.language && app.userPreferences.ageRating) {
    // User has completed onboarding, show app screen
    switchScreen('app');
  } else {
    // First time user, show welcome
    switchScreen('welcome');
  }

  // Setup global click handlers for modals
  setupModalClickHandlers();
});

function setupModalClickHandlers() {
  // Close modals when clicking outside
  const movieModal = document.getElementById('movie-modal');
  const searchModal = document.getElementById('search-modal');

  if (movieModal) {
    movieModal.addEventListener('click', (e) => {
      if (e.target === movieModal) {
        closeMovieModal();
      }
    });
  }

  if (searchModal) {
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) {
        closeSearchModal();
      }
    });
  }

  // Close watchlist when clicking outside
  const watchlistSidebar = document.getElementById('watchlist-sidebar');
  if (watchlistSidebar) {
    document.addEventListener('click', (e) => {
      const watchlistBtn = document.querySelector('[onclick="toggleWatchlist()"]');
      if (watchlistSidebar.classList.contains('active') &&
          !watchlistSidebar.contains(e.target) &&
          !watchlistBtn.contains(e.target)) {
        closeWatchlistSidebar();
      }
    });
  }

  // Close modals with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMovieModal();
      closeSearchModal();
      closeWatchlistSidebar();
    }
  });
}