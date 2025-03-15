const { handleError, sendSuccessResponse } = require('../utils/responseHandler');
const ledgerModel = require('./../model/ledgerModel');

exports.expense = async (req, res) => {
    const session = await ledgerModel.startSession();
    session.startTransaction();
    try {
        const { paymentMethod, remarks, total } = req.body;
        const entryDate = req.body.entryDate;
        const companyId = req.companyId;
        const userId = req.userId;
        const isExpense = true;

        const newEntry = new ledgerModel({
            paymentMethod,
            remarks,
            total,
            isExpense,
            creditOrDebit: 'Debit',
            entryDate,
            createdBy: userId,
            company: companyId
        });

        await newEntry.save({ session });

        await session.commitTransaction();
        session.endSession();

        sendSuccessResponse(res, 'Ledger entry created successfully.');
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        handleError(res, error);
    }
};

exports.investment = async (req, res) => {
    const session = await ledgerModel.startSession();
    session.startTransaction();
    try {
        const { paymentMethod, remarks, total } = req.body;
        const entryDate = req.body.entryDate; // Use provided entry date or current date if not provided
        const companyId = req.companyId; // Assuming companyId is available in the request object
        const userId = req.userId;
        // Set isInvestment to true
        const isInvestment = true;

        // Set creditOrDebit to "Credit"
        const creditOrDebit = "Credit";

        // Create a new ledger entry
        const newEntry = new ledgerModel({
            paymentMethod,
            remarks,
            total,
            isInvestment,
            creditOrDebit,
            entryDate, 
            createdBy: userId, 
            company: companyId
        });

        // Save the new entry to the database
        await newEntry.save({ session });

        await session.commitTransaction();
        session.endSession();

        sendSuccessResponse(res, 'Investment ledger entry created successfully.');
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        handleError(res, error);
    }
};
