const
    { MessageEmbed } = require('discord.js'),
    djsversion = require('discord.js').version;

module.exports = {
    config: {
        name: 'info',
        category: 'info',
        description: 'Displays information about AL Bot.',
    },
    execute: (message) => {
        let infoEmbed = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Info | AL Bot`)
            .addFields({
                name: "**About/Purpose**",
                value: `AL Bot is a multi-purpose bot with Music integrated with Moderation, Info and Fun commands built into it.`
            }, {
                name: 'Developer',
                value: `! nikos#4922`,
                inline: true
            }, {
                name: 'Version',
                value: `${message.client.version} (${message.client.branch}) running on Discord.JS v${djsversion}`,
                inline: true
            })
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        return message.channel.send(infoEmbed).catch(console.error);
    },
};