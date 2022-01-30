const
    { MessageEmbed } = require('discord.js'),
    WarningModel = require('../../assets/database/warning');

module.exports = {
    config: {
        name: 'delwarn',
        category: 'moderation',
        description: "Clears the most recent warning of a provided user.",
    },
    execute: async (message, args) => {
        const logs = message.guild.channels.cache.find(channel => channel.name === "albot-mod-system");
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (message.member.hasPermission("ADMINISTRATOR")) {
            if (!member) {
                let specifyUser = new MessageEmbed()
                    .setAuthor(`Moderation`)
                    .setDescription(`Usage: ${message.client.prefix}${module.exports.config.name} <UserID/Mention> <Reason>`)
                    .setTimestamp(message.createdAt)
                    .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                    .setColor(`#000000`)
                return message.channel.send(specifyUser);
            };

            if (member) {
                const mentionedPotision = member.roles.highest.position;
                const memberPotision = message.member.roles.highest.position;

                if (memberPotision <= mentionedPotision) {
                    let userHigher = new MessageEmbed()
                        .setAuthor(`Moderation`)
                        .setDescription(`You can't warn this user because they are higher than you.`)
                        .setTimestamp(message.createdAt)
                        .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                        .setColor(`#000000`)
                    return message.channel.send(userHigher);
                };
            };

            const reason = args.slice(2).join(' ') || 'No reason provided.';
            const warnDoc = await WarningModel.findOne({ guildID: message.guild.id, memberID: member.id }).catch(err => console.log(err));

            if (!warnDoc || !warnDoc.warnings.length) {
                let noWarns = new MessageEmbed()
                    .setAuthor(`Moderation`)
                    .setDescription(`${member} has no warnings in record.`)
                    .setTimestamp(message.createdAt)
                    .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                    .setColor(`#000000`)
                return message.channel.send(noWarns);
            };

            const warningID = parseInt(args[1]);

            if (warningID <= 0 || warningID > warnDoc.warnings.length) {
                let invalidID = new MessageEmbed()
                    .setAuthor(`Moderation`)
                    .setDescription(`This is a invalid warning ID.`)
                    .setTimestamp(message.createdAt)
                    .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                    .setColor(`#000000`)
                return message.channel.send(invalidID);
            };

            warnDoc.warnings.splice(warningID - 1, warningID !== 1 ? warningID - 1 : 1);

            await warnDoc.save().catch(err => console.log(err));
            message.delete(message.author);

            if (!logs) {
                console.log(`No logs channel exists in ${message.guild.name}`);
            }

            if (logs) {
                let unwarnEmbed = new MessageEmbed()
                    .setTitle(`Moderation | Audit Log`)
                    .addField("**Member**:", `${member}`)
                    .addField("**Action**:", "Unwarn")
                    .addField("**Reason**:", `${reason ? `${reason}` : ''}`)
                    .addField("**Warning Count**:", `${warnDoc.warnings.length}`)
                    .setTimestamp(message.createdAt)
                    .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                    .setColor(`#000000`)
                logs.send(unwarnEmbed);
            }

            let unwarnEmbed2 = new MessageEmbed()
                .setAuthor(`Moderation`)
                .setDescription(`Successfully cleared warning **${warningID}** from ${member}.`)
                .setTimestamp(message.createdAt)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setColor(`#000000`)
            message.channel.send(unwarnEmbed2);
        } else {
            let missingperms = new MessageEmbed()
                .setAuthor(`Moderation`)
                .setDescription(`You don't have permission to use the delwarn command.`)
                .setTimestamp(message.createdAt)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setColor(`#000000`)
            return message.channel.send(missingperms);
        };
    },
};