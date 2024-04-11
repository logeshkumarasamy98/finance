const mongoose = require('mongoose');


const ledgerSchema =  new mongoose.Schema({
    isExpense: { type: Boolean, default: false },
    isInvestment: { type: Boolean, default: false },
    isLoanDebit: { type: Boolean, default: false },
    isLoanCredit: { type: Boolean, default: false },
    paymentMethod: { type: String, enum: ['cash', 'AC'], default: null },
    creditOrDebit: {type:String, enum:['Credit', 'Debit'], default: null},
    entryDate: {type:Date, default: Date.now},
    loanNumber:{type:Number},
    receiptNumber:{type:Number},
    principle:{type:Number},
    intrest:{type:Number},
    overDue:{type:Number},
    remarks:{type:String},
    total:{type:Number}

})

const ledgerModel = mongoose.model('ledger', ledgerSchema);

module.exports = ledgerModel;
