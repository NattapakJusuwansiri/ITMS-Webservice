const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

// Define the logs directory
const logsDir = path.join(__dirname, 'logs');

var transport1 = new winston.transports.DailyRotateFile({
    filename: path.join(logsDir, 'application-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
});

var transport2 = new winston.transports.DailyRotateFile({
    level: 'error',
    filename: path.join(logsDir, 'application-error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
});

var transport3 = new winston.transports.DailyRotateFile({
    filename: path.join(logsDir, 'model-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
});

var transport4 = new winston.transports.DailyRotateFile({
    filename: path.join(logsDir, 'worker-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
});

// Function to add 7 hours to the current time
const addSevenHours = (timestamp) => {
    const date = new Date(timestamp);
    date.setHours(date.getHours() + 7);
    return date.toISOString();
};

// Add color to each level
const colors = {
    error: 'bgRed',
    warn: 'bgYellow',
    info: 'bgGreen',
    http: 'bgMagenta',
    debug: 'bgWhite',
};

winston.addColors(colors);

const printf = winston.format.printf(
    ({ timestamp, level, message, label, method, data }) => {
        const dateText = addSevenHours(timestamp);
        return `${dateText} [${label}] ${
            method ? `[${method}]` : ''
        } ${level}: ${message} ${
            data && Object.keys(data) ? `\n ${JSON.stringify(data)}` : ''
        }`;
    }
);

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(), printf),
    transports: [transport1, transport2],
});

const dbLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(), printf),
    transports: [transport3],
});

const workerServiceLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(), printf),
    transports: [transport4],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize({
                    all: false,
                    level: true,
                }),
                printf
            ),
        })
    );

    workerServiceLogger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize({
                    all: false,
                    level: true,
                }),
                printf
            ),
        })
    );

    dbLogger.add(
        new winston.transports.Console({
            level: 'error',
            format: winston.format.combine(
                winston.format.colorize({
                    all: false,
                    level: true,
                }),
                printf
            ),
        })
    );
}

const initDBLogger = (label) => {
    return dbLogger.child({ label });
};

const initLogger = (label) => {
    return logger.child({ label });
};

const initWorkerServiceLogger = (label) => {
    return workerServiceLogger.child({ label });
};

module.exports = {
    logger,
    initLogger,
    dbLogger,
    initDBLogger,
    initWorkerServiceLogger,
};
