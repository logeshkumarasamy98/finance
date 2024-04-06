const cron = require('node-cron');
const UserModel = require('./UserSchema');

// async function calculateOverdueAmountsManually() {
//     try {
//         // Find all loans where due date is passed and isPaid is false
//         const overdueLoans = await UserModel.find({
//             'loanDetails.instalmentObject.dueDate': { $lt: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000) }, // Due date is less than current date + 2 days
//             'loanDetails.instalmentObject.isPaid': false
//         });

//         // Iterate over each overdue loan
//         for (const loan of overdueLoans) {
//             // Iterate over each installment of the loan
//             for (const installment of loan.loanDetails.instalmentObject) {
//                 if (!installment.isPaid && installment.dueDate < new Date()) {
//                     // Adjust the due date to start counting from 2 days after the original due date
//                     const adjustedDueDate = new Date(installment.dueDate.getTime() + (2 * 24 * 60 * 60 * 1000));

//                     // Calculate the days overdue starting from 2 days after the due date
//                     const daysOverdue = Math.ceil((new Date() - adjustedDueDate) / (1000 * 60 * 60 * 24));

//                     if (daysOverdue >= 2) { // Calculate overdue amount for installments 2 days or more overdue
//                         const overdueAmountForInstallment = (installment.totalEmiAmount * 0.004) * daysOverdue; // (installmentAmount * 0.04%) * daysOverdue
//                         // Update overdueAmount for the installment
//                         installment.overdueAmount = overdueAmountForInstallment;
//                     }
//                 }
//             }

//             // Calculate total overdue amount for the loan
//             const totalOverdueAmount = loan.loanDetails.instalmentObject.reduce((total, installment) => {
//                 return total + (installment.overdueAmount || 0);
//             }, 0);

//             // Update totalOverdueAmount in the database for the loan
//             await UserModel.findByIdAndUpdate(loan._id, {
//                 $set: { 
//                     'loanDetails.instalmentObject': loan.loanDetails.instalmentObject,
//                     'loanDetails.totalOverdueAmountToBePaid': totalOverdueAmount 
//                 }
//             });
//         }

//         console.log('Overdue amounts updated.');
//     } catch (error) {
//         console.error('Error updating overdue amounts:', error);
//         throw error;
//     }
// }

async function updateOverdueInstallments() {
    try {
        console.log('test...')
        const currentDate = new Date();
        const overdueInstallments = await UserModel.find({
            'loanDetails.instalmentObject': {
                $elemMatch: {
                    $or: [
                        { isPaid: false, dueDate: { $lt: currentDate } },
                        { isPaid: true, dueDate: { $lt: currentDate } }
                    ]
                }
            }
        });

        for (const user of overdueInstallments) {
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
            await user.save(); // Use await to ensure save operation completes before moving on
        }

        console.log('Updated overdue installments successfully.');
    } catch (error) {
        console.error('Error updating overdue installments:', error);
    }
}


// Define cron job to run the function daily at 2:45 PM
// const job = cron.schedule('* * * * * *', async () => {
    const job = cron.schedule('30 00 * * *', async () => {
    console.log('cron started..');
    try {
    //   await calculateOverdueAmountsManually();
      await updateOverdueInstallments();
    } catch (error) {
      console.error('Error calculating overdue amounts:', error);
    }
    console.log('cron stopped.');
  });
  module.exports = { updateOverdueInstallments, job };