const
    { MessageEmbed } = require('discord.js'),
    lbModel = require('../../assets/database/leaderboard');

module.exports = {
    config: {
        name: 'editlb',
        category: 'clans',
        description: 'Edits the Clan Leaderboard',
    },
    execute: async (message, args) => {
        if (message.author.id === "878225051684585482" || "745474311078281226" || "857686970732773418") {
            let cmdUsage = new MessageEmbed()
                .setColor('#000000')
                .setTitle(`Clans | Leaderboard Edit`)
                .setDescription(`${message.client.prefix}${module.exports.config.name} <Spot> <Owner ID> <Clan Name>`)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()

            /* Checks */

            const clanname = args.slice(2).join(' ');

            if (!args[0] || !args[1] || !clanname) return message.channel.send(cmdUsage);
            if (Number(args[0]) > 10 || Number(args[0]) < 0 || Number(args[0]) === 0) return message.channel.send(cmdUsage);

            let editDone = new MessageEmbed()
                .setColor('#000000')
                .setTitle(`Clans | Leaderboard Edit`)
                .setDescription(`Leaderboard has been updated successfully. Please wait for the leaderboard embed to be updated.`)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()

            const lbSpot = await lbModel.findOneAndUpdate({ leaderboardSpot: args[0], }, { leaderboardSpot: args[0], OwnerID: args[1], clan: clanname }, { upsert: true, useFindAndModify: false });

            message.channel.send(editDone);
            await lbSpot.save();
            return message.client.commands.get("lbsummon").execute(message);
        } else {
            let missingperms = new MessageEmbed()
                .setColor('#000000')
                .setTitle(`Clans | Leaderboard Edit`)
                .setDescription(`You do not have permission to use the ${module.exports.config.name} command.`)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
            return message.channel.send(missingperms);
        }
    },
};
