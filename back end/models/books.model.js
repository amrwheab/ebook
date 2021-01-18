const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  imgUrl: {
    type: String,
    required: true
  },
  info: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'department',
    required: true
  },
  buysNum: {
    type: Number,
    default: 0
  },
  miniPath: {
    type: String,
    required: true
  },
  fullPath: {
    type: String,
    required: true
  },
  isFeatured: {
    type: Boolean,
    required: true
  }
});
const Books = mongoose.model('book', bookSchema);

module.exports = Books;