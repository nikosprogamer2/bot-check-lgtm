const { MessageEmbed } = require("discord.js");

module.exports = {
    config: {
        name: "say",
        category: 'fun',
        description: "Make the bot say something.",
    },
    execute: (message, args) => {
        if (message.member.hasPermission("ADMINISTRATOR")) {
            const text = args.join(" ");
            if (!text) return message.channel.send("Give me something to say!");

            message.delete(message.author);
            return message.channel.send(text);
        } else {
            if (!message.member.hasPermission("ADMINISTRATOR")) {
                let missingperms = new MessageEmbed()
                    .setColor('#000000')
                    .setTitle(`Fun | Information`)
                    .setDescription(`You do not have permission to use the ${module.exports.config.name} command.`)
                    .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()

                return message.channel.send(missingperms);
            }
        }
    },
};