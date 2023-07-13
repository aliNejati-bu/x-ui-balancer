const {getConnection} = require("./index");
const {logger} = require("../logger");
const {exit} = require("../errorHandler");

/**
 *
 * @returns {Promise<Array<{
 *     id:number,
 *     user_id:number,
 *     up:number,
 *     down:number,
 *     total:number,
 *     remark:string,
 *     enable:0|1,
 *     expire_time:number,
 *     listen:string,
 *     port:number,
 *     protocol: string,
 *     settings0:string,
 *     stream_settings:string,
 *     tag:string,
 *     sniffing:string
 * }>>}
 */
module.exports.getAllUsers = () => {
    const connection = getConnection();
    return new Promise((resolve, reject) => {
        connection.all('select * from inbounds', (err, rows) => {
            if (err) {
                exit({
                    meta: err,
                    type: 'db',
                    message: 'cant get all users.'
                });
                process.exit()
            }
            connection.close();
            resolve(rows);
        });
    });
};

/**
 * @param  uuid{string}
 * @returns {Promise<{
 *     id:number,
 *     user_id:number,
 *     up:number,
 *     down:number,
 *     total:number,
 *     remark:string,
 *     enable:0|1,
 *     expire_time:number,
 *     listen:string,
 *     port:number,
 *     protocol: string,
 *     settings0:string,
 *     stream_settings:string,
 *     tag:string,
 *     sniffing:string
 * }>|null}
 */
module.exports.findByUuid = (uuid) => {
    const connection = getConnection();
    return new Promise((resolve, reject) => {
        connection.get('SELECT * FROM inbounds WHERE settings LIKE ?', ['%' + uuid + '%'], (err, row) => {
            if (err) {
                exit({
                    meta: err,
                    type: 'db',
                    message: 'cant get user.'
                });
            }
            connection.close();
            if (row) {
                resolve(row);
            } else {
                resolve(null);
            }
        });
    })
}


/**
 *
 * @param uuid{string}
 * @param up{number}
 * @returns {Promise<boolean>}
 */
module.exports.changeUp = (uuid, up) => {
    const connections = getConnection();
    return new Promise((resolve, reject) => {
        connections.run('UPDATE inbounds SET up = ? WHERE settings LIKE ?', [
            up,
            '%' + uuid + '%'
        ], function (err) {
            if (err) {
                exit({
                    meta: err,
                    type: 'db',
                    message: 'cant update user.'
                });
            }
            connections.close();
            resolve(this.changes >= 1)
        });
    });
};
/**
 *
 * @param uuid{string}
 * @param down{number}
 * @returns {Promise<boolean>}
 */
module.exports.changeDown = (uuid, down) => {
    const connections = getConnection();
    return new Promise((resolve, reject) => {
        connections.run('UPDATE inbounds SET down = ? WHERE settings LIKE ?', [
            down,
            '%' + uuid + '%'
        ], function (err) {
            if (err) {
                exit({
                    meta: err,
                    type: 'db',
                    message: 'cant update user.'
                });
            }
            connections.close();
            resolve(this.changes >= 1)
        });
    });
};

