const express = require('express');
const { getMovies, postMovie } = require('../controllers/movieController');
const router = express.Router();

router.get('/', getMovies);
router.post('/', postMovie);

module.exports = router;