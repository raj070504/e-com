import React, { useEffect, useState } from 'react'
import BookCard from '../Books/BookCard';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// import required modules
import { Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Link } from 'react-router';
// import { useFetchAllBooksQuery } from '../../redux/features/books/booksApi';

const categories = ["Choose a genre", "Fiction", "Horror", "Adventure","History"]

const BestSellers = () => {

  const [books, setBooks] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("Choose a genre");

  useEffect(() => {
    fetch("http://localhost:5001/api/books")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setBooks(data.data); // adjust if your API response is different
        console.log('Fetched data:', data.data);
      })
      .catch((err) => console.log("Error fetching data:", err));
  }, [selectedCategory]);


  //    const {data: books = []} = useFetchAllBooksQuery();

  const filteredBooks = selectedCategory === "Choose a genre" ? books : books.filter(book => book.category === selectedCategory)

  return (
    <div className='py-10'>
      <h2 className='text-3xl font-semibold mb-6'>Top Sellers</h2>
      {/* category filtering */}
      <div className='mb-8 flex items-center'>
        <select
          onChange={(e) => setSelectedCategory(e.target.value)}
          name="category" id="category" className='border bg-[#EAEAEA] border-gray-300 rounded-md px-4 py-2 focus:outline-none'>
          {
            categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))
          }
        </select>
      </div>

      <div className="px-4 sm:px-8">
        <div className="w-full">
          <Swiper
            slidesPerView={1}
            spaceBetween={30}
            navigation={true}
            breakpoints={{
              640: { slidesPerView: 1, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 40 },
              1024: { slidesPerView: 3, spaceBetween: 50 },
              1180: { slidesPerView: 4, spaceBetween: 50 },
            }}
            modules={[Pagination, Navigation]}
            className="mySwiper w-full"
          >
            {filteredBooks?.length > 0 &&
              filteredBooks.map((book, index) => (
                <SwiperSlide key={index} className="w-full h-full">
                  <div className="w-full h-full">
                    <BookCard book={book} />
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>

          {/* More Button */}
          <div className="flex justify-center mt-6">
            <Link to="/allBooks">
              <button

                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all"
              >
                More
              </button>
            </Link>

          </div>
        </div>


      </div>



    </div>
  )
}

export default BestSellers