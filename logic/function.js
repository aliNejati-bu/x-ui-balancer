const {events} = require("../server/events");
const {exit} = require("../errorHandler");


function initDB(socket) {
    return new Promise((resolve, reject) => {
        socket.emit(events.dbInit);
        let check = false;
        socket.on(events.message, (msg) => {
            if (msg.events == events.dbInit) {
                console.log('db init...')
                check = true;
                resolve(true);
            }
        });

        setTimeout(() => {
            if (!check) {
                exit({
                    type: 'init',
                    message: 'response not send.',
                    meta: null
                });
            }
        }, 6000);
    });
}

module.exports.getUserById = (socket, uuid) => {
    return new Promise((resolve, reject) => {
        socket.emit(events.getUser, uuid);
        let check = false;
        socket.on(events.userReceive, (usr) => {
            check = true;
            resolve(usr);
        });

        setTimeout(() => {
            if (!check) {
                exit({
                    type: 'socket',
                    message: 'response not send.',
                    meta: new Error('response not send.')
                });
            }
        }, 6000);
    });
}

module.exports.updateUp = (socket, userId, up) => {
    return new Promise((resolve, reject) => {
        socket.emit(events.userSetUp, userId, up);
        let check = false;
        socket.on(events.message, () => {
            check = true;
            resolve(true);
        });

        setTimeout(() => {
            if (!check) {
                exit({
                    type: 'socket',
                    message: 'response not send.',
                    meta: new Error('response not send.')
                });
            }
        }, 6000);
    });
}

module.exports.updateDown = (socket, userId, down) => {
    return new Promise((resolve, reject) => {
        socket.emit(events.userSetDown, userId, down);
        let check = false;
        socket.on(events.message, () => {
            check = true;
            resolve(true);
        });

        setTimeout(() => {
            if (!check) {
                exit({
                    type: 'socket',
                    message: 'response not send.',
                    meta: new Error('response not send.')
                });
            }
        }, 6000);
    });
}

module.exports.initDB = initDB;