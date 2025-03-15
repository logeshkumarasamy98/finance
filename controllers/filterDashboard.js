const { handleError, sendSuccessResponse } = require('../utils/responseHandler');
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
        sendSuccessResponse(res, 'Active loan payer details fetched successfully.', { length: users.length, data: users });
    } catch (err) {
        handleError(res, err);
    }
}

exports.activeLoanPayerLength = async (req, res) => {
    try {
        const users = await loanModel.aggregate([
            {
                $match: {
                    "loanDetails.isActive": true,
                }
            },
        ]);
        sendSuccessResponse(res, 'Active loan payer length fetched successfully.', { length: users.length });
    } catch (err) {
        handleError(res, err);
    }
}

exports.seizedLoanPayer = async (req, res) => {
    try {
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
        sendSuccessResponse(res, 'Seized loan payer details fetched successfully.', { length: users.length, data: users });
    } catch (err) {
        handleError(res, err);
    }
}

exports.seizedLoanPayerLength = async (req, res) => {
    try {
        const users = await loanModel.aggregate([
            {
                $match: {
                    "loanDetails.isSeized": true,
                }
            },
        ]);
        sendSuccessResponse(res, 'Seized loan payer length fetched successfully.', { length: users.length });
    } catch (err) {
        handleError(res, err);
    }
}

exports.closedLoanPayer = async (req, res) => {
    try {
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
        sendSuccessResponse(res, 'Closed loan payer details fetched successfully.', { length: users.length, data: users });
    } catch (err) {
        handleError(res, err);
    }
}

exports.closedLoanPayerLength = async (req, res) => {
    try {
        const users = await loanModel.aggregate([
            {
                $match: {
                    "loanDetails.isActive": false,
                }
            },
        ]);
        sendSuccessResponse(res, 'Closed loan payer length fetched successfully.', { length: users.length });
    } catch (err) {
        handleError(res, err);
    }
}

exports.LoanPayerDetails = async (req, res) => {
    const loanNumber = parseInt(req.params.loanNumber);
    try {
        const loanData = await loanModel.aggregate([
            {
                $match: {
                    loanNumber: loanNumber
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
        sendSuccessResponse(res, 'Loan payer details fetched successfully.', { data: loanData });
    } catch (err) {
        handleError(res, err);
    }
}

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
            as: "user",
          },
        },
        { $unwind: "$loanDetails.instalmentObject" },
        {
          $match: {
            "loanDetails.instalmentObject.isPaid": false,
            "loanDetails.instalmentObject.dueDate": { $lte: new Date() },
          },
        },
        {
          $project: {
            loanNumber: 1,
            loanPayerName: "$details.loanPayerDetails.name",
            loanBalance: "$loanDetails.totalEmiBalance",
            mobileNum1: "$details.loanPayerDetails.mobileNum1",
            vehicalNum: "$details.vehicle.vehicleNumber",
            pendingEmiNum: "$loanDetails.pendingEmiNum",
            vehicalType: "$details.vehicle.type",
            vehicalModel: "$details.vehicle.model",
            company: 1, // Including company field in the projection
          },
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
              company: "$company",
            },
          },
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
            company: "$_id.company",
          },
        },
        // Sort after the $group stage
        { $sort: { pendingEmiNum: -1, loanBalance: 1 } }, // Adjusted sorting based on the fields
        { $project: { _id: 0 } }, // Optionally remove _id field
      ]);
  
      // Filter pendingEmiDetails by companyId
      pendingEmiDetails = pendingEmiDetails.filter(
        (user) => user.company && user.company.toString() === companyId
      );
  
      res.status(200).json({
        status: "Success",
        length: pendingEmiDetails.length,
        data: pendingEmiDetails,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };


  exports.pendingEmiPayerLength = async (req, res) => {
    const companyId = req.companyId;
    try {
      let users = await loanModel.aggregate([
        { $match: { "loanDetails.emiPending": true } },
      ]);
  
      users = users.filter((user) => user.company.toString() === companyId);
  
      res.status(200).json({
        status: "Success",
        length: users.length,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: "error",
        message: "An error occurred while fetching pending EMI payer details.",
      });
    }
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
      if (params.hasOwnProperty("isExpense") && params.isExpense === "true") {
        orConditions.push({ isExpense: true });
      }
      if (
        params.hasOwnProperty("isInvestment") &&
        params.isInvestment === "true"
      ) {
        orConditions.push({ isInvestment: true });
      }
      if (params.hasOwnProperty("isLoanDebit") && params.isLoanDebit === "true") {
        orConditions.push({ isLoanDebit: true });
      }
      if (
        params.hasOwnProperty("isLoanCredit") &&
        params.isLoanCredit === "true"
      ) {
        orConditions.push({ isLoanCredit: true });
      }
  
      // Apply $or condition if there are any
      if (orConditions.length > 0) {
        filterOptions.$or = orConditions;
      }
  
      return filterOptions;
    };
  
    const filterOptions = constructFilterOptions(params);
  
    ledgerModel
      .find(filterOptions)
      .sort({ entryDate: -1 })
      .then((results) => {
        const length = results.length; // Get the length of results array
        res.json({ results, length }); // Return results and length
      })
      .catch((err) => {
        console.error("Error:", err);
        res.status(500).send("Internal Server Error");
      });
  };


  exports.getOverDueUsers = async (req, res) => {
    const companyId = req.companyId; // Assuming `req.companyId` contains the company's ObjectId as a string.
    try {
      const pendingEmiDetails = await loanModel.aggregate([
        {
          $match: {
            "loanDetails.totalOverdueAmountToBePaid": { $gt: 0 }, // Filter by overdue amount
            "loanDetails.isActive": true, // Filter by active status
            company: new mongoose.Types.ObjectId(companyId), // Corrected ObjectId instantiation
          },
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
          },
        },
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
        { $match: { "loanDetails.totalOverdueAmountToBePaid": { $gt: 0 } } },
      ]);
  
      pendingEmiDetails = pendingEmiDetails.filter(
        (user) => user.company && user.company.toString() === companyId
      );
  
          res.status(200).json({
              status: 'Success',
              length: pendingEmiDetails.length
          });
      } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal server error' });
      }
  };



  
