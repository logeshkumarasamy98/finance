const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');

const UserModel = require('./model/authModel');
const loanController = require('./controllers/loanController');
const ledgerController = require('./controllers/ledgerController');
const precloserController = require('./controllers/precloserController');
const authController = require('./controllers/authController');
const auth = require('./customFunctions/authFunction');
const filterDashboard = require('./controllers/filterDashoard');
const { verifyToken } = require('./customFunctions/authFunction');
const { updateLoanDetails } = require('./customFunctions/loanFunctions');
const ledgerModel = require('./model/ledgerModel');
const jwt = require('jsonwebtoken');
const Company = require('./model/company');

// CORS options
const corsOptions = {
  origin: function (origin, callback) {
    // List of allowed origins
    const allowedOrigins = ['http://localhost:3000', 'http://localhost:80', 'http://logesh.store', 'https://logesh.store'];

    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};


app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Define loan routes
const loanRouter = express.Router();
loanRouter.post('/', loanController.createUser);
loanRouter.get('/:loanNumber', loanController.getUsers);
loanRouter.delete('/:loanNumber', loanController.deleteLoan);
loanRouter.get('/', loanController.getAllUsers);
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
filterDashboardRouter.get('/downloadPendingEmiDetails', filterDashboard.downloadPendingEmiDetails);

// Define auth routes
const authRouter = express.Router();
authRouter.post('/signin', authController.signIn);
authRouter.post('/createUser', authController.createUser);
authRouter.post('/createCompany', authController.createCompany);

app.post('/ledger/expense', auth, ledgerController.expense);
app.post('/ledger/investment', auth, ledgerController.investment);

// app.patch('/UpdatePrecloser/:loanNumber', precloserController.UpdatePrecloser);
// app.post('/calculate-pre-closer/:loanNumber', precloserController.calculate_pre_closer);
app.post('/managePrecloser/:loanNumber', precloserController.managePrecloser)

// Mount routers
app.use('/api/loan', auth, loanRouter);
app.use('/filter', auth, filterDashboardRouter);
app.use('/api', authRouter);

module.exports = app;
