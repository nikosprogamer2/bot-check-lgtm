const
    { MessageEmbed } = require('discord.js'),
    WarningModel = require('../../assets/database/warning'),
    codeGenerator = require('../../assets/util/CodeGen'),
    punishmentCode = codeGenerator.generateCode(16);

module.exports = {
    config: {
        name: 'warn',
        category: 'moderation',
        description: "Warn a user.",
    },
    execute: async (message, args) => {
        const logs = message.guild.channels.cache.find(channel => channel.name === "albot-mod-system");
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (message.member.hasPermission("MANAGE_MESSAGES")) {
            let specifyUser = new MessageEmbed()
                .setAuthor(`Moderation`)
                .setDescription(`Usage: ${message.client.prefix}${module.exports.config.name} <UserID/Mention> <Reason>`)
                .setTimestamp(message.createdAt)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setColor(`#000000`)

            if (!member) return message.channel.send(specifyUser);

            if (member) {
                const mentionedPosition = member.roles.highest.position;
                const memberPosition = message.member.roles.highest.position;
                const botPosition = message.guild.me.roles.highest.position;

                if (mentionedPosition >= memberPosition) {
                    let userHigher = new MessageEmbed()
                        .setAuthor(`Moderation`)
                        .setDescription('You cannot warn this user as they have a higher role than you.')
                        .setTimestamp(message.createdAt)
                        .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                        .setColor(`#000000`)
                    return message.channel.send(userHigher);
                } else if (!member.id === message.author.id) {
                    let cantWarnSelf = new MessageEmbed()
                        .setAuthor(`Moderation`)
                        .setDescription(`You can't warn yourself.`)
                        .setTimestamp(message.createdAt)
                        .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                        .setColor(`#000000`)
                    return message.channel.send(cantWarnSelf);
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

            const reason = args.slice(1).join(' ') || 'No reason provided.';
            message.delete(message.author);

            let warnDoc = await WarningModel.findOne({ id: member.id }).catch(err => console.log(err));

            if (!warnDoc) {
                warnDoc = new WarningModel({
                    guildID: message.guild.id,
                    id: member.id,
                    warnings: [reason],
                    punishment: [punishmentCode],
                    moderator: [message.member.id],
                    date: [Date.now()],
                });

                await warnDoc.save().catch(err => console.log(err));
            } else {
                warnDoc.warnings.push(reason);
                warnDoc.punishment.push(punishmentCode);
                warnDoc.moderator.push(message.member.id);
                warnDoc.date.push(Date.now());

                await warnDoc.save().catch(err => console.log(err));
            };

            if (!logs) {
                console.log(`No logs channel exists in ${message.guild.name}.`);
            }

            if (logs) {
                let warnembed = new MessageEmbed()
                    .setTitle(`Moderation | Audit Log`)
                    .addField("**Member**", `${member}`)
                    .addField("**Action**", "Warn")
                    .addField("**Reason**", `${reason ? `${reason}` : ''}`)
                    .addField("**Warning Count**:", `${warnDoc.warnings.length}`)
                    .setTimestamp(message.createdAt)
                    .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                    .setColor(`#000000`)
                logs.send(warnembed);
            }
            member.send(`You were warned in **${message.guild.name}** for: **${reason}**.`);

            let warnEmbed2 = new MessageEmbed()
                .setAuthor(`Moderation`)
                .setDescription(`${member} has been warned successfully with the reason: ${reason}`)
                .setTimestamp(message.createdAt)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setColor(`#000000`)
            message.channel.send(warnEmbed2);
        } else {
            let missingperms = new MessageEmbed()
                .setAuthor(`Moderation`)
                .setDescription(`You don't have permission to use the warn command.`)
                .setTimestamp(message.createdAt)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setColor(`#000000`)
            return message.channel.send(missingperms);
        };
    },
};