const express = require ('express');
const mongoose = require('mongoose');
const { job } = require('./customFunctions/overDueCalculator');
const app = require('./app');
app.use(express.json());

mongoose.connect('mongodb+srv://logeshpriyanga:logesh98@cluster0.i7qbne1.mongodb.net/testdb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('DB connected....');
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
  });

job.start();

app.listen(3000, ()=>{
    console.log('server started...')
    
})