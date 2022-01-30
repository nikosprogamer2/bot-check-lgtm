const
    { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
        name: 'help',
        category: 'info',
        description: 'Displays the bot help page.',
    },
    execute: async (message) => {
        let commands = message.client.commands.array();

        let helpEmbed = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Info | Help`)
            .setDescription(`Here are all the bot's commands.`)

        /* Category handling */

        commands.forEach((cmd) => {
            if (cmd.config.category === 'music') {
                var cmdcategory = 'Music';
            }

            if (cmd.config.category === 'info') {
                var cmdcategory = 'Info';
            }

            if (cmd.config.category === 'moderation') {
                var cmdcategory = 'Moderation';
            }

            if (cmd.config.category === 'fun') {
                var cmdcategory = 'Fun';
            }

            if (cmd.config.category === 'clans') {
                var cmdcategory = 'Clans';
            }

            helpEmbed.addField(
                `**${message.client.prefix}${cmd.config.name} ${cmd.config.aliases ? `(${cmd.config.aliases})` : ""}**`,
                `${cmd.config.description} **(${cmdcategory})**`, true);
        });

        helpEmbed.setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
        helpEmbed.setTimestamp()

        return await message.channel.send(helpEmbed).catch(console.error);
    },
};