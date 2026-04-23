const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Book title is required'],
        trim: true
    },
    author: {
        type: String,
        required: [true, 'Author name is required'],
        trim: true
    },
    isbn: {
        type: String,
        unique: true,
        sparse: true, // Allows null/missing ISBN to be unique
        trim: true
    },
    totalCopies: {
        type: Number,
        default: 1,
        min: [0, 'Total copies cannot be negative']
    },
    availableCopies: {
        type: Number,
        default: 1,
        min: [0, 'Available copies cannot be negative']
    },
    borrowCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);
