const ledgerModel = require('../model/ledgerModel');
const loanModel = require('../model/loanModel');

exports.activeLoanPayer = async (req, res) => {
    try {
        const users = await loanModel.aggregate([
            {
                $match: {
                    "loanDetails.isActive": true,
                }
            },
            {
                $project: {
                    "loanNumber": "$loanNumber",
                    "loanPayerName": "$details.loanPayerDetails.name",
                    "loanBalance": "$loanDetails.totalEmiBalance", // Assuming this field exists
                    "mobileNum1": "$details.loanPayerDetails.mobileNum1",
                    "vehicalNum": "$details.vehicle.vehicleNumber",
                    "vehicalType": "$details.vehicle.type",
                    "vehicalModel": "$details.vehicle.model"
                }
            }
        ]);
        res.status(200).json({
            status: 'Success',
            length: users.length,
            data: users
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while fetching active loan payer details.'
        });
    }
}

exports.LoanPayerDetails = async (req, res) => {
    const loanNumber = parseInt(req.params.loanNumber);
    try {
        const loanData = await loanModel.aggregate([
            {
                $match: {
                    loanNumber: loanNumber // Match loanNumber directly without using quotes
                }
            },
            {
                $project: {
                    "loanNumber": "$loanNumber",
                    "loanPayerName": "$details.loanPayerDetails.name",
                    "loanBalance": "$loanDetails.totalEmiAmount",
                    "mobileNum1": "$details.loanPayerDetails.mobileNum1",
                    "vehicalNum": "$details.vehicle.vehicleNumber",
                    "vehicalType": "$details.vehicle.type",
                    "vehicalModel": "$details.vehicle.model"
                }
            }
        ]);
  
      res.status(200).json({
        status: 'Success',
        data: loanData,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: 'error',
        message: 'Error fetching active loan payer details.',
      });
    }
  };

