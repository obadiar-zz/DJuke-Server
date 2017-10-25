var axios = require('axios'); // "Request" library
var request = require('request')

var client_id = process.env.client_id; // Your client id
var client_secret = process.env.client_secret; // Your secret

var default_song_uri = "spotify:track:6rPO02ozF3bM7NnOV4h6s2";

// your application requests authorization
var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

function pauseSong(client_token) {
  return axios({
    url: 'https://api.spotify.com/v1/me/player/pause',
    method: "put",
    headers: {
      Authorization: client_token
    },
    json: true
  })
}

function playSong(client_token) {
  return axios({
    url: 'https://api.spotify.com/v1/me/player/play',
    method: "put",
    headers: {
      Authorization: client_token
    },
    json: true
  })
}

function nextSong(client_token) {
  return axios({
    url: 'https://api.spotify.com/v1/me/player/next',
    method: "post",
    headers: {
      Authorization: client_token
    },
    json: true
  })
}

function getUserInfo(client_token) {
  return axios({
      url: 'https://api.spotify.com/v1/me',
    method: 'get',
    headers: {
      Authorization: client_token
    },
    json: true
  })
}

function getUserPlaylists(client_token, response) {
  var user_id = response.data.id;
  return axios({
    url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists',
    method: 'get',
    headers: {
      Authorization: client_token
    },
    json: true
  })
}

function getUserTracks(client_token, user_id, playlist_id) {
  return axios({
    url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists/' + playlist_id + '/tracks',
    method: 'get',
    headers: {
      Authorization: client_token
    },
    json: true
  })
}

function deleteTracks(client_token, user_id, playlist_id, tracksToDelete) {
  return axios({
    url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists/' + playlist_id + '/tracks',
    method: 'delete',
    headers: {
      Authorization: client_token
    },
    json: true,
    data: {
      tracks: tracksToDelete.map((x, i) => ({
        "position": i,
        "uri": x
      }))
    }
  })
}

function addTrack(client_token, user_id, playlist_id, songURI) {
  return axios({
    url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists/' + playlist_id + '/tracks?uris=' + songURI,
    method: 'post',
    headers: {
      Authorization: client_token
    },
    json: true,
    })
}

function createPlaylist(client_token, user_id, playlist_description, playlist_name) {
  return axios({
    url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists',
    method: 'post',
    headers: {
      Authorization: client_token
    },
    json: true,
    data: {
      "description": playlist_description,
      "public": true,
      "name": playlist_name
    }
  })
}

function addTrackToPlaylist(user_id, playlist_id, client_token, songURI) {
  var playlist_uri = "spotify:user:"+user_id+":playlist:"+playlist_id;

  // 1) Get all the tracks currently in the djuke playlist
  // that need to be deleted.
  getUserTracks(client_token, user_id, playlist_id)

  // 2) Deletre all the songs found in the previous step.
  .then( response => {
    var toDelete = response.data.items.map((x, i) => x.track.uri);
    return deleteTracks(client_token, user_id, playlist_id, toDelete);
  })

  // 3) Add the new song
  .then( response => addTrack(client_token, user_id, playlist_id, songURI))

  // 4) Call next song so that the playlist plays the new song
  .then( response => nextSong(client_token))

  // 5) Make sure that the new song is playing
  .then( response => playSong(client_token))
  .catch(err => console.log(err))
}

function SpotifyUserInitialization(client_token, res) {

  // 1) Get user information
  getUserInfo(client_token)

  // 2) Get user's playlists
  .then( response => {
    return getUserPlaylists(client_token, response);
  })
  .then( response => {

    // 3) Check to see if the user already has a djuke playlist
    var data = response.data.items.filter(x => x.name === "djuke");
    if (data.length >= 1) {
      var playlist_id = data[0].id;
      var playlist_uri = data[0].uri;
      var user_id = playlist_uri.split(":")[2]

      // 4) Get the user's tracks, need to delete leftover tracks
      getUserTracks(client_token, user_id, playlist_id)
      .then(response => {
        var toDelete = response.data.items.map((x, i) => x.track.uri);

        // 5) Delete all the leftover tracks
        return deleteTracks(client_token, user_id, playlist_id, toDelete);
      }).then(response => {

        // 6) Add Despicito as the start track
        // Won't actually play this song, instead it is used
        // for the user to switch to the right playlist queue.
        return addTrack(client_token, user_id, playlist_id, default_song_uri);
        }).then( response => {

          // 7) Return the user info so that it can be passed
          // back later by the client.
          res.json({ user: user_id, playlist: playlist_id });
        }).catch( err =>
        console.log("error", err))
    } else {
      var user_id = response.data.href.split("/")[5]

      // 4) Create a new playlist called djuke
      createPlaylist(client_token, user_id, "DJuke.io, how jukeboxes should be.", "djuke")
      .then( response => {
        var playlist_id = response.data.id;
        var playlist_uri = response.data.uri;
        var user_id = playlist_uri.split(":")[2]

        // 5) Add Despicito as the start track
        // Won't actually play this song, instead it is used
        // for the user to switch to the right playlist queue.
        return addTrack(client_token, user_id, playlist_id, default_song_uri);
        })
      .then( response => {
          // 6) Return the user info so that it can be passed
          // back later by the client.
          res.json({ user: user_id, playlist: playlist_id });
        })
      .catch( err =>
        console.log("error", err)
      );
    }
  });
}

function confirmExpectedPlaylistPlaying(client_token, user_id, playlist_id, expected_uri, res) {

  var options = {
    url: 'https://api.spotify.com/v1/me/player',
    headers: {
      Authorization: client_token
    },
    json: true
  };
  request.get(options, function (error, response, body) {
    if(body.context.uri === expected_uri){
        res.json({ confirm_status:  true});
      } else{
        console.log(expected_uri );
        console.log(body.context);
      res.json({ confirm_status:  false});
    }

  });
}

function getSongInfo(client_token, song_id, cb) {
  console.log(client_token);
  var options = {
    url: "https://api.spotify.com/v1/tracks/" + song_id,
    headers: {
      Authorization: client_token
    },
    json: true
  };
  request.get(options, function (error, response, body) {
    cb({
      title: body.name,
      duration: body.duration_ms,
      artist: body.artists.map(x => x.name).join(", "),
      thumbnail: body.album.images[0].url,
      id: song_id
    });
  })
}

function msToMinutes(ms) {
  var totalSeconds = parseInt(ms / 1000);
  var seconds = totalSeconds % 60;
  var minutes = (totalSeconds - seconds) / 60;
  return '' + minutes + ':' + seconds;
}

module.exports = {

  addTrackToPlaylist,
  SpotifyUserInitialization,
  confirmExpectedPlaylistPlaying,
  getSongInfo,
  msToMinutes,
}
