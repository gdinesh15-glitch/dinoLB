const Book = require('../models/Book');

// @desc    Get all books
// @route   GET /api/books
// @access  Public (or semi-protected)
exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find().sort({ title: 1 });
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Add a new book
// @route   POST /api/books
// @access  Protected (Admin, Librarian)
exports.addBook = async (req, res) => {
    try {
        const book = await Book.create(req.body);
        res.status(201).json(book);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Book with this ISBN already exists' });
        }
        res.status(400).json({ message: err.message });
    }
};

// @desc    Get popular books
// @route   GET /api/books/popular
// @access  Public
exports.getPopularBooks = async (req, res) => {
    try {
        const books = await Book.find()
            .sort({ borrowCount: -1 })
            .limit(5);
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
