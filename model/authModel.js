const mongoose = require('mongoose');


const authSchema = new mongoose.Schema({
    email: String,
    password: String,
    DB: String
});

const auth = mongoose.model('User', authSchema);

module.exports = auth;
