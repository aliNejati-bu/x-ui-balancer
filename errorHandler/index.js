/**
 * @param {{type:string,message:string,meta:any}} meta
 */
const {logger} = require("../logger");
module.exports.exit = (meta) => {
    logger.error(meta.message);
    logger.error(meta.meta);
    console.log(meta);
}