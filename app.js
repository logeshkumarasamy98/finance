const express = require ('express');
const userControllers = require('./controllers/loanController');
const filterDashboardController = require('./controllers/loanFilterDashboardController')
const app = express();
app.use(express.json());





app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001'); // Replace with your client's origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
  



app.post(('/api/user'), userControllers.createUser);

app.get(('/api/user/:loanNumber'), userControllers.getUsers);

app.get(('/api/user'), userControllers.getAllUsers);

app.patch(('/api/user/patch/:loanNumber'), userControllers.updateLoanPayer);

app.get(('/api/unpaid/activeloanPayer'), filterDashboardController.activeLoanPayer);

app.get(('/api/unpaid/emiPending'), filterDashboardController.pendingEmiPayer);

app.get(('/api/unpaid/totalemiAmountPending'), filterDashboardController.totalEmiBalanceSum);

module.exports = app;
