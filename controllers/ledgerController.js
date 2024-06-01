const ledgerModel = require('./../model/ledgerModel');

exports.expense = async (req, res) => {
    const session = await ledgerModel.startSession();
    session.startTransaction();
    try {
        const { paymentMethod, remarks, total } = req.body;
        const entryDate = req.body.entryDate || new Date(); // Use provided entry date or current date if not provided
        const companyId = req.companyId; // Assuming companyId is available in the request object
        const userId = req.userId;
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
            createdBy: userId, // Set the createdBy field to the userId
            company: companyId
            // Add other fields as needed
        });

        // Save the new entry to the database
        await newEntry.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ success: true, message: 'Ledger entry created successfully.' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error creating ledger entry:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};



exports.investment = async (req, res) => {
    const session = await ledgerModel.startSession();
    session.startTransaction();
    try {
        const { paymentMethod, remarks, total } = req.body;
        const entryDate = req.body.entryDate || new Date(); // Use provided entry date or current date if not provided
        const companyId = req.companyId; // Assuming companyId is available in the request object
        const userId = req.userId;
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
            entryDate, 
            createdBy: userId, 
            company: companyId
        });

        // Save the new entry to the database
        await newEntry.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ success: true, message: 'Investment ledger entry created successfully.' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error creating investment ledger entry:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};
