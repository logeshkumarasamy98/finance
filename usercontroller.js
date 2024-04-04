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