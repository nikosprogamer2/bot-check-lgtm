const
    { MessageEmbed } = require('discord.js'),
    kickModel = require('../../assets/database/kick'),
    codeGenerator = require('../../assets/util/CodeGen'),
    punishmentCode = codeGenerator.generateCode(16);

module.exports = {
    config: {
        name: 'kick',
        category: 'moderation',        
        description: 'Mention a user, and the bot will kick them.',
    },
    execute: async (message, args) => {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (message.member.hasPermission("KICK_MEMBERS")) {
            let specifyUser = new MessageEmbed()
                .setColor('#000000')
                .setTitle(`Moderation`)
                .setDescription(`Usage: ${message.client.prefix}${module.exports.config.name} <UserID/Mention> <Reason>`)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()

            let selfmissingperms = new MessageEmbed()
                .setColor('#000000')
                .setTitle(`Moderation`)
                .setDescription(`I don\'t have the required permissions to kick.`)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()

            if (!member) return message.channel.send(specifyUser).catch(err => message.channel.send(specifyUser));
            if (!message.guild.me.hasPermission("KICK_MEMBERS")) return message.channel.send(selfmissingperms);

            if (member) {
                const mentionedPosition = member.roles.highest.position;
                const memberPosition = message.member.roles.highest.position;
                const botPosition = message.guild.me.roles.highest.position;

                if (member.id === message.author.id) {
                    let cantBanSelf = new MessageEmbed()
                        .setAuthor(`Moderation`)
                        .setDescription(`You can't kick yourself.`)
                        .setTimestamp(message.createdAt)
                        .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                        .setColor(`#000000`)
                    return message.channel.send(cantBanSelf);
                } else if (memberPosition <= mentionedPosition) {
                    let higherthanBanner = new MessageEmbed()
                        .setAuthor(`Moderation`)
                        .setDescription(`You can't kick this user cause his/her roles are higher.`)
                        .setTimestamp(message.createdAt)
                        .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                        .setColor(`#000000`)
                    return message.channel.send(higherthanBanner);
                } else if (botPosition <= mentionedPosition) {
                    let higherthanSelf = new MessageEmbed()
                        .setAuthor(`Moderation`)
                        .setDescription(`I can't kick this user cause his/her role are higher.`)
                        .setTimestamp(message.createdAt)
                        .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                        .setColor(`#000000`)
                    return message.channel.send(higherthanSelf);
                };
            };

            let cantKickSelf = new MessageEmbed()
                .setColor('#000000')
                .setTitle(`Moderation`)
                .setDescription(`You can't kick yourself.`)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()

            if (member.id === message.author) return message.channel.send(cantKickSelf);

            const reason = args.slice(1).join(' ') || 'No reason provided.';
            await member.send(`You have been kicked from **${message.guild.name}** with the reason: **${reason}**.`).catch(err => console.log(`AUDIT LOG: [KICK] Oops, I was unable to contact **${member}** with their kick reason.`));
            message.delete(message.author);
            await member.kick({ reason: `${reason}` });

            let kickDoc = await kickModel.findOne({ guildID: message.guild.id, memberID: member.id }).catch(err => console.log(err))

            if (!kickDoc) {
                kickDoc = new kickModel({
                    guildID: message.guild.id,
                    id: member.id,
                    reason: [reason],
                    punishment: [punishmentCode],
                    moderator: [message.author],
                    date: [Date.now()],
                });

                await kickDoc.save().catch(err => console.log(err));
            } else {
                kickDoc.reason.push(reason);
                kickDoc.punishment.push(punishmentCode);
                kickDoc.moderator.push(message.member.id);
                kickDoc.date.push(Date.now());

                await kickDoc.save().catch(err => console.log(err));
            };

            let kickEmbed = new MessageEmbed()
                .setColor('#000000')
                .setTitle(`Moderation`)
                .setDescription(`${member.user.tag} was kicked for **${reason}**.`)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
            return message.channel.send(kickEmbed);
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