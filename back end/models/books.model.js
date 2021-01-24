const mongoose = require('mongoose');
const slugify = require('slugify')
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
  },
  auther: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'auther',
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  }
});

bookSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

bookSchema.set('toJSON', {
  virtuals: true,
});

let slugEnd = '';
bookSchema.pre('validate', async function(next) {
  slugEnd = '';
  if (this.name) {
    slugEnd = slugify(this.name, { lower: true, strict: true });
    if (slugEnd) {
      await verifySlug();
      this.slug = slugEnd;
    } else {
      this.slug = this._id.toHexString();
    }
  }

  next()
});

function verifySlug() {
  return new Promise(async (resolve, reject) => {
    const Books = mongoose.model('book', bookSchema);
    let isVerified = false;
    while (!isVerified) {
      const booksCount = await Books.find({slug: slugEnd}).countDocuments(count => count);
      if (booksCount >= 1) {
        slugEnd += Math.floor(100 * Math.random());
      } else {
        isVerified = true;
      }
    }
    resolve()
  })
}

const Books = mongoose.model('book', bookSchema);

module.exports = Books;