const UserModel = require('../model/loanSchema');

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
            length:users.length,
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

exports.pendingEmiPayer = async(req, res)=>{
    try{
        const users = await UserModel.aggregate([
           { $match: {
                "loanDetails.emiPending":true,
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
        ])
        res.status(200).json({
            status:'Success',
            length:users.length,
            data: users
        })
    }catch(err){
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while fetching overdue installments.'
        });

    }
}

exports.totalEmiBalanceSum = async (req, res) => {
    try {
        const totalEmiBalanceSum = await UserModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalEmiBalanceSum: {
                        $sum: "$loanDetails.totalEmiBalance"
                    }
                }
            }
        ]);

        res.status(200).json({ totalEmiBalanceSum });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
