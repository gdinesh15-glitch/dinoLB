const express = require('express');
const router = express.Router();
const { getAllBooks, addBook, getPopularBooks } = require('../controllers/bookController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAllBooks);
router.get('/popular', getPopularBooks);
router.post('/', protect, authorize('Admin', 'Librarian'), addBook);

module.exports = router;
