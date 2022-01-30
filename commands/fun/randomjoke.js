const
    { MessageEmbed } = require('discord.js'),
    joke = require("one-liner-joke").getRandomJoke;

module.exports = {
    config: {
        name: "randomjoke",
        category: 'fun',
        description: "returns a random joke",
        aliases: ["joke", "rj"],
    },
    execute: (message) => {
        let jokeEmbed = new MessageEmbed()
            .setTitle("Fun | Random Joke")
            .addField(joke({ exclude_tags: ["dirty", "racist", "marriage", "sex", "death"] }).body, "** **")
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        return message.channel.send(jokeEmbed);
    },
};