
const UserModel = require('../model/loanModel');
const ledgerModel = require('./../model/ledgerModel');

exports.calculate_pre_closer = async (req, res) => {
    const { loanNumber } = req.params;
    const { date } = req.body;

    try {
        // Find the user by loan number
        const user = await UserModel.findOne({ loanNumber });

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if date is provided
        if (!date) {
            return res.status(400).json({ error: 'Date is required' });
        }

        // Convert user input date to a Date object
        const providedDate = new Date(date);

        // Check if provided date is a valid date
        if (isNaN(providedDate.getTime())) {
            return res.status(400).json({ error: 'Invalid date format' });
        }

        // Check if user's loan details contain a start date
        if (!user.loanDetails.startDate) {
            return res.status(400).json({ error: 'Loan start date is missing' });
        }

        // Calculate the difference in months between the loan start date and provided date
        const startDate = new Date(user.loanDetails.startDate);
        const monthsDifference = (providedDate.getFullYear() - startDate.getFullYear()) * 12 + (providedDate.getMonth() - startDate.getMonth());

        let preCloserTotalAmount;
        let preCloserPrincipleAmount;
        let preCloserInterestAmount;
        let totalOverdueAmountToBePaid = user.loanDetails.totalOverdueAmountToBePaid;

        // Calculate pre-closer details based on the difference in months
        if (monthsDifference >= 4) {
            let sumOfPaidInstallments = 0;
            let sumOfUnpaidInstallmentsEmi = 0;
            let sumOfUnpaidInstallmentsInterest = 0;
            // let totalOverdueAmountToBePaid = user.loanDetails.totalOverdueAmountToBePaid
        
            // Iterate through the installment objects
            for (let i = 0; i < user.loanDetails.instalmentObject.length; i++) {
                if (user.loanDetails.instalmentObject[i].isPaid) {
                    sumOfPaidInstallments += user.loanDetails.instalmentObject[i].principleAmountPerMonth;
                } else {
                    sumOfUnpaidInstallmentsEmi += user.loanDetails.instalmentObject[i].principleAmountPerMonth;
                    sumOfUnpaidInstallmentsInterest += user.loanDetails.instalmentObject[i].interestAmount;
                }
            }
        
             preCloserPrincipleAmount = Math.round(sumOfUnpaidInstallmentsEmi);
             preCloserInterestAmount = sumOfUnpaidInstallmentsInterest;
             preCloserTotalAmount = Math.round(preCloserPrincipleAmount + preCloserInterestAmount);

            console.log("Sum of totalEmiAmountRoundoff for unpaid installments:", sumOfUnpaidInstallmentsEmi);
            console.log("Sum of interestAmount for unpaid installments:", sumOfUnpaidInstallmentsInterest);
            console.log("preCloserPrincipleAmount:", preCloserPrincipleAmount);
            console.log("preCloserInterestAmount:", preCloserInterestAmount);
            console.log("preCloserTotalAmount:", preCloserTotalAmount);

        } else {
            // Calculate pre-closer total amount
            const variable = user.loanDetails.totalPrincipalAmount * 0.036; // 3.6% of totalPrincipalAmount
            const preCloserTotalAmountForTotalPrinciple = (variable * 3) + user.loanDetails.totalPrincipalAmount;
            preCloserTotalAmount = preCloserTotalAmountForTotalPrinciple - user.loanDetails.totalEmiAlreadyPaid;

            preCloserPrincipleAmount = user.loanDetails.totalPrincipalAmount;
            // Calculate pre-closer interest amount
            preCloserInterestAmount = Math.round(variable * 3);
        }

        // Return calculated pre-closer details in the response
        return res.status(200).json({
            preCloserTotalAmount,
            preCloserPrincipleAmount,
            preCloserInterestAmount,
            totalOverdueAmountToBePaid
        });

    } catch (error) {
        console.error('Error calculating pre-closer details:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


exports.UpdatePrecloser = async (req, res) => {
    const { loanNumber } = req.params;
    const { date, OverdueforPrecloser, forceCloseApproverName } = req.body;

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
        if (user.loanDetails.preCloser.hasPreCloser) {
            session.endSession();
            return res.status(400).json({ error: 'This loan is already preclosed' });
        }

        // Check if the loan is already closed
        if (!user.loanDetails.isActive) {
            session.endSession();
            return res.status(400).json({ error: 'This loan is already closed' });
        }
        // Convert user input date to a Date object
        const providedDate = new Date(date);

        // Calculate the difference in months between the provided date and the loan start date
        const startDate = new Date(user.loanDetails.startDate);
        const monthsDifference = (providedDate.getFullYear() - startDate.getFullYear()) * 12 + (providedDate.getMonth() - startDate.getMonth());

        let preCloserTotalAmount;
        let preCloserPrincipleAmount;
        let preCloserInterestAmount;

        // Update pre-closer details based on the difference in months
        if (monthsDifference >= 4) {
            user.loanDetails.preCloser.isPrecloserBelow3Months = false;
            user.loanDetails.preCloser.isPrecloserAbove3Months = true;
            let sumOfPaidInstallments = 0;
            let sumOfUnpaidInstallmentsEmi = 0;
            let sumOfUnpaidInstallmentsInterest = 0;

            // Iterate through the installment objects
            for (let i = 0; i < user.loanDetails.instalmentObject.length; i++) {
                if (user.loanDetails.instalmentObject[i].isPaid) {
                    sumOfPaidInstallments += user.loanDetails.instalmentObject[i].principleAmountPerMonth;
                } else {
                    sumOfUnpaidInstallmentsEmi += user.loanDetails.instalmentObject[i].principleAmountPerMonth;
                    sumOfUnpaidInstallmentsInterest += user.loanDetails.instalmentObject[i].interestAmount;
                }
            }

            preCloserPrincipleAmount = Math.round(sumOfUnpaidInstallmentsEmi);
            preCloserInterestAmount = sumOfUnpaidInstallmentsInterest;
            preCloserTotalAmount = Math.round(preCloserPrincipleAmount + preCloserInterestAmount);
        } else {
            user.loanDetails.preCloser.isPrecloserBelow3Months = true;
             user.loanDetails.preCloser.isPrecloserAbove3Months = false;

            const variable = user.loanDetails.totalPrincipalAmount * 0.036; // 3.6% of totalPrincipalAmount
            preCloserTotalAmount = (variable * 3) + user.loanDetails.totalPrincipalAmount;
            preCloserTotalAmount -= user.loanDetails.totalEmiAlreadyPaid;

            preCloserPrincipleAmount = user.loanDetails.totalPrincipalAmount;
            preCloserInterestAmount = Math.round(variable * 3);
        }

        // Update pre-closer details
        user.loanDetails.preCloser.hasPreCloser = true;
        user.loanDetails.preCloser.preCloserDate = providedDate;
        user.loanDetails.preCloser.preCloserTotalAmount = preCloserTotalAmount;
        user.loanDetails.preCloser.preCloserPrincipleAmount = preCloserPrincipleAmount;
        user.loanDetails.preCloser.preCloserInterestAmount = preCloserInterestAmount;
        user.loanDetails.preCloser.preCloserOverDue = user.loanDetails.totalOverdueAmountToBePaid + OverdueforPrecloser;
        user.loanDetails.isActive = false;
        user.loanDetails.emiPending = false;
        user.loanDetails.pendingEmiNum = 0;
        user.loanDetails.emiPendingDate = null;

        if (forceCloseApproverName) {
            user.loanDetails.forceCloseApproverName = forceCloseApproverName;
        }
        // Save the updated user within the session
        await user.save({ session });

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        // Update ledger model
        const receiptNumber = await updateLedgerModel(user, preCloserPrincipleAmount, preCloserInterestAmount, user.loanDetails.preCloser.preCloserOverDue, preCloserTotalAmount, req.body.paymentMethod);

        return res.status(200).json({ message: 'Pre-closer details updated successfully', isActive: user.loanDetails.isActive, receiptNumber });

    } catch (error) {
        console.error('Error updating pre-closer details:', error);

        // Rollback the transaction if an error occurs
        await session.abortTransaction();
        session.endSession();

        return res.status(500).json({ error: 'Internal server error' });
    }
};

async function updateLedgerModel(user, preCloserPrincipleAmount, preCloserInterestAmount, preCloserOverDue, preCloserTotalAmount, paymentMethod) {
    try {
        // Find the highest receipt number across all loan numbers
        const highestReceiptEntry = await ledgerModel.findOne({}).sort({ receiptNumberHid: -1 });

        let newReceiptNumberHid = 1; // Default value if no entries found
        if (highestReceiptEntry) {
            newReceiptNumberHid = highestReceiptEntry.receiptNumberHid + 1;
        }

        const receiptNumber = `C-${newReceiptNumberHid}`;

        // Creating ledger entry
        const ledgerEntry = new ledgerModel({
            isLoanCredit: true,
            loanNumber: user.loanNumber,
            receiptNumber,
            receiptNumberHid: newReceiptNumberHid,
            principle: preCloserPrincipleAmount,
            intrest: preCloserInterestAmount,
            overDue: preCloserOverDue,
            total: preCloserTotalAmount,
            creditOrDebit: 'Credit',
            paymentMethod
        });

        await ledgerEntry.save();
        return receiptNumber; // Return the receipt number for reference
    } catch (error) {
        console.error(error);
        throw new Error('Error updating ledger model');
    }
}

