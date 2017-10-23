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

function addTrackToPlaylist(userID, playlistID, client_token, songURI) {
  var user_id = userID;
  var playlist_id = playlistID
  var playlist_uri = "spotify:user:"+userID+":playlist:"+playlistID;

  axios({
    url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists/' + playlist_id + '/tracks',
    method: 'get',
    headers: {
      Authorization: client_token
    },
    json: true
  }).then( response => {
    console.log("HEHRHRHRHRHR",response.data.items.map((x, i) => ({
      "position": i,
      "uri": x.track.uri
    })));
    return axios({
      url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists/' + playlist_id + '/tracks',
      method: 'delete',
      headers: {
        Authorization: client_token
      },
      json: true,
      data: {
        tracks: response.data.items.map((x, i) => ({
          "position": i,
          "uri": x.track.uri
        }))
      }
    })
  }).then( response => {
    return axios({
      url: 'https://api.spotify.com/v1/users/' + userID + '/playlists/' + playlistID + '/tracks?uris=' + songURI,
      method: 'post',
      headers: {
        Authorization: client_token
      },
      json: true
    })
  }).then( response => {
    return axios({
      url: 'https://api.spotify.com/v1/me/player/next',
      method: 'post',
      headers: {
        Authorization: client_token
      },
      json: true
    })
  }).then( response => {
    return axios({
      url: 'https://api.spotify.com/v1/me/player/play',
      method: 'put',
      headers: {
        Authorization: client_token
      },
      json: true
    })
  }).then( response => {
    console.log("FINISHED");
  })
}

function SpotifyUserInitialization(client_token, res) {
  console.log("here");
  getUserInfo(client_token)
  .then( response => {
    return getUserPlaylists(client_token, response);
  })
  .then( response => {
    var data = response.data.items.filter(x => x.name === "djuke");
    if (data.length >= 1) {
      var playlist_id = data[0].id;
      var playlist_uri = data[0].uri;
      var user_id = playlist_uri.split(":")[2]
      return axios({
        url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists/' + playlist_id + '/tracks',
        method: 'get',
        headers: {
          Authorization: client_token
        },
        json: true
      }).then(response => {
        var toDelete = response.data.items.map((x, i) => x.track.uri);
        return axios({
          url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists/' + playlist_id + '/tracks',
          method: 'delete',
          headers: {
            Authorization: client_token
          },
          json: true,
          data: {
            tracks: toDelete.map((x, i) => ({
              "position": i,
              "uri": x
            }))
          }
        })
      }).then(response => {
        console.log("PLAYLIST CLEARED!");
        return axios({
          url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists/' + playlist_id + '/tracks?uris=' + default_song_uri,
          method: 'post',
          headers: {
            Authorization: client_token
          },
          json: true,
          })
        }).then( response => {
          console.log("SONG ADDED");
          console.log(playlist_uri);
          return res.json({
            user: user_id,
            playlist: playlist_id
          });
        }).catch( err =>
        console.log("error", err.response))
    } else {
      var user_id = response.data.href.split("/")[5]
      axios({
        url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists',
        method: 'post',
        headers: {
          Authorization: client_token
        },
        json: true,
        data: {
          "description": "DJuke.io, how jukeboxes should be.",
          "public": true,
          "name": "djuke"
        }
      }).then( response => {
        console.log("CREATED!");
        var playlist_id = response.data.id;
        var playlist_uri = response.data.uri;
        var user_id = playlist_uri.split(":")[2]
        return axios({
          url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists/' + playlist_id + '/tracks?uris=' + default_song_uri,
          method: 'post',
          headers: {
            Authorization: client_token
          },
          json: true,
          })
        }).then( response => {
          console.log("SONG ADDED");
          console.log(response);
          console.log(playlist_uri);
          res.json({
            user: user_id,
            playlist: playlist_id
          });
        }).catch( err =>
        console.log("error", err.response)
      )
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
