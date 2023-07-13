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

module.exports.initDB = initDB;