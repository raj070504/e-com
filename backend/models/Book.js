const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a book title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  author: {
    type: String,
    required: [true, 'Please provide an author name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['Fiction', 'Non-Fiction', 'Horror', 'Adventure', 'Romance', 'Mystery', 'Science Fiction', 'Biography', 'History', 'Self-Help']
  },
  language: {
    type: String,
    required: [true, 'Please provide a language']
  },
  country: {
    type: String,
    required: [true, 'Please provide a country']
  },
  year: {
    type: Number,
    required: [true, 'Please provide a publication year']
  },
  pages: {
    type: Number,
    required: [true, 'Please provide number of pages']
  },
  imageLink: {
    type: String,
    required: [true, 'Please provide an image link']
  },
  link: {
    type: String
  },
  new_price: {
    type: Number,
    required: [true, 'Please provide a new price'],
    min: [0, 'Price cannot be negative']
  },
  old_price: {
    type: Number,
    required: [true, 'Please provide an old price'],
    min: [0, 'Price cannot be negative']
  },
  trending: {
    type: Boolean,
    default: false
  },
  inStock: {
    type: Boolean,
    default: true
  },
  stockQuantity: {
    type: Number,
    default: 0,
    min: [0, 'Stock quantity cannot be negative']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5']
  },
  numReviews: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
bookSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Book', bookSchema); 