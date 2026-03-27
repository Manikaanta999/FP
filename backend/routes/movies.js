const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

router.get('/filter', movieController.getFilteredMovies);
router.get('/options', movieController.getFilterOptions);
router.get('/search', movieController.searchMovies);
router.get('/:id', movieController.getMovieById);

module.exports = router;
