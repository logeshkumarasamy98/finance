const express = require('express');
const cors = require('cors');
const app = express();
const UserModel = require('./model/loanModel');
const loanController = require('./controllers/loanController');
const ledgerController = require('./controllers/ledgerController');
const authController = require('./controllers/authController');
const filterDashboard = require('./controllers/filterDashoard');
const { verifyToken } = require('./customFunctions/authFunction');
const { updateLoanDetails } = require('./customFunctions/loanFunctions')
const ledgerModel = require('./model/ledgerModel')
app.use(cors());

app.use(express.json()); 


app.patch('/calculate-pre-closer/:loanNumber', async (req, res) => {
    const { loanNumber } = req.params;
    const { date, OverdueforPrecloser } = req.body;

    try {
        // Start a session
        const session = await UserModel.startSession();
        session.startTransaction();

        // Find the user by loan number
        const user = await UserModel.findOne({ loanNumber }).session(session);

        // Check if the user exists
        if (!user) {
            session.endSession();
            return res.status(404).json({ error: 'User not found' });
        }

        // Convert user input date to a Date object
        const providedDate = new Date(date);

        // Calculate the difference in months between the provided date and the loan start date
        const startDate = new Date(user.loanDetails.startDate);
        const monthsDifference = (providedDate.getFullYear() - startDate.getFullYear()) * 12 + (providedDate.getMonth() - startDate.getMonth());

        // Update pre-closer details based on the difference in months
        if (monthsDifference >= 3) {
            // Calculate pre-closer principle amount
            const preCloserPrincipleAmount = user.loanDetails.totalPrincipalAmount;

            // Calculate pre-closer interest amount
            let preCloserInterestAmount = 0;
            user.loanDetails.instalmentObject.forEach(installment => {
                if (!installment.isPaid) {
                    preCloserInterestAmount += installment.interestAmount;
                }
            });

            // Update pre-closer details
            user.loanDetails.preCloser.hasPreCloser = true;
            user.loanDetails.preCloser.isPrecloserAbove3Months = true;
            user.loanDetails.preCloser.preCloserDate = providedDate;
            user.loanDetails.preCloser.preCloserTotalAmount = user.loanDetails.totalEmiAndOverdueToBePaid;
            user.loanDetails.preCloser.preCloserPrincipleAmount = preCloserPrincipleAmount;
            user.loanDetails.preCloser.preCloserInterestAmount = preCloserInterestAmount;
            user.loanDetails.preCloser.preCloserOverDue = user.loanDetails.totalOverdueAmountToBePaid + OverdueforPrecloser;

            // Update isActive to false
            user.loanDetails.isActive = false;

            // Update emiPending to false
            user.loanDetails.emiPending = false;

            // Set pendingEmiNum to 0
            user.loanDetails.pendingEmiNum = 0;

            // Set emiPendingDate to null
            user.loanDetails.emiPendingDate = null;
        } else {
            // Calculate pre-closer total amount
            const variable = user.loanDetails.totalPrincipalAmount * 0.036; // 3.6% of totalPrincipalAmount
            const preCloserTotalAmount = (variable * 3) + user.loanDetails.totalPrincipalAmount;

            // Calculate pre-closer total interest amount
            let preCloserTotalInterest = 0;
            user.loanDetails.instalmentObject.forEach(installment => {
                if (installment.isPaid) {
                    preCloserTotalInterest += installment.interestAmount;
                }
            });
            preCloserTotalInterest += variable;

            // Update pre-closer details
            user.loanDetails.preCloser.hasPreCloser = true;
            user.loanDetails.preCloser.isPrecloserBelow3Months = true;
            user.loanDetails.preCloser.preCloserDate = providedDate;
            user.loanDetails.preCloser.preCloserTotalAmount = preCloserTotalAmount;
            user.loanDetails.preCloser.preCloserTotalPrinciple = user.loanDetails.totalPrincipalAmount;
            user.loanDetails.preCloser.preCloserTotalInterest = preCloserTotalInterest;
            user.loanDetails.preCloser.preCloserOverDue = user.loanDetails.totalOverdueAmountToBePaid + OverdueforPrecloser;

            // Update isActive to false
            user.loanDetails.isActive = false;

            // Update emiPending to false
            user.loanDetails.emiPending = false;

            // Set pendingEmiNum to 0
            user.loanDetails.pendingEmiNum = 0;

            // Set emiPendingDate to null
            user.loanDetails.emiPendingDate = null;
        }

        // Save the updated user within the session
        await user.save({ session });

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({ message: 'Pre-closer details updated successfully', isActive: user.loanDetails.isActive });

    } catch (error) {
        console.error('Error updating pre-closer details:', error);

        // Rollback the transaction if an error occurs
        await session.abortTransaction();
        session.endSession();

        return res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/calculate-pre-closer/:loanNumber', async (req, res) => {
    const { loanNumber } = req.params;
    const { date } = req.body;

    try {
        // Find the user by loan number
        const user = await UserModel.findOne({ loanNumber });

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Convert user input date to a Date object
        const providedDate = new Date(date);

        // Calculate the difference in months between the loan start date and provided date
        const startDate = new Date(user.loanDetails.startDate);
        const monthsDifference = (providedDate.getFullYear() - startDate.getFullYear()) * 12 + (providedDate.getMonth() - startDate.getMonth());

        let preCloserTotalAmount;
        let preCloserPrincipleAmount;
        let preCloserInterestAmount;

        // Calculate pre-closer details based on the difference in months
        if (monthsDifference >= 3) {
            // Calculate pre-closer principle amount
            preCloserPrincipleAmount = user.loanDetails.totalPrincipalAmount;

            // Calculate pre-closer interest amount
            preCloserInterestAmount = user.loanDetails.instalmentObject.reduce((total, installment) => {
                if (installment.isPaid) {
                    return total + installment.interestAmount;
                }
                return total;
            }, 0);

            // Calculate pre-closer total amount
            preCloserTotalAmount = user.loanDetails.totalEmiAndOverdueToBePaid;

        } else {
            // Calculate pre-closer total amount
            const variable = user.loanDetails.totalPrincipalAmount * 0.036; // 3.6% of totalPrincipalAmount
            preCloserTotalAmountForTotalPrinciple= (variable * 3) + user.loanDetails.totalPrincipalAmount;
            preCloserTotalAmount =  preCloserTotalAmountForTotalPrinciple - user.loanDetails.totalEmiAlreadyPaid;

            // Calculate pre-closer total interest amount
            preCloserInterestAmountForPaidLoan = user.loanDetails.instalmentObject.reduce((total, installment) => {
                if (installment.isPaid) {
                    
                    return total + installment.interestAmount;
                }
                return total;
            }, 0);
                 preCloserPrincipleAmount = user.loanDetails.totalPrincipalAmount,
              preCloserInterestAmount =  (preCloserTotalAmountForTotalPrinciple - preCloserPrincipleAmount   )+ preCloserInterestAmountForPaidLoan 
            
        }

        // Return calculated pre-closer details in the response
        return res.status(200).json({
            preCloserTotalAmount,
            preCloserPrincipleAmount, 
            preCloserInterestAmount
        });

    } catch (error) {
        console.error('Error calculating pre-closer details:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});



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

// Mount routers
app.use('/api/loan', loanRouter);
app.use('/filter', filterDashboardRouter);
app.use('/api', authRouter);

module.exports = app;
