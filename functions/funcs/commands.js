const
    { Collection } = require('discord.js'),
    { handle } = require('./errors'),
    cooldowns = new Collection(),
    blacklistModel = require('../../assets/database/blacklist'),
    guildModel = require('../../assets/database/guild'),
    escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

module.exports = (client) => {

    client.commands = new Collection();

    client.on("message", async (message) => {
        let isBlacklisted;
        let guildPrefs = await guildModel.findOne({ GuildID: message.guild.id }).catch(err => console.log(err));

        if (!guildPrefs) {
            console.log(`BOT LOG: [DATA HANDLER] No guild data found for ${message.guild.id}. Making now.`);
            guildPrefs = new guildModel({
                GuildID: message.guild.id,
                Prefix: client.prefix,
            });
            await guildPrefs.save().catch(err => console.log(err));
            console.log(`BOT LOG: [DATA HANDLER] Successfully made data for ${message.guild.id}.`);
        };
        if (client.debug === 'true') {

            PREFIX = 'sexo!';

        } else {

            PREFIX = guildPrefs.Prefix;

        };
        if (message.author.bot || message.channel.type === "dm" || message.channel.type === "group") return;

        const blacklisted = await blacklistModel.find();
        if (blacklisted) {
            isBlacklisted = blacklisted.find(u => u.id === message.author.id)
        };
        if (isBlacklisted) return;

        const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`);
        if (!prefixRegex.test(message.content)) return;

        const [, matchedPrefix] = message.content.match(prefixRegex);

        const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.config.aliases && cmd.config.aliases.includes(commandName));
        if (!command) return;

        if (!cooldowns.has(command.config.name)) {
            cooldowns.set(command.config.name, new Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.config.name);
        const cooldownAmount = (command.config.cooldown || 1) * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime =
                timestamps.get(message.author.id) + cooldownAmount;
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.channel.send(`Please wait **${timeLeft.toFixed(1)}** more second(s) before re-using **\`${command.config.name}\`**.`);
            }
        }
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        try {
            command.execute(message, args);
        } catch (err) {
            console.log(err);
            handle.createrr(client, message.guild.id, message.content, err);
        }
    });
}