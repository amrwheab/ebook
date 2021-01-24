const mongoose = require('mongoose');
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
  }
});

autherSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

autherSchema.set('toJSON', {
  virtuals: true,
});

const Auther = mongoose.model('auther', autherSchema);

module.exports = Auther;