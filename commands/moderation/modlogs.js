const
    { MessageEmbed } = require("discord.js"),
    WarningModel = require("../../assets/database/warning"),
    banModel = require("../../assets/database/ban"),
    muteModel = require("../../assets/database/mute"),
    kickModel = require("../../assets/database/kick"),
    unbanModel = require("../../assets/database/unban");

module.exports = {
    config: {
        name: 'modlogs',
        category: 'moderation',        
        aliases: ['ml'],
        description: `Fetches someone's warnings.`,
    },
    execute: async (message, args) => {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        const warnDoc = await WarningModel.findOne({ id: member.id, }).catch(err => console.log(err));
        const banDoc = await banModel.findOne({ id: member.id, }).catch(err => console.log(err));
        const muteDoc = await muteModel.findOne({ id: member.id, }).catch(err => console.log(err));
        const kickDoc = await kickModel.findOne({ id: member.id, }).catch(err => console.log(err));
        const unbanDoc = await unbanModel.findOne({ id: member.id, }).catch(err => console.log(err));

        const wdata = [];
        const bdata = [];
        const mdata = [];
        const kdata = [];
        const ubdata = [];

        if (!warnDoc || !warnDoc.warnings.length) {
            wdata.push(`No warnings.`);
        }
        if (!banDoc || !banDoc.reason.length) {
            bdata.push(`No bans.`);
        }
        if (!muteDoc || !muteDoc.reason.length) {
            mdata.push(`No mutes.`);
        }
        if (!kickDoc || !kickDoc.reason.length) {
            kdata.push(`No kicks.`);
        }
        if (!unbanDoc || !unbanDoc.reason.length) {
            ubdata.push(`No unbans.`);
        }

        if (warnDoc) {
            for (let i = 0; warnDoc.warnings.length > i; i++) {
                wdata.push(`**Warning ID:** ${i + 1}`);
                wdata.push(`**Reason:** ${warnDoc.warnings[i]}`);
                wdata.push(`**Punishment ID:** ${warnDoc.punishment[i]}`);
                wdata.push(`**Moderator:** ${await message.client.users.fetch(warnDoc.moderator[i]).catch(() => warnDoc.moderator[i])}`);
                wdata.push(`**Date:** ${new Date(warnDoc.date[i]).toLocaleDateString()}\n`);
            };
        };

        if (banDoc) {
            for (let i = 0; banDoc.reason.length > i; i++) {
                bdata.push(`**Reason:** ${banDoc.reason[i]}`);
                bdata.push(`**Punishment ID:** ${banDoc.punishment[i]}`);
                bdata.push(`**Moderator:** ${await message.client.users.fetch(banDoc.moderator[i]).catch(() => banDoc.moderator[i])}`);
                bdata.push(`**Date:** ${new Date(banDoc.date[i]).toLocaleDateString()}\n`);
            };
        };

        if (muteDoc) {
            for (let i = 0; muteDoc.reason.length > i; i++) {
                mdata.push(`**Reason:** ${muteDoc.reason[i]}`);
                mdata.push(`**Punishment ID:** ${muteDoc.punishment[i]}`);
                mdata.push(`**Moderator:** ${await message.client.users.fetch(muteDoc.moderator[i]).catch(() => muteDoc.moderator[i])}`);
                mdata.push(`**Date:** ${new Date(muteDoc.date[i]).toLocaleDateString()}\n`);
            };
        };

        if (kickDoc) {
            for (let i = 0; kickDoc.reason.length > i; i++) {
                kdata.push(`**Reason:** ${kickDoc.reason[i]}`);
                kdata.push(`**Punishment ID:** ${kickDoc.punishment[i]}`);
                kdata.push(`**Moderator:** ${await message.client.users.fetch(kickDoc.moderator[i]).catch(() => kickDoc.moderator[i])}`);
                kdata.push(`**Date:** ${new Date(kickDoc.date[i]).toLocaleDateString()}\n`);
            };
        };

        if (unbanDoc) {
            for (let i = 0; unbanDoc.reason.length > i; i++) {
                ubdata.push(`**Reason:** ${unbanDoc.reason[i]}`);
                ubdata.push(`**Punishment ID:** ${unbanDoc.punishment[i]}`);
                ubdata.push(`**Moderator:** ${await message.client.users.fetch(unbanDoc.moderator[i]).catch(() => unbanDoc.moderator[i])}`);
                ubdata.push(`**Date:** ${new Date(unbanDoc.date[i]).toLocaleDateString()}\n`);
            };
        };

        let modlogsembed = new MessageEmbed()
            .setTitle(`Moderation | Mod-Logs`)
            .setDescription(`${member.user.tag}'s modlogs`)
            .addField(`Warning Modlogs:`, wdata.join(`\n`))
            .addField(`Ban Modlogs:`, bdata.join(`\n`))
            .addField(`Mute Modlogs:`, mdata.join(`\n`))
            .addField(`Kick Modlogs:`, kdata.join(`\n`))
            .addField(`Unban Modlogs:`, ubdata.join(`\n`))
        return await message.channel.send(modlogsembed);
    },
};