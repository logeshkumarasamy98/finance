const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    
    loanNumber: { type: Number, unique: true },

    loanDetails: {
        isActive: { type: Boolean, required: true },
        isSeized: { type: Boolean, required: true },
        isDocumentSettled: { type: Boolean, required: true },
        instalment: { type: Number, required: true },
        totalPrincipalAmount: { type: Number, required: true },
        interestRate: { type: Number, required: true },
        startDate: { type: Date, required: true },
        instalmentObject: [{
            installmentNo: { type: Number, required: true },
            isPaid: { type: Boolean, default: false },
            dueDate: { type: Date, required: true },
            paidDate: { type: Date },
            paidBy: {type: String, required: true},
            recipientNumber: { type: Number },
            principleAmountPerMonth: { type: Number },
            interestAmount: { type: Number },
            totalEmiAmount: { type: Number },
            totalEmiAmountRoundoff:{type: Number},
            overdueAmount: { type: Number },
            overdueBalance: { type: Number }
        }],
        totalEmiAlreadyPaid: {type: Number},
        totalEmiToBePaid: { type: Number},
        totalOverdueAmountToBePaid: {type: Number},
        totalEmiAndOverdueToBePaid: {type:Number},

    }, 

    details: {
        loanPayerDetails: {
            name: { type: String, required: true },
            fatherName: { type: String },
            work: { type: String },
            mobileNum: { type: Number },
            mobileNum2: { type: Number },
            pincode: { type: Number },
            address: { type: String },
            location: { type: String },
            photo: { type: String }
        },
        guaranteeDetail: {
            name: { type: String },
            fatherName: { type: String },
            work: { type: String },
            mobileNum: { type: Number },
            mobileNum2: { type: Number },
            pincode: { type: Number },
            address: { type: String },
            location: { type: String },
            photo: { type: String }
        },
        vehicle: {
            type: { type: String },
            model: { type: String },
            vehicleNumber: { type: String },
            engineNum: { type: String },
            chaseNum: { type: String },
            variant: { type: String },
            photo: { type: String }
        }
    }
});



userSchema.pre('save', async function(next) {
    try {
        if (this.isNew && this.loanDetails.instalment && this.loanDetails.instalmentObject.length === 0) {
            const { instalment, startDate, totalPrincipalAmount, interestRate } = this.loanDetails;
            const monthlyInterestRate = interestRate / 100; // Convert annual interest rate to monthly rate

            const monthlyPrincipal = totalPrincipalAmount / instalment;
            const totalLoan = totalPrincipalAmount;

            for (let i = 1; i <= instalment; i++) {
                let currentDate = new Date(startDate); // Create a new Date object for each iteration
                currentDate.setMonth(currentDate.getMonth() + i); // Increment month by i
                
                const monthlyInterestAmount = totalLoan * monthlyInterestRate;
                const monthlyTotalAmount = monthlyInterestAmount + monthlyPrincipal;

                const roundedTotalEmiAmount = Math.round(monthlyTotalAmount / 10) * 10; // Round off to nearest 10-digit number

                this.loanDetails.instalmentObject.push({
                    installmentNo: i,
                    isPaid: false,
                    dueDate: currentDate,
                    paidDate: null,
                    recipientNumber: null,
                    principleAmountPerMonth: monthlyPrincipal,
                    interestAmount: monthlyInterestAmount,
                    totalEmiAmount: monthlyTotalAmount,
                    totalEmiAmountRoundoff: roundedTotalEmiAmount,
                    overdueAmount: null,
                    overdueBalance: null,
                });
            }

            // Calculate totalEmiToBePaid after all installment objects have been added
            const totalEmiToBePaid = this.loanDetails.instalmentObject.reduce((total, installment) => {
                return total + installment.totalEmiAmount;
            }, 0);

            // Set totalEmiToBePaid in the loanDetails
            this.loanDetails.totalEmiAlreadyPaid = null
            this.loanDetails.totalEmiToBePaid = totalEmiToBePaid;
            this.loanDetails.totalOverdueAmountToBePaid = null,
            this.loanDetails.totalEmiAndOverdueToBePaid = null
        }
        next(); // Call next to proceed with the save operation
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
});



const UserModel = mongoose.model('Loan', userSchema);

module.exports = UserModel;
