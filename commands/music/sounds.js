const fs = require("fs");

module.exports = {
    config: {
        name: "sounds",
        category: 'music',
        description: `Displays all available sounds.`,
    },
    execute: (message) => {
        fs.readdir("./assets/sounds", function (err, files) {
            if (err) return console.error("BOT LOG: [TRACK PLAYER] Unable to read directory: " + err);

            let clips = [];

            files.forEach(function (file) {
                clips.push(file.substring(0, file.length - 4));
            });

            let availableSounds = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`Available sounds: **${clips.join(", ")}**`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

            return message.channel.send(availableSounds).catch(console.error);
        })
    },
};