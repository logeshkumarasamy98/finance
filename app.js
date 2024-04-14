const express = require('express');
const app = express();
const loanController = require('./controllers/loanController');
const ledgerController = require('./controllers/ledgerController');
const authController = require('./controllers/authController');
const filterDashboard = require('./controllers/filterDashoard');
const { verifyToken } = require('./customFunctions/authFunction');
const ledgerModel = require('./model/ledgerModel');

app.use(express.json());


app.post(('/ledger/expense'), ledgerController.expense)


// app.post('/ledger/expense', async (req, res) => {
//     try {
//         const { paymentMethod, remarks, total, creditOrDebit } = req.body;

//         // Update isExpense field based on conditions
//         let isExpense = false;
//         if (paymentMethod && remarks && total) {
//             isExpense = true;
//         }

//         // Create a new ledger entry
//         const newEntry = new ledgerModel({
//             paymentMethod,
//             remarks,
//             total,
//             isExpense, // Assigning the updated value of isExpense
//             creditOrDebit // Assigning the creditOrDebit value
//             // Add other fields as needed
//         });

//         // Save the new entry to the database
//         await newEntry.save();

//         res.status(200).json({ success: true, message: 'Ledger entry created successfully.' });
//     } catch (error) {
//         console.error('Error creating ledger entry:', error);
//         res.status(500).json({ success: false, message: 'Internal server error.' });
//     }
// });


app.post('/ledger/investment', async (req, res) => {
    try {
        const { paymentMethod, remarks, total } = req.body;

        // Update isInvestment field based on conditions
        let isInvestment = false;
        if (paymentMethod && remarks && total) {
            isInvestment = true;
        }

        // Set creditOrDebit to "Credit"
        const creditOrDebit = "Credit";

        // Create a new ledger entry
        const newEntry = new ledgerModel({
            paymentMethod,
            remarks,
            total,
            isInvestment, // Assigning the updated value of isInvestment
            creditOrDebit // Assigning the creditOrDebit value
            // Add other fields as needed
        });

        // Save the new entry to the database
        await newEntry.save();

        res.status(200).json({ success: true, message: 'Investment ledger entry created successfully.' });
    } catch (error) {
        console.error('Error creating investment ledger entry:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});



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
loanRouter.get('/:loanNumber', verifyToken, loanController.getUsers);
loanRouter.get('/', verifyToken, loanController.getAllUsers);
loanRouter.patch('/patch/:loanNumber', loanController.updateLoanPayer);

// Define filter dashboard routes
const filterDashboardRouter = express.Router();
filterDashboardRouter.get('/activeLoanPayer', filterDashboard.activeLoanPayer);
filterDashboardRouter.get('/vehicleTypePercentage', filterDashboard.vehicleTypePercentage);
filterDashboardRouter.get('/LoanPayerDetails/:loanNumber', filterDashboard.LoanPayerDetails);
filterDashboardRouter.get('/getPendingEmiDetails', filterDashboard.getPendingEmiDetails);


// Define auth routes
const authRouter = express.Router();
authRouter.post('/signin', authController.signIn);
authRouter.post('/signup', authController.signup);

// Mount routers
app.use('/api/loan', loanRouter);
app.use('/filter', filterDashboardRouter);
app.use('/api', authRouter);

module.exports = app;
