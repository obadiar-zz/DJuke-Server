var request = require('request'); // "Request" library

var CLIENT_ID = '309011f9713d22ace9b976909ed34a80'; // Your client id

function getSongInfo(song_id, cb) {
    var options = {
        url: `http://api.soundcloud.com/tracks/${song_id}?client_id=${CLIENT_ID}`,
        json: true
    };
    request.get(options, function (error, response, body) {
        cb({
            title: body.title,
            duration: body.duration,
            artist: body.user.username,
            thumbnail: body.artwork_url,
            id: song_id
        });
    })
}

module.exports = {
    getSongInfo
}
