const express = require('express');
const { job } = require('./customFunctions/overDueCalculator');
const app = require('./app');


app.use(express.json());




job.start();

module.exports = {  app };

app.listen(3000, () => {
  console.log('server started...');
});
