const
    mongoose = require('mongoose'),
    BanSchema = new mongoose.Schema({

        guildID: String,
        id: String,
        reason: Array,
        punishment: Array,
        moderator: Array,
        date: Array,

    });

module.exports = mongoose.model('Ban', BanSchema);