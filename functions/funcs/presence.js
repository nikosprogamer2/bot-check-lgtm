module.exports = (client) => {

    client.on('ready', () => {
        console.log(`BOT LOG: [STARTUP] Online and up on Discord. (DEBUG: v${client.version}-${client.branch})`);
        client.user.setActivity("over AL.", {
            type: "WATCHING"
        });

    });
}/* End of module */