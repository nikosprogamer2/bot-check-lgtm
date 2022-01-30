const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
        name: 'ping',
        category: 'info',
        description: 'Checks the Bot latency/Ping.',
    },
    execute: (message) => {
        let botlatency = Date.now() - message.createdTimestamp;
        let apilatency = Math.round(message.client.ws.ping);

        let pingEmbed = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Info | Latency`)
            .setDescription(`AL Bot's latency and it's Latency to Discord.`)
            .addField(`Bot Latency`, `${botlatency}ms`, true)
            .addField(`API Latency`, `${apilatency}ms`, true)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
        return message.channel.send(pingEmbed).catch(console.error);
    },
};