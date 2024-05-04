const express = require('express');
const cors = require('cors');
const app = express();
const UserModel = require('./model/loanModel');
const loanController = require('./controllers/loanController');
const ledgerController = require('./controllers/ledgerController');
const precloserController = require('./controllers/precloserController');

const authController = require('./controllers/authController');
const filterDashboard = require('./controllers/filterDashoard');
const { verifyToken } = require('./customFunctions/authFunction');
const { updateLoanDetails } = require('./customFunctions/loanFunctions')
const ledgerModel = require('./model/ledgerModel')
app.use(cors());

app.use(express.json()); 



// app.get(('/filter/ledgerDatas'), filterDashboard.ledgerDatas );
// CORS setup
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001'); // Replace with your client's origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Define loan routes
const loanRouter = express.Router();
loanRouter.post('/', loanController.createUser);
loanRouter.get('/:loanNumber', loanController.getUsers);
loanRouter.get('/',  loanController.getAllUsers);
loanRouter.patch('/patch/:loanNumber', loanController.updateLoanPayer);

// Define filter dashboard routes
const filterDashboardRouter = express.Router();
filterDashboardRouter.get('/activeLoanPayer', filterDashboard.activeLoanPayer);
filterDashboardRouter.get('/vehicleTypePercentage', filterDashboard.vehicleTypePercentage);
filterDashboardRouter.get('/LoanPayerDetails/:loanNumber', filterDashboard.LoanPayerDetails);
filterDashboardRouter.get('/getPendingEmiDetails', filterDashboard.getPendingEmiDetails);
filterDashboardRouter.get('/pendingEmiPayerLength', filterDashboard.pendingEmiPayerLength);
filterDashboardRouter.get('/ledgerDatas', filterDashboard.ledgerDatas);
filterDashboardRouter.get('/getOverDueUsers', filterDashboard.getOverDueUsers);
filterDashboardRouter.get('/getOverDueLength', filterDashboard.getOverDueLength);
filterDashboardRouter.get('/activeLoanPayerLength', filterDashboard.activeLoanPayerLength);
filterDashboardRouter.get('/closedLoanPayer', filterDashboard.closedLoanPayer);
filterDashboardRouter.get('/closedLoanPayerLength', filterDashboard.closedLoanPayerLength);
filterDashboardRouter.get('/seizedLoanPayerLength', filterDashboard.seizedLoanPayerLength);
filterDashboardRouter.get('/seizedLoanPayer', filterDashboard.seizedLoanPayer);



// Define auth routes
const authRouter = express.Router();
authRouter.post('/signin', authController.signIn);
authRouter.post('/signup', authController.signup);

app.post(('/ledger/expense'), ledgerController.expense)
app.post(('/ledger/investment'), ledgerController.investment)

app.patch('/UpdatePrecloser/:loanNumber', precloserController.UpdatePrecloser)
app.get('/calculate-pre-closer/:loanNumber', precloserController.calculate_pre_closer)
// Mount routers
app.use('/api/loan', loanRouter);
app.use('/filter', filterDashboardRouter);
app.use('/api', authRouter);

module.exports = app;
