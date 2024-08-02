const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: {
    profilePicture: { type: String, default: 'default-profile.png' },
    initialSalary: { type: Number, default: 0 },
    additionalMoney: { type: Number, default: 0 }
  },
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }]
});

module.exports = mongoose.model('User', userSchema);

