const
    mongoose = require('mongoose'),
    unbanSchema = new mongoose.Schema({

        guildID: String,
        id: String,
        reason: Array,
        punishment: Array,
        moderator: Array,
        date: Array,

    });

module.exports = mongoose.model('Unbans', unbanSchema);