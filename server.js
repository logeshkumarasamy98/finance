const express = require('express');
const app = require('./app');
require('dotenv').config({path:'./config.env'});
const path = require('path');
const {verifyToken} = require('./customFunctions/authFunction')



app.use(express.json());
app.use(express.static(path.join(__dirname, '../loginfrontend/login/build')));

app.get('/login', verifyToken, (req, res) => {
  res.sendFile(path.join(__dirname, '../loginfrontend/login/build', 'index.html'));
});

module.exports = {  app };

app.listen(3000, () => {
  console.log('server started...');
});
