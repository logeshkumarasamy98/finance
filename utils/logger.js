const winston = require('winston');

const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'error',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.simple(),
            level: process.env.NODE_ENV === 'development' ? 'debug' : 'error'
        }),
        new winston.transports.File({ filename: 'combined.log' })
    ],
});

module.exports = logger;
