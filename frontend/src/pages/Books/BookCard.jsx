import React from "react";
import { FiShoppingCart } from "react-icons/fi";
import { getImgUrl } from "../../utils/getImgUrl";
import getBaseUrl from "../../utils/baseURL";

import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import Swal from "sweetalert2";

const BookCard = ({ book }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    // Check if user is logged in
    const token = localStorage.getItem("token");

    if (!token) {
      // User is not logged in, show login prompt
      Swal.fire({
        title: "Login Required",
        text: "Please login to add items to your cart",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Login Now",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    // User is logged in, proceed with adding to cart
    dispatch(addToCart(product));
  };

  return (
    <div className="rounded-lg shadow-md border p-4 transition-shadow duration-300 hover:shadow-xl bg-white max-w-md mx-auto w-full">
      {/* Book Image */}
      <div className="w-full h-72 flex items-center justify-center border rounded-md overflow-hidden mb-4 bg-white">
        <Link to={`/books/${book._id}`}>
         <img
  src={`${getBaseUrl()}${book.imageLink}`}
  alt={book?.title}
  className="max-h-full max-w-full object-contain p-2 hover:scale-105 transition-transform duration-200 cursor-pointer"
/>
        </Link>
      </div>

      {/* Book Info */}
      <div>
        <a href={book.link} target="_blank" rel="noopener noreferrer" />

        {/* <p className="text-gray-600 mb-2 text-sm line-clamp-3">
          {book?.description}
        </p> */}

        <p className="text-sm text-gray-500 mb-2">
          By <span className="font-medium text-gray-700">{book.author}</span>
        </p>

        {/* Price & Discount */}
        <p className="text-lg font-semibold text-green-600 mb-3">
          ${book?.new_price}
          <span className="text-gray-500 line-through text-base ml-2">
            ${Number(book?.old_price).toFixed(2)}
          </span>
          <span className="text-sm text-green-500 ml-2">
            (
            {Math.round(
              ((book.old_price - book.new_price) / book.old_price) * 100
            ).toFixed(2)}
            % off)
          </span>
        </p>

        <button
          onClick={() => handleAddToCart(book)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
        >
          <FiShoppingCart className="text-lg" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default BookCard;
