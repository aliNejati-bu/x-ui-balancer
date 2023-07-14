const io = require('socket.io-client');
const servers = require('./servers.json');
const {exit} = require("../errorHandler");
const {initDB, getUserByEmail, updateUp, updateDown} = require("./function");
const {getAllUsers, changeLastDown, changeLastUp} = require("../database/user");

let dbCheck = false;
for (let i = 0; i < servers.servers.length; i++) {
    let ios = io.io("http://" + servers.servers[i].ip + ':' + servers.servers[i].port);

    servers.servers[i].connection = ios;
    let checkConnect = false;
    ios.on('connect', async function () {
        console.log(servers.servers[i].name + " connected.");
        checkConnect = true;
        await initDB(ios);
        dbCheck = true;
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
setInterval(async () => {
    if (dbCheck) {
        console.log('syncing...');
        const allUsers = await getAllUsers();
        for (let i = 0; i < allUsers.length; i++) {
            const email = allUsers[i].email;
            let totalUp = 0;
            let totalDown = 0;
            for (let j = 0; j < servers.servers.length; j++) {
                const socket = servers.servers[j].connection;
                const user = await getUserByEmail(socket, email);
                if (user != null) {
                    totalDown += user.down - allUsers[i].last_down;
                    totalUp += user.up - allUsers[i].last_up;
                }
            }
            totalDown = totalDown + allUsers[i].last_down;
            totalUp = totalUp + allUsers[i].last_up;
            for (let j = 0; j < servers.servers.length; j++) {
                const socket = servers.servers[j].connection;
                await updateUp(socket, email, totalUp);
                await updateDown(socket, email, totalDown);
            }
            await changeLastDown(email, totalDown);
            await changeLastUp(email, totalUp);
        }
        console.log('end sync.');
    }

}, servers.intervalTime)