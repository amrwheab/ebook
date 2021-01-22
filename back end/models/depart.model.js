const mongoose = require('mongoose');
const departSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

departSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

departSchema.set('toJSON', {
  virtuals: true,
});

const Department = mongoose.model('department', departSchema);

module.exports = Department;