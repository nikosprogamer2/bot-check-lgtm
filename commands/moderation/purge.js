const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
        name: 'clear',
        category: 'moderation',
        aliases: [`purge`, `clear`],
        description: "Purges messages in the channel it is ran in.",
    },
    execute: async (message, args) => {
        const logs = message.guild.channels.cache.find(channel => channel.name === "albot-mod-system");

        if (message.member.hasPermission("MANAGE_MESSAGES")) {
            var purgeamnt = args[0];
            var purgelimit = Number(purgeamnt) + 1;

            if (!purgeamnt) return message.channel.send(`Provide a valid number of messages to be purged.`);

            message.channel.messages.fetch({ limit: purgelimit }).then(messages => {
                message.channel.bulkDelete(messages);

                if (!logs) {
                    console.log(`No logs channel exists in ${message.guild.name}.`);
                }

                if (logs) {
                    let muteEmbed = new MessageEmbed()
                        .setTitle(`Moderation | Audit Log`)
                        .addField("**Member**:", `${message.member}`)
                        .addField("**Action**:", "Message Purging")
                        .addField(`**Amount**:`, `${purgelimit}`)
                        .setThumbnail(message.member.user.displayAvatarURL({ dynamic: true }))
                        .setTimestamp(message.createdAt)
                        .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                        .setColor("#000000")
                    logs.send(muteEmbed);
                }

                message.channel.send("Purged " + purgelimit + " messages.")
            }).catch(err => {
                message.channel.send("Failed to delete messages. This may be caused by attempting to delete messages that are over 2 weeks old.");
                return console.log(err);
            });
        } else {
            let missingperms = new MessageEmbed()
                .setAuthor(`Moderation`)
                .setDescription(`You don't have permission to use the purge command.`)
                .setTimestamp(message.createdAt)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setColor(`#000000`)
            return message.channel.send(missingperms);
        };
    },
};