const UserModel = require('./UserSchema');
const {updateOverdueInstallmentsForOne, updateLoanDetails} = require('./functions')
const {updateOverdueInstallments} = require('./overDueCalculator')

exports.createUser = async (req, res) => {
  try {
      const lastUser = await UserModel.findOne({}, {}, { sort: { 'loanNumber': -1 } });
      let lastLoanNumber = 0;
      if (lastUser && !isNaN(lastUser.loanNumber)) {
          lastLoanNumber = lastUser.loanNumber;
      }
      const newLoanNumber = lastLoanNumber + 1;

      // Directly pass req.body to the UserModel constructor
      const user = new UserModel({ loanNumber: newLoanNumber, ...req.body });
      await user.save();
      await updateOverdueInstallments();
      res.status(201).json(user);
  } catch (err) {
      res.status(422).json({ status:'error', message: 'All feilds required' + err });
  }
};

exports.getUsers = async(req, res)=>{
    try{
      const loanNumber = req.params.loanNumber;
      const user = await UserModel.findOne({loanNumber });
  
      if(!user) {
        return res.status(404).json({error: 'User Not Found'})
      }
      res.status(200).json({ status: 'success', user });
    }catch(err){
      res.status(400).json({error: err.message});
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        let query = UserModel.find();

        if(req.query.fields){
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        }
        const users = await query.exec();

        if (!users || users.length === 0) {
            return res.status(404).json({ error: 'No users found' });
        }

        res.status(200).json({ status: 'success', length: users.length, users });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};



exports.activeLoanPayer = async(req, res) =>{
    try{
       const users = await UserModel.aggregate([
            {
            $match: {
                "loanDetails.isActive":true,
            }},
            {
                $project:{
                    "loanNumber": "$loanNumber",
                    "loanPayerName": "$details.loanPayerDetails.name",
                    "loanBalance" : "$loanDetails.totalEmiAmount",
                    "mobileNum1": "$details.loanPayerDetails.mobileNum1",
                    "vehicalNum" : "$details.vehicle.vehicleNumber",
                    "vehicalType" : "$details.vehicle.type",
                    "vehicalModel": "$details.vehicle.model"
                }
            }
        ]);
        res.status(200).json({
            status:'Success',
            data: users
        })
        
    }catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while fetching overdue installments.'
        });
    }
}


exports.updateLoanPayer = async (req, res) => {
    try {
        const loanNumber = req.params.loanNumber;
        const { installmentNo, emiPaid, overdueAmount, overduePaid, paidDate } = req.body;
        // Find the user by loanNumber
        const user = await UserModel.findOne({ loanNumber });
        // Find the installment object that matches the installment number
        const installmentObject = user.loanDetails.instalmentObject.find(installment => installment.installmentNo === installmentNo);
        // Check if installment is already paid
        if (installmentObject.isPaid) {
            return res.status(400).json({ error: 'Installment is already paid' });
        }
        // Update installment object properties
        installmentObject.emiPaid = emiPaid;
        if (emiPaid === installmentObject.totalEmiAmountRoundoff) {
            // If emiPaid equals totalEmiAmountRoundoff, mark the installment as paid
            installmentObject.isPaid = true;
        }
        // Update overdueAmount and overduePaid
        installmentObject.overdueAmount = overdueAmount;
        installmentObject.overduePaid = overduePaid;
        // Calculate overDueBalance
        const overDueBalance = overdueAmount - overduePaid;
        installmentObject.overDueBalance = overDueBalance;

        if (paidDate) {
            installmentObject.paidDate = paidDate;
        }

        await user.save();
        await updateLoanDetails(loanNumber);
        await updateOverdueInstallmentsForOne(loanNumber);

        res.status(200).json({ message: 'Loan payer updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
