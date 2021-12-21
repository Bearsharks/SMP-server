const { NoAuthError, InvalidAccessTokenError } = require('./errors');

const youtube = google.youtube('v3');

module.exports.getPlaylists = async function (auth) {
    try {
        return await youtube.playlists.list({ auth: auth, part: 'id', mine: true, });
    } catch (err) {
        if (err.code == 403) {
            throw new NoAuthError();
        } else if (err.code == 401) {
            throw new InvalidAccessTokenError();
        } else {
            throw new Error();
        }
    }
}

