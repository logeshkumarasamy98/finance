const express = require ('express');
const mongoose = require('mongoose');
const userControllers = require('./usercontroller');
// const UserModel = require('./UserSchema');
const UserModel = require('./UserSchema') // Update this with the correct path to your UserModel


const app = express();

app.use(express.json());

mongoose.connect('mongodb+srv://logeshpriyanga:logesh98@cluster0.i7qbne1.mongodb.net/testdb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('DB connected.');
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
  });


app.post(('/api/user'), userControllers.createUser);

app.get(('/api/user/:loanNumber'), userControllers.getUsers);


app.get(('/api/user'), userControllers.getAllUsers);

app.patch(('/api/user/:customId'), userControllers.updateUser);



app.get('/trigger-overdue-calculation', async (req, res) => {
  try {
      await calculateOverdueAmountsManually();
      res.status(200).send('Overdue amounts updated manually.');
  } catch (error) {
      console.error('Error updating overdue amounts manually:', error);
      res.status(500).send('Error updating overdue amounts manually.');
  }
});

async function calculateOverdueAmountsManually() {
  try {
      // Find all loans where due date is passed and isPaid is false
      const overdueLoans = await UserModel.find({
          'loanDetails.instalmentObject.dueDate': { $lt: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000) }, // Due date is less than current date + 2 days
          'loanDetails.instalmentObject.isPaid': false
      });

      // Iterate over each overdue loan
      for (const loan of overdueLoans) {
          // Iterate over each installment of the loan
          for (const installment of loan.loanDetails.instalmentObject) {
              if (!installment.isPaid && installment.dueDate < new Date()) {
                  // Adjust the due date to start counting from 2 days after the original due date
                  const adjustedDueDate = new Date(installment.dueDate.getTime() + (2 * 24 * 60 * 60 * 1000));

                  // Calculate the days overdue starting from 2 days after the due date
                  const daysOverdue = Math.ceil((new Date() - adjustedDueDate) / (1000 * 60 * 60 * 24));

                  if (daysOverdue > 3) { // Calculate overdue amount for installments 2 days or more overdue
                      const overdueAmountForInstallment = (installment.totalEmiAmount * 0.004) * daysOverdue; // (installmentAmount * 0.04%) * daysOverdue
                      // Update overdueAmount for the installment
                      installment.overdueAmount = overdueAmountForInstallment;
                  }
              }
          }

          // Calculate total overdue amount for the loan
          const totalOverdueAmount = loan.loanDetails.instalmentObject.reduce((total, installment) => {
              return total + (installment.overdueAmount || 0);
          }, 0);

          // Update totalOverdueAmount in the database for the loan
          await UserModel.findByIdAndUpdate(loan._id, {
              $set: { 
                  'loanDetails.instalmentObject': loan.loanDetails.instalmentObject,
                  'loanDetails.totalOverdueAmountToBePaid': totalOverdueAmount 
              }
          });
      }

      console.log('Overdue amounts updated manually.');
  } catch (error) {
      console.error('Error updating overdue amounts manually:', error);
      throw error;
  }
}

// Manually call the function to calculate overdue amounts
calculateOverdueAmountsManually();

app.listen(3000, ()=>{
    console.log('server started...')
    
})