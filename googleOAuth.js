const { google } = require('googleapis');
const { web } = require('./secret/oauth2.keys.json');
const oauth2Client = new google.auth.OAuth2(
    web.client_id,
    web.client_secret,
    web.redirect_uris
);
const db = require('./db');
module.exports = {
    getAuthorizeUrl: (scope) => {
        return oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scope
        });
    },
    getOauth2Client: (userId) => {
        let client = new google.auth.OAuth2(
            keys.client_id,
            keys.client_secret,
            keys.redirect_uris
        );
        if (userId) {
            db.token.get(key).refresh_token
        }
        return
    },
    getGoogleUser: async (tokens) => {
        let newAuthClient = new google.auth.OAuth2();    // create new auth client
        newAuthClient.setCredentials({ access_token: tokens.access_token });    // use the new auth client with the access_token
        const oauth2 = google.oauth2({
            auth: newAuthClient,
            version: 'v2'
        });
        const { data } = await oauth2.userinfo.get();    // get user info
        return data;
    },

    authenticate: async (code) => {
        const { tokens } = await oauth2Client.getToken(code);
        const userInfo = await module.exports.getGoogleUser(tokens);
        //해당유저 저장
        db.user.upsert(userInfo.id, userInfo);
        db.token.upsert(userInfo.id, tokens);

        return userInfo;
    }
}

