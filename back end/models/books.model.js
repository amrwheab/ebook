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

bookSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

bookSchema.set('toJSON', {
  virtuals: true,
});

const Books = mongoose.model('book', bookSchema);

module.exports = Books;