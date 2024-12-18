// const express = require('express');
// const mongoose = require('mongoose');
// const app = require('./app');
// require('dotenv').config({path:'./config.env'});

// app.use(express.json());

// // Define MongoDB connection URL
// const mongoDBUrl = 'mongodb+srv://logeshpriyanga:logesh98@cluster0.i7qbne1.mongodb.net/dayadb';

// // const mongoDBUrl = 'mongodb://localhost:27017/dayadb2';


// // Connect to MongoDB when server starts
// app.listen(4000, async () => {
//   try {
//     await mongoose.connect(mongoDBUrl, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//     });
//     console.log('MongoDB connected...');
//     console.log('Server started...');
//   } catch (error) {
//     console.error('Error connecting to MongoDB:', error);
//   }
// });


const express = require('express');
const mongoose = require('mongoose');
const app = require('./app');
require('dotenv').config({ path: './config.env' });

app.use(express.json());

const mongoDBUrl = 'mongodb+srv://logeshpriyanga:logesh98@cluster0.i7qbne1.mongodb.net/dayadb';

const environment = process.argv.includes('--production') ? 'production' : 'development';


const PORT = environment === 'production' ? 80 : process.env.PORT || 4000;
// Connect to MongoDB and start the server
app.listen(PORT, async () => {
  try {
    await mongoose.connect(mongoDBUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected...');
    console.log(`Server started on port ${PORT}...`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
});
