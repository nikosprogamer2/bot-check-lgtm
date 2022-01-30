const
    { MessageEmbed } = require("discord.js"),
    WarningModel = require("../../assets/database/warning");

module.exports = {
    config: {
        name: 'warnings',
        category: 'moderation',        
        description: `Fetches someone's warnings.`,
    },
    execute: async (message, args) => {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        const warnDoc = await WarningModel.findOne({ id: member.id }).catch(err => console.log(err));

        if (!warnDoc || !warnDoc.warnings.length) {
            let noWarns = new MessageEmbed()
                .setAuthor(`Moderation`)
                .setDescription(`${member} does not have any warnings.`)
                .setTimestamp(message.createdAt)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setColor(`#000000`)
            return message.channel.send(noWarns);
        };

        const data = [];

        for (let i = 0; warnDoc.warnings.length > i; i++) {
            data.push(`**Warning ID:** ${i + 1}`);
            data.push(`**Reason:** ${warnDoc.warnings[i]}`);
            data.push(`**Punishment ID:** ${warnDoc.punishment[i]}`);
            data.push(`**Moderator:** ${await message.client.users.fetch(warnDoc.moderator[i]).catch(() => 'Deleted User')}`);
            data.push(`**Date:** ${new Date(warnDoc.date[i]).toLocaleDateString()}\n`);
        };

        const embed = {
            color: `#000000`,
            thumbnail: {
                url: member.user.displayAvatarURL({ dynamic: true })
            },
            description: data.join('\n'),
        };
        return message.channel.send({ embed: embed });
    },
};