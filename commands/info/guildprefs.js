const
    { MessageEmbed } = require('discord.js'),
    guildModel = require('../../assets/database/guild');

module.exports = {
    config: {
        name: 'guildsettings',
        category: 'info',
        aliases: ['gs', 'settings'],
        description: 'Displays information about AL Bot.',
    },
    execute: async (message, args) => {
        let guildPrefs = await guildModel.findOne({ GuildID: message.guild.id }).catch(err => console.log(err));
        if (message.member.hasPermission("ADMINISTRATOR")) {
            const type = args[0];

            switch (type) {
                case "prefix":
                    {
                        if (!args[1]) {
                            let unspecifiedPrefix = new MessageEmbed()
                                .setColor('#000000')
                                .setTitle('Info | Server Settings')
                                .setDescription(`Usage: ${message.client.prefix}${module.exports.config.name} <Setting> <Value>`)
                                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                                .setTimestamp()
                            return message.channel.send(unspecifiedPrefix);
                        }

                        let PrefixUpdated = new MessageEmbed()
                        .setColor('#000000')
                        .setTitle('Info | Server Settings')
                        .setDescription(`Successfully set this server's prefix to **__${args[1]}__**. (Old prefix: ${guildPrefs.Prefix})`)
                        .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                        .setTimestamp()

                        await guildModel.findOneAndUpdate({ GuildID: message.guild.id, }, { Prefix: args[1] }, { upsert: true, useFindAndModify: false })
                        message.channel.send(PrefixUpdated);
                    }
                default:
                    {
                        if (args[1]) {
                            return;
                        }
                        let serversettings = new MessageEmbed()
                            .setColor('#000000')
                            .setTitle('Info | Server Settings')
                            .setDescription(`Displaying server settings for ${message.guild.name} (${message.guild.id})`)
                            .addField(`Prefix`, `${guildPrefs.Prefix}`, true)
                            .addField(`Guild ID`, `${guildPrefs.GuildID}`, true)
                            .setFooter(`You can change each setting with the following arguments: ${message.client.prefix}prefix.`)
                            .setTimestamp()
                        return message.channel.send(serversettings);
                    }
            }
        } else {
            let missingperms = new MessageEmbed()
                .setColor('#000000')
                .setTitle(`Info | Server Settings`)
                .setDescription(`You do not have permission to use the ${module.exports.config.name} command.`)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
            return message.channel.send(missingperms);
        };
    },
};