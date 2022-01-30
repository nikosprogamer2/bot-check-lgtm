const
    mongoose = require('mongoose'),
    WarningSchema = mongoose.Schema({

        guildID: String,
        id: String,
        warnings: Array,
        punishment: Array,
        moderator: Array,
        date: Array,

    });

module.exports = mongoose.model('Warning', WarningSchema);