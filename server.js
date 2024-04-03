const express = require ('express');
const mongoose = require('mongoose');
const userControllers = require('./usercontroller');
const job = require('./overDueCalculator')
const app = express();
const currentTime = new Date();
console.log(currentTime);


app.use(express.json());

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

job.start();

app.listen(3000, ()=>{
    console.log('server started...')
    
})