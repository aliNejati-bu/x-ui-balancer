const {getAllUsers, findByUuid, changeUp, changeDown} = require("./database/user");

async function test() {
    console.log(await changeDown('af48c3b6-2295-44fb-a895-7928ffb8a45b',555));
}

test();