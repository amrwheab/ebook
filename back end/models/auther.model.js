const mongoose = require('mongoose');
const slugify = require('slugify');

const autherSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  imgUrl: {
    type: String,
    default: 'assets/auther.png'
  },
  info: {
    type: String,
    default: 'There is no information about this auther'
  },
  slug: {
    type: String
  }
});

autherSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

autherSchema.set('toJSON', {
  virtuals: true,
});

let slugEnd = '';
autherSchema.pre('validate', async function(next) {
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
    const Authers = mongoose.model('auther', autherSchema);
    let isVerified = false;
    while (!isVerified) {
      const authersCount = await Authers.find({slug: slugEnd}).countDocuments(count => count);
      if (authersCount >= 1) {
        slugEnd += Math.floor(100 * Math.random());
      } else {
        isVerified = true;
      }
    }
    resolve()
  })
}

const Auther = mongoose.model('auther', autherSchema);

module.exports = Auther;