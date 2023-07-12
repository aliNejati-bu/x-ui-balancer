const path = require("path");
const {logger} = require("../logger");
const {exit} = require("../errorHandler");
const sqlite3 = require('sqlite3').verbose();

/**
 * change return value to change db path
 * example: return "/etc/x-ui/x-ui.db";
 * @returns {string}
 */
const getDBPath = () => {
    return path.join(path.join(__dirname, '..'), 'x-ui.db');
};


module.exports.getConnection = () => {
    return new sqlite3.Database(getDBPath(), function (err) {
        if (err) {
            exit({
                meta: err,
                message: 'error while connecting to database. at:' + getDBPath(),
                type: 'db'
            });
            process.exit();
        }
    });
};



