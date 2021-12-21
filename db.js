const fs = require('fs');

var db = require('./db.json');


function updateDB() {
    fs.writeFile("./db.json", JSON.stringify(db), function (err) {
        if (err) {
            console.log(err);
        }
    });
}

module.exports.user = {
    upsert: (key, value) => {
        db.user[key] = { ...db.user[key], ...value };
        updateDB();
    }
}
module.exports.token = {
    upsert: (key, value) => {
        db.token[key] = {
            ...db.token[key],
            id: value.id,
            refresh_token: value.refresh_token,
            scope: value.scope
        };
        updateDB();
    },
    get: (key) => {
        return db.token[key];
    }
}
