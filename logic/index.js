const io = require('socket.io-client');
const servers = require('./servers.json');
const {exit} = require("../errorHandler");

for (let i = 0; i < servers.servers.length; i++) {
    let ios = io.io(servers.servers[i].ip + ':' + servers.servers[i].port);
    servers.servers[i].connection = ios;
    let checkConnect = false;
    ios.on('connect', function () {
        console.log(servers.servers[i].name + " connected.");
        checkConnect = true;
    });

    setTimeout(() => {
        if (!checkConnect) {
            exit({
                meta: null,
                message: 'cant connect to server',
                type: 'off'
            });
        }
    }, 5000)
}