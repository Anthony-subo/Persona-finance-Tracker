// routes/transaction.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');

// Add transaction route
router.post('/add', auth, async (req, res) => {
  try {
    const { amount, description } = req.body;
    const userId = req.userId;

    const transaction = new Transaction({ userId, amount, description });
    await transaction.save();

    res.status(201).send('Transaction added successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Get summary route
router.get('/summary', auth, async (req, res) => {
  try {
    const userId = req.userId;

    const transactions = await Transaction.find({ userId });
    const totalMoney = transactions.reduce((sum, tx) => sum + tx.amount, 0);

    res.json({ totalMoney, transactions });
  } catch (error) {
    res.status(400).send(error.message);
  }
});
// Dashboard route (GET)
router.get('/dashboard', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) return res.status(404).send('User not found');

    const { initialSalary, additionalMoney } = user.bio || { initialSalary: 0, additionalMoney: 0 };
    const transactions = user.transactions || [];

    res.json({ initialSalary, additionalMoney, transactions });
  } catch (error) {
    res.status(500).send(error.message);
  }
});


module.exports = router;
