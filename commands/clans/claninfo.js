const
    { MessageEmbed } = require('discord.js'),
    RegistryModel = require('../../assets/database/registry');

module.exports = {
    config: {
        name: "claninfo",
        category: 'clans',
        description: "Displays information about the provider user's clan.",
    },
    execute: async (message, args) => {
        let member;
        const users = await RegistryModel.find();

        if (!args.length) {
            member = message.guild.member(message.author);
        } else {
            member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

            if (!member) {
                return message.channel.send(`Could not fetch a user with the ID: **${args[0]}**.`);
            }
        }

        const exists = users.find((u) => u.id === message.member.id);

        if (exists) {
            clan = exists.clan
        }
        if (!exists) {
            clan = 'Not registered to a clan.'
        }

        let infoEmbed = new MessageEmbed()
            .setColor(000000)
            .setTitle(`Clans | ${member.user.tag}`)
            .setThumbnail(member.user.avatarURL())
            .addField(`Registered Clan`, clan)
            .setTimestamp()
            .setFooter(`Member ID: ${member.id}`)
        return message.channel.send(infoEmbed).catch(console.error);
    },
};