import React, { useEffect, useState } from "react";
import BookCard from "../Books/BookCard";
import { Link } from "react-router-dom";

const categories = ["Choose a genre", "Fiction", "Horror", "Adventure", "History"];

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Choose a genre");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 8;

  // Fetch all books once
  useEffect(() => {
    fetch("http://localhost:5001/api/books")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch books");
        return res.json();
      })
      .then((data) => {
        setBooks(data.data || []);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);
  const filteredBooks = selectedCategory === "Choose a genre"
    ? books
    : books.filter((book) => book.category === selectedCategory);

  // Pagination logic
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

 

  return (
          <>

    <div className="max-w-screen-xl mx-auto px-4 py-8">
      

      <h2 className="text-3xl font-semibold mb-6">All Books</h2>

      {/* Category Filter */}
      <div className="mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border bg-gray-100 border-gray-300 rounded-md px-4 py-2"
        >
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentBooks.length > 0 ? (
          currentBooks.map((book) => <BookCard key={book._id} book={book} />)
        ) : (
          <p>No books found.</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div></>
  );
};

export default BooksPage;


