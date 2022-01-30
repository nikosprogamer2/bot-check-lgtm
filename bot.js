/* Core, startup */
const
    { Client } = require('discord.js'),
    { TOKEN } = require('./assets/services/config'),
    client = new Client({ fetchAllMembers: false, restTimeOffset: 0, restWsBridgetimeout: 100, disableMentions: 'everyone' }),
    funcsmanager = require('./functions/funcs');

/* Client functions */
funcsmanager(client);

client.login(TOKEN);
