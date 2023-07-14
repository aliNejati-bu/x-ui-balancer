const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io");
const {events} = require("./events");
const {
    findByEmail,
    changeUp,
    changeDown,
    changeLastUp,
    changeLastDown,
    getAllUsers,
    initDB,
    allInbounds,
    changeUpAndDownInbound,
    allInboundClients
} = require("../database/user");
const e = require("express");
const io = new Server(server);


io.on('connection', (socket) => {
    socket.on(events.getUser, async (email) => {
        const user = await findByEmail(email);
        socket.emit(events.userReceive, user);
    });


    socket.on(events.userSetUp, async (email, up) => {
        const result = await changeUp(email, up);
        socket.emit(events.message, {
            event: events.userSetUp,
            status: result
        })
    });
    socket.on(events.userSetDown, async (email, down) => {
        const result = await changeDown(email, down);
        socket.emit(events.message, {
            event: events.userSetDown,
            status: result
        })
    });

    socket.on(events.userSetLastUp, async (email, up) => {
        const result = await changeLastUp(email, up);
        socket.emit(events.message, {
            event: events.userSetLastUp,
            status: result
        })
    });
    socket.on(events.userSetLastDown, async (email, down) => {
        const result = await changeLastDown(email, down);
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

    socket.on(events.allInbound, async () => {
        const result = await allInbounds();
        socket.emit(events.getAllUsersReceive, result);
    });

    socket.on(events.updateUpAndDownInbound, async (id, up, down) => {
        socket.emit(events.message, {
            event: events.updateUpAndDownInbound,
            result: await changeUpAndDownInbound(id, up, down)
        })
    });

    socket.on(events.allInboundClient, async (id) => {
        const result = await allInboundClients(id);
        socket.emit(events.getAllUsersReceive, result)
    })
});

server.listen(3035, () => {
    console.log('listening on *:3000');
});