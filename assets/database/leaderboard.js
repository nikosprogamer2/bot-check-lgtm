const
    mongoose = require('mongoose'),
    leaderboardSchema = new mongoose.Schema({

        leaderboardSpot: Number,
        OwnerID: String,
        clan: String,

    });

module.exports = mongoose.model('Leaderboard', leaderboardSchema);