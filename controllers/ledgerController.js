const ledgerModel = require('./../model/ledgerModel');

exports.expense = async (req, res) => {
    try {
        const { paymentMethod, remarks, total } = req.body;
        const entryDate = req.body.entryDate || new Date(); // Use provided entry date or current date if not provided

        // Update isExpense field based on conditions
        const isExpense = true;

        // Create a new ledger entry
        const newEntry = new ledgerModel({
            paymentMethod,
            remarks,
            total,
            isExpense,
            creditOrDebit: 'Debit', // Always set creditOrDebit as "Debit"
            entryDate,
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


exports.investment = async (req, res) => {
    try {
        const { paymentMethod, remarks, total } = req.body;
        const entryDate = req.body.entryDate || new Date(); // Use provided entry date or current date if not provided

        // Set isInvestment to true
        const isInvestment = true;

        // Set creditOrDebit to "Credit"
        const creditOrDebit = "Credit";

        // Create a new ledger entry
        const newEntry = new ledgerModel({
            paymentMethod,
            remarks,
            total,
            isInvestment,
            creditOrDebit,
            entryDate, // Adding the entryDate field
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
