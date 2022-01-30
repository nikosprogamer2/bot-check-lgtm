const
    { MessageEmbed } = require('discord.js'),
    userReg = RegExp(/<@!?(\d+)>/),
    unbanModel = require('../../assets/database/unban'),
    codeGenerator = require('../../assets/util/CodeGen'),
    punishmentCode = codeGenerator.generateCode(16);

module.exports = {
    config: {
        name: 'unban',
        category: 'moderation',
        description: 'Provide a user, and the bot will unban them.',
    },
    execute: async (message, args) => {
        const logs = message.guild.channels.cache.find(channel => channel.name === "albot-mod-system");
        const userID = userReg.test(args[0]) ? userReg.exec(args[0])[1] : args[0];
        const member = await message.client.users.fetch(userID).catch(() => null);

        if (message.member.hasPermission("BAN_MEMBERS")) {
            let noselfperms = new MessageEmbed()
                .setAuthor(`Moderation`)
                .setDescription(`I don't have permissions to unban users.`)
                .setTimestamp(message.createdAt)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setColor(`#000000`)
            let specifyUser = new MessageEmbed()
                .setAuthor(`Moderation`)
                .setDescription(`Usage: ${message.client.prefix}${module.exports.config.name} <UserID/Mention> <Reason>`)
                .setTimestamp(message.createdAt)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setColor(`#000000`)

            if (!member) return message.channel.send(specifyUser);
            if (!message.guild.me.hasPermission('BAN_MEMBERS')) return message.channel.send(noselfperms);

            const allBans = await message.guild.fetchBans();
            const bannedUser = allBans.get(member.id);

            if (!bannedUser) {
                let notBan = new MessageEmbed()
                    .setAuthor(`Moderation`)
                    .setDescription(`That user is not banned.`)
                    .setTimestamp(message.createdAt)
                    .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                    .setColor(`#000000`)
                return message.channel.send(notBan);
            };

            message.delete(message.author);
            const reason = args.slice(1).join(' ') || 'No reason provided.';

            let unbanDoc = await unbanModel.findOne({ guildID: message.guild.id, memberID: member.id }).catch(err => console.log(err));

            if (!unbanDoc) {
                unbanDoc = new unbanModel({
                    guildID: message.guild.id,
                    id: member.id,
                    reason: [reason],
                    punishment: [punishmentCode],
                    moderator: [message.author],
                    date: [Date.now()],
                });

                await unbanDoc.save().catch(err => console.log(err));
            } else {
                unbanDoc.reason.push(reason);
                unbanDoc.punishment.push(punishmentCode);
                unbanDoc.moderator.push(message.member.id);
                unbanDoc.date.push(Date.now());

                await unbanDoc.save().catch(err => console.log(err))
            };

            message.guild.members.unban(member.id, [reason]).catch(err => console.log(err));

            if (!logs) {
                console.log(`No logs channel exists in ${message.guild.name}.`);
            }

            if (logs) {
                let unbanEmbed = new MessageEmbed()
                    .setTitle(`Moderation | Audit Log`)
                    .addField('**Member**:', `${member}`)
                    .addField("**Action**:", "Unban")
                    .addField("**Reason**:", `${reason ? `${reason}` : ''}`)
                    .setTimestamp(message.createdAt)
                    .setThumbnail(member.displayAvatarURL({ dynamic: true }))
                    .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                    .setColor("#000000")
                logs.send(unbanEmbed);
            }

            let unbanEmbed2 = new MessageEmbed()
                .setAuthor(`Moderation`)
                .setDescription(`Successfully unbanned ${member} for ${reason}.`)
                .setTimestamp(message.createdAt)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setColor("#000000")
            message.channel.send(unbanEmbed2);
        } else {
            let missingperms = new MessageEmbed()
                .setAuthor(`Moderation`)
                .setDescription(`You don't have permission to use the unban command.`)
                .setTimestamp(message.createdAt)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setColor(`#000000`)
            return message.channel.send(missingperms);
        }
    },
};