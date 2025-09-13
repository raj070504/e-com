import React, { useState } from 'react';
import { useFetchAllBooksQuery, useDeleteBookMutation } from '../../redux/features/books/booksApi';
import { toast } from 'react-hot-toast';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const ManageBooks = () => {
  const { data: response, isLoading, error } = useFetchAllBooksQuery();
  const [deleteBook] = useDeleteBookMutation();
  const [searchTerm, setSearchTerm] = useState('');

  // Extract the books array from the response data
  const books = response?.data || [];

  const handleDelete = async (bookId, bookTitle) => {
    iziToast.question({
      timeout: 20000,
      close: false,
      overlay: true,
      displayMode: 'once',
      id: 'question',
      zindex: 999,
      title: 'Confirm Delete',
      message: `Are you sure you want to delete "${bookTitle}"?`,
      position: 'center',
      buttons: [
        ['<button><b>YES</b></button>', async function (instance, toast) {
          instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
          
          try {
            await deleteBook(bookId).unwrap();
            toast.success('Book deleted successfully!');
          } catch (error) {
            console.error('Error deleting book:', error);
            toast.error('Failed to delete book');
          }
        }, true],
        ['<button>NO</button>', function (instance, toast) {
          instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
        }],
      ]
    });
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading books...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-600 text-center">Error loading books</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Manage Books</h2>
        
        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search books by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="text-sm text-gray-600">
          Total Books: {filteredBooks.length}
        </div>
      </div>

      {/* Books Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Book
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBooks.map((book) => (
              <tr key={book._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {book.coverImage && (
                      <img 
                        src={book.coverImage} 
                        alt={book.title}
                        className="h-12 w-8 object-cover rounded mr-3"
                      />
                    )}
                    <div className="text-sm font-medium text-gray-900">{book.title}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{book.author}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{book.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <span className="line-through text-gray-500">₹{book.old_price}</span>
                    <span className="ml-2 font-semibold">₹{book.new_price}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{book.stockQuantity || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleDelete(book._id, book.title)}
                    className="text-red-600 hover:text-red-900 mr-4"
                  >
                    Delete
                  </button>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No books found matching your search.
        </div>
      )}
    </div>
  );
};

export default ManageBooks;