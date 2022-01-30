const blacklistModel = require('../../assets/database/blacklist');

module.exports = {
    config: {
        name: 'blacklist',
        category: 'moderation',        
        description: "Block a user from using this bot.",
    },
    execute: async (message, args) => {
        const type = args[0];
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const users = await blacklistModel.find();

        if (message.author.id === "327065865201909762" || "878225051684585482") {
            if (!type) {
                return message.channel.send("Please provide a type. Use add or remove.");
            }
            if (!member) {
                return message.channel.send("Please tag a member to blacklist.");
            }
            if (member.id === message.client.user.id) {
                return message.channel.send("Please never blacklist a bot.");
            };

            switch (type) {
                case "add":
                    {
                        const existing = users.filter((u) => u.id === member.id)[0];
                        if (existing) {
                            return message.channel.send("This user is already blacklisted.");
                        };

                        const blUser = new blacklistModel({ id: member.id, name: member.user.tag });
                        await blUser.save();

                        console.log(`BOT LOG: [BLACKLIST] ${message.author.tag} blacklisted ${member.user.tag}.`);
                        await member.send(`You have been blacklisted from using any of the AL Bot's commands.`);
                        return message.channel.send("User has been blacklisted.");
                    };
                case "remove":
                    {
                        if (users === null) {
                            return message.channel.send("User is not blacklisted.");
                        };
                        const exists = users.find((u) => u.id === member.id);
                        if (!exists) {
                            return message.channel.send("User is not blacklisted.");
                        };
                        await blacklistModel.findOneAndDelete({ id: member.id });

                        console.log(`BOT LOG: [BLACKLIST] ${message.author.tag} whitelisted ${member.user.tag}.`);
                        member.send(`You have been whitelist from using any of the AL Bot's commands, now you can use them again.`);
                        return message.channel.send("User has been whitelisted.");
                    };
                default:
                    {
                        return message.channel.send("Please provide a type. Use list, add, or remove.");
                    };
            };
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