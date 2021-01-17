const mongoose = require('mongoose');
const departSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});
const Department = mongoose.model('department', departSchema);

module.exports = Department;