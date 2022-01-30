const
    { MessageEmbed } = require("discord.js"),
    muteModel = require('../../assets/database/mute');

module.exports = {
    config: {
        name: 'unmute',
        category: 'moderation',
        description: "Unmutes a user.",
    },
    execute: async (message, args) => {
        const logs = message.guild.channels.cache.find(channel => channel.name === "albot-mod-system");
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let muteRole = message.guild.roles.cache.find(r => r.name == 'Muted');
        if (!muteRole) {
            muteRole = await message.guild.roles.create({ data: { name: 'Muted', color: 'GREY' } }).catch(err => console.log(err));
        };

        if (message.member.hasPermission("MANAGE_MESSAGES")) {
            let specifyUser = new MessageEmbed()
                .setAuthor(`Moderation`)
                .setDescription(`Usage: ${message.client.prefix}${module.exports.config.name} <UserID/Mention> <Reason>`)
                .setTimestamp(message.createdAt)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setColor(`#000000`)

            if (!member) return message.channel.send(specifyUser);

            const muteDoc = await muteModel.findOne({ guildID: message.guild.id, memberID: member.id });

            if (member) {
                const mentionedPosition = member.roles.highest.position;
                const memberPosition = message.member.roles.highest.position;
                const SelfPosition = message.guild.me.roles.highest.potision;

                if (!member.roles.cache.some(r => ["Muted"].includes(r.name))) {
                    let targetnotMuted = new MessageEmbed()
                        .setAuthor(`Moderation`)
                        .setDescription(`This user is not muted.`)
                        .setTimestamp(message.createdAt)
                        .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                        .setColor(`#000000`)
                    return message.channel.send(targetnotMuted);
                } else if (mentionedPosition >= memberPosition) {
                    let targetroleHigher = new MessageEmbed()
                        .setAuthor(`Moderation`)
                        .setDescription(`I can't mute this user cause his/her role is higher than mine.`)
                        .setTimestamp(message.createdAt)
                        .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                        .setColor(`#000000`)
                    return message.channel.send(targetroleHigher);
                } else if (mentionedPosition >= SelfPosition) {
                    let targetroleHigherSelf = new MessageEmbed()
                        .setAuthor(`Moderation`)
                        .setDescription(`I can't mute this user cause his/her role is higher than mine.`)
                        .setTimestamp(message.createdAt)
                        .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                        .setColor(`#000000`)
                    return message.channel.send(targetroleHigherSelf);
                } else if (muteRole.position >= SelfPosition) {
                    let mutedroleHigher = new MessageEmbed()
                        .setAuthor(`Moderation`)
                        .setDescription(`I can't mute this user cause the Muted role is higher than mine.`)
                        .setTimestamp(message.createdAt)
                        .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                        .setColor(`#000000`)
                    return message.channel.send(mutedroleHigher);
                };
            };

            const reason = args.slice(1).join(' ') || 'No reason provided.';
            message.delete(message.author);
            member.roles.remove(muteRole.id).catch(err => console.log(err));

            if (muteDoc) {
                for (const role of muteDoc.memberRoles) {
                    member.roles.add(role).catch(err => console.log(err));
                };
            };

            if (!logs) {
                console.log(`No logs channel exists in ${message.guild.name}`);
            }

            if (logs) {
                let unmuteEmbed = new MessageEmbed()
                    .setTitle(`Moderation | Audit Log`)
                    .addField("**Member**:", `${member}`)
                    .addField("**Action**:", "Unmute")
                    .addField("**Reason**:", `${reason ? `${reason}` : ''}`)
                    .setTimestamp(message.createdAt)
                    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                    .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                    .setColor("#000000")
                logs.send(unmuteEmbed);
            }

            let unmuteEmbed2 = new MessageEmbed()
                .setAuthor(`Moderation`)
                .setDescription(`Successfully unmuted ${member}.`)
                .setTimestamp(message.createdAt)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setColor("#000000")
            message.channel.send(unmuteEmbed2);
        } else {
            let missingperms = new MessageEmbed()
                .setAuthor(`Moderation`)
                .setDescription(`You don't have permission to use the unmute command.`)
                .setTimestamp(message.createdAt)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setColor(`#000000`)
            return message.channel.send(missingperms);
        }
    },
};