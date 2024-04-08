const express = require ('express');
const loanController = require('./controllers/loanController');
const filterDashboardController = require('./controllers/loanFilterDashboardController')
const authController = require('./controllers/authController');
const app = express();
app.use(express.json());
// const jwt = require('jsonwebtoken'); 
const {verifyToken} = require('./customFunctions/authFunction')

// const your_secret_key = "9d7e0cf9b9a5ef1f1b4a6e5f7c8d3b2a";


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001'); // Replace with your client's origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
  


app.post(('/api/loan'), loanController.createUser);

app.get(('/api/loan/:loanNumber'), loanController.getUsers);

app.get(('/api/loan'), verifyToken, loanController.getAllUsers);

app.patch(('/api/loan/patch/:loanNumber'), loanController.updateLoanPayer);

app.get(('/api/loan/activeloanPayer'), filterDashboardController.activeLoanPayer);

app.get(('/api/loan/emiPending'), filterDashboardController.pendingEmiPayer);

app.get(('/api/loan/totalemiAmountPending'), filterDashboardController.totalEmiBalanceSum);

app.post('/signin', authController.signIn)

module.exports = app;
