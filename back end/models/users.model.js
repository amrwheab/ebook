const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  buyedBooks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'book'
  }]
});

const Users = mongoose.model('user', userSchema);

module.exports = Users;