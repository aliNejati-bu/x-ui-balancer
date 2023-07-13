const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io");
const {events} = require("./events");
const {
    findByUuid,
    changeUp,
    changeDown,
    changeLastUp,
    changeLastDown,
    getAllUsers,
    initDB
} = require("../database/user");
const e = require("express");
const io = new Server(server);


io.on('connection', (socket) => {
    socket.on(events.getUser, async (uuid) => {
        const user = await findByUuid(uuid);
        socket.emit(events.userReceive, user);
    });


    socket.on(events.userSetUp, async (uuid, up) => {
        const result = await changeUp(uuid, up);
        socket.emit(events.message, {
            event: events.userSetUp,
            status: result
        })
    });
    socket.on(events.userSetDown, async (uuid, down) => {
        const result = await changeDown(uuid, down);
        socket.emit(events.message, {
            event: events.userSetDown,
            status: result
        })
    });

    socket.on(events.userSetLastUp, async (uuid, up) => {
        const result = await changeLastUp(uuid, up);
        socket.emit(events.message, {
            event: events.userSetLastUp,
            status: result
        })
    });
    socket.on(events.userSetLastDown, async (uuid, down) => {
        const result = await changeLastDown(uuid, down);
        socket.emit(events.message, {
            event: events.userSetLastDown,
            status: result
        })
    });


    socket.on(events.getAllUsers, async () => {
        const result = await getAllUsers();
        socket.emit(events.getAllUsersReceive, result)
    });

    socket.on(events.dbInit, async () => {
        await initDB()
        socket.emit(events.message, {
            events: events.dbInit,
            status: true
        })
    });

});

server.listen(3035, () => {
    console.log('listening on *:3000');
});