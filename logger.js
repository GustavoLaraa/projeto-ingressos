const fs = require("fs");
const path = require("path");

const logFile = path.join(__dirname, "logs.txt");

exports.log = (message) => {
    const logMessage = `[${new Date().toISOString()}] ${message}\n`;
    fs.appendFileSync(logFile, logMessage);
};
