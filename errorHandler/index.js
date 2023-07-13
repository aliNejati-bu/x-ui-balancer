const {logger} = require("../logger");

/**
 * @param {{type:string,message:string,meta:any}} meta
 */
module.exports.exit = (meta) => {
    logger.error(meta.message);
    logger.error(meta.meta);
    console.log(meta);
    process.exit();
}