const
    { MessageEmbed } = require('discord.js'),
    ms = require('ms'),
    muteModel = require('../../assets/database/mute'),
    msRegex = RegExp(/(\d+(s|m|h|w))/),
    codeGenerator = require('../../assets/util/CodeGen'),
    punishmentCode = codeGenerator.generateCode(16);

module.exports = {
    config: {
        name: 'mute',
        category: 'moderation',
        description: "Mute a user.",
    },
    execute: async (message, args) => {
        const logs = message.guild.channels.cache.find(channel => channel.name === "albot-mod-system");
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let muteRole = message.guild.roles.cache.find(r => r.name == 'Muted');
        if (!muteRole) {
            muteRole = await message.guild.roles.create({ data: { name: 'Muted', color: 'GREY' } }).catch(err => console.log(err));
        };

        if (message.member.hasPermission("MANAGE_MESSAGES")) {
            let nopermsself = new MessageEmbed()
                .setAuthor(`Moderation`)
                .setDescription('I don\'t have permisison to Manage Roles and Manage Messages.')
                .setTimestamp(message.createdAt)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setColor("#000000")
            let specifyUser = new MessageEmbed()
                .setAuthor(`Moderation`)
                .setDescription(`Usage: ${message.client.prefix}${module.exports.config.name} <UserID/Mention> <Reason>`)
                .setTimestamp(message.createdAt)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setColor("#000000")
            let invalidTime = new MessageEmbed()
                .setAuthor(`Moderation`)
                .setDescription('That is a invalid number to set a mute length.')
                .setTimestamp(message.createdAt)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setColor("#000000")

            if (!member) return message.channel.send(specifyUser);
            if (!message.guild.me.hasPermission(['MANAGE_ROLES', 'MANAGE_MESSAGES'])) return message.channel.send(nopermsself);
            if (!msRegex.test(args[1])) return message.channel.send(invalidTime);

            if (member.roles.highest.position >= message.guild.me.roles.highest.position) {
                let cantMute = new MessageEmbed()
                    .setAuthor(`Moderation`)
                    .setDescription(`I can't mute this user cause he/she has a higher role than me.`)
                    .setTimestamp(message.createdAt)
                    .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                    .setColor("#000000")
                return message.channel.send(cantMute);
            } else if (muteRole.position >= message.guild.me.roles.highest.position) {
                let muteroleHigher = new MessageEmbed()
                    .setAuthor(`Moderation`)
                    .setDescription(`I can't mute this member cause the Muted role is higher than me.`)
                    .setTimestamp(message.createdAt)
                    .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                    .setColor("#000000")
                return message.channel.send(muteroleHigher);
            } else if (ms(msRegex.exec(args[1])[1]) > 2592000000) {
                let max1Month = new MessageEmbed()
                    .setAuthor(`Moderation`)
                    .setDescription(`You can't mute a member for more than a month.`)
                    .setTimestamp(message.createdAt)
                    .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                    .setColor("#000000")
                return message.channel.send(max1Month);
            } else if (!member.id === message.author.id) {
                let cantMuteSelf = new MessageEmbed()
                    .setAuthor(`Moderation`)
                    .setDescription(`You can't mute yourself.`)
                    .setTimestamp(message.createdAt)
                    .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                    .setColor(`#000000`)
                return message.channel.send(cantMuteSelf);
            }

            const noEveryone = member.roles.cache.filter(r => r.name !== '@everyone');
            const reason = args.slice(1).join(' ') || 'No reason provided.';
            const isMuted = await muteModel.findOne({ guildID: message.guild.id, memberID: member.id })

            if (isMuted) {
                let alreadyMuted = new MessageEmbed()
                    .setAuthor(`Moderation`)
                    .setDescription(`This user is already muted.`)
                    .setTimestamp(message.createdAt)
                    .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                    .setColor("#000000")
                return message.channel.send(alreadyMuted);
            };

            for (const channel of message.guild.channels.cache) {
                channel[1].updateOverwrite(muteRole, { SEND_MESSAGES: false }).catch(err => console.log(err))
            };

            await member.roles.add(muteRole.id).catch(err => console.log(err));
            message.delete(message.author);

            for (const role of noEveryone) {
                await member.roles.remove(role[0]).catch(err => console.log(err));
            };

            let muteDoc = await muteModel.findOne({ guildID: message.guild.id, memberID: member.id }).catch(err => console.log(err))

            if (!muteDoc) {
                muteDoc = new muteModel({
                    guildID: message.guild.id,
                    id: member.id,
                    length: Date.now() + ms(msRegex.exec(args[1])[1]),
                    memberRoles: noEveryone.map(r => r),
                    punishment: [punishmentCode],
                    moderator: [message.author],
                    reason: [reason],
                    date: [Date.now()],
                });

                await muteDoc.save().catch(err => console.log(err));
            } else {
                muteDoc.reason.push(reason);
                muteDoc.punishment.push(punishmentCode);
                muteDoc.moderator.push(message.member.id);
                muteDoc.date.push(Date.now());

                await muteDoc.save().catch(err => console.log(err));
            };

            if (!logs) {
                console.log(`No logs channel exists in ${message.guild.name}.`);
            }
            if (logs) {
                let muteEmbed = new MessageEmbed()
                    .setTitle(`Moderation | Audit Log`)
                    .addField("**Member**:", `${member}`)
                    .addField("**Action**:", "Mute")
                    .addField("**Reason**:", `${reason ? `${reason}` : ''}`)
                    .addField("**Length**:", `${msRegex.exec(args[1])[1]}`)
                    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                    .setTimestamp(message.createdAt)
                    .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                    .setColor("#000000")
                logs.send(muteEmbed);
            }
            member.send(`You have been muted from **${message.guild.name}** with the reason: **${reason}** and will last **${msRegex.exec(args[1])[1]}**.`);

            let muteEmbed2 = new MessageEmbed()
                .setTitle(`Moderation`)
                .setDescription(`Successfully muted ${member} for **${reason}** and will last **${msRegex.exec(args[1])[1]}**.`)
                .setTimestamp(message.createdAt)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setColor("#000000")
            message.channel.send(muteEmbed2);

            let unmuteEmbed = new MessageEmbed()
                .setTitle(`Moderation | Audit Log`)
                .setDescription(`${member} was automatically unmuted from his mute that lasted **${msRegex.exec(args[1])[1]}** with reason **${reason}**.`)
                .setTimestamp(message.createdAt)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setColor("#000000")

            setTimeout(function () {
                for (const role of muteDoc.memberRoles) {
                    member.roles.add(role).catch(err => console.log(err));
                };
                muteDoc.deleteOne()
                member.roles.remove(muteRole.id).catch(err => console.log(err))
                logs.send(unmuteEmbed);
                member.send(`You are now unmuted in **${message.guild.name}**.`);
            }, ms(msRegex.exec(args[1])[1]));

        } else {
            let missingperms = new MessageEmbed()
                .setAuthor(`Moderation`)
                .setDescription(`You don't have permission to use the mute command.`)
                .setTimestamp(message.createdAt)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setColor(`#000000`)
            return message.channel.send(missingperms);
        }
    },
};