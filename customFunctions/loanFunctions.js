const UserModel = require('../model/loanModel');

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

// async function updateOverdueInstallmentsForOne(loanNumber) {
//     try {
//         const currentDate = new Date();
//         // Find the user with the given loan number
//         const user = await UserModel.findOne({ loanNumber });

//         // Check if the user exists
//         if (!user) {
//             console.error('User not found with loan number:', loanNumber);
//             return;
//         }

//         const firstUnpaidInstallment = user.loanDetails.instalmentObject.find(installment => !installment.isPaid && installment.dueDate < currentDate);
        
//         if (firstUnpaidInstallment) {
//             user.loanDetails.emiPending = true;
//             user.loanDetails.pendingEmiNum = firstUnpaidInstallment.installmentNo;
//             user.loanDetails.emiPendingDate = firstUnpaidInstallment.dueDate;
//         } else {
//             // Check if any installment has isPaid true and due date less than current date
//             const anyPaidInstallment = user.loanDetails.instalmentObject.find(installment => installment.isPaid && installment.dueDate < currentDate);
//             if (anyPaidInstallment) {
//                 user.loanDetails.emiPending = false;
//                 user.loanDetails.pendingEmiNum = null;
//                 user.loanDetails.emiPendingDate = null;
//             }
//         }

//         // Calculate totalOverdueAmountToBePaid
//         const totalOverdueAmountToBePaid = user.loanDetails.instalmentObject.reduce((total, installment) => {
//             return total + (installment.overDueBalance || 0); // Use 0 if overDueBalance is undefined
//         }, 0);

//         // Set totalOverdueAmountToBePaid in user details
//         user.loanDetails.totalOverdueAmountToBePaid = totalOverdueAmountToBePaid;

//         await user.save(); // Use await to ensure save operation completes before moving on

//         console.log('Updated overdue installments for user with loan number:', loanNumber);
//     } catch (error) {
//         console.error('Error updating overdue installments for user with loan number:', loanNumber, error);
//     }
// }