exports.downloadPendingEmiDetails = async (req, res) => {
    const companyId = req.companyId;
    try {
        let pendingEmiDetails = await loanModel.aggregate([
            { $match: { "loanDetails.emiPending": true } },
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
                        totalEmiAmountRoundoff: "$loanDetails.instalmentObject.totalEmiAmountRoundoff",
                        company: "$company"
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
                    totalEmiAmountRoundoff: "$_id.totalEmiAmountRoundoff",
                    company: "$_id.company"
                }
            },
            { $sort: { "emiPendingDate": 1 } }
        ]);

        // Filter pendingEmiDetails by companyId
        pendingEmiDetails = pendingEmiDetails.filter(user => user.company && user.company.toString() === companyId);

        // Create a new workbook and worksheet
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(pendingEmiDetails);

    // Append the worksheet to the workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, "Pending EMI Details");

    // Write the workbook to binary
    const binaryData = xlsx.write(workbook, {
      type: "binary",
      bookType: "xlsx",
    });

    // Convert binary string to Buffer
    const buffer = Buffer.from(binaryData, "binary");

    // Convert buffer to Base64
    const base64Data = buffer.toString("base64");

    // Return Base64 string in JSON response
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0"); // Get day with leading zero
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Get month with leading zero (months are 0-indexed)
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, "0"); // Get hours with leading zero
    const minutes = String(now.getMinutes()).padStart(2, "0"); // Get minutes with leading zero
    const seconds = String(now.getSeconds()).padStart(2, "0"); // Get seconds with leading zero

    const timestamp = `${day}-${month}-${year}-${hours}-${minutes}-${seconds}`;
    const fileName = `Pending_List_${timestamp}.xlsx`;
    res.json({
      fileName: fileName,
      fileContent: base64Data,
      contentType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getLoanDataLengths = async (req, res) => {
    console.log('Request headers:', req.headers); // Log request headers for debugging

    const companyId = req.companyId;
  
      try {
          // Fetch all data in parallel
          const [
              pendingEmiData,
              overdueData,
              closedLoanData,
              seizedLoanData,
              activeLoanData
          ] = await Promise.all([
              loanModel.aggregate([{ $match: { "loanDetails.emiPending": true, "loanDetails.isActive": true } }]),
              loanModel.aggregate([{ $match: { "loanDetails.totalOverdueAmountToBePaid": { $gt: 0 } } }]), // Overdue
              loanModel.aggregate([{ $match: { "loanDetails.isActive": false } }]), // Closed Loans
              loanModel.aggregate([{ $match: { "loanDetails.isSeized": true } }]), // Seized Loans
              loanModel.aggregate([{ $match: { "loanDetails.isActive": true } }]), // Active Loans
          ]);
  
          // Filter data for the specific company
          const filterByCompanyId = users => 
              users.filter(user => user.company && user.company.toString() === companyId);
  
          // Calculate lengths
          const lengths = {
              pendingEmi: filterByCompanyId(pendingEmiData).length,
              overdue: filterByCompanyId(overdueData).length,
              closedLoan: filterByCompanyId(closedLoanData).length,
              seizedLoan: filterByCompanyId(seizedLoanData).length,
              activeLoan: filterByCompanyId(activeLoanData).length,
          };
  
      // Send response
      res.status(200).json({
        status: "Success",
        data: lengths,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: "error",
        message: "An error occurred while fetching loan data lengths.",
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
            "loanDetails.isActive": true, // Filter for active loans
          },
        },
        {
          $unwind: "$loanDetails.instalmentObject", // Deconstruct the instalmentObject array
        },
        {
          $match: {
            "loanDetails.instalmentObject.isPaid": false, // Match only unpaid installments
          },
        },
        {
          $group: {
            _id: null, // Group all documents together
            totalUnpaidPrinciple: {
              $sum: "$loanDetails.instalmentObject.principleAmountCurrentMonth",
            },
          },
        },
      ]);
  
      const totalUnpaidPrinciple =
        result.length > 0 ? result[0].totalUnpaidPrinciple : 0;
  
      res.status(200).json({
        success: true,
        totalUnpaidPrinciple,
      });
    } catch (error) {
      console.error("Error calculating unpaid principle amount:", error);
      res.status(500).json({
        success: false,
        message:
          "An error occurred while calculating the unpaid principle amount.",
      });
    }
  };
