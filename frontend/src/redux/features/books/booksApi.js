import { createApi } from '@reduxjs/toolkit/query/react'
import axios from 'axios'

// Create axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001/api/books',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Custom base query using axios
const axiosBaseQuery = () => async ({ url, method = 'GET', data, params }) => {
  try {
    const result = await axiosInstance({
      url,
      method,
      data,
      params,
    });
    return { data: result.data };
  } catch (axiosError) {
    const err = axiosError;
    return {
      error: {
        status: err.response?.status,
        data: err.response?.data || err.message,
      },
    };
  }
};

const booksApi = createApi({
    reducerPath: 'booksApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Books'],
    endpoints: (builder) => ({
        fetchAllBooks: builder.query({
            query: () => ({
                url: "/",
                method: "GET"
            }),
            providesTags: ["Books"]
        }),
        fetchBookById: builder.query({
            query: (id) => ({
                url: `/${id}`,
                method: "GET"
            }),
            providesTags: (result, error, id) => [{ type: "Books", id }],
        }),
        addBook: builder.mutation({
            query: (newBook) => ({
                url: "/",
                method: "POST",
                data: newBook
            }),
            invalidatesTags: ["Books"]
        }),
        updateBook: builder.mutation({
            query: ({id, ...rest}) => ({
                url: `/${id}`,
                method: "PUT",
                data: rest
            }),
            invalidatesTags: ["Books"]
        }),
        deleteBook: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Books"]
        })
    })
})

export const {useFetchAllBooksQuery, useFetchBookByIdQuery, useAddBookMutation, useUpdateBookMutation, useDeleteBookMutation} = booksApi;
export default booksApi;