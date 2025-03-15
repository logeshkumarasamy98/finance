const loanModel = require('../model/loanModel');
const ledgerModel = require('./../model/ledgerModel');
const companyModel = require('./../model/company');
const userModel = require('./../model/authModel');
const mongoose = require('mongoose');

const { updateOverdueInstallmentsForOne, updateLoanDetails, updateLoanStatus } = require('../customFunctions/loanFunctions');
const { sendSuccessResponse } = require('../utils/responseHandler'); // Import sendSuccessResponse function


const { handleError } = require('../utils/responseHandler'); // Import handleError function

const { updateOverdueInstallments } = require('../customFunctions/overDueCalculator');

const counterSchema = new mongoose.Schema({
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    debitReceiptNumber: { type: Number, default: 0 },
});

const Counter = mongoose.model('Counter', counterSchema);

exports.createUser = async (req, res) => {
    const session = await loanModel.startSession();
    session.startTransaction();

    try {
        const companyId = req.companyId;

        // Increment debitReceiptNumber atomically
        const counter = await Counter.findOneAndUpdate(
            { company: companyId },
            { $inc: { debitReceiptNumber: 1 } },
            { new: true, upsert: true, session }
        );

        const newReceiptNumber = `D-${counter.debitReceiptNumber}`;

        // Get the last loan number
        const lastUser = await loanModel.findOne({ company: companyId }, {}, { sort: { loanNumber: -1 } }).session(session);
        const lastLoanNumber = lastUser?.loanNumber || 0;
        const newLoanNumber = lastLoanNumber + 1;

        // Create a new loan document
        const user = new loanModel({
            loanNumber: newLoanNumber,
            debitReceiptNumber: newReceiptNumber,
            createdBy: req.userId,
            company: companyId,
            ...req.body
        });

        await user.save({ session });

        // Create ledger entry
        const ledgerEntry = new ledgerModel({
            isLoanDebit: true,
            loanNumber: newLoanNumber,
            receiptNumber: newReceiptNumber,
            remarks: req.body.details.loanPayerDetails.name,
            total: req.body.loanDetails.totalPrincipalAmount,
            creditOrDebit: 'Debit',
            paymentMethod: req.body.paymentMethod,
            createdBy: req.userId,
            company: companyId
        });

        await ledgerEntry.save({ session });

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        // Update loan details
        await updateLoanDetails(newLoanNumber);
        await updateOverdueInstallmentsForOne(newLoanNumber);

        sendSuccessResponse(res, 'User created successfully', user);
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        handleError(res, err);
    }
};

exports.createUserWithManualLoanNumber = async (req, res) => {
    const session = await loanModel.startSession();
    session.startTransaction();

    try {
        const companyId = req.companyId;
        const manualLoanNumber = req.body.loanNumber;

        // Check if the provided loan number already exists
        const existingLoan = await loanModel.findOne({ company: companyId, loanNumber: manualLoanNumber });
        if (existingLoan) {
            throw new Error(`Loan number ${manualLoanNumber} already exists`);
        }

        // Increment debitReceiptNumber atomically
        const counter = await Counter.findOneAndUpdate(
            { company: companyId },
            { $inc: { debitReceiptNumber: 1 } },
            { new: true, upsert: true, session }
        );

        const newReceiptNumber = `D-${counter.debitReceiptNumber}`;

        // Create a new loan document
        const user = new loanModel({
            loanNumber: manualLoanNumber,
            debitReceiptNumber: newReceiptNumber,
            createdBy: req.userId,
            company: companyId,
            ...req.body
        });

        await user.save({ session });

        // Create ledger entry
        const ledgerEntry = new ledgerModel({
            isLoanDebit: true,
            loanNumber: manualLoanNumber,
            receiptNumber: newReceiptNumber,
            remarks: req.body.details.loanPayerDetails.name,
            total: req.body.loanDetails.totalPrincipalAmount,
            creditOrDebit: 'Debit',
            paymentMethod: req.body.paymentMethod,
            createdBy: req.userId,
            company: companyId
        });

        await ledgerEntry.save({ session });

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        // Update loan details
        await updateLoanDetails(manualLoanNumber);
        await updateOverdueInstallmentsForOne(manualLoanNumber);

        sendSuccessResponse(res, 'User created successfully', user);
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.status(422).json({ status: 'error', message: err.message, error: err });
    }
};

