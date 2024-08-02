const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage: storage });

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, 'SECRET_KEY');
    res.status(201).json({ token, redirectTo: '/bio' });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('Invalid email or password');
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid email or password');
    
    const token = jwt.sign({ userId: user._id }, 'SECRET_KEY');
    res.json({ token, redirectTo: '/dashboard' });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Bio update route
router.post('/bio', [auth, upload.single('profilePicture')], async (req, res) => {
  try {
    const { initialSalary, additionalMoney } = req.body;
    const userId = req.userId;
    const user = await User.findById(userId);
    
    user.bio = {
      profilePicture: req.file.path,
      initialSalary: parseFloat(initialSalary),
      additionalMoney: parseFloat(additionalMoney)
    };
    
    await user.save();
    res.redirect('/dashboard');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
