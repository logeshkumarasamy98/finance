const express = require ('express');
const mongoose = require('mongoose');
const userControllers = require('./usercontroller');
const job = require('./overDueCalculator')
const app = express();
const currentTime = new Date();
console.log(currentTime);
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Replace with your client's origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


mongoose.connect('mongodb+srv://logeshpriyanga:logesh98@cluster0.i7qbne1.mongodb.net/testdb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('DB connected.');
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
  });


app.post(('/api/user'), userControllers.createUser);

app.get(('/api/user/:loanNumber'), userControllers.getUsers);

app.get(('/api/user'), userControllers.getAllUsers);

app.patch(('/api/user/:customId'), userControllers.updateUser);

// app.get(('/api/unpaid/unpaidloan'), userControllers.test)

app.get(('/api/unpaid/activeloanPayer'), userControllers.activeLoanPayer)

job.start();

app.listen(3000, ()=>{
    console.log('server started...')
    
})