exports.deleteLoan = async (req, res) => {
    const session = await loanModel.startSession();
    session.startTransaction();

    try {
        const { loanNumber } = req.params; // Assuming loanNumber is passed as a parameter
        const companyId = req.companyId;

        // Find the loan to delete
        const loanToDelete = await loanModel.findOne({ loanNumber, company: companyId }).session(session);

        if (!loanToDelete) {
            throw new Error('Loan not found');
        }

        // Delete the loan
        await loanModel.deleteOne({ loanNumber, company: companyId }).session(session);

        // Delete associated ledger entry
        await ledgerModel.deleteOne({ loanNumber, company: companyId }).session(session);

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        sendSuccessResponse(res, 'Loan and associated ledger entry deleted successfully');
    } catch (err) {
        // Rollback the transaction
        await session.abortTransaction();
        session.endSession();
        handleError(res, err);
    }
};

exports.getUsers = async (req, res) => {
    try {
        const { loanNumber } = req.params;
        const companyId = req.companyId; // Assuming companyId is available in the request object

        // Find the loan by loanNumber and companyId
        const user = await loanModel.findOne({ loanNumber, company: companyId });

        // Check if the loan was found
        if (!user) {
            return res.status(404).json({ error: 'Loan not found' });
        }

        // Fetch company details
        const company = await companyModel.findById(user.company);
        const companyName = company ? company.name : null;

        // Fetch user details who created the entry
        const createdByUser = await userModel.findById(user.createdBy);
        const createdByName = createdByUser ? createdByUser.name : null;

        // Send the response with the user
        sendSuccessResponse(res, 'User retrieved successfully', { user, companyName, createdByName });
    } catch (err) {
        // Handle errors and send a response
        handleError(res, err);
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        // Initialize query to find users belonging to the authenticated user's company
        let query = loanModel.find({ company: req.companyId });

        // Select specific fields if specified in the query parameters
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        }

        // Execute the query
        const users = await query.exec();

        // Check if users were found
        if (!users || users.length === 0) {
            return res.status(404).json({ error: 'No users found' });
        }

        // Send the response with the users
        sendSuccessResponse(res, 'Users retrieved successfully', { length: users.length, users });
    } catch (err) {
        handleError(res, err);
    }
};

