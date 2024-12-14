const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ledgerSchema = new Schema({
    isExpense: { type: Boolean, default: false },
    isInvestment: { type: Boolean, default: false },
    isLoanDebit: { type: Boolean, default: false },
    isLoanCredit: { type: Boolean, default: false },
    paymentMethod: { type: String, enum: ['cash', 'account'], default: null },
    creditOrDebit: { type: String, enum: ['Credit', 'Debit'], default: null },
    entryDate: { type: Date, default: Date.now },
    loanNumber: { type: Number, default: null },
    receiptNumber: { type: String, default: null },
    receiptNumberHid: { type: Number, default: 0 },
    principle: { type: Number, default: null },
    interest: { type: Number, default: null },
    overDue: { type: Number, default: null },
    remarks: { type: String, default: null },
    total: { type: Number, default: null },
    createdBy: { 
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true 
    },
    company: { 
        type: Schema.Types.ObjectId,
        ref: 'Company', // Reference to the Company model
        required: true 
    }
});

const ledgerModel = mongoose.model('Ledger', ledgerSchema);

module.exports = ledgerModel;
