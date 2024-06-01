const express = require('express');
const cors = require('cors');
const app = express();
const UserModel = require('./model/authModel');
const loanController = require('./controllers/loanController');
const ledgerController = require('./controllers/ledgerController');
const precloserController = require('./controllers/precloserController');

const authController = require('./controllers/authController');
const auth  = require('./customFunctions/authFunction')
const filterDashboard = require('./controllers/filterDashoard');
const { verifyToken } = require('./customFunctions/authFunction');
const { updateLoanDetails } = require('./customFunctions/loanFunctions')
const ledgerModel = require('./model/ledgerModel');
const jwt = require('jsonwebtoken');
const Company = require('./model/company');
const cookieParser = require('cookie-parser');

app.use(cors());

app.use(express.json()); 

app.use(cookieParser());


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
loanRouter.post('/', auth,  loanController.createUser);
loanRouter.get('/:loanNumber', auth, loanController.getUsers);
loanRouter.get('/', auth, loanController.getAllUsers);
loanRouter.patch('/patch/:loanNumber', auth ,  loanController.updateLoanPayer);

// Define filter dashboard routes
const filterDashboardRouter = express.Router();
filterDashboardRouter.get('/activeLoanPayer',auth, filterDashboard.activeLoanPayer);
filterDashboardRouter.get('/vehicleTypePercentage', auth, filterDashboard.vehicleTypePercentage);
filterDashboardRouter.get('/LoanPayerDetails/:loanNumber',auth, filterDashboard.LoanPayerDetails);
filterDashboardRouter.get('/getPendingEmiDetails', auth, filterDashboard.getPendingEmiDetails);
filterDashboardRouter.get('/pendingEmiPayerLength',auth, filterDashboard.pendingEmiPayerLength);
filterDashboardRouter.get('/ledgerDatas', auth,filterDashboard.ledgerDatas);
filterDashboardRouter.get('/getOverDueUsers', auth,filterDashboard.getOverDueUsers);
filterDashboardRouter.get('/getOverDueLength', filterDashboard.getOverDueLength);
filterDashboardRouter.get('/activeLoanPayerLength', auth,  filterDashboard.activeLoanPayerLength);
filterDashboardRouter.get('/closedLoanPayer',auth, filterDashboard.closedLoanPayer);
filterDashboardRouter.get('/closedLoanPayerLength',auth, filterDashboard.closedLoanPayerLength);
filterDashboardRouter.get('/seizedLoanPayerLength',auth, filterDashboard.seizedLoanPayerLength);
filterDashboardRouter.get('/seizedLoanPayer',auth, filterDashboard.seizedLoanPayer);



// Define auth routes
const authRouter = express.Router();
authRouter.post('/signin', authController.signIn);
authRouter.post('/createUser', authController.createUser);
authRouter.post('/createCompany', authController.createCompany);


app.post(('/ledger/expense'), ledgerController.expense)
app.post(('/ledger/investment'), ledgerController.investment)

app.patch('/UpdatePrecloser/:loanNumber', precloserController.UpdatePrecloser)
app.get('/calculate-pre-closer/:loanNumber', precloserController.calculate_pre_closer)
// Mount routers
app.use('/api/loan', loanRouter);
app.use('/filter', filterDashboardRouter);
app.use('/api', authRouter);

module.exports = app;
