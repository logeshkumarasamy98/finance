const UserModel = require('../model/loanModel');
const ledgerModel = require('./../model/ledgerModel');

const {updateOverdueInstallmentsForOne, updateLoanDetails, updateLoanStatus} = require('../customFunctions/loanFunctions')
const {updateOverdueInstallments} = require('../customFunctions/overDueCalculator')

// exports.createUser = async (req, res) => {
//     const session = await UserModel.startSession();
//     session.startTransaction();
//     try {
//         const lastUser = await UserModel.findOne({}, {}, { sort: { 'loanNumber': -1 } }).session(session);
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

//         // Directly pass req.body to the UserModel constructor
//         const user = new UserModel({ loanNumber: newLoanNumber, debitReceiptNumber: newReceiptNumber, ...req.body });
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


exports.createUser = async (req, res) => {
    const session = await UserModel.startSession();
    session.startTransaction();
    try {
        const lastUser = await UserModel.findOne({}, {}, { sort: { 'loanNumber': -1 } }).session(session);
        let lastLoanNumber = 0;
        if (lastUser && !isNaN(lastUser.loanNumber)) {
            lastLoanNumber = lastUser.loanNumber;
        }
        const newLoanNumber = lastLoanNumber + 1;

        // Get the last debitReceiptNumber
        const lastDebitReceiptNumber = lastUser ? lastUser.debitReceiptNumber : "D-0";
        const lastReceiptNumberMatch = lastDebitReceiptNumber.match(/D-(\d+)/);
        let lastReceiptNumber = 0;
        if (lastReceiptNumberMatch && lastReceiptNumberMatch[1]) {
            lastReceiptNumber = parseInt(lastReceiptNumberMatch[1]);
        }

        // Increment the last receipt number to get the new one
        const newReceiptNumber = `D-${lastReceiptNumber + 1}`;

        console.log("Last Debit Receipt Number:", lastDebitReceiptNumber);
        console.log("New Debit Receipt Number:", newReceiptNumber);

        // Directly pass req.body to the UserModel constructor
        const user = new UserModel({ loanNumber: newLoanNumber, debitReceiptNumber: newReceiptNumber, ...req.body });
        await user.save({ session });
        
        // Call updateOverdueInstallmentsForOne with the new loan number
        await updateOverdueInstallmentsForOne(newLoanNumber, session);

        // Creating ledger entry
        const ledgerEntry = new ledgerModel({
            isLoanDebit: true,
            loanNumber: newLoanNumber,
            receiptNumber: newReceiptNumber, // Including 'D-' prefix
            remarks: req.body.details.loanPayerDetails.name,
            total: req.body.loanDetails.totalPrincipalAmount,
            creditOrDebit: 'Debit',
            paymentMethod: req.body.paymentMethod
        });
        await ledgerEntry.save({ session });

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        // Call updateLoanDetails with the new loan number
        await updateLoanDetails(newLoanNumber);

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

exports.getUsers = async(req, res)=>{
    try{
      const loanNumber = req.params.loanNumber;
      const user = await UserModel.findOne({loanNumber });
  
      if(!user) {
        return res.status(404).json({error: 'User Not Found'})
      }
      res.status(200).json({ status: 'success', user });
    }catch(err){
      res.status(400).json({error: err.message});
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        let query = UserModel.find();

        if(req.query.fields){
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        }
        const users = await query.exec();

        if (!users || users.length === 0) {
            return res.status(404).json({ error: 'No users found' });
        }

        res.status(200).json({ status: 'success', length: users.length, users });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// exports.updateLoanPayer = async (req, res) => {
//     const session = await UserModel.startSession();
//     session.startTransaction();
//     try {
//         const { installmentNo, emiPaid, overdueAmount, overduePaid, paidDate } = req.body;

//         // Find the user by loanNumber
//         const user = await UserModel.findOne({ loanNumber: req.params.loanNumber }).session(session);

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


exports.updateLoanPayer = async (req, res) => {
    try {
        const { installmentNo, emiPaid, overdueAmount, overduePaid, paidDate } = req.body;

        // Find the user by loanNumber
        const user = await UserModel.findOne({ loanNumber: req.params.loanNumber });

        // Check if user is found
        if (!user) {
            return res.status(404).json({ error: 'User not found with loan number provided' });
        }

        // Find the highest receipt number across all loan numbers
        const highestReceiptEntry = await ledgerModel.findOne({}).sort({ receiptNumberHid: -1 }); // Sort by receiptNumberHid

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

        // If emiPaid is not equal to totalEmiAmountRoundoff, return an error
        if (emiPaid !== installmentObject.totalEmiAmountRoundoff) {
            return res.status(400).json({ error: 'emiPaid should be equal to totalEmiAmountRoundoff for this installment' });
        }

        // Update installment object properties
        installmentObject.emiPaid = emiPaid;
        installmentObject.isPaid = true; // Set isPaid to true since emiPaid equals totalEmiAmountRoundoff

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

        // Get user's name from loanPayerDetails
        const remarks = user.details.loanPayerDetails.name;
        const total = Number(installmentObject.totalEmiAmountRoundoff) + Number(overdueAmount);
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
            paymentMethod: req.body.paymentMethod
        });
        await ledgerEntry.save();

        const installmentDetails = {
            loanNumber: user.loanNumber,
            installmentNo: installmentObject.installmentNo,
            interestAmount: installmentObject.interestAmount,
            principleAmountPerMonth: installmentObject.principleAmountPerMonth,
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
            pincode 
        };

        res.status(200).json({ message: 'Loan payer updated successfully', installmentDetails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
