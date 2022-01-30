const
    mongoose = require('mongoose'),
    clanSchema = new mongoose.Schema({

        roleID: String,
        OwnerID: String,
        clan: String,

    });

module.exports = mongoose.model('Clans', clanSchema);