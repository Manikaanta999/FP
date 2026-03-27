const Movie = require('../models/Movie');

// Get movies with filters
exports.getFilteredMovies = async (req, res) => {
  try {
    const { language, age, genre, ott } = req.query;

    const filter = {};
    if (language && language !== 'all') filter.language = language;
    if (age && age !== 'all') filter.age = age;
    if (genre && genre !== 'all') filter.genre = genre;
    if (ott && ott !== 'all') filter.ott = ott;

    const movies = await Movie.find(filter).limit(20);

    if (movies.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No movies found with these filters',
        data: []
      });
    }

    res.status(200).json({
      success: true,
      count: movies.length,
      data: movies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all unique values for filters
exports.getFilterOptions = async (req, res) => {
  try {
    const languages = await Movie.distinct('language');
    const ages = await Movie.distinct('age');
    const genres = await Movie.distinct('genre');
    const otts = await Movie.distinct('ott');

    res.status(200).json({
      success: true,
      data: {
        languages,
        ages,
        genres,
        otts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get movie by ID
exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    res.status(200).json({
      success: true,
      data: movie
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Search movies
exports.searchMovies = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters'
      });
    }

    const movies = await Movie.find({
      $text: { $search: query }
    }).limit(10);

    res.status(200).json({
      success: true,
      count: movies.length,
      data: movies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
