const
    { MessageEmbed } = require('discord.js'),
    ClanModel = require('../../assets/database/clan');

module.exports = {
    config: {
        name: 'addclan',
        category: 'clans',
        description: 'Add Clan(s) to the Registry.',
    },
    execute: async (message, args) => {
        if (message.member.hasPermission("ADMINISTRATOR")) {
            let cmdUsage = new MessageEmbed()
                .setColor('#000000')
                .setTitle(`Clans | Add Clan`)
                .setDescription(`${message.client.prefix}${module.exports.config.name} <Owner ID> <Clan Name>`)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()

            /* Checks */

            const clanname = args.slice(1).join(' ');

            if (!args[0] || !clanname) return message.channel.send(cmdUsage);

            const ifExistsDB = await ClanModel.findOne({ clan: clanname });

            if (ifExistsDB) {
                let existsAlready = new MessageEmbed()
                    .setColor('#000000')
                    .setTitle(`Clans | Add Clan`)
                    .setDescription(`This Clan is already registered.`)
                    .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()
                return message.channel.send(existsAlready);
            }

            let registerdone = new MessageEmbed()
                .setColor('#000000')
                .setTitle(`Clans | Add Clan`)
                .setDescription(`Clan has successfully been added to the Clan Registry.`)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()

            const clanRole = await message.guild.roles.create({ data: { name: clanname, color: 'GREY' } }).catch(err => console.log(err));
            const rClan = new ClanModel({ clan: clanname, OwnerID: args[0], roleID: clanRole.id });

            message.channel.send(registerdone);
            return await rClan.save();
        } else {
            let missingperms = new MessageEmbed()
                .setColor('#000000')
                .setTitle(`Clans | Add Clan`)
                .setDescription(`You do not have permission to use the ${module.exports.config.name} command.`)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
            return message.channel.send(missingperms);
        }
    },
};