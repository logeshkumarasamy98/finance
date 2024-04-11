const express = require('express');
const app = require('./app');
require('dotenv').config({path:'./config.env'});
// const path = require('path');



app.use(express.json());
// app.use(express.static(path.join(__dirname, '../login finance/build')));

// app.get('/login',  (req, res) => {
//   res.sendFile(path.join(__dirname, '../login finance/build', 'index.html'));
// });

module.exports = {  app };

app.listen(3000, () => {
  console.log('server started...');
});
