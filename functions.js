const {getAllUsers, findByUuid} = require("./database/user");

async function test() {
    console.log(await findByUuid('af48c3b6-2295-44fb-a895-7928ffb8a45b'));
}

test();