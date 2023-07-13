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


module.exports.initDB = () => {
    const connection = getConnection();
    connection.run(`PRAGMA foreign_keys = 0`, function (err) {
        if (err) {
            exit({meta: err, type: 'db', message: 'cant init db.'});
        }
        connection.run(`CREATE TABLE sqlitestudio_temp_table AS SELECT * FROM inbounds`, function (err) {
            if (err) {
                exit({meta: err, type: 'db', message: 'cant init db.'});
            }
            connection.run(`DROP TABLE inbounds`, function (err) {
                if (err) {
                    exit({meta: err, type: 'db', message: 'cant init db.'});
                }
                connection.run(`CREATE TABLE inbounds (
    id              INTEGER,
    user_id         INTEGER,
    up              INTEGER,
    down            INTEGER,
    total           INTEGER,
    remark          TEXT,
    enable          NUMERIC,
    expiry_time     INTEGER,
    listen          TEXT,
    port            INTEGER UNIQUE,
    protocol        TEXT,
    settings        TEXT,
    stream_settings TEXT,
    tag             TEXT    UNIQUE,
    sniffing        TEXT,
    last_up         INTEGER DEFAULT (0),
    last_down       INTEGER DEFAULT (0),
    PRIMARY KEY (
        id
    )
)`, function (err) {
                    if (err) {
                        exit({meta: err, type: 'db', message: 'cant init db.'});
                    }
                    connection.run(`
INSERT INTO inbounds (
                         id,
                         user_id,
                         up,
                         down,
                         total,
                         remark,
                         enable,
                         expiry_time,
                         listen,
                         port,
                         protocol,
                         settings,
                         stream_settings,
                         tag,
                         sniffing
                     )
                     SELECT id,
                            user_id,
                            up,
                            down,
                            total,
                            remark,
                            enable,
                            expiry_time,
                            listen,
                            port,
                            protocol,
                            settings,
                            stream_settings,
                            tag,
                            sniffing
                       FROM sqlitestudio_temp_table`, function (err) {
                        if (err) {
                            exit({meta: err, type: 'db', message: 'cant init db.'});
                        }
                        connection.run(`DROP TABLE sqlitestudio_temp_table`, function (err) {
                            if (err) {
                                exit({meta: err, type: 'db', message: 'cant init db.'});
                            }
                            connection.run(`PRAGMA foreign_keys = 1`, function (err) {
                                if (err) {
                                    exit({meta: err, type: 'db', message: 'cant init db.'});
                                }
                                console.log('db init...');
                                connection.close();
                            })
                        })
                    })
                });
            });
        })
    });
}