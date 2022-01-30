const
    mongoose = require('mongoose'),
    lbmsgSchema = new mongoose.Schema({

        channelID: String,
        embedID: String,
        indexNum: String,
        lastEdited: Date,

    });

module.exports = mongoose.model('SavedMessages', lbmsgSchema);
