const
    { MessageEmbed } = require('discord.js'),
    RegistryModel = require('../../assets/database/registry'),
    ClanModel = require('../../assets/database/clan');

module.exports = {
    config: {
        name: 'register',
        category: 'clans',
        description: 'Register to your desired Clan.',
    },
    execute: async (message, args) => {
        let cmdUsage = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Register`)
            .setDescription(`Usage: ${message.client.prefix}${module.exports.config.name} <Clan>`)
            .setFooter(`Example: ${message.client.prefix}register Eliminaries`)
            .setTimestamp()

        let registerdone = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Register`)
            .setDescription(`Successfully registered. (Roles might take a while to show up/be given cause of how many roles we have.)`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        /* User & clan checks */

        const users = await RegistryModel.find();
        const clanname = args.slice(0).join(' ');

        if (!clanname) return message.channel.send(cmdUsage);

        const dbfind = await ClanModel.findOne({ clan: clanname });
        if (!dbfind) return message.channel.send(cmdUsage);

        const existing = users.filter((u) => u.id === message.member.id)[0];
        if (existing) {
            let alreadyregistered = new MessageEmbed()
                .setColor('#000000')
                .setTitle(`Register`)
                .setDescription(`You are already registered.`)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
            return message.channel.send(alreadyregistered);
        }
        const rUser = new RegistryModel({ clan: clanname, id: message.member.id });

        await message.member.roles.add(dbfind.roleID).catch(err => console.log(err));
        message.channel.send(registerdone);
        return rUser.save();
    },
};