const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    
    loanNumber: { type: Number, unique: true },
    debitReceiptNumber:{type:String, require:true},

    loanDetails: {
        isActive: { type: Boolean, required: true },
        isSeized: { type: Boolean, required: true },
        isDocumentSettled: { type: Boolean, required: true },
        instalment: { type: Number, required: [true, 'installment required'], min:[6, 'Minimum 8 months required'], max :[40, 'Max number exceed']},
        totalPrincipalAmount: { type: Number, required: true, min:[3000, 'Minimum 3000 required'],max :[1000000, 'Max number exceed']  },
        interestRate: { type: Number, required: true, max :[10, 'Max number exceed'] },
        startDate: { type: Date, required: true },
        instalmentObject: [{
            installmentNo: { type: Number, required: true, max :[40, 'Max number exceed'] },
            isPaid: { type: Boolean, default: false },
            dueDate: { type: Date, required: true },
            paidDate: { type: Date },
            emiPaid: {type: Number, default:null},
            receiptNumber: { type: String },
            principleAmountPerMonth: { type: Number },
            interestAmount: { type: Number },
            totalEmiAmount: { type: Number },
            totalEmiAmountRoundoff:{type: Number},
            overdueAmount: { type: Number },
            overduePaid: { type: Number },
            overDueBalance:{type: Number},
        }],
        totalEmiAlreadyPaid: {type: Number},
        totalEmiAmount: { type: Number},
        totalEmiBalance:{type:Number},
        totalOverdueAmountToBePaid: {type: Number},
        totalEmiAndOverdueToBePaid: {type:Number},
        emiPending:{type:Boolean, default:false},
        pendingEmiNum:{type: Number, default:null},
        emiPendingDate:{type : Date, default:null},

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

            for (let i = 1; i <= instalment; i++) {
                let currentDate = new Date(startDate); // Create a new Date object for each iteration
                currentDate.setMonth(currentDate.getMonth() + i); // Increment month by i
                
                const monthlyInterestAmount = totalLoan * monthlyInterestRate;
                const monthlyTotalAmount = monthlyInterestAmount + monthlyPrincipal;

                // Custom rounding function to round off to the next 5
                const roundToNext5 = (num) => Math.ceil(num / 5) * 5;

                // Round off monthlyPrincipal and monthlyInterestAmount to the next 5
                monthlyPrincipal = roundToNext5(monthlyPrincipal);
                const roundedMonthlyInterestAmount = roundToNext5(monthlyInterestAmount);

                // const monthlyTotalAmount = monthlyPrincipal + roundedMonthlyInterestAmount

                const roundedTotalEmiAmount = (monthlyPrincipal + roundedMonthlyInterestAmount); // Round off to nearest 10-digit number

                this.loanDetails.instalmentObject.push({
                    installmentNo: i,
                    isPaid: false,
                    dueDate: currentDate,
                    paidDate: null,
                    emiPaid: null,
                    receiptNumber: null,
                    principleAmountPerMonth: monthlyPrincipal,
                    interestAmount: roundedMonthlyInterestAmount,
                    totalEmiAmount: monthlyTotalAmount,
                    totalEmiAmountRoundoff: roundedTotalEmiAmount,
                    overdueAmount: null,
                    overduePaid: null,
                    overDueBalance: null
                });
            }

            // Calculate totalEmiAmount after all installment objects have been added
            const totalEmiAmount = this.loanDetails.instalmentObject.reduce((total, installment) => {
                return total + installment.totalEmiAmount;
            }, 0);
            const roundedTotalEmiBalance = Math.round(totalEmiAmount);

            // Set totalEmiAmount in the loanDetails
            this.loanDetails.totalEmiAlreadyPaid = 0,
            this.loanDetails.totalEmiAmount = totalEmiAmount;
            this.loanDetails.totalOverdueAmountToBePaid = null,
            this.loanDetails.totalEmiAndOverdueToBePaid = null,
            this.loanDetails.totalEmiBalance = roundedTotalEmiBalance;
        }
        next(); // Call next to proceed with the save operation
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
});


const UserModel = mongoose.model('Loan', userSchema);

module.exports = UserModel;
