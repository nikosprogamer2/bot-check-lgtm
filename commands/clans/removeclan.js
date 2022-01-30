const
    { MessageEmbed } = require('discord.js'),
    ClanModel = require('../../assets/database/clan'),
    RegistryModel = require('../../assets/database/registry');

module.exports = {
    config: {
        name: 'removeclan',
        category: 'clans',
        description: 'Remove Clan(s) from the Registry.',
    },
    execute: async (message, args) => {
        if (message.member.hasPermission("ADMINISTRATOR")) {
            let cmdUsage = new MessageEmbed()
                .setColor('#000000')
                .setTitle(`Clans | Remove Clan`)
                .setDescription(`${message.client.prefix}${module.exports.config.name} <Clan Name>`)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()

            /* Checks */

            const clanname = args.slice(0).join(' ');

            if (!args[0] || !clanname) return message.channel.send(cmdUsage);

            const findClan = await ClanModel.findOne({ clan: clanname });

            if (!findClan) {
                let invalidClan = new MessageEmbed()
                    .setColor('#000000')
                    .setTitle(`Clans | Remove Clan`)
                    .setDescription(`Provided Clan name is not registered.`)
                    .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()
                return message.channel.send(invalidClan);
            }

            if (findClan) {
                await message.guild.roles.cache.get(findClan.roleID).delete().catch(err => console.log(`Could not delete role. \n${err}`));
                await RegistryModel.deleteMany({ clan: clanname });
                await ClanModel.deleteMany({ clan: clanname });

                let registerdone = new MessageEmbed()
                    .setColor('#000000')
                    .setTitle(`Clans | Remove Clan`)
                    .setDescription(`Clan has successfully been removed from the Clan Registry.`)
                    .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()
                return message.channel.send(registerdone);
            }
        } else {
            let missingperms = new MessageEmbed()
                .setColor('#000000')
                .setTitle(`Clans | Remove Clan`)
                .setDescription(`You do not have permission to use the ${module.exports.config.name} command.`)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
            return message.channel.send(missingperms);
        }
    },
};