const { DEFAULTPREFIX } = require('../../assets/services/config');

module.exports = (client) => {

    /* Client Specifics */
    client.queue = new Map();
    client.prefix = DEFAULTPREFIX;
    client.version = '4.4.3';
    client.debug = 'true';

    if (client.debug === 'true') {

        client.branch = 'dev';
    } else {
        client.branch = 'stable';
    };

} /* End of Module */