const express = require('express');
const router = express.Router();

const User = require('../models/User');       // Adjust path if needed
const Order = require('../models/Order');
const Book = require('../models/Book');

// Owner Dashboard Summary
router.get('/summary', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const orderCount = await Order.countDocuments();
    const bookCount = await Book.countDocuments();

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user');
    //   .populate('books'); // Adjust if your schema supports it

    res.status(200).json({
      status: 'success',
      data: {
        users: userCount,
        orders: orderCount,
        books: bookCount,
        recentOrders,
      },
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch dashboard summary',
    });
  }
});

module.exports = router;
