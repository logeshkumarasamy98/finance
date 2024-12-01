const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  address: String,
}, { timestamps: true });

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
