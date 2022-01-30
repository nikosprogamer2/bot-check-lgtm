const
    { MONGODB_URI } = require('../../assets/services/config'),
    mongoose = require('mongoose');

module.exports = () => {

    mongoose.connect(
        MONGODB_URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true

        }).then(() => console.log(`BOT LOG: [DATABASE] Connected to database.`)).catch(err => console.log(`BOT LOG: [DATABASE] Oops, there was an error! ${err}`));

}