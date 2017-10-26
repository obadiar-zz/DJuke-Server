var axios = require('axios'); // "Request" library
var request = require('request')
var default_song_uri = "spotify:track:6rPO02ozF3bM7NnOV4h6s2";

var songLength = 45;

// localStorage used to store queue between
// 1) server
// 2) SpotifyUtils
// 3) SoundCloudUtils
var localStorage = require('localStorage');

// Create Event Listner to emit events to the server.js
const EventEmitter = require('events');
var eventListener = new EventEmitter();

// A mapping of user_id to
// 1) user_id
// 2) playlist_id
// 3) token
var spotifyData = {};

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
  })
  .catch( err => console.log(err))
}
/*
  This function confirms that the user has
  entered the correct playlist. This is necessary because
  we cannot directly control what specific song the user
  is listening to. Thus, we came up with a work around
  where the user listens to a certain playlist. Since
  we have full control of the playlist (add, delete songs)
  and full control over the user's player (play, pause, next song)
  we can now control what music is played.
*/
function confirmExpectedPlaylistPlaying(client_token, user_id, playlist_id, expected_uri, res) {

  var options = {
    url: 'https://api.spotify.com/v1/me/player',
    headers: {
      Authorization: client_token
    },
    json: true
  };
  request.get(options, function (error, response, body) {
    console.log("ERR", error);
    console.log("resp", response);
    console.log("body", body);
    if(body.context !== undefined && body.context.uri === expected_uri){
        spotifyData[user_id] = {
          playlist_id,
          token: client_token,
          user_id
        }
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

// We need a way to "initiate" a playlist_id,
// this is called everytime the queue goes from
// 0 to n.
function firstSong(){
  console.log("First song called.");
  var user_id = Object.keys(spotifyData)[0];
  var playlist_id = spotifyData[user_id].playlist_id;
  var token = spotifyData[user_id].token;
  addNextAndPlay(user_id, playlist_id, token, true);
}

function addNextAndPlay(user_id, playlist_id, token, first){
  // Special case if the song is the first song since
  // it must be the get the timer chain started.
  if(first) {
    setTimeout(function(){
      var user_id = Object.keys(spotifyData)[0];
      var playlist_id = spotifyData[user_id].playlist_id;
      var token = spotifyData[user_id].token;
      addNextAndPlay(user_id, playlist_id, token, false);
    },(1)*1000)
  }else{
    var queue = JSON.parse(localStorage.getItem("SongQueue")).list;
    var nextSong = queue.pop();

    // Here checking if the queue is empty AND there is no song currently
    // playing. This is necessary to:
    // a) make sure the app won't crash on an empty queue
    // b) reset the first song variable that allows the queue to restart
    //    after empty.
    if(queue.length || nextSong){
      console.log("NEXT SONG IN QUEUE");

      var song_uri = "spotify:track:"+nextSong.id;
      localStorage.setItem("SongQueue", JSON.stringify({list: queue}));
      var queue = JSON.parse(localStorage.getItem("SongQueue")).list;
      addTrackToPlaylist(user_id, playlist_id, token, song_uri)
      console.log(queue.length, song_uri);
        setTimeout(function(){
          var user_id = Object.keys(spotifyData)[0];
          var playlist_id = spotifyData[user_id].playlist_id;
          var token = spotifyData[user_id].token;
          addNextAndPlay(user_id, playlist_id, token, false);
        },(songLength)*1000)
    } else {
      console.log("NOTHING IN QUEUE");
      eventListener.emit("spotify_done", {});
    }

    eventListener.emit("nextSong_Spotify", {
      currentlyPlaying: nextSong || "QUEUE EMPTY",
      list: queue
    });


  }
}

module.exports = {
  SpotifyUserInitialization,
  confirmExpectedPlaylistPlaying,
  getSongInfo,
  msToMinutes,
  eventListener,
  firstSong
}
