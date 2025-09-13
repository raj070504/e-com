const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Book = require('./models/Book');
require('dotenv').config(); // or .env if that's what you use

async function seedBooks() {
  await mongoose.connect(process.env.MONGODB_URI);

  // Read books from JSON
  const books = JSON.parse(fs.readFileSync(path.join(__dirname, 'books.json'), 'utf-8'));


  // Remove all existing books
  await Book.deleteMany({});

  // Insert books (let MongoDB assign ObjectIds)
  const DEFAULT_USER_ID = "64809683d379bbdde9648fd9"; // (use your actual user _id)
  const booksToInsert = books.map(book => {
    const { _id, ...rest } = book;
    return {
      ...rest,
      description: rest.description || "No description available.",
      createdBy: DEFAULT_USER_ID,
      stockQuantity: rest.stockQuantity || 10 // Set default stock if not present
    };
  });

  await Book.insertMany(booksToInsert);

  console.log('Books seeded!');
  process.exit();
}

seedBooks().catch(err => {
  console.error(err);
  process.exit(1);
});
