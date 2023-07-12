const {getAllUsers} = require("./database/user");

async function test() {
    let all = await getAllUsers();
    all.forEach((e) => {
        console.log(e.settings);
    })
}

test();