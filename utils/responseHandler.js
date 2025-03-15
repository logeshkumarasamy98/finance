const logger = require('./logger'); // Assuming a logger utility is available

// Utility function for standardized error handling
const handleError = (res, error) => {
    logger.error('Error:', error); // Log the error with appropriate level

    return res.status(500).json({ success: false, message: 'Internal server error.' });
};

// Utility function for standardized success responses
const sendSuccessResponse = (res, message, data = null) => {
    return res.status(200).json({ success: true, message, data });
};

module.exports = {
    handleError,
    sendSuccessResponse
};
