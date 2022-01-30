const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
        name: "rps",
        category: 'fun',
        description: "Rock, paper, scissors!",
    },
    execute: async (message) => {
        const options = ["rock :shell:", "paper :newspaper2:", "scissors :scissors:"];
        
        const option = options[Math.floor(Math.random() * options.length)];
        const option2 = options[Math.floor(Math.random() * options.length)];

        let rpsEmbed = new MessageEmbed()
            .setTitle(`Fun | RPS`)
            .addField(`You got: ${option}!`, `** **\nI got: ${option2}!`)

        return message.channel.send(rpsEmbed);
    },
};