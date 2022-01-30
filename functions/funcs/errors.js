const errorHandler = require("discord-error-handler");

    module.exports = (client) => {
        handle = new errorHandler(client, { webhook: { id: `887357888178302998`, token: `R_iAewX-hib_aQgkw-YVGgI2IJ0GVrQjGBdfxAjSb9h69kb4ZGguTqoXcIUCoU1ZIv9e` } });

        /* Error Handler */
        process.on('unhandledRejection', error =>
            handle.createrr(client, undefined, undefined, error));
    }