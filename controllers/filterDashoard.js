// const ledgerModel = require('../model/ledgerModel');
// const loanModel = require('../model/loanModel');

// exports.activeLoanPayer = async (req, res) => {
//     try {
//         const users = await loanModel.aggregate([
//             {
//                 $match: {
//                     "loanDetails.isActive": true,
//                 }
//             },
//             {
//                 $project: {
//                     "loanNumber": 1,
//                     "loanPayerName": "$details.loanPayerDetails.name",
//                     "loanBalance": "$loanDetails.totalEmiBalance", // Assuming this field exists
//                     "mobileNum1": "$details.loanPayerDetails.mobileNum1",
//                     "vehicalNum": "$details.vehicle.vehicleNumber",
//                     "vehicalType": "$details.vehicle.type",
//                     "vehicalModel": "$details.vehicle.model"
//                 }
//             }
//         ]);
//         res.status(200).json({
//             status: 'Success',
//             length: users.length,
//             data: users
//         });

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({
//             status: 'error',
//             message: 'An error occurred while fetching active loan payer details.'
//         });
//     }
// }

// exports.activeLoanPayerLength = async (req, res) => {
//     try {
//         const users = await loanModel.aggregate([
//             {
//                 $match: {
//                     "loanDetails.isActive": true,
//                 }
//             },
//         ]);
//         res.status(200).json({
//             status: 'Success',
//             length: users.length
//         });

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({
//             status: 'error',
//             message: 'An error occurred while fetching active loan payer details.'
//         });
//     }
// }


// exports.seizedLoanPayer = async (req, res) => {
//     try {
//         const users = await loanModel.aggregate([
//             {
//                 $match: {
//                     "loanDetails.isSeized": true,
//                 }
//             },
//             {
//                 $project: {
//                     "loanNumber": 1,
//                     "loanPayerName": "$details.loanPayerDetails.name",
//                     "loanBalance": "$loanDetails.totalEmiBalance", // Assuming this field exists
//                     "mobileNum1": "$details.loanPayerDetails.mobileNum1",
//                     "vehicalNum": "$details.vehicle.vehicleNumber",
//                     "vehicalType": "$details.vehicle.type",
//                     "vehicalModel": "$details.vehicle.model"
//                 }
//             }
//         ]);
//         res.status(200).json({
//             status: 'Success',
//             length: users.length,
//             data: users
//         });

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({
//             status: 'error',
//             message: 'An error occurred while fetching active loan payer details.'
//         });
//     }
// }

// exports.seizedLoanPayerLength = async (req, res) => {
//     try {
//         const users = await loanModel.aggregate([
//             {
//                 $match: {
//                     "loanDetails.isSeized": true,
//                 }
//             },
//         ]);
//         res.status(200).json({
//             status: 'Success',
//             length: users.length
//         });

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({
//             status: 'error',
//             message: 'An error occurred while fetching active loan payer details.'
//         });
//     }
// }



// exports.closedLoanPayer = async (req, res) => {
//     try {
//         const users = await loanModel.aggregate([
//             {
//                 $match: {
//                     "loanDetails.isActive": false,
//                 }
//             },
//             {
//                 $project: {
//                     "loanNumber": 1,
//                     "loanPayerName": "$details.loanPayerDetails.name",
//                     "loanBalance": "$loanDetails.totalEmiBalance", // Assuming this field exists
//                     "mobileNum1": "$details.loanPayerDetails.mobileNum1",
//                     "vehicalNum": "$details.vehicle.vehicleNumber",
//                     "vehicalType": "$details.vehicle.type",
//                     "vehicalModel": "$details.vehicle.model"
//                 }
//             }
//         ]);
//         res.status(200).json({
//             status: 'Success',
//             length: users.length,
//             data: users
//         });

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({
//             status: 'error',
//             message: 'An error occurred while fetching active loan payer details.'
//         });
//     }
// }

// exports.closedLoanPayerLength = async (req, res) => {
//     try {
//         const users = await loanModel.aggregate([
//             {
//                 $match: {
//                     "loanDetails.isActive": false,
//                 }
//             },
//         ]);
//         res.status(200).json({
//             status: 'Success',
//             length: users.length
//         });

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({
//             status: 'error',
//             message: 'An error occurred while fetching active loan payer details.'
//         });
//     }
// }

// exports.LoanPayerDetails = async (req, res) => {
//     const loanNumber = parseInt(req.params.loanNumber);
//     try {
//         const loanData = await loanModel.aggregate([
//             {
//                 $match: {
//                     loanNumber: loanNumber 
//                 }
//             },
//             {
//                 $project: {
//                     "loanNumber": "$loanNumber",
//                     "loanPayerName": "$details.loanPayerDetails.name",
//                     "loanBalance": "$loanDetails.totalEmiAmount",
//                     "mobileNum1": "$details.loanPayerDetails.mobileNum1",
//                     "vehicalNum": "$details.vehicle.vehicleNumber",
//                     "vehicalType": "$details.vehicle.type",
//                     "vehicalModel": "$details.vehicle.model"
//                 }
//             }
//         ]);
  
//       res.status(200).json({
//         status: 'Success',
//         data: loanData,
//       });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({
//         status: 'error',
//         message: 'Error fetching active loan payer details.',
//       });
//     }
//   };

// exports.pendingEmiPayerLength = async(req, res)=>{
//     try{
//         const users = await loanModel.aggregate([
//            { $match: {
//                 "loanDetails.emiPending":true,
//             }},
//         ])
//         res.status(200).json({
//             status:'Success',
//             length:users.length,
//                 })
//     }catch(err){
//         console.error(err);
//         res.status(500).json({
//             status: 'error',
//             message: 'An error occurred while fetching overdue installments.'
//         });

//     }
// }

// exports.totalEmiBalanceSum = async (req, res) => {
//     try {
//         const totalEmiBalanceSum = await loanModel.aggregate([
//             {
//                 $group: {
//                     _id: null,
//                     totalEmiBalanceSum: {
//                         $sum: "$loanDetails.totalEmiBalance"
//                     }
//                 }
//             }
//         ]);

//         res.status(200).json({ totalEmiBalanceSum });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };


// exports.vehicleTypePercentage = async (req, res) => {
//     try {
//         const vehicleTypeCounts = await loanModel.aggregate([
//             {
//                 $group: {
//                     _id: "$details.vehicle.type",
//                     count: { $sum: 1 }
//                 }
//             },
//             {
//                 $group: {
//                     _id: null,
//                     total: { $sum: "$count" },
//                     types: { $push: { type: "$_id", count: "$count" } }
//                 }
//             }
//         ]);

//         if (vehicleTypeCounts.length === 0) {
//             return res.status(200).json({ vehicleTypePercentage: [] }); 
//         }

//         const totalVehicles = vehicleTypeCounts[0].total;
//         const types = vehicleTypeCounts[0].types;

//         const vehicleTypePercentage = types.map(type => ({
//             type: type.type,
//             percentage: ((type.count / totalVehicles) * 100).toFixed(2) + '%'
//         }));

//         res.status(200).json({ vehicleTypePercentage });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

// exports.getPendingEmiDetails = async (req, res) => {
//     try {
        
//         const pendingEmiDetails = await loanModel.aggregate([
//             {
//                 $match: {
//                     "loanDetails.emiPending": true,
//                 }
//             },
//             {
//                 $lookup: {
//                     from: "usermodels", 
//                     localField: "details.loanPayerDetails.name",
//                     foreignField: "details.loanPayerDetails.name",
//                     as: "user"
//                 }
//             },
//             {
//                 $match: {
//                     "loanDetails.instalmentObject.isPaid": false,
//                     "loanDetails.instalmentObject.dueDate": { $lte: new Date() }
//                 }
//             },
//             {
//                 $project: {
//                     loanNumber: "$loanNumber",
//                     loanPayerName: "$details.loanPayerDetails.name",
//                     phoneNumber1: "$details.loanPayerDetails.mobileNum1", 
//                     pendingEmiNum: "$loanDetails.pendingEmiNum",
//                     emiPendingDate: "$loanDetails.emiPendingDate",
//                     totalEmiAmountRoundoff: {
//                         $arrayElemAt: ["$loanDetails.instalmentObject.totalEmiAmountRoundoff", 0]
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


// // exports.ledgerDatas = (req, res) => {
    
// //     const params = req.query;

// //     const constructFilterOptions = (params) => {
// //         const filterOptions = {};
        
// //         if (params.startDate) {
// //             const startDate = new Date(params.startDate);
// //             filterOptions.entryDate = {
// //                 $gte: startDate,
// //                 $lte: startDate
// //             };
// //         }

// //         if (params.isExpense !== undefined) {
// //             filterOptions.isExpense = params.isExpense;
// //         }
// //         if (params.isInvestment !== undefined) {
// //             filterOptions.isInvestment = params.isInvestment;
// //         }
// //         if (params.isLoanDebit !== undefined) {
// //             filterOptions.isLoanDebit = params.isLoanDebit;
// //         }
// //         if (params.isLoanCredit !== undefined) {
// //             filterOptions.isLoanCredit = params.isLoanCredit;
// //         }

// //         return filterOptions;
// //     };

// //     const filterOptions = constructFilterOptions(params);

// //     ledgerModel.find(filterOptions)
// //         .sort({ entryDate: -1 }) // Sort by entryDate in descending order
// //         .then(results => {
// //             res.json(results);
// //         })
// //         .catch(err => {
// //             console.error('Error:', err);
// //             res.status(500).send('Internal Server Error');
// //         });
// // }



// // Import required modules


// // Define the function to handle the API endpoint
// exports.ledgerDatas = (req, res) => {
//     const params = req.query;

//     const constructFilterOptions = (params) => {
//         const filterOptions = {};

//         if (params.startDate && params.endDate) {
//             const startDate = new Date(params.startDate);
//             const endDate = new Date(params.endDate);
//             filterOptions.entryDate = {
//                 $gte: startDate,
//                 $lte: endDate
//             };
//         } else if (params.startDate) {
//             const startDate = new Date(params.startDate);
//             // Set end date to the same as the start date
//             const endDate = new Date(params.startDate);
//             // Adjust end date to end of the day (23:59:59) to include all entries of the day
//             endDate.setHours(23, 59, 59, 999);
//             filterOptions.entryDate = {
//                 $gte: startDate,
//                 $lte: endDate
//             };
//         } else if (params.endDate) {
//             const endDate = new Date(params.endDate);
//             filterOptions.entryDate = {
//                 $lte: endDate
//             };
//         }

//         const orConditions = [];
//         if (params.hasOwnProperty('isExpense')) {
//             orConditions.push({ isExpense: params.isExpense });
//         }
//         if (params.hasOwnProperty('isInvestment')) {
//             orConditions.push({ isInvestment: params.isInvestment });
//         }
//         if (params.hasOwnProperty('isLoanDebit')) {
//             orConditions.push({ isLoanDebit: params.isLoanDebit });
//         }
//         if (params.hasOwnProperty('isLoanCredit')) {
//             orConditions.push({ isLoanCredit: params.isLoanCredit });
//         }
//         if (orConditions.length > 0) {
//             filterOptions.$or = orConditions;
//         }
    
//         return filterOptions;
//     };
    
//     const filterOptions = constructFilterOptions(params);

//     ledgerModel.find(filterOptions)
//         .sort({ entryDate: -1 })
//         .then(results => {
            
//             res.json({ results});
//         })
//         .catch(err => {
//             console.error('Error:', err);
//             res.status(500).send('Internal Server Error');
//         });
// }


// exports.getOverDueUsers = async (req, res) => {
//     try {
//         const pendingEmiDetails = await loanModel.aggregate([
//             {
//                 $match: {
//                     "loanDetails.totalOverdueAmountToBePaid": { $gt: 0 }
//                 }
//             },
//             {
//                 $project: {
//                     loanNumber: "$loanNumber",
//                     loanPayerName: "$details.loanPayerDetails.name",
//                     loanBalance: "$loanDetails.totalEmiAmount",
//                     mobileNum1: "$details.loanPayerDetails.mobileNum1",
//                     vehicalNum: "$details.vehicle.vehicleNumber",
//                     vehicalType: "$details.vehicle.type",
//                     vehicalModel: "$details.vehicle.model"
//                 }
//             }
//         ]);

//         const pendingEmiDetailsLength = pendingEmiDetails.length;

//         res.status(200).json({ pendingEmiDetails, length: pendingEmiDetailsLength });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

// exports.getOverDueLength = async (req, res) => {
//     try {
//         const pendingEmiDetails = await loanModel.aggregate([
//             {
//                 $match: {
//                     "loanDetails.totalOverdueAmountToBePaid": { $gt: 0 }
//                 }
//             },
//         ]);

//         const pendingEmiDetailsLength = pendingEmiDetails.length;

//         res.status(200).json({ 
//             status:'Success',
//             length: pendingEmiDetailsLength });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };


const ledgerModel = require('../model/ledgerModel');
const loanModel = require('../model/loanModel');

exports.activeLoanPayer = async (req, res) => {
    const companyId = req.companyId;
    try {
        let users = await loanModel.aggregate([
            {
                $match: {
                    "loanDetails.isActive": true,
                }
            },
            {
                $project: {
                    "loanNumber": 1,
                    "loanPayerName": "$details.loanPayerDetails.name",
                    "loanBalance": "$loanDetails.totalEmiBalance",
                    "mobileNum1": "$details.loanPayerDetails.mobileNum1",
                    "vehicalNum": "$details.vehicle.vehicleNumber",
                    "vehicalType": "$details.vehicle.type",
                    "vehicalModel": "$details.vehicle.model",
                    "company": 1 // Including company field in the projection
                }
            }
        ]);

        // Filter users by companyId
        users = users.filter(user => user.company.toString() === companyId);

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


exports.activeLoanPayerLength = async (req, res) => {
    const companyId = req.companyId;
    console.log('Active loan payer length company id: ', companyId);

    try {

        
        // First, filter by "loanDetails.isActive": true
        let users = await loanModel.aggregate([
            {
                $match: {
                    "loanDetails.isActive": true,
                    

                }
            }
        ]);
        console.log(users.length)
        users = users.filter(user => user.company.toString() === companyId);
        
        res.status(200).json({
            status: 'Success',
            length: users.length
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while fetching active loan payer details.'
        });
    }
};



exports.seizedLoanPayer = async (req, res) => {
    const companyId = req.companyId;    try {
        const users = await loanModel.aggregate([
            {
                $match: {
                    "loanDetails.isSeized": true,
                                    }
            },
            {
                $project: {
                    "loanNumber": 1,
                    "loanPayerName": "$details.loanPayerDetails.name",
                    "loanBalance": "$loanDetails.totalEmiBalance",
                    "mobileNum1": "$details.loanPayerDetails.mobileNum1",
                    "vehicalNum": "$details.vehicle.vehicleNumber",
                    "vehicalType": "$details.vehicle.type",
                    "vehicalModel": "$details.vehicle.model"
                }
            }
        ]);
        users = users.filter(user => user.company.toString() === companyId);

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

exports.seizedLoanPayerLength = async (req, res) => {
    const companyId = req.companyId;    try {
        const users = await loanModel.aggregate([
            {
                $match: {
                    "loanDetails.isSeized": true,
                                    }
            },
        ]);

        users = users.filter(user => user.company.toString() === companyId);

        res.status(200).json({
            status: 'Success',
            length: users.length
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while fetching active loan payer details.'
        });
    }
}

exports.closedLoanPayer = async (req, res) => {
    const companyId = req.companyId;    try {
        const users = await loanModel.aggregate([
            {
                $match: {
                    "loanDetails.isActive": false,
                                    }
            },
            {
                $project: {
                    "loanNumber": 1,
                    "loanPayerName": "$details.loanPayerDetails.name",
                    "loanBalance": "$loanDetails.totalEmiBalance",
                    "mobileNum1": "$details.loanPayerDetails.mobileNum1",
                    "vehicalNum": "$details.vehicle.vehicleNumber",
                    "vehicalType": "$details.vehicle.type",
                    "vehicalModel": "$details.vehicle.model"
                }
            }
        ]);
        users = users.filter(user => user.company.toString() === companyId);

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

exports.closedLoanPayerLength = async (req, res) => {
    const companyId = req.companyId;    try {
        const users = await loanModel.aggregate([
            {
                $match: {
                    "loanDetails.isActive": false,
                                    }
            },
        ]);
        res.status(200).json({
            status: 'Success',
            length: users.length
        });
        users = users.filter(user => user.company.toString() === companyId);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while fetching active loan payer details.'
        });
    }
}

exports.LoanPayerDetails = async (req, res) => {
    const companyId = req.companyId;    const loanNumber = parseInt(req.params.loanNumber);
    try {
        const loanData = await loanModel.aggregate([
            {
                $match: {
                    loanNumber: loanNumber,
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

exports.pendingEmiPayerLength = async (req, res) => {
    const companyId = req.companyId;    try {
        const users = await loanModel.aggregate([
            {
                $match: {
                    "loanDetails.emiPending": true,
                                    }
            },
        ]);
        res.status(200).json({
            status: 'Success',
            length: users.length,
        });

        users = users.filter(user => user.company.toString() === companyId);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while fetching overdue installments.'
        });
    }
}

exports.totalEmiBalanceSum = async (req, res) => {
    const companyId = req.companyId;    try {
        const totalEmiBalanceSum = await loanModel.aggregate([
            {
                $match: {
                                    }
            },
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
    const companyId = req.companyId;    try {
        const vehicleTypeCounts = await loanModel.aggregate([
            {
                $match: {
                                    }
            },
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
            return res.status(200).json({ vehicleTypePercentage: [] }); 
        }

        const totalVehicles = vehicleTypeCounts[0].total;
        const types = vehicleTypeCounts[0].types;

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
    const companyId = req.companyId;    try {
        const pendingEmiDetails = await loanModel.aggregate([
            {
                $match: {
                    "loanDetails.emiPending": true,
                                    }
            },
            {
                $lookup: {
                    from: "usermodels", 
                    localField: "details.loanPayerDetails.name",
                    foreignField: "details.loanPayerDetails.name",
                    as: "user"
                }
            },
            {
                $match: {
                    "loanDetails.instalmentObject.isPaid": false,
                    "loanDetails.instalmentObject.dueDate": { $lte: new Date() }
                }
            },
            {
                $project: {
                    loanNumber: "$loanNumber",
                    loanPayerName: "$details.loanPayerDetails.name",
                    phoneNumber1: "$details.loanPayerDetails.mobileNum1", 
                    pendingEmiNum: "$loanDetails.pendingEmiNum",
                    emiPendingDate: "$loanDetails.emiPendingDate",
                    totalEmiAmountRoundoff: {
                        $arrayElemAt: ["$loanDetails.instalmentObject.totalEmiAmountRoundoff", 0]
                    }
                }
            },
            {
                $sort: {
                    "emiPendingDate": 1
                }
            }
        ]);

        pendingEmiDetails = pendingEmiDetails.filter(pendingEmiDetails => pendingEmiDetails.company.toString() === companyId);


        res.status(200).json({ pendingEmiDetails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.ledgerDatas = (req, res) => {
    const companyId = req.companyId;    const params = req.query;

    const constructFilterOptions = (params) => {
        const filterOptions = { companyId };

        if (params.startDate && params.endDate) {
            const startDate = new Date(params.startDate);
            const endDate = new Date(params.endDate);
            filterOptions.entryDate = {
                $gte: startDate,
                $lte: endDate
            };
        } else if (params.startDate) {
            const startDate = new Date(params.startDate);
            const endDate = new Date(params.startDate);
            endDate.setHours(23, 59, 59, 999);
            filterOptions.entryDate = {
                $gte: startDate,
                $lte: endDate
            };
        } else if (params.endDate) {
            const endDate = new Date(params.endDate);
            filterOptions.entryDate = {
                $lte: endDate
            };
        }

        const orConditions = [];
        if (params.hasOwnProperty('isExpense')) {
            orConditions.push({ isExpense: params.isExpense });
        }
        if (params.hasOwnProperty('isInvestment')) {
            orConditions.push({ isInvestment: params.isInvestment });
        }
        if (params.hasOwnProperty('isLoanDebit')) {
            orConditions.push({ isLoanDebit: params.isLoanDebit });
        }
        if (params.hasOwnProperty('isLoanCredit')) {
            orConditions.push({ isLoanCredit: params.isLoanCredit });
        }
        if (orConditions.length > 0) {
            filterOptions.$or = orConditions;
        }

        return filterOptions;
    };

    const filterOptions = constructFilterOptions(params);

    ledgerModel.find(filterOptions)
        .sort({ entryDate: -1 })
        .then(results => {
            res.json({ results });
        })
        .catch(err => {
            console.error('Error:', err);
            res.status(500).send('Internal Server Error');
        });
}

exports.getOverDueUsers = async (req, res) => {
    const companyId = req.companyId;
        try {
        const pendingEmiDetails = await loanModel.aggregate([
            {
                $match: {
                    "loanDetails.totalOverdueAmountToBePaid": { $gt: 0 },
                                    }
            },
            {
                $project: {
                    loanNumber: "$loanNumber",
                    loanPayerName: "$details.loanPayerDetails.name",
                    loanBalance: "$loanDetails.totalEmiAmount",
                    mobileNum1: "$details.loanPayerDetails.mobileNum1",
                    vehicalNum: "$details.vehicle.vehicleNumber",
                    vehicalType: "$details.vehicle.type",
                    vehicalModel: "$details.vehicle.model"
                }
            }
        ]);
        pendingEmiDetails = pendingEmiDetails.filter(pendingEmiDetails => pendingEmiDetails.company.toString() === companyId);

        const pendingEmiDetailsLength = pendingEmiDetails.length;

        res.status(200).json({ pendingEmiDetails, length: pendingEmiDetailsLength });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getOverDueLength = async (req, res) => {
    const  companyId  = req.companyId;
    try {
        const pendingEmiDetails = await loanModel.aggregate([
            {
                $match: {
                    "loanDetails.totalOverdueAmountToBePaid": { $gt: 0 },
                                    }
            },
        ]);

        pendingEmiDetails = pendingEmiDetails.filter(pendingEmiDetails => pendingEmiDetails.company.toString() === companyId);

        res.status(200).json({
            status: 'Success',
            length: pendingEmiDetailsLength.length
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
