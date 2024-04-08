// const mongoose = require('mongoose');
// const validator = require('validator');
// const bcrypt = require('bcryptjs');
// //name, email, password, confirmPassword
// const userSchema = new mongoose.Schema({
//     email: {
//         type: String,
//         required: [true, 'Please enter an email.']
//     }
//     // password: {
//     //     type: String,
//     //     required: [true, 'Please enter a password.'],
//     //     minlength: 8
//     // },
//     // confirmPassword: {
//     //     type: String,
//     //     required: [true, 'Please confirm your password.'],
//     //     validate:{
//     //         validator: function(vaL){
//     //             return vaL == this.password;
//     //         }, 
//     //         message: 'passowrd and confirm password dose not match!'
//     //     }
//     // }
// })

// // userSchema.pre('save', async function(next){
// //     if(!this.isModified('password')) return next()
// //     this.password = await bcrypt.hash(this.password, 12);

// //     this.confirmPassword = undefined;
// //     next();
// // })

// const user = mongoose.model('user', userSchema);

// module.exports = user;