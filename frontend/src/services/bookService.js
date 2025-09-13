import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5001/api/books',
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Only set Content-Type to application/json if it's not FormData
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    
    console.log('Request config:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      hasToken: !!token,
      isFormData: config.data instanceof FormData
    });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token might be expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Book service functions
export const bookService = {
  // Add book
  createBook: async (bookData) => {
    const response = await api.post('/', bookData);
    return response.data;
  },
  
  // Get all books
  getBooks: async (params = {}) => {
    const response = await api.get('/', { params });
    return response.data;
  },
  
  // Get single book
  getBook: async (id) => {
    const response = await api.get(`/${id}`);
    return response.data;
  },
  
  // Update book
  updateBook: async (id, bookData) => {
    const response = await api.put(`/${id}`, bookData);
    return response.data;
  },
  
  // Delete book
  deleteBook: async (id) => {
    const response = await api.delete(`/${id}`);
    return response.data;
  }
};

export default bookService;