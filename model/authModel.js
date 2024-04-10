const mongoose = require('mongoose');
const validator = require('validator');

const authSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(value) {
                // Email validation using validator library
                return validator.isEmail(value);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        validate: {
            validator: function(value) {
                // Password validation using validator library
                return validator.isStrongPassword(value);
            },
            message: props => `Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character!`
        }
    },
    DB: {
        type: String,
        required: true,
        minlength: 3
    },
    companyName: {
        type: String,
        required: true,
        minlength: 3
    }
});

const auth = mongoose.model('User', authSchema);

module.exports = auth;

