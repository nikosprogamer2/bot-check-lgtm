const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
        name: "avatar",
        category: 'info',
        aliases: [`avi`, `av`],
        description: "Displays the avatar of provider user.",
    },
    execute: (message, args) => {
        let member;

        if (!args.length) {
            member = message.guild.member(message.author);
        } else {
            member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

            if (!member) {
                return message.channel.send(`I couldn't find a user with the ID \`${args[0]}\``).catch(console.error);
            }
        }

        let userEmbed = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Info | ${member.user.tag}'s Avatar`)
            .setDescription(`Avatar`)
            .setImage(member.user.avatarURL())
            .setTimestamp()

        return message.channel.send(userEmbed).catch(console.error);
    },
};