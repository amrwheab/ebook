const mongoose = require('mongoose');
const slugify = require('slugify');

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
  }],
  isAdmin: {
    type: Boolean,
    default: false
  },
  cart: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'book'
  }],
  slug: {
    type: String,
    required: true,
    unique: true
  }
});

userSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

userSchema.set('toJSON', {
  virtuals: true,
});

let slugEnd = '';
userSchema.pre('validate', async function(next) {
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
    const Users = mongoose.model('user', userSchema);
    let isVerified = false;
    while (!isVerified) {
      const usersCount = await Users.find({slug: slugEnd}).countDocuments(count => count);
      if (usersCount >= 1) {
        slugEnd += Math.floor(100 * Math.random());
      } else {
        isVerified = true;
      }
    }
    resolve()
  })
}

const Users = mongoose.model('user', userSchema);

module.exports = Users;