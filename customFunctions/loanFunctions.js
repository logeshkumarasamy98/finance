const UserModel = require('../model/loanModel');

async function updateOverdueInstallmentsForOne(loanNumber) {
    try {
        const currentDate = new Date();
        // Find the user with the given loan number
        const user = await UserModel.findOne({ loanNumber });

        // Check if the user exists
        if (!user) {
            console.error('User not found with loan number:', loanNumber);
            return;
        }

        const firstUnpaidInstallment = user.loanDetails.instalmentObject.find(installment => !installment.isPaid && installment.dueDate < currentDate);
        
        if (firstUnpaidInstallment) {
            user.loanDetails.emiPending = true;
            user.loanDetails.pendingEmiNum = firstUnpaidInstallment.installmentNo;
            user.loanDetails.emiPendingDate = firstUnpaidInstallment.dueDate;
        } else {
            // Check if any installment has isPaid true and due date less than current date
            const anyPaidInstallment = user.loanDetails.instalmentObject.find(installment => installment.isPaid && installment.dueDate < currentDate);
            if (anyPaidInstallment) {
                user.loanDetails.emiPending = false;
                user.loanDetails.pendingEmiNum = null;
                user.loanDetails.emiPendingDate = null;
            }
        }

        // Calculate totalOverdueAmountToBePaid
        const totalOverdueAmountToBePaid = user.loanDetails.instalmentObject.reduce((total, installment) => {
            return total + (installment.overDueBalance || 0); // Use 0 if overDueBalance is undefined
        }, 0);

        // Set totalOverdueAmountToBePaid in user details
        user.loanDetails.totalOverdueAmountToBePaid = totalOverdueAmountToBePaid;

        await user.save(); // Use await to ensure save operation completes before moving on

        console.log('Updated overdue installments for user with loan number:', loanNumber);
    } catch (error) {
        console.error('Error updating overdue installments for user with loan number:', loanNumber, error);
    }
}




async function updateLoanDetails(loanNumber) {
    try {
      console.log('updateLoanDetails..');
      // Retrieve the loan document from the database
      const loan = await UserModel.findOne({ loanNumber });
  
      if (!loan) {
        throw new Error('Loan not found');
      }
  
      // Calculate totalEmiAlreadyPaid
      const totalEmiAlreadyPaid = loan.loanDetails.instalmentObject.reduce((acc, installment) => {
        if (installment.emiPaid) {
          return acc + installment.emiPaid;
        }
        return acc;
      }, 0);
  
      // Calculate totalOverdueAmountToBePaid
      const totalOverdueAmountToBePaid = loan.loanDetails.instalmentObject.reduce((acc, installment) => {
        if (installment.overDueBalance) {
          return acc + installment.overDueBalance;
        }
        return acc;
      }, 0);
      
  
      // Calculate totalEmiBalance
      const totalEmiBalance = loan.loanDetails.totalEmiAmount - totalEmiAlreadyPaid;

            // Calculate totalEmiAndOverdueToBePaid

      const totalEmiAndOverdueToBePaid = totalEmiBalance + totalOverdueAmountToBePaid;
  
      // Update loan document with new values
      loan.loanDetails.totalEmiAlreadyPaid = totalEmiAlreadyPaid;
      loan.loanDetails.totalOverdueAmountToBePaid = totalOverdueAmountToBePaid;
      loan.loanDetails.totalEmiAndOverdueToBePaid = totalEmiAndOverdueToBePaid;
      loan.loanDetails.totalEmiBalance = totalEmiBalance;
  
      // Save updated loan document back to the database
      await loan.save();
  
      console.log('Loan details updated successfully');
    } catch (error) {
      console.error('Error updating loan details:', error.message);
    }
  }


  async function getLastReceiptNumber() {
    try {
        // Find all loan documents
        const allLoans = await UserModel.find();

        // Array to store all receipt numbers
        let receiptNumbers = [];

        // Loop through all loans and their installment objects to collect receipt numbers
        allLoans.forEach(loan => {
            loan.loanDetails.instalmentObject.forEach(installment => {
                if (installment.receiptNumber !== null && !isNaN(installment.receiptNumber)) {
                    receiptNumbers.push(installment.receiptNumber);
                }
            });
        });

        // Sort receipt numbers in descending order
        receiptNumbers.sort((a, b) => b - a);

        // Get the last receipt number
        const lastReceiptNumber = receiptNumbers.length > 0 ? receiptNumbers[0] : null;

        // Close connection

        return lastReceiptNumber;
    } catch (error) {
        console.error("Error getting last receipt number:", error);
        throw error;
    }
}

async function updateLoanStatus(loanNumber) {
  try {
      const loan = await UserModel.findOne({ loanNumber });

      if (!loan) {
          throw new Error('Loan not found');
      }

      // Check if all installments are paid and totalEmiBalance is <= 0
      const allPaid = loan.loanDetails.instalmentObject.every(installment => installment.isPaid);
      const balance = loan.loanDetails.totalEmiBalance;

      if (allPaid && balance <= 0) {
          // Update isActive to false
          await UserModel.updateOne({ loanNumber }, { 'loanDetails.isActive': false });
          console.log(`Loan ${loanNumber} status updated successfully.`);
      } else {
          console.log(`Loan ${loanNumber} does not meet the conditions for status update.`);
      }
  } catch (error) {
      console.error('Error updating loan status:', error);
  }
}
  
module.exports ={updateOverdueInstallmentsForOne, updateLoanDetails, getLastReceiptNumber, updateLoanStatus}