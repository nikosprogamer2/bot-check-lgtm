const
    { MessageEmbed } = require("discord.js"),
    { DEFAULT_VOLUME } = require('../../assets/services/config');

module.exports = {
    config: {
        name: "sound",
        category: 'music',
        description: `Play a custom sound built into the bot!`
    },
    execute: async (message, args) => {
        const { channel } = message.member.voice;
        const queue = message.client.queue.get(message.guild.id);

        let cmdUsage = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`Usage: ${message.client.prefix}${module.exports.config.name} <name>.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        let activeQueue = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`Cannot play a clip because there is a active queue.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        let notInVC = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`You need to join a voice channel first.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        if (!args.length) return message.channel.send(cmdUsage).catch(console.error);
        if (queue) return message.channel.send(activeQueue);
        if (!channel) return message.channel.send(notInVC).catch(console.error);

        const playQueue = {
            textChannel: message.channel,
            channel,
            connection: null,
            songs: [],
            loop: false,
            volume: DEFAULT_VOLUME,
            muted: false,
            playing: true
        };

        message.client.queue.set(message.guild.id, playQueue);

        try {
            playQueue.connection = await channel.join();
            await playQueue.connection.voice.setSelfDeaf(true);
            message.channel.send(`Started playing the **${args[0]}** sound file.`);
            const dispatcher = playQueue.connection
                .play(`././assets/sounds/${args[0]}.mp3`)
                .on("finish", () => {
                    message.client.queue.delete(message.guild.id);
                    message.channel.send(`Finished playing the **${args[0]}** sound file.`);
                    channel.leave();
                })
                .on("error", err => {
                    message.client.queue.delete(message.guild.id);
                    channel.leave();
                    console.error(err);
                });
        } catch (error) {
            console.error(error);
        }
    },
};