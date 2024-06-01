const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'employee'],
    required: true
  },
  companies: [{
    type: Schema.Types.ObjectId,
    ref: 'Company'
  }]
}, { timestamps: true });


const User = mongoose.model('user', userSchema);

module.exports = User;