exports.updateLoanPayer = async (req, res) => {
    try {
        const {
            installmentNo,
            emiPaid,
            overdueAmount,
            overduePaid,
            paidDate,
            principleAmountPaid
        } = req.body;
        const companyId = req.companyId; // Assuming companyId is available in the request object
        const userId = req.userId; // Assuming userId is available in the request object

        // Find the user by loanNumber and company
        const user = await loanModel.findOne({ loanNumber: req.params.loanNumber, company: companyId });

        // Check if user is found
        if (!user) {
            return res.status(404).json({ error: 'User not found with the provided loan number for the specified company' });
        }

        // Find the highest receipt number across all loan numbers for the company
        const highestReceiptEntry = await ledgerModel.findOne({ company: companyId }).sort({ receiptNumberHid: -1 });

        let newReceiptNumberHid = 1; // Default value if no entries found
        if (highestReceiptEntry) {
            // If entry exists, increment the last used receipt number hid by one
            newReceiptNumberHid = highestReceiptEntry.receiptNumberHid + 1;
        }

        // Find the installment object that matches the installment number
        const installmentObject = user.loanDetails.instalmentObject.find(installment => installment.installmentNo === installmentNo);

        // Check if installment is already paid
        if (installmentObject.isPaid) {
            return res.status(400).json({ error: 'Installment is already paid' });
        }

        // Update extra EMI paid if any
        if (emiPaid !== installmentObject.totalEmiAmountRoundoff) {
            const extraEmiPaid = emiPaid - installmentObject.totalEmiAmountRoundoff;
            user.loanDetails.loanExtraPaid += extraEmiPaid;
        }

        // Update installment object properties
        installmentObject.emiPaid = emiPaid;
        installmentObject.isPaid = true; // Set isPaid to true since emiPaid equals totalEmiAmountRoundoff
        installmentObject.principleAmountPaid = principleAmountPaid; // Set principleAmountPaid from request body
        installmentObject.updatedBy = userId; // Add updatedBy field with userId

        // Update overdueAmount and overduePaid
        installmentObject.overdueAmount = overdueAmount;
        installmentObject.overduePaid = overduePaid;
        // Calculate overDueBalance
        const overDueBalance = overdueAmount - overduePaid;
        installmentObject.overDueBalance = overDueBalance;

        // Patch receipt number
        const receiptNumber = `C-${newReceiptNumberHid}`;
        installmentObject.receiptNumber = receiptNumber;

        if (paidDate) {
            installmentObject.paidDate = paidDate;
        }

        await user.save();
        await updateLoanDetails(req.params.loanNumber);
        await updateOverdueInstallmentsForOne(req.params.loanNumber);
        await updateLoanStatus(req.params.loanNumber);

        // Get user's name, address, and mobile number from loanPayerDetails
        const { name, mobileNum1, address, pincode } = user.details.loanPayerDetails;
        const remarks = name; // Use user's name for remarks
        const total = Number(installmentObject.totalEmiAmountRoundoff) + Number(overduePaid);

        // Creating ledger entry
        const ledgerEntry = new ledgerModel({
            isLoanCredit: true, // Credit entry
            loanNumber: req.params.loanNumber,
            receiptNumber, // Construct receiptNumber with "C-" prefix
            receiptNumberHid: newReceiptNumberHid, // Update receiptNumberHid
            remarks,
            principle: installmentObject.principleAmountPerMonth,
            interest: installmentObject.interestAmount,
            overDue: overduePaid,
            total,
            creditOrDebit: 'Credit',
            paymentMethod: req.body.paymentMethod,
            createdBy: req.userId, // Set the createdBy field to the userId
            company: companyId // Ensure the ledger entry is associated with the correct company
        });
        await ledgerEntry.save();
        const company = await companyModel.findById(companyId);

        // Fetch the user details who created the entry
        const createdByUser = await userModel.findById(userId);
        const installmentDetails = {
            loanNumber: user.loanNumber,
            installmentNo: installmentObject.installmentNo,
            interestAmount: installmentObject.interestAmount,
            principleAmountPerMonth: installmentObject.principleAmountPerMonth,
            principleAmountPaid: installmentObject.principleAmountPaid, // Include principleAmountPaid in response
            totalPrincipalAmount: user.loanDetails.totalPrincipalAmount,
            overdueAmount: installmentObject.overdueAmount,
            overduePaid: installmentObject.overduePaid,
            overDueBalance: installmentObject.overDueBalance,
            receiptNumber,
            paidDate: installmentObject.paidDate,
            dueDate: installmentObject.dueDate,
            name,
            mobileNum1,
            address,
            pincode,
            company: company.name, // Access company's name directly
            createdBy: createdByUser.name
        };

        res.status(200).json({ message: 'Loan payer updated successfully', installmentDetails });
    } catch (error) {
        console.error(error);
        handleError(res, error);
    }
};

exports.updateLoanDocumentsDetails = async (req, res) => {
    try {
        const companyId = req.companyId; // Extracted from the auth middleware
        const { loanNumber, isDocumentSettled, reloanElegible, settledToName, settledDate } = req.body;

        // Validate input
        if (!loanNumber) {
            return res.status(400).json({ message: 'Loan number is required' });
        }

        if (!companyId) {
            return res.status(403).json({ message: 'Unauthorized: Company ID is required' });
        }

        // Filter by companyId and loanNumber, then update
        const updatedLoan = await loanModel.findOneAndUpdate(
            { loanNumber, company: companyId }, // Match loanNumber and companyId
            {
                $set: {
                    'loanDetails.isDocumentSettled': isDocumentSettled,
                    'loanDetails.documents.reloanElegible': reloanElegible,
                    'loanDetails.documents.settledToName': settledToName,
                    'loanDetails.documents.settledDate': settledDate,
                },
            },
            { new: true, runValidators: true } // Return the updated document
        );

        if (!updatedLoan) {
            return res.status(404).json({ message: 'Loan not found or does not belong to this company' });
        }

        res.status(200).json({
            message: 'Loan details updated successfully',
            updatedFields: {
                loanNumber,
                isDocumentSettled,
                reloanElegible,
                settledToName,
                settledDate,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating the loan details', error });
    }
};
