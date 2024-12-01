const loanModel = require('../model/loanModel');
const ledgerModel = require('./../model/ledgerModel');
const companyModel = require('./../model/company');
const userModel = require('./../model/authModel');


const {updateOverdueInstallmentsForOne, updateLoanDetails, updateLoanStatus} = require('../customFunctions/loanFunctions')
const {updateOverdueInstallments} = require('../customFunctions/overDueCalculator')

// exports.createUser = async (req, res) => {
//     const session = await loanModel.startSession();
//     session.startTransaction();
//     try {
//         const lastUser = await loanModel.findOne({}, {}, { sort: { 'loanNumber': -1 } }).session(session);
//         let lastLoanNumber = 0;
//         if (lastUser && !isNaN(lastUser.loanNumber)) {
//             lastLoanNumber = lastUser.loanNumber;
//         }
//         const newLoanNumber = lastLoanNumber + 1;

//         // Get the last debitReceiptNumber
//         const lastDebitReceiptNumber = lastUser ? lastUser.debitReceiptNumber : "D-0";
//         const lastReceiptNumberMatch = lastDebitReceiptNumber.match(/D-(\d+)/);
//         let lastReceiptNumber = 0;
//         if (lastReceiptNumberMatch && lastReceiptNumberMatch[1]) {
//             lastReceiptNumber = parseInt(lastReceiptNumberMatch[1]);
//         }

//         // Increment the last receipt number to get the new one
//         const newReceiptNumber = `D-${lastReceiptNumber + 1}`;

//         console.log("Last Debit Receipt Number:", lastDebitReceiptNumber);
//         console.log("New Debit Receipt Number:", newReceiptNumber);

//         // Directly pass req.body to the loanModel constructor
//         const user = new loanModel({ loanNumber: newLoanNumber, debitReceiptNumber: newReceiptNumber, ...req.body });
//         await user.save({ session });
        
//         // Call updateOverdueInstallmentsForOne with the new loan number
//         await updateOverdueInstallmentsForOne(newLoanNumber, session);

//         // Creating ledger entry
//         const ledgerEntry = new ledgerModel({
//             isLoanDebit: true,
//             loanNumber: newLoanNumber,
//             receiptNumber: newReceiptNumber, // Including 'D-' prefix
//             remarks: req.body.details.loanPayerDetails.name,
//             total: req.body.loanDetails.totalPrincipalAmount,
//             creditOrDebit: 'Debit',
//             paymentMethod: req.body.paymentMethod
//         });
//         await ledgerEntry.save({ session });

//         await session.commitTransaction();
//         session.endSession();

//         res.status(201).json({ status: 'success', message: 'User created successfully', user });
//     } catch (err) {
//         await session.abortTransaction();
//         session.endSession();
//         res.status(422).json({ status: 'error', message: 'All fields required', error: err });
//         console.log(err);
//     }
// };


// exports.createUser = async (req, res) => {
//     const session = await loanModel.startSession();
//     session.startTransaction();
//     try {
//         const lastUser = await loanModel.findOne({}, {}, { sort: { 'loanNumber': -1 } }).session(session);
//         let lastLoanNumber = 0;
//         if (lastUser && !isNaN(lastUser.loanNumber)) {
//             lastLoanNumber = lastUser.loanNumber;
//         }
//         const newLoanNumber = lastLoanNumber + 1;

//         // Get the last debitReceiptNumber
//         const lastDebitReceiptNumber = lastUser ? lastUser.debitReceiptNumber : "D-0";
//         const lastReceiptNumberMatch = lastDebitReceiptNumber.match(/D-(\d+)/);
//         let lastReceiptNumber = 0;
//         if (lastReceiptNumberMatch && lastReceiptNumberMatch[1]) {
//             lastReceiptNumber = parseInt(lastReceiptNumberMatch[1]);
//         }

//         // Increment the last receipt number to get the new one
//         const newReceiptNumber = `D-${lastReceiptNumber + 1}`;
        
