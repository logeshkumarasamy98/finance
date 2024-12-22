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
const xlsx = require('xlsx');
const mongoose = require('mongoose');

exports.activeLoanPayer = async (req, res) => {
    const companyId = req.companyId;
    try {
        let users = await loanModel.aggregate([
            { $match: { "loanDetails.isActive": true } },
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
};

exports.activeLoanPayerLength = async (req, res) => {
    const companyId = req.companyId;
    console.log('Active loan payer length company id: ', companyId);

    try {
        // First, filter by "loanDetails.isActive": true
        let users = await loanModel.aggregate([
            { $match: { "loanDetails.isActive": true } }
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
};

exports.seizedLoanPayer = async (req, res) => {
    const companyId = req.companyId;
    try {
        let users = await loanModel.aggregate([
            { $match: { "loanDetails.isSeized": true } },
            {
                $project: {
                    "loanNumber": 1,
                    "loanPayerName": "$details.loanPayerDetails.name",
                    "loanBalance": "$loanDetails.totalEmiBalance",
                    "mobileNum1": "$details.loanPayerDetails.mobileNum1",
                    "vehicalNum": "$details.vehicle.vehicleNumber",
                    "vehicalType": "$details.vehicle.type",
                    "vehicalModel": "$details.vehicle.model",
                    "company": 1
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
            message: 'An error occurred while fetching seized loan payer details.'
        });
    }
};

exports.seizedLoanPayerLength = async (req, res) => {
    const companyId = req.companyId;
    try {
        let users = await loanModel.aggregate([
            { $match: { "loanDetails.isSeized": true } }
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
            message: 'An error occurred while fetching seized loan payer details.'
        });
    }
};

exports.closedLoanPayer = async (req, res) => {
    const companyId = req.companyId;
    try {
        let users = await loanModel.aggregate([
            { $match: { "loanDetails.isActive": false } },
            {
                $project: {
                    "loanNumber": 1,
                    "loanPayerName": "$details.loanPayerDetails.name",
                    "loanBalance": "$loanDetails.totalEmiBalance",
                    "mobileNum1": "$details.loanPayerDetails.mobileNum1",
                    "vehicalNum": "$details.vehicle.vehicleNumber",
                    "vehicalType": "$details.vehicle.type",
                    "vehicalModel": "$details.vehicle.model",
                    "company": 1
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
            message: 'An error occurred while fetching closed loan payer details.'
        });
    }
};

exports.closedLoanPayerLength = async (req, res) => {
    const companyId = req.companyId;
    try {
        let users = await loanModel.aggregate([
            { $match: { "loanDetails.isActive": false } }
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
            message: 'An error occurred while fetching closed loan payer details.'
        });
    }
};

exports.LoanPayerDetails = async (req, res) => {
    const companyId = req.companyId;
    const loanNumber = parseInt(req.params.loanNumber);

    try {
        let loanData = await loanModel.aggregate([
            { $match: { loanNumber: loanNumber } },
            {
                $project: {
                    "loanNumber": "$loanNumber",
                    "loanPayerName": "$details.loanPayerDetails.name",
                    "loanBalance": "$loanDetails.totalEmiAmount",
                    "mobileNum1": "$details.loanPayerDetails.mobileNum1",
                    "vehicalNum": "$details.vehicle.vehicleNumber",
                    "vehicalType": "$details.vehicle.type",
                    "vehicalModel": "$details.vehicle.model",
                    "company": "$company"
                }
            }
        ]);

        console.log('Aggregated Data:', loanData);

        // Filter users by companyId
        loanData = loanData.filter(user => user.company && user.company.toString() === companyId);

        res.status(200).json({
            status: 'Success',
            data: loanData
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching loan payer details.'
        });
    }
};

exports.getLoanDetailsByPhoneNumber = async (req, res) => {
    const { mobileNumber } = req.params; // Extract the phone number from the route parameters
    const companyId = req.companyId; // Extract companyId from the request

    try {
        // Perform aggregation to filter by phone number
        let loanData = await loanModel.aggregate([
            {
                $match: {
                    "details.loanPayerDetails.mobileNum1": parseInt(mobileNumber) // Match the provided phone number
                }
            },
            {
                $project: {
                    "loanNumber": "$loanNumber",
                    "loanPayerName": "$details.loanPayerDetails.name",
                    "loanBalance": "$loanDetails.totalEmiAmount",
                    "mobileNum1": "$details.loanPayerDetails.mobileNum1",
                    "vehicleNumber": "$details.vehicle.vehicleNumber",
                    "vehicleType": "$details.vehicle.type",
                    "vehicleModel": "$details.vehicle.model",
                    "company": "$company"
                }
            }
        ]);

        console.log('Aggregated Data:', loanData);

        // Filter results by companyId
        loanData = loanData.filter(user => user.company && user.company.toString() === companyId);

        res.status(200).json({
            status: 'Success',
            data: loanData
        });
    } catch (err) {
        console.error('Error fetching loan details:', err);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching loan details by phone number.'
        });
    }
};

exports.pendingEmiPayerLength = async (req, res) => {
    const companyId = req.companyId;
    try {
        let users = await loanModel.aggregate([
            { $match: { "loanDetails.emiPending": true } }
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
            message: 'An error occurred while fetching pending EMI payer details.'
        });
    }
};

exports.totalEmiBalanceSum = async (req, res) => {
    const companyId = req.companyId;
    try {
        let totalEmiBalanceSum = await loanModel.aggregate([
            { $match: {} },
            {
                $group: {
                    _id: null,
                    totalEmiBalanceSum: { $sum: "$loanDetails.totalEmiBalance" }
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
    const companyId = req.companyId;
    try {
        const vehicleTypeCounts = await loanModel.aggregate([
            { $match: {} },
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

// exports.getPendingEmiDetails = async (req, res) => {
//     const companyId = req.companyId;
//     try {
//         let pendingEmiDetails = await loanModel.aggregate([
//             { $match: { "loanDetails.emiPending": true } },
//             {
//                 $lookup: {
//                     from: "usermodels",
//                     localField: "details.loanPayerDetails.name",
//                     foreignField: "details.loanPayerDetails.name",
//                     as: "user"
//                 }
//             },
//             { $unwind: "$loanDetails.instalmentObject" },
//             {
//                 $match: {
//                     "loanDetails.instalmentObject.isPaid": false,
//                     "loanDetails.instalmentObject.dueDate": { $lte: new Date() }
//                 }
//             },
//             {
//                 $group: {
//                     _id: {
//                         loanNumber: "$loanNumber",
//                         loanPayerName: "$details.loanPayerDetails.name",
//                         phoneNumber1: "$details.loanPayerDetails.mobileNum1",
//                         pendingEmiNum: "$loanDetails.pendingEmiNum",
//                         emiPendingDate: "$loanDetails.emiPendingDate",
//                         company: "$company"
//                     },
//                     totalPrincipalAmount: { $sum: "$loanDetails.instalmentObject.principleAmountPerMonth" },
//                     totalInterestAmount: { $sum: "$loanDetails.instalmentObject.interestAmount" },
//                     totalEmiAmount: { $sum: "$loanDetails.instalmentObject.totalEmiAmountRoundoff" }
//                 }
//             },
//             {
//                 $project: {
//                     _id: 0,
//                     loanNumber: "$_id.loanNumber",
//                     loanPayerName: "$_id.loanPayerName",
//                     phoneNumber1: "$_id.phoneNumber1",
//                     pendingEmiNum: "$_id.pendingEmiNum",
//                     emiPendingDate: "$_id.emiPendingDate",
//                     totalPrincipalAmount: 1,
//                     totalInterestAmount: 1,
//                     totalEmiAmount: 1,
//                     company: "$_id.company"

                    
//                 }
//             },
//             { $sort: { pendingEmiNum: -1, emiPendingDate: 1 } }
//         ]);

//         // Filter pendingEmiDetails by companyId
//         pendingEmiDetails = pendingEmiDetails.filter(user => user.company && user.company.toString() === companyId);

//         res.status(200).json({ pendingEmiDetails });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };


// exports.getPendingEmiDetails = async (req, res) => {
//     const companyId = req.companyId;
//     try {
//         let pendingEmiDetails = await loanModel.aggregate([
//             { $match: { "loanDetails.emiPending": true } },
//             {
//                 $lookup: {
//                     from: "usermodels",
//                     localField: "details.loanPayerDetails.name",
//                     foreignField: "details.loanPayerDetails.name",
//                     as: "user"
//                 }
//             },
//             { $unwind: "$loanDetails.instalmentObject" },
//             {
//                 $match: {
//                     "loanDetails.instalmentObject.isPaid": false,
//                     "loanDetails.instalmentObject.dueDate": { $lte: new Date() }
//                 }
//             },
//             {
//                 $project: {
//                     "loanNumber": 1,
//                     "loanPayerName": "$details.loanPayerDetails.name",
//                     "loanBalance": "$loanDetails.totalEmiBalance",
//                     "mobileNum1": "$details.loanPayerDetails.mobileNum1",
//                     "vehicalNum": "$details.vehicle.vehicleNumber",
//                     "pendingEmiNum": "$loanDetails.pendingEmiNum",
//                     "vehicalType": "$details.vehicle.type",
//                     "vehicalModel": "$details.vehicle.model",
//                     "company": 1 // Including company field in the projection
  
//                 }
//             },
//             { $sort: { "loanDetails.pendingEmiNum": -1, "loanDetails.emiPendingDate": 1 } }
//         ]);

//         // Filter pendingEmiDetails by companyId
//         pendingEmiDetails = pendingEmiDetails.filter(user => user.company && user.company.toString() === companyId);

        

//         res.status(200).json({
//             status: 'Success',
//             length: pendingEmiDetails.length,
//             data: pendingEmiDetails
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

exports.getPendingEmiDetails = async (req, res) => {
    const companyId = req.companyId;
    try {
        let pendingEmiDetails = await loanModel.aggregate([
            // First filter for active loans
            { $match: { "loanDetails.isActive": true } },
            // Then filter for loans with pending EMIs
            { $match: { "loanDetails.emiPending": true } },
            {
                $lookup: {
                    from: "usermodels", // Adjust this collection name if needed
                    localField: "details.loanPayerDetails.name",
                    foreignField: "details.loanPayerDetails.name",
                    as: "user"
                }
            },
            { $unwind: "$loanDetails.instalmentObject" },
            {
                $match: {
                    "loanDetails.instalmentObject.isPaid": false,
                    "loanDetails.instalmentObject.dueDate": { $lte: new Date() }
                }
            },
            {
                $project: {
                    "loanNumber": 1,
                    "loanPayerName": "$details.loanPayerDetails.name",
                    "loanBalance": "$loanDetails.totalEmiBalance",
                    "mobileNum1": "$details.loanPayerDetails.mobileNum1",
                    "vehicalNum": "$details.vehicle.vehicleNumber",
                    "pendingEmiNum": "$loanDetails.pendingEmiNum",
                    "vehicalType": "$details.vehicle.type",
                    "vehicalModel": "$details.vehicle.model",
                    "company": 1 // Including company field in the projection
                }
            },
            {
                $group: {
                    _id: {
                        loanNumber: "$loanNumber",
                        loanPayerName: "$loanPayerName",
                        loanBalance: "$loanBalance",
                        mobileNum1: "$mobileNum1",
                        vehicalNum: "$vehicalNum",
                        pendingEmiNum: "$pendingEmiNum",
                        vehicalType: "$vehicalType",
                        vehicalModel: "$vehicalModel",
                        company: "$company"
                    }
                }
            },
            {
                $addFields: {
                    loanNumber: "$_id.loanNumber",
                    loanPayerName: "$_id.loanPayerName",
                    loanBalance: "$_id.loanBalance",
                    mobileNum1: "$_id.mobileNum1",
                    vehicalNum: "$_id.vehicalNum",
                    pendingEmiNum: "$_id.pendingEmiNum",
                    vehicalType: "$_id.vehicalType",
                    vehicalModel: "$_id.vehicalModel",
                    company: "$_id.company"
                }
            },
            // Sort after the $group stage
            { $sort: { "pendingEmiNum": -1, "loanBalance": 1 } },  // Adjusted sorting based on the fields
            { $project: { _id: 0 } } // Optionally remove _id field
        ]);

        // Filter pendingEmiDetails by companyId
        pendingEmiDetails = pendingEmiDetails.filter(user => user.company && user.company.toString() === companyId);

        res.status(200).json({
            status: 'Success',
            length: pendingEmiDetails.length,
            data: pendingEmiDetails
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};




const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split('/');
    return new Date(`${year}-${month}-${day}`);
};

exports.ledgerDatas = (req, res) => {
    const companyId = req.companyId;
    const params = req.query;

    const constructFilterOptions = (params) => {
        const filterOptions = { company: companyId }; // Filter by companyId

        if (params.startDate && params.endDate) {
            const startDate = parseDate(params.startDate);
            const endDate = parseDate(params.endDate);
            endDate.setHours(23, 59, 59, 999); // Ensure endDate includes the entire day
            filterOptions.entryDate = { $gte: startDate, $lte: endDate };
        } else if (params.startDate) {
            const startDate = parseDate(params.startDate);
            const endDate = new Date(startDate);
            endDate.setHours(23, 59, 59, 999); // Ensure endDate includes the entire day
            filterOptions.entryDate = { $gte: startDate, $lte: endDate };
        } else if (params.endDate) {
            const endDate = parseDate(params.endDate);
            endDate.setHours(23, 59, 59, 999); // Ensure endDate includes the entire day
            filterOptions.entryDate = { $lte: endDate };
        }

        const orConditions = [];

        // Add conditions based on params.isExpense, params.isInvestment, etc.
        if (params.hasOwnProperty('isExpense') && params.isExpense === 'true') {
            orConditions.push({ isExpense: true });
        }
        if (params.hasOwnProperty('isInvestment') && params.isInvestment === 'true') {
            orConditions.push({ isInvestment: true });
        }
        if (params.hasOwnProperty('isLoanDebit') && params.isLoanDebit === 'true') {
            orConditions.push({ isLoanDebit: true });
        }
        if (params.hasOwnProperty('isLoanCredit') && params.isLoanCredit === 'true') {
            orConditions.push({ isLoanCredit: true });
        }

        // Apply $or condition if there are any
        if (orConditions.length > 0) {
            filterOptions.$or = orConditions;
        }

        return filterOptions;
    };

    const filterOptions = constructFilterOptions(params);

    ledgerModel.find(filterOptions)
        .sort({ entryDate: -1 })
        .then(results => {
            const length = results.length; // Get the length of results array
            res.json({ results, length }); // Return results and length
        })
        .catch(err => {
            console.error('Error:', err);
            res.status(500).send('Internal Server Error');
        });
};



// exports.ledgerDatas = (req, res) => {
//     const companyId = req.companyId;
//     const params = req.query;

//     const constructFilterOptions = (params) => {
//         const filterOptions = { companyId };

//         if (params.startDate && params.endDate) {
//             const startDate = new Date(params.startDate);
//             const endDate = new Date(params.endDate);
//             filterOptions.entryDate = { $gte: startDate, $lte: endDate };
//         } else if (params.startDate) {
//             const startDate = new Date(params.startDate);
//             const endDate = new Date(params.startDate);
//             endDate.setHours(23, 59, 59, 999);
//             filterOptions.entryDate = { $gte: startDate, $lte: endDate };
//         } else if (params.endDate) {
//             const endDate = new Date(params.endDate);
//             filterOptions.entryDate = { $lte: endDate };
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
//             res.json({ results });
//         })
//         .catch(err => {
//             console.error('Error:', err);
//             res.status(500).send('Internal Server Error');
//         });
// };





exports.getOverDueUsers = async (req, res) => {
    const companyId = req.companyId; // Assuming `req.companyId` contains the company's ObjectId as a string.
    try {
        const pendingEmiDetails = await loanModel.aggregate([
            {
                $match: {
                    "loanDetails.totalOverdueAmountToBePaid": { $gt: 0 }, // Filter by overdue amount
                    "loanDetails.isActive": true,                        // Filter by active status
                    "company": new mongoose.Types.ObjectId(companyId),  // Corrected ObjectId instantiation
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
                    vehicalModel: "$details.vehicle.model",
                    company: "$company",
                }
            }
        ]);

        res.status(200).json({ success: true, data: pendingEmiDetails });
    } catch (error) {
        console.error("Error fetching overdue users:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};



exports.getOverDueLength = async (req, res) => {
    const companyId = req.companyId;
    try {
        let pendingEmiDetails = await loanModel.aggregate([
            { $match: { "loanDetails.totalOverdueAmountToBePaid": { $gt: 0 } } }
        ]);

        pendingEmiDetails = pendingEmiDetails.filter(user => user.company && user.company.toString() === companyId);

        res.status(200).json({
            status: 'Success',
            length: pendingEmiDetails.length
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// exports.downloadPendingEmiDetails = async (req, res) => {
//     const companyId = req.companyId;
//     try {
//         let pendingEmiDetails = await loanModel.aggregate([
//             { $match: { "loanDetails.emiPending": true } },
//             {
//                 $lookup: {
//                     from: "usermodels",
//                     localField: "details.loanPayerDetails.name",
//                     foreignField: "details.loanPayerDetails.name",
//                     as: "user"
//                 }
//             },
//             { $unwind: "$loanDetails.instalmentObject" },
//             {
//                 $match: {
//                     "loanDetails.instalmentObject.isPaid": false,
//                     "loanDetails.instalmentObject.dueDate": { $lte: new Date() }
//                 }
//             },
//             {
//                 $group: {
//                     _id: {
//                         loanNumber: "$loanNumber",
//                         loanPayerName: "$details.loanPayerDetails.name",
//                         phoneNumber1: "$details.loanPayerDetails.mobileNum1",
//                         pendingEmiNum: "$loanDetails.pendingEmiNum",
//                         emiPendingDate: "$loanDetails.emiPendingDate",
//                         totalEmiAmountRoundoff: "$loanDetails.instalmentObject.totalEmiAmountRoundoff",
//                         company: "$company"
//                     }
//                 }
//             },
//             {
//                 $project: {
//                     _id: 0,
//                     loanNumber: "$_id.loanNumber",
//                     loanPayerName: "$_id.loanPayerName",
//                     phoneNumber1: "$_id.phoneNumber1",
//                     pendingEmiNum: "$_id.pendingEmiNum",
//                     emiPendingDate: "$_id.emiPendingDate",
//                     totalEmiAmountRoundoff: "$_id.totalEmiAmountRoundoff",
//                     company: "$_id.company"
//                 }
//             },
//             { $sort: { "emiPendingDate": 1 } }
//         ]);

//         // Filter pendingEmiDetails by companyId
//         pendingEmiDetails = pendingEmiDetails.filter(user => user.company && user.company.toString() === companyId);

//         // Create a new workbook and worksheet
//         const workbook = xlsx.utils.book_new();
//         const worksheet = xlsx.utils.json_to_sheet(pendingEmiDetails);

//         // Append the worksheet to the workbook
//         xlsx.utils.book_append_sheet(workbook, worksheet, 'Pending EMI Details');

//         // Write the workbook to a buffer
//         const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

//         // Set headers and send the buffer as a file
//         res.setHeader('Content-Disposition', 'attachment; filename=pending_emi_details.xlsx');
//         res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//         res.send(buffer);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };


exports.downloadPendingEmiDetails = async (req, res) => {
    try {
        let pendingEmiDetails = await loanModel.aggregate([
            { $match: { "loanDetails.emiPending": true, "loanDetails.isActive": true } }, // Filter by emiPending and isActive
            {
                $lookup: {
                    from: "usermodels",
                    localField: "details.loanPayerDetails.name",
                    foreignField: "details.loanPayerDetails.name",
                    as: "user"
                }
            },
            { $unwind: "$loanDetails.instalmentObject" },
            {
                $match: {
                    "loanDetails.instalmentObject.isPaid": false,
                    "loanDetails.instalmentObject.dueDate": { $lte: new Date() }
                }
            },
            {
                $group: {
                    _id: {
                        loanNumber: "$loanNumber",
                        loanPayerName: "$details.loanPayerDetails.name",
                        phoneNumber1: "$details.loanPayerDetails.mobileNum1",
                        pendingEmiNum: "$loanDetails.pendingEmiNum",
                        emiPendingDate: "$loanDetails.emiPendingDate",
                        totalEmiAmountRoundoff: "$loanDetails.instalmentObject.totalEmiAmountRoundoff"
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    loanNumber: "$_id.loanNumber",
                    loanPayerName: "$_id.loanPayerName",
                    phoneNumber1: "$_id.phoneNumber1",
                    pendingEmiNum: "$_id.pendingEmiNum",
                    emiPendingDate: "$_id.emiPendingDate",
                    totalEmiAmountRoundoff: "$_id.totalEmiAmountRoundoff"
                }
            },
            { $sort: { emiPendingDate: 1 } }
        ]);

        // Create a new workbook and worksheet
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(pendingEmiDetails);

        // Auto-resize columns based on content length
        const columnWidths = Object.keys(pendingEmiDetails[0] || {}).map(key => ({
            wch: Math.max(key.length, ...pendingEmiDetails.map(item => (item[key]?.toString() || "").length)) + 2
        }));
        worksheet["!cols"] = columnWidths;

        // Append the worksheet to the workbook
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Pending EMI Details');

        // Write the workbook to a buffer
        const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        // Set headers and send the buffer as a file
        res.setHeader('Content-Disposition', 'attachment; filename=pending_emi_details.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



// exports.getLoanDataLengths = async (req, res) => {
//     const companyId = req.companyId;

//     try {
//         // Fetch all data in parallel
//         const [
//             pendingEmiData,
//             overdueData,
//             closedLoanData,
//             seizedLoanData,
//             activeLoanData
//         ] = await Promise.all([
//             loanModel.aggregate([{ $match: { "loanDetails.emiPending": true, "loanDetails.isActive": true } }]),
//             loanModel.aggregate([{ $match: { "loanDetails.totalOverdueAmountToBePaid": { $gt: 0 } } }]), // Overdue
//             loanModel.aggregate([{ $match: { "loanDetails.isActive": false } }]), // Closed Loans
//             loanModel.aggregate([{ $match: { "loanDetails.isSeized": true } }]), // Seized Loans
//             loanModel.aggregate([{ $match: { "loanDetails.isActive": true } }]), // Active Loans
//         ]);

//         // Filter data for the specific company
//         const filterByCompanyId = users => 
//             users.filter(user => user.company && user.company.toString() === companyId);

//         // Calculate lengths
//         const lengths = {
//             pendingEmi: filterByCompanyId(pendingEmiData).length,
//             overdue: filterByCompanyId(overdueData).length,
//             closedLoan: filterByCompanyId(closedLoanData).length,
//             seizedLoan: filterByCompanyId(seizedLoanData).length,
//             activeLoan: filterByCompanyId(activeLoanData).length,
//         };

//         // Send response
//         res.status(200).json({
//             status: 'Success',
//             data: lengths
//         });

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({
//             status: 'error',
//             message: 'An error occurred while fetching loan data lengths.'
//         });
//     }
// };

exports.getLoanDataLengths = async (req, res) => {
    const companyId = req.companyId;

    try {
        // Fetch counts in parallel with companyId filtering at the database level
        const [
            pendingEmiCount,
            overdueCount,
            closedLoanCount,
            seizedLoanCount,
            activeLoanCount
        ] = await Promise.all([
            loanModel.aggregate([
                { $match: { "loanDetails.emiPending": true, "loanDetails.isActive": true, "company": companyId } },
                { $count: "count" }
            ]),
            loanModel.aggregate([
                { $match: { "loanDetails.totalOverdueAmountToBePaid": { $gt: 0 }, "company": companyId } },
                { $count: "count" }
            ]),
            loanModel.aggregate([
                { $match: { "loanDetails.isActive": false, "company": companyId } },
                { $count: "count" }
            ]),
            loanModel.aggregate([
                { $match: { "loanDetails.isSeized": true, "company": companyId } },
                { $count: "count" }
            ]),
            loanModel.aggregate([
                { $match: { "loanDetails.isActive": true, "company": companyId } },
                { $count: "count" }
            ]),
        ]);

        // Extract counts (if the result is empty, the count is 0)
        const extractCount = (data) => (data[0] ? data[0].count : 0);

        const lengths = {
            pendingEmi: extractCount(pendingEmiCount),
            overdue: extractCount(overdueCount),
            closedLoan: extractCount(closedLoanCount),
            seizedLoan: extractCount(seizedLoanCount),
            activeLoan: extractCount(activeLoanCount),
        };

        // Send response
        res.status(200).json({
            status: 'Success',
            data: lengths
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while fetching loan data lengths.'
        });
    }
};


exports.calculateUnpaidPrincipleSum = async (req, res) => {
    const companyId = req.companyId;

    try {
        // Aggregate the sum of unpaid principal amounts for the specified companyId and active loans
        const result = await loanModel.aggregate([
            {
                $match: {
                    company: new mongoose.Types.ObjectId(companyId),
                    "loanDetails.isActive": true // Filter for active loans
                }
            },
            {
                $unwind: "$loanDetails.instalmentObject" // Deconstruct the instalmentObject array
            },
            {
                $match: {
                    "loanDetails.instalmentObject.isPaid": false // Match only unpaid installments
                }
            },
            {
                $group: {
                    _id: null, // Group all documents together
                    totalUnpaidPrinciple: {
                        $sum: "$loanDetails.instalmentObject.principleAmountCurrentMonth"
                    }
                }
            }
        ]);

        const totalUnpaidPrinciple = result.length > 0 ? result[0].totalUnpaidPrinciple : 0;

        res.status(200).json({
            success: true,
            totalUnpaidPrinciple,
        });
    } catch (error) {
        console.error("Error calculating unpaid principle amount:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while calculating the unpaid principle amount.",
        });
    }
};
