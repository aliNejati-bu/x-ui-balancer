const {getConnection} = require("./index");
const {logger} = require("../logger");
const {exit} = require("../errorHandler");

/**
 *
 * @returns {Promise<Array<{
 * id:number,
 * inbound_id:number,
 * enable:number,
 * email:text,
 * up:number,
 * down:number,
 * expiry_time:number,
 * total:number
 * }>>}
 */
module.exports.getAllUsers = () => {
    const connection = getConnection();
    return new Promise((resolve, reject) => {
        connection.all('select * from client_traffics', (err, rows) => {
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
 * @param  email{string}
 * @returns {Promise<{
 * id:number,
 * inbound_id:number,
 * enable:number,
 * email:text,
 * up:number,
 * down:number,
 * expiry_time:number,
 * total:number
 * }>|null}
 */
module.exports.findByEmail = (email) => {
    const connection = getConnection();
    return new Promise((resolve, reject) => {
        connection.get('SELECT * FROM client_traffics WHERE email = ?', [email], (err, row) => {
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
 * @param email{string}
 * @param up{number}
 * @returns {Promise<boolean>}
 */
module.exports.changeUp = (email, up) => {
    const connections = getConnection();
    return new Promise((resolve, reject) => {
        connections.run('UPDATE client_traffics SET up = ? WHERE email = ?', [
            up,
            email
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
 * @param email{string}
 * @param down{number}
 * @returns {Promise<boolean>}
 */
module.exports.changeDown = (email, down) => {
    const connections = getConnection();
    return new Promise((resolve, reject) => {
        connections.run('UPDATE client_traffics SET down = ? WHERE email = ?', [
            down,
            email
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
 * @param email{string}
 * @param up{number}
 * @returns {Promise<boolean>}
 */
module.exports.changeLastUp = (email, up) => {
    const connections = getConnection();
    return new Promise((resolve, reject) => {
        connections.run('UPDATE client_traffics SET last_up = ? WHERE email = ?', [
            up,
            email
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
 * @param email{string}
 * @param down{number}
 * @returns {Promise<boolean>}
 */
module.exports.changeLastDown = (email, down) => {
    const connections = getConnection();
    return new Promise((resolve, reject) => {
        connections.run('UPDATE client_traffics SET last_down = ? WHERE email = ?', [
            down,
            email
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
        connection.run(`CREATE TABLE sqlitestudio_temp_table AS SELECT * FROM client_traffics`, function (err) {
            if (err) {
                exit({meta: err, type: 'db', message: 'cant init db.'});
            }
            connection.run(`DROP TABLE client_traffics`, function (err) {
                if (err) {
                    exit({meta: err, type: 'db', message: 'cant init db.'});
                }
                connection.run(`CREATE TABLE client_traffics (
    id          INTEGER,
    inbound_id  INTEGER,
    enable      NUMERIC,
    email       TEXT    UNIQUE,
    up          INTEGER,
    down        INTEGER,
    expiry_time INTEGER,
    total       INTEGER,
    last_down   INTEGER DEFAULT (0),
    last_up     INTEGER DEFAULT (0),
    PRIMARY KEY (
        id
    ),
    CONSTRAINT fk_inbounds_client_stats FOREIGN KEY (
        inbound_id
    )
    REFERENCES inbounds (id) 
)`, function (err) {
                    if (err) {
                        exit({meta: err, type: 'db', message: 'cant init db.'});
                    }
                    connection.run(`
INSERT INTO client_traffics (
                                id,
                                inbound_id,
                                enable,
                                email,
                                up,
                                down,
                                expiry_time,
                                total
                            )
                            SELECT id,
                                   inbound_id,
                                   enable,
                                   email,
                                   up,
                                   down,
                                   expiry_time,
                                   total
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
};


/**
 * @param id
 * @param up
 * @param down
 * @returns {Promise<boolean>}
 */
module.exports.changeUpAndDownInbound = (id, up, down) => {
    const connections = getConnection();
    return new Promise((resolve, reject) => {
        connections.run('UPDATE inbounds SET down = ?,up = ? WHERE id = ?', [
            down,
            up,
            id
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
 *     settings:string,
 *     stream_settings:string,
 *     tag:string,
 *     sniffing:string,
 *     last_down:number,
 *     last_up:number
 * }>>}
 */
module.exports.allInbounds = () => {
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
}

/**
 * @returns {Promise<Array<{
 * id:number,
 * inbound_id:number,
 * enable:number,
 * email:text,
 * up:number,
 * down:number,
 * expiry_time:number,
 * total:number
 * }>>}
 * @param id
 */
module.exports.allInboundClients = (id) => {
    const connection = getConnection();
    return new Promise((resolve, reject) => {
        connection.all('select * from client_traffics where inbound_id = ?', [
            id
        ], (err, rows) => {
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
}