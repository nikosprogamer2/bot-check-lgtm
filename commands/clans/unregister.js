const
    { MessageEmbed } = require("discord.js"),
    RegistryModel = require("../../assets/database/registry"),
    ClanModel = require("../../assets/database/clan");

module.exports = {
    config: {
        name: "unregister",
        category: 'clans',
        description: "Unregister from your Clan.",
    },
    execute: async (message) => {
        const IfRegistered = await RegistryModel.findOne({ id: message.member.id });
        let registerdone = new MessageEmbed()
            .setColor("#000000")
            .setTitle(`Register`)
            .setDescription(`Successfully unregistered.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
        
        if (!IfRegistered) {
            return message.channel.send("You are not registered into a clan.");
        };
        const dbfind = await ClanModel.findOne({ clan: IfRegistered.clan });
        await RegistryModel.findOneAndDelete({ id: message.member.id });

        await message.member.roles.remove(dbfind.roleID).catch(err => console.log(err));
        return message.channel.send(registerdone);
    },
};