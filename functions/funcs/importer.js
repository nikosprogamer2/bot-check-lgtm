const
    path = require("path"),
    fs = require("fs");

module.exports = (client) => {
    
    /* Import of commands */
    var walk = (dir, done) => {
        var results = [];
        fs.readdir(dir, (err, list) => {
            if (err) return done(err);
            var i = 0;
            (function next() {
                var file = list[i++];
                if (!file) return done(null, results);
                file = path.resolve(dir, file);
                fs.stat(file, function (err, stat) {
                    if (stat && stat.isDirectory()) {
                        walk(file, function (err, res) {
                            results = results.concat(res);
                            next();
                        });
                    } else {
                        results.push(file);
                        next();
                    }
                });
            })();
        });
    };

    walk('./commands/', (err, results) => {
        if (err) throw err;
        for (const file of results) {
            const cmdFileName = require(`${file}`);
            client.commands.set(cmdFileName.config.name, cmdFileName);
            //console.log(`BOT LOG: [COMMAND HANDLER] ${cmdFileName.config.name} has been loaded.`); /* Let this be here for debugging */
        }
        console.log(`BOT LOG: [COMMAND HANDLER] All commands have been loaded.`);
    });


} /* End of Module */