//         console.log("Last Debit Receipt Number:", lastDebitReceiptNumber);
//         console.log("New Debit Receipt Number:", newReceiptNumber);
//         console.log(req.userId);
//         // Directly pass req.body to the loanModel constructor
//         const user = new loanModel({ 
//             loanNumber: newLoanNumber, 
//             debitReceiptNumber: newReceiptNumber, 
//             createdBy: req.userId, // Set the createdBy field to the userId
//             company: req.companyId, // Set the company field to the companyId
//             ...req.body 
//         });
//          await user.save({ session });
        
//         // Call updateOverdueInstallmentsForOne with the new loan number
//         await updateOverdueInstallmentsForOne(newLoanNumber, session);

//         // Creating ledger entry
//         const ledgerEntry = new ledgerModel({
//             isLoanDebit: true,
//             loanNumber: newLoanNumber,
//             receiptNumber: newReceiptNumber, // Including 'D-' prefix
//             remarks: req.body.details.loanPayerDetails.name,
//             total: req.body.loanDetails.totalPrincipalAmount,
//             creditOrDebit: 'Debit',
//             paymentMethod: req.body.paymentMethod
//         });
//         await ledgerEntry.save({ session });

//         // Commit the transaction
//         await session.commitTransaction();
//         session.endSession();

//         // Call updateLoanDetails with the new loan number
//         await updateLoanDetails(newLoanNumber);

//         // Send response
//         res.status(201).json({ status: 'success', message: 'User created successfully', user });
//     } catch (err) {
//         // Handle errors
//         await session.abortTransaction();
//         session.endSession();
//         res.status(422).json({ status: 'error', message: 'All fields required', error: err });
//         console.log(err);
//     }
// };

exports.createUser = async (req, res) => {
    const session = await loanModel.startSession();
    session.startTransaction();
    try {
        const companyId = req.companyId;

        // Find the last user based on the company ID
        const lastUser = await loanModel.findOne({ company: companyId }, {}, { sort: { 'loanNumber': -1 } }).session(session);

        let lastLoanNumber = 0;
        if (lastUser && !isNaN(lastUser.loanNumber)) {
            lastLoanNumber = lastUser.loanNumber;
        }
        const newLoanNumber = lastLoanNumber + 1;

        // Get the last debitReceiptNumber for the specific company
        const lastDebitReceiptUser = await loanModel.findOne({ company: companyId }, {}, { sort: { 'debitReceiptNumber': -1 } }).session(session);
        const lastDebitReceiptNumber = lastDebitReceiptUser ? lastDebitReceiptUser.debitReceiptNumber : "D-0";
        const lastReceiptNumberMatch = lastDebitReceiptNumber.match(/D-(\d+)/);
        let lastReceiptNumber = 0;
        if (lastReceiptNumberMatch && lastReceiptNumberMatch[1]) {
            lastReceiptNumber = parseInt(lastReceiptNumberMatch[1]);
        }

        // Increment the last receipt number to get the new one
        const newReceiptNumber = `D-${lastReceiptNumber + 1}`;

        console.log("Last Debit Receipt Number:", lastDebitReceiptNumber);
        console.log("New Debit Receipt Number:", newReceiptNumber);
        console.log(req.userId);

        // Directly pass req.body to the loanModel constructor
        const user = new loanModel({
            loanNumber: newLoanNumber,
            debitReceiptNumber: newReceiptNumber,
            createdBy: req.userId, // Set the createdBy field to the userId
            company: companyId, // Set the company field to the companyId
            ...req.body
        });

        await user.save({ session });

        // Call updateOverdueInstallmentsForOne with the new loan number
        // await updateOverdueInstallmentsForOne(newLoanNumber, session);

        // Creating ledger entry
        const ledgerEntry = new ledgerModel({
            isLoanDebit: true,
            loanNumber: newLoanNumber,
            receiptNumber: newReceiptNumber, // Including 'D-' prefix
            remarks: req.body.details.loanPayerDetails.name,
            total: req.body.loanDetails.totalPrincipalAmount,
            creditOrDebit: 'Debit',
            paymentMethod: req.body.paymentMethod,
            createdBy: req.userId, // Set the createdBy field to the userId
            company: companyId
        });
        await ledgerEntry.save({ session });

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        // Call updateLoanDetails with the new loan number
        await updateLoanDetails(newLoanNumber);
        await updateOverdueInstallmentsForOne(newLoanNumber);
        // Send response
        res.status(201).json({ status: 'success', message: 'User created successfully', user });
    } catch (err) {
        // Handle errors
        await session.abortTransaction();
        session.endSession();
        res.status(422).json({ status: 'error', message: 'All fields required', error: err });
        console.log(err);
    }
};

