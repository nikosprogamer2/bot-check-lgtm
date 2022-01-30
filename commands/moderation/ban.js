const
    { MessageEmbed } = require('discord.js'),
    banModel = require('../../assets/database/ban'),
    codeGenerator = require('../../assets/util/CodeGen'),
    punishmentCode = codeGenerator.generateCode(16);

module.exports = {
    config: {
        name: 'ban',
        category: 'moderation',
        description: 'Mention a user, and the bot will ban them.',
    },
    execute: async (message, args) => {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (message.member.hasPermission("BAN_MEMBERS")) {
            let specifyUser = new MessageEmbed()
                .setColor('#000000')
                .setTitle(`Moderation`)
                .setDescription(`Usage: ${message.client.prefix}${module.exports.config.name} <UserID/Mention> <Reason>`)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
            let selfmissingperms = new MessageEmbed()
                .setColor('#000000')
                .setTitle(`Moderation`)
                .setDescription(`I don\'t have the required permissions to ban.`)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()

            if (!member) return message.channel.send(specifyUser).catch(err => message.channel.send(specifyUser));
            if (!message.guild.me.hasPermission("BAN_MEMBERS")) return message.channel.send(selfmissingperms);

            /* Position Checks */

            if (member) {
                const mentionedPotision = member.roles.highest.position;
                const memberPosition = message.member.roles.highest.position;
                const botPotision = message.guild.me.roles.highest.position;

                if (member.id === message.author.id) {
                    let cantBanSelf = new MessageEmbed()
                        .setAuthor(`Moderation`)
                        .setDescription(`You can't ban yourself.`)
                        .setTimestamp(message.createdAt)
                        .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                        .setColor(`#000000`)
                    return message.channel.send(cantBanSelf);
                } else if (memberPosition <= mentionedPotision) {
                    let higherthanBanner = new MessageEmbed()
                        .setAuthor(`Moderation`)
                        .setDescription(`You can't ban this user cause his/her roles are higher.`)
                        .setTimestamp(message.createdAt)
                        .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                        .setColor(`#000000`)
                    return message.channel.send(higherthanBanner);
                } else if (botPotision <= mentionedPotision) {
                    let higherthanSelf = new MessageEmbed()
                        .setAuthor(`Moderation`)
                        .setDescription(`I can't ban this user cause his/her role are higher.`)
                        .setTimestamp(message.createdAt)
                        .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                        .setColor(`#000000`)
                    return message.channel.send(higherthanSelf);
                };
            };

            let cantBanSelf = new MessageEmbed()
                .setColor('#000000')
                .setTitle(`Moderation`)
                .setDescription(`You can't ban yourself.`)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()

            if (member.id === message.author) return message.channel.send(cantBanSelf);

            const reason = args.slice(1).join(' ') || 'No reason provided.';
            await member.send(`You have been banned from **${message.guild.name}** with the reason: **${reason}**.`).catch(err => console.log(`AUDIT LOG: [BAN] Oops, I was unable to contact **${member}** with their ban reason.`));
            message.delete(message.author);
            await member.ban({ reason: reason });

            /* Modlogs requests */

            let banDoc = await banModel.findOne({ guildID: message.guild.id, memberID: member.id }).catch(err => console.log(err));

            if (!banDoc) {
                banDoc = new banModel({
                    guildID: message.guild.id,
                    id: member.id,
                    reason: [reason],
                    punishment: [punishmentCode],
                    moderator: [message.author],
                    date: [Date.now()],
                });

                await banDoc.save().catch(err => console.log(err));
            } else {
                banDoc.reason.push(reason);
                banDoc.punishment.push(punishmentCode);
                banDoc.moderator.push(message.member.id);
                banDoc.date.push(Date.now());

                await banDoc.save().catch(err => console.log(err));
            };

            let banEmbed = new MessageEmbed()
                .setColor('#000000')
                .setTitle(`Moderation`)
                .setDescription(`${member.user.tag} was banned for **${reason}**.`)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
            message.channel.send(banEmbed);
        } else {
            let missingperms = new MessageEmbed()
                .setColor('#000000')
                .setTitle(`Moderation`)
                .setDescription(`You do not have permission to use the ${module.exports.config.name} command.`)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
            return message.channel.send(missingperms);
        };
    },
};