const UserModel = require('./UserSchema');


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

      res.status(201).json(user);
  } catch (err) {
      res.status(400).json({ error: err.message });
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

exports.updateUser = async (req, res) => {
    try {
        const customId = req.params.loanNumber; 
        const updateFields = req.body;
        if (!customId) {
            return res.status(400).json({ error: 'Custom ID is required' });
        }
        const updatedUser = await UserModel.findOneAndUpdate({ customId: customId }, updateFields, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found or update failed' });
        }
        res.status(200).json({ status: 'success', user: updatedUser });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// exports.test = async (req, res) => {
//     try {
//         const now = new Date();
//         const IST_offset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
//         const IST_date = new Date(now.getTime() + IST_offset);

//         const users = await UserModel.aggregate([
//             {
//                 $match: {
//                     "$or": [
//                         { "loanDetails.instalmentObject.paidDate": null },
//                         { "loanDetails.instalmentObject.paidDate": { "$lte": new Date() } }
//                     ]
//                 }
//             },
//             {
//                 $project: {
//                     "loanNumber": "$loanNumber",
//                     "loanPayerName": "$details.loanPayerDetails.name"
//                 }
//             }
//         ]);

//         res.status(200).json({
//             status: 'success',
//             data: users
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({
//             status: 'error',
//             message: 'An error occurred while fetching overdue installments.'
//         });
//     }
// };


exports.activeLoanPayer = async(req, res) =>{
    try{
        users = await UserModel.aggregate([
            {
            $match: {
                "loanDetails.isActive":true,
            }},
            {
                $project:{
                    "loanNumber": "$loanNumber",
                    "loanPayerName": "$details.loanPayerDetails.name",
                    "mobileNum": "$details.loanPayerDetails.mobileNum"
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