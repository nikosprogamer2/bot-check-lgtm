const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
        name: 'changelogs',
        category: 'info',
        aliases: ['changelog', 'whatsnew'],
        description: 'Displays information about the latest AL Bot update.',
    },
    execute: (message) => {

        let bugfixes = `** Bug Fixes**\n** **  
        - dockerfile: fix duplicate 'FROM' for node.js version
        - funcs(mngr): fix a little crash
        - funcs(audit): fix a TypeError
        - core: fix a TypeError`;

        let whatsnew = `**What's new**\n** **
        - core: cleanup
        - core: move client specifics into functions
        - core: move database into functions
        - funcs(mngr): make client link more integrated
        - funcs(mngr): re-order of every function
        - commands(info): update discord
        - config: add 'TOKEN2' field for testing
        - pkg: deduped
        - pkg: rebuilt depedencies 
        - README.md: update discord
        - SECURITY.md: add more relevant info`;

        let UpdateEmbed = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Info | Update Changelogs`)
            .setDescription(`Version ${message.client.version}`)
            .addField(`** **`, bugfixes)
            .addField(`** **`, whatsnew)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
        return message.channel.send(UpdateEmbed).catch(console.error);
    },
};