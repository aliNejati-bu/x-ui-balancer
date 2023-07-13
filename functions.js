const {getAllUsers, findByUuid, changeUp, changeDown, initDB} = require("./database/user");

async function test() {
    initDB();
}

test();