exports.pendingEmiPayer = async(req, res)=>{
    try{
        const users = await loanModel.aggregate([
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
        const totalEmiBalanceSum = await loanModel.aggregate([
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


exports.vehicleTypePercentage = async (req, res) => {
    try {
        const vehicleTypeCounts = await loanModel.aggregate([
            {
                $group: {
                    _id: "$details.vehicle.type",
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$count" },
                    types: { $push: { type: "$_id", count: "$count" } }
                }
            }
        ]);

        if (vehicleTypeCounts.length === 0) {
            return res.status(200).json({ vehicleTypePercentage: [] }); // Return empty array if no data
        }

        const totalVehicles = vehicleTypeCounts[0].total;
        const types = vehicleTypeCounts[0].types;

        // Calculate percentage for each type
        const vehicleTypePercentage = types.map(type => ({
            type: type.type,
            percentage: ((type.count / totalVehicles) * 100).toFixed(2) + '%'
        }));

        res.status(200).json({ vehicleTypePercentage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getPendingEmiDetails = async (req, res) => {
    try {
        let startDate, endDate;
        
        // Remove the logic for setting startDate and endDate
        
        const pendingEmiDetails = await loanModel.aggregate([
            {
                $match: {
                    "loanDetails.emiPending": true,
                    // Remove the date range condition
                }
            },
            {
                $project: {
                    loanNumber: 1,
                    loanPayerName: "$details.loanPayerDetails.name",
                    pendingEmiNum: "$loanDetails.pendingEmiNum",
                    emiPendingDate: "$loanDetails.emiPendingDate",
                    instalmentObject: {
                        $filter: {
                            input: "$loanDetails.instalmentObject",
                            as: "installment",
                            cond: {
                                $and: [
                                    { $eq: ["$$installment.isPaid", false] },
                                    // Remove the condition for dueDate
                                ]
                            }
                        }
                    },
                    totalEmiAmountRoundoff: {
                        $arrayElemAt: ["$loanDetails.instalmentObject.totalEmiAmountRoundoff", 0]
                    }
                }
            },
            {
                $addFields: {
                    instalmentObject: {
                        $cond: {
                            if: { $eq: [{ $size: "$instalmentObject" }, 0] },
                            then: "$$REMOVE",
                            else: "$instalmentObject"
                        }
                    }
                }
            },
            {
                $sort: {
                    "emiPendingDate": 1
                }
            }
        ]);

        res.status(200).json({ pendingEmiDetails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// exports.getPendingEmiDetails = async (req, res) => {
//     try {
//         let startDate, endDate;
        
//         // Check if startDate and endDate are provided in the request query
//         if (req.query.startDate && req.query.endDate) {
//             // If provided, use them as the date range
//             startDate = new Date(req.query.startDate);
//             endDate = new Date(req.query.endDate);
//         } else {
//             // If not provided, calculate default startDate as today's date minus 7 days
//             startDate = new Date();
//             startDate.setDate(startDate.getDate() - 7);
            
//             // Default endDate is today's date
//             endDate = new Date();
//         }
        
//         const pendingEmiDetails = await loanModel.aggregate([
//             {
//                 $match: {
//                     "loanDetails.emiPending": true,
//                     "loanDetails.instalmentObject.dueDate": {
//                         $gte: startDate,
//                         $lte: endDate
//                     }
//                 }
//             },
//             {
//                 $project: {
//                     loanNumber: 1,
//                     loanPayerName: "$details.loanPayerDetails.name",
//                     pendingEmiNum: "$loanDetails.pendingEmiNum",
//                     emiPendingDate: "$loanDetails.emiPendingDate",
//                     instalmentObject: {
//                         $filter: {
//                             input: "$loanDetails.instalmentObject",
//                             as: "installment",
//                             cond: {
//                                 $and: [
//                                     { $eq: ["$$installment.isPaid", false] },
//                                     { $eq: ["$$installment.dueDate", startDate] }
//                                 ]
//                             }
//                         }
//                     },
//                     totalEmiAmountRoundoff: {
//                         $arrayElemAt: ["$loanDetails.instalmentObject.totalEmiAmountRoundoff", 0]
//                     }
//                 }
//             },
//             {
//                 $addFields: {
//                     instalmentObject: {
//                         $cond: {
//                             if: { $eq: [{ $size: "$instalmentObject" }, 0] },
//                             then: "$$REMOVE",
//                             else: "$instalmentObject"
//                         }
//                     }
//                 }
//             },
//             {
//                 $sort: {
//                     "emiPendingDate": 1
//                 }
//             }
//         ]);

//         res.status(200).json({ pendingEmiDetails });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

exports.ledgerDatas = (req, res) => {
    // Extract query parameters from the request
    const params = req.query;

    // Function to construct filter options dynamically based on provided parameters
    const constructFilterOptions = (params) => {
        const filterOptions = {};
        
        // Check if entryDate filter is provided in params
        if (params.startDate && params.endDate) {
            filterOptions.entryDate = {
                $gte: new Date(params.startDate), 
                $lte: new Date(params.endDate)
            };
        }

        // Check if other boolean fields are provided in params
        if (params.isExpense !== undefined) {
            filterOptions.isExpense = params.isExpense;
        }
        if (params.isInvestment !== undefined) {
            filterOptions.isInvestment = params.isInvestment;
        }
        if (params.isLoanDebit !== undefined) {
            filterOptions.isLoanDebit = params.isLoanDebit;
        }
        if (params.isLoanCredit !== undefined) {
            filterOptions.isLoanCredit = params.isLoanCredit;
        }

        return filterOptions;
    };

    // Construct filter options based on params
    const filterOptions = constructFilterOptions(params);

    // Perform the query using the constructed filter options
    ledgerModel.find(filterOptions)
        .then(results => {
            res.json(results);
        })
        .catch(err => {
            console.error('Error:', err);
            res.status(500).send('Internal Server Error');
        });
}