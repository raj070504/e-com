
import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <Link 
          to="/admin/add-book" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Book
        </Link>
      </div>
      
      {/* Navigation for admin sections */}
      <nav className="flex gap-4 mb-6">
        <Link 
          to="/admin" 
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
        >
          Dashboard
        </Link>
        <Link 
          to="/admin/books" 
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
        >
          Manage Books
        </Link>
        <Link 
          to="/admin/add-book" 
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
        >
          Add Book
        </Link>
        <Link 
          to="/admin/orders" 
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
        >
          Orders
        </Link>
      </nav>

      {/* This is where child routes will render */}
      <Outlet />
    </div>
  );
};

export default AdminLayout;
