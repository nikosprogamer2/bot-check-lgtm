const
    mongoose = require('mongoose'),
    RegistrySchema = new mongoose.Schema({

        id: String,
        clan: String,

    });

module.exports = mongoose.model('Registry', RegistrySchema);