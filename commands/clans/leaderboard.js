const
    { MessageEmbed } = require("discord.js"),
    lbModel = require('../../assets/database/leaderboard'),
    msgModel = require('../../assets/database/lbmsg');

module.exports = {
    config: {
        name: "lbsummon",
        category: 'clans',
        description: "Internal Leaderboard command (locked)",
    },
    execute: async (message) => {
        if (message.author.id === "878225051684585482" || "745474311078281226" || "857686970732773418") {

            const lbChannel = message.client.channels.cache.find(channel => channel.id === "926904451267170305");
            const embedmsg = await msgModel.findOne({ indexNum: `AL2` }).catch(err => console.log(err));

            const firstspot = await lbModel.findOne({ leaderboardSpot: `1` }).catch((err) => `None defined.`);
            const secondspot = await lbModel.findOne({ leaderboardSpot: `2` }).catch((err) => `None defined.`);
            const thirdspot = await lbModel.findOne({ leaderboardSpot: `3` }).catch((err) => `None defined.`);
            const fourthspot = await lbModel.findOne({ leaderboardSpot: `4` }).catch((err) => `None defined.`);
            const fifthspot = await lbModel.findOne({ leaderboardSpot: `5` }).catch((err) => `None defined.`);
            const sixthspot = await lbModel.findOne({ leaderboardSpot: `6` }).catch((err) => `None defined.`);
            const seventhspot = await lbModel.findOne({ leaderboardSpot: `7` }).catch((err) => `None defined.`);
            const eighthspot = await lbModel.findOne({ leaderboardSpot: `8` }).catch((err) => `None defined.`);
            const ninthspot = await lbModel.findOne({ leaderboardSpot: `9` }).catch((err) => `None defined.`);
            const tenthspot = await lbModel.findOne({ leaderboardSpot: `10` }).catch((err) => `None defined.`);

            let leaderboardEmbed = new MessageEmbed()
                .setColor('#000000')
                .setTitle('Clan Leaderboard')
                .setDescription(`List of the Top 10 clans competiting in Anomic League.`)
                .addFields(
                    {
                        name: `1.`,
                        value: firstspot.clan + ` (<@${firstspot.OwnerID}>)`
                    },
                    {
                        name: `2.`,
                        value: secondspot.clan + ` (<@${secondspot.OwnerID}>)`
                    },
                    {
                        name: `3.`,
                        value: thirdspot.clan + ` (<@${thirdspot.OwnerID}>)`
                    },
                    {
                        name: `4.`,
                        value: fourthspot.clan + ` (<@${fourthspot.OwnerID}>)`
                    },
                    {
                        name: `5.`,
                        value: fifthspot.clan + ` (<@${fifthspot.OwnerID}>)`
                    },
                    {
                        name: `6.`,
                        value: sixthspot.clan + ` (<@${sixthspot.OwnerID}>)`
                    },
                    {
                        name: `7.`,
                        value: seventhspot.clan + ` (<@${seventhspot.OwnerID}>)`
                    },
                    {
                        name: `8.`,
                        value: eighthspot.clan + ` (<@${eighthspot.OwnerID}>)`
                    },
                    {
                        name: `9.`,
                        value: ninthspot.clan + ` (<@${ninthspot.OwnerID}>)`
                    },
                    {
                        name: `10.`,
                        value: tenthspot.clan + ` (<@${tenthspot.OwnerID}>)`
                    }
                )
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()

            if (embedmsg) {
                const targetChannel = message.client.channels.cache.find(channel => channel.id === embedmsg.channelID);
                if (!targetChannel) {
                    var lbmessage = await lbChannel.send(leaderboardEmbed);
                    const embedIndex = new msgModel({ channelID: lbChannel.id, embedID: lbmessage.id, indexNum: `AL2`, lastEdited: Date.now() });
                    return await embedIndex.save();
                }
                targetChannel.messages.fetch(embedmsg.embedID).then(message => message.edit(leaderboardEmbed)).catch(err => console.log(err));
            }
            if (!embedmsg) {
                var lbmessage = await lbChannel.send(leaderboardEmbed);
                const embedIndex = new msgModel({ channelID: lbChannel.id, embedID: lbmessage.id, indexNum: `AL2`, lastEdited: Date.now() });
                return await embedIndex.save();
            }
        } else {
            if (!message.member.hasPermission("ADMINISTRATOR")) {
                let missingperms = new MessageEmbed()
                    .setColor('#000000')
                    .setTitle(`Clans | Leaderboard`)
                    .setDescription(`You do not have permission to use the ${module.exports.config.name} command.`)
                    .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()
                return message.channel.send(missingperms);
            }
        }
    },
};
