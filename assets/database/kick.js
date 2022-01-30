const
    mongoose = require('mongoose'),
    kickSchema = new mongoose.Schema({

        guildID: String,
        id: String,
        reason: Array,
        punishment: Array,
        moderator: Array,
        date: Array,

    });

module.exports = mongoose.model('Kick', kickSchema);