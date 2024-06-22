const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    loanNumber: { type: Number },
    debitReceiptNumber: { type: String, require: true },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company', // Reference to the Company model
        required: true
    },
    loanDetails: {
        isActive: { type: Boolean, required: true },
        isSeized: { type: Boolean, required: true },
        isDocumentSettled: { type: Boolean, required: true },
        instalment: { type: Number, required: [true, 'installment required'], min: [6, 'Minimum 8 months required'], max: [40, 'Max number exceed'] },
        totalPrincipalAmount: { type: Number, required: true, min: [3000, 'Minimum 3000 required'], max: [1000000, 'Max number exceed'] },
        interestRate: { type: Number, required: true, max: [10, 'Max number exceed'] },
        startDate: { type: Date, required: true },
        principleAmountPerMonth: { type: Number }, // Added here
        interestAmountPerMonth: { type: Number }, // Added here
        instalmentObject: [{
            installmentNo: { type: Number, required: true, max: [40, 'Max number exceed'] },
            isPaid: { type: Boolean, default: false },
            dueDate: { type: Date, required: true },
            paidDate: { type: Date },
            emiPaid: { type: Number, default: null },
            principleAmountPaid: { type: Number, default: null },
            receiptNumber: { type: String },
            totalEmiAmount: { type: Number },
            totalEmiAmountRoundoff: { type: Number },
            overdueAmount: { type: Number },
            overduePaid: { type: Number },
            overDueBalance: { type: Number },
            updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Field to store the user who updated the installment
        }],
        totalEmiAlreadyPaid: { type: Number },
        totalEmiAmount: { type: Number },
        totalEmiBalance: { type: Number },
        totalOverdueAmountToBePaid: { type: Number },
        totalEmiAndOverdueToBePaid: { type: Number },
        emiPending: { type: Boolean, default: false },
        pendingEmiNum: { type: Number, default: null },
        emiPendingDate: { type: Date, default: null },
        forceCloseApproverName: { type: String, default: null },
        preCloser: {
            hasPreCloser: { type: Boolean, default: false },
            isPrecloserBelow3Months: { type: Boolean, default: false },
            isPrecloserAbove3Months: { type: Boolean, default: false },
            preCloserDate: { type: Date, default: null },
            preCloserTotalAmount: { type: Number, default: null },
            preCloserPrincipleAmount: { type: Number, default: null },
            preCloserInterestAmount: { type: Number, default: null },
            preCloserOverDue: { type: Number, default: null }
        },
        loanExtraPaid: { type: Number, default: 0 } // New field added
    },
    details: {
        loanPayerDetails: {
            name: { type: String, required: true },
            fatherName: { type: String },
            work: { type: String },
            mobileNum1: { type: Number, required: true },
            mobileNum2: { type: Number },
            pincode: { type: Number },
            address: { type: String },
            location: { type: String },
            photo: { type: String }
        },
        guaranteeDetail: {
            name: { type: String, required: true },
            fatherName: { type: String },
            work: { type: String },
            mobileNum1: { type: Number, required: true },
            mobileNum2: { type: Number },
            pincode: { type: Number },
            address: { type: String },
            location: { type: String },
            photo: { type: String }
        },
        vehicle: {
            type: { type: String, required: true },
            model: { type: String, required: true },
            vehicleNumber: { type: String, required: true },
            engineNum: { type: String, required: true },
            chaseNum: { type: String, required: true },
            variant: { type: String, required: true },
            photo: { type: String }
        }
    }
});

userSchema.pre('save', async function(next) {
    try {
        if (this.isNew && this.loanDetails.instalment && this.loanDetails.instalmentObject.length === 0) {
            const { instalment, startDate, totalPrincipalAmount, interestRate } = this.loanDetails;
            const monthlyInterestRate = interestRate / 100; // Convert annual interest rate to monthly rate

            let monthlyPrincipal = totalPrincipalAmount / instalment;
            let totalLoan = totalPrincipalAmount;

            // Store these values in loanDetails
            const roundedMonthlyPrincipal = Math.round(monthlyPrincipal);
            const roundedMonthlyInterestAmount = Math.round(totalLoan * monthlyInterestRate);

            this.loanDetails.principleAmountPerMonth = roundedMonthlyPrincipal;
            this.loanDetails.interestAmountPerMonth = roundedMonthlyInterestAmount;

            for (let i = 1; i <= instalment; i++) {
                let currentDate = new Date(startDate); // Create a new Date object for each iteration
                currentDate.setMonth(currentDate.getMonth() + i); // Increment month by i

                const monthlyInterestAmount = totalLoan * monthlyInterestRate;
                const monthlyTotalAmount = monthlyInterestAmount + monthlyPrincipal;

                const roundedTotalEmiAmount = Math.round(roundedMonthlyPrincipal + roundedMonthlyInterestAmount);

                this.loanDetails.instalmentObject.push({
                    installmentNo: i,
                    isPaid: false,
                    dueDate: currentDate,
                    paidDate: null,
                    emiPaid: null,
                    receiptNumber: null,
                    totalEmiAmount: Math.round(monthlyTotalAmount),
                    totalEmiAmountRoundoff: roundedTotalEmiAmount,
                    overdueAmount: null,
                    overduePaid: null,
                    overDueBalance: null,
                    updatedBy: null // Set the user who created the loan as the updater of the initial installments
                });
            }

            // Calculate totalEmiAmount after all installment objects have been added
            const totalEmiAmount = this.loanDetails.instalmentObject.reduce((total, installment) => {
                return total + installment.totalEmiAmount;
            }, 0);
            const roundedTotalEmiBalance = Math.round(totalEmiAmount);

            // Set totalEmiAmount in the loanDetails
            this.loanDetails.totalEmiAlreadyPaid = 0;
            this.loanDetails.totalEmiAmount = totalEmiAmount;
            this.loanDetails.totalOverdueAmountToBePaid = null;
            this.loanDetails.totalEmiAndOverdueToBePaid = null;
            this.loanDetails.totalEmiBalance = roundedTotalEmiBalance;
        }
        next(); // Call next to proceed with the save operation
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
});

const UserModel = mongoose.model('Loan', userSchema);

module.exports = UserModel;
