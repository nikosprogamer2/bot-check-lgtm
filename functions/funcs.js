const
    declarations = require('./funcs/declarations'),
    commands = require('./funcs/commands'),
    importer = require('./funcs/importer'),
    presence = require('./funcs/presence'),
    database = require('./funcs/database'),
    errors = require('./funcs/errors');
    audit = require('./funcs/auditlog');

    module.exports = function (client) {

        declarations(client);
        commands(client);
        importer(client);
        presence(client);
        database();
        errors(client);
        audit(client, {
            // AL Main / ACC Main
            "926846808515313665": {
                auditlog: "logs",
                auditmsg: "logs",
                voice: "logs",
                trackroles: true,
                // excludedroles: ['671004697850544111', '671004697850544112']
            },
            // NSRP
            "823606319529066548": {
                auditlog: "logs",
                auditmsg: "logs",
                voice: "logs",
                trackroles: true,
            },
            // My Server
            "668213441453883394": {
                auditlog: "logs",
                auditmsg: "logs",
                voice: "logs",
                trackroles: true,
                /* welcome: 'welcome',  (PLANNED, might not end up completed ever) */
            },
        });

        console.log(`BOT LOG: [FUNCTIONS HANDLER] All events have been loaded.`);
    }