const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const userRoutes = require('./routes/user');
const transactionRoutes = require('./routes/transaction');
const User = require('./models/User');

const app = express();

const mongoUri = 'mongodb+srv://amaina:kiragu333@cluster2.yrnwah6.mongodb.net/finance-tracker?retryWrites=true&w=majority';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('Could not connect to MongoDB Atlas', err));

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, 'public', 'uploads'));
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.use(bodyParser.json());
app.use('/user', userRoutes);
app.use('/transaction', transactionRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/bio', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'bio.html'));
});

app.post('/user/bio', upload.single('profilePicture'), async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).send('No token provided');
  }

  try {
    // Decode token and get user ID (replace 'your-jwt-secret' with your actual JWT secret)
    const decoded = jwt.verify(token, 'your-jwt-secret');
    const userId = decoded.id;

    // Find the user and update bio information
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const { initialSalary, additionalMoney } = req.body;
    const profilePictureUrl = req.file ? req.file.filename : user.bio.profilePicture;

    user.bio = {
      profilePicture: profilePictureUrl,
      initialSalary: initialSalary,
      additionalMoney: additionalMoney
    };

    await user.save();
    res.status(200).json({ message: 'Bio updated successfully' });
  } catch (err) {
    res.status(500).send('Error updating bio');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