// exports.getUsers = async(req, res)=>{
//     try{
//       const loanNumber = req.params.loanNumber;
//       const user = await loanModel.findOne({loanNumber });
  
//       if(!user) {
//         return res.status(404).json({error: 'User Not Found'})
//       }
//       res.status(200).json({ status: 'success', user });
//     }catch(err){
//       res.status(400).json({error: err.message});
//     }
// };|

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
        res.status(200).json({ status: 'success', user, companyName,  createdByName });
    } catch (err) {
        // Handle errors and send a response
        res.status(400).json({ error: err.message });
    }
};

exports.deleteLoan = async (req, res) => {
    try {
        const { loanNumber } = req.params;
        const companyId = req.companyId; // Assuming companyId is available in the request object

        // Find and delete the loan by loanNumber and companyId
        const deletedLoan = await loanModel.findOneAndDelete({ loanNumber, company: companyId });

        // Check if the loan was found and deleted
        if (!deletedLoan) {
            return res.status(404).json({ error: 'Loan not found' });
        }

        // Send a success response
        res.status(200).json({ status: 'success', message: 'Loan successfully deleted', deletedLoan });
    } catch (err) {
        // Handle errors and send a response
        res.status(400).json({ error: err.message });
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
        res.status(200).json({ status: 'success', length: users.length, users });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// exports.updateLoanPayer = async (req, res) => {
//     const session = await loanModel.startSession();
//     session.startTransaction();
//     try {
//         const { installmentNo, emiPaid, overdueAmount, overduePaid, paidDate } = req.body;

//         // Find the user by loanNumber
//         const user = await loanModel.findOne({ loanNumber: req.params.loanNumber }).session(session);

//         // Check if user is found
//         if (!user) {
//             await session.abortTransaction();
//             session.endSession();
//             return res.status(404).json({ error: 'User not found with loan number provided' });
//         }

//         // Find the highest receipt number across all loan numbers
//         const highestReceiptEntry = await ledgerModel.findOne({}).sort({ receiptNumberHid: -1 }).session(session); // Sort by receiptNumberHid

//         let newReceiptNumberHid = 1; // Default value if no entries found
//         if (highestReceiptEntry) {
//             // If entry exists, increment the last used receipt number hid by one
//             newReceiptNumberHid = highestReceiptEntry.receiptNumberHid + 1;
//         }

//         // Find the installment object that matches the installment number
//         const installmentObject = user.loanDetails.instalmentObject.find(installment => installment.installmentNo === installmentNo);

//         // Check if installment is already paid
//         if (installmentObject.isPaid) {
//             await session.abortTransaction();
//             session.endSession();
//             return res.status(400).json({ error: 'Installment is already paid' });
//         }

//         // If emiPaid is not equal to totalEmiAmountRoundoff, return an error
//         if (emiPaid !== installmentObject.totalEmiAmountRoundoff) {
//             await session.abortTransaction();
//             session.endSession();
//             return res.status(400).json({ error: 'emiPaid should be equal to totalEmiAmountRoundoff for this installment' });
//         }

//         // Update installment object properties
//         installmentObject.emiPaid = emiPaid;
//         installmentObject.isPaid = true; // Set isPaid to true since emiPaid equals totalEmiAmountRoundoff

//         // Update overdueAmount and overduePaid
//         installmentObject.overdueAmount = overdueAmount;
//         installmentObject.overduePaid = overduePaid;
//         // Calculate overDueBalance
//         const overDueBalance = overdueAmount - overduePaid;
//         installmentObject.overDueBalance = overDueBalance;

//         // Patch receipt number
//         const receiptNumber = `C-${newReceiptNumberHid}`;
//         installmentObject.receiptNumber = receiptNumber;

//         if (paidDate) {
//             installmentObject.paidDate = paidDate;
//         }

//         await user.save({ session });

//         // Update loan details, overdue installments, and loan status without session
//         await updateLoanDetails(req.params.loanNumber);
//         await updateOverdueInstallmentsForOne(req.params.loanNumber);
//         await updateLoanStatus(req.params.loanNumber);

//         // Get user's name, address, and mobile number from loanPayerDetails
//         const { name, mobileNum1, address, pincode } = user.details.loanPayerDetails;

//         // Get user's name from loanPayerDetails
//         const remarks = user.details.loanPayerDetails.name;
//         const total = Number(installmentObject.totalEmiAmountRoundoff) + Number(overdueAmount);
//         // Creating ledger entry
//         const ledgerEntry = new ledgerModel({
//             isLoanCredit: true, // Credit entry
//             loanNumber: req.params.loanNumber,
//             receiptNumber, // Construct receiptNumber with "C-" prefix
//             receiptNumberHid: newReceiptNumberHid, // Update receiptNumberHid
//             remarks,
//             principle: installmentObject.principleAmountPerMonth,
//             interest: installmentObject.interestAmount,
//             overDue: overduePaid,
//             total,
//             creditOrDebit: 'Credit',
//             paymentMethod: req.body.paymentMethod
//         });
//         await ledgerEntry.save({ session });

//         const installmentDetails = {
//             loanNumber: user.loanNumber,
//             installmentNo: installmentObject.installmentNo,
//             interestAmount: installmentObject.interestAmount,
//             principleAmountPerMonth: installmentObject.principleAmountPerMonth,
//             totalPrincipalAmount: user.loanDetails.totalPrincipalAmount,
//             overdueAmount: installmentObject.overdueAmount,
//             overduePaid: installmentObject.overduePaid,
//             overDueBalance: installmentObject.overDueBalance,
//             receiptNumber,
//             paidDate: installmentObject.paidDate,
//             dueDate: installmentObject.dueDate, 
//             name, 
//             mobileNum1, 
//             address,
//             pincode 
//         };

//         await session.commitTransaction();
//         session.endSession();

//         res.status(200).json({ message: 'Loan payer updated successfully', installmentDetails });
//     } catch (error) {
//         await session.abortTransaction();
//         session.endSession();
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };


// exports.updateLoanPayer = async (req, res) => {
//     try {
//         const { installmentNo, emiPaid, overdueAmount, overduePaid, paidDate } = req.body;

//         // Find the user by loanNumber
//         const user = await loanModel.findOne({ loanNumber: req.params.loanNumber });

//         // Check if user is found
//         if (!user) {
//             return res.status(404).json({ error: 'User not found with loan number provided' });
//         }

//         // Find the highest receipt number across all loan numbers
//         const highestReceiptEntry = await ledgerModel.findOne({}).sort({ receiptNumberHid: -1 }); // Sort by receiptNumberHid

//         let newReceiptNumberHid = 1; // Default value if no entries found
//         if (highestReceiptEntry) {
//             // If entry exists, increment the last used receipt number hid by one
//             newReceiptNumberHid = highestReceiptEntry.receiptNumberHid + 1;
//         }

//         // Find the installment object that matches the installment number
//         const installmentObject = user.loanDetails.instalmentObject.find(installment => installment.installmentNo === installmentNo);

//         // Check if installment is already paid
//         if (installmentObject.isPaid) {
//             return res.status(400).json({ error: 'Installment is already paid' });
//         }

//         // If emiPaid is not equal to totalEmiAmountRoundoff, return an error
//         if (emiPaid !== installmentObject.totalEmiAmountRoundoff) {
//             return res.status(400).json({ error: 'emiPaid should be equal to totalEmiAmountRoundoff for this installment' });
//         }

//         // Update installment object properties
//         installmentObject.emiPaid = emiPaid;
//         installmentObject.isPaid = true; // Set isPaid to true since emiPaid equals totalEmiAmountRoundoff

//         // Update overdueAmount and overduePaid
//         installmentObject.overdueAmount = overdueAmount;
//         installmentObject.overduePaid = overduePaid;
//         // Calculate overDueBalance
//         const overDueBalance = overdueAmount - overduePaid;
//         installmentObject.overDueBalance = overDueBalance;

//         // Patch receipt number
//         const receiptNumber = `C-${newReceiptNumberHid}`;
//         installmentObject.receiptNumber = receiptNumber;

//         if (paidDate) {
//             installmentObject.paidDate = paidDate;
//         }

//         await user.save();
//         await updateLoanDetails(req.params.loanNumber);
//         await updateOverdueInstallmentsForOne(req.params.loanNumber);
//         await updateLoanStatus(req.params.loanNumber);
//         // Get user's name, address, and mobile number from loanPayerDetails
//         const { name, mobileNum1, address, pincode } = user.details.loanPayerDetails;

//         // Get user's name from loanPayerDetails
//         const remarks = user.details.loanPayerDetails.name;
//         const total = Number(installmentObject.totalEmiAmountRoundoff) + Number(overdueAmount);
//         // Creating ledger entry
//         const ledgerEntry = new ledgerModel({
//             isLoanCredit: true, // Credit entry
//             loanNumber: req.params.loanNumber,
//             receiptNumber, // Construct receiptNumber with "C-" prefix
//             receiptNumberHid: newReceiptNumberHid, // Update receiptNumberHid
//             remarks,
//             principle: installmentObject.principleAmountPerMonth,
//             interest: installmentObject.interestAmount,
//             overDue: overduePaid,
//             total,
//             creditOrDebit: 'Credit',
//             paymentMethod: req.body.paymentMethod
//         });
//         await ledgerEntry.save();

//         const installmentDetails = {
//             loanNumber: user.loanNumber,
//             installmentNo: installmentObject.installmentNo,
//             interestAmount: installmentObject.interestAmount,
//             principleAmountPerMonth: installmentObject.principleAmountPerMonth,
//             totalPrincipalAmount: user.loanDetails.totalPrincipalAmount,
//             overdueAmount: installmentObject.overdueAmount,
//             overduePaid: installmentObject.overduePaid,
//             overDueBalance: installmentObject.overDueBalance,
//             receiptNumber,
//             paidDate: installmentObject.paidDate,
//             dueDate: installmentObject.dueDate, 
//             name, 
//             mobileNum1, 
//             address,
//             pincode 
//         };

//         res.status(200).json({ message: 'Loan payer updated successfully', installmentDetails });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };



// 512 is proper code

// exports.updateLoanPayer = async (req, res) => {
//     try {
//         const { installmentNo, emiPaid, overdueAmount, overduePaid, paidDate } = req.body;
//         const companyId = req.companyId; // Assuming companyId is available in the request object
//         const userId = req.userId; // Assuming userId is available in the request object

//         // Find the user by loanNumber and company
//         const user = await loanModel.findOne({ loanNumber: req.params.loanNumber, company: companyId });

//         // Check if user is found
//         if (!user) {
//             return res.status(404).json({ error: 'User not found with the provided loan number for the specified company' });
//         }

//         // Find the highest receipt number across all loan numbers for the company
//         const highestReceiptEntry = await ledgerModel.findOne({ company: companyId }).sort({ receiptNumberHid: -1 }); // Sort by receiptNumberHid

//         let newReceiptNumberHid = 1; // Default value if no entries found
//         if (highestReceiptEntry) {
//             // If entry exists, increment the last used receipt number hid by one
//             newReceiptNumberHid = highestReceiptEntry.receiptNumberHid + 1;
//         }

//         // Find the installment object that matches the installment number
//         const installmentObject = user.loanDetails.instalmentObject.find(installment => installment.installmentNo === installmentNo);

//         // Check if installment is already paid
//         if (installmentObject.isPaid) {
//             return res.status(400).json({ error: 'Installment is already paid' });
//         }

//         // If emiPaid is not equal to totalEmiAmountRoundoff, return an error
//         if (emiPaid !== installmentObject.totalEmiAmountRoundoff) {
//             return res.status(400).json({ error: 'emiPaid should be equal to totalEmiAmountRoundoff for this installment' });
//         }

//         // Update installment object properties
//         installmentObject.emiPaid = emiPaid;
//         installmentObject.isPaid = true; // Set isPaid to true since emiPaid equals totalEmiAmountRoundoff
//         installmentObject.updatedBy = userId; // Add updatedBy field with userId

//         // Update overdueAmount and overduePaid
//         installmentObject.overdueAmount = overdueAmount;
//         installmentObject.overduePaid = overduePaid;
//         // Calculate overDueBalance
//         const overDueBalance = overdueAmount - overduePaid;
//         installmentObject.overDueBalance = overDueBalance;

//         // Patch receipt number
//         const receiptNumber = `C-${newReceiptNumberHid}`;
//         installmentObject.receiptNumber = receiptNumber;

//         if (paidDate) {
//             installmentObject.paidDate = paidDate;
//         }

//         await user.save();
//         await updateLoanDetails(req.params.loanNumber);
//         await updateOverdueInstallmentsForOne(req.params.loanNumber);
//         await updateLoanStatus(req.params.loanNumber);

//         // Get user's name, address, and mobile number from loanPayerDetails
//         const { name, mobileNum1, address, pincode } = user.details.loanPayerDetails;

//         // Get user's name from loanPayerDetails
//         const remarks = user.details.loanPayerDetails.name;
//         const total = Number(installmentObject.totalEmiAmountRoundoff) + Number(overduePaid);
        
//         // Creating ledger entry
//         const ledgerEntry = new ledgerModel({
//             isLoanCredit: true, // Credit entry
//             loanNumber: req.params.loanNumber,
//             receiptNumber, // Construct receiptNumber with "C-" prefix
//             receiptNumberHid: newReceiptNumberHid, // Update receiptNumberHid
//             remarks,
//             principle: installmentObject.principleAmountPerMonth,
//             interest: installmentObject.interestAmount,
//             overDue: overduePaid,
//             total,
//             creditOrDebit: 'Credit',
//             paymentMethod: req.body.paymentMethod,
//             createdBy: req.userId, // Set the createdBy field to the userId
//             company: companyId // Ensure the ledger entry is associated with the correct company
//         });
//         await ledgerEntry.save();
//         const company = await companyModel.findById(companyId);

//         // Fetch the user details who created the entry
//         const createdByUser = await userModel.findById(userId);
//         const installmentDetails = {
//             loanNumber: user.loanNumber,
//             installmentNo: installmentObject.installmentNo,
//             interestAmount: installmentObject.interestAmount,
//             principleAmountPerMonth: installmentObject.principleAmountPerMonth,
//             totalPrincipalAmount: user.loanDetails.totalPrincipalAmount,
//             overdueAmount: installmentObject.overdueAmount,
//             overduePaid: installmentObject.overduePaid,
//             overDueBalance: installmentObject.overDueBalance,
//             receiptNumber,
//             paidDate: installmentObject.paidDate,
//             dueDate: installmentObject.dueDate,
//             name,
//             mobileNum1,
//             address,
//             pincode,
//             company: company.name, // Access company's name directly
//             createdBy: createdByUser.name
//         };

//         res.status(200).json({ message: 'Loan payer updated successfully', installmentDetails });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };


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
        res.status(500).json({ error: 'Internal server error' });
    }
};
