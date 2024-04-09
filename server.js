const express = require('express');
const app = require('./app');
require('dotenv').config({path:'./config.env'});


app.use(express.json());


module.exports = {  app };

app.listen(3000, () => {
  console.log('server started...');
});