async function updateOverdueInstallmentsForOne(loanNumber) {
    try {

        console.log("updateOverdueInstallmentsForOne started")
        const currentDate = new Date();
        // Find the user with the given loan number
        const user = await UserModel.findOne({ loanNumber });

        // Check if the user exists
        if (!user) {
            console.error('User not found with loan number:', loanNumber);
            return;
        }

        // Filter overdue and unpaid installments
        const overdueInstallments = user.loanDetails.instalmentObject.filter(installment => !installment.isPaid && installment.dueDate < currentDate);
        
        // Calculate the number of pending EMIs
        const pendingEmiCount = overdueInstallments.length;
        console.log("pendingEmiCount", pendingEmiCount)

        if (overdueInstallments.length > 0) {
            user.loanDetails.emiPending = true;
            user.loanDetails.pendingEmiNum = pendingEmiCount; // Set pendingEmiNum to the number of pending EMIs
            user.loanDetails.emiPendingDate = overdueInstallments[0].dueDate; // Keep the date of the first unpaid installment
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


// async function updateOverdueInstallmentsForOne(loanNumber) {
//     try {
//         const currentDate = new Date();
//         // Find the user with the given loan number
//         const user = await UserModel.findOne({ loanNumber });

//         // Check if the user exists
//         if (!user) {
//             console.error('User not found with loan number:', loanNumber);
//             return;
//         }

//         const firstUnpaidInstallment = user.loanDetails.instalmentObject.find(installment => !installment.isPaid && installment.dueDate < currentDate);
        
//         if (firstUnpaidInstallment) {
//             user.loanDetails.emiPending = true;
//             user.loanDetails.pendingEmiNum = firstUnpaidInstallment.installmentNo;
//             user.loanDetails.emiPendingDate = firstUnpaidInstallment.dueDate;
//         } else {
//             // Check if any installment has isPaid true and due date less than current date
//             const anyPaidInstallment = user.loanDetails.instalmentObject.find(installment => installment.isPaid && installment.dueDate < currentDate);
//             if (anyPaidInstallment) {
//                 user.loanDetails.emiPending = false;
//                 user.loanDetails.pendingEmiNum = null;
//                 user.loanDetails.emiPendingDate = null;
//             }
//         }

//         // Calculate totalOverdueAmountToBePaid
//         const totalOverdueAmountToBePaid = user.loanDetails.instalmentObject.reduce((total, installment) => {
//             return total + (installment.overDueBalance || 0); // Use 0 if overDueBalance is undefined
//         }, 0);

//         // Set totalOverdueAmountToBePaid in user details
//         user.loanDetails.totalOverdueAmountToBePaid = totalOverdueAmountToBePaid;

//         await user.save(); // Use await to ensure save operation completes before moving on

//         console.log('Updated overdue installments for user with loan number:', loanNumber);
//     } catch (error) {
//         console.error('Error updating overdue installments for user with loan number:', loanNumber, error);
//     }
// }




// async function updateLoanDetails(loanNumber) {
//     try {
//       console.log('updateLoanDetails..');
//       // Retrieve the loan document from the database
//       const loan = await UserModel.findOne({ loanNumber });
  
//       if (!loan) {
//         throw new Error('Loan not found');
//       }
  
//       // Calculate totalEmiAlreadyPaid
//       const totalEmiAlreadyPaid = loan.loanDetails.instalmentObject.reduce((acc, installment) => {
//         if (installment.emiPaid) {
//           return acc + installment.emiPaid;
//         }
//         return acc;
//       }, 0);
  
//       // Calculate totalOverdueAmountToBePaid
//       const totalOverdueAmountToBePaid = loan.loanDetails.instalmentObject.reduce((acc, installment) => {
//         if (installment.overDueBalance) {
//           return acc + installment.overDueBalance;
//         }
//         return acc;
//       }, 0);
      
  
//       // Calculate totalEmiBalance
//       const totalEmiBalance = loan.loanDetails.totalEmiAmount - totalEmiAlreadyPaid;

//             // Calculate totalEmiAndOverdueToBePaid

//       const totalEmiAndOverdueToBePaid = totalEmiBalance + totalOverdueAmountToBePaid;
  
//       // Update loan document with new values
//       loan.loanDetails.totalEmiAlreadyPaid = totalEmiAlreadyPaid;
//       loan.loanDetails.totalOverdueAmountToBePaid = totalOverdueAmountToBePaid;
//       loan.loanDetails.totalEmiAndOverdueToBePaid = totalEmiAndOverdueToBePaid;
//       loan.loanDetails.totalEmiBalance = totalEmiBalance;
  
//       // Save updated loan document back to the database
//       await loan.save();
  
//       console.log('Loan details updated successfully');
//     } catch (error) {
//       console.error('Error updating loan details:', error.message);
//     }
//   }


// //   async function getLastReceiptNumber() {
// //     try {
// //         // Find all loan documents
// //         const allLoans = await UserModel.find();

// //         // Array to store all receipt numbers
// //         let receiptNumbers = [];

// //         // Loop through all loans and their installment objects to collect receipt numbers
// //         allLoans.forEach(loan => {
// //             loan.loanDetails.instalmentObject.forEach(installment => {
// //                 if (installment.receiptNumber !== null && !isNaN(installment.receiptNumber)) {
// //                     receiptNumbers.push(installment.receiptNumber);
// //                 }
// //             });
// //         });

// //         // Sort receipt numbers in descending order
// //         receiptNumbers.sort((a, b) => b - a);

// //         // Get the last receipt number
// //         const lastReceiptNumber = receiptNumbers.length > 0 ? receiptNumbers[0] : null;

// //         // Close connection

// //         return lastReceiptNumber;
// //     } catch (error) {
// //         console.error("Error getting last receipt number:", error);
// //         throw error;
// //     }
// // }

// async function updateLoanStatus(loanNumber) {
//   try {
//       const loan = await UserModel.findOne({ loanNumber });

//       if (!loan) {
//           throw new Error('Loan not found');
//       }

//       // Check if all installments are paid and totalEmiBalance is <= 0
//       const allPaid = loan.loanDetails.instalmentObject.every(installment => installment.isPaid);
//       const balance = loan.loanDetails.totalEmiBalance;

//       if (allPaid && balance <= 0) {
//           // Update isActive to false
//           await UserModel.updateOne({ loanNumber }, { 'loanDetails.isActive': false });
//           console.log(`Loan ${loanNumber} status updated successfully.`);
//       } else {
//           console.log(`Loan ${loanNumber} does not meet the conditions for status update.`);
//       }
//   } catch (error) {
//       console.error('Error updating loan status:', error);
//   }
// }



// class ReceiptNumberGenerator {
//   static async generateDebitReceiptNumber(model, companyId, session) {
//     try {
//       // Find the last receipt number for the company using aggregation
//       const lastReceipt = await model.findOne(
//         { company: companyId },
//         { debitReceiptNumber: 1 },
//         { 
//           sort: { 
//             debitReceiptNumber: -1 
//           },
//           session 
//         }
//       );

//       // Extract number from the last receipt or start from 0
//       let nextNumber = 1;
//       if (lastReceipt && lastReceipt.debitReceiptNumber) {
//         const match = lastReceipt.debitReceiptNumber.match(/D-(\d+)/);
//         if (match && match[1]) {
//           nextNumber = parseInt(match[1], 10) + 1;
//         }
//       }

//       // Format the new receipt number
//       const newReceiptNumber = `D-${nextNumber}`;
      
//       // Verify uniqueness
//       const exists = await model.findOne(
//         { 
//           company: companyId, 
//           debitReceiptNumber: newReceiptNumber 
//         },
//         null,
//         { session }
//       );

//       if (exists) {
//         // If duplicate found, recursively try next number
//         return this.generateDebitReceiptNumber(model, companyId, session);
//       }

//       return newReceiptNumber;
//     } catch (error) {
//       throw new Error(`Failed to generate receipt number: ${error.message}`);
//     }
//   }
// }


module.exports ={updateOverdueInstallmentsForOne, updateLoanDetails,  updateLoanStatus}