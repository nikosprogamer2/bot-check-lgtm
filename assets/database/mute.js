const
    mongoose = require('mongoose'),
    MuteSchema = mongoose.Schema({

        guildID: String,
        id: String,
        length: Date,
        memberRoles: Array,
        punishment: Array,
        moderator: Array,
        reason: Array,
        date: Array,

    });

module.exports = mongoose.model('Mute', MuteSchema);