const ledgerModel = require('./../model/ledgerModel');

exports.expense = async (req, res) => {
    try {
        const { paymentMethod, remarks, total, creditOrDebit } = req.body;

        // Update isExpense field based on conditions
        let isExpense = false;
        if (paymentMethod && remarks && total) {
            isExpense = true;
        }

        // Create a new ledger entry
        const newEntry = new ledgerModel({
            paymentMethod,
            remarks,
            total,
            isExpense, // Assigning the updated value of isExpense
            creditOrDebit // Assigning the creditOrDebit value
            // Add other fields as needed
        });

        // Save the new entry to the database
        await newEntry.save();

        res.status(200).json({ success: true, message: 'Ledger entry created successfully.' });
    } catch (error) {
        console.error('Error creating ledger entry:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

exports.investment =  async (req, res) => {
    try {
        const { paymentMethod, remarks, total } = req.body;

        // Update isInvestment field based on conditions
        let isInvestment = false;
        if (paymentMethod && remarks && total) {
            isInvestment = true;
        }

        // Set creditOrDebit to "Credit"
        const creditOrDebit = "Credit";

        // Create a new ledger entry
        const newEntry = new ledgerModel({
            paymentMethod,
            remarks,
            total,
            isInvestment, // Assigning the updated value of isInvestment
            creditOrDebit // Assigning the creditOrDebit value
            // Add other fields as needed
        });

        // Save the new entry to the database
        await newEntry.save();

        res.status(200).json({ success: true, message: 'Investment ledger entry created successfully.' });
    } catch (error) {
        console.error('Error creating investment ledger entry:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};
