const mongoose = require('mongoose');


const ledgerSchema =  new mongoose.Schema({
    isExpense: { type: Boolean, default: false },
    isInvestment: { type: Boolean, default: false },
    isLoanDebit: { type: Boolean, default: false },
    isLoanCredit: { type: Boolean, default: false },
    paymentMethod: { type: String, enum: ['cash', 'AC'], default: null },
    creditOrDebit: {type:String, enum:['Credit', 'Debit'], default: null},
    entryDate: {type:Date, default: Date.now},
    loanNumber:{type:Number, default: null},
    receiptNumber:{type:String, default: null},
    receiptNumberHid:{type:Number, default: 0},
    principle:{type:Number, default: null},
    intrest:{type:Number, default: null},
    overDue:{type:Number, default: null},
    remarks:{type:String, default: null},
    total:{type:Number, default: null}

})

const ledgerModel = mongoose.model('ledger', ledgerSchema);

module.exports = ledgerModel;
